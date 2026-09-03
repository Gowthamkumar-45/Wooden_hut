from django.contrib import admin
from .models import SiteVisit


@admin.register(SiteVisit)
class SiteVisitAdmin(admin.ModelAdmin):
    list_display = ('path', 'ip_hash', 'created_at')
    list_filter = ('created_at',)
    readonly_fields = ('path', 'ip_hash', 'created_at')
