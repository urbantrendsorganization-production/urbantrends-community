from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileViewSet

router = DefaultRouter()
# This creates /me/ and /<slug>/ routes
router.register(r'accounts', ProfileViewSet, basename='profile')

urlpatterns = [
    # Identity & JWT
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile API (router includes the /me/ endpoint)
    path('', include(router.urls)),
]