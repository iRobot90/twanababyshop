import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'twanababyshop_backend.settings')
django.setup()

from shop.models import Product, Category

print(f"Products count: {Product.objects.count()}")
print(f"Categories count: {Category.objects.count()}")
if Product.objects.count() > 0:
    print("Sample Product:", Product.objects.first().name)
    print("Sample Product Category:", Product.objects.first().category.slug)
