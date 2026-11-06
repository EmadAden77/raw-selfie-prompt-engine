import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePrompt, validateCreativeAddition } from '../src/services/prompt.service.js';
import { optionCatalogue } from '../src/data/option-mappings.js';
import type { Selections } from '../src/types/engine.types.js';
const selections=Object.fromEntries(Object.entries(optionCatalogue).map(([key,options])=>[key,options[0]!.id])) as Selections;
const fakeKey='nvapi-'+ 'a'.repeat(30);
const request={selections,variation:2,nvidiaApiKey:fakeKey};

test('model ID is retained and a compatible NVIDIA expansion is accepted',async()=>{
  const previous=globalThis.fetch;
  try{
    globalThis.fetch=async (_url,options)=>{
      const headers=(options as RequestInit).headers as Record<string,string>;
      assert.equal(headers.Authorization,'Bearer '+fakeKey);
      const body=JSON.parse((options as RequestInit).body as string) as {model:string};
      assert.equal(body.model,'deepseek-ai/deepseek-v4.1-flash');
      return new Response(JSON.stringify({choices:[{message:{content:'Natural fabric folds catch the available sunlight while ordinary pedestrians cross far behind the safely parked vehicle.'},finish_reason:'stop'}]}),{status:200});
    };
    const result=await generatePrompt(request);
    assert.equal(result.source,'server');
    assert.equal(result.reason,undefined);
    assert.match(result.prompt,/2022 Range Rover Sport/);
    assert.match(result.prompt,/Natural fabric folds catch/);
  }finally{globalThis.fetch=previous;}
});
test('401 key errors are categorized without leaking the key',async()=>{
  const previous=globalThis.fetch;
  try{
    globalThis.fetch=async()=>new Response('secret information',{status:401});
    const result=await generatePrompt(request);
    assert.equal(result.source,'local');
    assert.equal(result.reason,'unauthorized');
    assert.doesNotMatch(JSON.stringify(result),/nvapi-/);
  }finally{globalThis.fetch=previous;}
});
test('unavailable model receives a clear fallback reason',async()=>{
  const previous=globalThis.fetch;
  try{
    globalThis.fetch=async()=>new Response('',{status:404});
    const result=await generatePrompt(request);
    assert.equal(result.reason,'model_unavailable');
  }finally{globalThis.fetch=previous;}
});
test('unsafe additions are rejected without changing fixed base rules',()=>{
  assert.equal(validateCreativeAddition('A blue car is moving through the shopping center while the photographer follows behind.'),false);
  assert.equal(validateCreativeAddition('A few distant shoppers cross the ordinary pavement, casting modest shadows beneath the existing light.'),true);
});
