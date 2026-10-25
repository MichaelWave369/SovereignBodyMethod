/** Builds a source-attributed exploration index from the already approved HTML archive. */
import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {extractFrequencyMentions,extractCrystalMentions} from '../src/soundSources.js';

const out=resolve('public/sound');
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
const sources=[
  {id:'reference',file:'Reference_Appendices.docx',title:'Reference Appendices'},
  {id:'crystals',file:'Crystal_Energy_Work_Complete_Guide.docx',title:'Crystal & Energy Work'},
  {id:'channels',file:'CHAPTER_13_Sacred_Channels_PART8.docx',title:'Sacred Channels'}
];
const manuscripts=[];
for(const s of sources){
  const path=resolve('public/library/docs/'+s.id+'.json');
  if(!existsSync(path))continue;
  const d=JSON.parse(await readFile(path,'utf8'));
  if(typeof d.html!=='string')throw Error('Source HTML missing: '+s.id);
  manuscripts.push({...s,html:d.html});
}
if(manuscripts.length!==0&&manuscripts.length!==3){
  throw Error('Sound/Crystal archive must be complete or absent, not partly published');
}
const ref=manuscripts.find(x=>x.id==='reference');
const crystals=manuscripts.find(x=>x.id==='crystals');
const frequencies=extractFrequencyMentions(ref?.html||'');
const crystalMentions=extractCrystalMentions(crystals?.html||'');
const output={
  available:manuscripts.length===3,
  derivedFrom:['Reference_Appendices.docx','Crystal_Energy_Work_Complete_Guide.docx','CHAPTER_13_Sacred_Channels_PART8.docx'],
  sourceFrequencies:frequencies,
  sourceCrystals:crystalMentions,
  notice:'Frequency and crystal mentions are text occurrences in the original manuscripts, NOT clinical efficacy claims. Their source lines are excerpted without endorsing the statements. The exact historic six-ritual Gumroad release was not verified.',
  note:'Audible tone player is a new, optional electronic demonstration; it is not an original sound recording, entrainment method or medical treatment.'
};
await writeFile(resolve(out,'index.json'),JSON.stringify(output));
console.log('Sovereign Sound:',frequencies.length,'documented Hz mentions,',crystalMentions.length,'crystal keywords in originals');
