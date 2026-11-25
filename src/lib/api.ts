import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const normalizeProduct = (product: any) => {
    const title = product?.title || product?.name || 'Untitled product';
    const slug = product?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `product-${product?.id}`;
    const categoryValue = product?.category;
    const categoryName = typeof categoryValue === 'string'
        ? categoryValue
        : categoryValue?.name || 'General';
    const categorySlug = typeof categoryValue === 'string'
        ? categoryValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'general'
        : categoryValue?.slug || categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'general';

    return {
        ...product,
        id: product?.id,
        name: title,
        slug,
        price: Number(product?.price ?? 0),
        image: product?.image || (Array.isArray(product?.image_url) ? product.image_url[0] : product?.image_url || ''),
        description: product?.description || '',
        category: {
            name: categoryName,
            slug: categorySlug,
        },
        stock_quantity: Number(product?.stock_quantity ?? 0),
        is_active: product?.is_active ?? true,
    };
};

export const fetchProducts = async (params?: { category?: string; search?: string; ordering?: string }) => {
    try {
        const response = await api.get('/api/products', {
            params: {
                category: params?.category,
                search: params?.search,
                ordering: params?.ordering,
            },
        });

        const payload = response.data;
        const products = Array.isArray(payload) ? payload : payload?.products || payload?.results || [];

        return (Array.isArray(products) ? products : []).map(normalizeProduct);
    } catch (error) {
        if (axios.isAxiosError(error) && (error.code === 'ERR_NETWORK' || error.message.includes('Network Error'))) {
            return [];
        }
        throw error;
    }
};

// Browse needs to distinguish a successful empty list from a failed catalog request.
export async function fetchShopProducts(
    params: { category?: string; search?: string; ordering?: string },
    signal: AbortSignal,
) {
    const { data } = await api.get('/api/products', { params, signal, timeout: 12000 });
    const products = Array.isArray(data) ? data : data?.products ?? data?.results;
    if (!Array.isArray(products)) {
        throw new Error('Catalog response did not contain a product list');
    }
    return products.map(normalizeProduct);
}

export const fetchProduct = async (slug: string) => {
    const response = await api.get('/api/products', {
        params: { slug },
    });

    const payload = response.data;
    const products = Array.isArray(payload) ? payload : payload?.products || payload?.results || [];
    const normalized = (Array.isArray(products) ? products : []).map(normalizeProduct);

    return normalized.find((product) => product.slug === slug) || normalized[0] || null;
};

export const fetchCategories = async () => {
    try {
        const response = await api.get('/api/products');
        const payload = response.data;
        const products = Array.isArray(payload) ? payload : payload?.products || payload?.results || [];
        const categories = Array.from(new Set((products as any[]).map((product) => product?.category?.name || 'General')));

        return categories.map((name, index) => ({
            id: index + 1,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'general',
            name,
            image: '',
        }));
    } catch {
        return [];
    }
};

export const createOrder = async (orderData: any) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
};
