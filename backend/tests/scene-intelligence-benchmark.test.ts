import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import type { Selections } from '../src/types/engine.types.js';
import { createScenePlan, scenePlanSchema } from '../src/engine/scene-planner.js';
import { reviewScenePlan } from '../src/engine/consistency-critic.js';
import { directRealism } from '../src/engine/realism-director.js';
import { evaluateQuality } from '../src/engine/quality-evaluator.js';
import { buildRulePrompt } from '../src/engine/rule-builder.js';
import { assemblePrompt } from '../src/engine/prompt-assembler.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';

const initial=Object.fromEntries(Object.entries(optionCatalogue).map(
  ([key,options])=>[key,options[0]!.id]
)) as Selections;
const benchmarks=[
  {name:'noon desert roadside',loc:1,light:2,angle:19,pose:17,kelvin:5500,cabin:false},
  {name:'night villa selfie outside',loc:17,light:7,angle:16,pose:16,kelvin:3000,cabin:false},
  {name:'sunset mall parking lot',loc:7,light:4,angle:19,pose:17,kelvin:3200,cabin:false},
  {name:'covered mall parking indoor selfie',loc:8,light:2,angle:1,pose:1,kelvin:4000,cabin:true},
  {name:'underground parking back seat',loc:29,light:8,angle:7,pose:7,kelvin:3000,cabin:true},
  {name:'close face selfie with natural morning',loc:15,light:1,angle:9,pose:2,kelvin:5000,cabin:true},
  {name:'phone-only light near villa',loc:17,light:9,angle:10,pose:16,kelvin:6500,cabin:false},
  {name:'outdoor gym afternoon',loc:34,light:3,angle:22,pose:22,kelvin:4000,cabin:false}
] as const;
test('benchmark: all 8 scene categories preserve locked geometry, physics and distinct lighting',()=>{
  const temperatures=new Set<number>();
  for(const b of benchmarks){
    const selections={...initial,
      locations:'location-'+b.loc,lighting:'light-'+b.light,
      selfieAngles:'angle-'+b.angle,poses:'pose-'+b.pose
    };
    const resolved=resolveSelections(selections);
    const plan=createScenePlan(resolved);
    assert.equal(scenePlanSchema.safeParse(plan).success,true,b.name);
    assert.equal(plan.naturalLightSimulation.kelvin,b.kelvin,b.name);
    assert.equal(plan.vehicleInteriorConsistency.visible,b.cabin,b.name);
    assert.equal(plan.humanAppearancePreservation.heightCm,193,b.name);
    assert.equal(plan.humanAppearancePreservation.weightKg,83,b.name);
    assert.ok(plan.cameraGeometry.armReachCm<=110,b.name);
    assert.match(plan.environmentalRealism.parking,/parked|parallel|parking|road edge|roadside|bay/i,b.name);
    const critique=reviewScenePlan(plan,plan);
    assert.ok(critique,b.name);
    const generated=assemblePrompt(buildRulePrompt(resolved),directRealism(critique.plan,resolved));
    const result=evaluateQuality(critique.plan,generated,resolved);
    assert.ok(result.every(x=>x.passed),b.name+': '+result.filter(x=>!x.passed).map(x=>x.category).join(','));
    assert.ok(generated.includes('sole primary subject'),b.name);
    assert.ok(generated.includes('193 cm')&&generated.includes('83 kg'),b.name);
    assert.ok(!/masterpiece|8K ultra/i.test(generated),b.name);
    const local=fallbackGenerator({selections,variation:1});
    assert.ok(local.startsWith('ChatGPT, using the reference image I uploaded'),b.name);
    temperatures.add(b.kelvin);
  }
  assert.ok(temperatures.size>=5);
});

test('malformed scene plan is rejected without changing fixed prompt in fallback',()=>{
  const resolved=resolveSelections(initial);
  const baseline=createScenePlan(resolved);
  assert.equal(reviewScenePlan({...baseline, extra:{override:'face'}},baseline),null);
  assert.equal(reviewScenePlan({...baseline,naturalLightSimulation:{...baseline.naturalLightSimulation,kelvin:'hot'}},baseline),null);
  assert.equal(reviewScenePlan(null,baseline),null);
});

test('critic changes only cosmetic text and restores impossible camera/car/light proposals',()=>{
  const resolved=resolveSelections({...initial,selfieAngles:'angle-19'});
  const baseline=createScenePlan(resolved);
  const proposal=structuredClone(baseline);
  proposal.cameraGeometry.armReachCm=125;
  proposal.cameraGeometry.visibleBody='entire body photographed from an external overhead crane';
  proposal.physicalPoseConsistency.handPlacement='both arms behind the back while holding the phone';
  proposal.naturalLightSimulation.source='three studio softboxes from opposing angles';
  proposal.vehicleInteriorConsistency.visibleElements=['dashboard fully visible outside the car'];
  proposal.vehicleInteriorConsistency.exteriorVisibleParts=['complete car interior in a wide shot'];
  proposal.environmentalRealism.roadTexture='a smooth laboratory studio floor';
  proposal.clothingAndMaterialPhysics.fabricBehavior='Cotton fabric follows small gravitational folds at the seated elbow.';
  const result=reviewScenePlan(proposal,baseline);
  assert.ok(result);
  assert.deepEqual(result.plan.cameraGeometry,baseline.cameraGeometry);
  assert.deepEqual(result.plan.naturalLightSimulation,baseline.naturalLightSimulation);
  assert.deepEqual(result.plan.vehicleInteriorConsistency,baseline.vehicleInteriorConsistency);
  assert.equal(result.plan.environmentalRealism.roadTexture,baseline.environmentalRealism.roadTexture);
  assert.equal(result.plan.clothingAndMaterialPhysics.fabricBehavior,proposal.clothingAndMaterialPhysics.fabricBehavior);
});
