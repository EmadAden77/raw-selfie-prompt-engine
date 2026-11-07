import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import { buildConcisePrompt, promptWordCount } from '../src/engine/concise-prompt.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import type { Selections } from '../src/types/engine.types.js';

const initial = Object.fromEntries(Object.entries(optionCatalogue)
  .map(([key, items]) => [key, items[0]!.id])) as Selections;
const selected = (options: Partial<Selections>) => resolveSelections({ ...initial, ...options });

test('v9: reported neutral driver selfie is face-first, physically lit and concise', () => {
  const choices = selected({
    locations:'location-2', clothing:'clothing-1', expressions:'expression-1',
    hairstyles:'hair-1', poses:'pose-1', selfieAngles:'angle-1', lighting:'light-1'
  });
  const prompt = buildConcisePrompt(choices);
  assert.match(prompt,/neutral relaxed face/);
  assert.match(prompt,/No smile or posed grin/);
  assert.match(prompt,/face and shoulders dominate 9:16, chest crop/);
  assert.match(prompt,/wheel hand at edge only, no lap or console/);
  assert.match(prompt,/one natural sun from the actual open sky/);
  assert.match(prompt,/grounded shadows away from the unobstructed sun/);
  assert.match(prompt,/Touch Pro Duo dual stacked landscape screens/);
  assert.equal(validatePrompt(prompt,choices),true);
  assert.ok(promptWordCount(prompt)<=800,'driver selfie words: '+promptWordCount(prompt));
});

test('v9: a requested smile must not receive a neutral-expression ban', () => {
  const choices=selected({expressions:'expression-2'});
  const prompt=buildConcisePrompt(choices);
  assert.match(prompt,/slight natural smile/);
  assert.doesNotMatch(prompt,/No smile or posed grin/);
  assert.equal(validatePrompt(prompt,choices),true);
});

test('v9: exterior variation is localized and does not widen the selfie', () => {
  const choices=selected({locations:'location-2',selfieAngles:'angle-19',poses:'pose-17'});
  const a=buildConcisePrompt(choices,undefined,0);
  const b=buildConcisePrompt(choices,undefined,1);
  assert.notEqual(a,b);
  assert.match(a,/face and upper torso dominate 9:16/);
  assert.match(a,/At the visible frame edge only/);
  assert.equal(validatePrompt(a,choices),true);
  assert.ok(promptWordCount(a)<=800,'exterior words: '+promptWordCount(a));
});

test('v9: tight crop hides external background and never forces a full cabin', () => {
  const choices=selected({selfieAngles:'angle-9',poses:'pose-2'});
  const prompt=buildConcisePrompt(choices);
  assert.match(prompt,/Framing: tight 9:16 face and shoulders/);
  assert.doesNotMatch(prompt,/Only at the existing frame edge/);
  assert.match(prompt,/No off-frame details/);
  assert.equal(validatePrompt(prompt,choices),true);
});
