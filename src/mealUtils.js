/** Pure data and shopping-list helpers for the original 30-day meal collection. */
export const WEEKS=[
  {id:'week1',label:'Week 1 · Days 1–7',from:1,to:7},
  {id:'week2',label:'Week 2 · Days 8–14',from:8,to:14},
  {id:'week3',label:'Week 3 · Days 15–21',from:15,to:21},
  {id:'week4',label:'Week 4 · Days 22–30',from:22,to:30},
];
export const TYPES=[{id:'smoothie',name:'Smoothie'},{id:'salad',name:'Salad'},{id:'dinner',name:'Dinner'}];
export function weekForDay(day){return WEEKS.find(w=>day>=w.from&&day<=w.to)||WEEKS[0]}
export function dayRecipes(recipes,day){return TYPES.map(type=>recipes.find(r=>r.day===day&&r.type===type.id)).filter(Boolean)}
export function searchRecipes(recipes,query,type='all'){
  const q=query.trim().toLocaleLowerCase();
  return recipes.filter(r=>(type==='all'||r.type===type)&&
    (!q||[r.title,r.day+'',r.type,r.sourceFile,...r.ingredients,...r.variations]
      .join(' ').toLocaleLowerCase().includes(q)));
}
export function rangeRecipes(recipes,scope,day){
  if(scope==='day')return recipes.filter(r=>r.day===day);
  const week=WEEKS.find(w=>w.id===scope)||weekForDay(day);
  return recipes.filter(r=>r.day>=week.from&&r.day<=week.to);
}
export function shoppingRows(recipes){
  return recipes.flatMap(recipe=>recipe.ingredients.map((raw,index)=>({
    id:recipe.id+'-ingredient-'+index,
    day:recipe.day,type:recipe.type,title:recipe.title,
    ingredient:raw
  })));
}
export function readChecked(value){
  try{
    const parsed=JSON.parse(value||'[]');
    return new Set(Array.isArray(parsed)?parsed.filter(x=>typeof x==='string'&&/^day-(?:[1-9]|[12]\d|30)-(?:smoothie|salad|dinner)-ingredient-\d+$/.test(x)) : []);
  }catch{return new Set()}
}
export function shoppingListText(rows,scope,day){
  const title=scope==='day'?`Day ${day}`:WEEKS.find(w=>w.id===scope)?.label||`Day ${day}`;
  const lines=[`SOVEREIGN BODY METHOD — ${title}`,
    'Original recipe shopping list · quantities as written for each recipe.',
    'Items are NOT automatically combined or scaled. Check repeats and dietary needs before buying.',''];
  let lastId='';
  for(const row of rows){
    const heading=`Day ${row.day} · ${row.type.toUpperCase()} · ${row.title}`;
    if(heading!==lastId){lines.push(heading);lastId=heading}
    lines.push('☐ '+row.ingredient);
  }
  return lines.join('\n');
}
