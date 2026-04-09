from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from contacts.models import Enquiry, WhatsAppContact
from products.models import Review
from rest_framework.permissions import IsAuthenticated

class LoginAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'username': user.username,
                    'email': user.email
                }
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class NotificationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        new_enquiries = Enquiry.objects.filter(status='New').count()
        new_contacts = WhatsAppContact.objects.filter(status='New').count()
        new_reviews = Review.objects.filter(is_approved=False).count()
        
        return Response({
            'enquiries': new_enquiries,
            'whatsapp_contacts': new_contacts,
            'reviews': new_reviews,
            'total': new_enquiries + new_contacts + new_reviews
        })
