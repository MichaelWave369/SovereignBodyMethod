import {existsSync} from 'node:fs';
import {readFile,mkdir,rm,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {manuscriptSources,indexFamilies,deriveHerbIndex} from '../src/herbSources.js';
const destination=resolve('public/botanicals');
await rm(destination,{recursive:true,force:true});await mkdir(destination,{recursive:true});
const docs=[];
for(const source of manuscriptSources){
 const path=resolve('public/library/docs/'+source.id+'.json');
 if(!existsSync(path))continue;
 const data=JSON.parse(await readFile(path,'utf8'));
 if(typeof data.html!=='string')throw Error('Missing source manuscript content: '+source.id);
 docs.push({id:source.id,html:data.html});
}
if(docs.length&&docs.length!==manuscriptSources.length)throw Error('Partial botanical archive: import refused');
const terms=deriveHerbIndex(docs);
if(docs.length===5&&terms.length<5)throw Error('Botanical references missing from sources');
await writeFile(resolve(destination,'index.json'),JSON.stringify({
 available:docs.length===5,edition:'Sovereign Body original herb and supplement reading index',
 sources:manuscriptSources,families:indexFamilies,termCount:terms.length,terms,
 notice:'A source mention is not a medical recommendation, confirmed interaction, validated effect, preparation instruction or safe dose. The standalone historic Gumroad supplement stack remains unverified.'
}));
console.log('Sovereign Botanicals:',terms.length,'source-mentioned terms in',docs.length,'original manuscripts');
