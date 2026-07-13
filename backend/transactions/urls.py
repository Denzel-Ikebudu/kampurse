from django.urls import path
from .views import (
    TransactionCreateView, TransactionListView,
    TransactionTransitionView, TransactionNotesUpdateView,
)

urlpatterns = [
    path('transactions/', TransactionCreateView.as_view(), name='transaction-create'),
    path('transactions/list/', TransactionListView.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/transition/', TransactionTransitionView.as_view(), name='transaction-transition'),
    path('transactions/<int:pk>/notes/', TransactionNotesUpdateView.as_view(), name='transaction-notes'),
]