/**
 * Runs AFTER Vite and service-worker generation (npm postbuild).
 * A green build must contain actual, complete, authentic downloadable originals.
 * This is an artifact contract, not a substitute for browser accessibility QA.
 */
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import {archiveDocuments} from '../src/archiveCatalog.js';
import {verifySourceCrosswalk,verifyInternalAnchors,verifyPublishedCounts} from './launch-contract.mjs';
import {BASE,planFromFiles} from './offline-build.mjs';

const repo=resolve('.');
const dist=resolve(repo,'dist');
async function bytes(p){return readFile(join(dist,p))}
async function json(p){return JSON.parse(await bytes(p))}
async function list(folder){return readdir(join(dist,folder))}
const files=await readdir(resolve(repo,'src'));
const jsx=await Promise.all(files.filter(x=>x.endsWith('.jsx')).map(x=>readFile(resolve(repo,'src',x),'utf8')));
const references=verifySourceCrosswalk();
const links=verifyInternalAnchors(jsx);
const assets={
 catalog:await json('library/catalog.json'),
 recipes:await json('meals/recipes.json'),
 movement:await json('movement/studio.json'),
 water:await json('hydration/schedule.json'),
 budget:await json('budget/tiers.json'),
 sound:await json('sound/index.json'),
 botanicals:await json('botanicals/index.json'),
 atlas:await json('library/search-index.json')
};
const counts=verifyPublishedCounts(assets);

const catalogIds=assets.catalog.documents.map(d=>d.id).sort();
const atlasIds=assets.atlas.documents.map(d=>d.id).sort();
const approvedIds=archiveDocuments.map(d=>d.id).sort();
assert.deepEqual(catalogIds,approvedIds,'Public reader catalog is not the exact approved 21');
assert.deepEqual(atlasIds,approvedIds,'Full-text corpus differs from approved originals');

const originals=await list('library/originals');
assert.deepEqual(originals.sort(),approvedIds.map(x=>x+'.docx').sort(),
 'Unexpected, missing or excluded original Word files in published dist');

// Verify that every published original Word file is byte-identical to the
// exact creator-approved source ZIP. Conversion never rewrites the download.
const zip=await JSZip.loadAsync(await readFile(resolve(repo,'content/source/SovereignBodyMethod.zip')));
let verifiedBytes=0;
for(const doc of archiveDocuments){
 const source=zip.file(doc.file);
 if(!source)throw Error('Approved ZIP missing original: '+doc.file);
 const actual=await bytes('library/originals/'+doc.id+'.docx');
 const fromZip=await source.async('nodebuffer');
 if(!actual.equals(fromZip))throw Error('Original download differs from source archive: '+doc.id);
 verifiedBytes+=actual.length;
 const reader=await json('library/docs/'+doc.id+'.json');
 if(reader.filename!==doc.file||typeof reader.html!=='string'||reader.html.length<3){
   throw Error('Readable source document mismatches approved original: '+doc.id);
 }
}
const indexed=new Set(assets.catalog.documents.map(x=>x.id));
if(assets.atlas.documents.some(x=>!indexed.has(x.id)))throw Error('Full-text source has unauthorized book');

// GitHub Pages static site contract. The 21 originals must be downloadable
// without accidentally precaching the optional Word assets.
const worker=(await bytes('sw.js')).toString('utf8');
const coreMatch=worker.match(/const CORE_LIST=(\[[^;]*\]);/);
const wordMatch=worker.match(/const DOCX_LIST=(\[[^;]*\]);/);
if(!coreMatch||!wordMatch)throw Error('Offline worker manifest not generated');
const core=JSON.parse(coreMatch[1]),words=JSON.parse(wordMatch[1]);
if(words.length!==21||core.some(url=>url.endsWith('.docx')))throw Error('Offline Word assets were not kept optional');
for(const path of ['index.html','site.webmanifest','library/catalog.json',
 'library/search-index.json','meals/recipes.json','movement/studio.json',
 'hydration/schedule.json','budget/tiers.json','sound/index.json',
 'botanicals/index.json','robots.txt','sitemap.xml']){
 if(!core.includes(BASE+path))throw Error('Required offline asset was not cached: '+path);
}
for(const id of approvedIds){
 if(!core.includes(BASE+'library/docs/'+id+'.json'))throw Error('Offline reader missing: '+id);
 if(!words.includes(BASE+'library/originals/'+id+'.docx'))throw Error('Optional source Word file missing: '+id);
}

// Actual asset route validation, not just source import counts.
const manifest=await json('site.webmanifest');
if(manifest.start_url!==BASE||manifest.scope!==BASE)throw Error('Installable PWA base/scope changed');
const html=(await bytes('index.html')).toString('utf8');
const robots=(await bytes('robots.txt')).toString('utf8');
const sitemap=(await bytes('sitemap.xml')).toString('utf8');
const canonical='https://michaelwave369.github.io'+BASE;
if(!html.includes('rel="canonical" href="'+canonical+'"')||
 !sitemap.includes('<loc>'+canonical+'</loc>')||
 !robots.includes('Sitemap: '+canonical+'sitemap.xml')){
 throw Error('Published discovery metadata differs from deployed canonical URL');
}
const indexStat=await stat(join(dist,'library/search-index.json'));
if(indexStat.size>12*1024*1024)throw Error('Full-text public index is unexpectedly large');
if(archivalSafetyFailure(originals))throw Error('A private/scaffold source is present in published dist');

console.log('PUBLIC LAUNCH GATE PASS');
console.log(' - '+counts.originals+' source-verified Word downloads ('+Math.ceil(verifiedBytes/1024)+' KiB), 21 HTML readers');
console.log(' - '+counts.recipes+' recipes, '+counts.practices+' movement practices, '+counts.waterDays+' water days');
console.log(' - '+counts.passages+' source passages; '+references.releases+' original release ledger entries');
console.log(' - '+links.checkedLinks+' public section links resolve to '+links.anchors+' source anchors');
console.log(' - '+core.length+' core offline assets, '+words.length+' optional original Word downloads');
console.log(' - Canonical public metadata, sitemap, web manifest and service worker agree');

function archivalSafetyFailure(filenames){
 return filenames.some(name=>/health.*tracker|master|\.zip$/i.test(name));
}
