import test from 'node:test';
import assert from 'node:assert/strict';
import { carRules } from '../src/rules/car.rules.js';
test('car stays white, beige, and parked',()=>{
  const text=carRules.join(' ');
  assert.match(text,/2022 Range Rover Sport/);
  assert.match(text,/pearl-white/);assert.match(text,/black rims/);
  assert.match(text,/beige seats/);assert.match(text,/beige dashboard/);
  assert.match(text,/stationary/);
});

