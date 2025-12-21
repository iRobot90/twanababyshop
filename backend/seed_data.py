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
        {'name': 'Play Time', 'slug': 'play-time', 'image': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2670&auto=format&fit=crop'},
        {'name': 'Feeding', 'slug': 'feeding', 'image': 'https://images.unsplash.com/photo-1584143993372-e1cb8d9ec76f?q=80&w=2670&auto=format&fit=crop'},
        {'name': 'Travel Gear', 'slug': 'travel-gear', 'image': 'https://images.unsplash.com/photo-1521566869897-a75d50716c02?q=80&w=2670&auto=format&fit=crop'},
        {'name': 'Baby Care', 'slug': 'baby-care', 'image': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2670&auto=format&fit=crop'},
        {'name': 'Accessories', 'slug': 'accessories', 'image': 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop'},
    ]

    cat_objects = {}
    for cat_data in categories:
        category, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={
                'name': cat_data['name'],
                'image': cat_data['image']
            }
        )
        cat_objects[cat_data['slug']] = category
        if created:
            print(f'Created category: {category.name}')

    # Base Products for variety
    base_products = [
        # Featured / Highlights (Will appear first)
        {
            'name': 'MDF Baby Cot',
            'slug_base': 'mdf-baby-cot',
            'category_slug': 'nursery',
            'base_price': 15000.00,
            'age_group': '0-3y',
            'description': 'Crafted with premium MDF materials, this contemporary cot offers adjustable features and safety.',
            'image': 'https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=2636&auto=format&fit=crop'
        },
        {
            'name': 'Automatic Baby Swing',
            'slug_base': 'automatic-baby-swing',
            'category_slug': 'play-time',
            'base_price': 13500.00,
            'age_group': '0-12m',
            'description': 'A comfortable and automatic swing designed to soothe and entertain toddlers with ease.',
            'image': 'https://plus.unsplash.com/premium_photo-1663126543167-9d77f4803d29?q=80&w=2670&auto=format&fit=crop'
        },
        {
            'name': 'Foldable Baby Walker',
            'slug_base': 'foldable-baby-walker',
            'category_slug': 'play-time',
            'base_price': 3500.00,
            'age_group': '6-18m',
            'description': 'A portable walker featuring engaging music and toys to help your baby take their first steps.',
            'image': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2675&auto=format&fit=crop'
        },
        # Strollers
        {
            'name': 'Cloud Nine Smart Stroller',
            'slug_base': 'cloud-nine-stroller',
            'category_slug': 'strollers',
            'base_price': 115000.00,
            'age_group': '0-3y',
            'description': "The world's first anti-gravity suspension stroller. Floating comfort for your little one.",
            'image': 'https://images.unsplash.com/photo-1591027480007-a42f6ef886c3?q=80&w=2160&auto=format&fit=crop'
        },
        {
            'name': 'Urban Glide Pro',
            'slug_base': 'urban-glide',
            'category_slug': 'strollers',
            'base_price': 85000.00,
            'age_group': '0-4y',
            'description': "Perfect for city living, lightweight and durable.",
            'image': 'https://images.unsplash.com/photo-1591027480007-a42f6ef886c3?q=80&w=2160&auto=format&fit=crop'
        },
        # Nursery
        {
            'name': 'Dream Crib Material',
            'slug_base': 'dream-crib-material',
            'category_slug': 'nursery',
            'base_price': 45000.00,
            'age_group': '0-2y',
            'description': 'Breathable, organic cotton crib bedding set with cloud patterns.',
            'image': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2670&auto=format&fit=crop'
        },
        {
            'name': 'Moonlight Night Light',
            'slug_base': 'moonlight-night',
            'category_slug': 'nursery',
            'base_price': 3500.00,
            'age_group': '0+',
            'description': 'Soft glow night light to keep the monsters away.',
            'image': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2670&auto=format&fit=crop'
        },
            # Play Time (formerly Toys)
        {
            'name': 'Snuggle Bear Plush',
            'slug_base': 'snuggle-bear-plush',
            'category_slug': 'play-time',
            'base_price': 3500.00,
            'age_group': '0+',
            'description': 'Ultra-soft, hypoallergenic plush bear for endless cuddles.',
            'image': 'https://images.unsplash.com/photo-1555445054-dab4977539d3?q=80&w=2670&auto=format&fit=crop'
        },
        {
            'name': 'Wooden Building Blocks',
            'slug_base': 'wooden-blocks',
            'category_slug': 'play-time',
            'base_price': 4200.00,
            'age_group': '2y+',
            'description': 'Sustainable wooden blocks for creative minds.',
            'image': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2670&auto=format&fit=crop'
        },
        # Moved to top: Automatic Baby Swing, Foldable Baby Walker
        # Clothing
        {
            'name': 'Organic Cotton Onesie Set',
            'slug_base': 'organic-cotton-onesie-set',
            'category_slug': 'clothing',
            'base_price': 6500.00,
            'age_group': '0-6m',
            'description': 'Pack of 3 buttery soft onesies in pastel colors.',
            'image': 'https://images.unsplash.com/photo-1519238263496-63f82a0ef963?q=80&w=2670&auto=format&fit=crop'
        },
        {
            'name': 'Cozy Knit Sweater',
            'slug_base': 'cozy-knit-sweater',
            'category_slug': 'clothing',
            'base_price': 5500.00,
            'age_group': '1-2y',
            'description': 'Warm and stylish knit sweater for chilly days.',
            'image': 'https://images.unsplash.com/photo-1519238263496-63f82a0ef963?q=80&w=2670&auto=format&fit=crop'
        },
        # Nursery (New Additions) moved to top
        # Travel Gear
        {
            'name': 'Portable 2-in-1 Rocker',
            'slug_base': 'portable-2in1-rocker',
            'category_slug': 'travel-gear',
            'base_price': 2900.00,
            'age_group': '0-9m',
            'description': 'Lightweight and portable rocker that transitions easily to keep your baby comfortable anywhere.',
            'image': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2670&auto=format&fit=crop'
        },
        # Feeding
        {
            'name': 'Silicone Feeding Set',
            'slug_base': 'silicone-feeding-set',
            'category_slug': 'feeding',
            'base_price': 2500.00,
            'age_group': '6m+',
            'description': 'Safe, BPA-free silicone bib, bowl, and spoon set for messy eaters.',
            'image': 'https://images.unsplash.com/photo-1584143993372-e1cb8d9ec76f?q=80&w=2670&auto=format&fit=crop'
        }
    ]

    import random

    total_products = 0
    target_products = 105 # Aiming for 100+

    # First, ensure base products exist (8 products)
    for i, prod_data in enumerate(base_products):
        # We'll create roughly 13 variations of each base product to get ~104 items
        for j in range(13):
             # Get category instance
            if 'category_slug' in prod_data:
                category = cat_objects[prod_data['category_slug']]
            else:
                continue

            variation_name = f"{prod_data['name']}"
            if j > 0:
                variation_name += f" - Edition {j}"
            
            variation_slug = f"{prod_data['slug_base']}"
            if j > 0:
                 variation_slug += f"-v{j}"
            
            # Vary price slightly
            price_variance = random.uniform(0.8, 1.2)
            final_price = round(prod_data['base_price'] * price_variance, -2) # Round to nearest 100

            product, created = Product.objects.get_or_create(
                slug=variation_slug,
                defaults={
                    'category': category,
                    'name': variation_name,
                    'price': final_price,
                    'description': prod_data['description'],
                    'age_group': prod_data['age_group'],
                    'image': prod_data['image'],
                    'available': True
                }
            )
            if created:
                 total_products += 1

    print(f'Successfully seeded {total_products} products across categories.')

if __name__ == '__main__':
    seed_data()
