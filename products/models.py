from django.db import models

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
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    sub_category = models.ForeignKey(SubCategory, related_name='products', on_delete=models.CASCADE)
    description = models.TextField()
    material = models.CharField(max_length=255)
    color = models.CharField(max_length=100)
    dimensions = models.CharField(max_length=255)
    storage = models.CharField(max_length=255, null=True, blank=True)
    
    main_image = models.ImageField(upload_to='products/main/', null=True, blank=True)
    image2 = models.ImageField(upload_to='products/gallery/', null=True, blank=True)
    image3 = models.ImageField(upload_to='products/gallery/', null=True, blank=True)
    image4 = models.ImageField(upload_to='products/gallery/', null=True, blank=True)
    image5 = models.ImageField(upload_to='products/gallery/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
