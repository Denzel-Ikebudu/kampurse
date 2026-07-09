from django.contrib import admin
from django.core.exceptions import ValidationError
from django.contrib import messages
from .models import Transaction, TransactionLog


class TransactionLogInline(admin.TabularInline):
    model = TransactionLog
    extra = 0
    readonly_fields = ("from_status", "to_status", "note", "changed_at")
    can_delete = False


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "buyer_name", "buyer_phone", "listing_title", "amount", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("buyer_name", "buyer_phone", "buyer_email")
    readonly_fields = ("created_at", "updated_at")
    inlines = [TransactionLogInline]
    actions = [
        "mark_awaiting_payment",
        "mark_payment_received",
        "mark_contact_released",
        "mark_completed",
        "mark_refunded",
        "mark_cancelled",
    ]

    def _bulk_transition(self, request, queryset, new_status):
        success, failed = 0, 0
        for txn in queryset:
            try:
                txn.transition_to(new_status)
                success += 1
            except ValidationError:
                failed += 1
        if success:
            self.message_user(request, f"{success} transaction(s) moved to {new_status}.")
        if failed:
            self.message_user(request, f"{failed} transaction(s) could not transition — check current status.", level=messages.WARNING)

    def mark_awaiting_payment(self, request, queryset):
        self._bulk_transition(request, queryset, Transaction.Status.AWAITING_PAYMENT)
    mark_awaiting_payment.short_description = "Mark as: Awaiting Payment"

    def mark_payment_received(self, request, queryset):
        self._bulk_transition(request, queryset, Transaction.Status.PAYMENT_RECEIVED)
    mark_payment_received.short_description = "Mark as: Payment Received"

    def mark_contact_released(self, request, queryset):
        self._bulk_transition(request, queryset, Transaction.Status.CONTACT_RELEASED)
    mark_contact_released.short_description = "Mark as: Contact Released"

    def mark_completed(self, request, queryset):
        self._bulk_transition(request, queryset, Transaction.Status.COMPLETED)
    mark_completed.short_description = "Mark as: Completed (locks refund)"

    def mark_refunded(self, request, queryset):
        self._bulk_transition(request, queryset, Transaction.Status.REFUNDED)
    mark_refunded.short_description = "Mark as: Refunded"

    def mark_cancelled(self, request, queryset):
        self._bulk_transition(request, queryset, Transaction.Status.CANCELLED)
    mark_cancelled.short_description = "Mark as: Cancelled"