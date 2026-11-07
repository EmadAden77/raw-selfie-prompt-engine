import { resolveSelections } from '../data/option-mappings.js';
import { fallbackGenerator } from './fallback-generator.js';
import { validatePrompt } from './prompt-validator.js';
import { validateEditorialRewrite } from './editor-validator.js';
import type { PromptRequest } from '../types/engine.types.js';

// Use the EXACT shared backend rules on both sides of the API. UI-specific
// substring checks previously rejected legitimate v11 cabin text such as
// "glossy wood" because a stale frontend expected "glossy dark wood".
//
// NVIDIA output may differ only through safely verified editorial changes.
// Rule Builder fallback must match the client canonical result exactly.
export function validateClientPromptResponse(
  request: PromptRequest,
  prompt: unknown,
  source: 'server' | 'local'
): boolean {
  if (typeof prompt !== 'string') return false;
  const choices = resolveSelections(request.selections);
  const canonical = fallbackGenerator(request);
  if (!validatePrompt(prompt, choices)) return false;
  return source === 'server'
    ? validateEditorialRewrite(canonical, prompt)
    : prompt === canonical;
}
