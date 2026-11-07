import { fixedPhysicsOptions } from './base.js';
export interface PosePhysical {
  readonly elbowAngleDeg: number;
  readonly kneeAngleDeg: number;
  readonly hipAngleDeg: number;
  readonly torsoLeanDeg: number;
  readonly contactPoints: string;
  readonly loadSupport: 'seat'|'feet'|'curb'|'hood';
  readonly seatLoadPct: number;
  readonly groundFeetLoadPct: number;
  readonly curbLoadPct: number;
  readonly mechanicallySafe: boolean;
  readonly requiresFixedPhoneMount: boolean;
}
// Modeled comfortable joint angles; every pair is still checked against its
// camera-origin and seat location. An 88 kg person is not supported on a
// lightweight Range Rover hood: that option requires a safe repair.
const rows: ReadonlyArray<readonly [number,number,number,number,string,'seat'|'feet'|'curb'|'hood',boolean,boolean]> = [[98,95,95,0,"seat cushion and backrest","seat",true,false],[100,60,100,0,"seat cushion and bent knee","seat",true,false],[90,95,95,15,"seat cushion and window frame","seat",true,false],[92,95,95,0,"seat cushion, backrest and seat belt","seat",true,false],[85,95,95,9,"seat cushion and console-side forearm","seat",true,false],[100,95,95,-10,"seat cushion, backrest and headrest","seat",true,false],[90,95,95,35,"seat cushion and backrest","seat",true,false],[95,100,100,0,"seat cushion, backrest and both steering-wheel hands","seat",true,true],[96,95,95,6,"seat cushion and open-window armrest","seat",true,false],[95,95,95,0,"front passenger seat cushion and backrest","seat",true,false],[95,95,95,0,"seat cushion with free-hand mug","seat",true,false],[95,95,95,0,"seat cushion and second-phone hand","seat",true,false],[75,95,95,12,"seat cushion and mirror-adjusting hand","seat",true,false],[95,95,95,0,"seat cushion and adjacent loose shemagh","seat",true,false],[100,95,95,12,"seat cushion and interior door armrest","seat",true,false],[100,175,175,0,"both feet on ground, hand on door","feet",true,false],[100,175,175,0,"both feet on level ground","feet",true,false],[110,167,163,-12,"feet and lightly contacting closed hood","feet",true,false],[100,90,95,0,"vehicle hood sheet metal under body weight","hood",false,false],[90,165,160,0,"feet and moving parked door handle","feet",true,false],[95,120,115,10,"one foot on ground and one on vehicle sill","feet",true,false],[100,80,88,10,"curb top beneath hips and both feet planted","curb",true,false],[100,175,175,5,"feet and free hand against fixed roof edge","feet",true,false],[105,168,165,10,"feet and hose held in free hand","feet",true,false],[90,170,165,3,"feet and rear-hatch handle","feet",true,false],[105,175,175,0,"feet beside mirror without pulling it","feet",true,false],[103,155,168,5,"alternating foot support during walking","feet",true,false],[105,170,163,10,"feet with light rear body contact","feet",true,false],[100,80,90,6,"curb edge and grounded feet","curb",true,false],[100,175,173,4,"grounded feet and one hand at roof edge","feet",true,false]];
export const posePhysics = fixedPhysicsOptions('poses',rows.map(
  ([elbowAngleDeg,kneeAngleDeg,hipAngleDeg,torsoLeanDeg,contactPoints,loadSupport,
    mechanicallySafe,requiresFixedPhoneMount]):PosePhysical=>({
      elbowAngleDeg,kneeAngleDeg,hipAngleDeg,torsoLeanDeg,contactPoints,
      loadSupport,
      seatLoadPct:loadSupport==='seat'?75:0,
      curbLoadPct:loadSupport==='curb'?75:0,
      groundFeetLoadPct:loadSupport==='seat'||loadSupport==='curb'?25:100,
      mechanicallySafe,requiresFixedPhoneMount
  })),p=>
  `elbow ${p.elbowAngleDeg}°, knee ${p.kneeAngleDeg}°; support ${p.loadSupport}`);
