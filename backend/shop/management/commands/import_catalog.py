import csv
import json
import os
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify

from shop.models import Category, Product


class Command(BaseCommand):
    help = 'Import catalog data from a JSON or CSV file into the existing Django Category/Product models'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help='Path to the import file (.json or .csv)')
        parser.add_argument('--clear', action='store_true', help='Clear existing products/categories before importing')

    def handle(self, *args, **options):
        file_path = Path(options['file_path']).expanduser().resolve()
        if not file_path.exists():
            raise CommandError(f'File not found: {file_path}')

        if options['clear']:
            Product.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write(self.style.WARNING('Cleared existing catalog data.'))

        if file_path.suffix.lower() == '.json':
            rows = self._load_json(file_path)
        elif file_path.suffix.lower() == '.csv':
            rows = self._load_csv(file_path)
        else:
            raise CommandError('Supported formats: .json or .csv')

        created_categories = 0
        created_products = 0
        updated_products = 0

        for row in rows:
            category_name = (row.get('category') or row.get('category_name') or row.get('collection') or 'General').strip()
            category_slug = slugify(category_name) or 'general'
            category, category_created = Category.objects.get_or_create(
                slug=category_slug,
                defaults={'name': category_name, 'image': row.get('category_image') or ''}
            )
            if category_created:
                created_categories += 1

            product_name = (row.get('name') or row.get('title') or row.get('product_name') or 'Untitled Product').strip()
            product_slug = (row.get('slug') or row.get('id') or slugify(product_name) or 'product').strip()
            if not product_slug:
                product_slug = slugify(product_name)

            defaults = {
                'category': category,
                'name': product_name,
                'description': row.get('description') or '',
                'image': row.get('image') or row.get('image_url') or '',
                'price': self._parse_price(row.get('price') or row.get('price_kes') or 0),
                'age_group': self._parse_age_group(row.get('age_group') or row.get('age') or '0-6m'),
                'available': self._parse_bool(row.get('available', True)),
            }

            product, created = Product.objects.update_or_create(
                slug=product_slug,
                defaults=defaults,
            )
            if created:
                created_products += 1
            else:
                updated_products += 1

        self.stdout.write(self.style.SUCCESS(
            f'Imported catalog: {created_categories} categories, {created_products} new products, {updated_products} updated products.'
        ))

    def _load_json(self, file_path: Path):
        with file_path.open('r', encoding='utf-8') as fh:
            payload = json.load(fh)
        if isinstance(payload, list):
            return payload
        if isinstance(payload, dict):
            for key in ('products', 'items', 'data'):
                value = payload.get(key)
                if isinstance(value, list):
                    return value
            return [payload]
        return []

    def _load_csv(self, file_path: Path):
        with file_path.open('r', encoding='utf-8-sig', newline='') as fh:
            reader = csv.DictReader(fh)
            return list(reader)

    def _parse_price(self, value):
        if value in (None, '', 'None'):
            return Decimal('0.00')
        try:
            return Decimal(str(value).replace(',', '').replace('KES', '').replace('ksh', '').strip())
        except Exception:
            return Decimal('0.00')

    def _parse_age_group(self, value):
        if not value:
            return '0-6m'
        value = str(value).strip().lower()
        mapping = {
            '0-6m': '0-6m',
            '0-12m': '6-12m',
            '6-12m': '6-12m',
            '1-2y': '1-2y',
            '2-4y': '2-4y',
            '4y+': '4y+',
            '0+': '0-6m',
        }
        return mapping.get(value, '0-6m')

    def _parse_bool(self, value):
        if isinstance(value, bool):
            return value
        if isinstance(value, (int, float)):
            return bool(value)
        if isinstance(value, str):
            return value.strip().lower() not in {'false', '0', 'no', 'off', 'none'}
        return True
