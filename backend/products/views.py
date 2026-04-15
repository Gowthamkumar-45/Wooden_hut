from rest_framework import viewsets, permissions
from products.models import Product, Category, SubCategory, Review, MediaItem, MakingVideo
from .serializers import (
    ProductSerializer, CategorySerializer, ReviewSerializer,
    MediaItemSerializer, MakingVideoSerializer
)
from rest_framework.parsers import MultiPartParser, FormParser

class MediaItemViewSet(viewsets.ModelViewSet):
    queryset = MediaItem.objects.all().order_by('-created_at')
    serializer_class = MediaItemSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class MakingVideoViewSet(viewsets.ModelViewSet):
    queryset = MakingVideo.objects.all().order_by('-created_at')
    serializer_class = MakingVideoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().prefetch_related('subcategories')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        
        # Try lookup by ID first if it's numeric, otherwise by slug
        val = self.kwargs[lookup_url_kwarg]
        if val.isdigit():
            obj = queryset.filter(pk=val).first()
        else:
            obj = queryset.filter(slug=val).first()
            
        if not obj:
            from django.http import Http404
            raise Http404
            
        self.check_object_permissions(self.request, obj)
        return obj

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = Product.objects.all()
        category_slug = self.request.query_params.get('category', None)
        subcategory_slug = self.request.query_params.get('subcategory', None)
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if subcategory_slug:
            queryset = queryset.filter(sub_category__slug=subcategory_slug)
            
        return queryset

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = Review.objects.all().order_by('-created_at')
        product_id = self.request.query_params.get('product', None)
        product_slug = self.request.query_params.get('product_slug', None)
        
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        if product_slug:
            queryset = queryset.filter(product__slug=product_slug)
        
        # Only show approved reviews for public
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_approved=True)
            
        return queryset
