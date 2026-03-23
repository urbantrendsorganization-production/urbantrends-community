from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Top-level router: /api/discussions/
router = DefaultRouter()
router.register(r'', views.DiscussionViewSet, basename='discussion')

# Nested router for comments: /api/discussions/<discussion_pk>/comments/
comments_router = DefaultRouter()
comments_router.register(r'comments', views.CommentViewSet, basename='discussion-comments')

urlpatterns = [
    # Standard discussion routes (/api/discussions/, /api/discussions/<pk>/, etc.)
    path('', include(router.urls)),
    # Nested comment routes: /api/discussions/<discussion_pk>/comments/
    path('<int:discussion_pk>/', include(comments_router.urls)),
]
