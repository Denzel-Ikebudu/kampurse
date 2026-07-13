from django.db import models
from django.contrib.auth.models import User


class StaffProfile(models.Model):
    """
    Extends Django's built-in User with a role.
    We use Django's own User model (not a custom one from scratch) —
    it already has username, password hashing, login handling built in.
    We just attach a role to it.
    """
    class Role(models.TextChoices):
        OWNER = "owner", "Owner"
        CONTENT_MANAGER = "content_manager", "Content Manager"
        SUPPORT_SALES = "support_sales", "Support / Sales"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="staff_profile")
    role = models.CharField(max_length=20, choices=Role.choices)
    phone = models.CharField(max_length=30, blank=True)
    is_active_staff = models.BooleanField(default=True, help_text="Uncheck to revoke dashboard access without deleting the account")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.get_role_display()})"


class StaffLoginLog(models.Model):
    """ Audit trail: every successful staff login to the dashboard """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="login_logs")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    logged_in_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-logged_in_at"]

    def __str__(self):
        return f"{self.user.username} logged in at {self.logged_in_at}"

class PageView(models.Model):
    """
    One row per page visit. Lightweight by design — we're not building
    a full analytics platform, just enough to show meaningful trends
    and identify popular listings.
    """
    path = models.CharField(max_length=255, db_index=True)   # e.g. "/lodges/conducive-lodge-unn"

    # Optional: link directly to a listing when the page IS a listing detail page.
    # Lets us answer "which properties get the most views" precisely,
    # not just "this URL string got views."
    property = models.ForeignKey(
        "properties.Property", on_delete=models.SET_NULL, null=True, blank=True, related_name="page_views"
    )
    item = models.ForeignKey(
        "marketplace.Item", on_delete=models.SET_NULL, null=True, blank=True, related_name="page_views"
    )

    visited_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-visited_at"]

    def __str__(self):
        return f"{self.path} @ {self.visited_at}"