from rest_framework import permissions


class IsAdminOrModerator(permissions.BasePermission):
    """
    Grants write access only to users whose CommunityProfile role is ADMIN or MOD.
    Read access is granted to any authenticated user.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Safe methods are open to all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write methods require ADMIN or MOD role
        if hasattr(request.user, 'profile'):
            return request.user.profile.role in ('ADMIN', 'MOD')

        return False
