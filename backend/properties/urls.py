from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, CampusViewSet, AmenityViewSet, PropertyImageViewSet

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'campuses', CampusViewSet, basename='campus')
router.register(r'amenities', AmenityViewSet, basename='amenity')
router.register(r'property-images', PropertyImageViewSet, basename='property-image')

urlpatterns = router.urls