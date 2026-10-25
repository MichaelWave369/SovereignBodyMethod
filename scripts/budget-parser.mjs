/** Exact-source parser for historical food budget tiers, not supplement recommendations. */
import JSZip from 'jszip';
import {DOMParser} from '@xmldom/xmldom';
export const BUDGET_SOURCE='Reference_Appendices.docx';

export async function parseOriginalFoodBudgets(buffer){
  const zip=await JSZip.loadAsync(buffer);
  const part=zip.file('word/document.xml');
  if(!part)throw Error('Reference Appendices has no Word document XML');
  const errors=[];
  const xml=new DOMParser({errorHandler:{
    warning:()=>{},error:e=>errors.push(e),fatalError:e=>errors.push(e)
  }}).parseFromString(await part.async('string'),'application/xml');
  if(errors.length)throw Error('Malformed reference appendix XML');
  const paragraphs=Array.from(xml.getElementsByTagName('w:p'))
    .map(node=>Array.from(node.getElementsByTagName('w:t')).map(t=>t.textContent||'').join('').trim()).filter(Boolean);
  const start=paragraphs.indexOf('GROCERY BUDGET GUIDE');
  const end=paragraphs.indexOf('HERBAL COMBINATIONS & ESSENTIAL OILS');
  if(start<0||end<=start)throw Error('Missing source grocery budget section');
  const lines=paragraphs.slice(start+1,end);
  const profiles=[];
  let active=null,collection=false;
  for(const line of lines){
    const heading=/^Version ([1-3]): (.+) \(\$(\d+)-(\d+)\/month\)$/.exec(line);
    if(heading){
      active={id:'tier'+heading[1],name:heading[2],historicMonthlyHeadline:[Number(heading[3]),Number(heading[4])],
        summary:'',shoppingNotes:[],historicWeeklyFoodBudget:null,sourceFile:BUDGET_SOURCE};
      profiles.push(active);collection=false;continue;
    }
    if(!active)continue;
    if(!active.summary){active.summary=line;continue;}
    if(/^(Shopping Strategy|RV Essentials|Priority Organic):$/.test(line)){collection=true;continue;}
    const weekly=/^Weekly Food Budget: \$(\d+)-(\d+)$/.exec(line);
    if(weekly){active.historicWeeklyFoodBudget=[Number(weekly[1]),Number(weekly[2])];collection=false;continue;}
    if(line.startsWith('Monthly Supplement Budget:')||line.startsWith('Priority supplements:')||line.startsWith('Smart stack:')||line.startsWith('Complete stack:')){collection=false;continue;}
    if(collection)active.shoppingNotes.push(line);
  }
  if(profiles.length!==3||profiles.some(p=>!p.summary||!p.historicWeeklyFoodBudget||!p.shoppingNotes.length)){
    throw Error('Incomplete or changed historical food budget source');
  }
  for(const profile of profiles){
    const [low,high]=profile.historicWeeklyFoodBudget;
    if(low<=0||high<low)throw Error('Invalid source price range');
  }
  return profiles;
}
