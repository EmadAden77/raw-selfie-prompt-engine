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
  assert.equal(a.cut,'thobe');
  assert.ok(!('modelArealMassGsm' in a));
  assert.ok(!('modelThicknessMm' in a));
  assert.equal(a.gravityDrape,'vertical hem drop');
  assert.match(a.standingFolds,/vertical folds/);
  assert.match(a.seatedFolds,/waist and knee compression/);
  assert.match(a.walkingFolds,/hem folds/);
  assert.match(a.windResponse,/only if air is present/);
  assert.deepEqual(resolvePhysicalOptions(resolved(sample)).clothing.physics,a);
});

test('each of the 30 selfie angles has physical camera origin without fabricated lens values',()=>{
 const driver=resolvePhysicalOptions(resolved(sample)).selfieAngles.physics;
 const passenger=resolvePhysicalOptions(resolved({...sample,selfieAngles:'angle-6'})).selfieAngles.physics;
 assert.equal(driver.visibleVehicle,'wheel edge');
 assert.equal(driver.wheelMayAppear,true);
 assert.equal(driver.dashboardMayAppear,false);
 assert.equal(passenger.wheelMayAppear,false);
 const nearWheel=resolvePhysicalOptions(resolved({...sample,selfieAngles:'angle-5'})).selfieAngles.physics;
 assert.equal(nearWheel.dashboardMayAppear,true);
 for(const option of physicsCatalogue.selfieAngles){
  assert.ok(!('cameraDistanceCm' in option.physics));
  assert.ok(!('effectiveHorizontalFovDeg' in option.physics));
  assert.equal(option.physics.realCameraOriginRequired,true);
  assert.match(option.physics.handheldReach,/reachable/);
 }
});

test('all 30 poses use qualitative load support, contact and motion without joint angles',()=>{
 for(const option of physicsCatalogue.poses){
  const p=option.physics;
  assert.ok(p.contactPoints.length>10);
  assert.ok(p.gravityResponse.length>10&&p.motion.length>10);
  assert.ok(!('elbowAngleDeg' in p)&&!('seatLoadPct' in p));
 }
 const seated=resolvePhysicalOptions(resolved(sample)).poses.physics;
 assert.equal(seated.loadSupport,'seat');
 const walking=resolvePhysicalOptions(resolved({...sample,poses:'pose-27'})).poses.physics;
 assert.equal(walking.loadSupport,'feet');
 const unsafe=resolvePhysicalOptions(resolved({...sample,poses:'pose-19'})).poses.physics;
 assert.equal(unsafe.mechanicallySafe,false);
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

test('all six finishes are semantic, retain factory car, and never contain fabricated coverage',()=>{
 for(const option of physicsCatalogue.carConditions){
  const p=option.physics;
  assert.ok(!('modeledDustCoveragePct' in p)&&!('modeledWaterCoveragePct' in p));
  assert.ok(p.gravityResponse.length>10&&p.motion.length>10);
  assert.equal(p.pearlWhitePaintPreserved,true);
  assert.equal(p.beigeInteriorAndBlackWheelPreserved,true);
 }
 const light=resolvePhysicalOptions(resolved(sample)).lighting.physics;
 assert.equal(light.inventedLightAllowed,false);
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
  assert.match(a,/20–30 cm/);
  assert.match(a,/generic smartphone front-camera selfie/);
  assert.doesNotMatch(a,/\d+gsm|FOV\d+/);
  assert.match(a,/seat cushion and backrest/);
  assert.match(a,/gravity-consistent drape/);
  assert.equal(validatePrompt(a,choices),true);
});

test('validator rejects changed physics and NVIDIA fails closed on new measurements',()=>{
  const choices=resolved(sample);
  const original=fallbackGenerator({selections:sample,variation:0});
  for(const altered of [
    original.replace('195 cm','193 cm'),
    original.replace('88 kg','83 kg'),
    original.replace('20–30 cm','5–10 cm'),
    original.replace('scene illumination 5500K','scene illumination 3200K'),
    original.replace('generic smartphone front-camera selfie','Xiaomi camera selfie'),
    original+' The phone is 90 cm away.',
    original+' Brow 35° and fabric 600gsm.',
  ]){
    assert.notEqual(altered,original);
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
  assert.match(prompt,/planted feet/);
  assert.equal(validatePrompt(prompt,choices),true);
});

test('all chosen categories independently change the locked physical clause',()=>{
  const base=resolved();
  const original=physicsStatement(base,deriveSceneLighting(base),true);
  for(const key of ['clothing','expressions','hairstyles','selfieAngles','poses','locations','carConditions'] as CategoryKey[]){
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
