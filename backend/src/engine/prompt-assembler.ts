export function assemblePrompt(base:string,expansion:string):string {
  return [base.trim(),expansion.trim(),'Vertical portrait composition, 9:16 aspect ratio.'].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
}


import type { ResolvedSelections } from '../types/engine.types.js';
import type { ScenePlan } from './scene-planner.js';
import { buildConcisePrompt } from './concise-prompt.js';

// Current final prompt assembler. Legacy assemblePrompt remains available
// to existing internal tests, but protected production output is concise.
export function assembleConcisePrompt(selections:ResolvedSelections,plan?:ScenePlan,variation=0):string {
  return buildConcisePrompt(selections,plan,variation);
}
