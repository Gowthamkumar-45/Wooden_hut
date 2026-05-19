from rest_framework import serializers
from products.models import Product, Category, SubCategory, Review, MediaItem, MakingVideo

class MediaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaItem
        fields = '__all__'

class MakingVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MakingVideo
        fields = '__all__'

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'slug', 'category']
        read_only_fields = ['slug']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'subcategories']
        read_only_fields = ['slug']

class ReviewSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    class Meta:
        model = Review
        fields = ['id', 'product', 'product_name', 'name', 'email', 'phone_number', 'subject', 'rating', 'review', 'is_approved', 'created_at']

# Lightweight serializer for list views — no nested reviews
class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    sub_category_name = serializers.ReadOnlyField(source='sub_category.name')

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'material', 'color',
            'main_image', 'in_stock', 'category', 'category_name',
            'sub_category', 'sub_category_name', 'created_at'
        ]

# Full serializer for detail view — includes reviews
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    sub_category_name = serializers.ReadOnlyField(source='sub_category.name')
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
