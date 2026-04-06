from rest_framework import viewsets, permissions
from products.models import Product, Category, SubCategory
from .serializers import ProductSerializer, CategorySerializer
from rest_framework.parsers import MultiPartParser, FormParser

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().prefetch_related('subcategories')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser]

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
