import { identityRules } from '../rules/identity.rules.js';
import { hairRules } from '../rules/hair.rules.js';
import { carRules } from '../rules/car.rules.js';
import { selfieRules } from '../rules/selfie.rules.js';
import { realismRules } from '../rules/realism.rules.js';
import { physicsRules } from '../rules/physics.rules.js';
import { locationRules } from '../rules/locations.rules.js';
import { BODY_RULE, BODY_FRAMING_RULE } from '../rules/body.rules.js';
import { COMPOSITION_RULE } from '../rules/composition.rules.js';
import { INTERIOR_RULE, INTERIOR_VISIBILITY_RULE, cabinMayBeVisible } from '../rules/cabin.rules.js';
import { REQUIRED_PREFIX } from '../rules/language.rules.js';
import type { ResolvedSelections } from '../types/engine.types.js';
import { isReflectionSelfie } from './photographic-auditor-v8.js';

// Mandatory composition-independent constraints. These describe the physical
// world; the subject remains the sole primary subject and nothing is widened
// just to show the road, parked vehicle or light fixtures.
export const PARKING_RULE = 'The 2022 Range Rover Sport is completely stationary in a legal, physically plausible parked position: parallel to the curb with straight wheels 20–30 cm from the curb when a roadside curb exists, aligned with the actual road edge on a safe desert shoulder without inventing a curb, or correctly within a marked parking bay or service area where parallel curb parking is not possible. Wheels, orientation, clearance, contact with the ground and road geometry must agree; never park diagonally across traffic, in a travel lane, or block a pump or entrance.';
export const STREET_RULE = 'Where the selected selfie field of view naturally shows the roadway, use a worn realistic everyday Saudi street: faded uneven dusty asphalt, modest patched sections, a weathered beige-and-gray concrete curb about 15 cm high where one exists, dust at edges, irregular curb wear, subdued paint and believable tire marks, only in amounts appropriate to the location. In desert scenes use a weathered sandy shoulder or rough road edge rather than inventing an urban curb; in covered parking use scuffed concrete and faint bay lines rather than inventing an outdoor street. Do not widen the selfie or fabricate any road surface outside the visible frame.';

export const LIGHTING_POLICY = 'Use only scene-supported light sources. Derive direction, color and intensity from time, cover, fixtures and camera geometry; allow passive surface bounce only as reflected light. Do not invent lamps, fill, rim lights or fixed Kelvin values where not justified. For screen-only shots the display is weak and close; a direct front camera cannot use a rear LED as frontal flash. Mirror selfies may use the rear LED with glare bound to its reflected position. All face, car, cabin and background shadows and reflections follow the same real sources. Preserve natural limited phone exposure and only physically justified clipping, noise or catchlights.';

// Location/time overrides must win when an otherwise valid selectable light
// contradicts a physical enclosure or explicitly night/sunset location.
const undergroundAndCovered = new Set([8, 10, 11, 12, 13, 29, 46]);
const desertLocations = new Set([1, 2, 3, 4, 5, 53, 55, 56]);
const parkingAreas = new Set([7, 8, 10, 11, 12, 13, 14, 28, 29, 30, 31, 32, 33, 35, 36]);
const locationNumber = (value:string):number => Number(value.split('-').at(-1));
export interface SceneLighting {
  time: string;
  kelvin: number;
  source: string;
  shadows: string;
  weather: string;
  surface: string;
  parking: string;
  cameraSide: string;
  covered: boolean;
}

export function deriveSceneLighting(s:ResolvedSelections):SceneLighting {
  const location=locationNumber(s.locations.id);
  const light=locationNumber(s.lighting.id);
  const angle=locationNumber(s.selfieAngles.id);
  const condition=locationNumber(s.carConditions.id);
  const covered=undergroundAndCovered.has(location);
  const desert=desertLocations.has(location);
  const side=angle%2===0?'camera-right':'camera-left';
  const weather=condition===5?'rain-damp air and wet reflective surfaces':
    condition===6||desert?'light suspended desert dust and dry muted air':
    light===5?'overcast diffuse air':condition===3?'light road dust': 'ordinary clear Saudi air';
  const surface=covered?'worn parking concrete, faint lines and tire scuffs':
    desert?'weathered sandy shoulder and cracked or dusty roadside margins':
    parkingAreas.has(location)?'patched access-lane asphalt, dusty edges and faded bay markings':
    'worn patched Saudi asphalt with faded curbstone, dusty gutters and imperfect paint';
  const parking=covered||parkingAreas.has(location)?'properly within a legal marked parking or service bay, never blocking a pump or access lane':
    desert?'safely parallel to the true road edge on a firm shoulder; no invented curb':
    'parked parallel to a 15 cm beige-gray concrete curb, straight wheels 20–30 cm from it in a legal roadside space';
  let time='morning',kelvin=5000,source='the one available low morning sun from the '+side+' sky',
    shadows='moderate soft-edged shadows away from the low sun';
  if(light===2){time='noon';kelvin=5500;source='one high direct sun toward '+side;
    shadows='short sharp shadows cast away from the high sun';}
  if(light===3){time='afternoon';kelvin=4000;source='one low warm sun from '+side;
    shadows='long shadows stretching away from the low sun';}
  if(light===4||location===3){time='sunset';kelvin=3200;source='one low orange sunset sun from '+side;
    shadows='long warm-edged shadows extending away from the low horizon sun';}
  if(light===5){time='overcast daylight';kelvin=6500;source='the same diffuse cloudy sky illuminating the frame';
    shadows='short low-contrast diffuse contact shadows only';}
  if(light===6){time='daylight in shade';kelvin=5500;source='existing indirect skylight, screened by the selected buildings';
    shadows='subtle diffuse shade and grounded contact shadows without a second source';}
  if(light===7||light===8||location===4||location===17){
    time='night';kelvin=3000;
    source=location===17?'one existing warm villa courtyard or wall fixture toward '+side:
      light===8?'one existing warm station fixture toward '+side:
      desert?'one actually visible roadside light if present, otherwise available dim night sky; never invent a streetlamp':
      'one visible warm street lamp toward '+side;
    shadows='one set of deep night shadows falling away from the actual dominant fixture; no invented fill';
  }
  if(light===9){time='night with screen light';kelvin=6500;
    source='the actual phone screen at reachable selfie distance only';
    shadows='rapid downward light falloff below the chest and very deep background shadows';}
  if(light===10){time='night with requested camera flash';kelvin=5500;
    source=isReflectionSelfie(s.selfieAngles.id)?'the real rear LED flash aimed along the mirror or glass reflection path':'the explicitly enabled phone front-screen flash';
    shadows='brief source-aligned shadows and rapid falloff; no extra fill or invented LED';}
  if(covered){
    // A ceiling occludes sunlight; a streetlight cannot illuminate an underground
    // garage or covered workshop. Screen-only selections also cannot reveal
    // unrelated off-camera fixtures.
    if(light!==9&&light!==10){
      const night=time==='night'||time==='sunset';
      kelvin=night?3000:4000;
      source='one existing ceiling fixture inside the selected covered area, above and '+side;
      shadows='grounded overhead shadows and realistic confined reflections, without direct sun or streetlamp';
      time=night?'covered area at night':'covered area during '+time;
    }
  }
  return {time,kelvin,source,shadows,weather,surface,parking,cameraSide:side,covered};
}

export function sceneLightingStatement(s:ResolvedSelections):string {
  const d=deriveSceneLighting(s);
  return 'Scene-specific lighting: time='+d.time+'; source='+d.source+
    '; color temperature='+d.kelvin+'K; weather='+d.weather+
    '; shadows='+d.shadows+
    '; exposure='+ (d.covered?'interior light weaker outside the lit ceiling area':'natural exterior-to-cabin falloff and sensor clipping')+
    '; face, clothing, skin, vehicle glass, pearl-white paint, black steering wheel, cabin surfaces and background share the same physically justified source, side, color temperature and reflections. No cinematic fill or opposing shadows.';
}
export function sceneParkingStatement(s:ResolvedSelections):string {
  const d=deriveSceneLighting(s);
  return 'Scene-specific parking and road surface: '+d.parking+
    '; selected ground='+d.surface+
    '; keep the scene authentic, mildly worn and naturally framed without inventing visible roadway.';
}
export function buildRulePrompt(selections:ResolvedSelections):string{
  const selected=[
    'Setting: '+selections.locations.text+' in an unnamed everyday Saudi area, with the subject vehicle safely parked',
    'Body pose: '+selections.poses.text,
    'Selfie angle: '+selections.selfieAngles.text,
    'Clothing: '+selections.clothing.text+', with gravity-consistent wrinkles and fabric weight',
    'Expression: '+selections.expressions.text+' without altering facial identity',
    'Hair direction: '+selections.hairstyles.text+' only within the reference hair\'s existing characteristics',
    'Vehicle surface condition: '+selections.carConditions.text,
    'Lighting selection: '+selections.lighting.text+'; if the setting is explicitly covered or at night, use the physically possible scene-specific source instead of contradictory direct sunlight'
  ];
  const interior=cabinMayBeVisible(selections.selfieAngles.id,selections.poses.id)
    ? [INTERIOR_RULE,INTERIOR_VISIBILITY_RULE] : [];
  const fixed=[
    ...identityRules,BODY_RULE,BODY_FRAMING_RULE,COMPOSITION_RULE,...hairRules,
    ...carRules,...interior,...selfieRules,...realismRules,...physicsRules,...locationRules,
    PARKING_RULE,STREET_RULE,LIGHTING_POLICY,sceneParkingStatement(selections),sceneLightingStatement(selections)
  ];
  return [REQUIRED_PREFIX+'.',...fixed,...selected].join(' ').replace(/\s+/g,' ').trim();
}
