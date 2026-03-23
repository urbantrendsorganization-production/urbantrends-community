from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Discussion, Comment
from .serializers import (
    DiscussionSerializer, CreateDiscussionSerializer,
    CommentSerializer, CreateCommentSerializer,
)
from .permissions import IsAdminOrModerator, IsAuthorOrAdminOrModerator


# ------------------ DISCUSSIONS ------------------

class DiscussionViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for discussion threads. Supports filtering by category.

    GET    /api/discussions/                      — list (optionally ?category=DEV_TALK)
    POST   /api/discussions/                      — create
    GET    /api/discussions/<id>/                 — retrieve
    PATCH  /api/discussions/<id>/                 — partial update (author or mod/admin)
    PUT    /api/discussions/<id>/                 — full update (author or mod/admin)
    DELETE /api/discussions/<id>/                 — delete (author or mod/admin)
    POST   /api/discussions/<id>/resolve/         — mark resolved (author or mod/admin)
    POST   /api/discussions/<id>/pin/             — toggle pin (mod/admin only)
    """
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrAdminOrModerator]

    def get_queryset(self):
        queryset = Discussion.objects.select_related('author__profile').annotate(
            comment_count=Count('comments')
        )

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category.upper())

        return queryset

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CreateDiscussionSerializer
        return DiscussionSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Return full read representation after creation
        output = DiscussionSerializer(serializer.instance, context={'request': request})
        return Response(output.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        # Return full read representation after update
        output = DiscussionSerializer(serializer.instance, context={'request': request})
        return Response(output.data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """
        POST /api/discussions/<id>/resolve/
        Marks the discussion as resolved. Allowed for the author or any mod/admin.
        """
        discussion = self.get_object()  # triggers object-level permission check

        discussion.is_resolved = not discussion.is_resolved
        discussion.save(update_fields=['is_resolved'])

        status_label = 'resolved' if discussion.is_resolved else 'unresolved'
        return Response({'message': f'Discussion marked as {status_label}.'})

    @action(detail=True, methods=['post'])
    def pin(self, request, pk=None):
        """
        POST /api/discussions/<id>/pin/
        Toggles the pinned state. Restricted to mod/admin roles.
        """
        if not hasattr(request.user, 'profile') or request.user.profile.role not in ('ADMIN', 'MOD'):
            raise PermissionDenied("Only moderators and admins can pin discussions.")

        discussion = get_object_or_404(Discussion, pk=pk)
        discussion.is_pinned = not discussion.is_pinned
        discussion.save(update_fields=['is_pinned'])

        status_label = 'pinned' if discussion.is_pinned else 'unpinned'
        return Response({'message': f'Discussion {status_label}.'})


# ------------------ COMMENTS ------------------

class CommentViewSet(viewsets.ModelViewSet):
    """
    CRUD for comments nested under a specific discussion.

    GET    /api/discussions/<discussion_pk>/comments/         — list
    POST   /api/discussions/<discussion_pk>/comments/         — create
    GET    /api/discussions/<discussion_pk>/comments/<id>/    — retrieve
    PATCH  /api/discussions/<discussion_pk>/comments/<id>/    — partial update (author or mod/admin)
    PUT    /api/discussions/<discussion_pk>/comments/<id>/    — full update (author or mod/admin)
    DELETE /api/discussions/<discussion_pk>/comments/<id>/    — delete (author or mod/admin)
    """
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrAdminOrModerator]

    def get_queryset(self):
        discussion_pk = self.kwargs.get('discussion_pk')
        discussion = get_object_or_404(Discussion, pk=discussion_pk)
        # Return only top-level comments; replies are nested inside each comment
        return Comment.objects.filter(
            discussion=discussion,
            parent=None
        ).select_related('author__profile').prefetch_related('replies__author__profile')

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CreateCommentSerializer
        return CommentSerializer

    def perform_create(self, serializer):
        discussion_pk = self.kwargs.get('discussion_pk')
        discussion = get_object_or_404(Discussion, pk=discussion_pk)
        serializer.save(author=self.request.user, discussion=discussion)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Return full read representation after creation
        output = CommentSerializer(serializer.instance, context={'request': request})
        return Response(output.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        # Return full read representation after update
        output = CommentSerializer(serializer.instance, context={'request': request})
        return Response(output.data)
