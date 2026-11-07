import { optionCatalogue } from '../option-mappings.js';
import { clothingPhysics } from './clothing.js';
import { expressionPhysics } from './expressions.js';
import { hairPhysics } from './hair.js';
import { posePhysics } from './poses.js';
import { carConditionPhysics } from './car-conditions.js';
import { getPlaceProfile } from '../place-profiles/index.js';

// Observable qualitative physics only. These are internal, not user-facing options.
// Every entry is tied by stable ID to exactly one visible Arabic option.
export interface SemanticPhysics {
  readonly id: string;
  readonly material: string;
  readonly gravity: string;
  readonly contact: string;
  readonly motion: string;
}
const freeze = (rows: SemanticPhysics[]) => Object.freeze(rows.map(x => Object.freeze(x)));
export const clothingSemantics = freeze(clothingPhysics.map(x => ({
  id:x.id,
  material:x.physics.material+' ('+x.physics.cut+')',
  gravity:x.physics.gravityDrape,
  contact:'standing: '+x.physics.standingFolds+'; seated: '+x.physics.seatedFolds,
  motion:'walking: '+x.physics.walkingFolds+'; no wind unless explicitly selected in the scene'
})));
export const expressionSemantics = freeze(expressionPhysics.map(x => ({
  id:x.id,material:'reference face and skin, natural muscle tone',
  gravity:'natural resting facial soft tissue; preserve original asymmetry',
  contact:x.physics.activeMuscles+' used only to express '+x.text,
  motion:'subtle expression change only; do not reshape features or add emotion'
})));
export const hairSemantics = freeze(hairPhysics.map(x => ({
  id:x.id,material:'the existing reference hair only, unchanged density and hairline',
  gravity:'existing strands follow gravity and original curl pattern',
  contact:x.physics.airflowOrContact==='none'?'no extra external contact':x.physics.airflowOrContact+' only because this hairstyle explicitly selects it',
  motion:x.physics.strandDirection+' within original length, no extra breeze, rain or density'
})));
export const poseSemantics = freeze(posePhysics.map(x => ({
  id:x.id,material:'ordinary human joints and natural clothing, never altered body proportions',
  gravity:x.physics.loadSupport==='seat'?'weight supported by a real seat':
    x.physics.loadSupport==='curb'?'weight supported by curb and planted feet':
    'weight supported by planted feet, not unsupported sheet metal',
  contact:x.physics.mechanicallySafe?x.physics.contactPoints:'repair unsupported hood seating to planted feet and light hand contact',
  motion:x.id==='pose-27'?'natural walking gait beside the stationary vehicle':
    x.physics.requiresFixedPhoneMount?'stationary, with subject-activated supported smartphone timer':
    'small natural pose adjustments; no vehicle movement'
})));
export const surfaceSemantics = freeze(carConditionPhysics.map(x => ({
  id:x.id,material:'unaltered pearl-white factory paint and existing glass',
  gravity:x.physics.contamination==='gravity-driven droplets'?'selected water droplets descend with gravity':
    'dry residue settles only at plausible contact and dust-collection zones',
  contact:x.physics.accumulationZones,
  motion:x.physics.contamination+'; '+x.physics.opticalReflection+'; do not add rain, water or dust outside selected condition'
})));
export const placeSemantics = freeze(optionCatalogue.locations.map(x => {
  const p=getPlaceProfile(x.id);
  return {id:x.id,material:p.ground,gravity:'natural contact and shadows on actual ground',
    contact:p.parking, motion:'only '+p.background+'; no new traffic, wind, rain or objects'};
}));
export const semanticPhysics = Object.freeze({
  clothing:clothingSemantics,
  expressions:expressionSemantics,
  hairstyles:hairSemantics,
  poses:poseSemantics,
  locations:placeSemantics,
  carConditions:surfaceSemantics
});
export function semanticFor<K extends keyof typeof semanticPhysics>(key:K,id:string):SemanticPhysics {
  const profile=semanticPhysics[key].find(x=>x.id===id);
  if(!profile)throw new Error('Missing semantic physics: '+key+'/'+id);
  return profile;
}
for(const key of Object.keys(semanticPhysics) as Array<keyof typeof semanticPhysics>) {
  const profiles=semanticPhysics[key];
  const options=optionCatalogue[key];
  if(profiles.length!==options.length)throw new Error('Incomplete semantic profiles: '+key);
  for(const [i,p] of profiles.entries()){
    if(p.id!==options[i]!.id||!p.material||!p.gravity||!p.contact||!p.motion)
      throw new Error('Invalid semantic profile '+key+'/'+options[i]!.id);
    if(/\\b\\d+(?:gsm|mm|FOV|°|%)\\b/i.test(Object.values(p).join(' ')))
      throw new Error('Numeric pseudo-physics in semantic profile '+p.id);
  }
}
