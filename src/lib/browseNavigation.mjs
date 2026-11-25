const supportedOrdering = new Set(['price', '-price', '-created']);

/** @param {string | null} value */
export function catalogOrdering(value) {
    return typeof value === 'string' && supportedOrdering.has(value) ? value : '';
}

/** @param {{get: (key: string) => string | null}} source @param {string | null} ordering */
function collectBrowseParams(source, ordering) {
    const target = new URLSearchParams();
    for (const name of ['category', 'search']) {
        const value = source.get(name);
        if (value) target.set(name, value);
    }
    const sort = catalogOrdering(ordering);
    if (sort) target.set('ordering', sort);
    return target;
}

/** @param {{get: (key: string) => string | null}} source @param {string | null} [ordering] */
export function shopHref(source, ordering = source.get('ordering')) {
    const query = collectBrowseParams(source, ordering).toString();
    return query ? '/shop?' + query : '/shop';
}

/** @param {string} slug @param {{get: (key: string) => string | null}} source */
export function shopProductHref(slug, source) {
    const query = new URLSearchParams([['slug', slug]]);
    collectBrowseParams(source, source.get('ordering')).forEach((value, key) => query.append(key, value));
    return '/product?' + query.toString();
}
