import {existsSync} from 'node:fs';
import {readFile,mkdir,rm,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import JSZip from 'jszip';
import {extractWaterSchedule,SOURCE_FILE} from './water-parser.mjs';

const archive=resolve('content/source/SovereignBodyMethod.zip');
const directory=resolve('public/hydration');
await rm(directory,{recursive:true,force:true});
await mkdir(directory,{recursive:true});
let days=[];
const available=existsSync(archive);
if(available){
 const zip=await JSZip.loadAsync(await readFile(archive));
 const document=zip.file(SOURCE_FILE);
 if(!document)throw Error('Approved source is missing '+SOURCE_FILE);
 days=await extractWaterSchedule(await document.async('nodebuffer'));
}
const result={
 available,dayCount:days.length,
 edition:'Original Fruit & Herb Infused Water · 28-Day Rotating Schedule',
 sourceFile:SOURCE_FILE,
 attribution:'The Sovereign Body Method · Mikey & Larrina',
 note:'Blend names, weekdays and notes transcribed from the original Word schedule; the app does not invent ingredients, recipes or health benefits. Read the complete original guide for preparation and storage instructions.',
 days
};
await writeFile(resolve(directory,'schedule.json'),JSON.stringify(result));
console.log('Sovereign Hydration:',days.length,'original schedule days across',new Set(days.map(x=>x.week)).size,'weeks');
