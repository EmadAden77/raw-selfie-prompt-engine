import type { ResolvedSelections } from '../types/engine.types.js';
import type { ScenePlan } from './scene-planner.js';
import { getPlaceProfile } from '../data/place-profiles/index.js';
import { deriveSceneLighting } from './rule-builder.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';
import { REQUIRED_PREFIX } from '../rules/language.rules.js';
import { isReflectionSelfie } from './photographic-auditor-v8.js';
import { resolveCapture } from './scene-geometry.js';
import { physicsStatement } from '../data/physics/index.js';

export const LHD_GEOMETRY = 'Saudi LHD: driver front-left directly behind the left steering wheel, passenger front-right; wheel directly in front of driver and center console to the right of the driver; no mirroring of the fixed Saudi LHD layout.';
export const FACTORY_DASHBOARD = 'original 2022 Touch Pro Duo dual stacked landscape screens, infotainment above climate controls with rotary dials';
export const IDENTITY_CORE = 'Preserve reference facial geometry, asymmetry, age, skin tone, pores, eyes, brows, nose, lips, jaw, original hairline, density, curls and facial-hair gaps; no reshaping, beautification or invented marks.';
export const BODY_CORE = 'Height 195 cm, weight 88 kg; natural lean athletic physique and proportions.';
export const SUBJECT_CORE = 'Reference person remains the sole primary subject; no scenery-driven pullback.';
export const MAX_PROMPT_WORDS = 800;
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
      ? 'Existing overhead fixture from ' + scene.cameraSide + ' reaches cabin through glazing; shadows fall away, no fill.'
      : 'Covered overhead fixture from ' + scene.cameraSide + ' casts grounded shadows; no sun or fill.';
  if (scene.time === 'night')
    return inside
      ? 'Actual night fixture from ' + scene.cameraSide + ' or dim sky through windows; cabin shade remains deep.'
      : location === 4
        ? 'Use dim night sky or an actually visible roadside fixture; keep real darkness and source-aligned shadows.'
        : 'Actual street or building fixture from ' + scene.cameraSide + ' casts one set of shadows, no fill.';
  if (scene.time === 'sunset' || scene.time === 'afternoon')
    return inside
      ? 'Low sun from ' + scene.cameraSide + ' enters unobstructed glazing; facial and cabin shadows follow its direction.'
      : 'Low warm sun from ' + scene.cameraSide + ' casts long opposite shadows; real reflections only.';
  if (scene.time === 'noon')
    return inside
      ? 'Midday sun from ' + scene.cameraSide + ' enters glazing; pillars and roof cast aligned shade, natural highlights.'
      : 'High sun toward ' + scene.cameraSide + ' casts short grounded shadows; natural highlight clipping, no fill.';
  if (scene.time === 'overcast daylight' || scene.time === 'daylight in shade')
    return inside
      ? 'Diffuse skylight through real windows gives soft facial contrast; the deeper cabin receives less light.'
      : 'Existing diffuse skylight makes soft contact shadows; no hidden fill.';
  return inside
    ? 'Morning sun from ' + scene.cameraSide + ' through real glazing; shadows oppose it, no fill.'
    : 'Morning sun from ' + scene.cameraSide + ' lights the face; shadows fall away, no fill.';
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
  const detail=getPlaceProfile(choices.locations.id).background;
  return 'At the visible frame edge only: ' + detail + '.';
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
    ' Hair: ' + choices.hairstyles.text + '. ' +
    'Pose: ' + capture.pose + '. Angle: ' + capture.angleText + '.';
  const vehicle = inside
    ? 'The parked pearl-white 2022 Range Rover Sport has black rims; exterior off-frame.'
    : vehicleVisible(choices, false)
      ? 'The parked pearl-white 2022 Range Rover Sport has sport package, black rims/grille and LED headlights; visible surfaces only.'
      : 'Parked pearl-white 2022 Range Rover Sport, black sport rims, off-frame.';
  const cabin = inside
    ? LHD_GEOMETRY + ' Visible: beige leather seats/dashboard, black leather three-spoke wheel, glossy wood, chrome, piano-black trim, panoramic roof; ' + FACTORY_DASHBOARD + '. No off-frame details.'
    : 'Saudi LHD unchanged; no off-frame cabin details.';
  const camera = capture.mounted
    ? 'Camera: generic smartphone front-camera selfie on a securely supported timer mount, activated by the subject; natural phone optics and no external photographer.'
    : reflection
      ? 'Camera: generic smartphone rear-camera reflection selfie, phone held by the subject toward a real mirror or glass; single consistent reflection.'
      : 'Camera: generic smartphone front-camera selfie held by the subject at comfortable arm length, natural slight tilt, ordinary phone noise and no beauty processing.';
  const lighting = deriveSceneLighting(choices);
  const physical = physicsStatement(choices, lighting, inside);
  const surface = inside ? '' : condition === 1
    ? 'Freshly washed surfaces remain clean.' : condition === 5
      ? 'Visible droplets follow gravity.' : '';
  // Physical attributes for every selected option are mandatory. Only optional
  // atmosphere at a naturally visible frame edge can be omitted for brevity.
  const surroundings = !inside && !close ? backgroundProse(choices,variation) : '';
  const realism = 'Photographic realism: shared phone exposure, natural pores and folds; no beauty filters, wax, plastic skin, CGI, extra fingers or exaggerated HDR.';
  const mandatory = [identity, vehicle, cabin, scene, clothing,
    'Lighting: ' + lightingProse(choices, inside) + ' ' + lighting.kelvin + 'K.',
    personalDetails, camera, framingProse(inside, close, capture.steeringHand),
    (/thobe/i.test(choices.clothing.text) ? 'Allow more of the upper garment within natural arm-length framing without shrinking the face or widening to full body.' : 'Keep the selfie centered on the reference face and shoulders.'),
    physical, realism].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  const result = [mandatory,surface,surroundings].filter(Boolean).join(' ');

  return result;
}
