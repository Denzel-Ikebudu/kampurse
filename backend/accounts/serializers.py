from rest_framework import serializers
from django.contrib.auth.models import User
from .models import StaffProfile, PageView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class StaffProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = StaffProfile
        fields = ["username", "full_name", "role", "phone"]

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class PageViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageView
        fields = ["id", "path", "property", "item"]
        read_only_fields = ["id"]


class StaffListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="pk", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = StaffProfile
        fields = ["id", "username", "full_name", "role", "phone", "is_active_staff"]

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class StaffCreateSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=StaffProfile.Role.choices)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        return StaffProfile.objects.create(
            user=user,
            role=validated_data["role"],
            phone=validated_data.get("phone", ""),
        )


class StaffUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = ["role", "phone", "is_active_staff"]

class StaffTokenObtainSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        try:
            profile = self.user.staff_profile
        except StaffProfile.DoesNotExist:
            raise AuthenticationFailed("This account has no staff profile.")

        if not profile.is_active_staff:
            raise AuthenticationFailed("This staff account has been deactivated.")

        data["role"] = profile.role
        data["full_name"] = self.user.get_full_name() or self.user.username
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            token["role"] = user.staff_profile.role
        except StaffProfile.DoesNotExist:
            pass
        return token