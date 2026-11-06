import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';
import { optionCatalogue } from '../src/data/option-mappings.js';
import type { Selections } from '../src/types/engine.types.js';

const selections=Object.fromEntries(
  Object.entries(optionCatalogue).map(([key,options])=>[key,options[0]!.id])
) as Selections;

test('API accepts frontend JSON and returns English prompt without NVIDIA key', async () => {
  const server=app.listen(0,'127.0.0.1');
  try {
    await new Promise<void>(resolve=>server.once('listening',resolve));
    const address=server.address();
    assert.ok(address&&typeof address!=='string');
    const response=await fetch('http://127.0.0.1:'+address.port+'/api/prompt',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({selections,variation:1})
    });
    assert.equal(response.status,200);
    const result=await response.json() as {prompt:string;source:string};
    assert.ok(result.prompt.startsWith('ChatGPT, using the reference image I uploaded, generate an image of the exact same person'));
    assert.doesNotMatch(result.prompt,/[\u0600-\u06ff]/);
    assert.match(result.prompt,/2022 Range Rover Sport/);
    assert.match(result.prompt,/beige leather/i);
    assert.match(result.prompt,/stationary|parked/);
  } finally { await new Promise<void>((resolve,reject)=>server.close(error=>error?reject(error):resolve())); }
});
test('API rejects unknown option IDs',async()=>{
  const server=app.listen(0,'127.0.0.1');
  try{
    await new Promise<void>(resolve=>server.once('listening',resolve));
    const addr=server.address();
    assert.ok(addr&&typeof addr!=='string');
    const response=await fetch('http://127.0.0.1:'+addr.port+'/api/prompt',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({selections:{...selections,clothing:'clothing-999'},variation:1})
    });
    assert.equal(response.status,400);
  }finally {await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
