import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const files = new Set(execFileSync('git', ['ls-files', '-z', '--', 'src'], {
    cwd: fileURLToPath(root), encoding: 'utf8',
}).split('\0'));

test('Git tracks all active and legacy cart files in one canonical-case directory', () => {
    const cart = [...files].filter(path => /^src\/components\/cart\//i.test(path)).sort();
    assert.deepEqual(cart, [
        'src/components/Cart/Cart.css',
        'src/components/Cart/Cart.jsx',
        'src/components/Cart/CartDrawer.tsx',
        'src/components/Cart/GlobalCartDrawer.tsx',
    ]);
});

test('all known storefront and legacy cart imports resolve by exact Git path case', () => {
    const edges = [
        ['src/components/layout/StorefrontShell.tsx', '@/components/Cart/GlobalCartDrawer', 'src/components/Cart/GlobalCartDrawer.tsx'],
        ['src/components/Cart/GlobalCartDrawer.tsx', '@/components/Cart/CartDrawer', 'src/components/Cart/CartDrawer.tsx'],
        ['src/App.js', './components/Cart/Cart', 'src/components/Cart/Cart.jsx'],
    ];
    for (const [source, alias, destination] of edges) {
        assert.equal(files.has(source), true, source);
        assert.equal(files.has(destination), true, destination);
        const content = readFileSync(new URL(source, root), 'utf8');
        const imports = [...content.matchAll(/\bfrom\s+['"]((?:@\/|\.\/)components\/cart\/[^'"]+)['"]/gi)];
        assert.deepEqual(imports.map(match => match[1]), [alias], source);
    }
});
