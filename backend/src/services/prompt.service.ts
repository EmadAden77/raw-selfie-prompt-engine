import type { PromptRequest, PromptResponse } from '../types/engine.types.js';
import { resolveSelections } from '../data/option-mappings.js';
import { buildRulePrompt } from '../engine/rule-builder.js';
import { expandCreativeDetails } from '../engine/creative-expander.js';
import { assemblePrompt } from '../engine/prompt-assembler.js';
import { fallbackGenerator } from '../engine/fallback-generator.js';
import { validatePrompt } from '../engine/prompt-validator.js';
import { expandWithNvidia, NvidiaFailure } from './nvidia.service.js';

export function validateCreativeAddition(value:string):boolean{
  const text=value.trim();
  if(text.length<35||text.length>1600||/[؀-ۿ`<>]/.test(text))return false;
  if(/(?:ChatGPT,|\b(?:system|assistant|user)\s*:)/i.test(text))return false;
  if(/(?:burj khalifa|kingdom cent(?:re|er)|al faisaliah|the line|dubai mall|riyadh park|red sea mall|masmak fortress)/i.test(text))return false;
  if(/(?:moving|driving|speeding|racing)\s+(?:car|suv|range rover)|(?:car|suv|range rover)\s+(?:is\s+)?(?:moving|driving|speeding|racing)/i.test(text))return false;
  if(/(?:blue|black|red|green|silver)\s+(?:car|suv|range rover|interior|leather|dashboard|seats)/i.test(text))return false;
  if(/(?:different|new|changed|altered)\s+(?:face|person|identity|hair|skin|outfit|car)/i.test(text))return false;
  if(/(?:studio lighting|cinematic lighting|beauty filter|CGI render|3D render)/i.test(text))return false;
  // NVIDIA is allowed to decorate visible scene texture, never to replace locked
  // measurements, body type, vehicle materials, cabin layout or selfie framing.
  if(/\b\d{2,3}\s*(?:cm|kg|centimeters?|kilograms?)\b/i.test(text))return false;
  if(/\b(?:bodybuilder|bodybuilding|bulky physique|extremely skinny|extremely thin|massive muscles|muscular giant)\b/i.test(text))return false;
  if(/\b(?:beige|cream|tan|white|brown|red|blue)\s+(?:leather\s+)?(?:three.spoke\s+)?steering wheel\b/i.test(text))return false;
  if(/\b(?:steering wheel|dashboard|console|upholstery|seats|door panels)\b.{0,50}\b(?:changed|replaced|reconfigured|rearranged|recolored|redesigned)\b/i.test(text))return false;
  if(/\b(?:different|new|extra)\s+(?:steering wheel|dashboard layout|car model|interior color|camera position|person)\b/i.test(text))return false;
  if(/\b(?:widen(?:ed|ing)?|zoom(?:ed)? out|pulled back|move(?:d)? the camera away|shrink(?:ing)? the (?:person|subject)|full.body shot|wide establishing shot)\b/i.test(text))return false;
  if(/\b(?:show|reveal|display)\s+(?:the\s+)?(?:entire|whole|complete)\s+(?:interior|cabin|dashboard|body|vehicle)\b/i.test(text))return false;
  if(/\b(?:portrait|vertical)\s+(?:infotainment|screen|display)\s+(?:becomes|is replaced by)\s+(?:landscape|horizontal)\b/i.test(text))return false;

  return true;
}
export async function generatePrompt(request:PromptRequest):Promise<PromptResponse>{
  const resolved=resolveSelections(request.selections);
  const base=buildRulePrompt(resolved);
  const expansion=expandCreativeDetails(resolved,request.variation);
  const fallback=fallbackGenerator(request);
  if(!validatePrompt(fallback,resolved))throw new Error('Internal prompt rules failed validation');
  if(!request.nvidiaApiKey)return {prompt:fallback,source:'local',reason:'no_key'};
  try {
    // NVIDIA only supplies a small compatible addition. Immutable rules and options
    // are assembled by our own engine; the model no longer has to echo them exactly.
    const addition=await expandWithNvidia(base,expansion,request.nvidiaApiKey);
    if(!validateCreativeAddition(addition))return {prompt:fallback,source:'local',reason:'unsafe_output'};
    const generated=assemblePrompt(base,addition);
    if(!validatePrompt(generated,resolved))
      return {prompt:fallback,source:'local',reason:'unsafe_output'};
    return {prompt:generated,source:'server'};
  } catch(error) {
    return {prompt:fallback,source:'local',reason:error instanceof NvidiaFailure?error.reason:'nvidia_unavailable'};
  }
}
