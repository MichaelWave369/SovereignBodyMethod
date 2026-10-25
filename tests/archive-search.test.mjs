import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import sanitizeHtml from 'sanitize-html';
import {archiveDocuments} from '../src/archiveCatalog.js';
import {extractManuscriptPassages,buildManuscriptIndex,passageText,searchManuscriptPassages,passageSnippet} from '../src/archiveSearch.js';

test('extracts source text from paragraph/headings/list/table without hallucinated passages',()=>{
 const html='<h2>Chapter &amp; Origins</h2><p>Gentle movements are options.</p><ul><li>Breathing 4-4-4-4</li></ul><table><tr><td>Ingredient &lt;dose&gt;</td></tr></table>';
 const blocks=extractManuscriptPassages(html);
 assert.deepEqual(blocks.map(b=>b.position),[0,1,2,3]);
 assert.equal(blocks[0].text,'Chapter & Origins');
 assert.equal(blocks[3].text,'Ingredient <dose>');
 assert.equal(passageText('C&#233; &amp; more'),'Cé & more');
});
test('finds exact same-text matches, provides original excerpts and respects categories',()=>{
 const index=buildManuscriptIndex([
  {id:'movement',title:'Movement',category:'Exercise',available:true},
  {id:'herbs',title:'Herbal Book',category:'Botanicals',available:true}
 ],[
  {id:'movement',html:'<p>Circle and walk with ease.</p><p>Strength routine, walk and rest.</p><p>A walk outdoors.</p>'},
  {id:'herbs',html:'<p>Walk past the willow trees.</p>'}
 ]);
 const matches=searchManuscriptPassages(index,'walk','Exercise');
 assert.equal(matches.count,3);
 assert.equal(matches.documentCount,1);
 assert.equal(matches.groups[0].previews.length,3);
 assert.equal(matches.groups[0].previews[0].excerpt,'Circle and walk with ease.');
 assert.equal(searchManuscriptPassages(index,'walk rest').count,1);
 assert.equal(searchManuscriptPassages(index,'wa').count,0);
 assert.equal(searchManuscriptPassages(index,'willow').groups[0].id,'herbs');
 assert.ok(passageSnippet('x'.repeat(70)+'walking'+'y'.repeat(400),['walking']).includes('walking'));
});
test('no part of the excluded private original tracker enters public search index',()=>{
 const id=archiveDocuments.map(x=>x.id);
 assert.equal(id.length,21);
 assert.ok(!id.includes('health-vitality-tracker'));
 assert.throws(()=>buildManuscriptIndex([{id:'a',available:true,title:'A',category:'Misc'}],[]),/Missing/);
});
test('full archived manuscripts produce real searchable passages across all 21 originals',async t=>{
 const path='content/source/SovereignBodyMethod.zip';
 if(!existsSync(path)){t.skip('Approved source archive not available yet');return}
 const zip=await JSZip.loadAsync(await readFile(path));
 const cleaned=[];
 for(const source of archiveDocuments){
   const document=zip.file(source.file);
   assert.ok(document,'Missing approved original '+source.file);
   const {value}=await mammoth.convertToHtml({buffer:await document.async('nodebuffer')});
   const html=sanitizeHtml(value,{allowedTags:['p','h1','h2','h3','h4','h5','h6','blockquote','strong','em','b','i','u','br','hr','ul','ol','li','table','thead','tbody','tr','td','th','sup','sub'],allowedAttributes:{}});
   cleaned.push({id:source.id,html});
 }
 const index=buildManuscriptIndex(archiveDocuments.map(x=>({...x,available:true})),cleaned);
 assert.equal(index.documentCount,21);
 assert.ok(index.passageCount>21);
 assert.ok(index.documents.every(d=>d.passages.length>0));
 assert.ok(searchManuscriptPassages(index,'breathing').documentCount>=1);
 assert.equal(index.documents.some(d=>d.id==='health-vitality-tracker'),false);
});
