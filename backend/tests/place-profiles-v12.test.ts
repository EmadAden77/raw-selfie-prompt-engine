import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import { getPlaceProfile, placeProfiles } from '../src/data/place-profiles/index.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import { deriveSceneLighting } from '../src/engine/rule-builder.js';
import { resolveCapture } from '../src/engine/scene-geometry.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import type { Selections } from '../src/types/engine.types.js';

const defaults=Object.fromEntries(Object.entries(optionCatalogue).map(([key,values])=>[key,values[0]!.id])) as Selections;
const make=(more:Partial<Selections>={})=>({...defaults,...more});

test('58 profiles complete and bound to original selectable places',()=>{
 assert.equal(placeProfiles.length,58);
 for(const [index,p] of placeProfiles.entries()){
  const original=optionCatalogue.locations[index]!;
  assert.equal(p.id,original.id); assert.equal(p.label,original.label); assert.equal(p.setting,original.text);
  for(const field of ['parking','ground','background','automaticAngle','angleReason','goldenPeriod'] as const)
   assert.ok(p[field].length>5,p.id+'/'+field);
  for(const period of ['day','night'] as const){
   assert.ok(p[period].source.length>15,p.id);
   assert.ok(p[period].shadows.length>12,p.id);
   assert.ok(p[period].reflections.length>12,p.id);
   assert.ok(p[period].kelvin>=2700&&p[period].kelvin<=6500,p.id);
  }
 }
});
test('every location uses profile parking and day/night lighting',()=>{
 for(const o of optionCatalogue.locations){
  const p=getPlaceProfile(o.id);
  for(const [period,lighting] of [['day','light-1'],['night','light-7']] as const){
   const c=resolveSelections(make({locations:o.id,lighting}));
   const scene=deriveSceneLighting(c);
   assert.equal(scene.time,period); assert.equal(scene.kelvin,p[period].kelvin);
   assert.equal(scene.source,p[period].source);
   assert.equal(scene.parking,p.parking); assert.equal(scene.surface,p.ground);
  }
 }
});
test('automatic angle matches pose in station, villa, mall, desert and cafe',()=>{
 for(const id of ['location-10','location-15','location-7','location-1','location-39']){
  assert.equal(resolveCapture(resolveSelections(make({locations:id,selfieAngles:'angle-auto',poses:'pose-1'}))).seat,'driver',id);
  assert.equal(resolveCapture(resolveSelections(make({locations:id,selfieAngles:'angle-auto',poses:'pose-16'}))).seat,'outside',id);
 }
});
test('fuel pump remains on driver-side left',()=>{
 for(const id of ['location-10','location-11']){
  const req=make({locations:id,lighting:'light-7',selfieAngles:'angle-auto'});
  const prompt=fallbackGenerator({selections:req,variation:0});
  assert.match(prompt,/pump on the DRIVER'S LEFT/);
  assert.doesNotMatch(prompt,/pump on passenger right/i);
  assert.equal(validatePrompt(prompt,resolveSelections(req)),true);
 }
});
test('factory LHD, no branded phone, no fabricated visual parameters',()=>{
 const req=make({locations:'location-15',selfieAngles:'angle-auto',lighting:'light-7'});
 const p=fallbackGenerator({selections:req,variation:0});
 assert.match(p,/driver front-left directly behind the left steering wheel/i);
 assert.match(p,/dual stacked landscape screens/);
 assert.match(p,/generic smartphone front-camera selfie/);
 assert.doesNotMatch(p,/Xiaomi|iPhone|portrait screen|21mm|FOV\d+|\d+gsm|brow\d|mouth\d|eyes\d|elbow\d|knee\d|intensity\d/i);
 assert.match(p,/195 cm/); assert.match(p,/88 kg/); assert.match(p,/20–30 cm/);
});


test('all 58 locations render safe automatic selfies for day/night, seated/standing and both clothing crops',()=>{
 for(const profile of placeProfiles){
  for(const lighting of ['light-1','light-7']){
   for(const poses of ['pose-1','pose-16']){
    for(const clothing of ['clothing-1','clothing-28']){
     const request=make({locations:profile.id,lighting,poses,clothing,selfieAngles:'angle-auto'});
     const choices=resolveSelections(request);
     const capture=resolveCapture(choices);
     assert.equal(capture.seat,poses==='pose-1'?'driver':'outside',profile.id);
     const output=fallbackGenerator({selections:request,variation:1});
     assert.equal(validatePrompt(output,choices),true,profile.id+'/'+lighting+'/'+poses+'/'+clothing);
     assert.ok(output.includes('Parking: '+profile.parking),profile.id);
     assert.ok(output.includes((lighting==='light-7'?profile.night:profile.day).source),profile.id);
     assert.doesNotMatch(output,/Xiaomi|iPhone|portrait screen|FOV\d+|\d+gsm/i);
    }
   }
  }
 }
});
