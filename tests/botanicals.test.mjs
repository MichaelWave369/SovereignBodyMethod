import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import {manuscriptSources,indexFamilies,indexTerms,deriveHerbIndex} from '../src/herbSources.js';
test('index vocabulary is unique and covers three reader categories',()=>{
 assert.equal(manuscriptSources.length,5);
 assert.equal(indexFamilies.length,3);
 assert.equal(new Set(indexTerms.map(x=>x.id)).size,indexTerms.length);
});
test('extracts only source-mentioned terms and never exports dose or health claims',()=>{
 const entries=deriveHerbIndex([
  {id:'herbals',html:'<p>Chamomile, ginger and chamomile again.</p>'},
  {id:'reference',html:'<p>Vitamin D and Magnesium.</p>'}
 ]);
 assert.equal(entries.find(x=>x.name==='Chamomile').mentions,2);
 assert.ok(entries.find(x=>x.name==='Vitamin D'));
 assert.ok(!entries.find(x=>x.name==='Valerian'));
 assert.ok(entries.every(x=>!('dose' in x)&&!('effects' in x)&&!('excerpt' in x)));
});
test('matches whole botanical terms, not substring lookalikes',()=>{
 const items=deriveHerbIndex([{id:'herbals',html:'<p>thyme and rosemary; Magnesiums is a false match.</p>'}]);
 assert.ok(items.find(x=>x.name==='Thyme'));
 assert.ok(!items.find(x=>x.name==='Magnesium'));
});
test('real original ZIP provides indexable herbs and supplements',async t=>{
 const path='content/source/SovereignBodyMethod.zip';
 if(!existsSync(path)){t.skip('Approved source not present');return}
 const zip=await JSZip.loadAsync(await readFile(path));
 const docs=[];
 for(const source of manuscriptSources){
  const entry=zip.file(source.filename);assert.ok(entry,source.filename);
  const result=await mammoth.convertToHtml({buffer:await entry.async('nodebuffer')});
  docs.push({id:source.id,html:result.value});
 }
 const index=deriveHerbIndex(docs);
 assert.ok(index.length>=5);
 assert.ok(index.some(x=>x.family==='botanical'));
 assert.ok(index.some(x=>x.family==='supplement'));
 assert.ok(index.every(x=>x.sources.every(s=>manuscriptSources.some(m=>m.id===s.id))));
});
