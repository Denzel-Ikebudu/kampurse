from rest_framework import serializers
from .models import RoommateRequest


class RoommateRequestSerializer(serializers.ModelSerializer):
    """
    Only one serializer needed here — roommate posts are simple
    enough that list and detail views can share the same shape.

    student_contact is intentionally excluded — same anti-bypass
    rule. Interested students contact YOU, you facilitate the intro.
    """
    campus = serializers.CharField(source="campus.short_code", read_only=True)
    linked_property_title = serializers.CharField(
        source="linked_property.title", read_only=True, default=None
    )

    class Meta:
        model = RoommateRequest
        fields = [
            "id", "student_name", "campus", "preferred_location",
            "linked_property", "linked_property_title",
            "gender_preference", "budget_min", "budget_max",
            "move_in_date", "description", "status", "created_at",
        ]