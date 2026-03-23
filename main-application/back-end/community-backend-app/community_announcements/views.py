from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Announcement
from .serializers import AnnouncementSerializer, CreateAnnouncementSerializer
from .permissions import IsAdminOrModerator


class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    list/retrieve — any authenticated user
    create/update/delete — ADMIN or MOD roles only

    GET    /api/announcements/           — paginated list (pinned first)
    POST   /api/announcements/           — create (admin/mod only)
    GET    /api/announcements/<id>/      — single announcement
    PATCH  /api/announcements/<id>/      — partial update (admin/mod only)
    PUT    /api/announcements/<id>/      — full update (admin/mod only)
    DELETE /api/announcements/<id>/      — delete (admin/mod only)
    """
    queryset = Announcement.objects.select_related('author__profile').all()
    permission_classes = [permissions.IsAuthenticated, IsAdminOrModerator]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CreateAnnouncementSerializer
        return AnnouncementSerializer

    def perform_create(self, serializer):
        # Inject the authenticated user as the author
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Return the full read representation after creation
        output = AnnouncementSerializer(serializer.instance, context={'request': request})
        return Response(output.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        # Return the full read representation after update
        output = AnnouncementSerializer(serializer.instance, context={'request': request})
        return Response(output.data)
