import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isMissingProductsTableError } from '@/lib/supabase/schema';

function slugify(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const requestedSlug = searchParams.get('slug')?.trim();
    const requestedCategory = searchParams.get('category')?.trim();
    const requestedSearch = searchParams.get('search')?.trim();
    const requestedOrdering = searchParams.get('ordering')?.trim();

    const { data, error } = await supabase
        .from('products')
        .select('id, title, description, price, stock_quantity, category, image_url, is_active, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        const message = isMissingProductsTableError(error)
            ? 'The Supabase products table has not been created yet. Run the SQL in supabase/migrations/20260327120000_create_products.sql in your Supabase SQL Editor.'
            : error.message;

        return NextResponse.json({ error: message }, { status: 500 });
    }

    const normalized = (data ?? []).map((product: any) => {
        const title = product.title || 'Untitled product';
        const slug = product.slug || slugify(title);
        const categoryName = product.category || 'General';
        const categorySlug = slugify(categoryName);

        return {
            id: product.id,
            name: title,
            slug,
            title,
            description: product.description || '',
            price: Number(product.price ?? 0),
            image: Array.isArray(product.image_url) ? product.image_url[0] : product.image_url || '',
            category: {
                name: categoryName,
                slug: categorySlug,
            },
            stock_quantity: Number(product.stock_quantity ?? 0),
            is_active: product.is_active ?? true,
            created_at: product.created_at,
        };
    });

    let filtered = normalized;

    if (requestedSlug) {
        filtered = filtered.filter((product) => product.slug === requestedSlug || product.title === requestedSlug);
    }

    if (requestedCategory) {
        filtered = filtered.filter((product) => product.category.slug === requestedCategory || product.category.name.toLowerCase() === requestedCategory.toLowerCase());
    }

    if (requestedSearch) {
        const term = requestedSearch.toLowerCase();
        filtered = filtered.filter((product) =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.category.name.toLowerCase().includes(term)
        );
    }

    if (requestedOrdering === 'price') {
        filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (requestedOrdering === '-price') {
        filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (requestedOrdering === '-created') {
        filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return NextResponse.json({ products: filtered });
}
