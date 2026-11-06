import { categories } from '../data';
import type { PromptRequest } from '../types/prompt';
import { cabinMayBeVisible } from '../data/fixedRules';

const PREFIX = 'ChatGPT, using the reference image I uploaded, generate an image of the exact same person';
const numberOf = (id: string): number => Number(id.split('-').at(-1));
function option(request: PromptRequest, key: string): string {
  const category = categories.find(item => item.key === key);
  if (!category) return '';
  return (category.options.find(item => item.id === request.selections[category.key]) ?? category.options[0])!.prompt;
}
const coveredLocations = [8, 10, 11, 12, 13, 29, 46];
const desertLocations = [1, 2, 3, 4, 5, 53, 55, 56];

function lightingProse(request: PromptRequest, inside: boolean): string {
  const location = numberOf(request.selections.locations);
  const light = numberOf(request.selections.lighting);
  const reflection = [4, 29].includes(numberOf(request.selections.selfieAngles));
  const covered = coveredLocations.includes(location);
  const night = [4, 17].includes(location) || [7, 8].includes(light);
  if (light === 9)
    return 'Only the nearby phone screen lights the face; illumination fades sharply below the chest, leaving the cabin and distance dark. No other lights or fill.';
  if (light === 10)
    return reflection
      ? 'Only the real rear LED flash lights the reflected path; glare remains at the reflected LED position, with correct falloff and no fill.'
      : 'Only the enabled front-screen flash lights the near face, not the rear LED; quick falloff, no extra fill.';
  if (covered)
    return inside
      ? 'Existing overhead fixtures light the covered space through the car windows; face and cabin receive weaker reflected light, with plausible shadows and no fill.'
      : 'Existing overhead fixtures cast grounded shadows in the covered space; no direct sun or studio fill.';
  if (night)
    return inside
      ? 'Only dim night sky or an actually present fixture enters the car through its windows; the shaded cabin stays dark, without hidden fill.'
      : location === 4
        ? 'Use dim night sky or an actually visible roadside fixture; keep real darkness and source-aligned shadows.'
        : 'Light comes from the actual nearby street or building fixture; shadows fade naturally, with no studio fill.';
  if (light === 4 || location === 3 || light === 3)
    return inside
      ? 'Low warm sun enters through the actual window or windshield; window-facing cheek catches light while the opposite cheek and cabin remain shaded.'
      : 'Low warm sun creates long compatible shadows across the visible face and ground; natural reflections only.';
  if (light === 2)
    return inside
      ? 'Harsh midday daylight enters only through actual vehicle glazing; roof and seat shade the inner cheek, while window-facing skin and white fabric retain realistic highlights.'
      : 'High sun creates short grounded shadows and natural highlight clipping; no artificial fill.';
  if (light === 5 || light === 6)
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

export function buildLocalPrompt(request: PromptRequest): string {
  const inside = cabinMayBeVisible(request.selections.selfieAngles, request.selections.poses);
  const angle = numberOf(request.selections.selfieAngles);
  const expression = numberOf(request.selections.expressions);
  const location = numberOf(request.selections.locations);
  const light = numberOf(request.selections.lighting);
  const condition = numberOf(request.selections.carConditions);
  const close = [2, 3, 9, 10, 11].includes(angle);
  const reflection = [4, 29].includes(angle);
  const visibleCar = angle >= 16 || [8, 12, 14].includes(angle);
  const expressionGuard = expression === 1 ? ' Lips at rest: no smile or posed grin.'
    : expression === 5 ? ' Do not turn this serious look into a smile.' : '';
  const scene = 'Scene: ' + option(request, 'locations') + ', unnamed everyday Saudi setting. ' +
    'Clothing: ' + option(request, 'clothing') + '. Expression: ' + option(request, 'expressions') + '.' +
    expressionGuard + ' Hair: ' + option(request, 'hairstyles') + ' within existing density. ' +
    'Pose: ' + option(request, 'poses') + '. Angle: ' + option(request, 'selfieAngles') + '.';
  const vehicle = inside
    ? 'Parked pearl-white 2022 Range Rover Sport, black rims; exterior outside this selfie.'
    : visibleCar
      ? 'Parked pearl-white 2022 Range Rover Sport, black rims, ' + option(request, 'carConditions') + '.'
      : 'Pearl-white 2022 Range Rover Sport with black rims stays parked off-frame.';
  const cabin = inside
    ? 'Saudi LHD: steering wheel physically left, driver front-left, passenger front-right, console to the driver’s right; selfie mirroring never swaps sides. Only where framed: light beige leather seats, beige dashboard, black leather three-spoke wheel, dark glossy wood, chrome, piano-black trim, panoramic glass roof; original 2022 Touch Pro Duo dual stacked landscape screens, infotainment above climate controls with rotary dials. Never pull back to reveal hidden parts.'
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
        : visibleCar ? 'Road dirt stays local to plausible contact surfaces.' : '';
  const contextual = desertLocations.includes(location)
    ? ['a distant passing vehicle', 'a patch of irregular dusty shoulder', 'faint roadside tire wear'][Math.abs(request.variation ?? 0) % 3]
    : coveredLocations.includes(location)
      ? ['a partial parked-car edge', 'faint scuffs on visible concrete', 'one distant pedestrian'][Math.abs(request.variation ?? 0) % 3]
      : ['a passing pedestrian at the far edge', 'a partly visible parked car', 'subtle worn road markings'][Math.abs(request.variation ?? 0) % 3];
  const surroundings = !inside && !close ? 'Only at the existing frame edge, if visible: ' + contextual + '.' : '';
  const realism = 'Photographic realism: reference-faithful skin pores, one natural phone exposure across face, fabric and visible cabin or car; believable shadows and restrained highlights. ' +
    support + ' ' + surface + ' ' + surroundings +
    ' No wax or plastic skin, beauty filters, CGI, invented blemishes, extra digits, impossible reflections or exaggerated HDR.';
  return [
    PREFIX + '.',
    'Preserve reference facial geometry, natural asymmetry, apparent age, skin tone and texture, eyes, brows, nose, lips, jaw, hairline, thinning, hair density, curl pattern and facial-hair gaps; no reshaping, beautification or invented marks.',
    'Height 193 cm, weight 83 kg, natural lean athletic physique with proportional anatomy.',
    'The reference person is the sole primary subject; never widen the selfie for surroundings.',
    scene, vehicle, cabin, camera, framingProse(inside, close),
    'Lighting: ' + lightingProse(request, inside), realism
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}
