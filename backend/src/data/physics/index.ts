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
export function physicsStatement(selections: ResolvedSelections, scene: ResolvedLightForPhysics, inside: boolean): string {
  const p=resolvePhysicalOptions(selections);
  const clothing=p.clothing.physics,face=p.expressions.physics,hair=p.hairstyles.physics;
  const angle=p.selfieAngles.physics,pose=p.poses.physics,place=p.locations.physics;
  const finish=p.carConditions.physics;
  const poseId=Number(selections.poses.id.split('-').at(-1));
  const folds=inside?clothing.seatedFolds:poseId===27?clothing.walkingFolds:clothing.standingFolds;
  const vehicleGround=place.curbHeightCm===15?'15 cm curb, 20–30 cm clearance, straight wheels':
    'straight wheels, parked on the existing ground without inventing a curb';
  const contact=inside?'the real seat cushion and backrest':'grounded feet with realistic weight distribution';
  const reflection=[4,29].includes(Number(selections.selfieAngles.id.split('-').at(-1)));
  const visualBody=inside?'face and shoulders dominate, only natural torso portions visible':'face and upper body dominate at achievable arm reach';
  const surface=finish.modeledDustCoveragePct===0?'original clean paint':
    finish.accumulationZones+', '+finish.contamination;
  return [
    'Physics:',
    'fabric '+clothing.material+' with natural medium-weight gravity folds, '+clothing.gravityDrape+', '+folds+';',
    'face '+face.activeMuscles+'; original asymmetry and expression, without invented facial measurements;',
    'hair '+hair.strandDirection+', original density, hairline, curls and any natural gaps;',
    (reflection?'generic smartphone rear camera for one coherent reflection':'generic smartphone front camera at reachable selfie arm length')+', '+visualBody+', natural minor lens distortion; no invented specifications;',
    'pose '+pose.contactPoints+', '+contact+', plausible joints and clothing contact;',
    'parking '+place.sceneProfile.parking+', '+vehicleGround+'; ground '+place.sceneProfile.ground+';',
    'background when visible '+place.sceneProfile.background+', without inventing landmarks or widening the crop;',
    'finish where visible '+surface+', '+finish.opticalReflection+';',
    'lighting '+scene.kelvin+'K, '+scene.source+', '+scene.shadows+'; shared physically consistent exposure and reflections.'
  ].join(' ').replace(/\s+/g,' ').trim();
}
