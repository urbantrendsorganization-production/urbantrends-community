from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Discussion, Comment


class DiscussionAuthorSerializer(serializers.ModelSerializer):
    """Lightweight author info embedded in discussion/comment reads"""
    display_name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'avatar_url']

    def get_display_name(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.display_name or obj.username
        return obj.username

    def get_avatar_url(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.avatar_url
        return None


class CommentSerializer(serializers.ModelSerializer):
    """Read serializer — includes nested author info and one level of replies"""
    author = DiscussionAuthorSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'discussion',
            'author',
            'content',
            'parent',
            'replies',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_replies(self, obj):
        # Only serialize direct children to avoid infinite recursion
        children = obj.replies.select_related('author__profile').all()
        return CommentSerializer(children, many=True, context=self.context).data


class CreateCommentSerializer(serializers.ModelSerializer):
    """Write serializer — discussion and author are injected in the view"""

    class Meta:
        model = Comment
        fields = ['content', 'parent']


class DiscussionSerializer(serializers.ModelSerializer):
    """Read serializer — includes nested author info and comment_count annotation"""
    author = DiscussionAuthorSerializer(read_only=True)
    comment_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Discussion
        fields = [
            'id',
            'title',
            'content',
            'author',
            'category',
            'is_pinned',
            'is_resolved',
            'comment_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class CreateDiscussionSerializer(serializers.ModelSerializer):
    """Write serializer — author is injected from request in the view"""

    class Meta:
        model = Discussion
        fields = ['title', 'content', 'category']
