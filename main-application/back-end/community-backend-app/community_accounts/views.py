from django.contrib.auth.models import User
from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import CommunityProfile
from .serializers import (
    RegisterSerializer, 
    CommunityProfileSerializer, 
    CommunityProfileUpdateSerializer
)

# 1. Registration View
class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    Handles new user creation and triggers the profile signal.
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

# 2. Profile & "Me" ViewSet
class ProfileViewSet(viewsets.GenericViewSet):
    """
    Handles profile retrieval and updates.
    """
    queryset = CommunityProfile.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

    def get_serializer_class(self):
        # Use the update serializer only when performing write operations
        if self.action in ['update', 'partial_update', 'me'] and self.request.method in ['PATCH', 'PUT']:
            return CommunityProfileUpdateSerializer
        return CommunityProfileSerializer

    @action(detail=False, methods=['get', 'patch', 'put'], url_path='me')
    def me(self, request):
        """
        GET /api/accounts/me/
        PATCH /api/accounts/me/
        The primary endpoint for your React Sidebar to get the logged-in user's info.
        """
        profile = request.user.profile
        
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        
        # Handle Profile/User Updates
        serializer = CommunityProfileUpdateSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def retrieve(self, request, slug=None):
        """
        GET /api/accounts/profile/<slug>/
        Public view for other community members.
        """
        profile = generics.get_object_or_404(self.queryset, slug=slug)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)