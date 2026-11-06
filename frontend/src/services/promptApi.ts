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

export function buildLocalPrompt(request:PromptRequest):string {
  const details = categories.map(category=>{
    const value=category.options.find(o=>o.id===request.selections[category.key])??category.options[0];
    return value.prompt;
  });
  const detail=backgroundDetails[Math.abs(request.variation)%backgroundDetails.length];
  const interior=cabinMayBeVisible(request.selections.selfieAngles,request.selections.poses)
    ? [FIXED_INTERIOR_RULE, FIXED_INTERIOR_VISIBILITY] : [];
  return [PREFIX+'.',...LOCKS,...interior,'Scene and selected details: '+details.join('; ')+'.','Only if already inside the natural selfie frame, consider background detail: '+detail+'.','Keep the person the sole primary subject; never widen the frame, invent off-screen vehicle or cabin parts, or force a full-body view. Apply one consistent phone-camera processing treatment to the face, clothing, car and background. Portrait aspect ratio 9:16.'].join(' ');
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
