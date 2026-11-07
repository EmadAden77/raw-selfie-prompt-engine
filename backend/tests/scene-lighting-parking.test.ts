import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import { buildRulePrompt, deriveSceneLighting, LIGHTING_POLICY, PARKING_RULE, STREET_RULE, sceneLightingStatement, sceneParkingStatement } from '../src/engine/rule-builder.js';
import { expandCreativeDetails } from '../src/engine/creative-expander.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import type { CategoryKey, Selections } from '../src/types/engine.types.js';

const initial=Object.fromEntries(
  Object.entries(optionCatalogue).map(([key,options])=>[key,options[0]!.id])
) as Selections;
const select=(location:number,lighting:number,angle=1):Selections=>({
  ...initial,locations:'location-'+location,lighting:'light-'+lighting,selfieAngles:'angle-'+angle
});

test('every option in all 8 categories inherits legal parking, worn roadway and scene-specific light',()=>{
  const expected={locations:58,clothing:50,expressions:30,hairstyles:30,
    selfieAngles:30,poses:30,carConditions:6,lighting:10};
  for(const key of Object.keys(expected) as CategoryKey[]){
    assert.equal(optionCatalogue[key].length,expected[key],key);
    for(const item of optionCatalogue[key]){
      const selections={...initial,[key]:item.id};
      const resolved=resolveSelections(selections);
      const base=buildRulePrompt(resolved);
      assert.ok(base.includes(LIGHTING_POLICY),key+': '+item.id);
      assert.ok(base.includes(PARKING_RULE),key+': '+item.id);
      assert.ok(base.includes(STREET_RULE),key+': '+item.id);
      assert.ok(base.includes(sceneLightingStatement(resolved)),key+': '+item.id);
      assert.ok(base.includes(sceneParkingStatement(resolved)),key+': '+item.id);
      assert.ok(base.includes('195 cm')&&base.includes('88 kg'));
      const output=fallbackGenerator({selections,variation:3});
      assert.equal(validatePrompt(output,resolved),true,key+': '+item.id);
    }
  }
});

test('all 58 locations by 10 lighting choices resolve deterministically, even for covered and uncurbed settings',()=>{
  for(const loc of optionCatalogue.locations){
    for(const light of optionCatalogue.lighting){
      const selections={...initial,locations:loc.id,lighting:light.id};
      const resolved=resolveSelections(selections);
      const scene=deriveSceneLighting(resolved);
      const prompt=fallbackGenerator({selections,variation:2});
      assert.equal(validatePrompt(prompt,resolved),true,loc.id+' / '+light.id);
      assert.ok(prompt.includes('Lighting:'),loc.id);
      assert.ok(prompt.includes(loc.text),loc.id);
      assert.ok(prompt.includes('parked'),loc.id);
      assert.ok(prompt.includes('sole primary subject'),loc.id);
      if(scene.covered)assert.match(prompt,/parking|garage|ceiling|Filtered|daylight/i);
    }
  }
});

test('daytime desert follows real 5500K daylight and has no invented curb',()=>{
  const choices=resolveSelections(select(1,1));
  const p=deriveSceneLighting(choices);
  assert.equal(p.time,'day'); assert.equal(p.kelvin,5500);
  assert.match(p.source,/Single natural sun or diffuse sky/);
  assert.match(p.parking,/firm sandy roadside pull-off/);
  assert.doesNotMatch(p.parking,/20–30 cm/);
  assert.equal(validatePrompt(fallbackGenerator({selections:select(1,1),variation:1}),choices),true);
});

test('night villa uses its installed 3000K fixture and actual curb geometry',()=>{
  const choices=resolveSelections(select(17,7,16));const p=deriveSceneLighting(choices);
  assert.equal(p.time,'night');assert.equal(p.kelvin,3000);
  assert.match(p.source,/existing wall or neighborhood street fixture/);
  assert.match(p.parking,/20–30 cm/);
  assert.match(p.surface,/weathered|worn/i);
});

test('daytime mall open parking is a marked bay with natural 5500K light',()=>{
  const choices=resolveSelections(select(7,1,19));const p=deriveSceneLighting(choices);
  assert.equal(p.time,'day');assert.equal(p.kelvin,5500);
  assert.match(p.parking,/marked parking bay/);
  assert.match(p.surface,/parking asphalt/);
});

test('covered underground garage light comes from physical openings during day',()=>{
  const choices=resolveSelections(select(29,1));const p=deriveSceneLighting(choices);
  assert.equal(p.covered,true);assert.equal(p.kelvin,5500);
  assert.match(p.source,/Filtered 5500K daylight/);
  assert.doesNotMatch(p.source,/direct overhead sunshine|streetlamp/i);
});

test('NVIDIA receives location/time/weather/angle/light source within first 700 characters',()=>{
  const selections=select(17,7,16);
  const creative=expandCreativeDetails(resolveSelections(selections),5).slice(0,700);
  assert.match(creative,/location=.*villa/);
  assert.match(creative,/time=night/);
  assert.match(creative,/temperature=3000K/);
  assert.match(creative,/dominant source=.*fixture/);
  assert.match(creative,/selfie angle=/);
});

test('validator rejects missing lighting/parking policy, wrong time color and opposing shadows',()=>{
  const selections=select(17,7,16);
  const choices=resolveSelections(selections);
  const prompt=fallbackGenerator({selections,variation:1});
  assert.equal(validatePrompt(prompt,choices),true);
  assert.equal(validatePrompt(prompt.replace(/\bparked\b/i,'driving'),choices),false);
  assert.equal(validatePrompt(prompt.replace('Lighting:','Light:'),choices),false);
  assert.equal(validatePrompt(prompt.replace('sole primary subject','secondary subject'),choices),false);
  assert.equal(validatePrompt(prompt+' The vehicle has a right-hand drive cabin.',choices),false);
  assert.equal(validatePrompt(prompt+' The face is lit by cinematic lighting that brightens the eyes.',choices),false);
  assert.equal(validatePrompt(prompt+' Two dominant light sources illuminate opposing sides.',choices),false);
  assert.equal(validatePrompt(prompt+' Opposing shadows fall across the road.',choices),false);
  assert.equal(validatePrompt(prompt+' At 5500K the new fill illuminates the face.',choices),false);
});
