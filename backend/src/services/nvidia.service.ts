import { nvidiaConfig } from '../config/nvidia.config.js';
import { nvidiaSystemPrompt } from '../prompts/nvidia-system-prompt.js';
import type { FallbackReason } from '../types/engine.types.js';

interface NvidiaResponse {
  choices?: Array<{ message?: { content?: string | null }; finish_reason?: string | null }>;
}
export class NvidiaFailure extends Error {
  constructor(public readonly reason: FallbackReason) {
    super('NVIDIA editing unavailable');
    this.name = 'NvidiaFailure';
  }
}
function httpReason(status: number): FallbackReason {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 402) return 'quota';
  if (status === 429) return 'rate_limited';
  if (status === 404) return 'model_unavailable';
  if (status === 400 || status === 422) return 'request_rejected';
  return 'nvidia_unavailable';
}

const FAST_NVIDIA_MODEL = 'nvidia/nemotron-3.5-lightning-30b-a3b';

async function requestEdit(
  url: string, model: string, key: string, canonical: string, timeoutMs: number
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify({
        model,
        temperature: 0.25,
        top_p: 0.8,
        max_tokens: 2000,
        stream: false,
        chat_template_kwargs: { enable_thinking: false },
        messages: [
          { role: 'system', content: nvidiaSystemPrompt },
          { role: 'user', content: canonical }
        ]
      })
    });
  } catch (error) {
    if (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name))
      throw new NvidiaFailure('nvidia_timeout');
    throw new NvidiaFailure('nvidia_network');
  }
  if (!response.ok) throw new NvidiaFailure(httpReason(response.status));
  let payload: NvidiaResponse;
  try { payload = await response.json() as NvidiaResponse; }
  catch { throw new NvidiaFailure('empty_response'); }
  const choice = payload.choices?.[0];
  if (choice?.finish_reason === 'length') throw new NvidiaFailure('empty_response');
  const result = choice?.message?.content?.trim();
  if (!result) throw new NvidiaFailure('empty_response');
  return result;
}

// Receives the fully assembled text. NVIDIA never sees a partial scene plan or
// reference image, and the caller verifies each fact against this exact text.
export async function editWithNvidia(canonical: string, key: string): Promise<string> {
  const { url, model, timeoutMs } = nvidiaConfig();
  if (!key) throw new NvidiaFailure('no_key');
  const firstBudget = Math.min(11000, timeoutMs);
  try {
    return await requestEdit(url, model, key, canonical, firstBudget);
  } catch (error) {
    if (!(error instanceof NvidiaFailure)) throw error;
    const retryable: FallbackReason[] = ['nvidia_timeout', 'model_unavailable', 'nvidia_unavailable', 'nvidia_network'];
    if (!retryable.includes(error.reason) || model === FAST_NVIDIA_MODEL || timeoutMs <= firstBudget)
      throw error;
    return requestEdit(url, FAST_NVIDIA_MODEL, key, canonical, Math.min(16000, timeoutMs - firstBudget));
  }
}
