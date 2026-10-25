import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import JSZip from 'jszip';
import {parseMovementProtocols,parseThreeDaySchedule,PROTOCOL_SOURCE,SCHEDULE_SOURCE,MOVEMENT_CATEGORIES} from '../scripts/movement-parser.mjs';
import {practiceForDay,cycleForDay,visiblePractices,readMovementDone,readPracticeBookmarks,BREATH_PATTERNS} from '../src/movementUtils.js';

test('30-day rhythm reflects 3-day original cycle, not random invented sessions',()=>{
  for(let i=1;i<=30;i++)assert.equal(cycleForDay(i),((i-1)%3)+1);
  assert.equal(cycleForDay(31),null);
  const schedule={cycles:[{cycleDay:1},{cycleDay:2},{cycleDay:3}]};
  assert.equal(practiceForDay(30,schedule).cycleDay,3);
  assert.equal(practiceForDay(1,schedule).cycleDay,1);
});
test('search, saved days and bookmarks are validated',()=>{
  const docs=[{id:'box',title:'Box Breathing',category:'Opening Practices',description:'',section:'',duration:'4 counts',steps:['Inhale gently'],modifications:[]}];
  assert.equal(visiblePractices(docs,'Opening Practices','gently').length,1);
  assert.equal(visiblePractices(docs,'Tai Chi','').length,0);
  assert.deepEqual([...readMovementDone('[1,2,30,31,"3"]')],[1,2,30]);
  assert.equal(readMovementDone('bad json').size,0);
  assert.deepEqual([...readPracticeBookmarks('["box-breathing","<script>",1]')],['box-breathing']);
});
test('breathing pattern data maintains author count sequences',()=>{
  assert.deepEqual(BREATH_PATTERNS.map(p=>p.phases.map(x=>x.seconds)),[[3,6,9],[4,4,4,4]]);
});
test('original DOCX supplies all 23 instructions, modifications and 3 training days',async t=>{
  const path='content/source/SovereignBodyMethod.zip';
  if(!existsSync(path)){t.skip('Canonical source archive is not present yet');return}
  const zip=await JSZip.loadAsync(await readFile(path));
  const a=zip.file(PROTOCOL_SOURCE);
  const b=zip.file(SCHEDULE_SOURCE);
  assert.ok(a);assert.ok(b);
  const exercises=await parseMovementProtocols(await a.async('nodebuffer'));
  assert.equal(exercises.length,23);
  assert.equal(new Set(exercises.map(x=>x.id)).size,23);
  for(const group of MOVEMENT_CATEGORIES)assert.ok(exercises.some(x=>x.category===group),group);
  assert.equal(exercises[0].title,'3-6-9 Breathing Technique');
  assert.equal(exercises[1].title,'Box Breathing (4-4-4-4)');
  assert.equal(exercises.at(-1).title,'Yoga Nidra Deep Relaxation Protocol');
  assert.ok(exercises.every(x=>x.steps.length>=4&&x.modifications.length>=2&&x.sourceFile===PROTOCOL_SOURCE));
  const plan=await parseThreeDaySchedule(await b.async('nodebuffer'));
  assert.equal(plan.cycles.length,3);
  assert.equal(plan.cycles[0].title,'Strength Focus');
  assert.equal(plan.cycles[1].title,'Flexibility and Cardiovascular Focus');
  assert.equal(plan.cycles[2].title,'Recovery Focus');
  assert.ok(plan.cycles.every(x=>x.sequence.length>=3&&x.sourceFile===SCHEDULE_SOURCE));
});
