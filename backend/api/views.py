from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from contacts.models import Enquiry, WhatsAppContact
from products.models import Review, Product, MediaItem, MakingVideo
from django.db.models import Count
from django.db.models.functions import ExtractMonth
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
import hashlib
from .models import UserProfile, SiteVisit
from .serializers import AdminUserSerializer, AdminUserCreateSerializer


def get_user_branch(user):
    """Returns the branch a user is restricted to, or None for unrestricted (Super Admin) access."""
    profile = getattr(user, 'profile', None)
    return profile.branch if profile else None


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
                    'email': user.email,
                    'is_superuser': user.is_superuser,
                    'branch': get_user_branch(user)
                }
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Manage admin panel logins (Super Admins + branch-restricted users).
    Only Super Admins can view or manage this list.
    """
    queryset = User.objects.all().select_related('profile').order_by('-date_joined')
    permission_classes = [IsSuperUser]
    pagination_class = None

    def get_serializer_class(self):
        if self.action == 'create':
            return AdminUserCreateSerializer
        return AdminUserSerializer

    def destroy(self, request, *args, **kwargs):
        target = self.get_object()
        if target.id == request.user.id:
            return Response({'error': "You can't delete your own account."}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='reset-password')
    def reset_password(self, request, pk=None):
        new_password = request.data.get('password')
        if not new_password or len(new_password) < 6:
            return Response({'error': 'Password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)
        target = self.get_object()
        target.set_password(new_password)
        target.save()
        return Response({'success': True})

from django.utils import timezone
from datetime import timedelta


def _hash_ip(request):
    """Salted digest of the client IP — enough to de-duplicate visitors
    without ever storing the raw address."""
    ip = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip() \
        or request.META.get('REMOTE_ADDR', '')
    return hashlib.sha256(f"{settings.SECRET_KEY}:{ip}".encode()).hexdigest()


class TrackVisitAPIView(APIView):
    """Public, write-only endpoint the storefront calls once per app load
    (see frontend App.js) to log a page visit for the "Total Visitors"
    dashboard card. No auth — visitors aren't logged in."""
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        SiteVisit.objects.create(
            path=(request.data.get('path') or '')[:255],
            ip_hash=_hash_ip(request)
        )
        return Response({'ok': True}, status=status.HTTP_201_CREATED)


class NotificationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_trend(self, queryset, date_field='created_at'):
        """queryset: a Manager or QuerySet (both support .filter()) — pass an
        already branch-scoped queryset for Enquiry/WhatsAppContact so trends
        stay consistent with the rest of a branch-restricted user's dashboard."""
        try:
            now = timezone.now()
            this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

            last_month_end = this_month_start - timedelta(seconds=1)
            last_month_start = last_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

            this_month_count = queryset.filter(**{f"{date_field}__gte": this_month_start}).count()
            last_month_count = queryset.filter(**{f"{date_field}__gte": last_month_start, f"{date_field}__lte": last_month_end}).count()

            if last_month_count == 0:
                return 100.0 if this_month_count > 0 else 0.0

            return round(((this_month_count - last_month_count) / last_month_count) * 100, 1)
        except Exception as e:
            print(f"Trend calculation error for {queryset}: {e}")
            return 0.0

    def get(self, request):
        try:
            filter_type = request.query_params.get('filter', 'all')
            now = timezone.now()

            # A specific month (1-12, current year) from the row's month
            # picker — takes precedence over `filter` entirely when given,
            # rather than adding a 6th value to that dropdown.
            month_param = request.query_params.get('month')
            selected_month = None
            if month_param:
                try:
                    m = int(month_param)
                    if 1 <= m <= 12:
                        selected_month = m
                except (TypeError, ValueError):
                    pass

            # Branch-restricted users only ever see their own branch's
            # Enquiry/WhatsAppContact data on the dashboard, same as Track
            # Orders and Customer Logs. Super Admins (no branch) see all.
            branch = get_user_branch(request.user)
            EnquiryQS = Enquiry.objects.filter(branch=branch) if branch else Enquiry.objects.all()
            WaQS = WhatsAppContact.objects.filter(branch=branch) if branch else WhatsAppContact.objects.all()

            # Setup base date filters
            date_filter_pt = {}
            date_filter_enq = {}
            date_filter_wa = {}
            date_filter_rev = {}

            if selected_month is not None:
                date_filter_pt = {"created_at__year": now.year, "created_at__month": selected_month}
                date_filter_enq = {"created_at__year": now.year, "created_at__month": selected_month}
                date_filter_wa = {"timestamp__year": now.year, "timestamp__month": selected_month}
                date_filter_rev = {"created_at__year": now.year, "created_at__month": selected_month}
            elif filter_type == 'yearly':
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

            new_enquiries = EnquiryQS.filter(status='New').count()
            new_contacts = WaQS.filter(status='New').count()
            new_reviews = Review.objects.filter(is_approved=False).count()

            # Filtered stats for dashboard
            total_products = Product.objects.filter(**date_filter_pt).count()
            in_stock = Product.objects.filter(in_stock=True, **date_filter_pt).count()

            confirmed_enquiries = EnquiryQS.filter(is_order_confirmed=True, **date_filter_enq).count()
            confirmed_contacts = WaQS.filter(is_order_confirmed=True, **date_filter_wa).count()

            delivered_enquiries = EnquiryQS.filter(order_status='Delivered', **date_filter_enq).count()
            delivered_contacts = WaQS.filter(order_status='Delivered', **date_filter_wa).count()

            # Calculate real trends
            product_trend = self.get_trend(Product.objects)
            now = timezone.now()
            this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            last_month_end = this_month_start - timedelta(seconds=1)
            last_month_start = last_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

            def get_combined_count(start, end=None):
                filters = {"created_at__gte": start} if not end else {"created_at__gte": start, "created_at__lte": end}
                filters_wa = {"timestamp__gte": start} if not end else {"timestamp__gte": start, "timestamp__lte": end}
                e_count = EnquiryQS.filter(is_order_confirmed=True, **filters).count()
                w_count = WaQS.filter(is_order_confirmed=True, **filters_wa).count()
                return e_count + w_count

            this_month_orders = get_combined_count(this_month_start)
            last_month_orders = get_combined_count(last_month_start, last_month_end)

            order_trend = 0.0
            if last_month_orders > 0:
                order_trend = round(((this_month_orders - last_month_orders) / last_month_orders) * 100, 1)
            elif this_month_orders > 0:
                order_trend = 100.0

            customer_trend = self.get_trend(EnquiryQS) + self.get_trend(WaQS, 'timestamp')

            # Get monthly confirmed orders for current year
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            current_year = now.year
            monthly_orders = []

            for i in range(1, 13):
                 e_confirmed = EnquiryQS.filter(is_order_confirmed=True, created_at__year=current_year, created_at__month=i).count()
                 w_confirmed = WaQS.filter(is_order_confirmed=True, timestamp__year=current_year, timestamp__month=i).count()

                 e_cancelled = EnquiryQS.filter(order_status='Cancelled', created_at__year=current_year, created_at__month=i).count()
                 w_cancelled = WaQS.filter(order_status='Cancelled', timestamp__year=current_year, timestamp__month=i).count()

                 e_pending = EnquiryQS.filter(is_order_confirmed=False, created_at__year=current_year, created_at__month=i).count()
                 w_pending = WaQS.filter(is_order_confirmed=False, timestamp__year=current_year, timestamp__month=i).count()

                 monthly_orders.append({
                     "name": months[i-1],
                     "Confirmed": e_confirmed + w_confirmed,
                     "Cancelled": e_cancelled + w_cancelled,
                     "Pending": e_pending + w_pending,
                     "value": e_confirmed + w_confirmed
                 })

            # Calculate interaction distribution for Traffic chart
            total_interactions = EnquiryQS.filter(**date_filter_enq).count() + WaQS.filter(**date_filter_wa).count() + Review.objects.filter(**date_filter_rev).count()
            traffic_stats = [
                { 'name': 'WhatsApp', 'value': 0, 'color': '#22c55e' },
                { 'name': 'Web Inquiries', 'value': 0, 'color': '#7c3aed' },
                { 'name': 'Feedback', 'value': 0, 'color': '#f59e0b' }
            ]

            if total_interactions > 0:
                traffic_stats[0]['value'] = round((WaQS.filter(**date_filter_wa).count() / total_interactions) * 100)
                traffic_stats[1]['value'] = round((EnquiryQS.filter(**date_filter_enq).count() / total_interactions) * 100)
                traffic_stats[2]['value'] = round((Review.objects.filter(**date_filter_rev).count() / total_interactions) * 100)

            # Distinct visitors (by hashed IP) for the period — SiteVisit
            # rows come from the frontend's tracking call, not from any
            # branch-scoped data, so no branch filter applies here.
            total_visitors = SiteVisit.objects.filter(**date_filter_pt).values('ip_hash').distinct().count()
            visitor_trend = self.get_trend(SiteVisit.objects)

            # Sales pipeline
            packed = EnquiryQS.filter(is_order_confirmed=True, order_status='Not Started', **date_filter_enq).count() + WaQS.filter(is_order_confirmed=True, order_status='Not Started', **date_filter_wa).count()
            shipped = EnquiryQS.filter(order_status='Processing', **date_filter_enq).count() + WaQS.filter(order_status='Processing', **date_filter_wa).count()
            cancelled = EnquiryQS.filter(order_status='Cancelled', **date_filter_enq).count() + WaQS.filter(order_status='Cancelled', **date_filter_wa).count() + EnquiryQS.filter(status='Rejected', **date_filter_enq).count() + WaQS.filter(status='Rejected', **date_filter_wa).count()

            return Response({
                'enquiries': new_enquiries,
                'whatsapp_contacts': new_contacts,
                'reviews': new_reviews,
                'total_notifications': new_enquiries + new_contacts + new_reviews,
                'stats': {
                    'total_products': total_products,
                    'product_trend': product_trend,
                    'in_stock': in_stock,
                    'total_visitors': total_visitors,
                    'visitor_trend': visitor_trend,
                    'total_confirmed': confirmed_enquiries + confirmed_contacts,
                    'order_trend': order_trend,
                    'total_delivered': delivered_enquiries + delivered_contacts,
                    'delivery_trend': self.get_trend(EnquiryQS) if (delivered_enquiries + delivered_contacts) > 0 else 0.0,
                    'total_reviews': Review.objects.filter(**date_filter_rev).count(),
                    'review_trend': self.get_trend(Review.objects),
                    'total_customers': EnquiryQS.filter(**date_filter_enq).count() + WaQS.filter(**date_filter_wa).count(),
                    'customer_trend': customer_trend,
                    # Web Enquiry count on its own, for the period — distinct
                    # from total_customers (which also folds in WhatsApp) and
                    # from the top-level "enquiries" field (which is only the
                    # unread/new subset).
                    'total_enquiries': EnquiryQS.filter(**date_filter_enq).count(),
                    'enquiries_trend': self.get_trend(EnquiryQS),
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
