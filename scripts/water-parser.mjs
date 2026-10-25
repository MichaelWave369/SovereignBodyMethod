/** Extract the exact four 7-day water schedule tables from the original Word guide. */
import JSZip from 'jszip';
import {DOMParser} from '@xmldom/xmldom';
export const SOURCE_FILE='Fruit_Herb_Infused_Water_Complete_Guide.docx';
const WEEKDAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const children=(node,name)=>Array.from(node?.childNodes||[]).filter(n=>n.nodeType===1&&(!name||n.nodeName===name));
const descendants=(node,name)=>Array.from(node?.getElementsByTagName(name)||[]);
const text=node=>descendants(node,'w:t').map(n=>n.textContent||'').join('').trim();

export async function extractWaterSchedule(buffer){
 const zip=await JSZip.loadAsync(buffer);
 const part=zip.file('word/document.xml');
 if(!part)throw Error('Missing Word XML in original infused-water guide');
 let errors=[];
 const xml=new DOMParser({errorHandler:{
  warning:()=>{},error:e=>errors.push(e),fatalError:e=>errors.push(e)
 }}).parseFromString(await part.async('string'),'application/xml');
 if(errors.length)throw Error('Invalid Word XML in original infused-water guide');
 const body=descendants(xml,'w:body')[0];
 if(!body)throw Error('No Word body');
 const tables=children(body,'w:tbl');
 if(tables.length!==4)throw Error('Expected 4 original infused-water calendar tables; found '+tables.length);
 const days=[];
 for(let w=0;w<4;w++){
  const rows=children(tables[w],'w:tr');
  if(rows.length!==8)throw Error('Expected header + 7 weekdays in week '+(w+1));
  for(let i=0;i<rows.length;i++){
   const cells=children(rows[i],'w:tc');
   if(cells.length!==3)throw Error('Expected 3 source columns in week '+(w+1));
   const vals=cells.map(cell=>descendants(cell,'w:p').map(text).filter(Boolean).join(' ').trim());
   if(i===0){
    if(vals.join('|')!=='Day|Fruit Blend|Notes')throw Error('Original water table columns changed');
    continue;
   }
   if(vals[0]!==WEEKDAYS[i-1])throw Error('Unexpected weekday in source calendar: '+vals[0]);
   if(!vals[1]||!vals[2])throw Error('Missing original blend or notes in week '+(w+1));
   days.push({
    day:w*7+i,week:w+1,weekday:vals[0],
    blend:vals[1],notes:vals[2],sourceFile:SOURCE_FILE
   });
  }
 }
 if(days.length!==28||new Set(days.map(x=>x.day)).size!==28)throw Error('Expected exactly 28 source water days');
 return days;
}
