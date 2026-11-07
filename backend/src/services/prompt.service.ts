import type { PromptRequest, PromptResponse } from '../types/engine.types.js';
import { resolveSelections } from '../data/option-mappings.js';
import { fallbackGenerator } from '../engine/fallback-generator.js';
import { validatePrompt } from '../engine/prompt-validator.js';
import { validateEditorialRewrite } from '../engine/editor-validator.js';
import { editWithNvidia, NvidiaFailure } from './nvidia.service.js';
import { auditPhotographicScene } from '../engine/photographic-auditor-v8.js';

export async function generatePrompt(request: PromptRequest, ownerAuthorized = false): Promise<PromptResponse> {
  const choices = resolveSelections(request.selections);
  const { repairNotes, sceneCameraSurface } = auditPhotographicScene(choices);
  const audit = { repairNotes, sceneCameraSurface };
  // Rule Builder + selected choices are the ONLY source of scene facts.
  // The fallback returns exactly this canonical text, without editorial changes.
  const canonical = fallbackGenerator(request);
  if (!validatePrompt(canonical, choices)) throw new Error('Internal Rule Builder failed validation');

  const nvidiaKey = process.env.NVIDIA_API_KEY?.trim() ?? '';
  if (!nvidiaKey) return { prompt: canonical, source: 'local', reason: 'no_key', audit };
  if (!/^nvapi-[a-zA-Z0-9_-]{10,512}$/.test(nvidiaKey))
    return { prompt: canonical, source: 'local', reason: 'invalid_key', audit };
  if (!ownerAuthorized) return { prompt: canonical, source: 'local', reason: 'owner_only', audit };
  try {
    // NVIDIA receives complete English text, not a planning schema, scene
    // options, camera rules or image. Even plausible added details are rejected.
    const edited = await editWithNvidia(canonical, nvidiaKey);
    if (!validateEditorialRewrite(canonical, edited) || !validatePrompt(edited, choices))
      return { prompt: canonical, source: 'local', reason: 'unsafe_output', audit };
    return { prompt: edited, source: 'server', audit };
  } catch (error) {
    return {
      prompt: canonical,
      source: 'local',
      reason: error instanceof NvidiaFailure ? error.reason : 'nvidia_unavailable',
      audit
    };
  }
}
