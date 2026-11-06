import type { Option } from '../types/options';
import type { OptionCategory } from '../types/options';
import { optionCatalogue } from '../../../backend/src/data/option-mappings.js';

// One canonical catalogue shared by the backend and browser bundle.
export function getOptions(key: OptionCategory): Option[] {
  return optionCatalogue[key].map(({ id, label, text }) => ({ id, label, prompt: text }));
}
