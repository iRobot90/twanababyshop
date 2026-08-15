const test = require('node:test');
const assert = require('node:assert/strict');
const { isMissingProductsTableError } = require('./schema.js');

test('detects missing products table errors from Supabase', () => {
  const error = {
    message: 'Database error querying schema: relation "public.products" does not exist',
  };

  assert.equal(isMissingProductsTableError(error), true);
});

test('ignores unrelated database errors', () => {
  const error = {
    message: 'permission denied for table products',
  };

  assert.equal(isMissingProductsTableError(error), false);
});
