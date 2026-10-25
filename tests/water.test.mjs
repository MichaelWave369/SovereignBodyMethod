import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import JSZip from 'jszip';
import {extractWaterSchedule,SOURCE_FILE} from '../scripts/water-parser.mjs';
import {WATER_WEEKS,filterWaterDays,weekFromWaterDay,waterCompletion} from '../src/hydrationUtils.js';
import {releaseCoverage,verifiedSourceIds} from '../src/releaseCoverage.js';

test('release ledger covers 9 products without implying all Gumroad packages are present',()=>{
 assert.equal(releaseCoverage.length,9);
 assert.equal(new Set(releaseCoverage.map(p=>p.id)).size,9);
 assert.equal(releaseCoverage.filter(p=>p.status==='covered').length,4);
 assert.ok(releaseCoverage.find(p=>p.id==='exercise').detail.includes('no embedded diagram images'));
 assert.ok(releaseCoverage.every(x=>x.sources.length>0));
 for(const entry of releaseCoverage)for(const source of entry.sources)assert.ok(verifiedSourceIds.has(source.id),source.id);
});
test('28-day water weeks have exactly 4 blocks, and state rejects invalid days',()=>{
 assert.deepEqual(WATER_WEEKS.map(w=>w.days),[[1,7],[8,14],[15,21],[22,28]]);
 assert.equal(weekFromWaterDay(28),4);
 assert.deepEqual([...waterCompletion('[1,28,29,"2",null,1]')],[1,28]);
 assert.equal(waterCompletion('{invalid').size,0);
});
test('water search preserves the original blend and note text',()=>{
 const days=[{day:1,week:1,weekday:'Monday',blend:'Lemon + Lime',notes:'Slice thin'},
             {day:8,week:2,weekday:'Monday',blend:'Cucumber + Lime',notes:'Fresh cucumber'}];
 assert.deepEqual(filterWaterDays(days,1,'lime').map(x=>x.day),[1]);
 assert.deepEqual(filterWaterDays(days,0,'cucumber').map(x=>x.day),[8]);
 assert.equal(days[0].blend,'Lemon + Lime');
});
test('water importer extracts real 28-day schedule from the original Word source',async t=>{
 const path='content/source/SovereignBodyMethod.zip';
 if(!existsSync(path)){t.skip('Approved source ZIP not yet committed');return}
 const zip=await JSZip.loadAsync(await readFile(path));
 const file=zip.file(SOURCE_FILE);assert.ok(file,'Missing original 28-day water guide');
 const days=await extractWaterSchedule(await file.async('nodebuffer'));
 assert.equal(days.length,28);
 for(let i=0;i<28;i++){
  assert.equal(days[i].day,i+1);
  assert.equal(days[i].week,Math.floor(i/7)+1);
  assert.ok(days[i].blend&&days[i].notes);
 }
 assert.equal(days[0].blend,'Lemon + Lime');
 assert.equal(days[7].blend,'Orange + Lemon');
 assert.equal(days.at(-1).weekday,'Sunday');
});
