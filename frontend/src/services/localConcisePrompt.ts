import type { PromptRequest } from '../types/prompt';
import { resolveSelections } from '../../../backend/src/data/option-mappings.js';
import { buildConcisePrompt } from '../../../backend/src/engine/concise-prompt.js';

// Vite bundles the same pure rule engine as the backend. Runtime remains offline
// and no image data, NVIDIA credential, or backend HTTP call is needed here.
export function buildLocalPrompt(request: PromptRequest): string {
  const resolved = resolveSelections(request.selections);
  return buildConcisePrompt(resolved, undefined, request.variation);
}
