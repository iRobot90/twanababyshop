import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'twanababyshop_backend.settings')
django.setup()

from shop.models import Category, Product

print(f'Categories: {Category.objects.count()}')
print(f'Products: {Product.objects.count()}')
