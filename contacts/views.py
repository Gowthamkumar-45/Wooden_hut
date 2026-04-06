from rest_framework import viewsets, permissions
from .models import WhatsAppContact, Enquiry
from .serializers import WhatsAppContactSerializer, EnquirySerializer

class WhatsAppContactViewSet(viewsets.ModelViewSet):
    queryset = WhatsAppContact.objects.all().order_by('-timestamp')
    serializer_class = WhatsAppContactSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all().order_by('-created_at')
    serializer_class = EnquirySerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
