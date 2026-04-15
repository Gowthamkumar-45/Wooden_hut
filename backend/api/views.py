from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from contacts.models import Enquiry, WhatsAppContact
from products.models import Review, Product, MediaItem, MakingVideo
from django.db.models import Count
from django.db.models.functions import ExtractMonth
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta

class LoginAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'username': user.username,
                    'email': user.email
                }
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

from django.utils import timezone
from datetime import timedelta

class NotificationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_trend(self, model, date_field='created_at'):
        try:
            now = timezone.now()
            this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            
            last_month_end = this_month_start - timedelta(seconds=1)
            last_month_start = last_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

            this_month_count = model.objects.filter(**{f"{date_field}__gte": this_month_start}).count()
            last_month_count = model.objects.filter(**{f"{date_field}__gte": last_month_start, f"{date_field}__lte": last_month_end}).count()

            if last_month_count == 0:
                return 100.0 if this_month_count > 0 else 0.0
            
            return round(((this_month_count - last_month_count) / last_month_count) * 100, 1)
        except Exception as e:
            print(f"Trend calculation error for {model}: {e}")
            return 0.0

    def get(self, request):
        try:
            filter_type = request.query_params.get('filter', 'all')
            now = timezone.now()
            
            # Setup base date filters
            date_filter_pt = {}
            date_filter_enq = {}
            date_filter_wa = {}
            date_filter_rev = {}
            
            if filter_type == 'yearly':
                date_filter_pt = {"created_at__year": now.year}
                date_filter_enq = {"created_at__year": now.year}
                date_filter_wa = {"timestamp__year": now.year}
                date_filter_rev = {"created_at__year": now.year}
            elif filter_type == 'monthly':
                date_filter_pt = {"created_at__year": now.year, "created_at__month": now.month}
                date_filter_enq = {"created_at__year": now.year, "created_at__month": now.month}
                date_filter_wa = {"timestamp__year": now.year, "timestamp__month": now.month}
                date_filter_rev = {"created_at__year": now.year, "created_at__month": now.month}
            elif filter_type == 'weekly':
                start_week = now - timedelta(days=now.weekday())
                date_filter_pt = {"created_at__gte": start_week}
                date_filter_enq = {"created_at__gte": start_week}
                date_filter_wa = {"timestamp__gte": start_week}
                date_filter_rev = {"created_at__gte": start_week}
            elif filter_type == 'today':
                date_filter_pt = {"created_at__date": now.date()}
                date_filter_enq = {"created_at__date": now.date()}
                date_filter_wa = {"timestamp__date": now.date()}
                date_filter_rev = {"created_at__date": now.date()}

            new_enquiries = Enquiry.objects.filter(status='New').count()
            new_contacts = WhatsAppContact.objects.filter(status='New').count()
            new_reviews = Review.objects.filter(is_approved=False).count()
            
            # Filtered stats for dashboard
            total_products = Product.objects.filter(**date_filter_pt).count()
            in_stock = Product.objects.filter(in_stock=True, **date_filter_pt).count()
            
            confirmed_enquiries = Enquiry.objects.filter(is_order_confirmed=True, **date_filter_enq).count()
            confirmed_contacts = WhatsAppContact.objects.filter(is_order_confirmed=True, **date_filter_wa).count()
            
            delivered_enquiries = Enquiry.objects.filter(order_status='Delivered', **date_filter_enq).count()
            delivered_contacts = WhatsAppContact.objects.filter(order_status='Delivered', **date_filter_wa).count()

            # Calculate real trends
            product_trend = self.get_trend(Product)
            now = timezone.now()
            this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            last_month_end = this_month_start - timedelta(seconds=1)
            last_month_start = last_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

            def get_combined_count(start, end=None):
                filters = {"created_at__gte": start} if not end else {"created_at__gte": start, "created_at__lte": end}
                filters_wa = {"timestamp__gte": start} if not end else {"timestamp__gte": start, "timestamp__lte": end}
                e_count = Enquiry.objects.filter(is_order_confirmed=True, **filters).count()
                w_count = WhatsAppContact.objects.filter(is_order_confirmed=True, **filters_wa).count()
                return e_count + w_count

            this_month_orders = get_combined_count(this_month_start)
            last_month_orders = get_combined_count(last_month_start, last_month_end)
            
            order_trend = 0.0
            if last_month_orders > 0:
                order_trend = round(((this_month_orders - last_month_orders) / last_month_orders) * 100, 1)
            elif this_month_orders > 0:
                order_trend = 100.0

            customer_trend = self.get_trend(Enquiry) + self.get_trend(WhatsAppContact, 'timestamp')
            
            # Get monthly confirmed orders for current year
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            current_year = now.year
            monthly_orders = []
            
            for i in range(1, 13):
                 e_confirmed = Enquiry.objects.filter(is_order_confirmed=True, created_at__year=current_year, created_at__month=i).count()
                 w_confirmed = WhatsAppContact.objects.filter(is_order_confirmed=True, timestamp__year=current_year, timestamp__month=i).count()
                 
                 e_cancelled = Enquiry.objects.filter(order_status='Cancelled', created_at__year=current_year, created_at__month=i).count()
                 w_cancelled = WhatsAppContact.objects.filter(order_status='Cancelled', timestamp__year=current_year, timestamp__month=i).count()
                 
                 e_pending = Enquiry.objects.filter(is_order_confirmed=False, created_at__year=current_year, created_at__month=i).count()
                 w_pending = WhatsAppContact.objects.filter(is_order_confirmed=False, timestamp__year=current_year, timestamp__month=i).count()
                 
                 monthly_orders.append({
                     "name": months[i-1], 
                     "Confirmed": e_confirmed + w_confirmed,
                     "Cancelled": e_cancelled + w_cancelled,
                     "Pending": e_pending + w_pending,
                     "value": e_confirmed + w_confirmed
                 })

            # Calculate interaction distribution for Traffic chart
            total_interactions = Enquiry.objects.filter(**date_filter_enq).count() + WhatsAppContact.objects.filter(**date_filter_wa).count() + Review.objects.filter(**date_filter_rev).count()
            traffic_stats = [
                { 'name': 'WhatsApp', 'value': 0, 'color': '#22c55e' },
                { 'name': 'Web Inquiries', 'value': 0, 'color': '#7c3aed' },
                { 'name': 'Feedback', 'value': 0, 'color': '#f59e0b' }
            ]
            
            if total_interactions > 0:
                traffic_stats[0]['value'] = round((WhatsAppContact.objects.filter(**date_filter_wa).count() / total_interactions) * 100)
                traffic_stats[1]['value'] = round((Enquiry.objects.filter(**date_filter_enq).count() / total_interactions) * 100)
                traffic_stats[2]['value'] = round((Review.objects.filter(**date_filter_rev).count() / total_interactions) * 100)
                
            # Sales pipeline
            packed = Enquiry.objects.filter(is_order_confirmed=True, order_status='Not Started', **date_filter_enq).count() + WhatsAppContact.objects.filter(is_order_confirmed=True, order_status='Not Started', **date_filter_wa).count()
            shipped = Enquiry.objects.filter(order_status='Processing', **date_filter_enq).count() + WhatsAppContact.objects.filter(order_status='Processing', **date_filter_wa).count()
            cancelled = Enquiry.objects.filter(order_status='Cancelled', **date_filter_enq).count() + WhatsAppContact.objects.filter(order_status='Cancelled', **date_filter_wa).count() + Enquiry.objects.filter(status='Rejected', **date_filter_enq).count() + WhatsAppContact.objects.filter(status='Rejected', **date_filter_wa).count()

            return Response({
                'enquiries': new_enquiries,
                'whatsapp_contacts': new_contacts,
                'reviews': new_reviews,
                'total_notifications': new_enquiries + new_contacts + new_reviews,
                'stats': {
                    'total_products': total_products,
                    'product_trend': product_trend,
                    'in_stock': in_stock,
                    'total_confirmed': confirmed_enquiries + confirmed_contacts,
                    'order_trend': order_trend,
                    'total_delivered': delivered_enquiries + delivered_contacts,
                    'delivery_trend': self.get_trend(Enquiry) if (delivered_enquiries + delivered_contacts) > 0 else 0.0, 
                    'total_reviews': Review.objects.filter(**date_filter_rev).count(),
                    'review_trend': self.get_trend(Review),
                    'total_customers': Enquiry.objects.filter(**date_filter_enq).count() + WhatsAppContact.objects.filter(**date_filter_wa).count(),
                    'customer_trend': customer_trend,
                    'monthly_orders': monthly_orders,
                    'traffic_stats': traffic_stats,
                    'sales_pipeline': {
                        'packed': packed,
                        'shipped': shipped,
                        'delivered': delivered_enquiries + delivered_contacts,
                        'cancelled': cancelled
                    }
                }
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)
