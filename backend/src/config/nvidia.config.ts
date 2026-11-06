import { env } from './env.js';
export function nvidiaConfig(){
  const url=new URL(env.nvidiaBaseUrl);
  if(url.protocol!=='https:')throw new Error('NVIDIA endpoint requires HTTPS');
  return {url:url.toString(),model:env.nvidiaModel,timeoutMs:env.nvidiaTimeoutMs};
}

