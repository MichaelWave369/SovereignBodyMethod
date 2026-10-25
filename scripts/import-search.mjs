/** Generate the full-text atlas from the existing 21 approved public reader JSON files. */
import {readFile,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {buildManuscriptIndex} from '../src/archiveSearch.js';

const root=resolve('public/library');
const catalogPath=resolve(root,'catalog.json');
if(!existsSync(catalogPath))throw Error('Library catalog must be generated first');
const catalog=JSON.parse(await readFile(catalogPath,'utf8'));
const docs=[];
for(const record of catalog.documents||[]){
 if(!record.available)continue;
 const filename=resolve(root,'docs',record.id+'.json');
 if(!existsSync(filename))throw Error('Original readable document missing: '+record.id);
 const data=JSON.parse(await readFile(filename,'utf8'));
 docs.push({id:record.id,html:data.html});
}
const index=buildManuscriptIndex(catalog.documents||[],docs);
if(catalog.sourceArchivePresent&&index.documentCount!==21){
 throw Error('Approved original archive should contain all 21 manuscript readers');
}
const output=JSON.stringify(index);
if(Buffer.byteLength(output,'utf8')>12*1024*1024)throw Error('Full-text atlas exceeded 12 MiB; review before publication');
await writeFile(resolve(root,'search-index.json'),output,'utf8');
console.log('Sovereign Source Atlas:',index.documentCount,'original documents,',index.passageCount,'searchable passages,',
 Math.ceil(Buffer.byteLength(output,'utf8')/1024),'KiB');
