import 'dotenv/config';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
// Load backend/.env regardless of the repository root or workspace working directory.
const backendRoot=resolve(fileURLToPath(new URL('../..',import.meta.url)));
loadEnv({path:resolve(backendRoot,'.env'),override:false});

function boundedNumber(input:string|undefined,fallback:number,min:number,max:number):number {
  const parsed=Number(input);
  return Number.isFinite(parsed)&&parsed>=min&&parsed<=max?Math.floor(parsed):fallback;
}
export const env={
  nodeEnv:process.env.NODE_ENV==='production'?'production':'development',
  port:boundedNumber(process.env.PORT,3001,1,65535),
  nvidiaBaseUrl:process.env.NVIDIA_BASE_URL?.trim()||'https://integrate.api.nvidia.com/v1/chat/completions',
  nvidiaModel:process.env.NVIDIA_MODEL?.trim()||'deepseek-ai/deepseek-v4.1-flash',
  nvidiaTimeoutMs:boundedNumber(process.env.NVIDIA_TIMEOUT_MS,30000,1000,60000),
  corsOrigins:(process.env.CORS_ORIGINS||'http://localhost:5173,http://127.0.0.1:5173').split(',').map(s=>s.trim()).filter(Boolean),
  rateLimitWindowMs:boundedNumber(process.env.RATE_LIMIT_WINDOW_MS,60000,1000,3600000),
  rateLimitMax:boundedNumber(process.env.RATE_LIMIT_MAX,30,1,1000)
} as const;
