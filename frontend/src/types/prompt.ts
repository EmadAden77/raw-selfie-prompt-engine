import type { Selections } from './options';
export type PromptRequest = { selections: Selections; variation: number };
export type PromptResponse = { prompt: string; source: 'local' | 'server' };

