export const categoryKeys = [
  'locations','clothing','expressions','hairstyles','selfieAngles','poses','carConditions','lighting'
] as const;
export type CategoryKey = typeof categoryKeys[number];
export type Selections = Record<CategoryKey, string>;
export interface PromptRequest { selections: Selections; variation: number }
export interface PromptResponse { prompt: string; source: 'server' | 'local' }
export interface SelectedOption { id: string; label: string; text: string }
export type OptionCatalogue = Record<CategoryKey, SelectedOption[]>;
export type ResolvedSelections = Record<CategoryKey, SelectedOption>;
export interface GeneratedPrompt { prompt: string; source: 'server' | 'local' }

