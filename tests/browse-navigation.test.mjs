import assert from 'node:assert/strict';
import test from 'node:test';
import { catalogOrdering, shopHref, shopProductHref } from '../src/lib/browseNavigation.mjs';

test('shop cards keep browse options and product Back reconstructs the original local route', () => {
    const params = new URLSearchParams({ category: 'clothing', search: '& kid’s hats', ordering: '-price' });
    const product = new URL(shopProductHref('last / one', params), 'http://fixture.invalid');
    assert.equal(product.pathname, '/product');
    assert.equal(product.searchParams.get('slug'), 'last / one');
    assert.equal(shopHref(product.searchParams), '/shop?' + params);
    assert.equal(shopHref(params, ''), '/shop?category=clothing&search=%26+kid%E2%80%99s+hats');
});

test('unsupported order, unrelated parameters, and an arbitrary redirect target are ignored', () => {
    const params = new URLSearchParams('slug=test&ordering=bogus&returnTo=//unrelated.invalid&next=/checkout');
    assert.equal(catalogOrdering(params.get('ordering')), '');
    assert.equal(shopHref(params), '/shop');
    assert.equal(shopProductHref('test', params), '/product?slug=test');
    assert.equal(catalogOrdering(null), '');
});
