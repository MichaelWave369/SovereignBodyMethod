/** Local-only budgeting, never silently aggregates or scales source ingredient quantities. */
const rowId=/^day-(?:[1-9]|[12]\d|30)-(?:smoothie|salad|dinner)-ingredient-\d+$/;
export function parsePriceInput(value){
  if(typeof value!=='string'&&typeof value!=='number')return null;
  const text=String(value).trim();
  if(!/^(?:\d{1,4})(?:\.\d{0,2})?$/.test(text))return null;
  const amount=Number(text);
  if(!Number.isFinite(amount)||amount>9999)return null;
  return Math.round(amount*100);
}
export function money(cents){
  return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
}
export function readBudgetPrices(raw){
  try{
    const value=JSON.parse(raw||'{}');
    if(!value||Array.isArray(value)||typeof value!=='object')return {};
    return Object.fromEntries(Object.entries(value).filter(([id,input])=>rowId.test(id)&&
      (typeof input==='string'||typeof input==='number')&&parsePriceInput(input)!==null));
  }catch{return {}}
}
export function readBudgetTarget(raw){
  const value=parsePriceInput(raw??'');
  return value===null||value<=0?null:value;
}
export function summarizeBudget(rows,prices,pantry,checked,targetCents=null){
  let estimated=0,remaining=0,spent=0,priced=0,unknown=0,excluded=0;
  for(const row of rows){
    if(pantry.has(row.id)){excluded++;continue;}
    const price=parsePriceInput(prices[row.id]??'');
    if(price===null){unknown++;continue;}
    priced++;estimated+=price;
    if(checked.has(row.id))spent+=price;
    else remaining+=price;
  }
  const complete=unknown===0;
  return {estimatedCents:estimated,remainingCents:remaining,spentCents:spent,
    priced,unknown,excluded,totalLines:rows.length,complete,
    targetCents,headroomCents:targetCents===null?null:targetCents-estimated,
    overTarget:complete&&targetCents!==null&&estimated>targetCents};
}
export function originalFoodTier(profiles,id){
  return profiles.find(p=>p.id===id)||null;
}
