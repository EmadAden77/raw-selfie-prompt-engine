import type { ScenePlan } from './scene-planner.js';
import type { ResolvedSelections } from '../types/engine.types.js';
import { validatePrompt } from './prompt-validator.js';
import { createScenePlan } from './scene-planner.js';

export interface QualityDiagnostic {
  category:'identity'|'geometry'|'lighting'|'materials'|'camera'|'contradictions';
  passed:boolean;note:string;
}
export function evaluateQuality(plan:ScenePlan,prompt:string,choices:ResolvedSelections):QualityDiagnostic[]{
  const baseline=createScenePlan(choices);
  return [
    {category:'identity',passed:plan.humanAppearancePreservation.faceUnchanged&&
      plan.humanAppearancePreservation.heightCm===195&&plan.humanAppearancePreservation.weightKg===88,
      note:'Protected identity and physique are specified, but the generated image is not evaluated.'},
    {category:'geometry',passed:JSON.stringify(plan.cameraGeometry)===JSON.stringify(baseline.cameraGeometry)&&
      JSON.stringify(plan.physicalPoseConsistency)===JSON.stringify(baseline.physicalPoseConsistency),
      note:'Camera reach and body support match the selected selfie and pose.'},
    {category:'lighting',passed:JSON.stringify(plan.naturalLightSimulation)===JSON.stringify(baseline.naturalLightSimulation),
      note:'Source, temperature and shadows agree with the selected scene.'},
    {category:'materials',passed:JSON.stringify(plan.vehicleInteriorConsistency)===JSON.stringify(baseline.vehicleInteriorConsistency)&&
      plan.environmentalRealism.parking===baseline.environmentalRealism.parking,
      note:'Vehicle and cabin visibility remain consistent with their protected specifications.'},
    {category:'camera',passed:/front.phone|front-facing|phone/i.test(prompt)&&
      !/\b(?:masterpiece|8K ultra|perfect skin)\b/i.test(prompt),
      note:'Smartphone optics without exaggerated styling.'},
    {category:'contradictions',passed:validatePrompt(prompt,choices),
      note:'Text-only consistency check; does not guarantee the resulting image.'}
  ];
}
