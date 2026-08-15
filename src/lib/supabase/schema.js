function isMissingProductsTableError(error) {
  const message = typeof error?.message === 'string' ? error.message : '';

  if (!message) {
    return false;
  }

  const normalized = message.toLowerCase();

  return (
    normalized.includes('database error querying schema') ||
    normalized.includes('relation "public.products" does not exist') ||
    normalized.includes('relation "products" does not exist') ||
    normalized.includes('does not exist') && normalized.includes('products') ||
    normalized.includes('schema cache') ||
    normalized.includes('public.products')
  );
}

module.exports = {
  isMissingProductsTableError,
};
