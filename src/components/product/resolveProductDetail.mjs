export function resolveProductDetail(products, slug) {
    if (!slug) return null;
    const visible = products.filter(item => item && item.is_active !== false);
    const matches = visible.filter(item => item.slug === slug);
    if (matches.length !== 1) return null;
    const [product] = matches;
    return {
        product,
        relatedProducts: visible.filter(item => item.id !== product.id && item.slug !== slug).slice(0, 3),
    };
}
