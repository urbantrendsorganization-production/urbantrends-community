from django.db import models
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.utils import timezone
from datetime import timedelta
import uuid

def generate_invite_code():
    return get_random_string(
        10,
        allowed_chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    )


class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups')
    created_at = models.DateTimeField(auto_now_add=True)
    is_private = models.BooleanField(default=False)
    max_members = models.PositiveIntegerField(default=100)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
            # Ensure uniqueness
            original_slug = self.slug
            counter = 1
            while Group.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def member_count(self):
        return self.members.count()

class GroupMember(models.Model):
    ROLE_CHOICES = [
        ('MEMBER', 'Member'),
        ('MODERATOR', 'Moderator'),
    ]

    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_memberships')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='MEMBER')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('group', 'user')

    def __str__(self):
        return f"{self.user.username} in {self.group.name} ({self.role})"
    
class InviteLink(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='invite_links')
    code = models.CharField(max_length=20, unique=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    max_uses = models.PositiveIntegerField(null=True, blank=True)
    current_uses = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        # Generate code safely
        if not self.code:
            while True:
                code = generate_invite_code()
                if not InviteLink.objects.filter(code=code).exists():
                    self.code = code
                    break

        # Default expiry
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=7)

        super().save(*args, **kwargs)

    def is_valid(self):
        now = timezone.now()

        if not self.is_active:
            return False

        if self.expires_at and now > self.expires_at:
            return False

        if self.max_uses is not None and self.current_uses >= self.max_uses:
            return False

        return True

    def use_invite(self):
        if not self.is_valid():
            return False

        self.current_uses += 1
        self.save(update_fields=['current_uses'])
        return True

    def __str__(self):
        return f"{self.code} → {self.group.name}"


