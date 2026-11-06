export type Option = { id: string; label: string; prompt: string };
export type OptionCategory = 'locations' | 'clothing' | 'expressions' | 'hairstyles' | 'selfieAngles' | 'poses' | 'carConditions' | 'lighting';
export type Selections = Record<OptionCategory, string>;
export type CategoryConfig = { key: OptionCategory; title: string; description: string; options: Option[] };

