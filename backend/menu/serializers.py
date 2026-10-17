from rest_framework import serializers
from .models import MenuItem


class MenuItemSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying available menu items.
    """
    class Meta:
        model = MenuItem
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'pack_size',
            'price',
            'image',
            'is_available',
            'created_at',
        ]
