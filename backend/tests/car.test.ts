import test from 'node:test';
import assert from 'node:assert/strict';
import { carRules } from '../src/rules/car.rules.js';
import { INTERIOR_RULE } from '../src/rules/cabin.rules.js';

test('2022 Range Rover stays pearl white and parked with a black steering wheel',()=>{
  const text=carRules.join(' ')+' '+INTERIOR_RULE;
  assert.match(text,/2022 Range Rover Sport/);
  assert.match(text,/pearl-white/);
  assert.match(text,/black rims/);
  assert.match(text,/light beige leather.*seats/i);
  assert.match(text,/glossy dark wood/);
  assert.match(text,/chrome/);
  assert.match(text,/piano-black/);
  assert.match(text,/steering wheel is wrapped in black leather/);
  assert.doesNotMatch(text,/beige steering wheel/i);
  assert.match(text,/stationary/);
});
