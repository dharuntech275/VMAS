from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from menu.models import MenuItem
from orders.models import Order, OrderItem


class OrderAPITests(APITestCase):
    def setUp(self):
        # Create test menu items
        self.chapathi = MenuItem.objects.create(
            name="Chapathi",
            slug="chapathi-pack-of-5",
            pack_size="Pack of 5",
            price=Decimal("50.00"),
            is_available=True
        )
        self.naan = MenuItem.objects.create(
            name="Butter Naan",
            slug="butter-naan-pack-of-4",
            pack_size="Pack of 4",
            price=Decimal("100.00"),
            is_available=True
        )
        self.sold_out_item = MenuItem.objects.create(
            name="Special Parotta",
            slug="special-parotta",
            pack_size="Pack of 4",
            price=Decimal("90.00"),
            is_available=False
        )
        self.order_create_url = reverse('orders:order-create')

    def test_create_order_success(self):
        """
        Valid order creation:
        - Calculates total securely on backend
        - Captures unit_price snapshots in OrderItem
        - Returns 201 Created with order id and total
        """
        payload = {
            "customer_name": "Ravi Kumar",
            "phone": "9876543210",
            "address": "Flat 302, Green Meadows, Chennai",
            "payment_method": "COD",
            "items": [
                {"menu_item": self.chapathi.id, "quantity": 2},  # 50 * 2 = 100
                {"menu_item": self.naan.id, "quantity": 1},      # 100 * 1 = 100
            ]
        }
        response = self.client.post(self.order_create_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertEqual(Decimal(str(response.data['total'])), Decimal("200.00"))
        self.assertEqual(response.data['status'], Order.OrderStatus.RECEIVED)

        # Verify DB records
        order = Order.objects.get(id=response.data['id'])
        self.assertEqual(order.total, Decimal("200.00"))
        self.assertEqual(order.items.count(), 2)

        item1 = order.items.get(menu_item=self.chapathi)
        self.assertEqual(item1.unit_price, Decimal("50.00"))
        self.assertEqual(item1.quantity, 2)

    def test_create_order_invalid_phone_fails(self):
        """
        Order should fail with 400 Bad Request when phone number is invalid:
        - Less than 10 digits
        - Does not start with 6, 7, 8, or 9
        """
        payload = {
            "customer_name": "Ravi Kumar",
            "phone": "12345",  # Invalid
            "address": "Flat 302, Green Meadows, Chennai",
            "payment_method": "UPI",
            "items": [
                {"menu_item": self.chapathi.id, "quantity": 1}
            ]
        }
        response = self.client.post(self.order_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone', response.data)

        # Test phone not starting with 6-9
        payload['phone'] = "5987654321"
        response2 = self.client.post(self.order_create_url, payload, format='json')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone', response2.data)

    def test_create_order_short_address_fails(self):
        """
        Order should fail with 400 Bad Request when address is less than 8 characters.
        """
        payload = {
            "customer_name": "Ravi Kumar",
            "phone": "9876543210",
            "address": "Home",  # Only 4 chars
            "payment_method": "COD",
            "items": [
                {"menu_item": self.chapathi.id, "quantity": 1}
            ]
        }
        response = self.client.post(self.order_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('address', response.data)

    def test_create_order_unavailable_item_fails(self):
        """
        Order should fail when an item is marked is_available=False.
        """
        payload = {
            "customer_name": "Ravi Kumar",
            "phone": "9876543210",
            "address": "Flat 302, Green Meadows, Chennai",
            "payment_method": "COD",
            "items": [
                {"menu_item": self.sold_out_item.id, "quantity": 1}
            ]
        }
        response = self.client.post(self.order_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('items', response.data)

    def test_create_order_empty_items_fails(self):
        """
        Order should fail when items array is empty.
        """
        payload = {
            "customer_name": "Ravi Kumar",
            "phone": "9876543210",
            "address": "Flat 302, Green Meadows, Chennai",
            "payment_method": "COD",
            "items": []
        }
        response = self.client.post(self.order_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_status_lookup_wrong_phone_fails(self):
        """
        Order lookup should return 404 Not Found if query param phone does not match order.phone.
        """
        order = Order.objects.create(
            customer_name="Suresh",
            phone="9876543210",
            address="100 Feet Road, Vadapalani, Chennai",
            payment_method=Order.PaymentMethod.COD,
            total=Decimal("150.00"),
            status=Order.OrderStatus.PREPARING
        )

        lookup_url = reverse('orders:order-status', kwargs={'pk': order.id})

        # Wrong phone
        response_wrong_phone = self.client.get(f"{lookup_url}?phone=9999988888")
        self.assertEqual(response_wrong_phone.status_code, status.HTTP_404_NOT_FOUND)

        # No phone param
        response_no_phone = self.client.get(lookup_url)
        self.assertEqual(response_no_phone.status_code, status.HTTP_404_NOT_FOUND)

    def test_status_lookup_correct_phone_success(self):
        """
        Order lookup returns 200 OK and order details when matching phone is supplied.
        """
        order = Order.objects.create(
            customer_name="Suresh",
            phone="9876543210",
            address="100 Feet Road, Vadapalani, Chennai",
            payment_method=Order.PaymentMethod.COD,
            total=Decimal("100.00"),
            status=Order.OrderStatus.OUT_FOR_DELIVERY
        )
        OrderItem.objects.create(
            order=order,
            menu_item=self.chapathi,
            quantity=2,
            unit_price=self.chapathi.price
        )

        lookup_url = reverse('orders:order-status', kwargs={'pk': order.id})
        response = self.client.get(f"{lookup_url}?phone=9876543210")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], Order.OrderStatus.OUT_FOR_DELIVERY)
        self.assertEqual(response.data['customer_name'], "Suresh")
        self.assertEqual(len(response.data['items']), 1)
