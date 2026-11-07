import { fixedPhysicsOptions } from './base.js';
export interface ExpressionPhysical {
 readonly activeMuscles:string;
 readonly gravityResponse:string;
 readonly contactPoints:string;
 readonly motion:string;
 readonly referenceIdentityLocked:true;
 readonly faceReshapingAllowed:false;
}
const muscles:readonly string[]=["resting facial muscles","zygomatic muscles","zygomatic and cheek muscles","zygomatic and orbicularis oculi","relaxed brow and lip muscles","frontalis and eyelid elevator","one frontalis muscle","one orbicularis oculi","extraocular gaze muscles","gentle eyelid relaxation","eyelid lowering","relaxed forehead and jaw","mild corrugator activity","corrugator and depressor supercilii","inner brow elevator","zygomatic suppression","orbicularis and cheek relaxation","mild corrugator and eyelid focus","neutral facial muscle tone","jaw depressor with relaxed lips","orbicularis oris","unilateral frontalis","orbicularis oculi squint","jaw-opening muscles","zygomatic and lip elevator","extraocular gaze muscles","corrugator supercilii","frontalis eyelid elevator","orbicularis oculi and cheeks","one zygomatic group"];
export const expressionPhysics=fixedPhysicsOptions('expressions',muscles.map((activeMuscles):ExpressionPhysical=>({
 activeMuscles,
 gravityResponse:'natural facial soft tissue and relaxed gravity without altering proportions',
 contactPoints:'existing lips, eyelids, brows and cheeks only',
 motion:'subtle selected facial movement, never changing reference anatomy',
 referenceIdentityLocked:true,faceReshapingAllowed:false
})),p=>p.activeMuscles+'; '+p.motion);
