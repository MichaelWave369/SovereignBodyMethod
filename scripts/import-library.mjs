/**
 * Build-time importer for the authors' DOCX source archive.
 *
 * Put the original uploaded ZIP at content/source/SovereignBodyMethod.zip
 * (repository source, NOT public/). npm run build creates browser-readable
 * HTML JSON plus downloadable original DOCX for 21 selected canonical files.
 *
 * The archive is explicitly allowlisted. Family-specific personal tracker,
 * alternate copies and incomplete scaffold masters never enter public/.
 */
import { readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import sanitizeHtml from 'sanitize-html';
import { archiveDocuments } from '../src/archiveCatalog.js';

const zipPath = resolve('content/source/SovereignBodyMethod.zip');
const outDir = resolve('public/library');
const docsDir = join(outDir,'docs');
const sourceDir = join(outDir,'originals');
await rm(outDir,{recursive:true,force:true});
await mkdir(docsDir,{recursive:true});
await mkdir(sourceDir,{recursive:true});
const zipped = existsSync(zipPath) ? await JSZip.loadAsync(await readFile(zipPath)) : null;
const published = [];
const seen = new Set();
const warnings = [];
for (const doc of archiveDocuments) {
  const entry = zipped?.file(doc.file);
  if (!entry) {
    published.push({...doc,available:false,wordCount:null});
    if (zipped) warnings.push('Missing allowlisted file: '+doc.file);
    continue;
  }
  if (seen.has(doc.id)) throw new Error('Duplicate archive ID: '+doc.id);
  seen.add(doc.id);
  const raw=await entry.async('nodebuffer');
  if (raw.length>15_000_000) throw new Error('Suspiciously large document: '+doc.file);
  const {value:converted,messages} = await mammoth.convertToHtml(
    {buffer:raw},
    {ignoreEmptyParagraphs:false}
  );
  const clean = sanitizeHtml(converted,{
    allowedTags:['p','h1','h2','h3','h4','h5','h6','blockquote','strong','em','b','i','u','br','hr','ul','ol','li','table','thead','tbody','tr','td','th','sup','sub'],
    allowedAttributes:{},
    disallowedTagsMode:'discard'
  });
  // Browser search text; harmless markup removed in the browser-facing copy.
  const searchText=clean.replace(/<[^>]*>/g,' ').replace(/&(?:[a-z]+|#\d+);/gi,' ').replace(/\s+/g,' ').trim();
  const slug=doc.id;
  const destination=join(sourceDir,slug+'.docx');
  await writeFile(destination,raw);
  await writeFile(join(docsDir,slug+'.json'),JSON.stringify({
    title:doc.title,html:clean,filename:doc.file,notice:doc.caution??null,
    converterNotes:messages.map(m=>m.message).slice(0,20)
  }));
  published.push({...doc,available:true,wordCount:searchText.split(/\s+/).filter(Boolean).length,
    searchText:searchText.toLowerCase().slice(0,100000)});
}
await writeFile(join(outDir,'catalog.json'),JSON.stringify({
  generatedAt:new Date().toISOString(),sourceArchivePresent:!!zipped,
  countAvailable:published.filter(d=>d.available).length,documents:published
},null,2));
console.log('Sovereign archive:', published.filter(d=>d.available).length,'of',published.length,'documents available');
if (!zipped) console.log('No source ZIP yet. Ready-to-import catalog is live; no invented source files.');
if (warnings.length) { console.warn(warnings.join('\n')); process.exitCode=1; }
