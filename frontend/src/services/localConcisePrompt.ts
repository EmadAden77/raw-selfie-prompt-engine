import { categories } from '../data';
import type { PromptRequest } from '../types/prompt';
import { cabinMayBeVisible } from '../data/fixedRules';

const PREFIX='ChatGPT, using the reference image I uploaded, generate an image of the exact same person';
function option(request:PromptRequest,key:string):string {
  const category=categories.find(x=>x.key===key);
  if(!category)return '';
  const selected=category.options.find(x=>x.id===request.selections[category.key]);
  return (selected??category.options[0])!.prompt;
}
export function buildLocalPrompt(request:PromptRequest):string {
  const inside=cabinMayBeVisible(request.selections.selfieAngles,request.selections.poses);
  const angle=Number(request.selections.selfieAngles.split('-').at(-1));
  const light=Number(request.selections.lighting.split('-').at(-1));
  const location=Number(request.selections.locations.split('-').at(-1));
  const close=[2,3,9,10,11].includes(angle);
  const covered=[8,10,11,12,13,29,46].includes(location);
  const desert=[1,2,3,4,5,53,55,56].includes(location);
  const bay=[7,8,10,11,12,13,14,28,29,30,31,32,33,35,36].includes(location);
  const time=location===17||location===4?'night':location===3?'sunset':'';
  const lighting=light===9?'Only the phone screen lights the nearby face, falling off into deep darkness.':
    light===10?'Only a physically plausible front-screen flash provides close light, fading quickly.':
    covered?'Existing overhead fixtures and subdued reflections illuminate the covered space.':
    light===2?'Strong overhead daylight casts short grounded shadows.':
    light===3?'Low afternoon sun creates longer natural shadows.':
    light===4||time==='sunset'?'Warm low sunset light creates long natural shadows.':
    light===5?'Overcast skies give diffuse light and softened contact shadows.':
    light===7||light===8||time==='night'?'Only the actual nearby street, station or villa fixture and natural ambient reflections illuminate the night.':
    'Available daylight creates natural contrast and believable shadow transitions.';
  const carVisible=inside||angle>=16||[8,12,14].includes(angle);
  const parking=desert?'aligned safely with the desert road edge.':
    bay?'within an actual parking or service bay.':'parallel to an existing curb where possible.';
  const car=carVisible?
    'A parked pearl-white 2022 Range Rover Sport with black rims, '+option(request,'carConditions')+', '+parking:
    'The pearl-white 2022 Range Rover Sport remains parked outside the selfie frame unless naturally visible.';
  const cabin=inside?
    'Saudi left-hand drive (LHD): wheel physically left, driver front-left, passenger front-right, center console to the driver’s right; selfie mirroring never swaps vehicle sides. Visible cabin has beige leather, dark glossy wood, chrome, piano-black trim, black leather steering wheel and factory 2022 Touch Pro Duo dual landscape screens, upper infotainment and lower climate controls; never force them into view.':
    'Retain Saudi LHD vehicle geometry if any interior becomes visible.';
  const scene='Scene: '+option(request,'locations')+' in everyday unnamed Saudi surroundings. Clothing: '+
    option(request,'clothing')+'; expression: '+option(request,'expressions')+
    '; hairstyle within the reference hair: '+option(request,'hairstyles')+
    '. Pose: '+option(request,'poses')+'; selfie angle: '+option(request,'selfieAngles')+'.';
  const camera='Camera: realistic handheld front-phone selfie at reachable arm length. '+
    (close?'Only naturally visible face and shoulders.':'Preserve natural subject scale and pose support.')+
    ' Natural fabric folds and phone perspective.';
  const road=close||inside?'No forced street or background view.':
    (desert?'Weathered sandy roadside if visible.':covered?'Scuffed parking concrete if visible.':'Worn Saudi asphalt only where visible.');
  return [
    PREFIX+'.',
    'Preserve the reference face, facial proportions, natural skin tone and texture, hairline, hair density, beard and moustache; no retouching or identity changes.',
    'Fixed height 193 cm, weight 83 kg, natural lean athletic physique and proportional limbs; do not force a full-body view.',
    'The person is the sole primary subject; do not widen the frame or shrink the subject to show other objects.',
    scene,car,cabin,camera,'Lighting: '+lighting+' Natural reflections may soften shadows; no studio fill.',
    'Photographic realism: authentic reference skin, credible material reflections and normal phone processing. '+road+
    ' No wax skin, beauty filters, CGI or exaggerated HDR. 9:16.'
  ].join(' ').replace(/\s+/g,' ').trim();
}
