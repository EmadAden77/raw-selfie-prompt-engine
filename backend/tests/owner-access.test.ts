import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';
import { authorizeNvidiaOwner } from '../src/security/owner-access.js';
import { optionCatalogue } from '../src/data/option-mappings.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import type { Selections } from '../src/types/engine.types.js';

const selections = Object.fromEntries(Object.entries(optionCatalogue).map(([key,items])=>[key,items[0]!.id])) as Selections;
const request = {selections,variation:1};
const canonical = fallbackGenerator(request);
const secret = 'owner-private-token-0123456789abcdef0123456789abcdef';
const envKey = process.env.NVIDIA_API_KEY;
const envOwner = process.env.NVIDIA_OWNER_TOKEN;
const originalFetch = globalThis.fetch;
function restore() {
  globalThis.fetch = originalFetch;
  if (envKey === undefined) delete process.env.NVIDIA_API_KEY;
  else process.env.NVIDIA_API_KEY = envKey;
  if (envOwner === undefined) delete process.env.NVIDIA_OWNER_TOKEN;
  else process.env.NVIDIA_OWNER_TOKEN = envOwner;
}

test('owner verification fails closed on missing, weak or wrong secrets', () => {
  try {
    delete process.env.NVIDIA_OWNER_TOKEN;
    assert.equal(authorizeNvidiaOwner(secret),false);
    process.env.NVIDIA_OWNER_TOKEN = 'short';
    assert.equal(authorizeNvidiaOwner('short'),false);
    process.env.NVIDIA_OWNER_TOKEN = 'nvapi-'+ 'a'.repeat(35);
    assert.equal(authorizeNvidiaOwner(process.env.NVIDIA_OWNER_TOKEN),false);
    process.env.NVIDIA_OWNER_TOKEN = secret;
    assert.equal(authorizeNvidiaOwner('wrong'),false);
    assert.equal(authorizeNvidiaOwner(secret+'x'),false);
    assert.equal(authorizeNvidiaOwner(''),false);
    assert.equal(authorizeNvidiaOwner(null),false);
    assert.equal(authorizeNvidiaOwner(secret),true);
  } finally {restore();}
});

test('public visitors cannot trigger NVIDIA calls, only authenticated owner can',async()=>{
  process.env.NVIDIA_API_KEY = 'nvapi-' + 'a'.repeat(30);
  process.env.NVIDIA_OWNER_TOKEN = secret;
  const server=app.listen(0,'127.0.0.1');
  let paidCalls=0;
  try {
    await new Promise<void>(resolve=>server.once('listening',resolve));
    const address=server.address();
    assert.ok(address&&typeof address!=='string');
    const url='http://127.0.0.1:'+address.port+'/api/prompt';
    globalThis.fetch = (async (input:RequestInfo|URL,init?:RequestInit)=>{
      const target = typeof input==='string'?input:input instanceof URL?input.toString():input.url;
      if (target.startsWith('https://integrate.api.nvidia.com/')) {
        paidCalls++;
        return new Response(JSON.stringify({choices:[{message:{content:canonical},finish_reason:'stop'}]}),{
          status:200,headers:{'Content-Type':'application/json'}
        });
      }
      return originalFetch(input,init);
    }) as typeof fetch;
    const send=(token?:string)=>originalFetch(url,{
      method:'POST',
      headers:{'Content-Type':'application/json',
        Origin:'https://emadaden77.github.io',
        ...(token?{'X-Nvidia-Owner-Token':token}:{})},
      body:JSON.stringify(request)
    });
    for (const token of [undefined,'wrong',secret+'wrong']) {
      const response=await send(token);
      assert.equal(response.status,200);
      const body=await response.json() as {source:string;reason:string;prompt:string};
      assert.equal(body.source,'local');
      assert.equal(body.reason,'owner_only');
      assert.equal(body.prompt,canonical);
      assert.doesNotMatch(JSON.stringify(body),/owner-private-token/);
    }
    assert.equal(paidCalls,0,'Unauthenticated requests must never reach NVIDIA');
    const valid=await send(secret);
    assert.equal(valid.status,200);
    const body=await valid.json() as {source:string;prompt:string};
    assert.equal(body.source,'server');
    assert.equal(body.prompt,canonical);
    assert.equal(paidCalls,1);
    assert.doesNotMatch(JSON.stringify(body),/owner-private-token|nvapi-/);
    const preflight=await originalFetch(url,{
      method:'OPTIONS',
      headers:{Origin:'https://emadaden77.github.io',
        'Access-Control-Request-Method':'POST',
        'Access-Control-Request-Headers':'content-type,x-nvidia-owner-token'}
    });
    assert.equal(preflight.status,204);
    assert.match(preflight.headers.get('access-control-allow-headers')||'',/x-nvidia-owner-token/i);
  } finally {
    restore();
    await new Promise<void>(resolve=>server.close(()=>resolve()));
  }
});
