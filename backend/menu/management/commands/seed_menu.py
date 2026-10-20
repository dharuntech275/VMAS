from decimal import Decimal
from django.core.management.base import BaseCommand
from menu.models import MenuItem


class Command(BaseCommand):
    help = 'Seeds initial ready-made food pack items into the database'

    def handle(self, *args, **options):
        items = [
            {
                'name': 'Chapathi',
                'slug': 'chapathi-pack-of-5',
                'pack_size': 'Pack of 5',
                'price': Decimal('50.00'),
                'description': 'Soft and freshly rolled whole wheat chapathis, cooked to perfection and hygienically packed.',
                'image': '/images/chapathi.jpg',
                'is_available': True,
            },
            {
                'name': 'Wheat parotta',
                'slug': 'wheat-parotta-pack-of-4',
                'pack_size': 'Pack of 4',
                'price': Decimal('60.00'),
                'description': 'Crispy yet soft layered parottas crafted with healthy 100% whole wheat flour.',
                'image': '/images/wheat_parotta.jpg',
                'is_available': True,
            },
            {
                'name': 'Plain naan',
                'slug': 'plain-naan-pack-of-4',
                'pack_size': 'Pack of 4',
                'price': Decimal('80.00'),
                'description': 'Traditional clay-oven style soft and fluffy tandoori naans, ideal with rich curries.',
                'image': '/images/plain_naan.jpg',
                'is_available': True,
            },
            {
                'name': 'Poori',
                'slug': 'poori-pack-of-6',
                'pack_size': 'Pack of 6',
                'price': Decimal('60.00'),
                'description': 'Golden, crisp and puffed pooris prepared fresh in high-grade cooking oil.',
                'image': '/images/poori.jpg',
                'is_available': True,
            },
            {
                'name': 'Bajra chapathi',
                'slug': 'bajra-chapathi-pack-of-5',
                'pack_size': 'Pack of 5',
                'price': Decimal('60.00'),
                'description': 'Nutritious gluten-free pearl millet rotis, freshly made on traditional tawa. Rich in fiber and iron.',
                'image': '/images/bajra_chapathi.jpg',
                'is_available': True,
            },
            {
                'name': 'Chola poori',
                'slug': 'chola-poori-pack-of-3',
                'pack_size': 'Pack of 3',
                'price': Decimal('75.00'),
                'description': 'Extra-large fluffy and golden bhatura-style pooris, fried crisp on the outside and soft inside.',
                'image': '/images/chola_poori.jpg',
                'is_available': True,
            },
            {
                'name': 'Maida parotta',
                'slug': 'maida-parotta-pack-of-4',
                'pack_size': 'Pack of 4',
                'price': Decimal('50.00'),
                'description': 'Crispy, flaky, and golden layered traditional South Indian parottas, cooked to a golden crisp.',
                'image': '/images/maida_parotta.jpg',
                'is_available': True,
            },
        ]

        created_count = 0
        updated_count = 0

        for item_data in items:
            slug = item_data['slug']
            obj, created = MenuItem.objects.update_or_create(
                slug=slug,
                defaults=item_data
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"  + Added: {obj.name} ({obj.pack_size}) - Rs. {obj.price}"))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f"  * Updated: {obj.name} ({obj.pack_size}) - Rs. {obj.price}"))

        self.stdout.write(
            self.style.SUCCESS(
                f"\nMenu seeding finished: {created_count} created, {updated_count} updated."
            )
        )
