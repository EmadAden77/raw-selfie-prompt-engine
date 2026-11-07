import { fixedPhysicsOptions } from './base.js';
export interface CarSurfacePhysical {
 readonly accumulationZones:string;
 readonly contamination:string;
 readonly opticalReflection:string;
 readonly glassAffected:boolean;
 readonly gravityResponse:string;
 readonly motion:string;
 readonly pearlWhitePaintPreserved:true;
 readonly beigeInteriorAndBlackWheelPreserved:true;
}
const rows:ReadonlyArray<readonly [string,string,string,boolean]> = [["none","clean paint and clean glazing","sharp ordinary reflections",false],["lower door edges and horizontal ledges","fine road dust","slightly dulled paint highlights",false],["bodywork, lower doors and exposed glass","visible settled road dust","softened glass and paint reflections",true],["tire sidewalls and lower doors","contact-local mud","diffuse lower paint reflections",false],["paint, side glass and windshield","gravity-driven droplets","broken wet reflections",true],["tire treads, wheel arches and floor mats","dry sand near contact zones","muted lower reflections",false]];
export const carConditionPhysics=fixedPhysicsOptions('carConditions',rows.map(([accumulationZones,contamination,opticalReflection,glassAffected]):CarSurfacePhysical=>({
 accumulationZones,contamination,opticalReflection,glassAffected,
 gravityResponse:contamination==='gravity-driven droplets'?'selected droplets follow real downward gravity':'dry deposits settle only at contact zones',
 motion:'only the selected car surface condition, no unselected rain or mud',
 pearlWhitePaintPreserved:true,beigeInteriorAndBlackWheelPreserved:true
})),p=>p.contamination+', '+p.accumulationZones+', '+p.opticalReflection);
