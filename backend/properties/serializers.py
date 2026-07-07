from rest_framework import serializers
from .models import Campus, Amenity, Property, PropertyImage


class CampusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campus
        fields = ["id", "name", "short_code", "slug"]


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ["id", "name", "icon_name"]


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image", "is_cover", "order"]


class PropertyListSerializer(serializers.ModelSerializer):
    campus = serializers.CharField(source="campus.short_code", read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id", "title", "slug", "campus", "location_area",
            "room_type", "initial_price", "subsequent_price",
            "bedrooms", "bathrooms", "status", "is_featured",
            "cover_image",
        ]

    def get_cover_image(self, obj):
        cover = obj.images.filter(is_cover=True).first()
        if not cover:
            cover = obj.images.first()
        request = self.context.get("request")
        if cover and request:
            return request.build_absolute_uri(cover.image.url)
        return None


class PropertyDetailSerializer(serializers.ModelSerializer):
    campus = CampusSerializer(read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            "id", "title", "slug", "campus", "location_area",
            "latitude", "longitude",
            "room_type", "initial_price", "subsequent_price",
            "bedrooms", "bathrooms", "description",
            "amenities", "images",
            "status", "is_featured", "created_at",
        ]