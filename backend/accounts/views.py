from rest_framework import generics
from accounts.permissions import IsOwner
from .models import StaffProfile
from .serializers import StaffListSerializer, StaffCreateSerializer, StaffUpdateSerializer
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import StaffLoginLog, PageView
from .serializers import StaffTokenObtainSerializer, StaffProfileSerializer, PageViewSerializer
from transactions.models import Transaction
from django.contrib.auth.models import User
from django.db.models import F


class StaffListCreateView(generics.ListCreateAPIView):
    queryset = StaffProfile.objects.select_related("user").all()
    permission_classes = [IsOwner]

    def get_serializer_class(self):
        return StaffCreateSerializer if self.request.method == "POST" else StaffListSerializer


class StaffDetailView(generics.RetrieveUpdateAPIView):
    queryset = StaffProfile.objects.select_related("user").all()
    serializer_class = StaffUpdateSerializer
    permission_classes = [IsOwner]

class StaffTokenObtainView(TokenObtainPairView):
    serializer_class = StaffTokenObtainSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            username = request.data.get("username")
            user = User.objects.filter(username=username).first()
            if user:
                ip = request.META.get("REMOTE_ADDR")
                StaffLoginLog.objects.create(user=user, ip_address=ip)
        return response


class MyProfileView(generics.RetrieveAPIView):
    serializer_class = StaffProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.staff_profile


class PageViewCreateView(generics.CreateAPIView):
    queryset = PageView.objects.all()
    serializer_class = PageViewSerializer
    permission_classes = [AllowAny]


class AnalyticsSummaryView(APIView):
    permission_classes = [IsOwner]

    def get(self, request):
        now = timezone.now()
        seven_days_ago = now - timedelta(days=7)
        thirty_days_ago = now - timedelta(days=30)

        daily_views = (
            PageView.objects.filter(visited_at__gte=seven_days_ago)
            .extra(select={"day": "date(visited_at)"})
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )

        top_properties = (
            PageView.objects.filter(visited_at__gte=thirty_days_ago, property__isnull=False)
            .values(title=F("property__title"))
            .annotate(view_count=Count("id"))
            .order_by("-view_count")[:5]
        )

        top_items = (
            PageView.objects.filter(visited_at__gte=thirty_days_ago, item__isnull=False)
            .values(title=F("item__title"))
            .annotate(view_count=Count("id"))
            .order_by("-view_count")[:5]
        )

        transaction_status_breakdown = (
            Transaction.objects.values("status").annotate(count=Count("id"))
        )

        completed_revenue = (
            Transaction.objects.filter(status=Transaction.Status.COMPLETED)
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        return Response({
            "daily_views": list(daily_views),
            "top_properties": list(top_properties),
            "top_items": list(top_items),
            "transaction_status_breakdown": list(transaction_status_breakdown),
            "completed_revenue": completed_revenue,
            "total_views_7d": PageView.objects.filter(visited_at__gte=seven_days_ago).count(),
        })