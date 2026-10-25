/** Build the browser movement studio directly from the approved ZIP. */
import {existsSync} from 'node:fs';
import {readFile,mkdir,rm,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import JSZip from 'jszip';
import {parseMovementProtocols,parseThreeDaySchedule,PROTOCOL_SOURCE,SCHEDULE_SOURCE} from './movement-parser.mjs';

const archive=resolve('content/source/SovereignBodyMethod.zip');
const target=resolve('public/movement');
await rm(target,{recursive:true,force:true});
await mkdir(target,{recursive:true});
let protocols=[];
let schedule=null;
const available=existsSync(archive);
if(available){
  const zip=await JSZip.loadAsync(await readFile(archive));
  const protocol=zip.file(PROTOCOL_SOURCE);
  const manual=zip.file(SCHEDULE_SOURCE);
  if(!protocol||!manual)throw Error('Approved archive is missing the original exercise protocols or full manual');
  protocols=await parseMovementProtocols(await protocol.async('nodebuffer'));
  schedule=await parseThreeDaySchedule(await manual.async('nodebuffer'));
}
const result={
  edition:'Sovereign Body Method · Original movement and breathing manuscripts',
  authors:'Mikey & Larrina',
  available,protocolCount:protocols.length,
  sourceFiles:[PROTOCOL_SOURCE,SCHEDULE_SOURCE],
  editorialNote:'Technique steps, descriptions, timings and modifications are preserved from the original manuals. Original benefit claims remain attributed to the authors, without independent clinical endorsement.',
  dailyPlanNote:'Daily rotation is an interface mapping of the original repeating 3-day cycle, not an individualized prescription or 30 separately authored workouts.',
  protocols,schedule
};
await writeFile(resolve(target,'studio.json'),JSON.stringify(result));
console.log('Sovereign Movement:',protocols.length,'original practices,',schedule?.cycles.length||0,'session templates');
