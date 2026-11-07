export const categoryKeys = [
  'locations','clothing','expressions','hairstyles','selfieAngles','poses','carConditions','lighting'
] as const;
export type CategoryKey = typeof categoryKeys[number];
export type Selections = Record<CategoryKey, string>;
export interface PromptRequest { selections: Selections; variation: number }
export type FallbackReason =
  | 'no_key' | 'invalid_key' | 'unauthorized' | 'forbidden' | 'quota'
  | 'rate_limited' | 'model_unavailable' | 'nvidia_timeout'
  | 'nvidia_network' | 'nvidia_unavailable' | 'request_rejected'
  | 'empty_response' | 'unsafe_output' | 'owner_only';
export interface PromptAuditReport { repairNotes: string[]; sceneCameraSurface: string }
export interface PromptResponse { prompt: string; source: 'server' | 'local'; reason?:FallbackReason; audit?:PromptAuditReport }
export interface SelectedOption { id: string; label: string; text: string }
export type OptionCatalogue = Record<CategoryKey, SelectedOption[]>;
export type ResolvedSelections = Record<CategoryKey, SelectedOption>;
export interface GeneratedPrompt { prompt: string; source: 'server' | 'local' }
