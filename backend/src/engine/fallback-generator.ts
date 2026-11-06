import type { PromptRequest } from '../types/engine.types.js';
import { resolveSelections } from '../data/option-mappings.js';
import { buildRulePrompt } from './rule-builder.js';
import { expandCreativeDetails } from './creative-expander.js';
import { assemblePrompt } from './prompt-assembler.js';

export function fallbackGenerator(request:PromptRequest):string{
  const choices=resolveSelections(request.selections);
  return assemblePrompt(buildRulePrompt(choices),expandCreativeDetails(choices,request.variation));
}

