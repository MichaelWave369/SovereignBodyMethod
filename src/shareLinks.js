/** Public-only share links. Never serialize browser-local progress or preferences. */
export const PUBLIC_SITE='https://michaelwave369.github.io/SovereignBodyMethod/';
export function sharedDayFromSearch(query){
  const values=new URLSearchParams(typeof query==='string'?query:'').getAll('day');
  if(values.length!==1||!/^(?:[1-9]|[12]\d|30)$/.test(values[0]))return null;
  return Number(values[0]);
}
export function canonicalShareLink(origin,base='/SovereignBodyMethod/'){
  const url=new URL(base,origin);
  url.search='';url.hash='';
  return url.toString();
}
export function dayShareLink(origin,base,day){
  if(!Number.isInteger(day)||day<1||day>30)throw Error('Day must be 1–30');
  const url=new URL(canonicalShareLink(origin,base));
  url.searchParams.set('day',String(day));
  url.hash='daily';
  return url.toString();
}
export function cleanDayParameter(address,selectedDay){
  const url=new URL(address);
  const linked=sharedDayFromSearch(url.search);
  if(linked!==null&&linked!==selectedDay){
    url.searchParams.delete('day');
    return url.pathname+url.search+url.hash;
  }
  return null;
}
