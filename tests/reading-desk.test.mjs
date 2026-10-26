import test from 'node:test';
import assert from 'node:assert/strict';
import {READING_DESK_KEY,READING_DESK_LIMIT,validateReadingDesk,validateReadingLocation,
 readReadingDesk,readingBookmarkCount,saveReadingLocation,toggleReadingBookmark,
 deleteReadingBookmark} from '../src/readingDesk.js';
const where=(position,probe='Original passage text')=>({position,probe,ratio:position/100});
test('reading position and passage bookmarks are locally indexed by approved manuscript ID',()=>{
 const start={};
 const one=saveReadingLocation(start,'core-manual',where(12));
 assert.equal(one['core-manual'].last.position,12);
 const two=toggleReadingBookmark(one,'core-manual',where(15));
 assert.equal(readingBookmarkCount(two),1);
 const three=toggleReadingBookmark(two,'core-manual',where(15));
 assert.equal(readingBookmarkCount(three),0);
 assert.equal(one['core-manual'].last.position,12);
 const stored=readReadingDesk(JSON.stringify(two));
 assert.deepEqual(stored,two);
 assert.equal(READING_DESK_KEY,'sovereign-body-method.library.reading-desk.v1');
});
test('a distinct bookmark can be removed without erasing saved reading position',()=>{
 const one=toggleReadingBookmark(saveReadingLocation({},'week-one',where(12)), 'week-one', where(19));
 const two=deleteReadingBookmark(one,'week-one',19,'Original passage text');
 assert.equal(two['week-one'].bookmarks.length,0);
 assert.equal(two['week-one'].last.position,12);
});
test('read-only archive IDs and strict source passage constraints prevent unsafe backup values',()=>{
 assert.throws(()=>saveReadingLocation({},'private-health-tracker',where(12)));
 assert.throws(()=>validateReadingDesk({'private-health-tracker':{last:where(12),bookmarks:[]}}));
 assert.throws(()=>validateReadingLocation({position:-2,probe:'valid',ratio:0}));
 assert.throws(()=>validateReadingLocation({position:0,probe:'valid',ratio:3}));
 assert.throws(()=>validateReadingLocation({position:0,probe:'<script>\n',ratio:.5}));
 assert.throws(()=>validateReadingLocation({position:0,probe:'a',ratio:.5}));
 assert.throws(()=>validateReadingLocation({position:0,probe:'valid',ratio:.5,html:'danger'}));
 assert.deepEqual(readReadingDesk('not json'),{});
});
test('ten per book bookmark maximum and no duplicate entries in import',()=>{
 let desk={};
 for(let n=0;n<READING_DESK_LIMIT;n++)desk=toggleReadingBookmark(desk,'movement',where(n));
 assert.equal(readingBookmarkCount(desk),10);
 assert.throws(()=>toggleReadingBookmark(desk,'movement',where(11)),/Ten saved passages/);
 const bad={'movement':{last:null,bookmarks:[where(1),where(1)]}};
 assert.throws(()=>validateReadingDesk(bad),/Duplicate/);
});
