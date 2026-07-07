from django.contrib import admin
from .models import ItemCategory, Item, ItemImage


class ItemImageInline(admin.TabularInline):
    model = ItemImage
    extra = 1


@admin.register(ItemCategory)
class ItemCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("title", "campus", "category", "price", "condition", "is_distress_sale", "status", "is_featured", "created_at")
    list_filter = ("campus", "category", "condition", "status", "is_distress_sale")
    search_fields = ("title", "description", "seller_name")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ItemImageInline]