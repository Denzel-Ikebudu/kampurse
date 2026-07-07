from django.db import models
from django.utils.text import slugify


class Campus(models.Model):
    name = models.CharField(max_length=100, unique=True)
    short_code = models.CharField(max_length=10, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.short_code)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.short_code


class Amenity(models.Model):
    name = models.CharField(max_length=50, unique=True)
    icon_name = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


class Property(models.Model):
    class ListingStatus(models.TextChoices):
        AVAILABLE = "available", "Available"
        TAKEN = "taken", "Taken"
        PENDING = "pending", "Pending Escrow"

    class RoomType(models.TextChoices):
        SELF_CONTAIN = "self_contain", "Self Contain"
        ROOM_PARLOUR = "room_parlour", "Room & Parlour"
        FLAT = "flat", "Flat / Apartment"
        SHARED = "shared", "Shared Room"
        SINGLE_ROOM = "single_room", "Single Room"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    campus = models.ForeignKey(Campus, on_delete=models.PROTECT, related_name="properties")
    location_area = models.CharField(max_length=150)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    room_type = models.CharField(max_length=20, choices=RoomType.choices)
    initial_price = models.DecimalField(max_digits=15, decimal_places=2)
    subsequent_price = models.DecimalField(max_digits=15, decimal_places=2)

    bedrooms = models.PositiveSmallIntegerField(default=1)
    bathrooms = models.PositiveSmallIntegerField(default=1)

    description = models.TextField()
    amenities = models.ManyToManyField(Amenity, blank=True, related_name="properties")

    status = models.CharField(max_length=20, choices=ListingStatus.choices, default=ListingStatus.AVAILABLE)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_featured", "-created_at"]
        verbose_name_plural = "Properties"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            self.slug = f"{base_slug}-{self.campus.short_code.lower()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.campus.short_code})"


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="properties/%Y/%m/")
    is_cover = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Image for {self.property.title}"