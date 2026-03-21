from django.contrib import admin
from .models import Group, GroupMember, InviteLink

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'creator', 'created_at', 'is_private', 'member_count']
    list_filter = ['is_private', 'created_at']
    search_fields = ['name', 'description']

@admin.register(GroupMember)
class GroupMemberAdmin(admin.ModelAdmin):
    list_display = ['group', 'user', 'role', 'joined_at']
    list_filter = ['role', 'joined_at']
    search_fields = ['group__name', 'user__username']

@admin.register(InviteLink)
class InviteLinkAdmin(admin.ModelAdmin):
    list_display = ['group', 'code', 'created_by', 'created_at', 'expires_at', 'max_uses', 'current_uses', 'is_active']
    list_filter = ['is_active', 'created_at', 'expires_at']
    search_fields = ['group__name', 'code']
