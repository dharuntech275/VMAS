"""
URL configuration for VMAS (VMA Services) backend.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/menu/', include('menu.urls')),
    path('api/orders/', include('orders.urls')),
]
