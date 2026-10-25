/** Pure view state for source-only botanical reading library. */
export function searchableTerms(terms,{query='',family='all',source='all',savedOnly=false,saved=new Set()}={}){
 const q=query.trim().toLocaleLowerCase();
 return terms.filter(term=>
  (family==='all'||term.family===family)&&
  (source==='all'||term.sources.some(x=>x.id===source))&&
  (!savedOnly||saved.has(term.id))&&
  (!q||(term.name+' '+term.family).toLocaleLowerCase().includes(q))
 );
}
export function readSavedReadingList(raw){
 try{
  const items=JSON.parse(raw||'[]');
  if(!Array.isArray(items))return new Set();
  return new Set(items.filter(x=>typeof x==='string'&&
   /^(?:botanical|oil|supplement)-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x)));
 }catch{return new Set()}
}
