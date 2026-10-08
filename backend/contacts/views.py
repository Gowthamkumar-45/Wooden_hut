import hashlib
import hmac
import json
import os

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import WhatsAppContact, Enquiry
from .serializers import WhatsAppContactSerializer, EnquirySerializer


def _branch_scoped(queryset, request):
    """Branch-restricted admin users only ever see their own branch's rows.
    Super Admins (no branch on their profile) see everything, and public
    submissions (unauthenticated 'create') are never filtered."""
    user = request.user
    if not user or not user.is_authenticated:
        return queryset
    profile = getattr(user, 'profile', None)
    branch = profile.branch if profile else None
    return queryset.filter(branch=branch) if branch else queryset


class WhatsAppContactViewSet(viewsets.ModelViewSet):
    queryset = WhatsAppContact.objects.all().order_by('-timestamp')
    serializer_class = WhatsAppContactSerializer
    pagination_class = None

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return _branch_scoped(super().get_queryset(), self.request)


# Maps a WhatsApp Business phone_number_id (from Meta's webhook payload) to a
# branch name, for setups with more than one Cloud API number. Configure as
# JSON, e.g. {"1234567890":"Coimbatore","2345678901":"Tanjavur"}. Numbers not
# listed here (or when unset) fall back to no branch (Super Admin only).
WHATSAPP_NUMBER_BRANCH_MAP = json.loads(os.environ.get('WHATSAPP_NUMBER_BRANCH_MAP', '{}'))


@method_decorator(csrf_exempt, name='dispatch')
class WhatsAppWebhookView(APIView):
    """
    Receives WhatsApp Business Cloud API webhook events (forwarded by a BSP
    such as ASKEVA, or sent directly by Meta) so real customer name/phone
    number get captured when someone actually messages the business, instead
    of relying on a plain wa.me click (which tells the site nothing about
    who clicked it). The payload shape is identical either way — Meta's
    native "whatsapp_business_account" format — a BSP just proxies it.

    Setup when going through a BSP like ASKEVA (no Meta dashboard needed —
    ASKEVA already completed their own Meta app verification):
      1. In ASKEVA's dashboard → Integration → Webhook Message Configurations,
         set the Webhook URL to this endpoint's live URL.
      2. Add a header parameter there (any header name) whose value matches
         WHATSAPP_WEBHOOK_SECRET below — this is what authenticates incoming
         requests, since a BSP's own POST isn't signed with Meta's
         X-Hub-Signature-256 the way a direct Meta webhook would be.
      3. Set WHATSAPP_WEBHOOK_SECRET_HEADER to that same header name (defaults
         to "X-Webhook-Secret" if not set) and WHATSAPP_WEBHOOK_SECRET to the
         shared value.

    Setup when registering directly with Meta instead (no BSP):
      1. Add a WhatsApp Business phone number to a Meta app on the Cloud API.
      2. Configure this endpoint's URL as the webhook callback, subscribed to
         the "messages" field.
      3. Set WHATSAPP_VERIFY_TOKEN here to the same value entered in Meta's
         webhook verification field.
      4. Optionally set WHATSAPP_APP_SECRET (from the Meta app's settings) to
         verify the X-Hub-Signature-256 header on incoming events.
    """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        verify_token = os.environ.get('WHATSAPP_VERIFY_TOKEN')
        mode = request.query_params.get('hub.mode')
        token = request.query_params.get('hub.verify_token')
        challenge = request.query_params.get('hub.challenge', '')

        if mode == 'subscribe' and verify_token and token == verify_token:
            return HttpResponse(challenge, content_type='text/plain', status=200)
        return HttpResponse(status=403)

    def post(self, request):
        webhook_secret = os.environ.get('WHATSAPP_WEBHOOK_SECRET')
        if webhook_secret:
            header_name = os.environ.get('WHATSAPP_WEBHOOK_SECRET_HEADER', 'X-Webhook-Secret')
            received = request.headers.get(header_name, '')
            if not hmac.compare_digest(received, webhook_secret):
                return HttpResponse(status=403)

        app_secret = os.environ.get('WHATSAPP_APP_SECRET')
        if app_secret:
            signature = request.headers.get('X-Hub-Signature-256', '')
            expected = 'sha256=' + hmac.new(app_secret.encode(), request.body, hashlib.sha256).hexdigest()
            if not hmac.compare_digest(signature, expected):
                return HttpResponse(status=403)

        try:
            for entry in request.data.get('entry', []):
                for change in entry.get('changes', []):
                    if change.get('field') != 'messages':
                        continue
                    self._handle_messages_change(change.get('value', {}))
        except Exception as e:
            # Always return 200 so Meta doesn't retry/disable the webhook over
            # a parsing hiccup — log it and move on.
            print(f"WhatsApp webhook processing error: {e}")

        return Response({'status': 'received'}, status=200)

    def _handle_messages_change(self, value):
        messages = value.get('messages')
        if not messages:
            return  # status updates (delivered/read) also arrive here — ignore

        phone_number_id = value.get('metadata', {}).get('phone_number_id', '')
        branch = WHATSAPP_NUMBER_BRANCH_MAP.get(phone_number_id)

        names_by_wa_id = {
            c.get('wa_id'): c.get('profile', {}).get('name')
            for c in value.get('contacts', [])
        }

        for msg in messages:
            wa_id = msg.get('from', 'Unknown')
            msg_type = msg.get('type', 'text')
            text = msg.get('text', {}).get('body', '') if msg_type == 'text' else f'[{msg_type} message]'

            WhatsAppContact.objects.create(
                product_name='WhatsApp Inquiry',
                customer_name=names_by_wa_id.get(wa_id) or 'Unknown',
                phone_number=wa_id,
                message=text,
                status='New',
                branch=branch,
            )


class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all().order_by('-created_at')
    serializer_class = EnquirySerializer
    pagination_class = None

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return _branch_scoped(super().get_queryset(), self.request)
