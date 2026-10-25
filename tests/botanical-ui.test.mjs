import test from 'node:test';
import assert from 'node:assert/strict';
import {searchableTerms,readSavedReadingList} from '../src/botanicalUtils.js';
const terms=[
 {id:'botanical-chamomile',name:'Chamomile',family:'botanical',sources:[{id:'herbals',mentions:3}]},
 {id:'oil-tea-tree-oil',name:'Tea Tree Oil',family:'oil',sources:[{id:'tinctures',mentions:1}]},
 {id:'supplement-magnesium',name:'Magnesium',family:'supplement',sources:[{id:'reference',mentions:2}]}
];
test('source search filters by family, source manuscript and reading-list bookmarks',()=>{
 assert.equal(searchableTerms(terms,{query:'cham'}).length,1);
 assert.equal(searchableTerms(terms,{family:'oil'}).length,1);
 assert.equal(searchableTerms(terms,{source:'reference'}).length,1);
 assert.deepEqual(searchableTerms(terms,{savedOnly:true,saved:new Set(['botanical-chamomile'])}).map(x=>x.name),['Chamomile']);
 assert.equal(searchableTerms(terms,{source:'reference',family:'botanical'}).length,0);
});
test('saved reader topics are constrained to safe index term IDs',()=>{
 assert.deepEqual([...readSavedReadingList('["botanical-chamomile","oil-tea-tree-oil","<script>",10]')],
  ['botanical-chamomile','oil-tea-tree-oil']);
 assert.equal(readSavedReadingList('broken').size,0);
 assert.equal(readSavedReadingList('{"id":"x"}').size,0);
});
