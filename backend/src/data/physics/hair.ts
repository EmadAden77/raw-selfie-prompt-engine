import { fixedPhysicsOptions } from './base.js';
export interface HairPhysical {
 readonly strandDirection:string;
 readonly airflowOrContact:string;
 readonly gravityResponse:string;
 readonly contactPoints:string;
 readonly motion:string;
 readonly gravityActsDownward:true;
 readonly referenceLengthOnly:true;
 readonly referenceTextureOnly:true;
 readonly densityUnchanged:true;
}
const rows:ReadonlyArray<readonly [string,string]> = [["forward","none"],["right","ambient wind"],["left","ambient wind"],["side","none"],["front up","none"],["forehead down","none"],["downward damp","moisture"],["loosely random","none"],["toward open window","open-window air"],["forehead down","moisture"],["one front strand","none"],["back","none"],["natural center part","none"],["natural side part","none"],["forward with original gaps","none"],["reference curls","none"],["loose outward","ambient wind"],["toward head tilt","gravity"],["forward with head bend","gravity"],["slightly tangled","none"],["original dusty strands","none"],["damp strand tips","moisture"],["under cap","cap contact"],["at cap edge","cap contact"],["side out center down","none"],["slightly pushed","air conditioner"],["clumped","humidity"],["natural irregular ends","none"],["single forward strand","none"],["loosely tousled","none"]];
export const hairPhysics=fixedPhysicsOptions('hairstyles',rows.map(([strandDirection,airflowOrContact]):HairPhysical=>({
 strandDirection,airflowOrContact,gravityResponse:'strands fall within original curl and length',
 contactPoints:airflowOrContact==='none'?'no extra external contact':airflowOrContact+' only when selected',
 motion:'natural limited rearrangement of existing strands; no new hair',
 gravityActsDownward:true,referenceLengthOnly:true,referenceTextureOnly:true,densityUnchanged:true
})),p=>p.strandDirection+', '+p.contactPoints+'; original density and hairline');
