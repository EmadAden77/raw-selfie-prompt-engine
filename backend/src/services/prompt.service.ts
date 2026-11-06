import type { PromptRequest, PromptResponse } from '../types/engine.types.js';
import { resolveSelections } from '../data/option-mappings.js';
import { assembleConcisePrompt } from '../engine/prompt-assembler.js';
import { fallbackGenerator } from '../engine/fallback-generator.js';
import { validatePrompt } from '../engine/prompt-validator.js';
import { planWithNvidia, NvidiaFailure } from './nvidia.service.js';
import { createScenePlan, scenePlanInput } from '../engine/scene-planner.js';
import { reviewScenePlan } from '../engine/consistency-critic.js';
import { evaluateQuality } from '../engine/quality-evaluator.js';
import { auditPhotographicScene } from '../engine/photographic-auditor-v8.js';

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
  if(/\b(?:replace|reconfigure|rearrange|recolor|redesign|change|move)\b.{0,40}\b(?:steering wheel|dashboard|console|upholstery|seats|door panels|interior layout)\b/i.test(text))return false;
  if(/\b(?:different|new|extra)\s+(?:steering wheel|dashboard layout|car model|interior color|camera position|person)\b/i.test(text))return false;
  if(/\b(?:widen(?:ed|ing)?|zoom(?:ed)? out|pulled back|move(?:d)? the camera away|shrink(?:ing)? the (?:person|subject)|full.body shot|wide establishing shot)\b/i.test(text))return false;
  if(/\b(?:show|reveal|display)\s+(?:the\s+)?(?:entire|whole|complete)\s+(?:interior|cabin|dashboard|body|vehicle)\b/i.test(text))return false;
  if(/\b(?:portrait|vertical)\s+(?:infotainment|screen|display)\s+(?:becomes|is replaced by)\s+(?:landscape|horizontal)\b/i.test(text))return false;

  return true;
}
export async function generatePrompt(request:PromptRequest):Promise<PromptResponse>{
  const resolved=resolveSelections(request.selections);
  const {repairNotes,sceneCameraSurface}=auditPhotographicScene(resolved);
  const audit={repairNotes,sceneCameraSurface};
  const baseline=createScenePlan(resolved);
  const fallback=fallbackGenerator(request);
  if(!validatePrompt(fallback,resolved))throw new Error('Internal prompt rules failed validation');
  if(!request.nvidiaApiKey)return {prompt:fallback,source:'local',reason:'no_key',audit};
  try {
    // One structured response. Only validated selections and a textual baseline
    // are sent; the reference image is never sent to NVIDIA.
    const proposal=await planWithNvidia(scenePlanInput(resolved,baseline),request.nvidiaApiKey);
    const reviewed=reviewScenePlan(proposal,baseline);
    if(!reviewed)return {prompt:fallback,source:'local',reason:'unsafe_output',audit};
    const generated=assembleConcisePrompt(resolved,reviewed.plan);
    const quality=evaluateQuality(reviewed.plan,generated,resolved);
    if(quality.some(result=>!result.passed))
      return {prompt:fallback,source:'local',reason:'unsafe_output',audit};
    return {prompt:generated,source:'server',audit};
  }catch(error){
    return {prompt:fallback,source:'local',
      reason:error instanceof NvidiaFailure?error.reason:'nvidia_unavailable',audit};
  }
}
