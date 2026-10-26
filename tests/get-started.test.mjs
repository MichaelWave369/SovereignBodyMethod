import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {entryPaths,pathById,startHereAnchors} from '../src/getStartedPaths.js';
test('five unique beginner routes have useful, real destinations',()=>{
 assert.equal(entryPaths.length,5);
 assert.equal(new Set(entryPaths.map(x=>x.id)).size,5);
 for(const path of entryPaths){
  assert.ok(path.title&&path.subtitle&&path.introduction);
  assert.equal(path.steps.length,4);
  for(const step of path.steps){
   assert.ok(step.title&&step.detail&&step.button);
   assert.ok(startHereAnchors.includes(step.href.slice(1)),step.href);
  }
 }
 assert.equal(pathById('bad').id,'everyday');
});
test('only explicitly starting day one changes the existing shared day',()=>{
 const actions=entryPaths.flatMap(p=>p.steps.filter(s=>s.action));
 assert.deepEqual(actions.map(x=>[x.href,x.action]),[['#daily','day-one']]);
 assert.ok(entryPaths.every(x=>!Object.hasOwn(x,'storageKey')));
});
test('every welcome link has a real on-page anchor',async()=>{
 const paths=['src/App.jsx','src/MealPlanner.jsx','src/MovementStudio.jsx',
  'src/HydrationStudio.jsx','src/SovereignShelf.jsx','src/ArchiveLibrary.jsx',
  'src/OriginalReleases.jsx','src/OfflineKitchen.jsx','src/PocketPanel.jsx'];
 const texts=(await Promise.all(paths.map(p=>readFile(p,'utf8')))).join('\n');
 for(const anchor of startHereAnchors)assert.ok(texts.includes('id="'+anchor+'"'),'Missing #'+anchor);
});
