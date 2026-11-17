// Synthetic local-only browser acceptance. Run with an installed Playwright module.
import assert from 'node:assert/strict';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin=process.env.TEST_ORIGIN || 'http://127.0.0.1:3187';
if (!['127.0.0.1','localhost'].includes(new URL(origin).hostname)) throw new Error('Local test origin required');
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let fail=true;
 const products=['alpha','beta'].map((name,i)=>({id:`11111111-1111-4111-8111-11111111111${i}`,title:`Synthetic ${name}`,slug:name,price:100,description:'Synthetic QA only',stock_quantity:2,image:'',category:{name:'QA',slug:'qa'}}));
 await page.route('**/api/products**',async route=>{
  if(fail)return route.fulfill({status:503,json:{error:'Synthetic failure'}});
  const slug=new URL(route.request().url()).searchParams.get('slug');
  return route.fulfill({json:{products:slug?products.filter(p=>p.slug===slug):products}});
 });
 for(const path of ['/','/categories','/product?slug=alpha']) {
  fail=true;await page.goto(origin+path);
  await page.getByRole('button',{name:'Try again',exact:true}).waitFor();
  fail=false;await page.getByRole('button',{name:'Try again',exact:true}).click();
  await page.getByRole('button',{name:'Try again',exact:true}).waitFor({state:'hidden'});
  if(path.startsWith('/product'))await page.getByRole('heading',{name:'Synthetic alpha',exact:true}).waitFor();
 }
 // SPA link navigation must reset state rather than showing stale product data.
 await page.getByRole('link',{name:/Synthetic beta/}).click();
 await page.getByRole('heading',{name:'Synthetic beta',exact:true}).waitFor();
 await page.waitForURL('**/product?slug=beta');
 await page.goBack();await page.getByRole('heading',{name:'Synthetic alpha',exact:true}).waitFor();
 await page.goto(origin+'/checkout/success');
 await page.getByText('No payment reference was provided.',{exact:false}).waitFor();
 let pending=true;
 await page.route('**/api/payments/verify',route=>route.fulfill({json:{status:pending?'pending':'paid',reference:'twa-'+ 'a'.repeat(32)}}));
 await page.goto(origin+'/checkout/success?reference=twa-'+ 'a'.repeat(32));
 await page.getByRole('button',{name:'Check again'}).waitFor();pending=false;
 await page.getByRole('button',{name:'Check again'}).click();
 await page.getByRole('heading',{name:'Payment confirmed',exact:true}).waitFor();
 assert.deepEqual(errors,[]);
 console.log('PASS: home/category/product failure retry, related-product navigation/back, missing receipt, pending-to-paid verification; no browser exceptions. Synthetic responses only.');
} finally { await browser.close(); }
