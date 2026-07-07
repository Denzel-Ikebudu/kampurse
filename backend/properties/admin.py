from django.contrib import admin
from .models import Campus, Amenity, Property, PropertyImage


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1


@admin.register(Campus)
class CampusAdmin(admin.ModelAdmin):
    list_display = ("short_code", "name", "is_active")
    prepopulated_fields = {"slug": ("short_code",)}


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ("name", "icon_name")


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("title", "campus", "room_type", "initial_price", "subsequent_price", "status", "is_featured", "created_at")
    list_filter = ("campus", "room_type", "status", "is_featured")
    search_fields = ("title", "location_area", "description")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [PropertyImageInline]