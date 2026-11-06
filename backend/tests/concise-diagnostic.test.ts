import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue,resolveSelections } from '../src/data/option-mappings.js';
import { buildConcisePrompt,promptWordCount,LHD_GEOMETRY,FACTORY_DASHBOARD } from '../src/engine/concise-prompt.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import type { Selections } from '../src/types/engine.types.js';

const first=Object.fromEntries(Object.entries(optionCatalogue).map(([key,v])=>[key,v[0]!.id])) as Selections;

test('standard exterior is concise and complex cabin preserves factory details without overlength',()=>{
  const outside={...first,selfieAngles:'angle-19',poses:'pose-17'};
  const inside={...first,selfieAngles:'angle-1',poses:'pose-1'};
  const standard=buildConcisePrompt(resolveSelections(outside));
  const complex=buildConcisePrompt(resolveSelections(inside));
  assert.ok(promptWordCount(standard)>=120&&promptWordCount(standard)<=225,
    'exterior words: '+promptWordCount(standard));
  assert.ok(promptWordCount(complex)<=300,'interior words: '+promptWordCount(complex));
  assert.ok(!standard.includes(FACTORY_DASHBOARD));
  assert.ok(complex.includes(LHD_GEOMETRY)&&complex.includes(FACTORY_DASHBOARD));
  assert.equal(validatePrompt(standard,resolveSelections(outside)),true);
  assert.equal(validatePrompt(complex,resolveSelections(inside)),true);
});
test('every existing option returns a structurally safe concise fallback',()=>{
  for(const category of Object.keys(optionCatalogue) as Array<keyof typeof optionCatalogue>){
    for(const option of optionCatalogue[category]){
      const selected={...first,[category]:option.id};
      const choices=resolveSelections(selected);
      const output=fallbackGenerator({selections:selected,variation:3});
      assert.equal(validatePrompt(output,choices),true,category+': '+option.id);
      assert.ok(promptWordCount(output)<=340,category+': '+option.id+' '+promptWordCount(output));
      assert.match(output,/193 cm/);
      assert.match(output,/83 kg/);
    }
  }
});
test('all 58 locations and 10 lighting options produce safe concise results',()=>{
  for(const location of optionCatalogue.locations){
    for(const lighting of optionCatalogue.lighting){
      const selections={...first,locations:location.id,lighting:lighting.id};
      const choices=resolveSelections(selections);
      const output=fallbackGenerator({selections,variation:1});
      assert.equal(validatePrompt(output,choices),true,location.id+' / '+lighting.id);
      assert.ok(output.includes('Lighting:'));
      assert.ok(output.includes(location.text));
    }
  }
});
