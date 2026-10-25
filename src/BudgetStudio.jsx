import {useEffect,useMemo,useState} from 'react';
import {money,parsePriceInput,readBudgetPrices,readBudgetTarget,summarizeBudget} from './budgetUtils.js';
import {WEEKS} from './mealUtils.js';
import './budgetStudio.css';

const source=import.meta.env.BASE_URL+'budget/tiers.json';
const pricesKey='sovereign-body-method.budget.line-prices.v1';
const targetsKey='sovereign-body-method.budget.targets.v1';
const formatPeriod=(scope,day)=>scope==='day'?'Day '+day:(WEEKS.find(w=>w.id===scope)?.label||scope);
function readTargets(raw){
 try{
  const parsed=JSON.parse(raw||'{}');
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return {};
  return Object.fromEntries(Object.entries(parsed).filter(([id,value])=>
   /^(?:week[1-4]|day-(?:[1-9]|[12]\d|30))$/.test(id)&&
   typeof value==='string'&&(value===''||parsePriceInput(value)!==null)
  ));
 }catch{return {}}
}

export default function BudgetStudio({rows,checked,pantry,scope,day}){
 const [sourceTiers,setSourceTiers]=useState({available:false,profiles:[]});
 const [prices,setPrices]=useState(()=>{
  try{return readBudgetPrices(localStorage.getItem(pricesKey))}catch{return {}}
 });
 const [targets,setTargets]=useState(()=>{
  try{return readTargets(localStorage.getItem(targetsKey))}catch{return {}}
 });
 const [profileId,setProfileId]=useState('tier1');
 const [filter,setFilter]=useState('needed');
 const [notice,setNotice]=useState('');
 const period=scope==='day'?'day-'+day:scope;
 const selectedProfile=sourceTiers.profiles.find(p=>p.id===profileId);
 const targetText=targets[period]||'';
 const target=readBudgetTarget(targetText);
 const summary=useMemo(()=>summarizeBudget(rows,prices,pantry,checked,target),[rows,prices,pantry,checked,target]);
 const visibleRows=rows.filter(row=>filter==='all'||(filter==='priced'?parsePriceInput(prices[row.id]??'')!==null:!pantry.has(row.id)&&!checked.has(row.id)));
 const comparable=scope!=='day'&&scope!=='week4';

 useEffect(()=>{
  let active=true;
  fetch(source).then(r=>{if(!r.ok)throw Error('Historical budget guide unavailable');return r.json()})
    .then(data=>{if(active)setSourceTiers(data)}).catch(()=>{});
  return()=>{active=false};
 },[]);
 useEffect(()=>{try{localStorage.setItem(pricesKey,JSON.stringify(prices))}catch{}},[prices]);
 useEffect(()=>{try{localStorage.setItem(targetsKey,JSON.stringify(targets))}catch{}},[targets]);

 function setLinePrice(id,value){
  if(value!==''&&parsePriceInput(value)===null)return;
  setPrices(previous=>{
   const next={...previous};
   if(value==='')delete next[id];
   else next[id]=value;
   return next;
  });
  setNotice('');
 }
 function setCap(value){
  if(value!==''&&parsePriceInput(value)===null)return;
  setTargets(previous=>({...previous,[period]:value}));
  setNotice('');
 }
 function useHistoricalCeiling(){
  if(!selectedProfile||!comparable)return;
  setCap(String(selectedProfile.historicWeeklyFoodBudget[1]));
  setNotice('Historical upper limit applied as an editable comparison, not a current grocery price estimate.');
 }
 async function copyPlan(){
  const lines=[
   'SOVEREIGN BODY METHOD · PERSONAL GROCERY BUDGET',
   formatPeriod(scope,day),
   'Prices are entered by the visitor for each full source ingredient line, in USD.',
   'Duplicate ingredients and source quantities are intentionally not combined.',
   'Already-have ingredients are excluded; purchased ingredients are included in planned cost.',
   target!==null?'Your spending cap: '+money(target):'No spending cap entered',
   summary.complete?'All non-pantry ingredient lines have prices.':'Incomplete estimate: '+summary.unknown+' non-pantry ingredient lines have no price.',
   'Known-cost subtotal: '+money(summary.estimatedCents),
   'Recorded purchased subtotal: '+money(summary.spentCents),
   'Remaining-to-purchase known subtotal: '+money(summary.remainingCents),
   ''
  ];
  for(const row of rows){
   if(pantry.has(row.id))continue;
   const cents=parsePriceInput(prices[row.id]??'');
   lines.push('Day '+row.day+' · '+row.type+' · '+row.ingredient+' | '+(cents===null?'PRICE UNKNOWN':money(cents))+(checked.has(row.id)?' | Bought':''));
  }
  try{
   if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
   await navigator.clipboard.writeText(lines.join('\n'));
   setNotice('Your cost breakdown is copied.');
  }catch{setNotice('Clipboard access unavailable. Your numbers remain visible here.');}
 }
 return <section className="budget-studio" id="budget" aria-labelledby="budget-heading">
   <div className="budget-heading">
     <div><p className="eyebrow">PERSONAL BUDGET / ORIGINAL SHOPPING SOURCES</p>
       <h4 id="budget-heading">Make every dollar <em>count.</em></h4>
       <p>Add what your local store actually charges for each original ingredient line. The estimate updates as you mark groceries bought or already on hand.</p>
     </div>
     <div className="budget-icon" aria-hidden="true">$</div>
   </div>
   <div className="budget-source">
    <label>ORIGINAL GROCERY-BUDGET APPROACH
      <select value={profileId} onChange={e=>setProfileId(e.target.value)}>
        {sourceTiers.profiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </label>
    {selectedProfile&&<div className="budget-source-body">
      <strong>{selectedProfile.name}</strong>
      <p>{selectedProfile.summary}</p>
      <p><b>Original historical seven-day food figure:</b> {money(selectedProfile.historicWeeklyFoodBudget[0]*100)}–{money(selectedProfile.historicWeeklyFoodBudget[1]*100)}. This is from the manuscript, not a 2026 store price quote or an individualized recommendation.</p>
      <details><summary>Read original shopping tips</summary><ul>{selectedProfile.shoppingNotes.map((item,i)=><li key={i}>{item}</li>)}</ul></details>
      <p className="budget-source-ref">Source: {selectedProfile.sourceFile}, Grocery Budget Guide. The standalone Gumroad Budget Wellness release has not been fully verified. Supplement recommendations in the original appendix are not included in this budgeting tool.</p>
    </div>}
   </div>
   <div className="budget-controls">
    <label>YOUR SPENDING CAP FOR {formatPeriod(scope,day).toUpperCase()}
     <span className="budget-dollar-input"><span aria-hidden="true">$</span><input type="text" inputMode="decimal" autoComplete="off" value={targetText} onChange={e=>setCap(e.target.value)} placeholder="Set your own limit" aria-label="Your personal grocery budget in US dollars"/></span>
    </label>
    <button type="button" disabled={!selectedProfile||!comparable} onClick={useHistoricalCeiling}>Use historical weekly upper figure</button>
   </div>
   {!comparable&&<p className="budget-comparison-note">{scope==='day'?'You selected one day. The source guide provides seven-day food budgets, so comparisons are not automatic.':'Week 4 covers nine days in the original recipe books. A seven-day historical budget is not an equivalent target, so enter your own cap.'}</p>}
   <div className="budget-summary" role="status">
    <div><span>KNOWN-COST SUBTOTAL</span><strong>{money(summary.estimatedCents)}</strong><small>Excludes pantry items, includes bought items</small></div>
    <div><span>ALREADY BOUGHT</span><strong>{money(summary.spentCents)}</strong><small>Of entered line prices</small></div>
    <div><span>STILL TO BUY</span><strong>{money(summary.remainingCents)}</strong><small>Of entered line prices</small></div>
   </div>
   <div className="budget-completeness">
    <strong>{summary.unknown===0?'All non-pantry lines priced.':summary.unknown+' ingredient lines still need prices.'}</strong>
    <span>{summary.priced} priced · {summary.excluded} on hand · {summary.totalLines} source lines in this period</span>
    {target!==null&&<p>{summary.complete?
       (summary.overTarget?'Your entered estimated total exceeds your cap by '+money(-summary.headroomCents)+'.':'Your entered estimated total is '+money(summary.headroomCents)+' within your cap.'):
       'Comparison with your spending cap is incomplete until all non-pantry lines have prices. The subtotal above is not a final total.'}</p>}
   </div>
   <details className="budget-input-details">
    <summary>Enter or review prices for individual ingredient lines</summary>
    <p>Enter an estimated price in USD for obtaining the <strong>whole ingredient line as written</strong> for that recipe, rather than a unit price per pound or package. Repeated ingredients in different recipes remain separate to avoid invented aggregation.</p>
    <div className="budget-row-toolbar"><label>SHOW
      <select value={filter} onChange={e=>setFilter(e.target.value)}>
       <option value="needed">Still needed</option><option value="all">All ingredient lines</option><option value="priced">Lines with prices</option>
      </select>
    </label><span>{visibleRows.length} lines shown</span></div>
    <div className="budget-input-rows">{visibleRows.map(row=><div className="budget-input-row" key={row.id}>
      <div><strong>Day {row.day} · {row.type} · {row.title}</strong><p>{row.ingredient}</p>{pantry.has(row.id)&&<small>Already have · excluded from estimated cost</small>}{checked.has(row.id)&&<small>Bought · included in estimated planned cost</small>}</div>
      <label>PRICE $<input type="text" inputMode="decimal" value={prices[row.id]??''} onChange={e=>setLinePrice(row.id,e.target.value)} aria-label={'Estimated cost for Day '+row.day+': '+row.ingredient} placeholder="0.00"/></label>
    </div>)}
    {!visibleRows.length&&<p>No ingredient lines in this filter. Try All ingredient lines.</p>}</div>
   </details>
   <div className="budget-bottom"><button type="button" onClick={copyPlan}>Copy budget breakdown ↗</button><p>Prices and limits stay in this browser. No account, store integrations, or price tracking. Recipes and original manuscript content are unchanged.</p></div>
   {notice&&<p role="status" className="budget-notice">{notice}</p>}
 </section>;
}
