import { fixedPhysicsOptions } from './base.js';
import { placeSceneProfiles, type PlaceSceneProfile } from './place-scene-profiles.js';
import { optionCatalogue } from '../option-mappings.js';

export type ParkingGeometry = 'parallel-curb'|'marked-bay'|'road-shoulder'|'covered-bay'|'farm-edge';
export interface PlacePhysical {
  readonly groundMaterial: string;
  readonly parkingGeometry: ParkingGeometry;
  readonly curbHeightCm: 15|null;
  readonly curbClearanceCm: readonly [20,30]|null;
  readonly nearestWallClearanceMinCm: number|null;
  readonly mainLightSource: string;
  readonly wheelOrientationDeg: 0;
  readonly sourceIsExisting: true;
  readonly sceneProfile: PlaceSceneProfile;
}
type PlaceClass = 'curb'|'lot'|'covered'|'desert'|'farm';
const locations: readonly PlaceClass[] = ["desert","desert","desert","desert","desert","curb","lot","covered","curb","covered","covered","covered","covered","lot","curb","curb","curb","curb","curb","curb","curb","curb","curb","curb","curb","curb","curb","lot","covered","lot","lot","lot","lot","curb","lot","lot","curb","curb","curb","curb","curb","curb","lot","curb","curb","covered","curb","curb","curb","curb","curb","curb","desert","lot","farm","desert","curb","curb"];
const nearWall = new Set([6,8,9,14,15,16,17,18,19,20,29,30,39,40,44,45,46,47,48,49,50,51,52]);
if(placeSceneProfiles.some((profile,index)=>profile.id!==optionCatalogue.locations[index]?.id || profile.arabicLabel!==optionCatalogue.locations[index]?.label))
  throw new Error('Every place profile must match its canonical Arabic location option');
export const placePhysics = fixedPhysicsOptions('locations',locations.map(
  (kind,index):PlacePhysical=>{
    const curb = kind === 'curb';
    return {
      groundMaterial:kind==='desert'
        ? index===1?'loose fine dust on sandy shoulder beside cracked desert road':
          'weathered sandy shoulder and cracked or dusty roadside margins':
        kind==='farm'?'firm compacted farm soil and gravel':
        kind==='covered'?'worn parking concrete, faint lines and tire scuffs':
        kind==='lot'?'patched access-lane asphalt, dusty edges and faded bay markings':
        'worn patched Saudi asphalt with faded curbstone and dusty gutters',
      parkingGeometry:kind==='desert'?'road-shoulder':
        kind==='farm'?'farm-edge':
        kind==='covered'?'covered-bay':
        kind==='lot'?'marked-bay':'parallel-curb',
      curbHeightCm:curb?15:null,
      curbClearanceCm:curb?[20,30]:null,
      nearestWallClearanceMinCm:nearWall.has(index+1)?100:null,
      mainLightSource:kind==='covered'?'one existing ceiling fixture or screen/flash if selected':
        kind==='desert'?'available sky or actually present roadside source':
        'available daylight or an existing selected-night fixture',
      wheelOrientationDeg:0,
      sourceIsExisting:true,
      sceneProfile:placeSceneProfiles[index]!
    };
  }),p=>p.curbHeightCm===15
    ? `${p.groundMaterial}; curb 15cm, parallel 20–30cm, wheels 0°`
    : `${p.groundMaterial}; ${p.parkingGeometry}, wheels 0°, no invented curb`);
