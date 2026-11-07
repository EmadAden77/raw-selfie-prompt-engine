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
  const finish=p.carConditions.physics,light=p.lighting.physics;
  const poseId=Number(selections.poses.id.split('-').at(-1));
  const fold=poseId===27?clothing.walkingFolds:
    inside||[22,29].includes(poseId)?clothing.seatedFolds:clothing.standingFolds;
  const angleId=Number(selections.selfieAngles.id.split('-').at(-1));
  const requestedOnSeat=pose.loadSupport==='seat';
  const requestedOnCurb=pose.loadSupport==='curb';
  const normalizedSupport=inside?'seat':requestedOnCurb?'curb':'feet';
  const matches=pose.mechanicallySafe && (
    (inside && requestedOnSeat) ||
    (!inside && requestedOnCurb) ||
    (!inside && pose.loadSupport==='feet'));
  const support=normalizedSupport;
  const elbow=matches?pose.elbowAngleDeg:inside?95:110;
  const knee=matches?pose.kneeAngleDeg:inside?95:normalizedSupport==='curb'?80:170;
  const hip=matches?pose.hipAngleDeg:inside?95:normalizedSupport==='curb'?90:170;
  const lean=matches?pose.torsoLeanDeg:0;
  const contacts=!matches
    ? inside?'seat cushion and backrest'
      : normalizedSupport==='curb'?'grounded feet and curb seat':'grounded feet; no hood seating'
    : poseId===10 && angleId!==6?'selected seat cushion and backrest'
    : pose.contactPoints;
  const seatLoad=matches?pose.seatLoadPct:inside?75:0;
  const curbLoad=matches?pose.curbLoadPct:normalizedSupport==='curb'?75:0;
  const feetLoad=100-seatLoad-curbLoad;
  const ground=place.curbHeightCm===15
    ? 'curb 15 cm gap 20–30 cm, wheels straight'
    : place.parkingGeometry+', no fabricated curb';
  const surface=place.groundMaterial;
  const wall=place.nearestWallClearanceMinCm===null?'':', wall ≥100cm if adjacent';
  const intensity=scene.covered?Math.min(light.relativeIntensity,0.35):light.relativeIntensity;
  const lens=angle.lensDistortion==='close-range perspective stretch'?'close lens stretch':'mild edge stretch';
  const hairAir=hair.airflowOrContact==='none'?'':', '+hair.airflowOrContact;
  const wind=clothing.modelArealMassGsm>=300?'resists breeze':'wind only if present';
  const carZone=finish.modeledDustCoveragePct===0?'clean':finish.accumulationZones;
  return [
    'Physics:',
    'fabric '+clothing.material+' ~'+clothing.modelArealMassGsm+'gsm/'+clothing.modelThicknessMm+'mm, '+clothing.gravityDrape+', '+fold+', '+wind+';',
    'face '+face.activeMuscles+' brow'+face.browAngleDeg+'° mouth'+face.mouthCornerAngleDeg+'° eyes'+face.leftEyeOpeningPct+'/'+face.rightEyeOpeningPct+'% gaze'+face.eyeGazeAngleDeg+'°, identity fixed;',
    'hair '+hair.strandDirection+' lift'+hair.strandLiftDeg+'°, gravity down'+hairAir+', original length/texture/density;',
    'phone '+angle.cameraDistanceCm+'cm FOV'+angle.effectiveHorizontalFovDeg+'° pitch'+angle.pitchDeg+'° roll'+angle.rollDeg+'° '+(inside && pose.requiresFixedPhoneMount?'supported timer mount':'arm'+angle.armReachAngleDeg+'°')+', '+angle.visibleBody+'/'+angle.visibleVehicle+', '+lens+', '+(angle.wheelMayAppear?'wheel edge allowed':'wheel off-frame')+', '+(angle.dashboardMayAppear?'dash edge allowed':'dash off-frame')+';',
    'joints elbow'+elbow+'° knee'+knee+'° hip'+hip+'° lean'+lean+'°, '+support+'-supported; contact '+contacts+'; body load seat'+seatLoad+'% feet'+feetLoad+'% curb'+curbLoad+'%;',
    'ground if seen: '+surface+', '+ground+', wheels'+place.wheelOrientationDeg+'°'+wall+';',
    'finish if seen: dust'+finish.modeledDustCoveragePct+'% water'+finish.modeledWaterCoveragePct+'%, '+carZone+', '+finish.opticalReflection+', '+(finish.glassAffected?'glass affected':'no invented glazing marks')+';',
    'light '+scene.kelvin+'K '+scene.cameraSide+' intensity'+intensity+', source '+scene.source+', shadows '+scene.shadows+', '+(inside?light.cabinReflection:light.exteriorReflection)+'.'
  ].join(' ').replace(/\s+/g,' ').trim();
}
