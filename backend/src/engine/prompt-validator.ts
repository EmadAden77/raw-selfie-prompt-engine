import { REQUIRED_PREFIX } from '../rules/language.rules.js';
import { BODY_RULE } from '../rules/body.rules.js';
import { COMPOSITION_RULE } from '../rules/composition.rules.js';
import { LIGHTING_POLICY, PARKING_RULE, STREET_RULE, deriveSceneLighting, sceneLightingStatement, sceneParkingStatement } from './rule-builder.js';
import { INTERIOR_RULE, cabinMayBeVisible } from '../rules/cabin.rules.js';
import type { ResolvedSelections } from '../types/engine.types.js';

const forbiddenLandmarks=[
  'burj khalifa','kingdom centre','kingdom center','al faisaliah','the line',
  'dubai mall','mall of the emirates','riyadh park','red sea mall','masmak fortress'
];
const mustHave=[
  /2022\s+Range Rover Sport/i,
  /pearl.white/i,
  /black rims/i,
  /light beige leather/i,
  /black leather three.spoke steering wheel/i,
  /glossy dark wood/i,
  /piano.black/i,
  /chrome/i,
  /parked|stationary/i,
  /selfie/i,
  /front.facing|front.phone|front.camera/i,
  /reference/i,
  /identity/i,
  /no wax|wax skin/i,
  /plastic skin/i,
  /CGI/i
];
const contradictoryBody=[
  /\b(?!195\b)\d{2,3}\s*(?:cm|centimeters?)\b/i,
  /\b(?!88\b)\d{2,3}\s*(?:kg|kilograms?)\b/i,
  /\b(?:bodybuilder|bodybuilding physique|extremely thin physique|massively muscular physique|extreme thinness as the actual physique)\b/i
];
const contradictoryCar=[
  /\b(?:beige|cream|tan|white|brown|red|blue)\s+(?:leather\s+)?(?:three.spoke\s+)?steering wheel\b/i,
  /\bsteering wheel\s+(?:is|in|wrapped in|made of|with)\s+(?:a\s+)?(?:beige|cream|tan|white|brown|red|blue)\b/i,
  /\b(?:red|blue|green|white|gray|grey|black)\s+(?:leather\s+)?(?:front\s+)?seats\b/i,
  /\b(?:red|blue|green|white|gray|grey)\s+(?:leather\s+)?(?:door panels|upholstery|center armrest)\b/i,
  /\b(?:silver|light|matte)\s+wood\s+trim\b/i,
  /\b(?:landscape|horizontal)\s+(?:oriented\s+)?infotainment\s+(?:display|screen)\b/i,
  /\b(?:2021|2023|2024|2025|2026)\s+Range Rover Sport\b/i
];
const forbiddenReframing=[
  /\b(?:widen|zoom out|pull back|move (?:the )?camera away|shrink (?:the )?(?:person|subject))\s+(?:the\s+)?(?:frame|camera|shot|subject|person|to reveal|to show)/i,
  /\b(?:show|display|reveal)\s+(?:the\s+)?(?:entire|full)\s+(?:interior|cabin|dashboard|body|car)\s+(?:regardless|even if|at all costs)/i
];
export function validatePrompt(prompt:string,choices?:ResolvedSelections):boolean {
  if(typeof prompt!=='string'||prompt.length<450||prompt.length>16000) return false;
  if(!prompt.startsWith(REQUIRED_PREFIX)) return false;
  if(/[\u0600-\u06ff]/.test(prompt)||/[`<>]/.test(prompt)) return false;
  if(!prompt.includes(BODY_RULE)||!prompt.includes(COMPOSITION_RULE)) return false;
  if(!prompt.includes(PARKING_RULE)||!prompt.includes(STREET_RULE)||!prompt.includes(LIGHTING_POLICY)) return false;
  if(!prompt.includes('Scene-specific parking and road surface:')||!prompt.includes('Scene-specific lighting:'))return false;
  if(forbiddenLandmarks.some(name=>prompt.toLowerCase().includes(name))) return false;
  if(/(?:subject|range rover|sport|white suv|the suv|the vehicle|the car)\s+(?:is\s+)?(?:driving|moving|speeding|racing)/i.test(prompt))return false;
  if(mustHave.some(pattern=>!pattern.test(prompt)))return false;
  if(contradictoryBody.some(pattern=>pattern.test(prompt)))return false;
  if(contradictoryCar.some(pattern=>pattern.test(prompt)))return false;
  // This is an instruction not to reframe; negative phrases are part of the fixed
  // composition rule. Inspect only additions that occur AFTER that locked rule.
  const addition=prompt.split(COMPOSITION_RULE).slice(1).join(COMPOSITION_RULE);
  if(forbiddenReframing.some(pattern=>pattern.test(addition.replace(/Never\s+\w[^.]*\./gi,'')))) return false;
  // Additional contradictory light and parking claims override neither the
  // policy nor the computed scene plan; reject them rather than merging them.
  const freeText=prompt.split('Lighting selection:').slice(1).join('Lighting selection:');
  if(/\b(?:cinematic|studio|beauty)\s+(?:fill\s+)?lighting\s+(?:illuminates|lights|brightens|falls on)\b/i.test(freeText))return false;
  if(/\b(?:two|multiple|several)\s+(?:opposing\s+)?(?:dominant\s+)?(?:light\s+sources|streetlamps|shadow\s+directions)\b/i.test(freeText))return false;
  if(/\b(?:opposing|conflicting|multi.directional)\s+shadows\s+(?:fall|appear|cross|are cast)\b/i.test(freeText))return false;
  if(/\b(?:parked|parking)\s+(?:diagonally|perpendicular)\s+across\s+(?:the\s+)?(?:road|street|traffic)\b/i.test(freeText))return false;
  if(choices){
    if(!choices.locations||!choices.clothing||!choices.selfieAngles||!choices.poses)return false;
    if(cabinMayBeVisible(choices.selfieAngles.id,choices.poses.id) && !prompt.includes(INTERIOR_RULE))return false;
    if(!prompt.includes(sceneParkingStatement(choices))||!prompt.includes(sceneLightingStatement(choices)))return false;
    // Only the scene's resolved temperature is permitted in free-model additions;
    // the fixed lighting policy contains conditional temperatures for all times.
    const creativeText=prompt.split('Lighting selection:').slice(1).join('Lighting selection:');
    const expected=deriveSceneLighting(choices).kelvin;
    const temperatures=[...creativeText.matchAll(/\b(\d{4})K\b/g)].map(match=>Number(match[1]));
    if(temperatures.some(k=>k!==expected))return false;
  }
  return true;
}
