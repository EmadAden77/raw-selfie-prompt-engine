import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue } from '../src/data/option-mappings.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import { validateClientPromptResponse } from '../src/engine/client-response-validator.js';
import type { Selections } from '../src/types/engine.types.js';

const selected = Object.fromEntries(
  Object.entries(optionCatalogue).map(([key,items])=>[key,items[0]!.id])
) as Selections;
const request={selections:selected,variation:1};

test('v11 interior response is accepted even when historic frontend expected wrong wood wording',()=>{
  const canonical=fallbackGenerator(request);
  assert.match(canonical,/glossy wood/);
  assert.doesNotMatch(canonical,/glossy dark wood/);
  assert.equal(validateClientPromptResponse(request,canonical,'local'),true);
  assert.equal(validateClientPromptResponse(request,canonical,'server'),true);
});

test('client accepts NVIDIA safe article refinement but rejects changed physical facts',()=>{
  const canonical=fallbackGenerator(request);
  const safe=canonical.replace('The parked pearl-white','A parked pearl-white');
  assert.notEqual(safe,canonical);
  assert.equal(validateClientPromptResponse(request,safe,'server'),true);
  assert.equal(validateClientPromptResponse(request,safe,'local'),false);
  for(const wrong of [
    canonical.replace('195 cm','193 cm'),
    canonical.replace('88 kg','83 kg'),
    canonical.replace('black leather three-spoke wheel','beige leather three-spoke wheel'),
    canonical.replace('generic smartphone front camera','Xiaomi 15 Ultra camera'),
    canonical+' A second light adds a new shadow.'
  ]){
    assert.notEqual(wrong,canonical);
    assert.equal(validateClientPromptResponse(request,wrong,'server'),false);
    assert.equal(validateClientPromptResponse(request,wrong,'local'),false);
  }
});

test('v11 frontend/backend validation agrees for all 244 selectable options',()=>{
  for(const [key,options] of Object.entries(optionCatalogue)){
    for(const option of options){
      const variant={selections:{...selected,[key]:option.id},variation:1};
      const canonical=fallbackGenerator(variant);
      assert.equal(validateClientPromptResponse(variant,canonical,'local'),true,
        key+'/'+option.id);
      assert.equal(validateClientPromptResponse(variant,canonical,'server'),true,
        key+'/'+option.id);
    }
  }
});
