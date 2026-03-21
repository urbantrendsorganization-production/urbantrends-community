from django.test import TestCase
from django.contrib.auth.models import User
from .models import Group, GroupMember, InviteLink

class GroupTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.group = Group.objects.create(name='Test Group', creator=self.user)

    def test_group_creation(self):
        self.assertEqual(self.group.name, 'Test Group')
        self.assertEqual(self.group.creator, self.user)
        self.assertTrue(GroupMember.objects.filter(group=self.group, user=self.user, role='MODERATOR').exists())

    def test_invite_link_creation(self):
        invite = InviteLink.objects.create(group=self.group, created_by=self.user)
        self.assertTrue(invite.is_valid())
        self.assertEqual(invite.current_uses, 0)
