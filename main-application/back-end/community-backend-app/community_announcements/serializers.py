from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Announcement


class AnnouncementAuthorSerializer(serializers.ModelSerializer):
    """Nested author info embedded in announcement reads"""
    display_name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'avatar_url']

    def get_display_name(self, obj):
        # Pulls from CommunityProfile if it exists
        if hasattr(obj, 'profile'):
            return obj.profile.display_name or obj.username
        return obj.username

    def get_avatar_url(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.avatar_url
        return None


class AnnouncementSerializer(serializers.ModelSerializer):
    """Read serializer — includes nested author info"""
    author = AnnouncementAuthorSerializer(read_only=True)

    class Meta:
        model = Announcement
        fields = [
            'id',
            'title',
            'content',
            'category',
            'author',
            'priority',
            'is_pinned',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class CreateAnnouncementSerializer(serializers.ModelSerializer):
    """Write serializer — author is injected from request in the view"""

    class Meta:
        model = Announcement
        fields = ['title', 'content', 'category', 'priority', 'is_pinned']
