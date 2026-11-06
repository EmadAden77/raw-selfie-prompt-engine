import test from 'node:test';
import assert from 'node:assert/strict';
import { identityRules } from '../src/rules/identity.rules.js';
import { hairRules } from '../src/rules/hair.rules.js';
test('identity and original hair are immutable rules',()=>{
  const text=[...identityRules,...hairRules].join(' ').toLowerCase();
  assert.match(text,/identity/);assert.match(text,/skin tone/);
  assert.match(text,/hairline/);assert.match(text,/density/);
  assert.match(text,/never beautify/);
});

