from datetime import timedelta

from django.db.models import Count
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Discussion, Comment
from .serializers import DiscussionSerializer
from community_announcements.models import Announcement
from community_announcements.serializers import AnnouncementSerializer


class TrendingView(APIView):
    """
    GET /api/trending/

    Returns a single JSON object with three keys:
      - trending_discussions  : most commented discussions in the last 7 days (top 5)
      - active_members        : members with the most comments in the last 7 days (top 5)
      - recent_announcements  : last 3 announcements regardless of date
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        week_ago = timezone.now() - timedelta(days=7)

        # -- Most commented discussions (last 7 days) --
        trending_discussions = (
            Discussion.objects
            .filter(created_at__gte=week_ago)
            .select_related('author__profile')
            .annotate(comment_count=Count('comments'))
            .order_by('-comment_count')[:5]
        )

        # -- Most active members by comment count (last 7 days) --
        active_members_qs = (
            Comment.objects
            .filter(created_at__gte=week_ago)
            .values(
                'author__id',
                'author__username',
            )
            .annotate(comment_count=Count('id'))
            .order_by('-comment_count')[:5]
        )

        active_members = [
            {
                'user_id': entry['author__id'],
                'username': entry['author__username'],
                'comment_count': entry['comment_count'],
            }
            for entry in active_members_qs
        ]

        # -- Recent announcements (last 3) --
        recent_announcements = (
            Announcement.objects
            .select_related('author__profile')
            .order_by('-created_at')[:3]
        )

        return Response({
            'trending_discussions': DiscussionSerializer(
                trending_discussions,
                many=True,
                context={'request': request}
            ).data,
            'active_members': active_members,
            'recent_announcements': AnnouncementSerializer(
                recent_announcements,
                many=True,
                context={'request': request}
            ).data,
        })
