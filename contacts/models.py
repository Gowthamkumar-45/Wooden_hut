from django.db import models

class WhatsAppContact(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Rejected', 'Rejected'),
    ]
    ORDER_STATUS_CHOICES = [
        ('Not Started', 'Not Started'),
        ('Processing', 'Processing'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]
    product_name = models.CharField(max_length=255)
    customer_name = models.CharField(max_length=255, blank=True, null=True) 
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    is_order_confirmed = models.BooleanField(default=False)
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='Not Started')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} - {self.timestamp}"

class Enquiry(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Rejected', 'Rejected'),
    ]
    ORDER_STATUS_CHOICES = [
        ('Not Started', 'Not Started'),
        ('Processing', 'Processing'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20)
    service = models.CharField(max_length=255, blank=True, null=True)
    subject = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    is_order_confirmed = models.BooleanField(default=False)
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='Not Started')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Enquiry from {self.name} - {self.created_at}"
