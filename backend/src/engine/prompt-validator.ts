import { REQUIRED_PREFIX } from '../rules/language.rules.js';
import type { ResolvedSelections } from '../types/engine.types.js';

const forbiddenLandmarks=[
  'burj khalifa','kingdom centre','kingdom center','al faisaliah','the line',
  'dubai mall','mall of the emirates','riyadh park','red sea mall','masmak fortress'
];
const mustHave=[
  /2022\s+Range Rover Sport/i,
  /pearl.white/i,
  /black rims/i,
  /beige (?:leather|seats|dashboard|steering wheel)/i,
  /parked|stationary/i,
  /selfie/i,
  /front.facing|front.phone|front.camera/i,
  /reference/i,
  /identity/i,
  /no wax|wax skin/i,
  /plastic skin/i,
  /CGI/i
];

export function validatePrompt(prompt:string,choices?:ResolvedSelections):boolean {
  if(typeof prompt!=='string'||prompt.length<450||prompt.length>16000) return false;
  if(!prompt.startsWith(REQUIRED_PREFIX)) return false;
  if(/[\u0600-\u06ff]/.test(prompt)||/[`<>]/.test(prompt)) return false;
  if(forbiddenLandmarks.some(name=>prompt.toLowerCase().includes(name))) return false;
  if(/(?:subject|range rover|sport|white suv|the suv|the vehicle|the car)\s+(?:is\s+)?(?:driving|moving|speeding|racing)/i.test(prompt))return false;
  if(mustHave.some(pattern=>!pattern.test(prompt)))return false;
  if(choices){
    // The expanded output must describe each selected action; selected text itself
    // is embedded in the deterministic base, which is also checked by the service.
    if(!choices.locations||!choices.clothing||!choices.selfieAngles||!choices.poses)return false;
  }
  return true;
}

