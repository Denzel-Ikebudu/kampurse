from rest_framework import viewsets, permissions
import django_filters
from .models import RoommateRequest
from .serializers import RoommateRequestSerializer
from accounts.permissions import IsContentManagerOrOwner


class RoommateRequestFilter(django_filters.FilterSet):
    campus = django_filters.CharFilter(field_name="campus__short_code", lookup_expr="iexact")

    class Meta:
        model = RoommateRequest
        fields = ["campus", "gender_preference", "status"]


class RoommateRequestViewSet(viewsets.ModelViewSet):
    filterset_class = RoommateRequestFilter
    serializer_class = RoommateRequestSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RoommateRequest.objects.all().select_related("campus", "linked_property")
        return RoommateRequest.objects.filter(status="open").select_related("campus", "linked_property")

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [IsContentManagerOrOwner()]