import type { Selections } from './options';
export type PromptRequest = { selections: Selections; variation: number; nvidiaApiKey?: string };
export type FallbackReason =
  | 'no_key' | 'invalid_key' | 'unauthorized' | 'forbidden' | 'quota'
  | 'rate_limited' | 'model_unavailable' | 'nvidia_timeout'
  | 'nvidia_network' | 'nvidia_unavailable' | 'request_rejected'
  | 'empty_response' | 'unsafe_output'
  | 'backend_unreachable' | 'backend_error' | 'invalid_response';
export type PromptResponse = {
  prompt: string;
  source: 'local' | 'server';
  reason?: FallbackReason;
};
