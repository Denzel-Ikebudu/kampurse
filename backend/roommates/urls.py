from rest_framework.routers import SimpleRouter
from .views import RoommateRequestViewSet

router = SimpleRouter()
router.register(r'roommates', RoommateRequestViewSet, basename='roommate')

urlpatterns = router.urls