import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'twanababyshop_backend.settings')
django.setup()

from shop.models import Category, Product

def seed_data():
    # Clear existing data
    Product.objects.all().delete()
    Category.objects.all().delete()
    print("Cleared existing data.")

    # Categories (Happy & Vibrant)
    categories = [
        {'name': 'Strollers', 'slug': 'strollers', 'image': 'https://images.unsplash.com/photo-1591027480007-a42f6ef886c3?q=80&w=2160&auto=format&fit=crop'},
        {'name': 'Nursery', 'slug': 'nursery', 'image': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2670&auto=format&fit=crop'},
        {'name': 'Clothing', 'slug': 'clothing', 'image': 'https://images.unsplash.com/photo-1519238263496-63f82a0ef963?q=80&w=2670&auto=format&fit=crop'},
        {'name': 'Toys', 'slug': 'toys', 'image': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2670&auto=format&fit=crop'},
    ]

    cat_objects = {}
    for cat_data in categories:
        category, created = Category.objects.get_or_create(name=cat_data['name'], slug=cat_data['slug'])
        cat_objects[cat_data['slug']] = category
        if created:
            print(f'Created category: {category.name}')

    # Products (Vibrant & Premium)
    products = [
        # Strollers
        {
            'name': 'Cloud Nine Smart Stroller',
            'slug': 'cloud-nine-stroller',
            'category_slug': 'strollers',
            'price': 115000.00,
            'age_group': '0-3y',
            'description': "The world's first anti-gravity suspension stroller. Floating comfort for your little one, feather-light handling for you. Crafted with sustainable cloud-foam materials.",
            'image': 'https://images.unsplash.com/photo-1591027480007-a42f6ef886c3?q=80&w=2160&auto=format&fit=crop'
        },
        {
            'name': 'Dream Crib Material',
            'slug': 'dream-crib-material',
            'category_slug': 'nursery',
            'price': 45000.00,
            'age_group': '0-2y',
            'description': 'Breathable, organic cotton crib bedding set with cloud patterns.',
            'image': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2670&auto=format&fit=crop'
        },
        {
            'name': 'Snuggle Bear Plush',
            'slug': 'snuggle-bear-plush',
            'category_slug': 'toys',
            'price': 3500.00,
            'age_group': '0+',
            'description': 'Ultra-soft, hypoallergenic plush bear for endless cuddles.',
            'image': 'https://images.unsplash.com/photo-1555445054-dab4977539d3?q=80&w=2670&auto=format&fit=crop'
        },
        {
            'name': 'Organic Cotton Onesie Set',
            'slug': 'organic-cotton-onesie-set',
            'category_slug': 'clothing',
            'price': 6500.00,
            'age_group': '0-6m',
            'description': 'Pack of 3 buttery soft onesies in pastel colors.',
            'image': 'https://images.unsplash.com/photo-1519238263496-63f82a0ef963?q=80&w=2670&auto=format&fit=crop'
        }
    ]

    for prod_data in products:
        # Get category instance
        if 'category_slug' in prod_data:
             category = cat_objects[prod_data['category_slug']]
        else:
             print(f"Skipping {prod_data['name']} (no category)")
             continue
             
        product, created = Product.objects.get_or_create(
            slug=prod_data['slug'],
            defaults={
                'category': category,
                'name': prod_data['name'],
                'price': prod_data['price'],
                'description': prod_data['description'],
                'age_group': prod_data['age_group'],
                'image': prod_data['image'],
                'available': True
            }
        )
        # Verify image saves in a real scenario, here we just assume URL frontend handling or download
        # For this demo, we won't actually download to 'media' to keep it simple, 
        # but we'll print that we set it up.
        if created:
            print(f'Created product: {product.name}')

if __name__ == '__main__':
    seed_data()
