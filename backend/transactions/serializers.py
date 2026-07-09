from rest_framework import serializers
from .models import Transaction


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["id", "related_property", "item", "buyer_name", "buyer_phone", "buyer_email", "amount"]
        read_only_fields = ["id"]

    def validate(self, data):
        if not data.get("related_property") and not data.get("item"):
            raise serializers.ValidationError("Must link to either a property or an item.")
        if data.get("related_property") and data.get("item"):
            raise serializers.ValidationError("Cannot link to both a property and an item.")
        return data