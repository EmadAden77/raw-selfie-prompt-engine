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
    inside||[22,29].includes(poseId)?clothing.seatedFolds:clothing.standingFolds;
  const support=pose.mechanicallySafe?pose.loadSupport:'grounded feet';
  const ground=place.curbHeightCm===15
    ? 'curb 15 cm gap 20–30 cm, wheels straight'
    : place.parkingGeometry+', no fabricated curb';
  const surface=place.parkingGeometry==='parallel-curb'?'worn Saudi asphalt':
    place.parkingGeometry==='road-shoulder'?'sandy shoulder':
    place.parkingGeometry==='farm-edge'?'firm soil/gravel':
    place.parkingGeometry==='covered-bay'?'scuffed concrete':'faded parking asphalt';
  const wall=place.nearestWallClearanceMinCm===null?'':', wall ≥100cm if adjacent';
  const intensity=scene.covered?Math.min(light.relativeIntensity,0.35):light.relativeIntensity;
  const lens=angle.lensDistortion==='close-range perspective stretch'?'close lens stretch':'mild edge stretch';
  const hairAir=hair.airflowOrContact==='none'?'':', '+hair.airflowOrContact;
  const wind=clothing.modelArealMassGsm>=300?'resists breeze':'wind only if present';
  const carZone=finish.modeledDustCoveragePct===0?'clean':finish.accumulationZones;
  return [
    'Physics:',
    'fabric '+clothing.material+' ~'+clothing.modelArealMassGsm+'gsm/'+clothing.modelThicknessMm+'mm, '+clothing.gravityDrape+', '+fold+', '+wind+';',
    'face '+face.activeMuscles+' brow'+face.browAngleDeg+'° mouth'+face.mouthCornerAngleDeg+'° eyes'+face.leftEyeOpeningPct+'/'+face.rightEyeOpeningPct+'%, identity fixed;',
    'hair '+hair.strandDirection+' lift'+hair.strandLiftDeg+'°, gravity down'+hairAir+', original density;',
    'phone '+angle.cameraDistanceCm+'cm FOV'+angle.effectiveHorizontalFovDeg+'° pitch'+angle.pitchDeg+'° roll'+angle.rollDeg+'° arm'+angle.armReachAngleDeg+'°, '+angle.visibleBody+'/'+angle.visibleVehicle+', '+lens+';',
    'joints elbow'+(pose.mechanicallySafe?pose.elbowAngleDeg:110)+'° knee'+(pose.mechanicallySafe?pose.kneeAngleDeg:170)+'° '+support+'-supported;',
    'ground if seen: '+surface+', '+ground+wall+';',
    'finish if seen: dust'+finish.modeledDustCoveragePct+'% water'+finish.modeledWaterCoveragePct+'%, '+carZone+';',
    'light '+scene.kelvin+'K '+scene.cameraSide+' intensity'+intensity+'.'
  ].join(' ').replace(/\s+/g,' ').trim();
}
