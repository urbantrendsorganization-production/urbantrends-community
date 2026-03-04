from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class CommunityProfile(models.Model):
    # Link to the core Django User (handles login/email)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Urban Trends Branding
    display_name = models.CharField(max_length=100, blank=True)
    slug = models.SlugField(unique=True, blank=True)
    avatar_url = models.URLField(blank=True, null=True)
    
    # Roles for the Sidebar logic (Admin, Moderator, Member)
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('MOD', 'Moderator'),
        ('MEMBER', 'Member'),
        ('ARCHITECT', 'AI Architect'), # Reserved for your AI bot profile
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='MEMBER')
    
    # Community Stats
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True) # "The City", "Remote", etc.
    website = models.URLField(blank=True)
    
    # Engagement Tracking
    reputation = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.user.username)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} ({self.role})"