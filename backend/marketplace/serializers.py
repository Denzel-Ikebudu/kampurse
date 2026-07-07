from rest_framework import serializers
from .models import ItemCategory, Item, ItemImage


class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = ["id", "name", "slug"]


class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ["id", "image", "is_cover", "order"]


class ItemListSerializer(serializers.ModelSerializer):
    """ Lightweight — used for the marketplace browse/grid page """
    campus = serializers.CharField(source="campus.short_code", read_only=True)
    category = serializers.CharField(source="category.name", read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = [
            "id", "title", "slug", "campus", "category",
            "condition", "price",
            "is_distress_sale", "discount_percentage",
            "status", "is_featured",
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


class ItemDetailSerializer(serializers.ModelSerializer):
    """
    Full detail page. Notice: seller_name and seller_contact are
    NOT included here — same anti-bypass rule as properties.
    You (admin) remain the only point of contact for a buyer.
    """
    campus = serializers.StringRelatedField()
    category = ItemCategorySerializer(read_only=True)
    images = ItemImageSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = [
            "id", "title", "slug", "campus", "category",
            "condition", "price", "description",
            "is_distress_sale", "distress_reason", "discount_percentage",
            "images", "status", "is_featured", "created_at",
        ]