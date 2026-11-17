import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('verification rejects malformed token before database lookup',()=>{
 const source=readFileSync(new URL('../src/app/api/payments/verify/route.ts',import.meta.url),'utf8');
 const reject=source.indexOf("if (!token || !/^[0-9a-f]{64}$/.test(token))");
 assert.ok(reject>=0);
 assert.ok(reject<source.indexOf("db.from('orders')"));
 assert.ok(source.includes("!/^[0-9a-f]{64}$/.test(data.token_hash)"));
});
