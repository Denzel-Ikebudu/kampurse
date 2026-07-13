from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    StaffTokenObtainView, MyProfileView, PageViewCreateView,
    AnalyticsSummaryView, StaffListCreateView, StaffDetailView,
)

urlpatterns = [
    path('auth/login/', StaffTokenObtainView.as_view(), name='staff-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/me/', MyProfileView.as_view(), name='my-profile'),
    path('analytics/track/', PageViewCreateView.as_view(), name='track-view'),
    path('analytics/summary/', AnalyticsSummaryView.as_view(), name='analytics-summary'),
    path('staff/', StaffListCreateView.as_view(), name='staff-list-create'),
    path('staff/<int:pk>/', StaffDetailView.as_view(), name='staff-detail'),
]