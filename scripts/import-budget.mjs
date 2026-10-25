import {existsSync} from 'node:fs';
import {readFile,rm,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import JSZip from 'jszip';
import {parseOriginalFoodBudgets,BUDGET_SOURCE} from './budget-parser.mjs';

const archive=resolve('content/source/SovereignBodyMethod.zip');
const destination=resolve('public/budget');
await rm(destination,{recursive:true,force:true});
await mkdir(destination,{recursive:true});
let profiles=[];
const available=existsSync(archive);
if(available){
 const zip=await JSZip.loadAsync(await readFile(archive));
 const source=zip.file(BUDGET_SOURCE);
 if(!source)throw Error('Approved source ZIP missing '+BUDGET_SOURCE);
 profiles=await parseOriginalFoodBudgets(await source.async('nodebuffer'));
}
await writeFile(resolve(destination,'tiers.json'),JSON.stringify({
 available,
 sourceFile:BUDGET_SOURCE,
 sourceNote:'Historical 2026 manuscript food-budget figures; not contemporary store price quotes, medical advice, or verified standalone Gumroad product packaging.',
 foodOnly:true,
 profiles
}));
console.log('Sovereign Budget:',profiles.length,'original historical food-budget plans imported');
