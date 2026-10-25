/**
 * Conservative indices for already-published original manuscripts.
 * These are string occurrences, not endorsements of any health/energy claim.
 * Do not invent "six rituals" or frequencies absent from the source file.
 */
const crystalTerms=[
  'Amethyst','Rose Quartz','Clear Quartz','Citrine','Black Tourmaline',
  'Selenite','Obsidian','Lapis Lazuli','Tiger Eye','Tiger’s Eye',
  'Carnelian','Fluorite','Jade','Moonstone','Hematite','Labradorite',
  'Smoky Quartz','Quartz Crystal','Malachite','Aquamarine'
];

export function readableLines(html){
  if(typeof html!=='string')return [];
  return html
    .replace(/<br\s*\/?>/gi,'\n')
    .replace(/<\/(?:p|h[1-6]|li|tr|td|th|blockquote)>/gi,'\n')
    .replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;|&#160;/gi,' ')
    .replace(/&amp;/gi,'&')
    .replace(/&lt;/gi,'<')
    .replace(/&gt;/gi,'>')
    .replace(/&quot;/gi,'"')
    .replace(/&#39;|&apos;/gi,"'")
    .split(/\n+/)
    .map(s=>s.replace(/\s+/g,' ').trim())
    .filter(Boolean);
}
function compact(text,max=200){
  return text.length<=max?text:text.slice(0,max).replace(/\s+\S*$/,'').trimEnd()+'…';
}
export function extractFrequencyMentions(html){
  const results=[];
  const seen=new Set();
  for(const line of readableLines(html)){
    for(const match of line.matchAll(/\b(\d{2,4}(?:\.\d+)?)\s*(?:hz|hertz)\b/gi)){
      const value=Number(match[1]);
      if(!Number.isFinite(value)||value<20||value>20000||seen.has(value))continue;
      results.push({hz:value,sourceFile:'Reference_Appendices.docx',sourceExcerpt:compact(line)});
      seen.add(value);
    }
  }
  return results.sort((a,b)=>a.hz-b.hz).slice(0,32);
}
export function extractCrystalMentions(html){
  const lines=readableLines(html);
  const results=[];
  for(const name of crystalTerms){
    const found=lines.find(line=>line.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
    if(found)results.push({name,sourceFile:'Crystal_Energy_Work_Complete_Guide.docx',sourceExcerpt:compact(found)});
  }
  return results.slice(0,18);
}
export function playableFrequency(value){
  const numeric=Number(value);
  return Number.isFinite(numeric)&&numeric>=80&&numeric<=1000;
}
export function clampTone(value){
  const numeric=Number(value);
  if(!Number.isFinite(numeric))return 440;
  return Math.round(Math.min(1000,Math.max(80,numeric)));
}
