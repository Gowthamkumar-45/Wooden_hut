from django.db import models
from django.contrib.auth.models import User


class SiteVisit(models.Model):
    """One row per page load of the public site, logged by a small
    tracking call the frontend fires once per app mount. Powers the
    "Total Visitors" dashboard card.

    Deliberately minimal — no cookies, no third-party script, and no raw
    IP storage: ip_hash is a salted SHA-256 digest, kept only so the
    dashboard can count *distinct* visitors rather than raw page loads.
    """
    path = models.CharField(max_length=255, blank=True)
    ip_hash = models.CharField(max_length=64, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return f"{self.path or '/'} @ {self.created_at:%Y-%m-%d %H:%M}"


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
