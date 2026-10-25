import test from 'node:test';
import assert from 'node:assert/strict';
import {makePocketBackup,parsePocketBackup,restorePocketBackup,pocketSummary,
 validatePocketEntry,POCKET_KEYS,POCKET_VERSION} from '../src/pocketBackup.js';
function mockStorage(initial={}){
 const map=new Map(Object.entries(initial));
 return {
  getItem:k=>map.has(k)?map.get(k):null,
  setItem:(k,v)=>map.set(k,String(v)),
  removeItem:k=>map.delete(k),
  entries:()=>Object.fromEntries(map)
 };
}
test('export uses only known Sovereign keys and never leaks arbitrary localStorage',()=>{
 const local=mockStorage({
  [POCKET_KEYS[0]]:'17',
  [POCKET_KEYS[1]]:'[1,17,30]',
  [POCKET_KEYS[4]]:'["day-1-smoothie"]',
  otherApp:'SHOULD NOT EXPORT',jwt:'secret'
 });
 const result=makePocketBackup(local,new Date('2026-10-25T00:00:00.000Z'));
 assert.equal(result.version,POCKET_VERSION);
 assert.equal(result.exportedAt,'2026-10-25T00:00:00.000Z');
 assert.equal(result.entries[POCKET_KEYS[0]],'17');
 assert.equal(Object.keys(result.entries).length,3);
 assert.ok(!JSON.stringify(result).includes('SHOULD NOT EXPORT'));
 assert.ok(!JSON.stringify(result).includes('secret'));
 assert.equal(pocketSummary(result).reflections,3);
});
test('full local backup restores all allowed data and preserves unrelated keys',()=>{
 const before=mockStorage({
  [POCKET_KEYS[0]]:'29',
  [POCKET_KEYS[2]]:'[1,29]',
  [POCKET_KEYS[3]]:'[1,28]',
  [POCKET_KEYS[5]]:'["day-29-dinner-ingredient-2"]',
  [POCKET_KEYS[9]]:JSON.stringify({'day-29-dinner-ingredient-2':'3.15'}),
  [POCKET_KEYS[10]]:JSON.stringify({'week4':'100'}),
 });
 const exported=JSON.stringify(makePocketBackup(before));
 const after=mockStorage({'otherApp':'mine',[POCKET_KEYS[0]]:'2',[POCKET_KEYS[1]]:'[2]'});
 const count=restorePocketBackup(after,exported);
 assert.equal(count,6);
 assert.equal(after.getItem(POCKET_KEYS[0]),'29');
 assert.equal(after.getItem(POCKET_KEYS[1]),null);
 assert.equal(after.getItem(POCKET_KEYS[9]),JSON.stringify({'day-29-dinner-ingredient-2':'3.15'}));
 assert.equal(after.getItem('otherApp'),'mine');
});
test('malicious keys, bogus days and oversized input are rejected before write',()=>{
 const original=mockStorage({[POCKET_KEYS[0]]:'5'});
 const backup=makePocketBackup(original);
 for(const entries of [
  {...backup.entries,'anotherSite.key':'password'},
  {...backup.entries,[POCKET_KEYS[0]]:'31'},
  {...backup.entries,[POCKET_KEYS[3]]:'[29]'},
  {...backup.entries,[POCKET_KEYS[5]]:'["../../unexpected"]'},
  {...backup.entries,[POCKET_KEYS[9]]:'{"__proto__":"9.99"}'},
  {...backup.entries,[POCKET_KEYS[10]]:'{"week9":"75"}'}
 ]){
  assert.throws(()=>parsePocketBackup(JSON.stringify({...backup,entries})));
 }
 assert.throws(()=>parsePocketBackup('a'.repeat(512*1024+1)));
 assert.throws(()=>parsePocketBackup(JSON.stringify({...backup,version:999})));
 assert.equal(original.getItem(POCKET_KEYS[0]),'5');
 assert.throws(()=>validatePocketEntry('other.key','hi'));
});
test('write failure attempts to roll back previous saved state',()=>{
 const old=mockStorage({[POCKET_KEYS[0]]:'2'});
 const restored=JSON.stringify(makePocketBackup(mockStorage({[POCKET_KEYS[0]]:'30',[POCKET_KEYS[1]]:'[30]'})));
 let failed=false;
 const flaky={
  getItem:k=>old.getItem(k),
  removeItem:k=>old.removeItem(k),
  setItem:(k,v)=>{
   if(k===POCKET_KEYS[1]&&!failed){failed=true;throw Error('QuotaExceededError')}
   old.setItem(k,v);
  }
 };
 assert.throws(()=>restorePocketBackup(flaky,restored),/interrupted/);
 assert.equal(old.getItem(POCKET_KEYS[0]),'2');
 assert.equal(old.getItem(POCKET_KEYS[1]),null);
});
