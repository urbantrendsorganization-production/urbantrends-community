from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Group, GroupMember

@receiver(post_save, sender=Group)
def create_creator_membership(sender, instance, created, **kwargs):
    if created:
        # Use get_or_create to avoid duplicates since perform_create also adds the creator
        GroupMember.objects.get_or_create(
            group=instance,
            user=instance.creator,
            defaults={'role': 'MODERATOR'}
        )