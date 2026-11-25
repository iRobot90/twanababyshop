import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveProductDetail } from '../src/components/product/resolveProductDetail.mjs';

const rings = { id: 1, slug: 'stacking-rings', is_active: true };
const stroller = { id: 2, slug: 'folding-stroller', is_active: true };
const hidden = { id: 3, slug: 'retired-harness', is_active: false };

test('explicit second item wins; an unrelated first item is never substituted', () => {
    assert.deepEqual(resolveProductDetail([rings, stroller, hidden], stroller.slug), {
        product: stroller, relatedProducts: [rings],
    });
    for (const slug of ['removed-item', 'Folding-stroller', hidden.slug, null, '']) {
        assert.equal(resolveProductDetail([rings, stroller, hidden], slug), null);
    }
});

test('an ambiguous active slug fails closed; an archived duplicate does not hide the active item', () => {
    assert.equal(resolveProductDetail([rings, { ...stroller, slug: rings.slug }], rings.slug), null);
    assert.deepEqual(resolveProductDetail([rings, { ...hidden, slug: rings.slug }], rings.slug), {
        product: rings, relatedProducts: [],
    });
});
