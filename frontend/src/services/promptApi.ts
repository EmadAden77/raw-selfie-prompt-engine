import { categories } from '../data';
import { backgroundDetails } from '../data/backgrounds';
import type { PromptRequest, PromptResponse } from '../types/prompt';

const PREFIX = 'ChatGPT, using the reference image I uploaded, generate an image of the exact same person';
const LOCKS = [
  'Preserve exactly the reference face geometry, apparent age, skin tone, body proportions and natural asymmetry, with no identity changes, beautification, whitening or retouching.',
  'Retain the exact original hairline, available length, thickness and density; change only physically possible styling directions.',
  'Include the same stationary 2022 Range Rover Sport, pearl-white exterior, sport package, black rims, black grille and LED headlights; beige leather seats, beige dashboard, beige steering wheel, beige door panels and panoramic roof wherever visible.',
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
  return [PREFIX+'.',...LOCKS,'Scene and selected details: '+details.join('; ')+'.','Additional realistic background detail: '+detail+'.','Apply one consistent phone-camera processing treatment to the face, clothing, car and background. Portrait aspect ratio 9:16.'].join(' ');
}

export async function generatePrompt(request:PromptRequest):Promise<PromptResponse> {
  const fallback:PromptResponse={prompt:buildLocalPrompt(request),source:'local'};
  // Default to the same-origin backend route; the Vite dev proxy handles localhost.
  // In production, configure a reverse proxy or an explicit backend origin.
  const base=(import.meta.env.VITE_API_BASE_URL as string|undefined)?.trim()??'';
  const endpoint=base ? base.replace(/\/$/,'')+'/api/prompt' : '/api/prompt';
  try {
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);
    try {
      const response=await fetch(endpoint,{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify(request),signal:controller.signal
      });
      if(!response.ok) return fallback;
      const data:unknown=await response.json();
      if(data&&typeof data==='object'&&'prompt' in data&&typeof data.prompt==='string'&&
        data.prompt.startsWith(PREFIX)&&!/[\u0600-\u06ff]/.test(data.prompt)&&data.prompt.length>400&&
        /2022\s+Range Rover Sport/i.test(data.prompt)&&/pearl.white/i.test(data.prompt)&&
        /beige/i.test(data.prompt)&&/parked|stationary/i.test(data.prompt)&&
        /no wax skin/i.test(data.prompt)&&/plastic skin/i.test(data.prompt))
        return {prompt:data.prompt,source:'server'};
      return fallback;
    } finally {clearTimeout(timeout);}
  } catch {return fallback;}
}
