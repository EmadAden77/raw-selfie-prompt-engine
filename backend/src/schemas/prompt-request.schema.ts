import { z } from 'zod';
import { optionCatalogue } from '../data/option-mappings.js';
import { categoryKeys, type PromptRequest } from '../types/engine.types.js';

const shape=Object.fromEntries(categoryKeys.map(key=>[
  key,z.string().refine(value=>optionCatalogue[key].some(entry=>entry.id===value),
    {message:'Unknown selection'})
])) as Record<(typeof categoryKeys)[number],z.ZodType<string>>;

export const promptRequestSchema=z.object({
  selections:z.object(shape).strict(),
  variation:z.number().int().min(0).max(1000000)
}).strict();

export function parsePromptRequest(value:unknown):PromptRequest{
  return promptRequestSchema.parse(value) as PromptRequest;
}

