import { fixedPhysicsOptions } from './base.js';
export interface AnglePhysical {
 readonly visibleBody:string;
 readonly visibleVehicle:string;
 readonly wheelMayAppear:boolean;
 readonly dashboardMayAppear:boolean;
 readonly lensDistortion:'mild peripheral stretch'|'close-range perspective stretch';
 readonly realCameraOriginRequired:true;
 readonly cameraMode:'front'|'rear-reflection';
 readonly handheldReach:string;
 readonly opticalAxis:string;
}
const rows:ReadonlyArray<readonly [string,string,boolean,boolean]> = [["face/shoulders","wheel edge",true,false],["face/neck","no cabin",false,false],["face/shoulders","roof edge",false,false],["face/shoulders","rearview mirror",false,false],["face/shoulders","wheel edge",true,true],["face/shoulders","beige passenger seat",false,false],["face/shoulders","seat back",false,false],["face/shoulders","open window edge",false,false],["face/neck","no cabin",false,false],["face/upper torso","cabin edge",false,false],["face/shoulders","partial cabin",false,false],["face/shoulders","side window edge",false,false],["face/shoulders","seat edge",false,false],["face/upper torso","open door edge",false,false],["face/shoulders","wheel edge",true,true],["face/upper torso","driver door edge",false,false],["face/upper torso","hood edge",false,false],["face/upper torso","open door edge",false,false],["face/upper torso","front fascia edge",false,false],["face/upper torso","rear quarter",false,false],["face/upper torso","curb edge",false,false],["face/upper torso","car door edge",false,false],["face/upper torso","ground edge",false,false],["face/upper torso","car edge only",false,false],["face/upper torso","open door edge",false,false],["face/upper torso","rear car edge",false,false],["face/shoulders","mirror edge",false,false],["face/upper torso","parked car edge",false,false],["face/shoulders","side window reflection",false,false],["face/upper torso","curb edge",false,false]];
export const anglePhysics=fixedPhysicsOptions('selfieAngles',rows.map(
 ([visibleBody,visibleVehicle,wheelMayAppear,dashboardMayAppear],index):AnglePhysical=>({
  visibleBody,visibleVehicle,wheelMayAppear,dashboardMayAppear,
  lensDistortion:[1,8].includes(index)?'close-range perspective stretch':'mild peripheral stretch',
  realCameraOriginRequired:true,
  cameraMode:[3,28].includes(index)?'rear-reflection':'front',
  handheldReach:'only naturally reachable arm-length selfie distance',
  opticalAxis:'natural subject-held phone direction, no floating camera'
 })),p=>p.visibleBody+', '+p.visibleVehicle+', '+p.lensDistortion);
