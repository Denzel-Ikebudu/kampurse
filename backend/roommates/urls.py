from rest_framework.routers import DefaultRouter
from .views import RoommateRequestViewSet

router = DefaultRouter()
router.register(r'roommates', RoommateRequestViewSet, basename='roommate')

urlpatterns = router.urls