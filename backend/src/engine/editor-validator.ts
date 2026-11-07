import { REQUIRED_PREFIX } from '../rules/language.rules.js';
import { promptWordCount, MAX_PROMPT_WORDS } from './concise-prompt.js';

// NLP similarity cannot establish factual equivalence. Fail closed:
// every source sentence keeps its ordered content-bearing tokens.
// Only articles, punctuation, whitespace, capitalization and sentence order
// may change. No NVIDIA-proposed physical or photographic facts can enter.
function sentences(text: string): string[] {
  return text.trim().split(/(?<=[.!?])\s+(?=[A-Z])/).map(x => x.trim()).filter(Boolean);
}
function signature(sentence: string): string {
  const words = sentence.toLowerCase()
    .replace(/\b(?:a|an|the)\b/g, ' ')
    .match(/[a-z]+|\d+(?:[.:/-]\d+)*/g) ?? [];
  return words.join(' ');
}
export function protectedFactSignatures(prompt: string): string[] {
  return sentences(prompt).map(signature).sort();
}
export function validateEditorialRewrite(canonical: string, edited: unknown): edited is string {
  if (typeof edited !== 'string' || edited.length > 13000 || edited.length < 450) return false;
  if (!edited.startsWith(REQUIRED_PREFIX) || /[\u0600-\u06ff<>{}\x00-\x08\u0060]/.test(edited)) return false;
  if (promptWordCount(edited) > MAX_PROMPT_WORDS) return false;
  const before = protectedFactSignatures(canonical);
  const after = protectedFactSignatures(edited);
  if (before.length !== after.length) return false;
  if (!before.every((item, i) => item === after[i])) return false;
  // Identity, body, vehicle, scene, clothing and lighting have a fixed order.
  const groups = [
    'Preserve reference facial geometry', 'Height 195 cm', 'Range Rover Sport',
    'Scene:', 'Clothing:', 'Lighting:'
  ];
  const offsets = groups.map(x => edited.indexOf(x));
  return offsets.every((x, i) => x >= 0 && (i === 0 || x > offsets[i - 1]!));
}
