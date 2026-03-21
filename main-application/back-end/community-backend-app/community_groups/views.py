from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Group, GroupMember, InviteLink
from .serializers import (
    GroupSerializer, GroupMemberSerializer, InviteLinkSerializer,
    CreateGroupSerializer, JoinGroupSerializer, CreateInviteSerializer
)


# ------------------ PERMISSIONS ------------------

class IsGroupMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.members.filter(user=request.user).exists()


class IsGroupModerator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        membership = obj.members.filter(user=request.user).first()
        return membership and membership.role == 'MODERATOR'


# ------------------ GROUP ------------------

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        return CreateGroupSerializer if self.action == 'create' else GroupSerializer

    def perform_create(self, serializer):
        group = serializer.save(creator=self.request.user)

        GroupMember.objects.create(
            group=group,
            user=self.request.user,
            role='MODERATOR'
        )

    def get_queryset(self):
        return Group.objects.filter(members__user=self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        group = self.get_object()

        serializer = JoinGroupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        invite_code = serializer.validated_data['invite_code']

        invite = InviteLink.objects.filter(
            code=invite_code,
            group=group,
            is_active=True
        ).first()

        if not invite or not invite.is_valid():
            return Response(
                {'error': 'Invalid or expired invite'},
                status=status.HTTP_400_BAD_REQUEST
            )

        invite.use_invite()

        GroupMember.objects.get_or_create(
            group=group,
            user=request.user,
            defaults={'role': 'MEMBER'}
        )

        return Response({'message': 'Joined group successfully'})

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        group = self.get_object()

        membership = GroupMember.objects.filter(
            group=group,
            user=request.user
        ).first()

        if not membership:
            return Response(
                {'error': 'Not a member'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if group.creator == request.user:
            return Response(
                {'error': 'Creator cannot leave group'},
                status=status.HTTP_400_BAD_REQUEST
            )

        membership.delete()
        return Response({'message': 'Left group'})


# ------------------ MEMBERS ------------------

class GroupMemberViewSet(viewsets.ModelViewSet):
    serializer_class = GroupMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group')

        if not group_id:
            return GroupMember.objects.none()

        group = get_object_or_404(Group, id=group_id)

        if not group.members.filter(user=self.request.user).exists():
            raise PermissionDenied("Not a group member")

        return GroupMember.objects.filter(group=group)

    def _check_moderator(self, group):
        membership = GroupMember.objects.filter(
            group=group,
            user=self.request.user,
            role='MODERATOR'
        ).first()

        if not membership:
            raise PermissionDenied("Moderator access required")

    @action(detail=True, methods=['post'])
    def promote(self, request, pk=None):
        membership = self.get_object()
        self._check_moderator(membership.group)

        membership.role = 'MODERATOR'
        membership.save()

        return Response({'message': 'Promoted'})

    @action(detail=True, methods=['post'])
    def demote(self, request, pk=None):
        membership = self.get_object()
        self._check_moderator(membership.group)

        if membership.group.creator == membership.user:
            return Response({'error': 'Cannot demote creator'}, status=400)

        membership.role = 'MEMBER'
        membership.save()

        return Response({'message': 'Demoted'})

    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        membership = self.get_object()
        self._check_moderator(membership.group)

        if membership.group.creator == membership.user:
            return Response({'error': 'Cannot remove creator'}, status=400)

        membership.delete()
        return Response({'message': 'Removed'})


# ------------------ INVITES ------------------

class InviteLinkViewSet(viewsets.ModelViewSet):
    serializer_class = InviteLinkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group')
        if not group_id:
            return InviteLink.objects.none()
        group = get_object_or_404(Group, id=group_id)
        if not group.members.filter(user=self.request.user).exists():
            raise PermissionDenied("Not a group member")
        return InviteLink.objects.filter(group=group)

    def get_serializer_class(self):
        return CreateInviteSerializer if self.action == 'create' else InviteLinkSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        group_id = request.query_params.get('group')
        if not group_id:
            raise PermissionDenied("Group is required in query params")

        group = get_object_or_404(Group, id=group_id)

        # Check moderator
        membership = GroupMember.objects.filter(
            group=group,
            user=request.user,
            role='MODERATOR'
        ).first()
        if not membership:
            raise PermissionDenied("Only moderators can create invites")

        invite = serializer.save(
            group=group,
            created_by=request.user
        )

        # Return the full InviteLinkSerializer with code
        return Response(
            InviteLinkSerializer(invite, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        invite = self.get_object()
        membership = GroupMember.objects.filter(
            group=invite.group,
            user=request.user,
            role='MODERATOR'
        ).first()
        if not membership:
            raise PermissionDenied("Only moderators")

        invite.is_active = False
        invite.save()
        return Response({'message': 'Invite deactivated'})