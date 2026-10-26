import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {verifySourceCrosswalk,verifyInternalAnchors,verifyPublishedCounts} from '../scripts/launch-contract.mjs';
test('all nine storefront releases link exclusively to downloadable approved original IDs',()=>{
 assert.deepEqual(verifySourceCrosswalk(),{approved:21,releases:9,linkedOriginals:15});
});
test('every static hash link and authored entry route resolves to an actual section',async()=>{
 const components=(await readdir('src')).filter(x=>x.endsWith('.jsx'));
 const texts=await Promise.all(components.map(x=>readFile('src/'+x,'utf8')));
 const audit=verifyInternalAnchors(texts);
 assert.ok(audit.checkedLinks>=9);
 assert.throws(()=>verifyInternalAnchors(['<section id="daily"></section><a href="#does-not-exist">Bad</a>']),/Broken public anchor/);
});
test('published source coverage audit rejects missing books or fabricated water days',()=>{
 const approved=Array.from({length:21},(_,i)=>({id:'book-'+i,available:true}));
 const recipeRows=Array.from({length:90},(_,i)=>({id:'recipe-'+i,day:i%30+1}));
 const water=Array.from({length:28},(_,i)=>({day:i+1}));
 const base={
  catalog:{countAvailable:21,documents:approved},
  recipes:{recipeCount:90,recipes:recipeRows},
  movement:{protocolCount:23},
  water:{days:water},
  budget:{profiles:[{},{},{}]},
  sound:{sourceFrequencies:Array(8),sourceCrystals:Array(13)},
  botanicals:{terms:Array(34)},
  atlas:{documentCount:21,passageCount:5178,documents:approved}
 };
 assert.throws(()=>verifyPublishedCounts({...base,water:{days:[...water,{day:29}]}}),/infused-water days/);
 assert.throws(()=>verifyPublishedCounts({...base,catalog:{countAvailable:20,documents:approved}}),/21 approved/);
 assert.throws(()=>verifyPublishedCounts({...base,atlas:{...base.atlas,passageCount:10}}),/incomplete/);
});
