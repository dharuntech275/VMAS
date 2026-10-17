from rest_framework import generics
from .models import MenuItem
from .serializers import MenuItemSerializer


class MenuItemListView(generics.ListAPIView):
    """
    GET /api/menu/
    Returns a list of all currently available food packs (Chapathi, Naan, Parotta, etc.)
    """
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        return MenuItem.objects.filter(is_available=True)
