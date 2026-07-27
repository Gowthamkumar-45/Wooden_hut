from rest_framework import serializers
from django.contrib.auth.models import User
from products.models import Product, Category, SubCategory, MediaItem, MakingVideo
from .models import UserProfile


class AdminUserSerializer(serializers.ModelSerializer):
    branch = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_superuser', 'branch', 'date_joined']

    def get_branch(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.branch if profile else None


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    branch = serializers.ChoiceField(choices=UserProfile.BRANCH_CHOICES, required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'branch']

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        branch = validated_data.pop('branch', None) or None
        password = validated_data.pop('password')
        # Accounts with no branch are Super Admins with full, unrestricted
        # access — matches the existing hand-created superuser accounts.
        is_super = branch is None
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=password,
            is_superuser=is_super,
            is_staff=is_super,
        )
        UserProfile.objects.create(user=user, branch=branch)
        return user

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
