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
    return 'Only the phone screen lights the face; weak illumination fades sharply below chest, leaving cabin dark, no fill.';
  if (light === 10)
    return reflection
      ? 'Only rear LED flash lights reflection; glare stays at reflected LED position, with real falloff.'
      : 'Only enabled front-screen flash lights near face, not the rear LED; rapid falloff, no fill.';
  if (covered)
    return inside
      ? 'Existing overhead fixtures enter through car windows; face and cabin receive dimmer reflected light and grounded shadows.'
      : 'Existing overhead fixtures cast grounded shadows in the covered space; no direct sun or studio fill.';
  if (night)
    return inside
      ? 'Dim night sky or an actual fixture enters through car windows; the cabin remains dark, without fill.'
      : location === 4
        ? 'Use dim night sky or an actually visible roadside fixture; keep real darkness and source-aligned shadows.'
        : 'Light comes from the actual nearby street or building fixture; shadows fade naturally, with no studio fill.';
  if (light === 4 || location === 3 || light === 3)
    return inside
      ? 'Low warm sun through real glazing lights the window-facing cheek; opposite cheek and cabin stay shaded.'
      : 'Low warm sun creates long compatible shadows across the visible face and ground; natural reflections only.';
  if (light === 2)
    return inside
      ? 'Midday sun enters through real glazing; roof shades cabin-side cheek, white fabric retains realistic highlights.'
      : 'High sun creates short grounded shadows and natural highlight clipping; no artificial fill.';
  if (light === 5 || light === 6)
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
  const expressionGuard = expression === 1 ? ' No smile or posed grin.'
    : expression === 5 ? ' Do not turn this serious look into a smile.' : '';
  const scene = 'Scene: ' + option(request, 'locations') + ', unnamed everyday Saudi setting. ' +
    'Clothing: ' + option(request, 'clothing') + '. Expression: ' + option(request, 'expressions') + '.' +
    expressionGuard + ' Hair: ' + option(request, 'hairstyles') + ' within existing density. ' +
    'Pose: ' + option(request, 'poses') + '. Angle: ' + option(request, 'selfieAngles') + '.';
  const vehicle = inside
    ? 'Parked pearl-white 2022 Range Rover Sport, black rims; exterior off-frame.'
    : visibleCar
      ? 'Parked pearl-white 2022 Range Rover Sport, black rims, ' + option(request, 'carConditions') + '.'
      : 'Pearl-white 2022 Range Rover Sport with black rims stays parked off-frame.';
  const cabin = inside
    ? 'Saudi LHD: driver front-left, passenger front-right, wheel physically left, console right; no mirrored layout. Visible only: light beige leather seats/dashboard, black leather three-spoke wheel, glossy dark wood, chrome, piano-black trim, panoramic roof; original 2022 Touch Pro Duo dual stacked landscape screens, infotainment above climate controls with rotary dials. Never reveal off-frame details.'
    : '';
  const camera = reflection
    ? 'Camera: Xiaomi 15 Ultra 23 mm-equivalent f/1.63 rear-camera reflection selfie; one reflected phone and grip, screen faces the subject, lens aimed at mirror/glass; real scale and occlusion.'
    : 'Camera: direct Xiaomi 15 Ultra 21 mm-equivalent f/2.0 front-camera selfie at reachable arm length; slight phone distortion and hand tilt; phone is outside its own direct view, no remote photographer or portrait mode.';
  const support = inside
    ? 'Seat compression and hands follow contact and gravity; phone hand and free hand distinct.'
    : 'Real grip, supported pose and gravity-driven folds.';
  const surface = inside
    ? 'Clean or hidden cabin surfaces stay clean.'
    : condition === 1 ? 'Freshly washed surfaces stay clean.'
      : condition === 5 ? 'Visible rain droplets and runoff follow gravity.'
        : visibleCar ? 'Road dirt stays local to plausible contact surfaces.' : '';
  const contextual = desertLocations.includes(location)
    ? ['a distant passing vehicle', 'a patch of irregular dusty shoulder', 'faint roadside tire wear'][Math.abs(request.variation ?? 0) % 3]
    : coveredLocations.includes(location)
      ? ['a partial parked-car edge', 'faint scuffs on visible concrete', 'one distant pedestrian'][Math.abs(request.variation ?? 0) % 3]
      : ['a passing pedestrian at the far edge', 'a partly visible parked car', 'subtle worn road markings'][Math.abs(request.variation ?? 0) % 3];
  const surroundings = !inside && !close ? 'Only at the existing frame edge, if visible: ' + contextual + '.' : '';
  const realism = 'Photographic realism: one shared phone exposure, reference skin pores, natural cloth folds, realistic shadows and restrained highlights. ' +
    support + ' ' + surface + ' ' + surroundings +
    ' No wax or plastic skin, beauty filters, CGI, invented blemishes, extra fingers, impossible reflections or HDR.';
  return [
    PREFIX + '.',
    'Preserve reference facial geometry, natural asymmetry, apparent age, skin tone and texture, eyes, brows, nose, lips, jaw, hairline, thinning, hair density, curl pattern and facial-hair gaps; no reshaping, beautification or invented marks.',
    'Height 193 cm, weight 83 kg, natural lean athletic physique with proportional anatomy.',
    'The reference person is the sole primary subject; never widen the selfie for surroundings.',
    scene, vehicle, cabin, camera, framingProse(inside, close),
    'Lighting: ' + lightingProse(request, inside), realism
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}
