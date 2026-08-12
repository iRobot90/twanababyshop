import type { ProductFormInput, ProductValidationResult } from './types';

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_STOCK = 1_000_000;

export function validateProductForm(raw: Record<string, FormDataEntryValue | null>): ProductValidationResult {
    const errors: Record<string, string> = {};

    const title = String(raw.title ?? '').trim();
    const description = String(raw.description ?? '').trim();
    const category = String(raw.category ?? '').trim();
    const isActiveRaw = String(raw.is_active ?? 'true');

    const price = Number(raw.price);
    const stockQuantity = raw.stock_quantity === null || raw.stock_quantity === ''
        ? 0
        : Number(raw.stock_quantity);

    if (!title) {
        errors.title = 'Title is required';
    } else if (title.length > MAX_TITLE_LENGTH) {
        errors.title = `Title must be ${MAX_TITLE_LENGTH} characters or fewer`;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
        errors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer`;
    }

    if (!Number.isFinite(price) || price <= 0) {
        errors.price = 'Price must be a positive number';
    }

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
        errors.stock_quantity = 'Stock must be a non-negative whole number';
    } else if (stockQuantity > MAX_STOCK) {
        errors.stock_quantity = `Stock cannot exceed ${MAX_STOCK.toLocaleString()}`;
    }

    if (Object.keys(errors).length > 0) {
        return { valid: false, errors };
    }

    const data: ProductFormInput = {
        title,
        description,
        price,
        stock_quantity: stockQuantity,
        category: category || 'general',
        is_active: isActiveRaw !== 'false',
    };

    return { valid: true, errors, data };
}

export const PRODUCT_CATEGORIES = [
    'strollers',
    'nursery',
    'clothing',
    'play-time',
    'feeding',
    'travel-gear',
    'baby-care',
    'accessories',
    'general',
] as const;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES_PER_PRODUCT = 5;
