from rest_framework import viewsets
import django_filters
from .models import RoommateRequest
from .serializers import RoommateRequestSerializer


class RoommateRequestFilter(django_filters.FilterSet):
    campus = django_filters.CharFilter(field_name="campus__short_code", lookup_expr="iexact")

    class Meta:
        model = RoommateRequest
        fields = ["campus", "gender_preference", "status"]


class RoommateRequestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RoommateRequest.objects.filter(status="open").select_related("campus", "linked_property")
    filterset_class = RoommateRequestFilter
    serializer_class = RoommateRequestSerializer