from django.db import models
from django.utils.text import slugify
from properties.models import Campus  # reuse the same Campus model — one source of truth


class ItemCategory(models.Model):
    """ e.g. Furniture, Electronics, Books, Kitchenware """
    name = models.CharField(max_length=60, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Item(models.Model):
    class Condition(models.TextChoices):
        NEW = "new", "Brand New"
        LIKE_NEW = "like_new", "Like New"
        GOOD = "good", "Good"
        FAIR = "fair", "Fair"

    class ItemStatus(models.TextChoices):
        AVAILABLE = "available", "Available"
        SOLD = "sold", "Sold"
        PENDING = "pending", "Pending Escrow"

    class DistressReason(models.TextChoices):
        RELOCATING = "relocating", "Relocating"
        GRADUATING = "graduating", "Graduating Soon"
        URGENT_CASH = "urgent_cash", "Urgent Cash Need"
        OTHER = "other", "Other"

    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    campus = models.ForeignKey(Campus, on_delete=models.PROTECT, related_name="items")
    category = models.ForeignKey(ItemCategory, on_delete=models.SET_NULL, null=True, related_name="items")

    condition = models.CharField(max_length=20, choices=Condition.choices)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    # --- Distress sale fields (all optional except the flag itself) ---
    is_distress_sale = models.BooleanField(
        default=False,
        help_text="Flag this if the seller needs to sell urgently"
    )
    distress_reason = models.CharField(
        max_length=20, choices=DistressReason.choices,
        blank=True, null=True,
        help_text="Optional — why the sale is urgent"
    )
    discount_percentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        null=True, blank=True,
        help_text="Optional — e.g. 20.00 for 20% off, shown to buyers as a badge"
    )
    # --- end distress sale fields ---

    seller_name = models.CharField(max_length=100)              # you record who's selling
    seller_contact = models.CharField(max_length=100)            # WhatsApp/phone, internal use only

    status = models.CharField(max_length=20, choices=ItemStatus.choices, default=ItemStatus.AVAILABLE)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_distress_sale", "-is_featured", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = f"{slugify(self.title)}-{self.campus.short_code.lower()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ItemImage(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="items/%Y/%m/")
    is_cover = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Image for {self.item.title}"