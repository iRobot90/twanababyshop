// Run with a local Next server and a disposable Chrome CDP session.
// Defaults: NEXT http://127.0.0.1:3197, Chrome --remote-debugging-port=3195.
import assert from 'node:assert/strict';
import test from 'node:test';
const [base = 'http://127.0.0.1:3197', chrome = 'http://127.0.0.1:3195'] = process.argv.slice(2);
for (const value of [base, chrome]) {
    const url = new URL(value);
    assert.equal(url.protocol, 'http:');
    assert.equal(url.hostname, '127.0.0.1', 'Use disposable loopback servers only');
}
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

const fixture = { id: 11, slug: 'fixture-rings', name: 'Fixture rings', image: '/file.svg', price: 1200, stock_quantity: 2 };
const expectedOrigin = new URL(base).origin;
const traffic = [];
let error;
onRequest = ({ requestId, request }) => {
    const url = new URL(request.url);
    let action;
    if (url.origin !== expectedOrigin || request.method !== 'GET') {
        traffic.push([url.pathname, request.method, 'BLOCKED']);
        action = send('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' });
    } else if (url.pathname === '/api/products') {
        traffic.push([url.pathname, request.method, 'FIXTURE']);
        action = jsonResponse(requestId, { products: [fixture] });
    } else {
        action = send('Fetch.continueRequest', { requestId });
    }
    action.catch(e => { error = e; });
};
const click = async expr => evaluate('(' + expr + ').click()');
const add = '[...document.querySelectorAll("main button")].find(b=>b.innerText.trim()==="Add to Cart"&&!b.disabled)';
const qty = 'JSON.parse(localStorage.getItem("twana-cart-storage")).state.items[0]?.quantity ?? 0';
await test('Chrome detail cap never claims success; cart drawer minus really decrements', async () => {
    try {
        await send('Page.enable');
        await send('Fetch.enable',{patterns:[{urlPattern:'http*'}]});
        await send('Page.navigate',{url:base + '/product?slug=' + fixture.slug});
        await eventually(visible(fixture.name));
        await eventually('Boolean(' + add + ')');
        await click(add);
        await eventually(visible('Added to Cart'));
        await eventually('(' + qty + ')===1');
        await eventually('Boolean(' + add + ')');
        await click(add);
        await eventually(visible('Added to Cart'));
        await eventually('(' + qty + ')===2');
        await eventually('Boolean(' + add + ')');
        await click(add);
        await eventually(visible('This item is already at the cart quantity limit.'));
        assert.equal(await evaluate(visible('Added to Cart')), false);
        assert.equal(await evaluate(qty), 2);
        const headerButton='document.querySelector("header button:has(svg.lucide-shopping-bag)")';
        await eventually('Boolean(' + headerButton + ')');
        await click(headerButton);
        const minus='document.querySelector(\'button[aria-label="Decrease quantity for Fixture rings"]\')';
        const plus='document.querySelector(\'button[aria-label="Increase quantity for Fixture rings"]\')';
        await eventually('Boolean(' + minus + ')');
        assert.equal(await evaluate(plus + '.disabled'), true);
        await click(minus);
        await eventually('(' + qty + ')===1');
        assert.equal(await evaluate(plus + '.disabled'), false);
        await click(minus);
        await eventually(visible('Your cart is empty'));
        assert.equal(await evaluate(qty), 0);
        assert.equal(error, undefined);
        assert.deepEqual(traffic,[['/api/products','GET','FIXTURE']]);
        console.log('Chrome fixture cap 2 blocks third Add; drawer minus 2→1→0; only one mocked catalog GET.');
    } finally { socket.close(); }
});
