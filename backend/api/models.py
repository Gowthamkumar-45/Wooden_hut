from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    BRANCH_CHOICES = [
        ('Coimbatore', 'Coimbatore'),
        ('Tanjavur', 'Tanjavur'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    # Blank/null branch means this account is not restricted to a single
    # branch (a "Super Admin" account) — matches how existing superuser
    # accounts (created via build.sh) have no profile row at all.
    branch = models.CharField(max_length=20, choices=BRANCH_CHOICES, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.branch or 'Super Admin'})"
