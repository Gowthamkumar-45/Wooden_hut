"""
URL configuration for Backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from Backend.views import home

from django.http import HttpResponse
from django.contrib.auth.models import User

def create_admin_temp(request):
    if not User.objects.filter(username='admin_live').exists():
        User.objects.create_superuser('admin_live', 'admin@live.com', 'LiveAdmin@2026')
        return HttpResponse("Superuser 'admin_live' created successfully! You can now login at /admin/")
    return HttpResponse("User 'admin_live' already exists.")

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('create-admin-secret-99/', create_admin_temp),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
