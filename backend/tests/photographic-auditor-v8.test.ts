import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import type { Selections } from '../src/types/engine.types.js';
import { auditPhotographicScene } from '../src/engine/photographic-auditor-v8.js';
import { buildConcisePrompt, promptWordCount } from '../src/engine/concise-prompt.js';
import { createScenePlan } from '../src/engine/scene-planner.js';
import { deriveSceneLighting } from '../src/engine/rule-builder.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import { generatePrompt } from '../src/services/prompt.service.js';

const defaults=Object.fromEntries(Object.entries(optionCatalogue)
  .map(([key,values])=>[key,values[0]!.id])) as Selections;
const selected=(values:Partial<Selections>={})=>resolveSelections({...defaults,...values});

test('v8: direct front-camera capture is not a rear-flash or third-party photograph',()=>{
  const choices=selected({selfieAngles:'angle-19',poses:'pose-17'});
  const audit=auditPhotographicScene(choices);
  const prompt=buildConcisePrompt(choices);
  assert.equal(audit.profile,'A');
  assert.match(prompt,/generic smartphone front-camera selfie/);
  assert.doesNotMatch(prompt,/Xiaomi|21 mm-equivalent|aperture f-number/i);
  assert.doesNotMatch(prompt,/rear-camera reflection selfie/i);
  assert.match(prompt,/195 cm/);
  assert.match(prompt,/88 kg/);
  assert.match(prompt,/no reshaping, beautification or invented marks/i);
  assert.equal(validatePrompt(prompt,choices),true);
  assert.ok(promptWordCount(prompt)<=800);
});

test('v8: reflected rear-view mirror and car glass use rear camera optical geometry',()=>{
  for(const angle of ['angle-4','angle-29']){
    const choices=selected({selfieAngles:angle});
    const plan=createScenePlan(choices);
    const audit=auditPhotographicScene(choices);
    const prompt=buildConcisePrompt(choices);
    assert.equal(audit.profile,'B');
    assert.match(plan.cameraGeometry.opticalAxis,/rear lens aimed/i);
    assert.match(prompt,/rear-camera reflection selfie/);
    assert.doesNotMatch(prompt,/Xiaomi|23 mm-equivalent/);
    assert.match(prompt,/screen (?:toward|faces) the subject|screen faces the subject|phone held by the subject/i);
    assert.equal(validatePrompt(prompt,choices),true);
  }
});

test('v12: night source comes from place rather than an independent camera flash',()=>{
  const direct=selected({locations:'location-15',selfieAngles:'angle-1',lighting:'light-7'});
  const reflected=selected({locations:'location-15',selfieAngles:'angle-4',lighting:'light-7'});
  assert.match(deriveSceneLighting(direct).source,/existing wall or neighborhood street fixture/i);
  assert.equal(deriveSceneLighting(direct).source,deriveSceneLighting(reflected).source);
  assert.doesNotMatch(buildConcisePrompt(direct),/Xiaomi|camera brand/i);
});

test('v8: screen-only falloff and physically supported contamination',()=>{
  const night=selected({selfieAngles:'angle-19',lighting:'light-9',poses:'pose-17'});
  assert.match(buildConcisePrompt(night),/weak illumination fades/i);
  const clean=selected({selfieAngles:'angle-19',poses:'pose-17',carConditions:'clean-1'});
  assert.match(auditPhotographicScene(clean).surfaceHistory,/do not add dirt to a clean vehicle/i);
  const wet=selected({selfieAngles:'angle-19',poses:'pose-17',carConditions:'clean-5'});
  assert.match(auditPhotographicScene(wet).surfaceHistory,/runoff follows gravity/i);
  const close=selected({selfieAngles:'angle-9'});
  assert.match(auditPhotographicScene(close).surfaceHistory,/No off-frame dirt decorations/);
  assert.doesNotMatch(auditPhotographicScene(close).surfaceHistory,/lower body panels/);
});

test('v8: report is Arabic metadata; final prompt remains English and reference-blind',async()=>{
  const choices=selected({selfieAngles:'angle-4',lighting:'light-10'});
  const audit=auditPhotographicScene(choices);
  assert.ok(audit.repairNotes.length>=1&&audit.repairNotes.length<=5);
  assert.match(audit.sceneCameraSurface,/ليست نتيجة فحص الصورة/);
  assert.ok(audit.repairNotes.every(x=>/[\u0600-\u06ff]/.test(x)));
  const result=await generatePrompt({selections:{...defaults,selfieAngles:'angle-4',lighting:'light-10'},variation:0});
  assert.equal(result.source,'local');
  assert.ok(result.audit?.repairNotes.length);
  assert.match(result.prompt,/^ChatGPT, using the reference image I uploaded/);
  assert.doesNotMatch(result.prompt,/[\u0600-\u06ff]/);
  assert.ok(promptWordCount(result.prompt)<=800);
});
