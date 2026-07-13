from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from .models import Transaction
from .serializers import TransactionCreateSerializer, TransactionListSerializer
from accounts.permissions import IsSupportOrOwner


class TransactionCreateView(generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionCreateSerializer
    permission_classes = [permissions.AllowAny]


class TransactionListView(generics.ListAPIView):
    queryset = Transaction.objects.all().select_related("related_property", "item")
    serializer_class = TransactionListSerializer
    permission_classes = [IsSupportOrOwner]


class TransactionTransitionView(APIView):
    """ Staff action: move a transaction to its next valid status """
    permission_classes = [IsSupportOrOwner]

    def post(self, request, pk):
        transaction = get_object_or_404(Transaction, pk=pk)
        new_status = request.data.get("status")
        note = request.data.get("note", "")

        try:
            transaction.transition_to(new_status, note=note)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=400)

        return Response(TransactionListSerializer(transaction).data)


class TransactionNotesUpdateView(APIView):
    """ Staff action: update internal notes without changing status """
    permission_classes = [IsSupportOrOwner]

    def patch(self, request, pk):
        transaction = get_object_or_404(Transaction, pk=pk)
        transaction.admin_notes = request.data.get("admin_notes", transaction.admin_notes)
        transaction.save()
        return Response(TransactionListSerializer(transaction).data)