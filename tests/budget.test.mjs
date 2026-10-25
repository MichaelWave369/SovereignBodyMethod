import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import JSZip from 'jszip';
import {parseOriginalFoodBudgets,BUDGET_SOURCE} from '../scripts/budget-parser.mjs';
import {parsePriceInput,money,readBudgetPrices,readBudgetTarget,summarizeBudget,originalFoodTier} from '../src/budgetUtils.js';

test('only finite nonnegative price inputs with at most two decimal places',()=>{
 assert.equal(parsePriceInput('3.50'),350);
 assert.equal(parsePriceInput('0'),0);
 assert.equal(parsePriceInput('0.1'),10);
 assert.equal(parsePriceInput('2.'),200);
 for(const input of ['-2','0.999','10000','abc','Infinity','NaN','1e6','1,000'])assert.equal(parsePriceInput(input),null);
 assert.equal(money(125), '$1.25');
});
test('price state accepts only safe item keys and values',()=>{
 const value=readBudgetPrices(JSON.stringify({
  'day-1-smoothie-ingredient-0':'2.30',
  'day-30-dinner-ingredient-9':'0',
  'day-99-salad-ingredient-0':'3',
  '<script>':'500',
  'day-1-dinner-ingredient-0':'99999'
 }));
 assert.equal(Object.keys(value).length,2);
 assert.equal(readBudgetTarget('100'),10000);
 assert.equal(readBudgetTarget('0'),null);
 assert.equal(readBudgetTarget('bad'),null);
 assert.deepEqual(readBudgetPrices('{bad'),{});
});
test('pantry items excluded, purchased counted, missing prices mean incomplete',()=>{
 const rows=[{id:'day-1-smoothie-ingredient-0'},{id:'day-1-smoothie-ingredient-1'},{id:'day-1-smoothie-ingredient-2'}];
 const prices={[rows[0].id]:'2.50',[rows[1].id]:'3.25'};
 const incomplete=summarizeBudget(rows,prices,new Set(),new Set([rows[0].id]),1000);
 assert.equal(incomplete.estimatedCents,575);
 assert.equal(incomplete.spentCents,250);
 assert.equal(incomplete.remainingCents,325);
 assert.equal(incomplete.unknown,1);
 assert.equal(incomplete.complete,false);
 assert.equal(incomplete.overTarget,false);
 const complete=summarizeBudget(rows,prices,new Set([rows[2].id]),new Set([rows[0].id]),500);
 assert.equal(complete.estimatedCents,575);
 assert.equal(complete.excluded,1);
 assert.equal(complete.unknown,0);
 assert.equal(complete.complete,true);
 assert.equal(complete.overTarget,true);
 assert.equal(originalFoodTier([{id:'tier2'}],'tier2').id,'tier2');
});
test('real reference appendix has three source-verified historical food tiers',async t=>{
 const path='content/source/SovereignBodyMethod.zip';
 if(!existsSync(path)){t.skip('Approved original source ZIP not found');return}
 const zip=await JSZip.loadAsync(await readFile(path));
 const source=zip.file(BUDGET_SOURCE);assert.ok(source);
 const profiles=await parseOriginalFoodBudgets(await source.async('nodebuffer'));
 assert.deepEqual(profiles.map(p=>p.historicWeeklyFoodBudget),[[50,75],[75,100],[100,125]]);
 assert.deepEqual(profiles.map(p=>p.name),['College Kid Budget','RV Living Budget','Standard Budget']);
 assert.ok(profiles.every(p=>p.shoppingNotes.length>=4));
 assert.ok(!JSON.stringify(profiles).includes('Smart stack'));
});
