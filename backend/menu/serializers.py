from rest_framework import serializers
from .models import MenuItem


class MenuItemSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying available menu items.
    """
    image = serializers.CharField(required=False, allow_null=True, allow_blank=True)

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
