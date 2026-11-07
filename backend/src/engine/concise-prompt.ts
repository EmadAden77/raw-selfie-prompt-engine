import type { ResolvedSelections } from '../types/engine.types.js';
import type { ScenePlan } from './scene-planner.js';
import { deriveSceneLighting } from './rule-builder.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';
import { REQUIRED_PREFIX } from '../rules/language.rules.js';
import { isReflectionSelfie } from './photographic-auditor-v8.js';
import { resolveCapture } from './scene-geometry.js';

export const LHD_GEOMETRY = 'Saudi LHD: driver front-left, passenger front-right, wheel left, console right; no mirroring.';
export const FACTORY_DASHBOARD = 'original 2022 Touch Pro Duo dual stacked landscape screens, infotainment above climate controls with rotary dials';
export const IDENTITY_CORE = 'Preserve reference facial geometry, natural asymmetry, apparent age, skin tone and texture, eyes, brows, nose, lips, jaw, hairline, thinning, hair density, curl pattern and facial-hair gaps; no reshaping, beautification or invented marks.';
export const BODY_CORE = 'Height 195 cm, weight 88 kg; natural lean athletic physique and proportions.';
export const SUBJECT_CORE = 'Reference person remains the sole primary subject; no scenery-driven pullback.';
export const promptWordCount = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;
const numberOf = (id: string): number => Number(id.split('-').at(-1));

function vehicleVisible(choices: ResolvedSelections, inside: boolean): boolean {
  const angle = numberOf(choices.selfieAngles.id);
  return inside || angle >= 16 || [8, 12, 14].includes(angle);
}

// Direct daylight in a parked vehicle enters through glazing, not a fictional
// studio source. Keep the shaded cabin side darker than the window-facing side.
function lightingProse(choices: ResolvedSelections, inside: boolean): string {
  const scene = deriveSceneLighting(choices);
  const light = numberOf(choices.lighting.id);
  const location = numberOf(choices.locations.id);
  const mirror = isReflectionSelfie(choices.selfieAngles.id);
  if (light === 9)
    return 'Only the phone screen lights the face; weak illumination fades sharply below chest, leaving cabin dark, no fill.';
  if (light === 10)
    return mirror
      ? 'Only actual rear LED flash lights the selected reflection; glare remains at the reflected LED position, with real falloff.'
      : 'Only enabled front-screen flash lights the near face, not the rear LED; rapid falloff, no extra fill.';
  if (scene.covered)
    return inside
      ? 'Only existing overhead fixtures illuminate the covered area; their light reaches the cabin via real glazing, with grounded shadows.'
      : 'Existing overhead fixtures cast grounded shadows in the covered space; no direct sun or studio fill.';
  if (scene.time === 'night')
    return inside
      ? 'Only actual nearby night fixtures or dim sky light the windows; real obstructions leave the inner cabin dark.'
      : location === 4
        ? 'Use dim night sky or an actually visible roadside fixture; keep real darkness and source-aligned shadows.'
        : 'Light comes from the actual nearby street or building fixture; shadows fade naturally, with no studio fill.';
  if (scene.time === 'sunset' || scene.time === 'afternoon')
    return inside
      ? 'Low warm sun enters only through unobstructed vehicle glazing; facial highlights and cabin shade follow its actual direction.'
      : 'Low warm sun creates long compatible shadows across the visible face and ground; natural reflections only.';
  if (scene.time === 'noon')
    return inside
      ? 'Midday sunlight passes actual glazing; roof, pillars and seat cast source-aligned shade; white fabric retains highlights.'
      : 'High sun creates short grounded shadows and natural highlight clipping; no artificial fill.';
  if (scene.time === 'overcast daylight' || scene.time === 'daylight in shade')
    return inside
      ? 'Diffuse skylight through real windows gives soft facial contrast; the deeper cabin receives less light.'
      : 'Existing diffuse skylight makes soft contact shadows; no hidden fill.';
  return inside
    ? 'Morning sun through real glazing; face and cabin shadows follow its path, no fill.'
    : 'Existing morning sun lights the face; shadows agree with its direction, no fill.';
}

function framingProse(inside: boolean, close: boolean, steeringHand: boolean): string {
  if (close)
    return 'Framing: tight 9:16 face and shoulders; no pulled-back cabin or roadside view.';
  if (inside)
    return steeringHand
      ? 'Framing: face and shoulders dominate 9:16, chest crop; wheel hand at edge only, no lap or console.'
      : 'Framing: face and shoulders dominate 9:16; hands appear only if the angle includes them, never full dashboard.';
  return 'Framing: face and upper torso dominate 9:16; no pullback.';
}

// Deterministic Rule Builder selection. NVIDIA never contributes new objects,
// surface wear, light, material or scene geometry to these descriptions.
function backgroundProse(choices: ResolvedSelections, variation: number): string {
  const location = numberOf(choices.locations.id);
  const desert = [1, 2, 3, 4, 5, 53, 55, 56].includes(location);
  const covered = deriveSceneLighting(choices).covered;
  const index = Math.abs(variation) % 3;
  const detail = desert
    ? ['distant traffic', 'an irregular dusty shoulder', 'faint tire wear'][index]
    : covered
      ? ['a parked-car edge', 'faint concrete scuffs', 'one distant pedestrian'][index]
      : ['a pedestrian at the edge', 'a partly visible parked car', 'worn road markings'][index];
  return 'At the visible frame edge only: ' + detail + '.';
}

function parkingProse(choices: ResolvedSelections, inside: boolean): string {
  if (inside) return '';
  const d = deriveSceneLighting(choices);
  if (d.parking.includes('concrete curb'))
    return 'Visible roadside geometry only: straight wheels, parked parallel 20–30 cm from a 15 cm beige-gray concrete curb; worn dusty patched Saudi asphalt.';
  if (d.parking.includes('shoulder'))
    return 'If framed: straight wheels on a firm dusty shoulder parallel to the road, never an invented curb.';
  return 'If framed: straight wheels in a legal marked bay, authentic worn ground, no obstruction.';
}

export function buildConcisePrompt(choices: ResolvedSelections, _plan?: ScenePlan, variation = 0): string {
  const angle = numberOf(choices.selfieAngles.id);
  const capture = resolveCapture(choices);
  const { inside, close } = capture;
  const reflection = isReflectionSelfie(choices.selfieAngles.id);
  const expression = numberOf(choices.expressions.id);
  const condition = numberOf(choices.carConditions.id);
  const identity = [REQUIRED_PREFIX + '.', IDENTITY_CORE, BODY_CORE, SUBJECT_CORE].join(' ');
  const expressionGuard = expression === 1 ? ' No smile or posed grin.'
    : expression === 5 ? ' Do not turn this serious look into a smile.' : '';
  const scene = 'Scene: ' + choices.locations.text + ', unnamed Saudi setting.';
  const clothing = 'Clothing: ' + choices.clothing.text + '.';
  const personalDetails = 'Expression: ' + choices.expressions.text + '.' + expressionGuard +
    ' Hair: ' + choices.hairstyles.text + ' within existing density. ' +
    'Pose: ' + capture.pose + '. Angle: ' + capture.angleText + '.';
  const vehicle = inside
    ? 'The parked pearl-white 2022 Range Rover Sport has black rims; exterior off-frame.'
    : vehicleVisible(choices, false)
      ? 'The parked pearl-white 2022 Range Rover Sport retains sport package, black rims and grille, LED headlights; ' + choices.carConditions.text + ' only where visible.'
      : 'Pearl-white 2022 Range Rover Sport with sport package and black rims stays parked off-frame.';
  const cabin = inside
    ? LHD_GEOMETRY + ' Visible: light beige leather seats/dashboard, black leather three-spoke wheel, glossy dark wood, chrome, piano-black trim, panoramic roof; ' + FACTORY_DASHBOARD + '. No off-frame details.'
    : 'Saudi LHD unchanged; no off-frame cabin details.';
  const camera = capture.mounted
    ? reflection
      ? 'Camera: Xiaomi 15 Ultra 23 mm-equivalent f/1.63 rear-camera reflection selfie; supported timer mount aimed at a real mirror; one reflection, no hand-held viewpoint.'
      : 'Camera: Xiaomi 15 Ultra 21 mm-equivalent f/2.0 front-camera selfie on a physically supported cabin mount, timer started by the subject; no invented hand-held photographer.'
    : reflection
      ? 'Camera: Xiaomi 15 Ultra 23 mm-equivalent f/1.63 rear-camera reflection selfie; one reflected phone and grip, screen faces the subject, lens aimed at mirror/glass; real scale and occlusion.'
      : 'Camera: Xiaomi 15 Ultra 21 mm-equivalent f/2.0 front-camera selfie at arm reach; phone is outside its own direct view; slight tilt, no photographer, portrait mode or beauty processing.';
  const support = capture.mounted
    ? 'Hands grip wheel; fixed mount and seat contact obey physics.'
    : inside
      ? 'Seat contact and hands obey gravity; selfie and free hands remain distinct.'
      : 'Real grip, support and garment folds.';
  const surface = inside
    ? 'No invented cabin grime.'
    : condition === 1 ? 'Freshly washed surfaces stay clean.'
      : condition === 5 ? 'Visible rain droplets and runoff follow gravity.'
        : vehicleVisible(choices, false) ? 'Road dirt stays local to plausible contact surfaces.' : '';
  const surroundings = !inside && !close ? backgroundProse(choices, variation) : '';
  const realism = 'Photographic realism: shared phone exposure, reference pores, real folds, coherent shadows and highlights. ' +
    support + ' ' + surface + ' ' + surroundings +
    ' No wax or plastic skin, beauty filters, CGI, invented marks, extra fingers, false reflections or exaggerated HDR.';
  const lighting = deriveSceneLighting(choices);
  // Rule Builder alone owns source, Kelvin, shadow logic and physical dimensions.
  const result = [identity, vehicle, cabin, scene, clothing,
    'Lighting: ' + lightingProse(choices, inside) + ' ' + lighting.kelvin + 'K.',
    personalDetails, camera, framingProse(inside, close, capture.steeringHand),
    parkingProse(choices, inside), realism
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  return result;
}
