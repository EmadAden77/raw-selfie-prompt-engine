import type { ResolvedSelections } from '../../types/engine.types.js';
import { fixedOption } from './base.js';
import { semanticFor, semanticPhysics } from './semantic-profiles.js';
import { clothingPhysics } from './clothing.js';
import { expressionPhysics } from './expressions.js';
import { hairPhysics } from './hair.js';
import { anglePhysics } from './angles.js';
import { posePhysics } from './poses.js';
import { placePhysics } from './places.js';
import { carConditionPhysics } from './car-conditions.js';
import { lightingPhysics } from './lighting.js';

export { clothingPhysics, expressionPhysics, hairPhysics, anglePhysics, posePhysics, placePhysics, carConditionPhysics, lightingPhysics, semanticPhysics };
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
// A qualitative, selection-bound physics gate. No modeled joint, fabric or
// sensor numbers leave this function. Actual camera/pose repairs stay authoritative.
export function physicsStatement(selections: ResolvedSelections, scene: ResolvedLightForPhysics, inside: boolean): string {
  const p=resolvePhysicalOptions(selections);
  const clothing=semanticFor('clothing',selections.clothing.id);
  const face=semanticFor('expressions',selections.expressions.id);
  const hair=semanticFor('hairstyles',selections.hairstyles.id);
  const pose=semanticFor('poses',selections.poses.id);
  const place=semanticFor('locations',selections.locations.id);
  const finish=semanticFor('carConditions',selections.carConditions.id);
  const wearing=inside?p.clothing.physics.seatedFolds:p.clothing.physics.standingFolds;
  const originallySeated=p.poses.physics.loadSupport==='seat';
  const poseCompatible=p.poses.physics.mechanicallySafe && (inside===originallySeated);
  const supportedPose=poseCompatible?pose.contact:
    inside?'seat cushion and backrest, feet correctly grounded':
    'planted feet with no unsafe loading on body panels';
  const ground=p.locations.physics.curbHeightCm===15
    ? 'real concrete curb about 15 cm tall, wheels straight 20–30 cm away when parked parallel'
    : 'straight wheels grounded at the true parking surface, without a fabricated curb';
  const hairContact=p.hairstyles.physics.airflowOrContact;
  const allowedHairContact=hairContact==='none'?'':', selected hair response to '+hairContact;
  const movement=selections.poses.id==='pose-27'?'natural step and garment movement while the vehicle remains parked':
    'natural stillness or small body adjustments, never a moving car';
  return [
    'Physics:',
    'garment '+selections.clothing.text+', '+clothing.material+', '+clothing.gravity+', '+wearing+' under gravity;',
    'natural expression '+selections.expressions.text+', '+face.contact+', preserve original asymmetry and skin;',
    'original hair '+selections.hairstyles.text+', '+p.hairstyles.physics.strandDirection+
      allowedHairContact+', original density, length and curl pattern;',
    'generic smartphone at natural selfie reach; selected camera angle '+selections.selfieAngles.text+
      '; normal handheld edge distortion, actual visible framing '+p.selfieAngles.physics.visibleBody+';',
    'anatomy: '+supportedPose+', '+movement+';',
    'ground when visible: '+place.material+', '+ground+';',
    'vehicle finish '+selections.carConditions.text+', '+finish.contact+', '+p.carConditions.physics.contamination+
      ', '+p.carConditions.physics.opticalReflection+'; no invented weather;',
    'scene illumination '+scene.kelvin+'K from '+scene.source+', shadows '+scene.shadows+'.'
  ].join(' ').replace(/\\s+/g,' ').trim();
}
