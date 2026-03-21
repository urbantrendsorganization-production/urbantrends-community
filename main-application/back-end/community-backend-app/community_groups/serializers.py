from rest_framework import serializers
from .models import Group, GroupMember, InviteLink
from django.contrib.auth.models import User

class GroupSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    member_count = serializers.ReadOnlyField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'creator', 'creator_username', 'created_at', 'is_private', 'max_members', 'slug', 'member_count']
        read_only_fields = ['creator', 'created_at', 'slug']

class GroupMemberSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)

    class Meta:
        model = GroupMember
        fields = ['id', 'group', 'group_name', 'user', 'user_username', 'role', 'joined_at']
        read_only_fields = ['joined_at']

class InviteLinkSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    is_valid = serializers.SerializerMethodField()

    class Meta:
        model = InviteLink
        fields = ['id', 'group', 'group_name', 'code', 'created_by_username', 'created_at', 'expires_at', 'max_uses', 'current_uses', 'is_active', 'is_valid']
        read_only_fields = ['code', 'created_at', 'current_uses']

    def get_is_valid(self, obj):
        return obj.is_valid()

class CreateGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name', 'description', 'is_private', 'max_members']

class JoinGroupSerializer(serializers.Serializer):
    invite_code = serializers.CharField(max_length=50)

class CreateInviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = InviteLink
        fields = ['expires_at', 'max_uses']