from rest_framework import generics
from .models import Transaction
from .serializers import TransactionCreateSerializer


class TransactionCreateView(generics.CreateAPIView):
    """
    Public-facing endpoint: students can CREATE a reservation request,
    but cannot list, view, or edit transactions through this API —
    that only happens in Django admin, by you.
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionCreateSerializer