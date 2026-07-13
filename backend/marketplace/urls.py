from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, ItemCategoryViewSet, ItemImageViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'categories', ItemCategoryViewSet, basename='itemcategory')
router.register(r'item-images', ItemImageViewSet, basename='item-image')

urlpatterns = router.urls