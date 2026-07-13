from rest_framework import viewsets, permissions
import django_filters
from .models import Item, ItemCategory, ItemImage
from .serializers import ItemListSerializer, ItemDetailSerializer, ItemWriteSerializer, ItemCategorySerializer, ItemImageSerializer
from accounts.permissions import IsContentManagerOrOwner


class ItemFilter(django_filters.FilterSet):
    campus = django_filters.CharFilter(field_name="campus__short_code", lookup_expr="iexact")
    category = django_filters.CharFilter(field_name="category__slug", lookup_expr="iexact")
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Item
        fields = ["campus", "category", "condition", "status", "is_distress_sale", "is_featured"]


class ItemViewSet(viewsets.ModelViewSet):
    filterset_class = ItemFilter
    lookup_field = "slug"

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Item.objects.all().prefetch_related("images").select_related("campus", "category")
        return Item.objects.filter(status="available").prefetch_related("images").select_related("campus", "category")

    def get_serializer_class(self):
        if self.action == "list":
            return ItemListSerializer
        if self.action in ["create", "update", "partial_update"]:
            return ItemWriteSerializer
        return ItemDetailSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [IsContentManagerOrOwner()]


class ItemCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ItemCategory.objects.all()
    serializer_class = ItemCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class ItemImageViewSet(viewsets.ModelViewSet):
    queryset = ItemImage.objects.all()
    serializer_class = ItemImageSerializer
    permission_classes = [IsContentManagerOrOwner]