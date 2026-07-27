from rest_framework import viewsets, permissions
from .models import WhatsAppContact, Enquiry
from .serializers import WhatsAppContactSerializer, EnquirySerializer


def _branch_scoped(queryset, request):
    """Branch-restricted admin users only ever see their own branch's rows.
    Super Admins (no branch on their profile) see everything, and public
    submissions (unauthenticated 'create') are never filtered."""
    user = request.user
    if not user or not user.is_authenticated:
        return queryset
    profile = getattr(user, 'profile', None)
    branch = profile.branch if profile else None
    return queryset.filter(branch=branch) if branch else queryset


class WhatsAppContactViewSet(viewsets.ModelViewSet):
    queryset = WhatsAppContact.objects.all().order_by('-timestamp')
    serializer_class = WhatsAppContactSerializer
    pagination_class = None

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return _branch_scoped(super().get_queryset(), self.request)

class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all().order_by('-created_at')
    serializer_class = EnquirySerializer
    pagination_class = None

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return _branch_scoped(super().get_queryset(), self.request)
