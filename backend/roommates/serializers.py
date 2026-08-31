from rest_framework import serializers
from .models import RoommateRequest


class RoommateRequestSerializer(serializers.ModelSerializer):
    """
    Public-facing list/detail serializer. student_contact is now
    included and visible — roommate matching doesn't go through
    Kampurse's escrow, so students are meant to reach each other
    directly once a post is approved.
    """
    campus = serializers.CharField(source="campus.short_code", read_only=True)
    linked_property_title = serializers.CharField(
        source="linked_property.title", read_only=True, default=None
    )

    class Meta:
        model = RoommateRequest
        fields = [
            "id", "student_name", "student_contact", "campus", "preferred_location",
            "linked_property", "linked_property_title",
            "gender_preference", "budget_min", "budget_max",
            "move_in_date", "description", "status", "created_at",
        ]


class RoommateRequestPublicCreateSerializer(serializers.ModelSerializer):
    """
    What a student fills in to submit their own roommate request.
    Deliberately excludes `status` — a public submitter should never
    be able to set their own post straight to "open"; that's forced
    server-side in the view so every public post goes through approval.
    """
    class Meta:
        model = RoommateRequest
        fields = [
            "student_name", "student_contact", "campus", "preferred_location",
            "linked_property", "gender_preference", "budget_min", "budget_max",
            "move_in_date", "description",
        ]


class RoommateRequestWriteSerializer(serializers.ModelSerializer):
    """ Staff use only — full control, including status transitions. """
    class Meta:
        model = RoommateRequest
        fields = [
            "id", "student_name", "student_contact", "campus",
            "preferred_location", "linked_property", "gender_preference",
            "budget_min", "budget_max", "move_in_date", "description", "status",
        ]