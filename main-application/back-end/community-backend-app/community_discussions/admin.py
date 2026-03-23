from django.contrib import admin
from .models import Discussion, Comment


@admin.register(Discussion)
class DiscussionAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'is_pinned', 'is_resolved', 'created_at']
    list_filter = ['category', 'is_pinned', 'is_resolved', 'created_at']
    search_fields = ['title', 'content', 'author__username']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['discussion', 'author', 'parent', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'author__username', 'discussion__title']
