import test from 'node:test';
import assert from 'node:assert/strict';
import { optionCatalogue, resolveSelections } from '../src/data/option-mappings.js';
import { buildConcisePrompt, promptWordCount } from '../src/engine/concise-prompt.js';
import { resolveCapture } from '../src/engine/scene-geometry.js';
import { createScenePlan } from '../src/engine/scene-planner.js';
import { auditPhotographicScene } from '../src/engine/photographic-auditor-v8.js';
import { validatePrompt } from '../src/engine/prompt-validator.js';
import { buildLocalPrompt } from '../../frontend/src/services/localConcisePrompt.js';
import type { Selections } from '../src/types/engine.types.js';

const defaults = Object.fromEntries(Object.entries(optionCatalogue)
  .map(([key, values]) => [key, values[0]!.id])) as Selections;
const scene = (changes: Partial<Selections>) => resolveSelections({ ...defaults, ...changes });

test('v9: all 30 x 30 pose and camera pairs remain physically compatible, protected, and identical offline', () => {
  let maxWords = 0;
  let maxPair = '';
  for (const angle of optionCatalogue.selfieAngles) {
    for (const pose of optionCatalogue.poses) {
      const selections = { ...defaults, selfieAngles: angle.id, poses: pose.id };
      const choices = resolveSelections(selections);
      const result = buildConcisePrompt(choices);
      const camera = resolveCapture(choices);
      assert.equal(buildLocalPrompt({ selections, variation: 0 }), result, angle.id + '/' + pose.id);
      assert.equal(validatePrompt(result, choices), true, angle.id + '/' + pose.id);
      assert.ok(result.includes(camera.pose) && result.includes(camera.angleText), angle.id + '/' + pose.id);
      if (promptWordCount(result) > maxWords) { maxWords = promptWordCount(result); maxPair = angle.id + '/' + pose.id; }
    }
  }
  assert.ok(maxWords <= 800, 'Max words ' + maxWords + ' for ' + maxPair);
});

test('v9: driver-only steering hand never appears in passenger or rear-seat framing', () => {
  for (const angle of ['angle-6', 'angle-7']) {
    const choices = scene({ selfieAngles: angle, poses: 'pose-1' });
    const prompt = buildConcisePrompt(choices);
    assert.ok(resolveCapture(choices).poseRepaired);
    assert.doesNotMatch(prompt, /wheel hand at edge only/i);
    assert.doesNotMatch(prompt.split('Pose:')[1]?.split('Angle:')[0]??'', /free hand on steering wheel/i);
    assert.match(prompt, /hands appear only if the angle includes them/i);
    assert.equal(validatePrompt(prompt, choices), true);
  }
});

test('v9: two steering hands require a real fixed timer phone, never a hand-held selfie', () => {
  const choices = scene({ selfieAngles: 'angle-1', poses: 'pose-8' });
  const result = buildConcisePrompt(choices);
  assert.ok(resolveCapture(choices).mounted);
  assert.match(result, /physically supported cabin mount/i);
  assert.match(result, /timer started by the subject/i);
  assert.doesNotMatch(result, /Angle: handheld from the driver seat/i);
  assert.match(auditPhotographicScene(choices).repairNotes.join(' '), /حامل ثابت/);
  assert.equal(validatePrompt(result, choices), true);
});

test('v9: NVIDIA cannot force an urban sidewalk into a desert selfie', () => {
  const choices = scene({ selfieAngles: 'angle-19', poses: 'pose-17', locations: 'location-2' });
  const plan = createScenePlan(choices);
  plan.environmentalRealism.background = 'A distant passerby crosses an urban sidewalk beyond the parked vehicle.';
  const output = buildConcisePrompt(choices, plan);
  assert.doesNotMatch(output, /urban sidewalk/i);
  assert.equal(validatePrompt(output, choices), true);
});

test('v10: source-only material physics ignores every NVIDIA or legacy plan change', () => {
  const choices = scene({ selfieAngles: 'angle-1', poses: 'pose-1' });
  const canonical = buildConcisePrompt(choices);
  const plan = createScenePlan(choices);
  plan.clothingAndMaterialPhysics.fabricBehavior = 'Invent a heavier new coat with different folds.';
  plan.environmentalRealism.background = 'Add a new urban street and a second lamp.';
  plan.naturalLightSimulation.source = 'two studio suns';
  plan.cameraGeometry.phonePosition = 'floating drone camera';
  assert.equal(buildConcisePrompt(choices, plan), canonical);
  assert.equal(validatePrompt(canonical, choices), true);
});
