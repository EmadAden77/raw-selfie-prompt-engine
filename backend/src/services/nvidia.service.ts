import { nvidiaConfig } from '../config/nvidia.config.js';
import { nvidiaSystemPrompt } from '../prompts/nvidia-system-prompt.js';
import type { FallbackReason } from '../types/engine.types.js';

interface NvidiaResponse {
  choices?: Array<{message?: {content?: string | null}; finish_reason?: string | null}>;
}
export class NvidiaFailure extends Error {
  constructor(public readonly reason: FallbackReason) {
    super('NVIDIA request unavailable');
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

async function requestExpansion(
  url: string, model: string, apiKey: string,
  details: string, timeoutMs: number
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify({
        model,
        temperature: 1,
        top_p: 0.95,
        max_tokens: 256,
        stream: false,
        // Supported on NVIDIA Nemotron; DeepSeek may ignore this optional field.
        chat_template_kwargs: {enable_thinking: false},
        messages: [
          {role: 'system', content: nvidiaSystemPrompt},
          {role: 'user', content: details}
        ]
      })
    });
  } catch (error) {
    if (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name)) {
      throw new NvidiaFailure('nvidia_timeout');
    }
    throw new NvidiaFailure('nvidia_network');
  }
  // Never include provider errors or credentials in logs or client-facing text.
  if (!response.ok) throw new NvidiaFailure(httpReason(response.status));
  let data: NvidiaResponse;
  try { data = await response.json() as NvidiaResponse; }
  catch { throw new NvidiaFailure('empty_response'); }
  if (data.choices?.[0]?.finish_reason === 'length') throw new NvidiaFailure('empty_response');
  const output = data.choices?.[0]?.message?.content?.trim();
  if (!output) throw new NvidiaFailure('empty_response');
  return output;
}

export async function expandWithNvidia(
  _basePrompt: string, creativeExpansion: string, apiKey: string
): Promise<string> {
  const {url, model, timeoutMs} = nvidiaConfig();
  if (!apiKey) throw new NvidiaFailure('no_key');
  // The server already owns all immutable identity/car constraints. Sending the
  // full assembled prompt to NVIDIA increases latency for no benefit.
  const detail = 'Add one original 35-70 word paragraph in English, limited to physically plausible distant background, natural light and smartphone camera texture. Existing scene detail: ' +
    creativeExpansion.slice(0, 700) +
    '. Preserve every fixed detail; never add a new person identity, car, outfit or light source.';
  const primaryBudget = Math.min(9000, timeoutMs);
  try {
    return await requestExpansion(url, model, apiKey, detail, primaryBudget);
  } catch (error) {
    if (!(error instanceof NvidiaFailure)) throw error;
    // Do not retry invalid/revoked keys or credit/rate-limit errors.
    const retryable: FallbackReason[] = [
      'nvidia_timeout', 'model_unavailable', 'nvidia_unavailable',
      'nvidia_network', 'empty_response', 'request_rejected'
    ];
    if (!retryable.includes(error.reason) || model === FAST_NVIDIA_MODEL ||
        timeoutMs <= primaryBudget) throw error;
    // Fast NVIDIA fallback, not the local rule engine, within the same request.
    return await requestExpansion(
      url, FAST_NVIDIA_MODEL, apiKey, detail,
      Math.min(19000, timeoutMs - primaryBudget)
    );
  }
}
