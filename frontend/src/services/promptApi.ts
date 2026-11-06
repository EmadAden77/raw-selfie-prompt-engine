import { categories } from '../data';
import { backgroundDetails } from '../data/backgrounds';
import { FIXED_BODY_RULE, FIXED_BODY_FRAMING, FIXED_COMPOSITION_RULE, FIXED_INTERIOR_RULE, FIXED_INTERIOR_VISIBILITY, cabinMayBeVisible } from '../data/fixedRules';
import type { PromptRequest, PromptResponse } from '../types/prompt';

const PREFIX = 'ChatGPT, using the reference image I uploaded, generate an image of the exact same person';
const LOCKS = [
  'Preserve exactly the reference face geometry, apparent age, skin tone and natural asymmetry, with no identity changes, beautification, whitening or retouching. Adjust only body proportions for the specified 195 cm, 88 kg lean athletic physique, without changing the reference face.',
  FIXED_BODY_RULE,
  FIXED_BODY_FRAMING,
  FIXED_COMPOSITION_RULE,
  'Retain the exact original hairline, available length, thickness and density; change only physically possible styling directions.',
  'The specified vehicle is always a stationary 2022 Range Rover Sport, pearl-white exterior, sport package, black rims, black grille and LED headlights; only show parts naturally within the selfie field of view. The fixed cabin uses light beige leather seats, light beige leather door panels, a beige leather center armrest, glossy dark wood, subtle chrome, piano-black control surfaces, a BLACK leather three-spoke steering wheel, a portrait-oriented infotainment screen and a panoramic glass roof, wherever naturally visible.',
  'The vehicle is parked throughout the scene, never driving.',
  'Use a raw handheld front-phone-camera selfie from the subject\'s reachable arm, except when a selected reflection angle specifically requires a mirror; preserve correct hand position, perspective, gravity, body support and light direction.',
  'Natural pores and skin microtexture, authentic cloth draping, modest phone sensor noise, limited dynamic range, imperfect framing and subtle wide-angle distortion.',
  'No wax skin, plastic skin, porcelain skin, beauty filter, artificial smoothing, CGI, 3D render, studio light or exaggerated HDR.',
  'Use an ordinary unnamed Saudi setting with no famous landmarks, an active believable background, other people or cars at sensible distances and physically consistent shadows and reflections.'
] as const;

// Browser-only fallback mirrors the backend scene table when the API is unreachable.
// The interface and all fixed face/body/cabin options are unchanged.
const BROWSER_PARKING = 'The 2022 Range Rover Sport is completely stationary in a legal, physically plausible parked position: parallel to the curb when a roadside curb exists, aligned with the actual road edge on a safe desert shoulder without inventing a curb, or correctly within a marked parking bay or service area where parallel curb parking is not possible. Wheels, orientation, clearance, contact with the ground and road geometry must agree; never park diagonally across traffic, in a travel lane, or block a pump or entrance.';
const BROWSER_STREET = 'Where the selected selfie field of view naturally shows the roadway, use a worn realistic everyday Saudi street: faded uneven asphalt, modest patched sections, dust at edges, irregular curb wear, subdued paint and believable tire marks, only in amounts appropriate to the location. In desert scenes use a weathered sandy shoulder or rough road edge rather than inventing an urban curb; in covered parking use scuffed concrete and faint bay lines rather than inventing an outdoor street. Do not widen the selfie or fabricate any road surface outside the visible frame.';
const BROWSER_LIGHTING = 'Derive all lighting strictly from the selected scene: its location, time of day, weather, and camera angle. Calculate the single dominant light source position, color temperature, intensity, and shadow direction for that exact scene, and apply it consistently to the face, body, vehicle, interior, and background. At noon, use harsh 5500K sunlight with short sharp shadows. In the afternoon, use warm 4000K light with long shadows. At sunset, use 3200K orange light. At night, use one warm 3000K street lamp as the sole dominant source. At dawn, use soft cool 6500K light. Indoor or covered locations use only their ceiling lights. The face must be lit from the same side and with the same color temperature as the background. All shadows must fall in one direction matching the source. No cinematic lighting, no studio fill, no hidden light, no multi-directional shadows, no beauty light on the face.';
function localSceneLighting(request:PromptRequest):string {
  const loc=Number(request.selections.locations.split('-').at(-1));
  const light=Number(request.selections.lighting.split('-').at(-1));
  const angle=Number(request.selections.selfieAngles.split('-').at(-1));
  const condition=Number(request.selections.carConditions.split('-').at(-1));
  const side=angle%2===0?'camera-right':'camera-left';
  const covered=[8,10,11,12,13,29,46].includes(loc);
  const desert=[1,2,3,4,5,53,55,56].includes(loc);
  const bay=[7,8,10,11,12,13,14,28,29,30,31,32,33,35,36].includes(loc);
  const weather=condition===5?'rain-damp air and wet reflective surfaces':
    condition===6||desert?'light suspended desert dust and dry muted air':
    light===5?'overcast diffuse air':condition===3?'light road dust':'ordinary clear Saudi air';
  const surface=covered?'worn parking concrete, faint lines and tire scuffs':
    desert?'weathered sandy shoulder and cracked or dusty roadside margins':
    bay?'patched access-lane asphalt, dusty edges and faded bay markings':
    'worn patched Saudi asphalt with faded curbstone, dusty gutters and imperfect paint';
  const parking=covered||bay?'properly within a legal marked parking or service bay, never blocking a pump or access lane':
    desert?'safely parallel to the true road edge on a firm shoulder; no invented curb':
    'parked parallel to the curb in a legal roadside space with wheels aligned to the curb';
  let time='morning',k=5000,source='the one available low morning sun from the '+side+' sky',
    shadows='moderate soft-edged shadows away from the low sun';
  if(light===2){time='noon';k=5500;source='one high direct sun toward '+side;shadows='short sharp shadows cast away from the high sun';}
  if(light===3){time='afternoon';k=4000;source='one low warm sun from '+side;shadows='long shadows stretching away from the low sun';}
  if(light===4||loc===3){time='sunset';k=3200;source='one low orange sunset sun from '+side;shadows='long warm-edged shadows extending away from the low horizon sun';}
  if(light===5){time='overcast daylight';k=6500;source='the same diffuse cloudy sky illuminating the frame';shadows='short low-contrast diffuse contact shadows only';}
  if(light===6){time='daylight in shade';k=5500;source='existing indirect skylight, screened by the selected buildings';shadows='subtle diffuse shade and grounded contact shadows without a second source';}
  if(light===7||light===8||loc===4||loc===17){
    time='night';k=3000;
    source=loc===17?'one existing warm villa courtyard or wall fixture toward '+side:
      light===8?'one existing warm station fixture toward '+side:
      desert?'one actually visible roadside light if present, otherwise available dim night sky; never invent a streetlamp':
      'one visible warm street lamp toward '+side;
    shadows='one set of deep night shadows falling away from the actual dominant fixture; no invented fill';
  }
  if(light===9){time='night with screen light';k=6500;source='the actual phone screen at reachable selfie distance only';shadows='rapid downward light falloff below the chest and very deep background shadows';}
  if(light===10){time='night with front-camera screen flash';k=5500;source='the phone front-screen flash only when the device can physically provide it';shadows='brief front-lit soft-edged shadows and rapid falloff; no invented LED or studio light';}
  if(covered&&light!==9&&light!==10){
    const night=time==='night'||time==='sunset';
    k=night?3000:4000;source='one existing ceiling fixture inside the selected covered area, above and '+side;
    shadows='grounded overhead shadows and realistic confined reflections, without direct sun or streetlamp';
    time=night?'covered area at night':'covered area during '+time;
  }
  return 'Scene-specific parking and road surface: '+parking+'; selected ground='+surface+
    '; keep the scene authentic, mildly worn and naturally framed without inventing visible roadway. '+
    'Scene-specific lighting: time='+time+'; source='+source+'; color temperature='+k+'K; weather='+weather+
    '; shadows='+shadows+
    '; exposure='+(covered?'interior light weaker outside the lit ceiling area':'natural exterior-to-cabin falloff and sensor clipping')+
    '; face, clothing, skin, vehicle glass, pearl-white paint, black steering wheel, cabin surfaces and background share the same physically justified source, side, color temperature and reflections. No cinematic fill or opposing shadows.';
}

export function buildLocalPrompt(request:PromptRequest):string {
  const details = categories.map(category=>{
    const value=category.options.find(o=>o.id===request.selections[category.key])??category.options[0];
    return value.prompt;
  });
  const detail=backgroundDetails[Math.abs(request.variation)%backgroundDetails.length];
  const interior=cabinMayBeVisible(request.selections.selfieAngles,request.selections.poses)
    ? [FIXED_INTERIOR_RULE, FIXED_INTERIOR_VISIBILITY] : [];
  return [PREFIX+'.',...LOCKS,BROWSER_PARKING,BROWSER_STREET,BROWSER_LIGHTING,localSceneLighting(request),...interior,'Scene and selected details: '+details.join('; ')+'.','Only if already inside the natural selfie frame, consider background detail: '+detail+'.','Keep the person the sole primary subject; never widen the frame, invent off-screen vehicle or cabin parts, or force a full-body view. Apply one consistent phone-camera processing treatment to the face, clothing, car and background. Portrait aspect ratio 9:16.'].join(' ');
}

const validReasons = new Set([
  'no_key','invalid_key','unauthorized','forbidden','quota','rate_limited',
  'model_unavailable','nvidia_timeout','nvidia_network','nvidia_unavailable',
  'request_rejected','empty_response','unsafe_output'
]);

export async function generatePrompt(request:PromptRequest):Promise<PromptResponse> {
  const fallback=(reason:PromptResponse['reason']):PromptResponse => ({
    prompt:buildLocalPrompt(request),source:'local',reason
  });
  if (!request.nvidiaApiKey) return fallback('no_key');
  if (!/^nvapi-[a-zA-Z0-9_-]{10,512}$/.test(request.nvidiaApiKey)) return fallback('invalid_key');
  const base=(import.meta.env.VITE_API_BASE_URL as string|undefined)?.trim()??'';
  const endpoint=base?base.replace(/\/$/,'')+'/api/prompt':'/api/prompt';
  const controller=new AbortController();
  // Always finish a public-page request within a bounded time, even if the server stalls.
  const timer=setTimeout(()=>controller.abort(),45000);
  try {
    const response=await fetch(endpoint,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(request),
      signal:controller.signal,
      cache:'no-store',
      referrerPolicy:'no-referrer'
    });
    if (!response.ok) return fallback(response.status===400?'invalid_key':'backend_error');
    const data:unknown=await response.json();
    if (!data||typeof data!=='object'||!('prompt' in data)||typeof data.prompt!=='string')
      return fallback('invalid_response');
    if (!data.prompt.startsWith(PREFIX)||/[\u0600-\u06ff]/.test(data.prompt)||data.prompt.length<400||
        !data.prompt.includes(FIXED_BODY_RULE)||!data.prompt.includes(FIXED_COMPOSITION_RULE)||
        !/195 cm/.test(data.prompt)||!/88 kg/.test(data.prompt)||!/lean athletic/.test(data.prompt)||
        !/black leather/i.test(data.prompt)||!/glossy dark wood/i.test(data.prompt)||
        (cabinMayBeVisible(request.selections.selfieAngles,request.selections.poses)&&!data.prompt.includes(FIXED_INTERIOR_RULE))||
        !/2022\s+Range Rover Sport/i.test(data.prompt)||!/pearl.white/i.test(data.prompt)||
        !/beige/i.test(data.prompt)||!/parked|stationary/i.test(data.prompt)||
        !/no wax skin/i.test(data.prompt)||!/plastic skin/i.test(data.prompt))
      return fallback('invalid_response');
    const source='source' in data && data.source==='server'?'server':'local';
    const reason='reason' in data&&typeof data.reason==='string'&&validReasons.has(data.reason)
      ?data.reason as PromptResponse['reason']:undefined;
    return {prompt:data.prompt,source,reason:source==='local'?(reason??'invalid_response'):undefined};
  } catch(error) {
    return fallback(error instanceof Error&&error.name==='AbortError'?'nvidia_timeout':'backend_unreachable');
  } finally {
    clearTimeout(timer);
  }
}
