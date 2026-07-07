from rest_framework import viewsets
import django_filters
from .models import Item
from .serializers import ItemListSerializer, ItemDetailSerializer


class ItemFilter(django_filters.FilterSet):
    campus = django_filters.CharFilter(field_name="campus__short_code", lookup_expr="iexact")
    category = django_filters.CharFilter(field_name="category__slug", lookup_expr="iexact")
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Item
        fields = ["campus", "category", "condition", "status", "is_distress_sale", "is_featured"]


class ItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Item.objects.filter(status="available").prefetch_related("images").select_related("campus", "category")
    filterset_class = ItemFilter
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.action == "list":
            return ItemListSerializer
        return ItemDetailSerializer

    def get_serializer_context(self):
        return {"request": self.request}