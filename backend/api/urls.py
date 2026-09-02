from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import LoginAPIView, NotificationAPIView, AdminUserViewSet
from products.views import (
    ProductViewSet, CategoryViewSet, SubCategoryViewSet, ReviewViewSet,
    MediaItemViewSet, MakingVideoViewSet
)
from contacts.views import WhatsAppContactViewSet, EnquiryViewSet, WhatsAppWebhookView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubCategoryViewSet)
router.register(r'whatsapp-contacts', WhatsAppContactViewSet)
router.register(r'enquiries', EnquiryViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'media-items', MediaItemViewSet)
router.register(r'making-videos', MakingVideoViewSet)
router.register(r'users', AdminUserViewSet, basename='admin-user')

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='api-login'),
    path('notifications/', NotificationAPIView.as_view(), name='api-notifications'),
    path('whatsapp-webhook/', WhatsAppWebhookView.as_view(), name='whatsapp-webhook'),
    path('', include(router.urls)),
]
