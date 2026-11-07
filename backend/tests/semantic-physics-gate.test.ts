import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import { semanticPhysics, semanticFor } from '../src/data/physics/semantic-profiles.js';
import { physicsStatement } from '../src/data/physics/index.js';
import { resolveCapture } from '../src/engine/scene-geometry.js';
import { buildConcisePrompt } from '../src/engine/concise-prompt.js';
import { deriveSceneLighting } from '../src/engine/rule-builder.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import { validateEditorialRewrite } from '../src/engine/editor-validator.js';
import type { Selections } from '../src/types/engine.types.js';

const defaults=Object.fromEntries(Object.entries(optionCatalogue).map(([k,v])=>[k,v[0]!.id])) as Selections;
const resolve=(changes:Partial<Selections>={})=>resolveSelections({...defaults,...changes});

test('physics gate has exactly 204 complete immutable qualitative profiles across all six categories',()=>{
 const expected={clothing:50,expressions:30,hairstyles:30,poses:30,locations:58,carConditions:6} as const;
 let total=0;
 for(const key of Object.keys(expected) as Array<keyof typeof expected>){
  const profiles=semanticPhysics[key];
  assert.equal(profiles.length,expected[key],key);
  for(const [index,p] of profiles.entries()){
   total++;
   assert.equal(p.id,optionCatalogue[key][index]!.id);
   assert.equal(semanticFor(key,p.id),p);
   assert.ok(Object.isFrozen(p),p.id);
   for(const field of ['material','gravity','contact','motion'] as const)
    assert.ok(p[field].length>=8,p.id+':'+field);
   assert.doesNotMatch(Object.values(p).join(' '),/\b\d+(?:\.\d+)?(?:gsm|mm|°|%|FOV)\b/i,p.id);
  }
 }
 assert.equal(total,204);
});

test('only chosen semantics appear in canonical physics; replacing selections changes scene physics without altering identity',()=>{
 const base=resolve();
 const first=buildConcisePrompt(base);
 const selected=resolve({clothing:'clothing-11',expressions:'expression-2',
  hairstyles:'hair-1',poses:'pose-1',locations:'location-15',carConditions:'clean-1'});
 const second=buildConcisePrompt(selected);
 assert.notEqual(first,second);
 assert.ok(second.includes(selected.clothing.text));
 assert.ok(second.includes(selected.expressions.text));
 assert.ok(second.includes(selected.locations.text));
 assert.ok(second.includes('195 cm')&&second.includes('88 kg'));
 assert.doesNotMatch(second,/Xiaomi|iPhone|FOV\d+|\d+gsm|elbow\d|intensity\d/i);
 assert.equal(validatePrompt(second,selected),true);
 const physics=physicsStatement(selected,deriveSceneLighting(selected),true);
 assert.ok(second.includes(physics));
});

test('unselected rain, wind, phone brand and new light are not permitted NVIDIA edits',()=>{
 const selections=resolve({clothing:'clothing-11',hairstyles:'hair-1',
  carConditions:'clean-1',locations:'location-15',selfieAngles:'angle-1'});
 const canonical=buildConcisePrompt(selections);
 assert.equal(validatePrompt(canonical,selections),true);
 for(const addition of [
  ' A strong wind blows through the hair.',
  ' Rain starts falling and soaks the shirt.',
  ' Captured on a Xiaomi smartphone.',
  ' A second lamp illuminates the face.',
  ' The driver sits in a right-hand drive vehicle.',
  ' Elbow 95° with an 83° field of view.',
 ]){
  const altered=canonical+addition;
  assert.equal(validateEditorialRewrite(canonical,altered),false,addition);
  assert.equal(validatePrompt(altered,selections),false,addition);
 }
});

test('corrected incompatible pose never asserts physically impossible selected contact in output',()=>{
 const choices=resolve({selfieAngles:'angle-6',poses:'pose-1'});
 const capture=resolveCapture(choices);
 assert.equal(capture.poseRepaired,true);
 const prompt=buildConcisePrompt(choices);
 assert.equal(validatePrompt(prompt,choices),true);
 assert.doesNotMatch(prompt.split('Physics:')[1]??'',/free hand on steering wheel/i);
});
