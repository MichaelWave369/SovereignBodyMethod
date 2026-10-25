/**
 * Strict provenance parser for the author-supplied Detailed Exercise Protocols
 * and the Weekly Workout Structure in the original 30-Day Manual.
 *
 * Extracts original paragraph wording, table rows and 3-day sample session
 * rhythm. It never generates new exercises or turns original benefit claims into
 * independent scientific evidence.
 */
import JSZip from 'jszip';
import {DOMParser} from '@xmldom/xmldom';

export const PROTOCOL_SOURCE='Detailed_Exercise_Protocols.docx';
export const SCHEDULE_SOURCE='30_Day_Holistic_Health_Manual.docx';

export const MOVEMENT_CATEGORIES=[
  'Opening Practices','Tibetan Rites','Qigong','Tai Chi','Modern Movement'
];
const children=(n,name)=>Array.from(n?.childNodes||[]).filter(c=>c.nodeType===1&&(!name||c.nodeName===name));
const descendants=(n,name)=>Array.from(n?.getElementsByTagName(name)||[]);
const paragraph=n=>descendants(n,'w:t').map(v=>v.textContent||'').join('').trim();
const stripPrefix=line=>line.replace(/^\s*(?:(?:\d+)[.)]|[✓•●‣])\s*/u,'').trim();
const slug=value=>value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
async function documentBody(buffer,name){
  const outer=await JSZip.loadAsync(buffer);
  const document=outer.file('word/document.xml');
  if(!document)throw Error('Missing Word document XML: '+name);
  let errors=[];
  const xml=new DOMParser({errorHandler:{
    warning:()=>{},
    error:e=>errors.push(e),
    fatalError:e=>errors.push(e)
  }}).parseFromString(await document.async('string'),'application/xml');
  if(errors.length)throw Error('Invalid Word XML: '+name);
  const body=descendants(xml,'w:body')[0];
  if(!body)throw Error('Missing document body: '+name);
  return body;
}
function extractTableRows(table,name){
  const rows=children(table,'w:tr');
  if(rows.length!==3)throw Error('Expected 3-table-row original protocol for '+name);
  const headings=['STEP-BY-STEP INSTRUCTIONS','BENEFITS','MODIFICATIONS & TIPS'];
  return rows.map((row,i)=>{
    const cells=children(row,'w:tc');
    if(cells.length!==1)throw Error('Expected single-column protocol table for '+name);
    const lines=descendants(cells[0],'w:p').map(paragraph).filter(Boolean);
    if(lines[0]!==headings[i])throw Error('Wrong source protocol row '+name+': '+lines[0]);
    const entries=lines.slice(1).map(stripPrefix).filter(Boolean);
    if(!entries.length)throw Error('Empty original protocol '+name+', '+headings[i]);
    return entries;
  });
}

export async function parseMovementProtocols(buffer){
  const body=await documentBody(buffer,PROTOCOL_SOURCE);
  const protocols=[];
  const preceding=[];
  let category='';
  let lastHeading='';
  for(const node of children(body)){
    if(node.nodeName==='w:p'){
      const line=paragraph(node);
      if(!line)continue;
      const section=/^PART \d+: (.+)$/.exec(line);
      if(section){
        const name=section[1].toLowerCase();
        category=name.includes('opening')?'Opening Practices':
          name.includes('tibetan')?'Tibetan Rites':
          name.includes('qigong')?'Qigong':
          name.includes('tai chi')?'Tai Chi':
          name.includes('modern')?'Modern Movement':'';
        lastHeading='';
        continue;
      }
      if(category==='Modern Movement'&&[
        'Strength Training Fundamentals','Rave Dance Movement','Yoga Nidra (Yogic Sleep)'
      ].includes(line))lastHeading=line;
      preceding.push(line);
    }else if(node.nodeName==='w:tbl'){
      if(!category||preceding.length<3)throw Error('Unattributed exercise table');
      const [title,description,durationLine]=preceding.slice(-3);
      if(!durationLine.startsWith('Duration: '))throw Error('Missing duration near '+title);
      const [steps,originalClaims,modifications]=extractTableRows(node,title);
      protocols.push({
        id:slug(title),title,description,duration:durationLine.slice('Duration: '.length),
        category,section:category==='Modern Movement'?lastHeading:category,
        steps,originalClaims,modifications,
        sourceFile:PROTOCOL_SOURCE,
        authorialClaimsNotice:'These benefit statements are the authors’ original claims, not independently clinically verified.'
      });
    }
  }
  const ids=new Set(protocols.map(p=>p.id));
  if(protocols.length!==23||ids.size!==23)throw Error('Expected 23 distinct protocols, found '+protocols.length);
  for(const category of MOVEMENT_CATEGORIES){
    if(!protocols.some(p=>p.category===category))throw Error('Missing movement category '+category);
  }
  if(protocols.some(p=>!p.steps.length||!p.modifications.length||!p.originalClaims.length)){
    throw Error('Movement protocol missing source content');
  }
  return protocols;
}

export async function parseThreeDaySchedule(buffer){
  const body=await documentBody(buffer,SCHEDULE_SOURCE);
  const paragraphs=children(body,'w:p').map(paragraph).filter(Boolean);
  const start=paragraphs.indexOf('Weekly Workout Structure');
  const end=paragraphs.indexOf('Progressive Training Structure');
  if(start<0||end<start)throw Error('Missing original 3-day workout schedule');
  const section=paragraphs.slice(start+1,end);
  const intro=section[0];
  if(!intro.includes('3-day cycle'))throw Error('Original schedule missing cycle description');
  const records=[];
  let current=null;
  for(const text of section.slice(1)){
    const match=/^Day ([1-3]): (.+)$/.exec(text);
    if(match){
      current={cycleDay:Number(match[1]),title:match[2],
        sessionFormat:'',sequence:[],teachingNote:'',sourceFile:SCHEDULE_SOURCE};
      records.push(current);
    }else if(current){
      if(text.startsWith('Session format '))current.sessionFormat=text;
      else if(text.startsWith('Teaching Note:'))current.teachingNote=text;
      else current.sequence.push(text);
    }
  }
  if(records.length!==3||records.some((r,i)=>r.cycleDay!==i+1||r.sequence.length<3||!r.sessionFormat||!r.teachingNote)){
    throw Error('Original weekly rhythm incomplete');
  }
  return {intro,cycles:records};
}
