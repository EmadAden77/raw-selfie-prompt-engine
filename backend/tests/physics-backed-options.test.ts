import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import { physicsCatalogue, resolvePhysicalOptions, physicsStatement } from '../src/data/physics/index.js';
import { resolveCapture } from '../src/engine/scene-geometry.js';
import { deriveSceneLighting } from '../src/engine/rule-builder.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import { buildConcisePrompt, promptWordCount } from '../src/engine/concise-prompt.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import { validateEditorialRewrite } from '../src/engine/editor-validator.js';
import type { CategoryKey, Selections } from '../src/types/engine.types.js';

const defaults=Object.fromEntries(Object.entries(optionCatalogue).map(([key,a])=>[key,a[0]!.id])) as Selections;
const resolved=(more:Partial<Selections>={})=>resolveSelections({...defaults,...more});
const sample={...defaults,clothing:'clothing-6',locations:'location-15',
  poses:'pose-1',selfieAngles:'angle-1',carConditions:'clean-2',lighting:'light-1'};

test('all 244 options are immutable id/Arabic-label/English-plus-physical records',()=>{
  const expected:Record<CategoryKey,number>={locations:58,clothing:50,expressions:30,
    hairstyles:30,selfieAngles:30,poses:30,carConditions:6,lighting:10};
  let count=0;
  for(const key of Object.keys(expected) as CategoryKey[]){
    const list=physicsCatalogue[key];
    assert.equal(list.length,expected[key],key);
    for(const [i,option] of list.entries()){
      count++;
      assert.equal(option.id,optionCatalogue[key][i]!.id);
      assert.equal(option.label,optionCatalogue[key][i]!.label);
      assert.equal(option.text,optionCatalogue[key][i]!.text);
      assert.match(option.label,/[\u0600-\u06ff]/);
      assert.ok(option.english.length>5);
      assert.ok(Object.isFrozen(option)&&Object.isFrozen(option.physics));
      const again=physicsCatalogue[key][i]!;
      assert.deepEqual(option,again);
    }
  }
  assert.equal(count,244);
});

test('navy thobe always has medium cotton drape and correct gravity-dependent folds',()=>{
  const a=resolvePhysicalOptions(resolved(sample)).clothing.physics;
  assert.equal(a.material,'cotton');
  assert.equal(a.modelArealMassGsm,175);
  assert.equal(a.modelThicknessMm,0.4);
  assert.equal(a.gravityDrape,'vertical hem drop');
  assert.match(a.standingFolds,/vertical folds/);
  assert.match(a.seatedFolds,/waist and knee compression/);
  assert.match(a.walkingFolds,/hem folds/);
  assert.match(a.windResponse,/only if air is present/);
  assert.deepEqual(resolvePhysicalOptions(resolved(sample)).clothing.physics,a);
});

test('each angle fixes physically attainable camera distance, FOV and visible parts',()=>{
  const driver=resolvePhysicalOptions(resolved(sample)).selfieAngles.physics;
  const passenger=resolvePhysicalOptions(resolved({...sample,selfieAngles:'angle-6'})).selfieAngles.physics;
  assert.equal(driver.cameraDistanceCm,48);
  assert.equal(driver.effectiveHorizontalFovDeg,77);
  assert.equal(driver.visibleVehicle,'wheel edge');
  assert.equal(driver.wheelMayAppear,true);
  assert.equal(driver.dashboardMayAppear,false);
  assert.equal(passenger.cameraDistanceCm,49);
  assert.equal(passenger.wheelMayAppear,false);
  assert.equal(passenger.dashboardMayAppear,false);
  for(const option of physicsCatalogue.selfieAngles){
    assert.ok(option.physics.cameraDistanceCm>=25&&option.physics.cameraDistanceCm<=80);
    assert.ok(option.physics.effectiveHorizontalFovDeg>=60&&option.physics.effectiveHorizontalFovDeg<=85);
    assert.equal(option.physics.realCameraOriginRequired,true);
  }
});

test('places fix 15cm concrete curb and 20-30cm car clearance only when a curb exists',()=>{
  const villa=resolvePhysicalOptions(resolved(sample)).locations.physics;
  const desert=resolvePhysicalOptions(resolved({...sample,locations:'location-1'})).locations.physics;
  assert.equal(villa.curbHeightCm,15);
  assert.deepEqual(villa.curbClearanceCm,[20,30]);
  assert.match(villa.groundMaterial,/Saudi asphalt/);
  assert.equal(villa.wheelOrientationDeg,0);
  assert.equal(villa.nearestWallClearanceMinCm,100);
  assert.equal(desert.curbHeightCm,null);
  assert.equal(desert.curbClearanceCm,null);
  assert.equal(desert.parkingGeometry,'road-shoulder');
  assert.match(desert.groundMaterial,/sandy shoulder/);
});

test('all six finishes and ten lights are numeric, deterministic and preserve factory car',()=>{
  for(const option of physicsCatalogue.carConditions){
    const p=option.physics;
    assert.ok(p.modeledDustCoveragePct>=0&&p.modeledDustCoveragePct<=30);
    assert.equal(p.pearlWhitePaintPreserved,true);
    assert.equal(p.beigeInteriorAndBlackWheelPreserved,true);
  }
  const light=resolvePhysicalOptions(resolved(sample)).lighting.physics;
  assert.equal(light.nominalKelvin,5000);
  assert.equal(light.relativeIntensity,0.68);
  assert.equal(light.inventedLightAllowed,false);
  for(const option of physicsCatalogue.lighting)
    assert.ok(option.physics.nominalKelvin>=3000&&option.physics.nominalKelvin<=6500);
});

test('Rule Builder and offline fallback include the exact eight-category physics, no NVIDIA',()=>{
  const choices=resolved(sample);
  const scene=deriveSceneLighting(choices);
  const locked=physicsStatement(choices,scene,true);
  const a=fallbackGenerator({selections:sample,variation:0});
  const b=fallbackGenerator({selections:sample,variation:0});
  assert.equal(a,b);
  assert.ok(a.includes(locked));
  assert.match(a,/195 cm/);
  assert.match(a,/88 kg/);
  assert.match(a,/black leather three-spoke wheel/);
  assert.match(a,/curb 15 cm gap 20–30 cm/);
  assert.match(a,/phone 48cm FOV77°/);
  assert.match(a,/fabric cotton ~175gsm\/0.4mm/);
  assert.equal(validatePrompt(a,choices),true);
});

test('validator rejects changed physics and NVIDIA fails closed on new measurements',()=>{
  const choices=resolved(sample);
  const original=fallbackGenerator({selections:sample,variation:0});
  for(const altered of [
    original.replace('phone 48cm','phone 95cm'),
    original.replace('FOV77°','FOV120°'),
    original.replace('~175gsm','~500gsm'),
    original.replace('curb 15 cm','curb 20 cm'),
    original.replace('gap 20–30 cm','gap 5–10 cm'),
    original.replace('light 5000K','light 3200K'),
    original+' The camera is 90 cm away.',
    original+' Brow 35° and fabric 600gsm.',
  ]){
    assert.equal(validatePrompt(altered,choices),false);
    assert.equal(validateEditorialRewrite(original,altered),false);
  }
});

test('unsupported weight on the Range Rover hood is corrected to grounded feet',()=>{
  const choices=resolved({...sample,poses:'pose-19',selfieAngles:'angle-19'});
  const capture=resolveCapture(choices);
  assert.equal(capture.poseRepaired,true);
  assert.match(capture.pose,/grounded feet/);
  assert.doesNotMatch(capture.pose,/sitting gently on hood/);
  const prompt=buildConcisePrompt(choices);
  assert.match(prompt,/feet-supported/);
  assert.equal(validatePrompt(prompt,choices),true);
});

test('all chosen categories independently change the locked physical clause',()=>{
  const base=resolved();
  const original=physicsStatement(base,deriveSceneLighting(base),true);
  for(const key of Object.keys(physicsCatalogue) as CategoryKey[]){
    const other=resolved({[key]:optionCatalogue[key][1]!.id});
    const changed=physicsStatement(other,deriveSceneLighting(other),true);
    assert.notEqual(original,changed,key);
  }
});

test('all selectable categories retain physical facts and remain locally valid',()=>{
  let max=0;
  for(const key of Object.keys(optionCatalogue) as CategoryKey[]){
    for(const option of optionCatalogue[key]){
      const choices=resolved({[key]:option.id});
      const prompt=buildConcisePrompt(choices);
      const words=promptWordCount(prompt);
      max=Math.max(max,words);
      assert.ok(words<=800,key+'/'+option.id+' words='+words);
      assert.equal(validatePrompt(prompt,choices),true,key+'/'+option.id);
    }
  }
  assert.ok(max<=800,'max words '+max);
});
