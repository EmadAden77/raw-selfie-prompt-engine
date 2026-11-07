import { fixedPhysicsOptions } from './base.js';
export type VisibleVehiclePart =
  'wheel edge'|'no cabin'|'roof edge'|'rearview mirror'|'beige passenger seat'|'seat back'|
  'open window edge'|'cabin edge'|'partial cabin'|'side window edge'|'seat edge'|'open door edge'|
  'driver door edge'|'hood edge'|'front fascia edge'|'rear quarter'|'curb edge'|'car door edge'|
  'ground edge'|'car edge only'|'rear car edge'|'mirror edge'|'parked car edge'|'side window reflection';
export interface AnglePhysical {
  readonly cameraDistanceCm: number;
  readonly effectiveHorizontalFovDeg: number;
  readonly pitchDeg: number;
  readonly rollDeg: number;
  readonly armReachAngleDeg: number;
  readonly visibleBody: string;
  readonly visibleVehicle: VisibleVehiclePart;
  readonly wheelMayAppear: boolean;
  readonly dashboardMayAppear: boolean;
  readonly lensDistortion: 'mild peripheral stretch'|'close-range perspective stretch';
  readonly realCameraOriginRequired: true;
  readonly cameraMode: 'front'|'rear-reflection';
}
// Effective FOV is a 9:16 digital crop of the same phone lens; changing an
// angle never magically changes the physical Xiaomi front-camera focal length.
// Distance and joint angles are approximate scene geometry, not EXIF claims.
const rows: ReadonlyArray<readonly [number,number,number,number,number,string,VisibleVehiclePart,boolean,boolean]> = [[48,77,0,0,65,"face/shoulders","wheel edge",true,false],[32,74,17,0,55,"face/neck","no cabin",false,false],[50,75,-20,0,75,"face/shoulders","roof edge",false,false],[55,73,0,0,60,"face/shoulders","rearview mirror",false,false],[44,75,5,0,60,"face/shoulders","wheel edge",true,true],[49,77,0,0,65,"face/shoulders","beige passenger seat",false,false],[55,76,-2,0,68,"face/shoulders","seat back",false,false],[48,76,0,0,60,"face/shoulders","open window edge",false,false],[29,65,0,0,40,"face/neck","no cabin",false,false],[78,81,-4,0,85,"face/upper torso","cabin edge",false,false],[53,77,0,16,65,"face/shoulders","partial cabin",false,false],[48,78,0,0,60,"face/shoulders","side window edge",false,false],[52,75,0,0,65,"face/shoulders","seat edge",false,false],[55,78,-2,0,70,"face/upper torso","open door edge",false,false],[41,75,11,0,55,"face/shoulders","wheel edge",true,true],[63,78,0,0,70,"face/upper torso","driver door edge",false,false],[62,79,0,0,72,"face/upper torso","hood edge",false,false],[64,79,0,0,74,"face/upper torso","open door edge",false,false],[68,79,0,0,75,"face/upper torso","front fascia edge",false,false],[68,78,0,0,75,"face/upper torso","rear quarter",false,false],[55,78,-5,0,65,"face/upper torso","curb edge",false,false],[63,78,-8,0,70,"face/upper torso","car door edge",false,false],[51,79,16,0,60,"face/upper torso","ground edge",false,false],[67,80,-18,0,78,"face/upper torso","car edge only",false,false],[64,77,0,0,72,"face/upper torso","open door edge",false,false],[70,80,0,0,80,"face/upper torso","rear car edge",false,false],[52,74,0,0,63,"face/shoulders","mirror edge",false,false],[62,78,0,0,73,"face/upper torso","parked car edge",false,false],[46,72,0,0,59,"face/shoulders","side window reflection",false,false],[55,76,-5,12,65,"face/upper torso","curb edge",false,false]];
export const anglePhysics = fixedPhysicsOptions('selfieAngles',rows.map(
  ([cameraDistanceCm,effectiveHorizontalFovDeg,pitchDeg,rollDeg,armReachAngleDeg,
    visibleBody,visibleVehicle,wheelMayAppear,dashboardMayAppear],index):AnglePhysical=>({
      cameraDistanceCm,effectiveHorizontalFovDeg,pitchDeg,rollDeg,armReachAngleDeg,
      visibleBody,visibleVehicle,wheelMayAppear,dashboardMayAppear,
      lensDistortion:cameraDistanceCm<35?'close-range perspective stretch':'mild peripheral stretch',
      realCameraOriginRequired:true,
      cameraMode:[3,28].includes(index)?'rear-reflection':'front'
  })),p=>
  `phone ${p.cameraDistanceCm}cm, cropped FOV ${p.effectiveHorizontalFovDeg}°, pitch ${p.pitchDeg}°, roll ${p.rollDeg}°; ${p.visibleBody}, ${p.visibleVehicle}`);
