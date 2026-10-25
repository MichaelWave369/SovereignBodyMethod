import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import JSZip from 'jszip';
import {WEEK_FILES,parseWeeklyDocx,validate30DayPlan} from '../scripts/meal-parser.mjs';
import {WEEKS,dayRecipes,searchRecipes,weekForDay,rangeRecipes,shoppingRows,shoppingListText,readChecked} from '../src/mealUtils.js';

test('week boundaries cover 30 days without gaps',()=>{
 assert.deepEqual(WEEKS.map(x=>[x.from,x.to]),[[1,7],[8,14],[15,21],[22,30]]);
 assert.equal(weekForDay(30).id,'week4');
});
const sample=[{id:'day-1-smoothie',day:1,type:'smoothie',title:'Berry Test',sourceFile:'Week1_Recipes.docx',
 ingredients:['2 cups berries','1 cup water'],instructions:['Blend']},
 {id:'day-1-dinner',day:1,type:'dinner',title:'Tofu Test',sourceFile:'Week1_Recipes.docx',
 ingredients:['1 cup water','2 cups tofu'],instructions:['Cook']},
 {id:'day-8-salad',day:8,type:'salad',title:'Garden Test',sourceFile:'Week2_Recipes.docx',
 ingredients:['2 cups greens'],instructions:['Mix']}];
test('searches ingredients and type without modifying originals',()=>{
 assert.deepEqual(searchRecipes(sample,'water').map(x=>x.title),['Berry Test','Tofu Test']);
 assert.deepEqual(searchRecipes(sample,'tofu','dinner').map(x=>x.id),['day-1-dinner']);
 assert.equal(dayRecipes(sample,1).length,2);
 assert.equal(rangeRecipes(sample,'week1',1).length,2);
 assert.equal(rangeRecipes(sample,'day',8).length,1);
});
test('shopping list keeps each exact ingredient line, never silently sums quantities',()=>{
 const rows=shoppingRows(sample.slice(0,2));
 assert.equal(rows.length,4);
 assert.equal(rows.filter(x=>x.ingredient==='1 cup water').length,2);
 const output=shoppingListText(rows,'day',1);
 assert.match(output,/1 cup water/);
 assert.match(output,/NOT automatically combined/);
 assert.equal(readChecked('["day-1-smoothie-ingredient-0",123,"bad"] ').size,1);
 assert.equal(readChecked('{').size,0);
});
test('strict weekly OOXML parser maps authors’ original 90 meals correctly',async t=>{
 const file='content/source/SovereignBodyMethod.zip';
 if(!existsSync(file)){t.skip('Source ZIP has not yet been uploaded');return}
 const zip=await JSZip.loadAsync(await readFile(file));
 const actual=[];
 for(const week of WEEK_FILES){
   const entry=zip.file(week.name);
   assert.ok(entry,'Missing '+week.name);
   const recipes=await parseWeeklyDocx(await entry.async('nodebuffer'),week.name);
   assert.equal(recipes.length,(week.last-week.first+1)*3);
   assert.ok(recipes.every(r=>r.day>=week.first&&r.day<=week.last));
   actual.push(...recipes);
 }
 assert.ok(validate30DayPlan(actual));
 assert.equal(actual[0].title,'Berry Blast');
 assert.equal(actual.at(-1).title,'Celebration Tofu Bowl with Everything');
 assert.equal(actual.filter(r=>r.type==='dinner').length,30);
 assert.ok(actual.every(r=>r.servings==='2 people'));
 assert.ok(actual.every(r=>r.ingredients.length>=2&&r.instructions.length>=2));
});
