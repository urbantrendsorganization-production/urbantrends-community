from django.contrib.auth.models import User
from rest_framework import generics, viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

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


class MemberDirectoryPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


# 2. Profile & "Me" ViewSet
class ProfileViewSet(viewsets.GenericViewSet):
    """
    Handles profile retrieval and updates.
    GET  /accounts/accounts/           — paginated member directory (search, filter, order)
    GET  /accounts/accounts/me/        — current user's profile
    PATCH/PUT /accounts/accounts/me/   — update current user's profile
    GET  /accounts/accounts/<slug>/    — public profile by slug
    """
    queryset = CommunityProfile.objects.select_related('user').all()
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['display_name', 'user__username', 'location']
    ordering_fields = ['reputation', 'created_at']
    ordering = ['-reputation']

    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        # Use the update serializer only when performing write operations
        if self.action in ['update', 'partial_update', 'me'] and self.request.method in ['PATCH', 'PUT']:
            return CommunityProfileUpdateSerializer
        return CommunityProfileSerializer

    def list(self, request):
        """
        GET /accounts/accounts/
        Paginated member directory. Supports:
          ?search=<term>          — searches display_name, username, location
          ?role=<role>            — filters by role (DEVELOPER, CREATOR, TEAM)
          ?ordering=reputation    — sort by field (prefix with - for descending)
        """
        queryset = self.filter_queryset(self.get_queryset())

        # Extra role filter (not a search field, so handled manually)
        role = request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role.upper())

        paginator = MemberDirectoryPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = CommunityProfileSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, methods=['get', 'patch', 'put'], url_path='me')
    def me(self, request):
        """
        GET /accounts/accounts/me/
        PATCH /accounts/accounts/me/
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
        GET /accounts/accounts/<slug>/
        Public view for other community members.
        """
        profile = generics.get_object_or_404(self.queryset, slug=slug)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)