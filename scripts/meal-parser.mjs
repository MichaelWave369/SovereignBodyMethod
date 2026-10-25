/**
 * Strict, read-only importer for the four ORIGINAL weekly recipe manuscripts.
 * Reads OOXML paragraphs and two-column ingredient/instruction tables.
 * The compact "Complete_30Day_Recipes" appendix is intentionally NOT used:
 * it summarizes days 5-30 instead of providing all full recipes.
 */
import JSZip from 'jszip';
import { DOMParser } from '@xmldom/xmldom';

export const WEEK_FILES = [
  { name:'Week1_Recipes.docx',first:1,last:7 },
  { name:'Week2_Recipes.docx',first:8,last:14 },
  { name:'Week3_Recipes.docx',first:15,last:21 },
  { name:'Week4_Recipes.docx',first:22,last:30 },
];
export const MEAL_TYPES=['smoothie','salad','dinner'];

const elementChildren = (node,name) => Array.from({length:node?.childNodes?.length??0},(_,i)=>node.childNodes.item(i))
  .filter(child=>child.nodeType===1 && (!name||child.nodeName===name));
const listByTag = (node,name) => {
  const nodes=node?.getElementsByTagName(name);
  return Array.from({length:nodes?.length??0},(_,i)=>nodes.item(i));
};
const textFromParagraph = p => listByTag(p,'w:t').map(n=>n.textContent??'').join('').trim();
const cellLines = (cell,heading) => {
  const lines=listByTag(cell,'w:p').map(textFromParagraph).filter(Boolean);
  if (lines[0]?.trim().toLowerCase()!==heading) {
    throw new Error('Expected '+heading+' table column, found '+JSON.stringify(lines[0]));
  }
  return lines.slice(1).map(line=>line.replace(/^\s*•\s*/,'').replace(/^\s*\d+\.\s*/,'').trim()).filter(Boolean);
};

export async function parseWeeklyDocx(buffer,sourceFile){
  const inner=await JSZip.loadAsync(buffer);
  const xmlFile=inner.file('word/document.xml');
  if (!xmlFile) throw Error('Missing word/document.xml: '+sourceFile);
  const xml=await xmlFile.async('string');
  let parseErrors=[];
  const dom=new DOMParser({
    errorHandler:{warning:()=>{},error:m=>parseErrors.push(m),fatalError:m=>parseErrors.push(m)},
  }).parseFromString(xml,'application/xml');
  if(parseErrors.length)throw Error('Invalid Word XML in '+sourceFile+': '+parseErrors.join('; '));
  const body=listByTag(dom,'w:body')[0];
  if(!body)throw Error('No body in '+sourceFile);
  const recipes=[];let recipe=null;
  for(const block of elementChildren(body)){
    if(block.nodeName==='w:p'){
      const line=textFromParagraph(block);
      const match=/^Day\s+(\d+)\s+(SMOOTHIE|SALAD|DINNER):\s*(.+)$/i.exec(line);
      if(match){
        const day=Number(match[1]),type=match[2].toLowerCase();
        recipe={id:`day-${day}-${type}`,day,type,title:match[3].trim(),
          prepTime:'',servings:'',variations:[],ingredients:[],instructions:[],
          sourceFile,sourceTable:0};
        recipes.push(recipe);
      }else if(recipe && /^Prep Time:\s*/i.test(line)){
        const details=/^Prep Time:\s*(.*?)\s*\|\s*Servings:\s*(.+)$/i.exec(line);
        if(!details)throw Error('Unexpected prep/servings format '+sourceFile+' day '+recipe.day+': '+line);
        recipe.prepTime=details[1].trim();
        recipe.servings=details[2].trim();
      }else if(recipe && /^Variations:\s*/i.test(line)){
        recipe.variations=line.replace(/^Variations:\s*/i,'').split(/\s+\|\s+/).map(v=>v.trim()).filter(Boolean);
      }
    }else if(block.nodeName==='w:tbl' && recipe && !recipe.ingredients.length){
      const row=listByTag(block,'w:tr')[0];
      const cells=elementChildren(row,'w:tc');
      if(cells.length!==2)throw Error('Expected two-column recipe table: '+sourceFile+' day '+recipe.day);
      recipe.ingredients=cellLines(cells[0],'ingredients');
      recipe.instructions=cellLines(cells[1],'instructions');
      recipe.sourceTable=recipes.length;
    }
  }
  for(const r of recipes){
    if(!r.title||!r.ingredients.length||!r.instructions.length||!r.prepTime||!r.servings||!r.variations.length){
      throw Error('Incomplete recipe in '+sourceFile+': '+r.id);
    }
  }
  return recipes;
}

export function validate30DayPlan(recipes){
  if(recipes.length!==90)throw Error('Expected exactly 90 original recipes, found '+recipes.length);
  const ids=new Set();
  for(let day=1;day<=30;day++){
    for(const type of MEAL_TYPES){
      const id=`day-${day}-${type}`;
      if(ids.has(id)||recipes.filter(r=>r.id===id).length!==1)throw Error('Missing or repeated recipe '+id);
      ids.add(id);
    }
  }
  if(recipes.some(r=>!r.ingredients?.length||!r.instructions?.length||!r.sourceFile))throw Error('Incomplete recipe source');
  return true;
}
