import { fixedPhysicsOptions } from './base.js';
export interface PosePhysical {
 readonly contactPoints:string;
 readonly loadSupport:'seat'|'feet'|'curb'|'hood';
 readonly mechanicallySafe:boolean;
 readonly requiresFixedPhoneMount:boolean;
 readonly gravityResponse:string;
 readonly motion:string;
}
const rows:ReadonlyArray<readonly [string,'seat'|'feet'|'curb'|'hood',boolean,boolean]> = [["seat cushion and backrest","seat",true,false],["seat cushion and bent knee","seat",true,false],["seat cushion and window frame","seat",true,false],["seat cushion, backrest and seat belt","seat",true,false],["seat cushion and console-side forearm","seat",true,false],["seat cushion, backrest and headrest","seat",true,false],["seat cushion and backrest","seat",true,false],["seat cushion, backrest and both steering-wheel hands","seat",true,true],["seat cushion and open-window armrest","seat",true,false],["front passenger seat cushion and backrest","seat",true,false],["seat cushion with free-hand mug","seat",true,false],["seat cushion and second-phone hand","seat",true,false],["seat cushion and mirror-adjusting hand","seat",true,false],["seat cushion and adjacent loose shemagh","seat",true,false],["seat cushion and interior door armrest","seat",true,false],["both feet on ground, hand on door","feet",true,false],["both feet on level ground","feet",true,false],["feet and lightly contacting closed hood","feet",true,false],["vehicle hood sheet metal under body weight","hood",false,false],["feet and moving parked door handle","feet",true,false],["one foot on ground and one on vehicle sill","feet",true,false],["curb top beneath hips and both feet planted","curb",true,false],["feet and free hand against fixed roof edge","feet",true,false],["feet and hose held in free hand","feet",true,false],["feet and rear-hatch handle","feet",true,false],["feet beside mirror without pulling it","feet",true,false],["alternating foot support during walking","feet",true,false],["feet with light rear body contact","feet",true,false],["curb edge and grounded feet","curb",true,false],["grounded feet and one hand at roof edge","feet",true,false]];
export const posePhysics=fixedPhysicsOptions('poses',rows.map(([contactPoints,loadSupport,mechanicallySafe,requiresFixedPhoneMount]):PosePhysical=>({
 contactPoints,loadSupport,mechanicallySafe,requiresFixedPhoneMount,
 gravityResponse:loadSupport==='seat'?'body supported by seat and backrest':
   loadSupport==='curb'?'body seated on curb with planted feet':'body supported by planted feet',
 motion:requiresFixedPhoneMount?'subject-initiated supported timer; no handheld impossibility':
   'small physically attainable movements, parked car remains stationary'
})),p=>p.gravityResponse+', '+p.contactPoints);
