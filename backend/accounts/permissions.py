from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """ Full access — only the Owner role """
    def has_permission(self, request, view):
        profile = getattr(request.user, "staff_profile", None)
        return bool(profile and profile.is_active_staff and profile.role == "owner")


class IsContentManagerOrOwner(BasePermission):
    """ Can manage Properties, Items, Roommate posts """
    def has_permission(self, request, view):
        profile = getattr(request.user, "staff_profile", None)
        return bool(
            profile and profile.is_active_staff and
            profile.role in ["owner", "content_manager"]
        )


class IsSupportOrOwner(BasePermission):
    """ Can manage Transactions (the escrow pipeline) """
    def has_permission(self, request, view):
        profile = getattr(request.user, "staff_profile", None)
        return bool(
            profile and profile.is_active_staff and
            profile.role in ["owner", "support_sales"]
        )