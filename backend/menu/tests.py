from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import MenuItem


class MenuAPITests(APITestCase):
    def setUp(self):
        # Create 1 available item and 1 unavailable item
        self.item_available = MenuItem.objects.create(
            name="Wheat Parotta",
            slug="wheat-parotta-pack-of-4",
            pack_size="Pack of 4",
            price=Decimal("60.00"),
            is_available=True
        )
        self.item_unavailable = MenuItem.objects.create(
            name="Garlic Naan",
            slug="garlic-naan-pack-of-2",
            pack_size="Pack of 2",
            price=Decimal("70.00"),
            is_available=False
        )
        self.menu_list_url = reverse('menu:menu-list')

    def test_get_menu_items_only_returns_available(self):
        """
        GET /api/menu/ should only return items where is_available=True.
        """
        response = self.client.get(self.menu_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Wheat Parotta")
