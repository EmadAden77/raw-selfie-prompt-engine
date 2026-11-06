import test from 'node:test';
import assert from 'node:assert/strict';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import { optionCatalogue } from '../src/data/option-mappings.js';
import { generatePrompt } from '../src/services/prompt.service.js';
import type { Selections } from '../src/types/engine.types.js';
const selections=Object.fromEntries(Object.entries(optionCatalogue).map(([key,options])=>[key,options[0]!.id])) as Selections;
test('interior selfie ignores irrelevant variation; exterior variation remains scene-aware',()=>{
  const first=fallbackGenerator({selections,variation:1});
  const second=fallbackGenerator({selections,variation:2});
  assert.equal(first,second);
  const outside={...selections,selfieAngles:'angle-19',poses:'pose-17'};
  const a=fallbackGenerator({selections:outside,variation:1});
  const b=fallbackGenerator({selections:outside,variation:2});
  assert.notEqual(a,b);
  for(const output of [first,second,a,b]){
    assert.match(output,/2022 Range Rover Sport/);
    assert.match(output,/193 cm/);
    assert.match(output,/83 kg/);
  }
});
test('backend produces local fallback when request has no NVIDIA key',async()=>{
  const result=await generatePrompt({selections,variation:1});
  assert.equal(result.source,'local');
  assert.match(result.prompt,/ChatGPT, using the reference image/);
});

