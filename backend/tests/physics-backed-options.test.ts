import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import { physicsCatalogue, physicsStatement } from '../src/data/physics/index.js';
import { placeSceneProfiles, placeSceneProfile } from '../src/data/physics/place-scene-profiles.js';
import { deriveSceneLighting } from '../src/engine/rule-builder.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import { validateEditorialRewrite } from '../src/engine/editor-validator.js';
import type { Selections } from '../src/types/engine.types.js';

const defaults=Object.fromEntries(Object.entries(optionCatalogue).map(([key,a])=>[key,a[0]!.id])) as Selections;
const sample=(overrides:Partial<Selections>={})=>({...defaults,selfieAngles:'angle-auto',...overrides});
const prompt=(overrides:Partial<Selections>={})=>fallbackGenerator({selections:sample(overrides),variation:0});

test('exact canonical list of 58 places, each with complete unique day/night parking angle ground background data',()=>{
 assert.equal(placeSceneProfiles.length,58);
 assert.equal(new Set(placeSceneProfiles.map(x=>x.id)).size,58);
 for(const [index,p] of placeSceneProfiles.entries()){
  assert.equal(p.id,optionCatalogue.locations[index]!.id);
  assert.equal(p.arabicLabel,optionCatalogue.locations[index]!.label);
  assert.equal(placeSceneProfile(p.id),p);
  assert.ok(p.parking&&p.preferredAngle&&p.angleReason&&p.ground&&p.background&&p.goldenTime);
  assert.ok(['driver','outside','passenger'].includes(p.preferredAngle));
  for(const period of ['day','night'] as const){
   const light=p[period];
   assert.ok(light.source&&light.kelvin>=2500&&light.kelvin<=7000);
   assert.ok(light.shadows&&light.reflections);
   const choices=resolveSelections(sample({locations:p.id,lighting:period==='day'?'light-1':'light-7'}));
   const derived=deriveSceneLighting(choices);
   assert.equal(derived.source,light.source,p.id+'/'+period);
   assert.equal(derived.kelvin,light.kelvin,p.id+'/'+period);
   assert.equal(derived.parking,p.parking,p.id+'/'+period);
   assert.equal(derived.surface,p.ground,p.id+'/'+period);
   const generated=fallbackGenerator({selections:sample({locations:p.id,lighting:period==='day'?'light-1':'light-7'}),variation:0});
   assert.equal(validatePrompt(generated,choices),true,p.id+'/'+period);
   assert.ok(generated.includes(p.parking)&&generated.includes(p.background),p.id+'/'+period);
  }
 }
});

test('core identity body LHD and factory dashboard are physically protected',()=>{
 const out=prompt({locations:'location-15',poses:'pose-1'});
 assert.match(out,/195 cm/);
 assert.match(out,/88 kg/);
 assert.match(out,/front-left driver seat directly behind the steering wheel/);
 assert.match(out,/center console to driver right/);
 assert.match(out,/Touch Pro Duo dual stacked landscape screens/);
 assert.match(out,/generic smartphone front-camera selfie/);
 assert.doesNotMatch(out,/Xiaomi|f\/2\.0|portrait infotainment|FOV77|gsm|seat75%/i);
 assert.equal(validatePrompt(out,resolveSelections(sample({locations:'location-15',poses:'pose-1'}))),true);
});

test('automatic shooting angle repairs incompatible seated and standing poses',()=>{
 const driver=resolveSelections(sample({locations:'location-10',poses:'pose-1'}));
 const standing=resolveSelections(sample({locations:'location-15',poses:'pose-16'}));
 const passenger=resolveSelections(sample({locations:'location-6',poses:'pose-10'}));
 const desert=resolveSelections(sample({locations:'location-56',poses:'pose-16'}));
 assert.equal(driver.selfieAngles.id,'angle-1');
 assert.equal(standing.selfieAngles.id,'angle-16');
 assert.equal(passenger.selfieAngles.id,'angle-6');
 assert.equal(desert.selfieAngles.id,'angle-18');
});

test('gas pump remains on the driver left; covered parking has no invented direct sun',()=>{
 const gas=prompt({locations:'location-11',poses:'pose-1',lighting:'light-7'});
 assert.match(gas,/pump on driver's left/);
 const parking=prompt({locations:'location-29',poses:'pose-1',lighting:'light-7'});
 assert.match(parking,/one existing overhead canopy or garage fixture/);
 assert.doesNotMatch(parking,/direct midday sunlight illuminates the garage/i);
 const desert=prompt({locations:'location-56',poses:'pose-16',lighting:'light-7'});
 assert.doesNotMatch(desert,/streetlamp/);
});

test('locked physics is deterministic, editor may not add, remove or replace measurements',()=>{
 const choices=resolveSelections(sample());
 const original=prompt();
 assert.ok(original.includes(physicsStatement(choices,deriveSceneLighting(choices),false)));
 assert.equal(validateEditorialRewrite(original,original),true);
 for(const wrong of [
  original.replace('195 cm','193 cm'),
  original.replace('88 kg','83 kg'),
  original.replace('generic smartphone','Xiaomi 15 Ultra'),
  original.replace('Touch Pro Duo','portrait display'),
  original+' Camera FOV77° with brow0°.',
  original+' The steering wheel is on the right of the driver.',
  original+' A second studio light fills the face.'
 ]){
  assert.equal(validatePrompt(wrong,choices),false);
  assert.equal(validateEditorialRewrite(original,wrong),false);
 }
});

test('all option categories still contain frozen physical data',()=>{
 for(const [key,items] of Object.entries(physicsCatalogue)){
  assert.equal(items.length,optionCatalogue[key as keyof typeof optionCatalogue].length,key);
  for(const [i,item] of items.entries()){
   assert.equal(item.id,optionCatalogue[key as keyof typeof optionCatalogue][i]!.id);
   assert.ok(Object.isFrozen(item.physics));
  }
 }
});
