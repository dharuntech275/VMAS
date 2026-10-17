from django.db import models
from menu.models import MenuItem


class Order(models.Model):
    """
    Represents a customer's order for food packs.
    """
    class PaymentMethod(models.TextChoices):
        COD = 'COD', 'Cash on Delivery'
        UPI = 'UPI', 'UPI'

    class OrderStatus(models.TextChoices):
        RECEIVED = 'RECEIVED', 'Received'
        PREPARING = 'PREPARING', 'Preparing'
        OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', 'Out for Delivery'
        DELIVERED = 'DELIVERED', 'Delivered'
        CANCELLED = 'CANCELLED', 'Cancelled'

    customer_name = models.CharField(max_length=120, help_text="Customer's full name")
    phone = models.CharField(max_length=15, help_text="Customer contact phone number")
    address = models.TextField(help_text="Delivery address with landmark")
    payment_method = models.CharField(
        max_length=10,
        choices=PaymentMethod.choices,
        default=PaymentMethod.COD,
        help_text="Payment mode selected by customer"
    )
    status = models.CharField(
        max_length=25,
        choices=OrderStatus.choices,
        default=OrderStatus.RECEIVED,
        help_text="Current state of the order"
    )
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Total bill amount in INR (₹)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Order"
        verbose_name_plural = "Orders"

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name} ({self.status})"


class OrderItem(models.Model):
    """
    Represents an individual item inside an order, capturing the price at the time of purchase.
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
        help_text="Associated order"
    )
    menu_item = models.ForeignKey(
        MenuItem,
        on_delete=models.PROTECT,
        related_name="order_items",
        help_text="Selected food pack item"
    )
    quantity = models.PositiveIntegerField(
        default=1,
        help_text="Number of packs ordered"
    )
    unit_price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        help_text="Snapshot of the price per pack at the time of order"
    )

    class Meta:
        verbose_name = "Order Item"
        verbose_name_plural = "Order Items"

    @property
    def subtotal(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name} (₹{self.unit_price} each) for Order #{self.order_id}"
