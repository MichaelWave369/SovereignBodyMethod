/** Public-launch contracts shared by unit tests and the build audit. */
import {archiveDocuments,archivalExcluded} from '../src/archiveCatalog.js';
import {releaseCoverage} from '../src/releaseCoverage.js';
import {entryPaths} from '../src/getStartedPaths.js';

const slug=/^[a-z][a-z0-9-]*$/;
export function verifySourceCrosswalk(){
 if(archiveDocuments.length!==21||releaseCoverage.length!==9)throw Error('Unexpected approved archive or release ledger size');
 const docs=new Map(archiveDocuments.map(doc=>[doc.id,doc]));
 if(docs.size!==21)throw Error('Duplicate manuscript identifiers');
 for(const doc of archiveDocuments){
  if(!slug.test(doc.id)||!doc.file.endsWith('.docx'))throw Error('Invalid original source: '+doc.id);
 }
 const excluded=new Set(archivalExcluded.map(item=>item.canonical||item.file));
 for(const doc of archiveDocuments)if(excluded.has(doc.file))throw Error('Private/duplicate source became public: '+doc.file);
 for(const release of releaseCoverage){
  if(!release.sources.length||!release.anchor?.startsWith('#'))throw Error('Invalid storefront source crosswalk: '+release.id);
  for(const file of release.sources){
   if(!docs.has(file.id))throw Error('Missing downloadable original for release '+release.id+': '+file.id);
  }
 }
 return {approved:docs.size,releases:releaseCoverage.length,linkedOriginals:new Set(releaseCoverage.flatMap(x=>x.sources.map(s=>s.id))).size};
}
export function verifyInternalAnchors(components){
 if(!Array.isArray(components)||components.length===0)throw Error('Expected React source components');
 const content=components.join('\n');
 const ids=new Set(Array.from(content.matchAll(/\bid="([a-z][a-z0-9-]*)"/g),m=>m[1]));
 const literalLinks=Array.from(content.matchAll(/\bhref="#([a-z][a-z0-9-]*)"/g),m=>m[1]);
 const derivedLinks=[
  ...releaseCoverage.map(x=>x.anchor.slice(1)),
  ...entryPaths.flatMap(x=>x.steps.map(s=>s.href.slice(1)))
 ];
 const links=[...new Set([...literalLinks,...derivedLinks])];
 const missing=links.filter(id=>!ids.has(id));
 if(missing.length)throw Error('Broken public anchor(s): '+missing.join(', '));
 if(!ids.has('daily')||!ids.has('start-here')||!ids.has('library'))throw Error('Missing primary entry sections');
 return {anchors:ids.size,checkedLinks:links.length};
}
export function verifyPublishedCounts(assets){
 const {catalog,recipes,movement,water,budget,sound,botanicals,atlas}=assets;
 if(catalog?.countAvailable!==21||catalog?.documents?.length!==21||
    catalog.documents.some(d=>!d.available))throw Error('The published library must contain all 21 approved manuscripts');
 const checks=[
  [recipes?.recipeCount,90,'original recipes'],
  [movement?.protocolCount,23,'movement practices'],
  [water?.days?.length,28,'infused-water days'],
  [budget?.profiles?.length,3,'historical food budgets'],
  [sound?.sourceFrequencies?.length,8,'original frequency mentions'],
  [sound?.sourceCrystals?.length,13,'crystal mentions'],
  [botanicals?.terms?.length,34,'source-mentioned botanicals/supplements'],
  [atlas?.documentCount,21,'source-indexed manuscripts']
 ];
 for(const [actual,expected,label] of checks){
  if(actual!==expected)throw Error('Public build changed '+label+': expected '+expected+', got '+actual);
 }
 if(atlas.passageCount<5000||atlas.documents?.length!==21)throw Error('Search atlas incomplete');
 const known=new Set(archiveDocuments.map(d=>d.id));
 if(catalog.documents.some(doc=>!known.has(doc.id))||atlas.documents.some(doc=>!known.has(doc.id)))throw Error('Unapproved book in public catalog/search');
 const recipeIds=new Set(recipes.recipes.map(x=>x.id));
 if(recipeIds.size!==90||recipes.recipes.some(x=>!Number.isInteger(x.day)||x.day<1||x.day>30))throw Error('Published meal list has duplicate or invalid days');
 const days=new Set(water.days.map(x=>x.day));
 if(days.size!==28||[...days].some(n=>!Number.isInteger(n)||n<1||n>28))throw Error('Original water day boundary changed');
 return {originals:21,recipes:90,practices:23,waterDays:28,passages:atlas.passageCount};
}
