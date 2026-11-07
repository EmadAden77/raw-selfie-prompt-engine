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
}
export function physicsStatement(selections: ResolvedSelections, scene: ResolvedLightForPhysics, inside: boolean): string {
  const p=resolvePhysicalOptions(selections);
  const clothing=p.clothing.physics,face=p.expressions.physics,hair=p.hairstyles.physics;
  const angle=p.selfieAngles.physics,pose=p.poses.physics,place=p.locations.physics;
  const finish=p.carConditions.physics,light=p.lighting.physics;
  const poseId=Number(selections.poses.id.split('-').at(-1));
  const fold=poseId===27?clothing.walkingFolds:
    poseId<=15||[19,22,29].includes(poseId)?clothing.seatedFolds:clothing.standingFolds;
  const support=pose.mechanicallySafe?pose.loadSupport:'feet, no hood seating';
  const ground=place.curbHeightCm===15
    ? 'curb 15cm gap 20–30cm, wheels straight'
    : place.parkingGeometry+', no fabricated curb';
  const wall=place.nearestWallClearanceMinCm===null?'':', wall >=100cm if adjacent';
  const intensity=scene.covered?Math.min(light.relativeIntensity,0.35):light.relativeIntensity;
  const lens=angle.lensDistortion==='close-range perspective stretch'?'close lens stretch':'mild edge stretch';
  return [
    'Physics:',
    'fabric '+clothing.material+' ~'+clothing.modelArealMassGsm+'gsm/'+clothing.modelThicknessMm+'mm, '+fold+';',
    'face brow '+face.browAngleDeg+'°, mouth '+face.mouthCornerAngleDeg+'°, eyes '+face.leftEyeOpeningPct+'/'+face.rightEyeOpeningPct+'%, identity locked;',
    'hair '+hair.strandDirection+' '+hair.strandLiftDeg+'° lift, unchanged density;',
    'camera '+angle.cameraDistanceCm+'cm/'+angle.effectiveHorizontalFovDeg+'° FOV, pitch '+angle.pitchDeg+'°, roll '+angle.rollDeg+'°, '+angle.visibleBody+'/'+angle.visibleVehicle+', '+lens+';',
    'joints elbow '+(pose.mechanicallySafe?pose.elbowAngleDeg:110)+'°, knee '+(pose.mechanicallySafe?pose.kneeAngleDeg:170)+'°, support '+support+';',
    'ground '+place.groundMaterial+', '+ground+wall+';',
    'finish dust '+finish.modeledDustCoveragePct+'%, water '+finish.modeledWaterCoveragePct+'%, '+(finish.glassAffected?'glass affected':'glass preserved')+';',
    'light '+scene.kelvin+'K '+scene.cameraSide+', relative intensity '+intensity+'.'
  ].join(' ').replace(/\s+/g,' ').trim();
}
