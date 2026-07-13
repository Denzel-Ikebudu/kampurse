from rest_framework import viewsets, permissions
import django_filters
from .models import Campus, Amenity, Property, PropertyImage
from .serializers import (
    PropertyListSerializer, PropertyDetailSerializer, PropertyWriteSerializer,
    CampusSerializer, AmenitySerializer, PropertyImageSerializer,
)
from accounts.permissions import IsContentManagerOrOwner


class PropertyFilter(django_filters.FilterSet):
    campus = django_filters.CharFilter(field_name="campus__short_code", lookup_expr="iexact")
    room_type = django_filters.CharFilter(field_name="room_type", lookup_expr="iexact")
    min_price = django_filters.NumberFilter(field_name="initial_price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="initial_price", lookup_expr="lte")
    bedrooms = django_filters.NumberFilter(field_name="bedrooms", lookup_expr="gte")
    amenities = django_filters.CharFilter(method="filter_amenities")

    class Meta:
        model = Property
        fields = ["campus", "room_type", "status", "is_featured"]

    def filter_amenities(self, queryset, name, value):
        amenity_names = [a.strip() for a in value.split(",")]
        for name in amenity_names:
            queryset = queryset.filter(amenities__name__iexact=name)
        return queryset


class PropertyViewSet(viewsets.ModelViewSet):
    filterset_class = PropertyFilter
    lookup_field = "slug"

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Property.objects.all().prefetch_related("images", "amenities").select_related("campus")
        return Property.objects.filter(status="available").prefetch_related("images", "amenities").select_related("campus")

    def get_serializer_class(self):
        if self.action == "list":
            return PropertyListSerializer
        if self.action in ["create", "update", "partial_update"]:
            return PropertyWriteSerializer
        return PropertyDetailSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [IsContentManagerOrOwner()]


class CampusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Campus.objects.filter(is_active=True)
    serializer_class = CampusSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class AmenityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

class PropertyImageViewSet(viewsets.ModelViewSet):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer
    permission_classes = [IsContentManagerOrOwner]