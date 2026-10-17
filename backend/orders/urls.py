from django.urls import path
from .views import OrderCreateView, OrderStatusView

app_name = 'orders'

urlpatterns = [
    path('', OrderCreateView.as_view(), name='order-create'),
    path('<int:pk>/', OrderStatusView.as_view(), name='order-status'),
]
