from rest_framework import serializers
from products.models import Product, Category, SubCategory, MediaItem, MakingVideo

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'slug']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'subcategories']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    sub_category_name = serializers.ReadOnlyField(source='sub_category.name')
    image = serializers.ImageField(source='main_image', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

class MediaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaItem
        fields = '__all__'

class MakingVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MakingVideo
        fields = '__all__'
