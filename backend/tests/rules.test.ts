import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import { buildRulePrompt } from '../src/engine/rule-builder.js';
import type { Selections } from '../src/types/engine.types.js';
const selected=Object.fromEntries(Object.entries(optionCatalogue).map(([key,values])=>[key,values[0]!.id])) as Selections;
test('catalogue matches frontend option IDs and counts',()=>{
  assert.equal(optionCatalogue.clothing.length,50);
  for(const key of ['expressions','hairstyles','selfieAngles','poses'] as const)assert.equal(optionCatalogue[key].length,30);
  assert.equal(optionCatalogue.carConditions.length,6);
  assert.equal(optionCatalogue.lighting.length,10);
  assert.equal(optionCatalogue.locations.length,58);
});
test('all fixed rules enter generated base',()=>{
  const prompt=buildRulePrompt(resolveSelections(selected));
  assert.ok(prompt.startsWith('ChatGPT, using the reference image I uploaded'));
  assert.match(prompt,/no wax skin/i);
  assert.match(prompt,/stationary/);
  assert.match(prompt,/no famous/i);
});

