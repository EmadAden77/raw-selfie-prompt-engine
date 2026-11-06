import type { PromptRequest } from '../types/engine.types.js';
import { resolveSelections } from '../data/option-mappings.js';
import { assembleConcisePrompt } from './prompt-assembler.js';
import { validatePrompt } from './prompt-validator.js';

export function fallbackGenerator(request:PromptRequest):string{
  const choices=resolveSelections(request.selections);
  const prompt=assembleConcisePrompt(choices,undefined,request.variation);
  if(!validatePrompt(prompt,choices))throw new Error('Fallback concise prompt rules failed validation');
  return prompt;
}
