import { nvidiaConfig } from '../config/nvidia.config.js';
import { nvidiaSystemPrompt } from '../prompts/nvidia-system-prompt.js';

interface NvidiaResponse { choices?:Array<{message?:{content?:string|null}}> }
export async function expandWithNvidia(basePrompt:string,creativeExpansion:string):Promise<string>{
  const {url,model,timeoutMs,apiKey}=nvidiaConfig();
  if(!apiKey)throw new Error('NVIDIA_API_KEY not configured');
  const response=await fetch(url,{
    method:'POST',
    headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},
    signal:AbortSignal.timeout(timeoutMs),
    body:JSON.stringify({
      model,temperature:0.35,top_p:0.85,max_tokens:2800,stream:false,
      messages:[
        {role:'system',content:nvidiaSystemPrompt},
        {role:'user',content:JSON.stringify({
          immutable_base_prompt:basePrompt,
          append_only_creative_details:creativeExpansion,
          requirement:'Keep immutable_base_prompt verbatim as initial segment, then append compatible creative details. English only.'
        })}
      ]
    })
  });
  if(!response.ok)throw new Error('NVIDIA request failed: HTTP '+response.status);
  const data=await response.json() as NvidiaResponse;
  const content=data.choices?.[0]?.message?.content;
  if(!content||typeof content!=='string')throw new Error('NVIDIA returned empty content');
  return content.trim();
}

