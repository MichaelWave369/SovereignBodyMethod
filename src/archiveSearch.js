/**
 * Original-manuscript passage search, built exclusively from sanitized public
 * reader HTML. No rewording, summaries, medical interpretations, or user data.
 */
export function passageText(html){
 return String(html||'')
   .replace(/<[^>]*>/g,' ')
   .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,(_,entity)=>{
     if(entity[0]==='#'){
       const isHex=entity[1]?.toLowerCase()==='x';
       const n=Number.parseInt(entity.slice(isHex?2:1),isHex?16:10);
       return Number.isFinite(n)&&n>0&&n<=0x10ffff?String.fromCodePoint(n):' ';
     }
     return ({amp:'&',quot:'"',apos:"'",nbsp:' ',lt:'<',gt:'>',hellip:'…',mdash:'—',ndash:'–',lsquo:'‘',rsquo:'’',ldquo:'“',rdquo:'”'})[entity.toLowerCase()]||' ';
   })
   .replace(/\s+/g,' ').trim().normalize('NFKC');
}
export function extractManuscriptPassages(html){
 if(typeof html!=='string')throw Error('Original sanitized HTML is required');
 const blocks=[];
 // Mammoth emits semantic paragraphs/list items/headings/table cells; these
 // already exist as sanitized HTML. Text is indexed, never rewritten.
 const pattern=/<(h[1-6]|p|li|blockquote|td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi;
 let hit,position=0;
 while((hit=pattern.exec(html))!==null){
   const text=passageText(hit[2]);
   if(text.length>1)blocks.push({position:position++,text});
 }
 return blocks;
}
export function buildManuscriptIndex(catalog,readable){
 if(!Array.isArray(catalog)||!Array.isArray(readable))throw Error('Expected original manuscript arrays');
 const htmlById=new Map(readable.map(x=>[x.id,x.html]));
 const documents=[];
 for(const doc of catalog){
   if(!doc.available)continue;
   const html=htmlById.get(doc.id);
   if(typeof html!=='string')throw Error('Missing reviewed original manuscript: '+doc.id);
   const passages=extractManuscriptPassages(html);
   if(!passages.length)throw Error('No original passages found in '+doc.id);
   documents.push({id:doc.id,title:doc.title,category:doc.category,passages});
 }
 return {format:'sovereign-source-atlas-v1',documentCount:documents.length,
   passageCount:documents.reduce((n,d)=>n+d.passages.length,0),documents};
}
export function queryTerms(query){
 return String(query||'').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean).slice(0,8);
}
export function passageSnippet(text,words,max=260){
 const content=String(text||'');
 if(content.length<=max)return content;
 const source=content.toLocaleLowerCase();
 const offsets=words.map(w=>source.indexOf(w)).filter(n=>n>=0);
 const matchStart=offsets.length?Math.min(...offsets):0;
 const from=Math.max(0,Math.min(content.length-max,matchStart-70));
 const clipped=content.slice(from,from+max).trim();
 return (from>0?'…':'')+clipped+(from+max<content.length?'…':'');
}
export function searchManuscriptPassages(index,query,category='All',maxPerDocument=4){
 const words=queryTerms(query);
 if(words.join('').length<3)return {count:0,documentCount:0,groups:[]};
 const results=[];
 let count=0;
 for(const doc of index?.documents||[]){
   if(category!=='All'&&doc.category!==category)continue;
   let total=0;
   const previews=[];
   for(const block of doc.passages){
     const lower=block.text.toLocaleLowerCase();
     if(!words.every(w=>lower.includes(w)))continue;
     total++;count++;
     if(previews.length<maxPerDocument){
       previews.push({position:block.position,excerpt:passageSnippet(block.text,words),
         probe:block.text.slice(0,100)});
     }
   }
   if(total)results.push({id:doc.id,title:doc.title,category:doc.category,total,previews});
 }
 results.sort((a,b)=>b.total-a.total||a.title.localeCompare(b.title));
 return {count,documentCount:results.length,groups:results};
}
