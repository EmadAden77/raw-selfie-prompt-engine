import type { ResolvedSelections } from '../types/engine.types.js';
import type { ScenePlan } from './scene-planner.js';
import { deriveSceneLighting } from './rule-builder.js';
import { cabinMayBeVisible } from '../rules/cabin.rules.js';
import { REQUIRED_PREFIX } from '../rules/language.rules.js';
import { auditPhotographicScene, isReflectionSelfie } from './photographic-auditor-v8.js';

export const LHD_GEOMETRY = 'Saudi left-hand drive (LHD): wheel left, driver front-left, passenger front-right, center console on the driver’s physical right; selfie mirroring never swaps vehicle sides.';
export const FACTORY_DASHBOARD = 'original 2022 Touch Pro Duo dual stacked landscape screens, upper infotainment and lower climate controls with rotary dials';
export const IDENTITY_CORE = 'Preserve reference facial geometry, natural asymmetry, apparent age, skin tone and texture, eyes, brows, nose, lips, jaw, hairline, thinning, hair density, curl pattern and facial-hair gaps; no reshaping, beautification or invented marks.';
export const BODY_CORE = 'Height 193 cm, weight 83 kg, natural lean athletic physique with proportional anatomy.';
export const SUBJECT_CORE = 'The reference person is the sole primary subject; never widen the selfie for surroundings.';
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
    line=isReflectionSelfie(choices.selfieAngles.id)?'Use the actual rear LED flash along the reflected camera path, with correctly positioned glare and no invented fill.':'Use only the explicitly enabled front-screen flash, with quick falloff and no invented fill.';
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
  return line+' Allow reflected light; no studio fill.';
}

export function buildConcisePrompt(choices:ResolvedSelections,plan?:ScenePlan,variation=0):string {
  const inside=cabinMayBeVisible(choices.selfieAngles.id,choices.poses.id);
  const visibleVehicle=carVisibility(choices,inside);
  const angle=Number(choices.selfieAngles.id.split('-').at(-1));
  const close=[2,3,9,10,11].includes(angle);
  const loc=Number(choices.locations.id.split('-').at(-1));
  const surface=deriveSceneLighting(choices);
  const audit=auditPhotographicScene(choices);
  const framing=close?'Show only the naturally visible face and shoulders.':
    'Keep normal subject scale.';
  const identity=[REQUIRED_PREFIX+'.',IDENTITY_CORE,BODY_CORE,SUBJECT_CORE].join(' ');
  const scene=[
    'Scene: '+choices.locations.text+' in an unnamed Saudi setting.',
    'Wear '+choices.clothing.text+'; expression '+choices.expressions.text+
    '; existing hair '+choices.hairstyles.text+'.',
    'Pose: '+choices.poses.text+'; angle: '+choices.selfieAngles.text+'.'
  ].join(' ');
  const carBase='Parked pearl-white 2022 Range Rover Sport: black rims and grille, '+choices.carConditions.text+';';
  const parking=loc<=5||[53,55,56].includes(loc)?
    'aligned safely with the desert road edge.':
    /parking|bay|garage|station|car wash|pump/i.test(choices.locations.text)?
    'parked inside a real parking or service bay.':
    'parallel to a real curb when present.';
  const vehicle=inside?'The pearl-white 2022 Range Rover Sport stays parked; exterior stays outside this selfie.':
    visibleVehicle?carBase+' '+parking:
    'The pearl-white 2022 Range Rover Sport stays parked, off-frame unless visible.';
  const cabin=inside?
    LHD_GEOMETRY+' If visible: light beige leather seats, beige dashboard panels, panoramic glass roof, glossy dark wood, chrome, piano-black trim and a black leather three-spoke wheel; '+FACTORY_DASHBOARD+' remain factory-correct; show only in-frame parts.':
    'Any visible cabin remains Saudi LHD.';
  const camera=audit.camera+' '+framing+' '+audit.physicalConsistency;
  const lighting='Lighting: '+lightingProse(choices);
  // Only include small, optional, physically plausible model improvements.
  const texture=plan?
    plan.photographicImperfectionControl.skin+'; '+plan.photographicImperfectionControl.optics+'.':
    'Natural skin texture, phone processing and material reflections.';
  const seenBackground=plan?.environmentalRealism.background;
  const safeModelBackground=seenBackground&&!seenBackground.startsWith('only ordinary')?seenBackground:'';
  const understated=[
    'a distant passerby at the frame edge','a few parked vehicles in the far background',
    'a restrained trace of road dust far behind the subject'
  ][Math.abs(variation)%3]!;
  const visibleGround=surface.covered?'worn parking concrete':
    [1,2,3,4,5,53,55,56].includes(loc)?'a dusty sandy road edge':
    'worn patched Saudi asphalt';
  const environment=close||inside?'Keep off-frame scenery hidden.':
    'Only if visible: '+visibleGround+'; '+(safeModelBackground||understated)+'.';
  const realism='Photographic realism: '+texture+' '+environment+' '+audit.surfaceHistory+' '+audit.exposure+
    ' No beauty filters, wax or plastic skin, CGI, invented blemishes, floating geometry, extra digits, impossible reflections or exaggerated HDR. 9:16.';
  const result=[identity,scene,vehicle,cabin,camera,lighting,realism].join(' ').replace(/\s+/g,' ').trim();
  return result;
}
