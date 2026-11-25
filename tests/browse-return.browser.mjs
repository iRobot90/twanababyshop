// Run with a local Next server and a disposable Chrome CDP session.
// Defaults: NEXT http://127.0.0.1:3197, Chrome --remote-debugging-port=3195.
import assert from 'node:assert/strict';
import test from 'node:test';
const [base = 'http://127.0.0.1:3197', chrome = 'http://127.0.0.1:3195'] = process.argv.slice(2);
const target = (await (await fetch(chrome + '/json/list')).json()).find(item => item.type === 'page');
assert.ok(target, 'A disposable Chrome page is required');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
});
let counter = 0;
const pending = new Map();
let onRequest = () => {};
socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
        const [resolve, reject] = pending.get(message.id) ?? [];
        pending.delete(message.id);
        if (message.error) reject?.(new Error(message.error.message));
        else resolve?.(message.result);
    }
    if (message.method === 'Fetch.requestPaused') onRequest(message.params);
});
const send = (method, params) => new Promise((resolve, reject) => {
    const id = ++counter;
    pending.set(id, [resolve, reject]);
    socket.send(JSON.stringify({ id, method, params }));
});
const jsonResponse = (requestId, body, responseCode = 200) => send('Fetch.fulfillRequest', {
    requestId,
    responseCode,
    responseHeaders: [{ name: 'Content-Type', value: 'application/json' }],
    body: Buffer.from(JSON.stringify(body)).toString('base64'),
});
const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? 'Page evaluation failed');
    return result.result.value;
};
const eventually = async (expression, timeout = 20000) => {
    const until = Date.now() + timeout;
    while (Date.now() < until) {
        try { if (await evaluate(expression)) return; } catch {}
        await new Promise(resolve => setTimeout(resolve, 120));
    }
    throw new Error('Timed out waiting for ' + expression + '\n' + await evaluate('document.body?.innerText'));
};
const visible = string => '(document.body?.innerText ?? "").includes(' + JSON.stringify(string) + ')';
const wanted = { id: 712, slug: 'fixture-soft-rings', name: 'Fixture soft rings', image: '/file.svg', category: { name: 'Clothing', slug: 'clothing' }, price: 1200, stock_quantity: 2 };
const other = { id: 522, slug: 'fixture-other-item', name: 'Fixture other item', category: { name: 'General', slug: 'general' }, price: 1900, stock_quantity: 1 };
const original = '?category=clothing&search=soft';
const sorted = original + '&ordering=-created';
const productPath = '/product?slug=' + wanted.slug + '&' + sorted.slice(1);
const backPath = '/shop' + sorted;
const requests = [];
let fixtureProblem;
onRequest = ({ requestId, request }) => {
    const url = new URL(request.url);
    const params = url.searchParams;
    const filtered = params.get('category') === 'clothing' && params.get('search') === 'soft';
    requests.push([request.method, url.pathname, url.search]);
    const response = requests.length === 1
        ? send('Fetch.failRequest', { requestId, errorReason: 'ConnectionReset' })
        : jsonResponse(requestId, { products: filtered ? [wanted] : [other, wanted] });
    response.catch(error => { fixtureProblem = error; });
};
const heading = name => 'document.querySelector("main h1")?.textContent === ' + JSON.stringify(name);
const href = target => 'document.querySelector(' + JSON.stringify('main a[href="' + target + '"]') + ')';
const purchasedAction = '[...document.querySelectorAll("main button")].some(b=>b.textContent.includes("Add to Cart"))';

await test('filter retry, product reload, and both Back paths retain search, category, and sort', async () => {
    try {
        await send('Page.enable');
        await send('Fetch.enable', { patterns: [{ urlPattern: base + '/api/products*' }] });
        await send('Page.navigate', { url: base + '/shop' + original });
        await eventually(visible('We couldn’t load the catalog.'));
        assert.equal(await evaluate(visible('0 items found')), false);
        await evaluate('[...document.querySelectorAll("button")].find(b=>b.textContent.includes("Retry catalog")).click()');
        await eventually(visible('1 item found'));
        assert.deepEqual(requests.slice(0, 2), [
            ['GET', '/api/products', original],
            ['GET', '/api/products', original],
        ]);

        await evaluate('(()=>{const s=document.querySelector("[aria-label=\\"Sort products\\"]");s.value="-created";s.dispatchEvent(new Event("change",{bubbles:true}));})()');
        await eventually('location.search===' + JSON.stringify(sorted));
        await eventually('Boolean(' + href(productPath) + ')');
        await evaluate(href(productPath) + '.click()');
        await eventually(heading(wanted.name));
        assert.equal(await evaluate('location.pathname + location.search'), productPath);
        assert.equal(await evaluate(purchasedAction), true);
        await send('Page.reload', {});
        await eventually(heading(wanted.name));
        await eventually('Boolean(' + href(backPath) + ')');
        await evaluate(href(backPath) + '.click()');
        await eventually(visible('1 item found'));
        assert.equal(await evaluate('location.pathname + location.search'), backPath);
        assert.equal(await evaluate('document.querySelector("[aria-label=\\"Sort products\\"]").value'), '-created');
        assert.equal(await evaluate(visible(other.name)), false);
        assert.equal(requests.some(([, , query]) => query === sorted), true);

        const missing = '/product?slug=missing&' + sorted.slice(1) + '&returnTo=https://unrelated.invalid';
        await send('Page.navigate', { url: base + missing });
        await eventually(heading('This product isn’t available.'));
        assert.equal(await evaluate(purchasedAction), false);
        assert.equal(await evaluate(visible(wanted.name)), false);
        await evaluate(href(backPath) + '.click()');
        await eventually(visible('1 item found'));
        assert.equal(await evaluate('location.pathname + location.search'), backPath);
        assert.equal(fixtureProblem, undefined);
        assert.equal(requests.every(([method, path]) => method === 'GET' && path === '/api/products'), true);
    } finally {
        socket.close();
    }
});
