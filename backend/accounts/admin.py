from django.contrib import admin
from .models import StaffProfile, StaffLoginLog
from .models import PageView



@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "phone", "is_active_staff", "created_at")
    list_filter = ("role", "is_active_staff")


@admin.register(StaffLoginLog)
class StaffLoginLogAdmin(admin.ModelAdmin):
    list_display = ("user", "ip_address", "logged_in_at")
    list_filter = ("user",)
    readonly_fields = ("user", "ip_address", "logged_in_at")

    def has_add_permission(self, request):
        return False  # logs are created automatically, never manually

@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ("path", "property", "item", "visited_at")
    list_filter = ("visited_at",)
    readonly_fields = ("path", "property", "item", "visited_at")

    def has_add_permission(self, request):
        return False