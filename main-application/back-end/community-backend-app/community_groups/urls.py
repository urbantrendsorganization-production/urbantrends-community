from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'groups', views.GroupViewSet)
router.register(r'members', views.GroupMemberViewSet, basename='group-members')
router.register(r'invites', views.InviteLinkViewSet, basename='group-invites')

urlpatterns = [
    path('', include(router.urls)),
]