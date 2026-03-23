from django.db import models
from django.contrib.auth.models import User


class Discussion(models.Model):
    CATEGORY_CHOICES = [
        ('GENERAL', 'General'),
        ('DEV_TALK', 'Dev Talk'),
        ('PROPOSAL', 'Proposal'),
        ('CODE_REVIEW', 'Code Review'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='discussions')
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES, default='GENERAL')
    is_pinned = models.BooleanField(default=False)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return f"[{self.category}] {self.title}"


class Comment(models.Model):
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='discussion_comments')
    content = models.TextField()
    # Null parent = top-level comment; non-null = threaded reply
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.author.username} on '{self.discussion.title}'"
