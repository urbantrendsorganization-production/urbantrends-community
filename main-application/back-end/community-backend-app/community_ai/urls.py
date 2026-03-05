from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArchitectAIViewSet

# Using a router handles /queries/ and /queries/<id>/ automatically
router = DefaultRouter()
router.register(r'queries', ArchitectAIViewSet, basename='ai-query')

urlpatterns = [
    path('', include(router.urls)),
]