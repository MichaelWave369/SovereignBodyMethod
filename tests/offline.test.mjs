import test from 'node:test';
import assert from 'node:assert/strict';
import {planFromFiles,serviceWorkerSource,BASE} from '../scripts/offline-build.mjs';

const files=[
  'index.html','site.webmanifest','mark.svg','assets/index-a.js','assets/index-b.css',
  'meals/recipes.json','library/catalog.json','library/docs/core-manual.json',
  'library/originals/core-manual.docx','library/originals/week-one.docx','sw-template.js'
];
test('core caches source reading and meals; Word files remain optional',()=>{
  const plan=planFromFiles(files);
  assert.ok(plan.core.includes(BASE+'meals/recipes.json'));
  assert.ok(plan.core.includes(BASE+'library/docs/core-manual.json'));
  assert.ok(plan.core.includes(BASE+'assets/index-a.js'));
  assert.ok(plan.core.includes(BASE));
  assert.deepEqual(plan.originals,[BASE+'library/originals/core-manual.docx',BASE+'library/originals/week-one.docx']);
  assert.ok(!plan.core.some(x=>x.endsWith('.docx')));
  assert.ok(!plan.core.includes(BASE+'sw-template.js'));
});
test('rejects unsafe path, missing data and invalid site prefix',()=>{
  assert.throws(()=>planFromFiles([...files,'../../secret.json']),/Unsafe/);
  assert.throws(()=>planFromFiles([...files,'/index.html']),/Unsafe/);
  assert.throws(()=>planFromFiles(['index.html']),/Missing critical/);
  assert.throws(()=>planFromFiles(files,'/../oops/'),/Invalid site base/);
});
test('generated worker has scoped paths and messaging',()=>{
  const template='const x=__BASE__; const y=__CORE_URLS__; const z=__ORIGINAL_URLS__; const v=__REVISION__;';
  const out=serviceWorkerSource(template,planFromFiles(files),'0123456789abcd');
  assert.match(out,/SovereignBodyMethod/);
  assert.match(out,/meals\/recipes.json/);
  assert.match(out,/library\/originals\/core-manual.docx/);
  assert.doesNotMatch(out,/__BASE__/);
});
