from django.db import models

from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class SubCategory(models.Model):
    category = models.ForeignKey(Category, related_name='subcategories', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    slug = models.SlugField()

    class Meta:
        unique_together = ('category', 'slug')

    def __str__(self):
        return f"{self.category.name} - {self.name}"

class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, null=True, blank=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    sub_category = models.ForeignKey(SubCategory, related_name='products', on_delete=models.CASCADE)
    description = models.TextField()
    material = models.CharField(max_length=255)
    color = models.CharField(max_length=100)
    dimensions = models.CharField(max_length=255, null=True, blank=True)
    height = models.CharField(max_length=100, null=True, blank=True)
    width = models.CharField(max_length=100, null=True, blank=True)
    depth = models.CharField(max_length=100, null=True, blank=True)
    storage = models.CharField(max_length=255, null=True, blank=True)
    
    main_image = models.ImageField(upload_to='products/main/', null=True, blank=True)
    image2 = models.ImageField(upload_to='products/gallery/', null=True, blank=True)
    image3 = models.ImageField(upload_to='products/gallery/', null=True, blank=True)
    image4 = models.ImageField(upload_to='products/gallery/', null=True, blank=True)
    image5 = models.ImageField(upload_to='products/gallery/', null=True, blank=True)

    in_stock = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Ensure uniqueness
            original_slug = self.slug
            counter = 1
            while Product.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    subject = models.CharField(max_length=255, null=True, blank=True)
    rating = models.PositiveIntegerField(default=5)
    review = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.name} for {self.product.name}"
