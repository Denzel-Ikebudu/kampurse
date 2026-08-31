from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from decouple import config
from accounts.models import StaffProfile


class Command(BaseCommand):
    help = "Creates the owner account from env vars if it doesn't already exist."

    def handle(self, *args, **options):
        username = config('OWNER_USERNAME', default=None)
        password = config('OWNER_PASSWORD', default=None)
        email = config('OWNER_EMAIL', default='')

        if not username or not password:
            self.stdout.write("OWNER_USERNAME/OWNER_PASSWORD not set, skipping.")
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(f"User '{username}' already exists, skipping.")
            return

        user = User.objects.create_superuser(username=username, email=email, password=password)
        StaffProfile.objects.create(user=user, role=StaffProfile.Role.OWNER, is_active_staff=True)
        self.stdout.write(self.style.SUCCESS(f"Created owner account '{username}'."))