import test from 'node:test';
import assert from 'node:assert/strict';
import { journey, phases, subjects, completedFromStorage } from '../src/method.js';
test('30 unique prompts, numbered in order',()=>{
  assert.equal(journey.length,30);
  assert.deepEqual(journey.map(j=>j.day),Array.from({length:30},(_,i)=>i+1));
  assert.equal(new Set(journey.map(j=>j.name)).size,30);
  assert.ok(journey.every(j=>j.prompt.length>10));
});
test('30 days belong to four phases',()=>{
  assert.equal(phases.length,4);
  assert.deepEqual([journey[0].phase,journey[7].phase,journey[14].phase,journey[21].phase],phases.map(x=>x.title));
  assert.ok(journey.every(j=>phases.some(p=>p.title===j.phase)));
});
test('topic library includes distinct entries',()=>{
  assert.equal(subjects.length,12);
  assert.equal(new Set(subjects.map(s=>s.name)).size,12);
  assert.ok(subjects.every(s=>s.summary&&s.detail));
});
test('local progress state validates values',()=>{
  assert.deepEqual([...completedFromStorage('[1,2,55,"4",-1]')],[1,2]);
  assert.deepEqual([...completedFromStorage('invalid')],[]);
});
