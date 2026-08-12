import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth';
import { uploadProductImages } from '@/lib/products/storage';
import type { ProductRecord } from '@/lib/products/types';
import { MAX_IMAGES_PER_PRODUCT, validateProductForm } from '@/lib/products/validation';

export async function GET() {
    const { supabase, error } = await requireAdmin();
    if (error) {
        return NextResponse.json({ error }, { status: error === 'Admin access required' ? 403 : 401 });
    }

    const { data, error: dbError } = await supabase!
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (dbError) {
        const message = dbError.message.includes('does not exist') || dbError.message.includes('schema cache')
            ? 'The Supabase products table has not been created yet. Run the SQL in supabase/migrations/20260327120000_create_products.sql in your Supabase SQL Editor.'
            : dbError.message;
        return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ products: data as ProductRecord[] });
}

export async function POST(request: Request) {
    const { supabase, error } = await requireAdmin();
    if (error) {
        return NextResponse.json({ error }, { status: error === 'Admin access required' ? 403 : 401 });
    }

    try {
        const formData = await request.formData();
        const validation = validateProductForm({
            title: formData.get('title'),
            description: formData.get('description'),
            price: formData.get('price'),
            stock_quantity: formData.get('stock_quantity'),
            category: formData.get('category'),
            is_active: formData.get('is_active'),
        });

        if (!validation.valid || !validation.data) {
            return NextResponse.json(
                { error: 'Validation failed', errors: validation.errors },
                { status: 400 }
            );
        }

        const imageFiles = formData
            .getAll('images')
            .filter((entry): entry is File => entry instanceof File && entry.size > 0);

        if (imageFiles.length > MAX_IMAGES_PER_PRODUCT) {
            return NextResponse.json(
                { error: `You can upload up to ${MAX_IMAGES_PER_PRODUCT} images per product` },
                { status: 400 }
            );
        }

        let imageUrls: string[] = [];
        if (imageFiles.length > 0) {
            const uploadResult = await uploadProductImages(supabase!, imageFiles);
            imageUrls = uploadResult.urls;

            if (imageUrls.length === 0) {
                return NextResponse.json(
                    { error: 'Image upload failed', errors: uploadResult.errors },
                    { status: 400 }
                );
            }

            if (uploadResult.errors.length > 0) {
                return NextResponse.json(
                    {
                        error: 'Some images failed to upload',
                        errors: uploadResult.errors,
                        partial_urls: imageUrls,
                    },
                    { status: 400 }
                );
            }
        }

        const { data, error: insertError } = await supabase!
            .from('products')
            .insert({
                title: validation.data.title,
                description: validation.data.description || null,
                price: validation.data.price,
                stock_quantity: validation.data.stock_quantity,
                category: validation.data.category,
                image_url: imageUrls,
                is_active: validation.data.is_active,
            })
            .select('*')
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json(
            {
                message: 'Product created successfully',
                product: data as ProductRecord,
            },
            { status: 201 }
        );
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
