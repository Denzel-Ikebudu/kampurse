from rest_framework import viewsets
import django_filters
from .models import Property
from .serializers import PropertyListSerializer, PropertyDetailSerializer

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


class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Property.objects.filter(status="available").prefetch_related("images", "amenities").select_related("campus")
    filterset_class = PropertyFilter
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "list":
            return PropertyListSerializer
        return PropertyDetailSerializer

    def get_serializer_context(self):
        return {"request": self.request}