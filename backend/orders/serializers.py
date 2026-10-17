import re
from decimal import Decimal
from django.db import transaction
from rest_framework import serializers

from menu.models import MenuItem
from .models import Order, OrderItem


class OrderItemInputSerializer(serializers.Serializer):
    """
    Serializer for incoming order line items.
    """
    menu_item = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(),
        help_text="ID of the MenuItem pack"
    )
    quantity = serializers.IntegerField(
        min_value=1,
        max_value=20,
        help_text="Quantity between 1 and 20"
    )


class OrderItemDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying line items with item name, pack size and subtotal.
    """
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)
    pack_size = serializers.CharField(source='menu_item.pack_size', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'menu_item',
            'menu_item_name',
            'pack_size',
            'quantity',
            'unit_price',
            'subtotal',
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    """
    Complete order serializer returned after creation and during order status checks.
    """
    items = OrderItemDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'customer_name',
            'phone',
            'address',
            'payment_method',
            'status',
            'total',
            'created_at',
            'items',
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for placing a new order with validations and atomic creation.
    """
    items = OrderItemInputSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'customer_name',
            'phone',
            'address',
            'payment_method',
            'status',
            'total',
            'items',
        ]
        read_only_fields = ['id', 'status', 'total']

    def validate_phone(self, value):
        cleaned_phone = value.strip()
        # 10-digit Indian mobile number starting with 6, 7, 8, or 9
        if not re.match(r'^[6-9]\d{9}$', cleaned_phone):
            raise serializers.ValidationError(
                "Phone number must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
            )
        return cleaned_phone

    def validate_address(self, value):
        cleaned_address = value.strip()
        if len(cleaned_address) < 8:
            raise serializers.ValidationError(
                "Address must be at least 8 characters long."
            )
        return cleaned_address

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError(
                "Order must contain at least one food pack item."
            )
        return value

    def validate(self, attrs):
        items_data = attrs.get('items', [])
        for item_data in items_data:
            menu_item = item_data['menu_item']
            if not menu_item.is_available:
                raise serializers.ValidationError({
                    "items": f"Item '{menu_item.name}' ({menu_item.pack_size}) is currently unavailable."
                })
        return attrs

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        with transaction.atomic():
            # Calculate total securely on backend from current DB prices
            total = sum(
                item_data['menu_item'].price * item_data['quantity']
                for item_data in items_data
            )

            # Create the master order record
            order = Order.objects.create(total=total, **validated_data)

            # Create OrderItems with unit_price snapshot
            order_items = [
                OrderItem(
                    order=order,
                    menu_item=item_data['menu_item'],
                    quantity=item_data['quantity'],
                    unit_price=item_data['menu_item'].price
                )
                for item_data in items_data
            ]
            OrderItem.objects.bulk_create(order_items)

            return order
