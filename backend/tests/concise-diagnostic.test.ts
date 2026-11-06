import test from 'node:test';
import { optionCatalogue,resolveSelections } from '../src/data/option-mappings.js';
import { buildConcisePrompt,promptWordCount,IDENTITY_CORE,BODY_CORE,SUBJECT_CORE,LHD_GEOMETRY,FACTORY_DASHBOARD } from '../src/engine/concise-prompt.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import { cabinMayBeVisible } from '../src/rules/cabin.rules.js';
import type { Selections } from '../src/types/engine.types.js';
test('diagnose compact prompt acceptance',()=>{
  const first=Object.fromEntries(Object.entries(optionCatalogue).map(([key,v])=>[key,v[0]!.id])) as Selections;
  for(const id of ['angle-1','angle-9','angle-19']){
    const selections={...first,selfieAngles:id};
    const choices=resolveSelections(selections);
    const p=buildConcisePrompt(choices);
    console.log('COMPACT_CHECK',JSON.stringify({id,words:promptWordCount(p),chars:p.length,valid:validatePrompt(p,choices),inside:cabinMayBeVisible(id,first.poses),
      checks:{identity:p.includes(IDENTITY_CORE),body:p.includes(BODY_CORE),subject:p.includes(SUBJECT_CORE),lhd:p.includes(LHD_GEOMETRY),dash:p.includes(FACTORY_DASHBOARD),
      hasScene:p.includes('Scene:'),hasCamera:p.includes('Camera:'),hasLighting:p.includes('Lighting:'),hasRealism:p.includes('Photographic realism:'),car:/2022[\s\S]{0,85}Range Rover Sport/.test(p)},
      excerpt:p.slice(-480)}));
  const categories=Object.keys(optionCatalogue) as Array<keyof typeof optionCatalogue>;
  for(const category of categories){
    for(const entry of optionCatalogue[category]){
      const choices=resolveSelections({...first,[category]:entry.id});
      const p=buildConcisePrompt(choices);
      if(!validatePrompt(p,choices))console.log('INVALID_COMPACT',category,entry.id,promptWordCount(p),p.slice(0,450));
    }
  }
  for(const location of optionCatalogue.locations)for(const lighting of optionCatalogue.lighting){
    const choices=resolveSelections({...first,locations:location.id,lighting:lighting.id});
    const p=buildConcisePrompt(choices);
    if(!validatePrompt(p,choices))console.log('INVALID_PAIR',location.id,lighting.id,promptWordCount(p));
  }
  }
});
