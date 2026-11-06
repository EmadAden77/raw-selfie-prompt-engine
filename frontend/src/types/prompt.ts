import type { Selections } from './options';
export type PromptRequest = { selections: Selections; variation: number; nvidiaApiKey?: string };
export type PromptResponse = { prompt: string; source: 'local' | 'server' };

