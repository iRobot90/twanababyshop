const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const { execFileSync } = require('node:child_process');
const { join } = require('node:path');
const { createRequire } = require('node:module');
const ts = require('typescript');

const root = join(__dirname, '..');
const fixture = { id: 12, slug: 'fixture-rings', name: 'Fixture rings', price: 200, stock_quantity: 3 };
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

function compile(path, mocks = {}, timer = setTimeout, untimer = clearTimeout) {
    const file = join(root, path);
    const body = process.env.QA_BASELINE
        ? execFileSync('git', ['-C', root, 'show', process.env.QA_BASELINE + ':' + path], { encoding: 'utf8' })
        : readFileSync(file, 'utf8');
    const js = ts.transpileModule(body, {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    const mod = { exports: {} }, resolve = createRequire(file);
    const use = name => Object.hasOwn(mocks, name) ? mocks[name] : resolve(name);
    new Function('require', 'module', 'exports', 'setTimeout', 'clearTimeout', js)(use, mod, mod.exports, timer, untimer);
    return mod.exports;
}

const store = compile('src/lib/store.ts').useCartStore;
const jsx = (type, props) => ({ type, props });
const mockIcons = new Proxy({}, { get: (_, key) => key });
const common = {
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    '@/lib/store': { useCartStore: () => store.getState() },
    '@/lib/utils': { formatCurrency: value => String(value) },
    '@/lib/browseNavigation.mjs': require('../src/lib/browseNavigation.mjs'),
    'framer-motion': { AnimatePresence: 'motion-wrapper', motion: { div: 'div' } },
    'lucide-react': mockIcons,
    'next/image': 'img',
    'next/link': 'a',
};
function traverse(node) {
    if (Array.isArray(node)) return node.flatMap(traverse);
    if (node && typeof node === 'object') return [node, ...traverse(node.props.children)];
    return [];
}
function text(node) {
    if (Array.isArray(node)) return node.map(text).join('');
    if (node && typeof node === 'object') return text(node.props.children);
    return typeof node === 'string' ? node : '';
}
function button(view, expected) {
    const target = traverse(view).find(node => node.type === 'button' && text(node).trim() === expected);
    assert(target, 'missing button: ' + expected);
    return target;
}
function productHarness() {
    let cursor = 0;
    const states = new Map(), effects = new Map(), timers = new Map();
    let timerId = 0, slug = fixture.slug;
    let queue;
    const react = {
        useState(initial) {
            const i = cursor++;
            if (!states.has(i)) states.set(i, initial);
            return [states.get(i), value => states.set(i, typeof value === 'function' ? value(states.get(i)) : value)];
        },
        useEffect(run, deps) {
            const i = cursor++;
            const previous = effects.get(i);
            if (previous && deps.every((v, j) => v === previous.deps[j])) return;
            queue.push(() => { previous?.cleanup?.(); effects.set(i, { deps, cleanup: run() }); });
        },
    };
    const Product = compile('src/components/product/ProductContainer.tsx', {
        ...common,
        react,
        './SizeGuideModal': 'size-guide',
        'next/navigation': { useSearchParams: () => new URLSearchParams({ slug }) },
        '@/lib/api': { fetchShopProducts: async () => [fixture, { ...fixture, slug: 'fixture-other', id: 13 }] },
        './resolveProductDetail.mjs': {
            resolveProductDetail: (records, slug) => {
                const product = records.find(item => item.slug === slug);
                return product ? { product, relatedProducts: [] } : null;
            },
        },
    }, fn => { const id = ++timerId; timers.set(id, fn); return id; }, id => timers.delete(id)).default;
    function render() {
        cursor = 0;
        queue = [];
        const view = Product();
        queue.forEach(run => run());
        return view;
    }
    return { render, timers, navigate(next) { slug = next; } };
}
function quantities() {
    return store.getState().items.map(({ color, quantity }) => [color, quantity]);
}

test('product button acknowledges only an actual addition and re-enables for retry at the cap', async () => {
    store.getState().clearCart();
    store.getState().addToCart(fixture);
    store.getState().addToCart(fixture);
    const app = productHarness();
    app.render();
    await Promise.resolve();
    button(app.render(), 'Add to Cart').props.onClick();
    assert.deepEqual(quantities(), [[undefined, 3]]);
    assert(button(app.render(), 'Added to Cart').props.disabled);
    const [oldTimer] = app.timers.values();
    oldTimer();
    button(app.render(), 'Add to Cart').props.onClick();
    const refused = app.render();
    assert.deepEqual(quantities(), [[undefined, 3]]);
    assert.equal(button(refused, 'Add to Cart').props.disabled, false);
    assert(traverse(refused).some(node => node.props.role === 'status' && text(node).includes('quantity limit')));
    app.navigate('fixture-other');
    app.render();
    await Promise.resolve();
    button(app.render(), 'Add to Cart').props.onClick();
    assert(button(app.render(), 'Added to Cart').props.disabled);
    oldTimer(); // old product's pending timer cannot clear feedback for the new product
    assert(button(app.render(), 'Added to Cart').props.disabled);
});

test('drawer minus decreases the chosen line; reaching zero preserves a different color', () => {
    store.getState().clearCart();
    store.getState().addToCart({ ...fixture, color: 'Coral' });
    store.getState().addToCart({ ...fixture, color: 'Coral' });
    store.getState().addToCart({ ...fixture, color: 'Blue' });
    const Drawer = compile('src/components/Cart/CartDrawer.tsx', common).default;
    function decrement() {
        const minus = traverse(Drawer({ isOpen: true })).find(node =>
            node.type === 'button' && traverse(node.props.children).some(child => child.type === 'Minus'));
        assert(minus, 'missing minus action');
        minus.props.onClick();
    }
    decrement();
    assert.deepEqual(quantities(), [['Coral', 1], ['Blue', 1]]);
    decrement();
    assert.deepEqual(quantities(), [['Blue', 1]]);
    assert.equal(store.getState().total(), 200);
});
