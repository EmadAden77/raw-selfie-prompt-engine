// Complete immutable location-specific profiles; canonical order is checked against option-mappings.
import { optionCatalogue } from '../option-mappings.js';
import { location01 } from './scenes/location-01.js';
import { location02 } from './scenes/location-02.js';
import { location03 } from './scenes/location-03.js';
import { location04 } from './scenes/location-04.js';
import { location05 } from './scenes/location-05.js';
import { location06 } from './scenes/location-06.js';
import { location07 } from './scenes/location-07.js';
import { location08 } from './scenes/location-08.js';
import { location09 } from './scenes/location-09.js';
import { location10 } from './scenes/location-10.js';
import { location11 } from './scenes/location-11.js';
import { location12 } from './scenes/location-12.js';
import { location13 } from './scenes/location-13.js';
import { location14 } from './scenes/location-14.js';
import { location15 } from './scenes/location-15.js';
import { location16 } from './scenes/location-16.js';
import { location17 } from './scenes/location-17.js';
import { location18 } from './scenes/location-18.js';
import { location19 } from './scenes/location-19.js';
import { location20 } from './scenes/location-20.js';
import { location21 } from './scenes/location-21.js';
import { location22 } from './scenes/location-22.js';
import { location23 } from './scenes/location-23.js';
import { location24 } from './scenes/location-24.js';
import { location25 } from './scenes/location-25.js';
import { location26 } from './scenes/location-26.js';
import { location27 } from './scenes/location-27.js';
import { location28 } from './scenes/location-28.js';
import { location29 } from './scenes/location-29.js';
import { location30 } from './scenes/location-30.js';
import { location31 } from './scenes/location-31.js';
import { location32 } from './scenes/location-32.js';
import { location33 } from './scenes/location-33.js';
import { location34 } from './scenes/location-34.js';
import { location35 } from './scenes/location-35.js';
import { location36 } from './scenes/location-36.js';
import { location37 } from './scenes/location-37.js';
import { location38 } from './scenes/location-38.js';
import { location39 } from './scenes/location-39.js';
import { location40 } from './scenes/location-40.js';
import { location41 } from './scenes/location-41.js';
import { location42 } from './scenes/location-42.js';
import { location43 } from './scenes/location-43.js';
import { location44 } from './scenes/location-44.js';
import { location45 } from './scenes/location-45.js';
import { location46 } from './scenes/location-46.js';
import { location47 } from './scenes/location-47.js';
import { location48 } from './scenes/location-48.js';
import { location49 } from './scenes/location-49.js';
import { location50 } from './scenes/location-50.js';
import { location51 } from './scenes/location-51.js';
import { location52 } from './scenes/location-52.js';
import { location53 } from './scenes/location-53.js';
import { location54 } from './scenes/location-54.js';
import { location55 } from './scenes/location-55.js';
import { location56 } from './scenes/location-56.js';
import { location57 } from './scenes/location-57.js';
import { location58 } from './scenes/location-58.js';
export type ScenePeriod = 'day' | 'night';
export type PreferredAngle = 'driver' | 'passenger' | 'outside';
export interface SceneIllumination { readonly source:string; readonly kelvin:number; readonly shadows:string; readonly reflections:string }
export interface PlaceSceneProfile {
 readonly id:string; readonly arabicLabel:string; readonly parking:string; readonly preferredAngle:PreferredAngle;
 readonly angleReason:string; readonly ground:string; readonly background:string;
 readonly bestTime:ScenePeriod; readonly goldenTime:string;
 readonly day:SceneIllumination; readonly night:SceneIllumination;
}
const rows:readonly PlaceSceneProfile[] = [
  location01,
  location02,
  location03,
  location04,
  location05,
  location06,
  location07,
  location08,
  location09,
  location10,
  location11,
  location12,
  location13,
  location14,
  location15,
  location16,
  location17,
  location18,
  location19,
  location20,
  location21,
  location22,
  location23,
  location24,
  location25,
  location26,
  location27,
  location28,
  location29,
  location30,
  location31,
  location32,
  location33,
  location34,
  location35,
  location36,
  location37,
  location38,
  location39,
  location40,
  location41,
  location42,
  location43,
  location44,
  location45,
  location46,
  location47,
  location48,
  location49,
  location50,
  location51,
  location52,
  location53,
  location54,
  location55,
  location56,
  location57,
  location58
];
if(rows.length !== 58 || optionCatalogue.locations.length !== rows.length) throw new Error('58 place profiles required');
for(let i=0;i<rows.length;i++) {
 if(rows[i]!.id!==optionCatalogue.locations[i]!.id || rows[i]!.arabicLabel!==optionCatalogue.locations[i]!.label)
  throw new Error('Place profile option mismatch at location-'+(i+1));
 for(const period of ['day','night'] as const) {
  const light=rows[i]![period];
  if(!light.source||!light.kelvin||!light.shadows||!light.reflections)throw new Error('Incomplete '+period+' scene '+rows[i]!.id);
 }
 if(!rows[i]!.parking||!rows[i]!.preferredAngle||!rows[i]!.ground||!rows[i]!.background)throw new Error('Incomplete place geometry '+rows[i]!.id);
}
export const placeSceneProfiles:ReadonlyArray<PlaceSceneProfile> = Object.freeze(rows.map(p=>Object.freeze({...p,day:Object.freeze(p.day),night:Object.freeze(p.night)})));
export function placeSceneProfile(id:string):PlaceSceneProfile {
 const profile=placeSceneProfiles.find(p=>p.id===id);
 if(!profile)throw new Error('Unknown place profile: '+id);
 return profile;
}
