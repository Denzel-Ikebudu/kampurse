from django.contrib import admin
from .models import RoommateRequest


@admin.register(RoommateRequest)
class RoommateRequestAdmin(admin.ModelAdmin):
    list_display = ("student_name", "campus", "gender_preference", "budget_min", "budget_max", "status", "created_at")
    list_filter = ("campus", "gender_preference", "status")
    search_fields = ("student_name", "description", "preferred_location")