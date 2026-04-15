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
        fields = ['id', 'name', 'slug']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'subcategories']

class ReviewSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    class Meta:
        model = Review
        fields = ['id', 'product', 'product_name', 'name', 'email', 'phone_number', 'subject', 'rating', 'review', 'is_approved', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    sub_category_name = serializers.ReadOnlyField(source='sub_category.name')
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
