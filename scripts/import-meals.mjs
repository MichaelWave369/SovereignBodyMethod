import { readFile,mkdir,writeFile,rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import JSZip from 'jszip';
import { parseWeeklyDocx, WEEK_FILES,validate30DayPlan } from './meal-parser.mjs';

const zipPath=resolve('content/source/SovereignBodyMethod.zip');
const destination=resolve('public/meals');
await rm(destination,{recursive:true,force:true});
await mkdir(destination,{recursive:true});
let recipes=[];
let hasSource=existsSync(zipPath);
if(hasSource){
  const outer=await JSZip.loadAsync(await readFile(zipPath));
  for(const week of WEEK_FILES){
    const entry=outer.file(week.name);
    if(!entry)throw Error('Missing original weekly recipe source: '+week.name);
    const parsed=await parseWeeklyDocx(await entry.async('nodebuffer'),week.name);
    if(parsed.length!==(week.last-week.first+1)*3||parsed.some(r=>r.day<week.first||r.day>week.last)){
      throw Error('Source weekly day range mismatch: '+week.name);
    }
    recipes.push(...parsed);
  }
  validate30DayPlan(recipes);
}
await writeFile(resolve(destination,'recipes.json'),JSON.stringify({
  edition:'Original weekly recipe documents, October 2026 archive',
  attribution:'The Sovereign Body Method · Mikey & Larrina',
  sourceFiles:WEEK_FILES.map(w=>w.name),
  available:hasSource,
  recipeCount:recipes.length,
  baseServings:'2 people',
  sourceNote:'Prep times, serving sizes, ingredient measures, procedures and variations are transcribed from the original weekly DOCX files. Number and bullet glyphs are represented by the interface.',
  recipes
}));
console.log('Original meal planner:',recipes.length,'recipes for',new Set(recipes.map(r=>r.day)).size,'days');
