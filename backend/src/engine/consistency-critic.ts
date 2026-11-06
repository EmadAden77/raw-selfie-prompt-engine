import type { ScenePlan } from './scene-planner.js';
import { scenePlanSchema } from './scene-planner.js';

export interface CriticResult { plan:ScenePlan; repairs:string[]; accepted:number }
const unsafe=/\b(?:different|replace|alter|rebuild|reshape|new person|other subject|face swap|beige steering|blue car|red car|moving car|drive away|full.body|full interior|wide shot|zoom out|pull back|additional light|extra light|second sun|beauty light|cinematic|studio lighting|masterpiece|8k|hyperreal|flawless|perfect skin|invent scars|new wrinkles|opposing shadows|multiple shadows|famous landmark|burj khalifa|193 cm|83 kg|\d{4}k)\b/i;
const unsafeCharacters=/[<>{}\u0600-\u06ff`]/;
function acceptable(text:string):boolean {
  return text.length>=15&&text.length<=190&&!unsafe.test(text)&&!unsafeCharacters.test(text)
    &&!/^\s*(?:ignore|override|never|must|system|assistant)\b/i.test(text);
}
export function reviewScenePlan(value:unknown,baseline:ScenePlan):CriticResult|null {
  const parsed=scenePlanSchema.safeParse(value);
  if(!parsed.success)return null;
  const proposal=parsed.data;
  const plan:ScenePlan=structuredClone(baseline);
  const repairs:string[]=[];
  let accepted=0;
  const locked=[
    ['cameraGeometry',proposal.cameraGeometry,baseline.cameraGeometry],
    ['naturalLightSimulation',proposal.naturalLightSimulation,baseline.naturalLightSimulation],
    ['humanAppearancePreservation',proposal.humanAppearancePreservation,baseline.humanAppearancePreservation],
    ['vehicleInteriorConsistency',proposal.vehicleInteriorConsistency,baseline.vehicleInteriorConsistency]
  ] as const;
  for(const [key,proposed,fixed] of locked){
    if(JSON.stringify(proposed)!==JSON.stringify(fixed))repairs.push('restored_locked_'+key);
  }
  for(const key of ['support','handPlacement'] as const){
    if(proposal.physicalPoseConsistency[key]!==baseline.physicalPoseConsistency[key])repairs.push('restored_pose_'+key);
  }
  for(const key of ['parking','roadTexture'] as const){
    if(proposal.environmentalRealism[key]!==baseline.environmentalRealism[key])repairs.push('restored_environment_'+key);
  }
  const patches=[
    ['environmentalRealism','background'],
    ['clothingAndMaterialPhysics','fabricBehavior'],
    ['clothingAndMaterialPhysics','contactShadow'],
    ['photographicImperfectionControl','optics'],
    ['photographicImperfectionControl','skin'],
    ['photographicImperfectionControl','exposure']
  ] as const;
  for(const [group,key] of patches){
    const value=(proposal[group] as Record<string,string>)[key]!;
    if(acceptable(value)){
      const lower=value.toLowerCase();
      if(/\b(?:sun|lamp|flash|spotlight|softbox|steering wheel|dashboard|seats|range rover|car model|camera move)\b/.test(lower)){
        repairs.push('rejected_conflicting_'+group+'_'+key);continue;
      }
      (plan[group] as unknown as Record<string,string>)[key]=value;accepted++;
    }else if(value!==(baseline[group] as Record<string,string>)[key]){
      repairs.push('rejected_unsafe_'+group+'_'+key);
    }
  }
  return {plan:scenePlanSchema.parse(plan),repairs,accepted};
}
