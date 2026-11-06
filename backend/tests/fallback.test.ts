import test from 'node:test';
import assert from 'node:assert/strict';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import { optionCatalogue } from '../src/data/option-mappings.js';
import { generatePrompt } from '../src/services/prompt.service.js';
import type { Selections } from '../src/types/engine.types.js';
const selections=Object.fromEntries(Object.entries(optionCatalogue).map(([key,options])=>[key,options[0]!.id])) as Selections;
test('different variations preserve rules while changing background details',()=>{
  const first=fallbackGenerator({selections,variation:1});
  const second=fallbackGenerator({selections,variation:2});
  assert.notEqual(first,second);
  for(const output of [first,second])assert.match(output,/2022 Range Rover Sport/);
});
test('backend produces local fallback when no NVIDIA key is configured',async()=>{
  if(process.env.NVIDIA_API_KEY)return;
  const result=await generatePrompt({selections,variation:1});
  assert.equal(result.source,'local');
  assert.match(result.prompt,/ChatGPT, using the reference image/);
});

