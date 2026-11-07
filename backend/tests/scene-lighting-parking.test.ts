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
      if(scene.covered)assert.ok(prompt.includes(scene.source),'Covered-area light must match its locked scene source: '+loc.id+'/'+light.id);
    }
  }
});

test('noon desert uses 5500K high sun, short shadows and safe uncurbed roadside parking',()=>{
  const selections=select(1,2);
  const scene=deriveSceneLighting(resolveSelections(selections));
  const prompt=fallbackGenerator({selections,variation:1});
  assert.equal(scene.kelvin,5500);
  assert.equal(scene.time,'noon');
  assert.match(scene.source,/high direct sun/);
  assert.match(scene.shadows,/short sharp shadows/);
  assert.match(scene.parking,/parallel to the true road edge/);
  assert.match(scene.surface,/sandy shoulder/);
  assert.match(prompt,/195 cm/);
  assert.match(prompt,/88 kg/);
  assert.equal(validatePrompt(prompt,resolveSelections(selections)),true);
});

test('night villa uses one existing 3000K fixture with a consistent shadow direction and legal curb parking',()=>{
  const selections=select(17,7,16);
  const scene=deriveSceneLighting(resolveSelections(selections));
  const prompt=fallbackGenerator({selections,variation:1});
  assert.equal(scene.time,'night');
  assert.equal(scene.kelvin,3000);
  assert.match(scene.source,/one existing villa gate wall light/);
  assert.match(scene.shadows,/one set of shadows away from the actual fixture/);
  assert.match(scene.parking,/parallel to a real beige-gray concrete curb/);
  assert.match(scene.surface,/patched dusty Saudi asphalt/);
  assert.equal(validatePrompt(prompt,resolveSelections(selections)),true);
});

test('sunset mall open parking uses 3200K orange sunset with long shadows and real marked bays',()=>{
  const selections=select(7,4,19);
  const scene=deriveSceneLighting(resolveSelections(selections));
  const prompt=fallbackGenerator({selections,variation:1});
  assert.equal(scene.time,'sunset');
  assert.equal(scene.kelvin,3200);
  assert.match(scene.source,/orange sunset sun/);
  assert.match(scene.shadows,/long warm-edged shadows/);
  assert.match(scene.parking,/marked parking or service bay/);
  assert.match(scene.surface,/faded bay markings/);
  assert.equal(validatePrompt(prompt,resolveSelections(selections)),true);
});

test('underground parking never invents direct sun, streetlamp or outdoor asphalt',()=>{
  const choices=resolveSelections(select(29,2));
  const scene=deriveSceneLighting(choices);
  assert.equal(scene.covered,true);
  assert.equal(scene.kelvin,4000);
  assert.match(scene.source,/ceiling fixture/);
  assert.match(scene.surface,/parking concrete/);
  assert.doesNotMatch(scene.source,/direct sun|street lamp/);
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
