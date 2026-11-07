import type { PromptRequest, PromptResponse } from '../types/prompt';
import { resolveSelections } from '../../../backend/src/data/option-mappings.js';
import { auditPhotographicScene } from '../../../backend/src/engine/photographic-auditor-v8.js';

// Identical text-only audit in both browser and backend; no reference photo uploaded.
export function buildLocalAudit(request: PromptRequest): NonNullable<PromptResponse['audit']> {
  const { repairNotes, sceneCameraSurface } = auditPhotographicScene(resolveSelections(request.selections));
  return { repairNotes, sceneCameraSurface };
}
