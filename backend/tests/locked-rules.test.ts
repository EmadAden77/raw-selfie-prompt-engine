import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import { buildRulePrompt } from '../src/engine/rule-builder.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import { validateCreativeAddition } from '../src/services/prompt.service.js';
import { BODY_RULE } from '../src/rules/body.rules.js';
import { COMPOSITION_RULE } from '../src/rules/composition.rules.js';
import { INTERIOR_RULE } from '../src/rules/cabin.rules.js';
import type { Selections } from '../src/types/engine.types.js';

const selections=Object.fromEntries(Object.entries(optionCatalogue).map(([key, options])=>[key,options[0]!.id])) as Selections;
const chosen=(selfieAngles:string,poses='pose-1'): Selections => ({...selections,selfieAngles,poses});

test('every prompt has exact 195 cm 88 kg lean athletic body and sole-primary-subject composition',()=>{
  for(const selfieAngles of ['angle-1','angle-9','angle-16','angle-30']){
    const values=chosen(selfieAngles);
    for(const prompt of [
      buildRulePrompt(resolveSelections(values)),
      fallbackGenerator({selections:values,variation:7})
    ]){
      assert.ok(prompt.includes(BODY_RULE));
      assert.ok(prompt.includes(COMPOSITION_RULE));
      assert.match(prompt,/195 cm/);
      assert.match(prompt,/88 kg/);
      assert.match(prompt,/lean athletic/);
      assert.doesNotMatch(prompt,/beige steering wheel|beige leather steering wheel/i);
    }
    assert.equal(validatePrompt(fallbackGenerator({selections:values,variation:5}),resolveSelections(values)),true);
  }
});
test('cabin rule is inserted for visible interior, not forced into an exterior selfie',()=>{
  const inside=fallbackGenerator({selections:chosen('angle-1'),variation:2});
  const outside=fallbackGenerator({selections:chosen('angle-17'),variation:2});
  assert.ok(inside.includes(INTERIOR_RULE));
  assert.match(inside,/longitudinal stitching/);
  assert.match(inside,/black leather/);
  assert.match(inside,/portrait-oriented infotainment/);
  assert.match(inside,/piano-black/);
  assert.ok(!outside.includes(INTERIOR_RULE));
  assert.match(outside,/sole primary subject/);
  assert.match(outside,/only show parts naturally|only for cabin surfaces naturally visible/i);
});
test('validator rejects missing locked requirements and explicit contradictions',()=>{
  const base=fallbackGenerator({selections,variation:2});
  assert.equal(validatePrompt(base),true);
  assert.equal(validatePrompt(base.replace('195 cm','193 cm')),false);
  assert.equal(validatePrompt(base.replace('88 kg','83 kg')),false);
  assert.equal(validatePrompt(base.replace('natural lean athletic physique','bodybuilding physique')),false);
  assert.equal(validatePrompt(base.replace(COMPOSITION_RULE,'')),false);
  assert.equal(validatePrompt(base.replace(INTERIOR_RULE,''),resolveSelections(selections)),false);
  assert.equal(validatePrompt(base+' The steering wheel is beige.'),false);
  assert.equal(validatePrompt(base+' He weighs 100 kg.'),false);
  assert.equal(validatePrompt(base+' The seats are red leather seats.'),false);
  assert.equal(validatePrompt(base+' A horizontal infotainment display replaces the factory screen.'),false);
});
test('NVIDIA creative additions may only describe natural visible details',()=>{
  const good='Soft naturally occurring daylight falls across the existing leather edge, with slight phone sensor noise and a distant pedestrian seen through an already visible side window.';
  assert.equal(validateCreativeAddition(good),true);
  for(const bad of [
    'The person is 190 cm tall with a very bulky physique.',
    'The person weighs 95 kg and has bodybuilding muscles.',
    'The beige leather steering wheel now fills the shot.',
    'Widen the frame to reveal the complete interior and full body.',
    'Move the camera away to showcase the vehicle.',
    'Reveal the entire cabin regardless of the natural selfie frame.',
    'Replace the dashboard with a new layout.'
  ]) assert.equal(validateCreativeAddition(bad),false,bad);
});
