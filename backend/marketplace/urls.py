from rest_framework.routers import SimpleRouter
from .views import ItemViewSet, ItemCategoryViewSet, ItemImageViewSet

router = SimpleRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'categories', ItemCategoryViewSet, basename='itemcategory')
router.register(r'item-images', ItemImageViewSet, basename='item-image')

urlpatterns = router.urls