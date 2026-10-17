from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    raw_id_fields = ('menu_item',)
    readonly_fields = ('subtotal',)

    def subtotal(self, obj):
        if obj.pk and obj.quantity and obj.unit_price:
            return f"₹{obj.subtotal:.2f}"
        return "₹0.00"
    subtotal.short_description = "Subtotal"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'customer_name',
        'phone',
        'payment_method',
        'status',
        'total',
        'created_at'
    )
    list_editable = ('status',)
    list_filter = ('status', 'created_at', 'payment_method')
    search_fields = ('customer_name', 'phone', 'id')
    date_hierarchy = 'created_at'
    inlines = [OrderItemInline]
    readonly_fields = ('created_at',)
    actions = ['mark_as_preparing', 'mark_as_out_for_delivery', 'mark_as_delivered']

    @admin.action(description="Mark selected orders as Preparing")
    def mark_as_preparing(self, request, queryset):
        updated = queryset.update(status=Order.OrderStatus.PREPARING)
        self.message_user(request, f"{updated} order(s) successfully marked as Preparing.")

    @admin.action(description="Mark selected orders as Out for delivery")
    def mark_as_out_for_delivery(self, request, queryset):
        updated = queryset.update(status=Order.OrderStatus.OUT_FOR_DELIVERY)
        self.message_user(request, f"{updated} order(s) successfully marked as Out for delivery.")

    @admin.action(description="Mark selected orders as Delivered")
    def mark_as_delivered(self, request, queryset):
        updated = queryset.update(status=Order.OrderStatus.DELIVERED)
        self.message_user(request, f"{updated} order(s) successfully marked as Delivered.")
