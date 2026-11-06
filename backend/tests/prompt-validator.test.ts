import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import { optionCatalogue } from '../src/data/option-mappings.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import type { Selections } from '../src/types/engine.types.js';
const selections=Object.fromEntries(Object.entries(optionCatalogue).map(([key,options])=>[key,options[0]!.id])) as Selections;
test('fallback English text satisfies strict validator',()=>{
  const generated=fallbackGenerator({selections,variation:1});
  assert.equal(validatePrompt(generated),true);
  assert.ok(!/[\u0600-\u06ff]/.test(generated));
});
test('validator rejects altered opening, Arabic, landmarks and moving car',()=>{
  const base=fallbackGenerator({selections,variation:0});
  assert.equal(validatePrompt(base.replace(/^ChatGPT,/,'Assistant,')),false);
  assert.equal(validatePrompt(base+' مرحبا'),false);
  assert.equal(validatePrompt(base+' at Burj Khalifa'),false);
  assert.equal(validatePrompt(base+' The car is driving.'),false);
});

