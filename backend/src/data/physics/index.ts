import type { ResolvedSelections } from '../../types/engine.types.js';
import { fixedOption } from './base.js';
import { clothingPhysics } from './clothing.js';
import { expressionPhysics } from './expressions.js';
import { hairPhysics } from './hair.js';
import { anglePhysics } from './angles.js';
import { posePhysics } from './poses.js';
import { placePhysics } from './places.js';
import { carConditionPhysics } from './car-conditions.js';
import { lightingPhysics } from './lighting.js';

export { clothingPhysics, expressionPhysics, hairPhysics, anglePhysics, posePhysics, placePhysics, carConditionPhysics, lightingPhysics };
export const physicsCatalogue = Object.freeze({
  clothing: clothingPhysics,
  expressions: expressionPhysics,
  hairstyles: hairPhysics,
  selfieAngles: anglePhysics,
  poses: posePhysics,
  locations: placePhysics,
  carConditions: carConditionPhysics,
  lighting: lightingPhysics
});
export function resolvePhysicalOptions(selections: ResolvedSelections) {
  return {
    clothing:fixedOption(clothingPhysics,selections.clothing.id),
    expressions:fixedOption(expressionPhysics,selections.expressions.id),
    hairstyles:fixedOption(hairPhysics,selections.hairstyles.id),
    selfieAngles:fixedOption(anglePhysics,selections.selfieAngles.id),
    poses:fixedOption(posePhysics,selections.poses.id),
    locations:fixedOption(placePhysics,selections.locations.id),
    carConditions:fixedOption(carConditionPhysics,selections.carConditions.id),
    lighting:fixedOption(lightingPhysics,selections.lighting.id)
  };
}

export interface ResolvedLightForPhysics {
  readonly kelvin: number;
  readonly cameraSide: string;
  readonly covered: boolean;
  readonly source: string;
  readonly shadows: string;
}
// Only observable constraints are verbalized. Numeric simulation parameters stay
// internal and must never be asserted as camera EXIF or real-world measurements.
export function physicsStatement(selections: ResolvedSelections, scene: ResolvedLightForPhysics, inside: boolean): string {
  const p=resolvePhysicalOptions(selections);
  const garment=p.clothing.physics, hair=p.hairstyles.physics;
  const angle=p.selfieAngles.physics, place=p.locations.physics;
  const finish=p.carConditions.physics;
  const fabricFold=inside ? garment.seatedFolds : garment.standingFolds;
  const ground=place.curbHeightCm===15
    ? 'real concrete curb about 15 cm tall, wheels straight 20–30 cm from its edge'
    : 'wheels straight on the actual legal ground, no fabricated urban curb';
  return [
    'Physics:',
    'medium-weight '+garment.material+' fabric with gravity-consistent drape: '+fabricFold+';',
    'natural expression: '+selections.expressions.text+', original facial asymmetry and eye shapes maintained;',
    'original hair density and hairline: '+hair.strandDirection+', natural gravity'+(hair.airflowOrContact==='none'?'':', '+hair.airflowOrContact)+';',
    'generic smartphone camera at reachable selfie arm length, slight handheld perspective and mild edge stretch; framing '+angle.visibleBody+', vehicle edge only if naturally visible;',
    'anatomy: grounded seated or standing support and plausible joints, '+(inside?'body supported by the correct seat and backrest':'weight supported by grounded feet')+', no impossible contact;',
    'ground if seen: '+place.groundMaterial+', '+ground+';',
    'surface if seen: '+finish.contamination+', '+finish.opticalReflection+', realistic dust or water only where the selected condition permits;',
    'light '+scene.kelvin+'K from '+scene.source+', shadows '+scene.shadows+', realistic subtle glass and bodywork reflections.'
  ].join(' ').replace(/\s+/g,' ').trim();
}
