import test from 'node:test';
import assert from 'node:assert/strict';
import {readDayPreference,dailySources,dayProgress,uniqueCompletedDays} from '../src/dailyUtils.js';
test('one selected day safely spans all 30 days',()=>{
 assert.equal(readDayPreference('12'),12);
 assert.equal(readDayPreference('30'),30);
 for(const v of ['31','0','-5','foo','1.3',null])assert.equal(readDayPreference(v),1);
});
test('same day maps to source meals, original 3-day movement and 28-day water limit',()=>{
 const meals=[{id:'day-28-smoothie',day:28,type:'smoothie',title:'Original smoothie'},
  {id:'day-28-salad',day:28,type:'salad',title:'Original salad'},
  {id:'day-28-dinner',day:28,type:'dinner',title:'Original dinner'},
  {id:'day-29-dinner',day:29,type:'dinner',title:'Day 29 dinner'}];
 const schedule={cycles:[{title:'Strength'},{title:'Flexibility'},{title:'Recovery'}]};
 const water=[{day:28,blend:'Original water blend'}];
 const day28=dailySources(28,meals,schedule,water);
 assert.deepEqual(day28.meals.map(m=>m.type),['smoothie','salad','dinner']);
 assert.equal(day28.movement.title,'Strength');
 assert.equal(day28.water.blend,'Original water blend');
 assert.equal(day28.reflection.day,28);
 assert.equal(dailySources(29,meals,schedule,water).water,null);
 assert.equal(dailySources(29,meals,schedule,water).waterScheduleEnded,true);
 assert.equal(dailySources(30,meals,schedule,water).movement.title,'Recovery');
 assert.equal(dailySources(31,meals,schedule,water),null);
});
test('progress counts are optional, local and not treated as health scores',()=>{
 const journal=new Set([2,30]),movement=new Set([2]),water=new Set([2,30]);
 assert.deepEqual(dayProgress(2,journal,movement,water),
  {journey:true,movement:true,water:true,waterEligible:true,completed:3,possible:3});
 assert.deepEqual(dayProgress(30,journal,movement,water),
  {journey:true,movement:false,water:false,waterEligible:false,completed:1,possible:2});
 assert.equal(uniqueCompletedDays(journal,movement,water),2);
});
