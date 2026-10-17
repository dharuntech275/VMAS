from django.contrib import admin
from .models import MenuItem


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'pack_size', 'price', 'is_available', 'created_at')
    list_filter = ('is_available', 'created_at')
    search_fields = ('name', 'description', 'pack_size')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_available', 'price')
    actions = ['mark_as_available', 'mark_as_unavailable']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'pack_size', 'price', 'is_available')
        }),
        ('Media (URL Only - No Upload)', {
            'fields': ('image',),
            'description': 'Direct web image URL (e.g. Unsplash or Cloud CDN link). Direct file uploads are disabled.'
        }),
    )

    @admin.action(description="Mark selected items as Available")
    def mark_as_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f"{updated} item(s) marked as Available.")

    @admin.action(description="Mark selected items as Unavailable")
    def mark_as_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f"{updated} item(s) marked as Unavailable.")
