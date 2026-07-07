from django.db import models
from properties.models import Campus, Property


class RoommateRequest(models.Model):
    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"
        ANY = "any", "No Preference"

    class RequestStatus(models.TextChoices):
        OPEN = "open", "Open"
        MATCHED = "matched", "Matched"
        CLOSED = "closed", "Closed"

    student_name = models.CharField(max_length=100)
    student_contact = models.CharField(max_length=100)   # internal use, not public

    campus = models.ForeignKey(Campus, on_delete=models.PROTECT, related_name="roommate_requests")
    preferred_location = models.CharField(max_length=150, blank=True)  # "Hilltop", "Odenigbo" etc

    # Optional: link to a specific lodge they already have/want to share
    linked_property = models.ForeignKey(
        Property, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="roommate_requests"
    )

    gender_preference = models.CharField(max_length=10, choices=Gender.choices, default=Gender.ANY)
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    move_in_date = models.DateField(null=True, blank=True)
    description = models.TextField(help_text="A short bio/note about the student & what they're looking for")

    status = models.CharField(max_length=20, choices=RequestStatus.choices, default=RequestStatus.OPEN)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student_name} — {self.campus.short_code}"