import type { ResolvedSelections } from '../types/engine.types.js';
import type { ScenePlan } from './scene-planner.js';
import { deriveSceneLighting } from './rule-builder.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';
import { REQUIRED_PREFIX } from '../rules/language.rules.js';

export const LHD_GEOMETRY = 'Saudi left-hand drive (LHD): wheel left, driver front-left, passenger front-right, center console on the driver’s physical right; selfie mirroring never swaps vehicle sides.';
export const FACTORY_DASHBOARD = 'original 2022 Touch Pro Duo dual stacked landscape screens, upper infotainment and lower climate controls with rotary dials';
export const IDENTITY_CORE = 'Preserve the reference face, proportions, skin tone and texture, natural hairline and density, beard and moustache; no retouching or identity changes.';
export const BODY_CORE = 'Height 195 cm, weight 88 kg; natural lean athletic physique with proportional limbs and no forced full-body view.';
export const SUBJECT_CORE = 'The person alone is primary; never widen the selfie or shrink the subject to show surroundings.';
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
  return line+' Reflected light may soften shadows; no studio or hidden fill.';
}

export function buildConcisePrompt(choices:ResolvedSelections,plan?:ScenePlan):string {
  const inside=cabinMayBeVisible(choices.selfieAngles.id,choices.poses.id);
  const visibleVehicle=carVisibility(choices,inside);
  const angle=Number(choices.selfieAngles.id.split('-').at(-1));
  const close=[2,3,9,10,11].includes(angle);
  const loc=Number(choices.locations.id.split('-').at(-1));
  const surface=deriveSceneLighting(choices);
  const framing=close?'Show only the naturally visible face and shoulders.':
    'Preserve human scale within the chosen angle.';
  const identity=[REQUIRED_PREFIX+'.',IDENTITY_CORE,BODY_CORE,SUBJECT_CORE].join(' ');
  const scene=[
    'Scene: '+choices.locations.text+' in an unnamed everyday Saudi setting.',
    'Clothing: '+choices.clothing.text+'; expression: '+choices.expressions.text+
    '; existing hair styled '+choices.hairstyles.text+'.',
    'Pose: '+choices.poses.text+'; angle: '+choices.selfieAngles.text+'.'
  ].join(' ');
  const carBase='A parked pearl-white 2022 Range Rover Sport with black rims and grille, '+choices.carConditions.text+'.';
  const parking=loc<=5||[53,55,56].includes(loc)?
    'aligned safely with the desert road edge.':
    /parking|bay|garage|station|car wash|pump/i.test(choices.locations.text)?
    'parked inside a real parking or service bay.':
    'parallel to a real curb when present.';
  const vehicle=visibleVehicle?carBase+' '+parking:
    'The pearl-white 2022 Range Rover Sport stays parked, off-frame unless naturally visible.';
  const cabin=inside?
    LHD_GEOMETRY+' If visible: light beige leather, glossy dark wood, chrome, piano-black trim and a black leather three-spoke wheel; '+FACTORY_DASHBOARD+' remain factory-correct; show only in-frame parts.':
    'Maintain Saudi LHD geometry if the cabin enters the frame.';
  const camera='Camera: raw handheld front-phone selfie at arm length; '+framing+
    ' Realistic body support, fabric gravity and perspective.';
  const lighting='Lighting: '+lightingProse(choices);
  // Only include small, optional, physically plausible model improvements.
  const texture=plan?
    plan.photographicImperfectionControl.skin+'; '+plan.photographicImperfectionControl.optics+'.':
    'Natural skin texture, phone processing and material reflections.';
  const environment=close||inside?'Do not force roads or crowds into view.':
    'Only if in frame: '+surface.surface+' and ordinary background activity.';
  const realism='Photographic realism: '+texture+' '+environment+
    ' No waxy skin, beauty filters, CGI, false defects or exaggerated HDR. 9:16.';
  const result=[identity,scene,vehicle,cabin,camera,lighting,realism].join(' ').replace(/\s+/g,' ').trim();
  return result;
}
