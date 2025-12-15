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

    # Categories
    categories = [
        {'name': 'Clothing', 'slug': 'clothing', 'image_url': 'https://images.unsplash.com/photo-1522771753035-0a153950c6f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'},
        {'name': 'Diapers', 'slug': 'diapers', 'image_url': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'},
        {'name': 'Toys', 'slug': 'toys', 'image_url': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'},
        {'name': 'Feeding', 'slug': 'feeding', 'image_url': 'https://images.unsplash.com/photo-1584143997633-58e65f215758?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'},
        {'name': 'Furniture', 'slug': 'furniture', 'image_url': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'},
    ]

    for cat_data in categories:
        category, created = Category.objects.get_or_create(name=cat_data['name'], slug=cat_data['slug'])
        if created:
            print(f'Created category: {category.name}')

    # Products with Age Groups
    products = [
        # Clothing
        {'category': 'Clothing', 'name': 'Newborn Onesie Set', 'slug': 'newborn-onesie-set', 'price': 2500.00, 'age_group': '0-6m', 'description': 'Pack of 3 soft cotton onesies.', 'image_url': 'https://images.unsplash.com/photo-1522771753035-0a153950c6f2'},
        {'category': 'Clothing', 'name': 'Toddler T-Shirt', 'slug': 'toddler-t-shirt', 'price': 1200.00, 'age_group': '1-2y', 'description': 'Cool graphic tee for toddlers.', 'image_url': 'https://images.unsplash.com/photo-1519238263496-63f82a0ef963'},
        {'category': 'Clothing', 'name': 'Preschool Dress', 'slug': 'preschool-dress', 'price': 1800.00, 'age_group': '2-4y', 'description': 'Lovely floral dress.', 'image_url': 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7'},
        
        # Diapers
        {'category': 'Diapers', 'name': 'Newborn Diapers (Pack of 80)', 'slug': 'newborn-diapers-80', 'price': 3000.00, 'age_group': '0-6m', 'description': 'Gentle protection for newborns.', 'image_url': 'https://images.unsplash.com/photo-1519689680058-324335c77eba'},
        {'category': 'Diapers', 'name': 'Size 4 Diapers (Pack of 50)', 'slug': 'size-4-diapers-50', 'price': 2800.00, 'age_group': '6-12m', 'description': 'For active crawlers.', 'image_url': 'https://images.unsplash.com/photo-1519689680058-324335c77eba'},
        
        # Toys
        {'category': 'Toys', 'name': 'Soft Rattle', 'slug': 'soft-rattle', 'price': 800.00, 'age_group': '0-6m', 'description': 'Stimulates senses.', 'image_url': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1'},
        {'category': 'Toys', 'name': 'Building Blocks', 'slug': 'building-blocks', 'price': 2000.00, 'age_group': '2-4y', 'description': 'Classic wooden blocks.', 'image_url': 'https://images.unsplash.com/photo-1587654780291-39c940483719'},
        {'category': 'Toys', 'name': 'Educational Tablet', 'slug': 'educational-tablet', 'price': 4500.00, 'age_group': '4y+', 'description': 'Interactive learning toy.', 'image_url': 'https://images.unsplash.com/photo-1587654780291-39c940483719'},

        # Feeding
        {'category': 'Feeding', 'name': 'Starter Bottle Set', 'slug': 'starter-bottle-set', 'price': 3500.00, 'age_group': '0-6m', 'description': 'Everything needed for bottle feeding.', 'image_url': 'https://images.unsplash.com/photo-1584143997633-58e65f215758'},
        {'category': 'Feeding', 'name': 'Sippy Cup', 'slug': 'sippy-cup', 'price': 600.00, 'age_group': '6-12m', 'description': 'Spill-proof cup.', 'image_url': 'https://images.unsplash.com/photo-1584143997633-58e65f215758'},
        
        # Furniture
        {'category': 'Furniture', 'name': 'Crib', 'slug': 'crib', 'price': 15000.00, 'age_group': '0-6m', 'description': 'Safe and sturdy crib.', 'image_url': 'https://images.unsplash.com/photo-1519689680058-324335c77eba'},
    ]

    for prod_data in products:
        category = Category.objects.get(name=prod_data['category'])
        product, created = Product.objects.get_or_create(
            slug=prod_data['slug'],
            defaults={
                'category': category,
                'name': prod_data['name'],
                'price': prod_data['price'],
                'description': prod_data['description'],
                'age_group': prod_data['age_group'],
                # 'image': prod_data['image_url'] # In real app, download image
            }
        )
        if created:
            print(f'Created product: {product.name} ({product.get_age_group_display()})')

if __name__ == '__main__':
    seed_data()
