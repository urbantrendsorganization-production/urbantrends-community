from rest_framework import permissions


class IsAdminOrModerator(permissions.BasePermission):
    """
    Grants write access only to users whose CommunityProfile role is ADMIN or MOD.
    Read access is granted to any authenticated user.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        if hasattr(request.user, 'profile'):
            return request.user.profile.role in ('ADMIN', 'MOD')

        return False


class IsAuthorOrAdminOrModerator(permissions.BasePermission):
    """
    Object-level permission: allows authors to modify their own objects.
    Admins and Moderators can modify any object.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # The object's author may always edit/delete their own content
        if obj.author == request.user:
            return True

        # Admins and moderators may edit/delete anything
        if hasattr(request.user, 'profile'):
            return request.user.profile.role in ('ADMIN', 'MOD')

        return False
