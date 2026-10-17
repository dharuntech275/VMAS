from django.db import models
from django.utils.text import slugify


class MenuItem(models.Model):
    """
    Represents a ready-made food pack item (e.g., Chapathi - Pack of 5).
    """
    name = models.CharField(max_length=120, help_text="Food item name (e.g. Chapathi, Wheat Parotta)")
    slug = models.SlugField(max_length=150, unique=True, blank=True, help_text="URL-friendly slug (auto-generated if empty)")
    description = models.TextField(blank=True, default='', help_text="Short description of the item")
    pack_size = models.CharField(max_length=50, help_text='Pack quantity details (e.g., "Pack of 5")')
    price = models.DecimalField(max_digits=8, decimal_places=2, help_text="Price in INR (₹)")
    image = models.URLField(max_length=500, blank=True, null=True, help_text="Image URL for food pack")
    is_available = models.BooleanField(default=True, help_text="Is this item currently in stock?")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Menu Item"
        verbose_name_plural = "Menu Items"

    def save(self, *args, **kwargs):
        # Auto-generate slug from name if not provided
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while MenuItem.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.pack_size}) - ₹{self.price}"
