import { fixedPhysicsOptions } from './base.js';
export interface LightingPhysical {
 readonly selectedSource:string;
 readonly nominalKelvin:number;
 readonly shadowDirection:string;
 readonly cabinReflection:string;
 readonly exteriorReflection:string;
 readonly inventedLightAllowed:false;
}
const rows:ReadonlyArray<readonly [string,number,string,string,string]> = [["single morning sun",5000,"away from low sun","weak windshield and window bounce","soft ground reflectance"],["single high midday sun",5500,"away from high sun","controlled white-cloth and glass highlights","hard short shadows"],["single warm afternoon sun",4000,"away from low sun","one-sided window bounce","long ground shadows"],["single low sunset sun",3200,"away from horizon sun","warm weak window bounce","long warm shadows"],["diffuse cloud-filtered sky",6500,"soft contact shadows","diffuse window illumination","soft low-contrast shadows"],["existing indirect skylight",5500,"soft contact shadows","interior shade without fill","muted reflected ground light"],["one existing street fixture",3000,"away from visible fixture","weak reflections through actual glass","diminishing street reflections"],["one existing station fixture",3000,"away from visible fixture","localized window reflections","overhead ground shadows"],["nearby phone screen only",6500,"rapid falloff below chest","no additional cabin fill","distant exterior stays dark"],["actual front-screen or reflected rear LED flash",5500,"from actual flash optical axis","rapid localized reflections","rapid foreground falloff"]];
export const lightingPhysics=fixedPhysicsOptions('lighting',rows.map(
 ([selectedSource,nominalKelvin,shadowDirection,cabinReflection,exteriorReflection]):LightingPhysical=>({
 selectedSource,nominalKelvin,shadowDirection,cabinReflection,exteriorReflection,inventedLightAllowed:false
 })),p=>p.selectedSource+', '+p.nominalKelvin+'K, '+p.shadowDirection);
