import type { PromptRequest, PromptResponse } from '../types/prompt';
import { cabinMayBeVisible } from '../data/fixedRules';
import { buildLocalPrompt } from './localConcisePrompt';
import { buildLocalAudit } from './localAudit';
import { resolveSelections } from '../../../backend/src/data/option-mappings.js';
import { deriveSceneLighting } from '../../../backend/src/engine/rule-builder.js';
import { physicsStatement } from '../../../backend/src/data/physics/index.js';
export { buildLocalPrompt } from './localConcisePrompt';
const PREFIX = 'ChatGPT, using the reference image I uploaded, generate an image of the exact same person';

const validReasons = new Set([
  'no_key','invalid_key','unauthorized','forbidden','quota','rate_limited',
  'owner_only','model_unavailable','nvidia_timeout','nvidia_network','nvidia_unavailable',
  'request_rejected','empty_response','unsafe_output'
]);

export async function generatePrompt(request:PromptRequest,ownerToken=''):Promise<PromptResponse> {
  const fallback=(reason:PromptResponse['reason']):PromptResponse => ({
    prompt:buildLocalPrompt(request),source:'local',reason,audit:buildLocalAudit(request)
  });
  // Public visitors use local Rule Builder directly, making no paid API calls.
  if (!ownerToken) return fallback('owner_only');
  const base=(import.meta.env.VITE_API_BASE_URL as string|undefined)?.trim()??'';
  const endpoint=base?base.replace(/\/$/,'')+'/api/prompt':'/api/prompt';
  const controller=new AbortController();
  // Always finish a public-page request within a bounded time, even if the server stalls.
  const timer=setTimeout(()=>controller.abort(),45000);
  try {
    const response=await fetch(endpoint,{
      method:'POST',
      headers:{'Content-Type':'application/json','X-Nvidia-Owner-Token':ownerToken},
      body:JSON.stringify(request),
      signal:controller.signal,
      cache:'no-store',
      referrerPolicy:'no-referrer'
    });
    if (!response.ok) return fallback(response.status===400?'invalid_key':'backend_error');
    const data:unknown=await response.json();
    if (!data||typeof data!=='object'||!('prompt' in data)||typeof data.prompt!=='string')
      return fallback('invalid_response');
    // A v10 backend can return valid identity and car facts while omitting all
    // v11 physical option metadata. Never display that stale output as v11.
    const choices = resolveSelections(request.selections);
    const expectedPhysics = physicsStatement(
      choices,deriveSceneLighting(choices),
      cabinMayBeVisible(request.selections.selfieAngles,request.selections.poses)
    );
    if (!data.prompt.includes(expectedPhysics)) return fallback('invalid_response');
    if (!data.prompt.startsWith(PREFIX)||/[\u0600-\u06ff]/.test(data.prompt)||data.prompt.length<400||
        !/sole primary subject|sole primary/i.test(data.prompt)||
        !/195 cm/.test(data.prompt)||!/88 kg/.test(data.prompt)||!/lean athletic/.test(data.prompt)||
        (cabinMayBeVisible(request.selections.selfieAngles,request.selections.poses)&&(!/black leather/i.test(data.prompt)||!/glossy dark wood/i.test(data.prompt)||!/Touch Pro Duo/i.test(data.prompt)||!/left.hand drive|\bLHD\b/i.test(data.prompt)))||
        
        !/2022\s+Range Rover Sport/i.test(data.prompt)||!/pearl.white/i.test(data.prompt)||
        !/parked|stationary/i.test(data.prompt)||
        !/no wax|no beauty filters|no waxy skin/i.test(data.prompt))
      return fallback('invalid_response');
    const source='source' in data && data.source==='server'?'server':'local';
    const reason='reason' in data&&typeof data.reason==='string'&&validReasons.has(data.reason)
      ?data.reason as PromptResponse['reason']:undefined;
    const auditValue='audit' in data?data.audit:undefined;
    const audit=auditValue&&typeof auditValue==='object'&&
      'repairNotes' in auditValue&&Array.isArray(auditValue.repairNotes)&&
      auditValue.repairNotes.length<=5&&auditValue.repairNotes.every((note:unknown)=>typeof note==='string'&&note.length<=500)&&
      'sceneCameraSurface' in auditValue&&typeof auditValue.sceneCameraSurface==='string'&&auditValue.sceneCameraSurface.length<=650
        ?auditValue as NonNullable<PromptResponse['audit']>:buildLocalAudit(request);
    return {prompt:data.prompt,source,reason:source==='local'?(reason??'invalid_response'):undefined,audit};
  } catch(error) {
    return fallback(error instanceof Error&&error.name==='AbortError'?'nvidia_timeout':'backend_unreachable');
  } finally {
    clearTimeout(timer);
  }
}
