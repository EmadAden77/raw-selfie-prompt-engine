import type { PromptRequest, PromptResponse } from '../types/engine.types.js';
import { resolveSelections } from '../data/option-mappings.js';
import { buildRulePrompt } from '../engine/rule-builder.js';
import { expandCreativeDetails } from '../engine/creative-expander.js';
import { fallbackGenerator } from '../engine/fallback-generator.js';
import { validatePrompt } from '../engine/prompt-validator.js';
import { expandWithNvidia } from './nvidia.service.js';
import { env } from '../config/env.js';

export async function generatePrompt(request:PromptRequest):Promise<PromptResponse>{
  const resolved=resolveSelections(request.selections);
  const base=buildRulePrompt(resolved);
  const expansion=expandCreativeDetails(resolved,request.variation);
  const fallback=fallbackGenerator(request);
  // The deterministic fallback must remain available even with an invalid/absent API key.
  if(!validatePrompt(fallback,resolved))throw new Error('Internal prompt rules failed validation');
  if(!env.nvidiaApiKey)return {prompt:fallback,source:'local'};
  try{
    const generated=await expandWithNvidia(base,expansion);
    // The model may append, but cannot alter any immutable rule or chosen option.
    if(!generated.startsWith(base))return {prompt:fallback,source:'local'};
    if(!validatePrompt(generated,resolved))return {prompt:fallback,source:'local'};
    if(generated.length>base.length+3500)return {prompt:fallback,source:'local'};
    return {prompt:generated,source:'server'};
  }catch{
    // No credentials, request timeout, invalid response or unavailable API:
    // preserve the user's ability to produce a complete English prompt.
    return {prompt:fallback,source:'local'};
  }
}

