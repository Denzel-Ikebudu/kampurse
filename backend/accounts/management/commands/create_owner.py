from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from decouple import config
from accounts.models import StaffProfile


class Command(BaseCommand):
    help = "Creates or resets the owner account from env vars."

    def handle(self, *args, **options):
        username = config('OWNER_USERNAME', default=None)
        password = config('OWNER_PASSWORD', default=None)
        email = config('OWNER_EMAIL', default='')

        if not username or not password:
            self.stdout.write("OWNER_USERNAME/OWNER_PASSWORD not set, skipping.")
            return

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email, "is_superuser": True, "is_staff": True},
        )
        user.set_password(password)
        user.save()

        StaffProfile.objects.get_or_create(
            user=user,
            defaults={"role": StaffProfile.Role.OWNER, "is_active_staff": True},
        )

        action = "Created" if created else "Password reset for"
        self.stdout.write(self.style.SUCCESS(f"{action} owner account '{username}'."))