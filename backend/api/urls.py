from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginAPIView, NotificationAPIView
from products.views import (
    ProductViewSet, CategoryViewSet, ReviewViewSet, 
    MediaItemViewSet, MakingVideoViewSet
)
from contacts.views import WhatsAppContactViewSet, EnquiryViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet)
router.register(r'whatsapp-contacts', WhatsAppContactViewSet)
router.register(r'enquiries', EnquiryViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'media-items', MediaItemViewSet)
router.register(r'making-videos', MakingVideoViewSet)

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='api-login'),
    path('notifications/', NotificationAPIView.as_view(), name='api-notifications'),
    path('', include(router.urls)),
]
