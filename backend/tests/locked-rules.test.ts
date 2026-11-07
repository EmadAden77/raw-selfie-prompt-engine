import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import { buildRulePrompt } from '../src/engine/rule-builder.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import { validateEditorialRewrite } from '../src/engine/editor-validator.js';
import { BODY_RULE } from '../src/rules/body.rules.js';
import { COMPOSITION_RULE } from '../src/rules/composition.rules.js';
import { INTERIOR_RULE } from '../src/rules/cabin.rules.js';
import { LHD_GEOMETRY, FACTORY_DASHBOARD, promptWordCount, IDENTITY_CORE, SUBJECT_CORE } from '../src/engine/concise-prompt.js';
import type { Selections } from '../src/types/engine.types.js';

const selections=Object.fromEntries(Object.entries(optionCatalogue).map(([key, options])=>[key,options[0]!.id])) as Selections;
const chosen=(selfieAngles:string,poses='pose-1'): Selections => ({...selections,selfieAngles,poses});

test('long-form rules remain protected while final prompts preserve identity, physique and concise framing',()=>{
  for(const selfieAngles of ['angle-1','angle-9','angle-16','angle-30']){
    const choices=chosen(selfieAngles);
    const long=buildRulePrompt(resolveSelections(choices));
    assert.ok(long.includes(BODY_RULE)&&long.includes(COMPOSITION_RULE));
    const prompt=fallbackGenerator({selections:choices,variation:7});
    assert.ok(prompt.includes(IDENTITY_CORE));
    assert.ok(prompt.includes(SUBJECT_CORE));
    assert.match(prompt,/195 cm/);
    assert.match(prompt,/88 kg/);
    assert.match(prompt,/lean athletic/);
    assert.doesNotMatch(prompt,/beige steering wheel/i);
    assert.ok(promptWordCount(prompt)<=800);
    assert.equal(validatePrompt(prompt,resolveSelections(choices)),true);
  }
});
test('interior prompt has Saudi LHD and original dual displays, exterior selfie does not display full cabin',()=>{
  const inside=fallbackGenerator({selections:chosen('angle-1'),variation:2});
  const outside=fallbackGenerator({selections:chosen('angle-17', 'pose-17'),variation:2});
  assert.ok(buildRulePrompt(resolveSelections(chosen('angle-1'))).includes(INTERIOR_RULE));
  assert.ok(inside.includes(LHD_GEOMETRY));
  assert.ok(inside.includes(FACTORY_DASHBOARD));
  assert.match(inside,/black leather/);
  assert.match(inside,/piano-black/);
  assert.doesNotMatch(inside,/portrait.oriented infotainment/i);
  assert.ok(!outside.includes(FACTORY_DASHBOARD));
  assert.match(outside,/sole primary subject/);
});
test('validator rejects missing protected terms and contradictory geometry or materials',()=>{
  const base=fallbackGenerator({selections,variation:2});
  const choices=resolveSelections(selections);
  assert.equal(validatePrompt(base,choices),true);
  assert.equal(validatePrompt(base.replace('195 cm','193 cm'),choices),false);
  assert.equal(validatePrompt(base.replace('88 kg','83 kg'),choices),false);
  assert.equal(validatePrompt(base.replace(IDENTITY_CORE,''),choices),false);
  assert.equal(validatePrompt(base.replace(SUBJECT_CORE,''),choices),false);
  assert.equal(validatePrompt(base.replace(LHD_GEOMETRY,''),choices),false);
  assert.equal(validatePrompt(base.replace(FACTORY_DASHBOARD,''),choices),false);
  assert.equal(validatePrompt(base+' The steering wheel is beige.',choices),false);
  assert.equal(validatePrompt(base+' He weighs 100 kg.',choices),false);
  assert.equal(validatePrompt(base+' The seats are red leather seats.',choices),false);
  assert.equal(validatePrompt(base+' An incompatible portrait infotainment screen replaces the original displays.',choices),false);
});

test('NVIDIA cannot append creative details, even plausible ones', () => {
  const base = fallbackGenerator({ selections, variation: 2 });
  const additions = [
    'Soft sunlight falls across leather with slight phone sensor noise.',
    'The person is 190 cm tall with a bulky physique.',
    'The beige leather steering wheel fills the shot.',
    'Widen the frame to reveal the entire car.',
    'Replace the dashboard with a new layout.'
  ];
  for (const text of additions) {
    assert.equal(validateEditorialRewrite(base, base + ' ' + text), false, text);
  }
});
