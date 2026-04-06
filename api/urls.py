from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginAPIView
from products.views import ProductViewSet, CategoryViewSet
from contacts.views import WhatsAppContactViewSet, EnquiryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'whatsapp-contacts', WhatsAppContactViewSet)
router.register(r'enquiries', EnquiryViewSet)

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='api-login'),
    path('', include(router.urls)),
]
