import { optionCatalogue } from '../option-mappings.js';
import type { CategoryKey, SelectedOption } from '../../types/engine.types.js';

export interface PhysicsOption<T> extends SelectedOption {
  readonly physics: Readonly<T>;
  readonly english: string;
}

// The index of each frozen model spec corresponds exactly to the canonical
// selectable ID. Throw on catalog mismatch instead of silently shifting physics
// to a different Arabic option. No generated image or model may edit these data.
function deepFreeze<T>(value:T):Readonly<T> {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

export function fixedPhysicsOptions<T>(
  category: CategoryKey,
  specifications: readonly T[],
  describe: (value: Readonly<T>) => string
): ReadonlyArray<PhysicsOption<T>> {
  const canonical = optionCatalogue[category];
  if (canonical.length !== specifications.length)
    throw new Error('Physics catalogue length mismatch: ' + category);
  return Object.freeze(canonical.map((option, index) => {
    const physics = deepFreeze(specifications[index]!);
    const english = describe(physics);
    if (!english.trim()) throw new Error('Empty physics text for ' + option.id);
    return Object.freeze({ ...option, physics, english });
  }));
}

export function fixedOption<T>(list: ReadonlyArray<PhysicsOption<T>>, id: string): PhysicsOption<T> {
  const value = list.find(item => item.id === id);
  if (!value) throw new Error('Missing physical specification for ' + id);
  return value;
}
