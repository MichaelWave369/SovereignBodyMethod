import test from 'node:test';
import assert from 'node:assert/strict';
import {archiveDocuments,archiveCategories,archivalExcluded} from '../src/archiveCatalog.js';
test('exactly 21 unique original manuscripts are allowlisted',()=>{
 assert.equal(archiveDocuments.length,21);
 assert.equal(new Set(archiveDocuments.map(d=>d.id)).size,21);
 assert.equal(new Set(archiveDocuments.map(d=>d.file)).size,21);
 assert.ok(archiveDocuments.every(d=>d.file.endsWith('.docx')&&d.title&&d.category));
});
test('no personal tracker, scaffold, or duplicate goes public',()=>{
 const rejected=new Set(archivalExcluded.map(x=>x.canonical||x.file));
 for (const item of archiveDocuments) assert.ok(!rejected.has(item.file));
 assert.ok(!archiveDocuments.some(d=>/tracker|master|sovereign body method\.docx/i.test(d.file)));
 assert.equal(archivalExcluded.length,7);
});
test('all archive categories exist',()=>{
 assert.ok(archiveCategories.includes('All'));
 assert.ok(archiveDocuments.every(d=>archiveCategories.includes(d.category)));
});
