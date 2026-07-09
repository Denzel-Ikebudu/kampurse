from django.db import models
from django.core.exceptions import ValidationError
from properties.models import Property
from marketplace.models import Item


class Transaction(models.Model):
    class Status(models.TextChoices):
        INITIATED = "initiated", "Initiated"
        AWAITING_PAYMENT = "awaiting_payment", "Awaiting Payment"
        PAYMENT_RECEIVED = "payment_received", "Payment Received"
        CONTACT_RELEASED = "contact_released", "Contact Released"
        COMPLETED = "completed", "Completed"
        REFUNDED = "refunded", "Refunded"
        CANCELLED = "cancelled", "Cancelled"

    # Renamed from "property" to "related_property" to avoid colliding
    # with Python's built-in @property decorator used below.
    related_property = models.ForeignKey(Property, on_delete=models.SET_NULL, null=True, blank=True, related_name="transactions")
    item = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True, blank=True, related_name="transactions")

    buyer_name = models.CharField(max_length=100)
    buyer_phone = models.CharField(max_length=30)
    buyer_email = models.EmailField(blank=True)

    amount = models.DecimalField(max_digits=15, decimal_places=2, help_text="Snapshot of price at time of reservation")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.INITIATED)

    admin_notes = models.TextField(blank=True, help_text="Internal notes — payment ref, WhatsApp thread, etc.")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    ALLOWED_TRANSITIONS = {
        Status.INITIATED: [Status.AWAITING_PAYMENT, Status.CANCELLED],
        Status.AWAITING_PAYMENT: [Status.PAYMENT_RECEIVED, Status.CANCELLED],
        Status.PAYMENT_RECEIVED: [Status.CONTACT_RELEASED, Status.REFUNDED],
        Status.CONTACT_RELEASED: [Status.COMPLETED, Status.REFUNDED],
        Status.COMPLETED: [],
        Status.REFUNDED: [],
        Status.CANCELLED: [],
    }

    class Meta:
        ordering = ["-created_at"]

    def clean(self):
        if not self.related_property and not self.item:
            raise ValidationError("A transaction must link to either a Property or an Item.")
        if self.related_property and self.item:
            raise ValidationError("A transaction cannot link to both a Property and an Item.")

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new:
            TransactionLog.objects.create(transaction=self, from_status="", to_status=self.status, note="Transaction created")

    def transition_to(self, new_status, note=""):
        allowed = self.ALLOWED_TRANSITIONS.get(self.status, [])
        if new_status not in allowed:
            raise ValidationError(f"Cannot move from '{self.status}' to '{new_status}'.")

        old_status = self.status
        self.status = new_status
        self.save()

        TransactionLog.objects.create(
            transaction=self, from_status=old_status, to_status=new_status, note=note
        )
        self._sync_listing_status()

    def _sync_listing_status(self):
        listing = self.related_property or self.item
        if not listing:
            return
        if self.status in [self.Status.PAYMENT_RECEIVED, self.Status.CONTACT_RELEASED]:
            listing.status = "pending"
        elif self.status == self.Status.COMPLETED:
            listing.status = "taken" if self.related_property else "sold"
        elif self.status in [self.Status.REFUNDED, self.Status.CANCELLED]:
            listing.status = "available"
        listing.save()

    @property
    def listing_title(self):
        listing = self.related_property or self.item
        return listing.title if listing else "Deleted listing"

    def __str__(self):
        return f"Transaction #{self.id} — {self.buyer_name} — {self.listing_title}"


class TransactionLog(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name="logs")
    from_status = models.CharField(max_length=20, blank=True)
    to_status = models.CharField(max_length=20)
    note = models.TextField(blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["changed_at"]

    def __str__(self):
        return f"#{self.transaction_id}: {self.from_status or '(new)'} → {self.to_status}"