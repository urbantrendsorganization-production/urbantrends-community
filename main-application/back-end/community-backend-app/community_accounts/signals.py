from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import CommunityProfile

@receiver(post_save, sender=User)
def manage_community_profile(sender, instance, created, **kwargs):
    """
    If a User is created, create a Profile.
    If a User is saved, save the Profile.
    """
    if created:
        CommunityProfile.objects.create(user=instance)
    else:
        # This handles cases where the user exists but profile needs saving
        if hasattr(instance, 'profile'):
            instance.profile.save()