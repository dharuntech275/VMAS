from django.http import Http404
from rest_framework import generics, status
from rest_framework.response import Response

from .models import Order
from .serializers import OrderCreateSerializer, OrderDetailSerializer


class OrderCreateView(generics.CreateAPIView):
    """
    POST /api/orders/
    Creates a new order with atomic total calculation and order items.
    """
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        # Return the complete order details including ID, status, and calculated total
        response_serializer = OrderDetailSerializer(order)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class OrderStatusView(generics.RetrieveAPIView):
    """
    GET /api/orders/<id>/?phone=XXXXXXXXXX
    Retrieves the status of an order only if the provided phone matches the order's phone.
    Returns 404 if phone does not match or is missing.
    """
    queryset = Order.objects.all().prefetch_related('items__menu_item')
    serializer_class = OrderDetailSerializer

    def get_object(self):
        # Fetch order by primary key
        order = super().get_object()

        # Query param phone validation
        requested_phone = self.request.query_params.get('phone', '').strip()

        if not requested_phone or order.phone != requested_phone:
            raise Http404("Order not found or phone number does not match.")

        return order
