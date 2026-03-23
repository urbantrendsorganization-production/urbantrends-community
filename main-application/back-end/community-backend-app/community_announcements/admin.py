from django.contrib import admin
from .models import Announcement


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'priority', 'author', 'is_pinned', 'created_at']
    list_filter = ['category', 'priority', 'is_pinned', 'created_at']
    search_fields = ['title', 'content', 'author__username']
