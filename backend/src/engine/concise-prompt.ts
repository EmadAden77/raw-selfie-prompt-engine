import type { ResolvedSelections } from '../types/engine.types.js';
import type { ScenePlan } from './scene-planner.js';
import { deriveSceneLighting } from './rule-builder.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';
import { REQUIRED_PREFIX } from '../rules/language.rules.js';
import { isReflectionSelfie } from './photographic-auditor-v8.js';

export const LHD_GEOMETRY = 'Saudi LHD: steering wheel physically left, driver front-left, passenger front-right, console to the driver’s right; selfie mirroring never swaps sides.';
export const FACTORY_DASHBOARD = 'original 2022 Touch Pro Duo dual stacked landscape screens, infotainment above climate controls with rotary dials';
export const IDENTITY_CORE = 'Preserve reference facial geometry, natural asymmetry, apparent age, skin tone and texture, eyes, brows, nose, lips, jaw, hairline, thinning, hair density, curl pattern and facial-hair gaps; no reshaping, beautification or invented marks.';
export const BODY_CORE = 'Height 193 cm, weight 83 kg, natural lean athletic physique with proportional anatomy.';
export const SUBJECT_CORE = 'The reference person is the sole primary subject; never widen the selfie for surroundings.';
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
    return 'Only the nearby phone screen lights the face; illumination fades sharply below the chest, leaving the cabin and distance dark. No other lights or fill.';
  if (light === 10)
    return mirror
      ? 'Only the real rear LED flash lights the reflected path; glare remains at the reflected LED position, with correct falloff and no fill.'
      : 'Only the enabled front-screen flash lights the near face, not the rear LED; quick falloff, no extra fill.';
  if (scene.covered)
    return inside
      ? 'Existing overhead fixtures light the covered space through the car windows; face and cabin receive weaker reflected light, with plausible shadows and no fill.'
      : 'Existing overhead fixtures cast grounded shadows in the covered space; no direct sun or studio fill.';
  if (scene.time === 'night')
    return inside
      ? 'Only dim night sky or an actually present fixture enters the car through its windows; the shaded cabin stays dark, without hidden fill.'
      : location === 4
        ? 'Use dim night sky or an actually visible roadside fixture; keep real darkness and source-aligned shadows.'
        : 'Light comes from the actual nearby street or building fixture; shadows fade naturally, with no studio fill.';
  if (scene.time === 'sunset' || scene.time === 'afternoon')
    return inside
      ? 'Low warm sun enters through the actual window or windshield; window-facing cheek catches light while the opposite cheek and cabin remain shaded.'
      : 'Low warm sun creates long compatible shadows across the visible face and ground; natural reflections only.';
  if (scene.time === 'noon')
    return inside
      ? 'Harsh midday daylight enters only through actual vehicle glazing; roof and seat shade the inner cheek, while window-facing skin and white fabric retain realistic highlights.'
      : 'High sun creates short grounded shadows and natural highlight clipping; no artificial fill.';
  if (scene.time === 'overcast daylight' || scene.time === 'daylight in shade')
    return inside
      ? 'Diffuse skylight reaches the face through the side window and windshield; the far cheek and cabin stay softly shaded, without fill.'
      : 'Existing diffuse skylight makes soft contact shadows; no hidden fill.';
  return inside
    ? 'Morning daylight enters through the real side window and windshield; the window-facing cheek is brighter than the cabin-facing cheek, with natural bounce only.'
    : 'Existing morning daylight lights the exposed face and nearby surfaces from one compatible direction; no studio fill.';
}

function framingProse(inside: boolean, close: boolean): string {
  if (close)
    return 'Framing: face fills the close 9:16 selfie, with only naturally captured neck and shoulders; no pulled-back interior or roadside view.';
  if (inside)
    return 'Framing: face and shoulders dominate 9:16; crop around the upper chest. A steering hand or wheel edge may appear naturally, never the full lap, console or dashboard showcase.';
  return 'Framing: face and upper torso dominate 9:16 at reachable arm length; never shrink the person to showcase the car or road.';
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
  const expressionGuard = expression === 1 ? ' Lips at rest: no smile or posed grin.'
    : expression === 5 ? ' Do not turn this serious look into a smile.' : '';
  const scene = 'Scene: ' + choices.locations.text + ', unnamed everyday Saudi setting. ' +
    'Clothing: ' + choices.clothing.text + '. Expression: ' + choices.expressions.text + '.' +
    expressionGuard + ' Hair: ' + choices.hairstyles.text + ' within existing density. ' +
    'Pose: ' + choices.poses.text + '. Angle: ' + choices.selfieAngles.text + '.';
  const vehicle = inside
    ? 'Parked pearl-white 2022 Range Rover Sport, black rims; exterior outside this selfie.'
    : vehicleVisible(choices, false)
      ? 'Parked pearl-white 2022 Range Rover Sport, black rims, ' + choices.carConditions.text + '.'
      : 'Pearl-white 2022 Range Rover Sport with black rims stays parked off-frame.';
  const cabin = inside
    ? LHD_GEOMETRY + ' Only where framed: light beige leather seats, beige dashboard, black leather three-spoke wheel, dark glossy wood, chrome, piano-black trim, panoramic glass roof; ' + FACTORY_DASHBOARD + '. Never pull back to reveal hidden parts.'
    : '';
  const camera = reflection
    ? 'Camera: Xiaomi 15 Ultra 23 mm-equivalent f/1.63 rear-camera reflection selfie; phone and grip reflected once, rear lens aimed at the mirror or glass, scale and occlusion physically coherent.'
    : 'Camera: direct Xiaomi 15 Ultra 21 mm-equivalent f/2.0 front-camera selfie, hand-held at possible arm length; slight phone perspective and natural hand tilt, no external photographer, visible phone or portrait-mode blur.';
  const support = inside
    ? 'Real seat compression, supported joints and garment folds; phone hand and free hand stay distinct.'
    : 'Reachable selfie grip, physically supported pose and gravity-consistent garment folds.';
  const surface = inside
    ? 'Keep hidden or clean cabin surfaces clean.'
    : condition === 1 ? 'Freshly washed surfaces stay clean.'
      : condition === 5 ? 'Visible rain droplets and runoff follow gravity.'
        : vehicleVisible(choices, false) ? 'Road dirt stays local to plausible contact surfaces.' : '';
  const surroundings = !inside && !close ? backgroundProse(choices, variation, plan) : '';
  const realism = 'Photographic realism: reference-faithful skin pores, one natural phone exposure across face, fabric and visible cabin or car; believable shadows and restrained highlights. ' +
    support + ' ' + surface + ' ' + surroundings +
    ' No beauty filter, wax or plastic skin, CGI, invented blemishes, extra digits, impossible reflections or exaggerated HDR.';
  return [identity, scene, vehicle, cabin, camera, framingProse(inside, close),
    'Lighting: ' + lightingProse(choices, inside), realism].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}
