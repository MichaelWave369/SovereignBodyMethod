/** Pure helpers for original 28-day infused-water calendar. */
export const WATER_WEEKS=[
 {id:1,title:'Week 1 · Foundation',days:[1,7]},
 {id:2,title:'Week 2 · Expanded Variety',days:[8,14]},
 {id:3,title:'Week 3 · Repeat Favorites',days:[15,21]},
 {id:4,title:'Week 4 · Full Rotation',days:[22,28]}
];
export function filterWaterDays(days,week,query){
 const q=query.trim().toLocaleLowerCase();
 return days.filter(item=>(week===0||item.week===week)&&
  (!q||(item.blend+' '+item.notes+' '+item.weekday+' '+item.day).toLocaleLowerCase().includes(q)));
}
export function waterCompletion(raw){
 try{
  const data=JSON.parse(raw||'[]');
  return new Set(Array.isArray(data)?data.filter(n=>Number.isInteger(n)&&n>=1&&n<=28):[]);
 }catch{return new Set()}
}
export function weekFromWaterDay(day){
 return WATER_WEEKS.find(w=>day>=w.days[0]&&day<=w.days[1])?.id||1;
}
