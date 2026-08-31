from rest_framework import viewsets, permissions
import django_filters
from .models import RoommateRequest
from .serializers import (
    RoommateRequestSerializer,
    RoommateRequestPublicCreateSerializer,
    RoommateRequestWriteSerializer,
)
from accounts.permissions import IsContentManagerOrOwner


class RoommateRequestFilter(django_filters.FilterSet):
    campus = django_filters.CharFilter(field_name="campus__short_code", lookup_expr="iexact")

    class Meta:
        model = RoommateRequest
        fields = ["campus", "gender_preference", "status"]


class RoommateRequestViewSet(viewsets.ModelViewSet):
    filterset_class = RoommateRequestFilter

    def get_queryset(self):
        if self.request.user.is_authenticated:
            # Staff see everything, including pending posts awaiting approval.
            return RoommateRequest.objects.all().select_related("campus", "linked_property")
        return RoommateRequest.objects.filter(status="open").select_related("campus", "linked_property")

    def get_serializer_class(self):
        if self.action == "create":
            return RoommateRequestPublicCreateSerializer
        if self.action in ["update", "partial_update"]:
            return RoommateRequestWriteSerializer
        return RoommateRequestSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve", "create"]:
            return [permissions.AllowAny()]
        return [IsContentManagerOrOwner()]

        def perform_create(self, serializer):
            serializer.save(status=RoommateRequest.RequestStatus.PENDING)