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
const currentCard = string => '[...document.querySelectorAll("a[href^=\\"/product?slug=\\"]")].some(a=>a.textContent.includes(' + JSON.stringify(string) + '))';
const fixture = (id, name) => ({ id, name, price: 1200, slug: 'fixture-' + id, category: 'clothing' });

await test('real /shop renders failure, retries identical filters, and ignores stale sort responses', async () => {
    let attempts = 0;
    let delayed;
    let fixtureResponseFailure;
    onRequest = ({ requestId, request }) => {
        const params = new URL(request.url).searchParams;
        const ordering = params.get('ordering');
        if (ordering === 'price') { delayed = requestId; return; }
        const response = ordering === '-price'
            ? jsonResponse(requestId, { products: [fixture(2, 'Current sort result')] })
            : ++attempts === 1
                ? send('Fetch.failRequest', { requestId, errorReason: 'ConnectionReset' })
                : attempts === 2
                    ? jsonResponse(requestId, { error: 'fixture detail should not be shown' })
                    : params.get('category') === 'clothing' && params.get('search') === 'wool'
                        ? jsonResponse(requestId, { products: [] })
                        : jsonResponse(requestId, { products: [fixture(3, 'Fixture catalog')] });
        response.catch(error => { fixtureResponseFailure = error; });
    };
    try {
        await send('Page.enable');
        await send('Fetch.enable', { patterns: [{ urlPattern: base + '/api/products*' }] });
        await send('Page.navigate', { url: base + '/shop?category=clothing&search=wool' });
        await eventually(visible('We couldn’t load the catalog.'));
        assert.equal(await evaluate(visible('0 items found')), false);
        const clickRetry = '[...document.querySelectorAll("button")].find(b=>b.textContent.includes("Retry catalog")).click()';
        await evaluate(clickRetry);
        for (let i = 0; attempts < 2 && i < 100; i++) await new Promise(resolve => setTimeout(resolve, 50));
        assert.equal(attempts, 2, 'Retry reaches the catalog endpoint');
        await eventually(visible('We couldn’t load the catalog.'));
        assert.equal(await evaluate(visible('fixture detail should not be shown')), false);
        await evaluate(clickRetry);
        await eventually(visible('No products match those filters.'));
        assert.equal(await evaluate(visible('0 items found')), true);
        assert.equal(await evaluate('location.search'), '?category=clothing&search=wool');

        const sort = value => evaluate(`(()=>{const s=document.querySelector('[aria-label="Sort products"]');s.value=${JSON.stringify(value)};s.dispatchEvent(new Event("change",{bubbles:true}));})()`);
        await sort('price');
        await eventually(visible('Loading products'));
        for (let i = 0; !delayed && i < 50; i++) await new Promise(resolve => setTimeout(resolve, 50));
        assert.ok(delayed, 'Slow request reached the catalog boundary');
        await sort('-price');
        await eventually(currentCard('Current sort result'));
        await jsonResponse(delayed, { products: [fixture(1, 'Stale sort result')] }).catch(error => {
            if (!/invalid|interception/i.test(error.message)) throw error;
        });
        await new Promise(resolve => setTimeout(resolve, 500));
        assert.equal(await evaluate(currentCard('Current sort result')), true);
        assert.equal(await evaluate(currentCard('Stale sort result')), false);
        assert.equal(await evaluate('document.querySelector(\'[aria-label="Sort products"]\').value'), '-price');
        const detailLink = await evaluate('[...document.querySelectorAll("a")].find(a=>a.textContent.includes("Current sort result"))?.getAttribute("href")');
        assert.equal(detailLink, '/product?slug=fixture-2');

        onRequest = ({ requestId }) => void jsonResponse(requestId, { products: [] }).catch(error => { fixtureResponseFailure = error; });
        await send('Page.navigate', { url: base + '/shop' });
        await eventually(visible('No products are listed yet.'));
        assert.equal(await evaluate(visible('Clear filters')), false);
        assert.equal(fixtureResponseFailure, undefined);
    } finally {
        socket.close();
    }
});
