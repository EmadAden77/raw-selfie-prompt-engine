import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { generatePrompt } from '../src/services/prompt.service.js';
import { optionCatalogue } from '../src/data/option-mappings.js';
import { fallbackGenerator } from '../src/engine/fallback-generator.js';
import { validateEditorialRewrite } from '../src/engine/editor-validator.js';
import { NVIDIA_EDITOR_INSTRUCTION } from '../src/prompts/nvidia-system-prompt.js';
import type { Selections } from '../src/types/engine.types.js';

const selections = Object.fromEntries(
  Object.entries(optionCatalogue).map(([key, values]) => [key, values[0]!.id])
) as Selections;
const request = { selections, variation: 2 };
const canonical = fallbackGenerator(request);
const key = 'nvapi-' + 'a'.repeat(30);
const originalKey = process.env.NVIDIA_API_KEY;
const originalFetch = globalThis.fetch;

after(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.NVIDIA_API_KEY;
  else process.env.NVIDIA_API_KEY = originalKey;
});

function response(text: string, status = 200) {
  return new Response(JSON.stringify({
    choices: [{ message: { content: text }, finish_reason: 'stop' }]
  }), { status });
}

test('NVIDIA is editor only: receives complete Rule Builder text with temperature 0.25', async () => {
  process.env.NVIDIA_API_KEY = key;
  try {
    globalThis.fetch = async (_url, options) => {
      const headers = (options as RequestInit).headers as Record<string, string>;
      assert.equal(headers.Authorization, 'Bearer ' + key);
      const body = JSON.parse((options as RequestInit).body as string) as {
        model: string;
        temperature: number;
        messages: Array<{ role: string; content: string }>;
      };
      assert.equal(body.temperature, 0.25);
      assert.equal(body.model, 'deepseek-ai/deepseek-v4.1-flash');
      assert.equal(body.messages[1]!.content, canonical);
      assert.ok(body.messages[0]!.content.includes(NVIDIA_EDITOR_INSTRUCTION));
      assert.doesNotMatch(body.messages[1]!.content, /nvapi-|imageBase64|referenceImage/);
      // Safe editorial-only adjustment: an article, not a factual change.
      return response(canonical.replace('The parked pearl-white', 'A parked pearl-white'));
    };
    const result = await generatePrompt(request);
    assert.equal(result.source, 'server', result.reason);
    assert.match(result.prompt, /195 cm/);
    assert.match(result.prompt, /88 kg/);
    assert.match(result.prompt, /Range Rover Sport/);
    assert.equal(result.prompt, canonical.replace('The parked pearl-white', 'A parked pearl-white'));
    assert.doesNotMatch(JSON.stringify(result), /nvapi-/);
  } finally { globalThis.fetch = originalFetch; }
});

test('NVIDIA-only safe edits preserve the same facts as local fallback', () => {
  const alteredArticle = canonical.replace('The parked pearl-white', 'A parked pearl-white');
  assert.equal(validateEditorialRewrite(canonical, alteredArticle), true);
  assert.equal(validateEditorialRewrite(canonical, canonical), true);
  assert.equal(fallbackGenerator(request), canonical);
});

test('no new fact is accepted, including plausible added light, curb, road or fabric', async () => {
  process.env.NVIDIA_API_KEY = key;
  const forbidden = [
    canonical.replace('195 cm', '193 cm'),
    canonical.replace('88 kg', '83 kg'),
    canonical.replace('black leather three-spoke wheel', 'beige leather three-spoke wheel'),
    canonical.replace('Lighting:', 'Lighting: An additional street lamp creates a second source.'),
    canonical.replace('Framing:', 'Framing: The subject is shown full-body from a remote camera.'),
    canonical + ' Natural new dust accumulates on the dashboard.',
    canonical.replace('no beauty filters, wax, plastic skin', 'beautified porcelain skin')
  ];
  try {
    for (const text of forbidden) {
      assert.equal(validateEditorialRewrite(canonical, text), false, text.slice(-75));
      globalThis.fetch = async () => response(text);
      const result = await generatePrompt(request);
      assert.equal(result.source, 'local');
      assert.equal(result.reason, 'unsafe_output');
      assert.equal(result.prompt, canonical, 'Unsafe NVIDIA output must return exact Rule Builder text');
    }
  } finally { globalThis.fetch = originalFetch; }
});

test('editor cannot remove any canonical fact or add a new object even if existing facts remain', () => {
  assert.equal(validateEditorialRewrite(canonical, canonical.replace('2022', '2023')), false);
  assert.equal(validateEditorialRewrite(canonical, canonical.replace('Range Rover Sport', 'Range Rover')), false);
  assert.equal(validateEditorialRewrite(canonical, canonical + ' There is a new road sign.'), false);
  assert.equal(validateEditorialRewrite(canonical, canonical.replace('No off-frame details.', '')), false);
});

test('NVIDIA down gracefully: no env key, invalid JSON-like text, 401, and 404 retry', async () => {
  try {
    delete process.env.NVIDIA_API_KEY;
    let result = await generatePrompt(request);
    assert.equal(result.source, 'local');
    assert.equal(result.reason, 'no_key');
    assert.equal(result.prompt, canonical);

    process.env.NVIDIA_API_KEY = key;
    globalThis.fetch = async () => response('{"cameraGeometry":{"invented":"light"}}');
    result = await generatePrompt(request);
    assert.equal(result.source, 'local');
    assert.equal(result.reason, 'unsafe_output');
    assert.equal(result.prompt, canonical);

    globalThis.fetch = async () => new Response('', { status: 401 });
    result = await generatePrompt(request);
    assert.equal(result.reason, 'unauthorized');

    const calls: string[] = [];
    globalThis.fetch = async (_url, options) => {
      const payload = JSON.parse((options as RequestInit).body as string) as { model: string };
      calls.push(payload.model);
      return new Response('', { status: 404 });
    };
    result = await generatePrompt(request);
    assert.equal(result.reason, 'model_unavailable');
    assert.deepEqual(calls, ['deepseek-ai/deepseek-v4.1-flash', 'nvidia/nemotron-3.5-lightning-30b-a3b']);
  } finally { globalThis.fetch = originalFetch; }
});

test('identical fallback facts for exterior roadside, selected light and vehicle geometry', async () => {
  process.env.NVIDIA_API_KEY = key;
  const outside = {
    ...selections, selfieAngles: 'angle-19', poses: 'pose-17',
    locations: 'location-20', lighting: 'light-3'
  };
  const local = fallbackGenerator({ selections: outside, variation: 1 });
  assert.match(local, /195 cm/);
  assert.match(local, /88 kg/);
  assert.match(local, /20–30 cm/);
  assert.match(local, /15 cm/);
  assert.match(local, /5500K/);
  try {
    globalThis.fetch = async () => response(local);
    const edited = await generatePrompt({ selections: outside, variation: 1 });
    assert.equal(edited.source, 'server', edited.reason);
    assert.equal(edited.prompt, local);
  } finally { globalThis.fetch = originalFetch; }
});
