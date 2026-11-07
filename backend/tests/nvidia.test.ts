import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { generatePrompt, validateCreativeAddition } from '../src/services/prompt.service.js';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import { createScenePlan, scenePlanInput } from '../src/engine/scene-planner.js';
import { reviewScenePlan } from '../src/engine/consistency-critic.js';
import type { Selections } from '../src/types/engine.types.js';

const selections=Object.fromEntries(Object.entries(optionCatalogue).map(([key,options])=>[key,options[0]!.id])) as Selections;
const key='nvapi-'+'a'.repeat(30);
const request={selections,variation:2};
const priorKey=process.env.NVIDIA_API_KEY;
process.env.NVIDIA_API_KEY=key;
after(()=>{if(priorKey===undefined)delete process.env.NVIDIA_API_KEY;else process.env.NVIDIA_API_KEY=priorKey;});
const original=globalThis.fetch;
const choices=resolveSelections(selections);
const baseline=createScenePlan(choices);
const nvidiaJson=(plan:unknown,status=200)=>new Response(JSON.stringify({
  choices:[{message:{content:JSON.stringify(plan)},finish_reason:'stop'}]
}),{status});

test('DeepSeek JSON scene planner uses 0.3 and leaves protected prompt text unchanged',async()=>{
  try{
    globalThis.fetch=async (_url,options)=>{
      const headers=(options as RequestInit).headers as Record<string,string>;
      assert.equal(headers.Authorization,'Bearer '+key);
      const body=JSON.parse((options as RequestInit).body as string) as {
        model:string;temperature:number;messages:Array<{content:string}>;
      };
      assert.equal(body.model,'deepseek-ai/deepseek-v4.1-flash');
      assert.equal(body.temperature,0.3);
      const input=JSON.parse(body.messages[1]!.content) as Record<string,unknown>;
      assert.ok('baseline' in input);
      assert.ok(!('referenceImage' in input));
      assert.ok(!body.messages[1]!.content.includes(key));
      return nvidiaJson({...baseline,environmentalRealism:{
        ...baseline.environmentalRealism,background:'A few distant shoppers move naturally across an existing patch of pavement.'
      }});
    };
    const result=await generatePrompt(request);
    assert.equal(result.source,'server',result.reason);
    assert.equal(result.reason,undefined);
    assert.match(result.prompt,/193 cm/);
    assert.match(result.prompt,/83 kg/);
    assert.match(result.prompt,/2022 Range Rover Sport/);
    assert.doesNotMatch(result.prompt,/few distant shoppers move naturally/); // off-frame in a driver-seat selfie
    assert.doesNotMatch(result.prompt,/nvapi-/);
  }finally{globalThis.fetch=original;}
});

test('NVIDIA adds bounded environment detail only for a naturally visible outdoor selfie',async()=>{
  const outside={...selections,selfieAngles:'angle-19',poses:'pose-17'};
  const reference=createScenePlan(resolveSelections(outside));
  const approved='A distant passerby walks beside the dusty roadside beyond the parked car.';
  try{
    globalThis.fetch=async()=>nvidiaJson({
      ...reference,environmentalRealism:{...reference.environmentalRealism,background:approved}
    });
    const result=await generatePrompt({selections:outside,variation:2});
    assert.equal(result.source,'server',result.reason);
    assert.ok(result.prompt.includes(approved));
    assert.match(result.prompt,/193 cm/);
    assert.match(result.prompt,/83 kg/);
    assert.match(result.prompt,/Saudi LHD/);
  }finally{globalThis.fetch=original;}
});

test('Consistency Critic repairs only conflicting fields, preserving safe environment detail',()=>{
  const proposal=structuredClone(baseline);
  proposal.cameraGeometry.phonePosition='an impossible external crane camera above the vehicle';
  proposal.humanAppearancePreservation.heightCm=190;
  proposal.naturalLightSimulation.kelvin=6500;
  proposal.vehicleInteriorConsistency.visible=!baseline.vehicleInteriorConsistency.visible;
  proposal.environmentalRealism.background='Subtle pedestrian traffic passes in the naturally visible distant background.';
  proposal.photographicImperfectionControl.optics='A gently imperfect phone sensor image preserves ordinary color and focus rolloff.';
  const reviewed=reviewScenePlan(proposal,baseline);
  assert.ok(reviewed);
  assert.equal(reviewed.plan.humanAppearancePreservation.heightCm,193);
  assert.equal(reviewed.plan.naturalLightSimulation.kelvin,baseline.naturalLightSimulation.kelvin);
  assert.deepEqual(reviewed.plan.cameraGeometry,baseline.cameraGeometry);
  assert.deepEqual(reviewed.plan.vehicleInteriorConsistency,baseline.vehicleInteriorConsistency);
  assert.equal(reviewed.plan.environmentalRealism.background,proposal.environmentalRealism.background);
  assert.ok(reviewed.repairs.some(x=>x.includes('restored_locked')));
});

test('invalid JSON and structurally invalid responses safely fall back',async()=>{
  try{
    globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{message:{content:'not json'}}]}),{status:200});
    let result=await generatePrompt(request);
    assert.equal(result.source,'local');
    assert.equal(result.reason,'unsafe_output');
    globalThis.fetch=async()=>nvidiaJson({cameraGeometry:{phonePosition:'unknown'}});
    result=await generatePrompt(request);
    assert.equal(result.source,'local');
    assert.equal(result.reason,'unsafe_output');
  }finally{globalThis.fetch=original;}
});

test('401 key errors are categorized without leaking credentials',async()=>{
  try{
    globalThis.fetch=async()=>new Response('secret information',{status:401});
    const result=await generatePrompt(request);
    assert.equal(result.source,'local');
    assert.equal(result.reason,'unauthorized');
    assert.doesNotMatch(JSON.stringify(result),/nvapi-/);
  }finally{globalThis.fetch=original;}
});

test('unsupported model is retried once with fast NVIDIA, then safely falls back',async()=>{
  const called:string[]=[];
  try{
    globalThis.fetch=async (_url,options)=>{
      const body=JSON.parse((options as RequestInit).body as string) as {model:string};
      called.push(body.model);
      return new Response('',{status:404});
    };
    const result=await generatePrompt(request);
    assert.equal(result.reason,'model_unavailable');
    assert.deepEqual(called,['deepseek-ai/deepseek-v4.1-flash','nvidia/nemotron-3.5-lightning-30b-a3b']);
  }finally{globalThis.fetch=original;}
});

test('DeepSeek timeout retries exactly one compatible JSON plan via fast NVIDIA',async()=>{
  const called:string[]=[];
  try{
    globalThis.fetch=async (_url,options)=>{
      const body=JSON.parse((options as RequestInit).body as string) as {model:string};
      called.push(body.model);
      if(called.length===1)throw new DOMException('fake timeout','TimeoutError');
      return nvidiaJson(baseline);
    };
    const result=await generatePrompt(request);
    assert.equal(result.source,'server',result.reason);
    assert.deepEqual(called,['deepseek-ai/deepseek-v4.1-flash','nvidia/nemotron-3.5-lightning-30b-a3b']);
  }finally{globalThis.fetch=original;}
});

test('model-proposed CGI, false steering material and unauthorized extra light are repaired or rejected',()=>{
  const candidate=structuredClone(baseline);
  candidate.vehicleInteriorConsistency.materials='beige steering wheel';
  candidate.environmentalRealism.background='Cinematic softbox light and CGI skin near the road';
  const result=reviewScenePlan(candidate,baseline);
  assert.ok(result);
  assert.deepEqual(result.plan.vehicleInteriorConsistency,baseline.vehicleInteriorConsistency);
  assert.equal(result.plan.environmentalRealism.background,baseline.environmentalRealism.background);
});

test('scene context contains no photo data and preserves exact option mapping',()=>{
  const input=scenePlanInput(choices,baseline);
  assert.match(input,/193/);
  assert.match(input,/83/);
  assert.match(input,/parked 2022/);
  assert.ok(!input.includes(key));
  assert.ok(!input.includes('imageBase64'));
  assert.equal(validateCreativeAddition('A blue car is moving through the shopping center while the photographer follows behind.'),false);
  assert.equal(validateCreativeAddition('A few distant shoppers cross the ordinary pavement, casting modest shadows beneath the existing light.'),true);
});

test('planner temperature is adjustable for fixed benchmark experiments without changing frontend',async()=>{
  const oldTemperature=process.env.NVIDIA_PLAN_TEMPERATURE;
  try{
    process.env.NVIDIA_PLAN_TEMPERATURE='0.5';
    globalThis.fetch=async (_url,options)=>{
      const body=JSON.parse((options as RequestInit).body as string) as {temperature:number};
      assert.equal(body.temperature,0.5);
      return nvidiaJson(baseline);
    };
    const result=await generatePrompt(request);
    assert.equal(result.source,'server',result.reason);
  }finally{
    globalThis.fetch=original;
    if(oldTemperature===undefined)delete process.env.NVIDIA_PLAN_TEMPERATURE;
    else process.env.NVIDIA_PLAN_TEMPERATURE=oldTemperature;
  }
});
