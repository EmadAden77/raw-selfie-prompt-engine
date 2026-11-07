import { fixedPhysicsOptions } from './base.js';
export interface LightingPhysical {
  readonly selectedSource: string;
  readonly nominalKelvin: number;
  readonly relativeIntensity: number;
  readonly shadowDirection: string;
  readonly cabinReflection: string;
  readonly exteriorReflection: string;
  readonly inventedLightAllowed: false;
}
const models: ReadonlyArray<readonly [string,number,number,string,string,string]> = [["single morning sun",5000,0.68,"away from low sun","weak windshield and window bounce","soft ground reflectance"],["single high midday sun",5500,1,"away from high sun","controlled white-cloth and glass highlights","hard short shadows"],["single warm afternoon sun",4000,0.76,"away from low sun","one-sided window bounce","long ground shadows"],["single low sunset sun",3200,0.54,"away from horizon sun","warm weak window bounce","long warm shadows"],["diffuse cloud-filtered sky",6500,0.44,"soft contact shadows","diffuse window illumination","soft low-contrast shadows"],["existing indirect skylight",5500,0.28,"soft contact shadows","interior shade without fill","muted reflected ground light"],["one existing street fixture",3000,0.19,"away from visible fixture","weak reflections through actual glass","diminishing street reflections"],["one existing station fixture",3000,0.34,"away from visible fixture","localized window reflections","overhead ground shadows"],["nearby phone screen only",6500,0.035,"rapid falloff below chest","no additional cabin fill","distant exterior stays dark"],["actual front-screen or reflected rear LED flash",5500,0.82,"from actual flash optical axis","rapid localized reflections","rapid foreground falloff"]];
export const lightingPhysics = fixedPhysicsOptions('lighting',models.map(
  ([selectedSource,nominalKelvin,relativeIntensity,shadowDirection,
    cabinReflection,exteriorReflection]):LightingPhysical=>({
    selectedSource,nominalKelvin,relativeIntensity,shadowDirection,
    cabinReflection,exteriorReflection,inventedLightAllowed:false
  })),p=>
  `${p.selectedSource}, ${p.nominalKelvin}K nominal, intensity ${p.relativeIntensity}; ${p.shadowDirection}`);
