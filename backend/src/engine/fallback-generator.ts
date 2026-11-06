import type { PromptRequest } from '../types/engine.types.js';
import { resolveSelections } from '../data/option-mappings.js';
import { buildRulePrompt } from './rule-builder.js';
import { expandCreativeDetails } from './creative-expander.js';
import { assemblePrompt } from './prompt-assembler.js';
import { validatePrompt } from './prompt-validator.js';

// Offline NVIDIA fallback uses the SAME scene-specific lighting and parking
// resolver as the normal Rule Builder; never generic lighting or invented curbs.
export function fallbackGenerator(request:PromptRequest):string{
  const choices=resolveSelections(request.selections);
  const prompt=assemblePrompt(buildRulePrompt(choices),expandCreativeDetails(choices,request.variation));
  if(!validatePrompt(prompt,choices))throw new Error('Fallback fixed scene rules failed validation');
  return prompt;
}
