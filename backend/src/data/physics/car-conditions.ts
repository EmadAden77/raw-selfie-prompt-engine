import { fixedPhysicsOptions } from './base.js';
export interface CarSurfacePhysical {
  readonly modeledDustCoveragePct: number;
  readonly accumulationZones: string;
  readonly contamination: string;
  readonly opticalReflection: string;
  readonly glassAffected: boolean;
  readonly modeledWaterCoveragePct: number;
  readonly pearlWhitePaintPreserved: true;
  readonly beigeInteriorAndBlackWheelPreserved: true;
}
const models: ReadonlyArray<readonly [number,string,string,string,boolean,number]> = [[0,"none","clean paint and clean glazing","sharp ordinary reflections",false,0],[4,"lower door edges and horizontal ledges","fine road dust","slightly dulled paint highlights",false,0],[14,"bodywork, lower doors and exposed glass","visible settled road dust","softened glass and paint reflections",true,0],[8,"tire sidewalls and lower doors","contact-local mud","diffuse lower paint reflections",false,0],[0,"paint, side glass and windshield","gravity-driven droplets","broken wet reflections",true,18],[12,"tire treads, wheel arches and floor mats","dry sand near contact zones","muted lower reflections",false,0]];
export const carConditionPhysics = fixedPhysicsOptions('carConditions',models.map(
  ([modeledDustCoveragePct,accumulationZones,contamination,opticalReflection,
    glassAffected,modeledWaterCoveragePct]):CarSurfacePhysical=>({
    modeledDustCoveragePct,accumulationZones,contamination,opticalReflection,
    glassAffected,modeledWaterCoveragePct,pearlWhitePaintPreserved:true,
    beigeInteriorAndBlackWheelPreserved:true
  })),p=>
  `dust ${p.modeledDustCoveragePct}%, water ${p.modeledWaterCoveragePct}%; ${p.accumulationZones}, ${p.opticalReflection}`);
