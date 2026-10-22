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
                'pack_size': 'Pack of 10',
                'price': Decimal('90.00'),
                'description': 'Hygienically rolled 100% whole wheat chapathis in fresh sealed packet. Toast on both sides on hot home tawa for 1 minute and enjoy soft & hot!',
                'image': '/images/chapathi.jpg',
                'is_available': True,
            },
            {
                'name': 'Wheat parotta',
                'slug': 'wheat-parotta-pack-of-4',
                'pack_size': 'Pack of 10',
                'price': Decimal('160.00'),
                'description': 'Flaky, multi-layered 100% whole wheat parottas in fresh packet. Roast on hot tawa with a drop of ghee or oil for crisp golden layers at home.',
                'image': '/images/wheat_parotta.jpg',
                'is_available': True,
            },
            {
                'name': 'Plain naan',
                'slug': 'plain-naan-pack-of-4',
                'pack_size': 'Pack of 10',
                'price': Decimal('130.00'),
                'description': 'Tandoor-style soft naan packet. Warm on hot home tawa with a brush of butter or ghee for 1 minute.',
                'image': '/images/plain_naan.jpg',
                'is_available': True,
            },
            {
                'name': 'Poori',
                'slug': 'poori-pack-of-6',
                'pack_size': 'Pack of 15',
                'price': Decimal('110.00'),
                'description': 'Fresh ready-to-fry whole wheat poori discs in sealed packet. Drop into hot oil at home to puff up golden, crisp, and hot in seconds!',
                'image': '/images/poori.jpg',
                'is_available': True,
            },
            {
                'name': 'Bajra chapathi',
                'slug': 'bajra-chapathi-pack-of-5',
                'pack_size': 'Pack of 10',
                'price': Decimal('110.00'),
                'description': 'Nutritious gluten-free pearl millet rotis packet. Toast on hot tawa with butter or ghee for healthy homemade dining.',
                'image': '/images/bajra_chapathi.jpg',
                'is_available': True,
            },
            {
                'name': 'Chola poori',
                'slug': 'chola-poori-pack-of-3',
                'pack_size': 'Pack of 12',
                'price': Decimal('130.00'),
                'description': 'Large bhatura-style poori packet. Deep fry hot at home for fluffy, golden bhaturas within minutes.',
                'image': '/images/chola_poori.jpg',
                'is_available': True,
            },
            {
                'name': 'Maida parotta',
                'slug': 'maida-parotta-pack-of-4',
                'pack_size': 'Pack of 10',
                'price': Decimal('160.00'),
                'description': 'Traditional flaky spiral-layered parotta packet. Roast crisp on hot pan with a touch of oil or ghee for golden flaky layers at home.',
                'image': '/images/maida_parotta.jpg',
                'is_available': True,
            },
            {
                'name': 'Mudakathan keerai chapathi',
                'slug': 'mudakathan-keerai-chapathi-pack-of-5',
                'pack_size': 'Pack of 10',
                'price': Decimal('110.00'),
                'description': 'Fresh herbal balloon vine chapathi packet. Toast for 1 minute on home tawa for authentic joint health and wellness.',
                'image': '/images/mudakathan_keerai_chapathi.jpg',
                'is_available': True,
            },
            {
                'name': 'Methi chapathi',
                'slug': 'methi-chapathi-pack-of-5',
                'pack_size': 'Pack of 10',
                'price': Decimal('110.00'),
                'description': 'Aromatic fenugreek leaf chapathi packet. Roast on tawa for fragrant, soft breakfast or dinner rotis at home.',
                'image': '/images/methi_chapathi.jpg',
                'is_available': True,
            },
            {
                'name': 'Ragi chapathi',
                'slug': 'ragi-chapathi-pack-of-5',
                'pack_size': 'Pack of 10',
                'price': Decimal('120.00'),
                'description': 'Calcium-rich finger millet flatbread packet. Roast on tawa with a touch of ghee for wholesome homemade nutrition.',
                'image': '/images/ragi_chapathi.jpg',
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
