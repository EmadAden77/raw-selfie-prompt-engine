import type { ResolvedSelections } from '../types/engine.types.js';
import type { ScenePlan } from './scene-planner.js';
import { deriveSceneLighting } from './rule-builder.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';
import { REQUIRED_PREFIX } from '../rules/language.rules.js';

export const LHD_GEOMETRY = 'Saudi-spec left-hand drive: steering wheel on the vehicle left, driver front-left, passenger front-right and center console to the driver’s physical right; phone mirroring must not swap this geometry.';
export const FACTORY_DASHBOARD = 'original 2022 Touch Pro Duo dashboard with two stacked landscape 10-inch touchscreens, upper infotainment and lower climate/vehicle controls with rotary dials';
export const IDENTITY_CORE = 'Keep the uploaded reference person’s exact recognizable face and proportions, skin tone and real texture, hairline, existing hair density, beard and moustache; no beautifying or facial reshaping.';
export const BODY_CORE = 'Fixed target height 195 cm, weight 88 kg, natural lean athletic build with balanced shoulders and limbs; never stretch a partially visible body or force a full-body view.';
export const SUBJECT_CORE = 'The reference person is the sole primary subject. Show only what a natural handheld selfie frame contains; never widen it, move the phone farther away or shrink the person to showcase surroundings.';
const words=(text:string)=>text.trim().split(/\s+/).filter(Boolean).length;
export const promptWordCount=words;

function carVisibility(choices:ResolvedSelections,inside:boolean):boolean {
  // An interior selfie has a physical vehicle even where exterior paint is hidden.
  // External car visibility remains conditional on the camera's chosen framing.
  const angle=Number(choices.selfieAngles.id.split('-').at(-1));
  return inside||angle>=16||[8,12,14].includes(angle);
}
function lightingProse(choices:ResolvedSelections):string {
  const scene=deriveSceneLighting(choices);
  const selection=Number(choices.lighting.id.split('-').at(-1));
  const area=Number(choices.locations.id.split('-').at(-1));
  let line:string;
  if(scene.covered&&selection!==9&&selection!==10){
    line='Existing overhead fixtures illuminate the covered space; faces and cabin surfaces receive weaker reflected light, with grounded contact shadows.';
  }else if(selection===9){
    line='Only the phone screen illuminates the nearby face; light falls off sharply below the chest into genuine darkness.';
  }else if(selection===10){
    line='Only a physically available front-screen flash lights the close subject, with quick falloff and no invented fill.';
  }else if(scene.time==='night'){
    line=area===4?'Use only available dim sky or a real roadside fixture if present; keep the night genuinely dark.':
      'Use the existing local street, station or villa fixture as the main night illumination, with natural falloff and subdued reflections.';
  }else if(scene.time==='sunset'){
    line='Low sunset light makes long natural shadows and restrained warm reflections.';
  }else if(scene.time==='noon'){
    line='High direct daylight creates short grounded shadows, plausible highlights and limited phone dynamic range.';
  }else if(scene.time==='afternoon'){
    line='Low warm afternoon sun creates longer shadows and naturally shaded facial contours.';
  }else if(scene.time==='overcast daylight'){
    line='Cloud cover softens facial contrast and produces diffuse contact shadows.';
  }else{
    line='Use only the existing sun or indirect skylight for this time and setting, with naturally variable contrast.';
  }
  return line+' Reflected light may soften shadows; never invent cinematic, studio or hidden facial lighting.';
}

export function buildConcisePrompt(choices:ResolvedSelections,plan?:ScenePlan):string {
  const inside=cabinMayBeVisible(choices.selfieAngles.id,choices.poses.id);
  const visibleVehicle=carVisibility(choices,inside);
  const angle=Number(choices.selfieAngles.id.split('-').at(-1));
  const close=[2,3,9,10,11].includes(angle);
  const loc=Number(choices.locations.id.split('-').at(-1));
  const surface=deriveSceneLighting(choices);
  const framing=close?'Keep this close selfie limited to face and naturally visible shoulders.':
    'Keep natural subject scale and anatomy within the chosen selfie angle.';
  const identity=[REQUIRED_PREFIX+'.',IDENTITY_CORE,BODY_CORE,SUBJECT_CORE].join(' ');
  const scene=[
    'Scene: '+choices.locations.text+' in an unnamed everyday Saudi setting.',
    'Wear '+choices.clothing.text+'; '+choices.expressions.text+
    '; move only existing hair toward '+choices.hairstyles.text+'.',
    'Pose: '+choices.poses.text+'.',
    'Selfie angle: '+choices.selfieAngles.text+'.'
  ].join(' ');
  const carBase='The parked 2022 pearl-white Range Rover Sport has black rims and a black grille, with '+choices.carConditions.text+'.';
  const parking=loc<=5||[53,55,56].includes(loc)?
    'It stays aligned with the safe desert road edge; do not invent a curb.':
    /parking|bay|garage|station|car wash|pump/i.test(choices.locations.text)?
    'It occupies a physically correct marked or service parking space.':
    'It is safely parallel to an existing curb where a legal curbside space is available.';
  const vehicle=visibleVehicle?carBase+' '+parking:
    'The specified parked 2022 pearl-white Range Rover Sport stays outside the natural frame unless actually visible; never move the camera to show it.';
  const cabin=inside?
    LHD_GEOMETRY+' Visible cabin surfaces retain light beige leather seats and door trim, glossy dark wood, chrome, piano-black accents, and a black leather three-spoke wheel. Preserve the '+FACTORY_DASHBOARD+' only if naturally in shot.':
    'Preserve Saudi left-hand-drive vehicle geometry if any cabin part enters the natural frame.';
  const camera='Camera: raw, personally held front-phone selfie at reachable arm distance; '+framing+
    ' Honor physical support and contact points, natural garment folds and plausible perspective without mirrored vehicle-side errors.';
  const lighting='Lighting: '+lightingProse(choices);
  // Only include small, optional, physically plausible model improvements.
  const texture=plan?
    plan.photographicImperfectionControl.skin+'; '+plan.photographicImperfectionControl.optics+'.':
    'Keep natural skin pores already present in the reference, modest phone processing and believable surface reflections.';
  const environment=close||inside?'Do not force roads, crowds or the dashboard into this view.':
    'If visible, show naturally worn '+surface.surface+' and modest ordinary background activity.';
  const realism='Photographic realism: '+texture+' '+environment+
    ' No waxy skin, beauty filters, CGI, artificial HDR or fabricated defects. Portrait 9:16.';
  const result=[identity,scene,vehicle,cabin,camera,lighting,realism].join(' ').replace(/\s+/g,' ').trim();
  return result;
}
