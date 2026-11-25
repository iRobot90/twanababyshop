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
const first = { id: 1, slug: 'stacking-rings', name: 'Fixture stacking rings', image: '/file.svg', price: 1200, stock_quantity: 2 };
const second = { id: 2, slug: 'folding-stroller', name: 'Fixture folding stroller', price: 3500, stock_quantity: 2 };
const reset = requestId => send('Fetch.failRequest', { requestId, errorReason: 'ConnectionReset' });

await test('shop-to-product detail, retry, and fast navigation never substitute a different item', async () => {
    let responseMode = 'normal';
    let heldId;
    let fixtureProblem;
    onRequest = ({ requestId }) => {
        if (responseMode === 'hold') {
            heldId = requestId;
            return;
        }
        const answer = responseMode === 'error' ? reset(requestId) : jsonResponse(requestId, { products: [first, second] });
        answer.catch(error => { fixtureProblem = error; });
    };
    const open = path => send('Page.navigate', { url: base + path });
    const heading = name => 'document.querySelector("main h1")?.textContent === ' + JSON.stringify(name);
    const clientNavigate = path => evaluate('history.pushState(null, "", ' + JSON.stringify(path) + ')');
    const hasPurchaseControl = () => evaluate('[...document.querySelectorAll("main button")].some(b=>b.textContent.includes("Add to Cart"))');
    try {
        await send('Page.enable');
        await send('Fetch.enable', { patterns: [{ urlPattern: base + '/api/products*' }] });
        await open('/shop');
        await eventually(visible('Fixture folding stroller'));
        await evaluate('document.querySelector("[href=\\"/product?slug=stacking-rings\\"]").click()');
        await eventually(heading('Fixture stacking rings'));
        const actualPhoto = 'Array.from(document.querySelectorAll("main img")).some(i => i.alt === "Fixture stacking rings" && new URL(i.currentSrc).pathname === "/file.svg" && i.naturalWidth > 0)';
        async function expectKnownDetails() {
            await eventually(actualPhoto, 5000);
            assert.equal(await evaluate('Boolean(document.querySelector("main canvas"))'), false);
            for (const claim of ['Certified Safe', 'Eco-Friendly', 'Select Color', 'Mist Blue', '0+']) {
                assert.equal(await evaluate(visible(claim)), false, 'Unsupported claim or option: ' + claim);
            }
        }
        await expectKnownDetails();
        await send('Page.reload', {});
        await eventually(heading('Fixture stacking rings'));
        await expectKnownDetails();
        await evaluate('[...document.querySelectorAll("main button")].find(b=>b.textContent.includes("Add to Cart")).click()');
        await eventually(visible('Added to Cart'));
        const addedItem = await evaluate('JSON.parse(localStorage.getItem("twana-cart-storage")).state.items[0]');
        assert.equal(addedItem.id, first.id);
        assert.equal(addedItem.color, undefined);

        await clientNavigate('/product?slug=folding-stroller');
        await eventually(heading('Fixture folding stroller'));
        assert.equal(await evaluate(visible('Product photo unavailable.')), true);
        assert.equal(await evaluate('Boolean(document.querySelector("main canvas"))'), false);
        assert.equal(await hasPurchaseControl(), true);

        await clientNavigate('/product?slug=retired-item');
        await eventually(heading('This product isn’t available.'));
        assert.equal(await hasPurchaseControl(), false);
        assert.equal(await evaluate(visible('Fixture stacking rings')), false);

        responseMode = 'error';
        await clientNavigate('/product?slug=stacking-rings');
        await eventually(heading('We couldn’t load this product.'));
        assert.equal(await hasPurchaseControl(), false);
        responseMode = 'normal';
        await evaluate('[...document.querySelectorAll("button")].find(b=>b.textContent.includes("Retry product")).click()');
        await eventually(heading('Fixture stacking rings'));

        responseMode = 'hold';
        await clientNavigate('/product?slug=folding-stroller');
        await eventually('document.querySelector("main [role=status]")?.textContent.includes("Loading product")');
        assert.equal(await hasPurchaseControl(), false);
        for (let i = 0; !heldId && i < 80; i++) await new Promise(resolve => setTimeout(resolve, 50));
        assert.ok(heldId, 'The old detail request must actually reach the boundary');
        responseMode = 'normal';
        await clientNavigate('/product?slug=retired-item');
        await eventually(heading('This product isn’t available.'));
        await jsonResponse(heldId, { products: [first, second] }).catch(error => {
            if (!/invalid|interception/i.test(error.message)) throw error;
        });
        await new Promise(resolve => setTimeout(resolve, 300));
        assert.equal(await evaluate(heading('This product isn’t available.')), true);
        assert.equal(await hasPurchaseControl(), false);

        await open('/product');
        await eventually(heading('This product isn’t available.'));
        assert.equal(fixtureProblem, undefined);
    } finally {
        socket.close();
    }
});
