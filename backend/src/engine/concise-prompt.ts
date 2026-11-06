import type { ResolvedSelections } from '../types/engine.types.js';
import type { ScenePlan } from './scene-planner.js';
import { deriveSceneLighting } from './rule-builder.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';
import { REQUIRED_PREFIX } from '../rules/language.rules.js';
import { isReflectionSelfie } from './photographic-auditor-v8.js';

export const LHD_GEOMETRY = 'Saudi LHD: driver front-left, passenger front-right, wheel physically left, console right; no mirrored layout.';
export const FACTORY_DASHBOARD = 'original 2022 Touch Pro Duo dual stacked landscape screens, infotainment above climate controls with rotary dials';
export const IDENTITY_CORE = 'Preserve reference facial geometry, natural asymmetry, apparent age, skin tone and texture, eyes, brows, nose, lips, jaw, hairline, thinning, hair density, curl pattern and facial-hair gaps; no reshaping, beautification or invented marks.';
export const BODY_CORE = 'Height 193 cm, weight 83 kg, natural lean athletic physique with proportional anatomy.';
export const SUBJECT_CORE = 'The reference person is the sole primary subject; never widen for surroundings.';
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
      ? 'Only rear LED flash lights reflection; glare stays at reflected LED position, with real falloff.'
      : 'Only enabled front-screen flash lights near face, not the rear LED; rapid falloff, no fill.';
  if (scene.covered)
    return inside
      ? 'Existing overhead fixtures enter through car windows; face and cabin receive dimmer reflected light and grounded shadows.'
      : 'Existing overhead fixtures cast grounded shadows in the covered space; no direct sun or studio fill.';
  if (scene.time === 'night')
    return inside
      ? 'Dim night sky or an actual fixture enters through car windows; the cabin remains dark, without fill.'
      : location === 4
        ? 'Use dim night sky or an actually visible roadside fixture; keep real darkness and source-aligned shadows.'
        : 'Light comes from the actual nearby street or building fixture; shadows fade naturally, with no studio fill.';
  if (scene.time === 'sunset' || scene.time === 'afternoon')
    return inside
      ? 'Low warm sun through real glazing lights the window-facing cheek; opposite cheek and cabin stay shaded.'
      : 'Low warm sun creates long compatible shadows across the visible face and ground; natural reflections only.';
  if (scene.time === 'noon')
    return inside
      ? 'Midday sun enters through real glazing; roof shades cabin-side cheek, white fabric retains realistic highlights.'
      : 'High sun creates short grounded shadows and natural highlight clipping; no artificial fill.';
  if (scene.time === 'overcast daylight' || scene.time === 'daylight in shade')
    return inside
      ? 'Diffuse skylight through car windows softly lights the face; inner cheek and cabin remain shaded.'
      : 'Existing diffuse skylight makes soft contact shadows; no hidden fill.';
  return inside
    ? 'Morning daylight through real windows lights window-facing cheek; cabin-side cheek stays shaded, no extra fill.'
    : 'Existing morning sun lights the exposed face; surroundings share its shadow direction, no studio fill.';
}

function framingProse(inside: boolean, close: boolean): string {
  if (close)
    return 'Framing: tight 9:16 face and shoulders; no pulled-back cabin or roadside view.';
  if (inside)
    return 'Framing: face and shoulders dominate 9:16, cropped near chest; wheel hand at edge only, never full lap or console.';
  return 'Framing: face and upper torso dominate 9:16; no pullback to showcase car or road.';
}

function backgroundProse(choices: ResolvedSelections, variation: number, plan?: ScenePlan): string {
  const location = numberOf(choices.locations.id);
  const desert = [1, 2, 3, 4, 5, 53, 55, 56].includes(location);
  const covered = deriveSceneLighting(choices).covered;
  const option = Math.abs(variation) % 3;
  const contextual = desert
    ? ['a distant passing vehicle', 'a patch of irregular dusty shoulder', 'faint roadside tire wear'][option]
    : covered
      ? ['a partial parked-car edge', 'faint scuffs on visible concrete', 'one distant pedestrian'][option]
      : ['a passing pedestrian at the far edge', 'a partly visible parked car', 'subtle worn road markings'][option];
  // A proposed NVIDIA background can describe only a small visible detail.
  // Never let it expand the crop or introduce unknown locations.
  const candidate = plan?.environmentalRealism.background?.trim();
  const safe = candidate && candidate.length <= 110 &&
    !/^only ordinary/i.test(candidate) &&
    !/\b(?:show|reveal|widen|entire|whole|full|landmark|mall|tower|skyline)\b/i.test(candidate)
      ? candidate : contextual;
  return 'Only at the existing frame edge, if visible: ' + safe + '.';
}

export function buildConcisePrompt(choices: ResolvedSelections, plan?: ScenePlan, variation = 0): string {
  const angle = numberOf(choices.selfieAngles.id);
  const inside = cabinMayBeVisible(choices.selfieAngles.id, choices.poses.id);
  const close = [2, 3, 9, 10, 11].includes(angle);
  const reflection = isReflectionSelfie(choices.selfieAngles.id);
  const expression = numberOf(choices.expressions.id);
  const condition = numberOf(choices.carConditions.id);
  const identity = [REQUIRED_PREFIX + '.', IDENTITY_CORE, BODY_CORE, SUBJECT_CORE].join(' ');
  const expressionGuard = expression === 1 ? ' No smile or posed grin.'
    : expression === 5 ? ' Do not turn this serious look into a smile.' : '';
  const scene = 'Scene: ' + choices.locations.text + ', unnamed everyday Saudi setting. ' +
    'Clothing: ' + choices.clothing.text + '. Expression: ' + choices.expressions.text + '.' +
    expressionGuard + ' Hair: ' + choices.hairstyles.text + ' within existing density. ' +
    'Pose: ' + choices.poses.text + '. Angle: ' + choices.selfieAngles.text + '.';
  const vehicle = inside
    ? 'The parked pearl-white 2022 Range Rover Sport has black rims; exterior off-frame.'
    : vehicleVisible(choices, false)
      ? 'The parked pearl-white 2022 Range Rover Sport has black rims; ' + choices.carConditions.text + '.'
      : 'Pearl-white 2022 Range Rover Sport with black rims stays parked off-frame.';
  const cabin = inside
    ? LHD_GEOMETRY + ' Visible only: light beige leather seats/dashboard, black leather three-spoke wheel, glossy dark wood, chrome, piano-black trim, panoramic roof; ' + FACTORY_DASHBOARD + '. Never reveal off-frame details.'
    : 'Saudi LHD unchanged; no off-frame cabin details.';
  const camera = reflection
    ? 'Camera: Xiaomi 15 Ultra 23 mm-equivalent f/1.63 rear-camera reflection selfie; one reflected phone and grip, screen faces the subject, lens aimed at mirror/glass; real scale and occlusion.'
    : 'Camera: direct Xiaomi 15 Ultra 21 mm-equivalent f/2.0 front-camera selfie at reachable arm length; slight phone distortion and hand tilt; phone is outside its own direct view, no remote photographer or portrait mode.';
  const support = inside
    ? 'Seat compression and hands obey gravity; selfie and free hands remain distinct.'
    : 'Real grip, supported pose and gravity-driven folds.';
  const surface = inside
    ? 'Clean or hidden cabin surfaces stay clean.'
    : condition === 1 ? 'Freshly washed surfaces stay clean.'
      : condition === 5 ? 'Visible rain droplets and runoff follow gravity.'
        : vehicleVisible(choices, false) ? 'Road dirt stays local to plausible contact surfaces.' : '';
  const surroundings = !inside && !close ? backgroundProse(choices, variation, plan) : '';
  const realism = 'Photographic realism: shared phone exposure, reference pores, natural fabric folds, grounded shadows and highlights. ' +
    support + ' ' + surface + ' ' + surroundings +
    ' No wax or plastic skin, beauty filters, CGI, invented blemishes, extra fingers, impossible reflections or HDR.';
  return [identity, scene, vehicle, cabin, camera, framingProse(inside, close),
    'Lighting: ' + lightingProse(choices, inside), realism].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}
