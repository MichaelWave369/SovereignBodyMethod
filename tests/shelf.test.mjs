import test from 'node:test';
import assert from 'node:assert/strict';
import {SAVED_KEYS,loadShelfState,shelfTotals,selectedShelfEntries,selectedShelfManuscripts,savedDays} from '../src/shelfUtils.js';
const fake=values=>({getItem:key=>values[key]??null});
test('shelf reads existing saved formats only and never invents new source entries',()=>{
 const shelf=loadShelfState(fake({
  [SAVED_KEYS.recipes]:'["day-3-smoothie","day-30-dinner"]',
  [SAVED_KEYS.movements]:'["box-breathing-4-4-4-4"]',
  [SAVED_KEYS.botanicals]:'["botanical-chamomile"]',
  [SAVED_KEYS.reflections]:'[1,7,30]',
  [SAVED_KEYS.movementDone]:'[7,8]',
  [SAVED_KEYS.waterDone]:'[8,28]',
  [SAVED_KEYS.shopping]:'["day-3-smoothie-ingredient-1"]',
  [SAVED_KEYS.pantry]:'["day-3-smoothie-ingredient-2"]',
  unrelatedSecret:'private',
  [SAVED_KEYS.manuscripts]:JSON.stringify({
   'core-manual':{last:{position:10,probe:'Original passage here',ratio:0.23},
    bookmarks:[{position:10,probe:'Original passage here',ratio:0.23}]}
  })
 }));
 assert.deepEqual(shelfTotals(shelf),{recipes:2,movements:1,botanical:1,
  manuscriptBooks:1,manuscriptPassages:1,daysTouched:5,shopping:1,pantry:1});
 assert.deepEqual(savedDays(shelf),[1,7,8,28,30]);
 assert.deepEqual(selectedShelfEntries(shelf.recipeIds,[
  {id:'day-3-smoothie',title:'Source original'}]),[{id:'day-3-smoothie',title:'Source original'}]);
 assert.equal(selectedShelfManuscripts(shelf)[0].title,'30-Day Holistic Health Transformation');
});
test('shelf safely ignores invalid and unavailable source data',()=>{
 const shelf=loadShelfState(fake({
  [SAVED_KEYS.recipes]:'["day-30-smoothie","invalid"]',
  [SAVED_KEYS.manuscripts]:'{"private-family-tracker":{"last":{},"bookmarks":[]}}',
  [SAVED_KEYS.reflections]:'bad json'
 }));
 assert.equal(shelfTotals(shelf).recipes,1);
 assert.equal(shelfTotals(shelf).manuscriptBooks,0);
 assert.equal(shelfTotals(shelf).daysTouched,0);
 assert.deepEqual(selectedShelfEntries(shelf.recipeIds,[]),[]);
});
test('empty or inaccessible storage yields clean anonymous shelf',()=>{
 const shelf=loadShelfState({getItem:()=>{throw Error('blocked')}});
 assert.equal(shelfTotals(shelf).recipes,0);
 assert.deepEqual(savedDays(shelf),[]);
});
