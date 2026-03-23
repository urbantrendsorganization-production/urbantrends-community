from django.db import models
from django.contrib.auth.models import User


class Announcement(models.Model):
    CATEGORY_CHOICES = [
        ('SYSTEM', 'System'),
        ('EVENT', 'Event'),
        ('UPDATE', 'Update'),
        ('ALERT', 'Alert'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='UPDATE')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='announcements')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return f"[{self.category}] {self.title}"
