import { nvidiaConfig } from '../config/nvidia.config.js';
import { nvidiaSystemPrompt } from '../prompts/nvidia-system-prompt.js';
import type { FallbackReason } from '../types/engine.types.js';

interface NvidiaResponse {
  choices?:Array<{message?:{content?:string|null};finish_reason?:string|null}>;
}
export class NvidiaFailure extends Error {
  constructor(public readonly reason:FallbackReason) {
    super('NVIDIA request unavailable');
    this.name='NvidiaFailure';
  }
}
function httpReason(status:number):FallbackReason {
  if(status===401)return 'unauthorized';
  if(status===403)return 'forbidden';
  if(status===402)return 'quota';
  if(status===429)return 'rate_limited';
  if(status===404)return 'model_unavailable';
  if(status===400||status===422)return 'request_rejected';
  return 'nvidia_unavailable';
}
export async function expandWithNvidia(basePrompt:string,creativeExpansion:string,apiKey:string):Promise<string>{
  const {url,model,timeoutMs}=nvidiaConfig();
  if(!apiKey)throw new NvidiaFailure('no_key');
  let response:Response;
  try {
    response=await fetch(url,{
      method:'POST',
      headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json','Accept':'application/json'},
      signal:AbortSignal.timeout(timeoutMs),
      body:JSON.stringify({
        model,temperature:1,top_p:0.95,max_tokens:3072,stream:false,
        messages:[
          {role:'system',content:nvidiaSystemPrompt},
          {role:'user',content:JSON.stringify({
            base_prompt_for_context_only:basePrompt,
            suggested_details:creativeExpansion,
            task:'Write only a short compatible paragraph to append, not the whole prompt.'
          })}
        ]
      })
    });
  } catch(error) {
    if(error instanceof Error&&['TimeoutError','AbortError'].includes(error.name))
      throw new NvidiaFailure('nvidia_timeout');
    throw new NvidiaFailure('nvidia_network');
  }
  // Do not read or expose NVIDIA response bodies on errors; they may contain request details.
  if(!response.ok)throw new NvidiaFailure(httpReason(response.status));
  let data:NvidiaResponse;
  try{ data=await response.json() as NvidiaResponse; }
  catch{ throw new NvidiaFailure('empty_response'); }
  const choice=data.choices?.[0];
  if(choice?.finish_reason==='length')throw new NvidiaFailure('empty_response');
  const content=choice?.message?.content?.trim();
  if(!content)throw new NvidiaFailure('empty_response');
  return content;
}
