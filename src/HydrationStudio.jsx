import {useEffect,useMemo,useState} from 'react';
import {WATER_WEEKS,filterWaterDays} from './hydrationUtils.js';
import './hydrationStudio.css';

const resource=import.meta.env.BASE_URL+'hydration/schedule.json';
export default function HydrationStudio({day,onDayChange,completed,onToggleDone}){
 const [data,setData]=useState({available:false,days:[]});
 const [error,setError]=useState('');
 const [week,setWeek]=useState(1);
 const [search,setSearch]=useState('');
 const selected=day<=28?day:null;
 const setSelected=onDayChange;
 useEffect(()=>{
  let active=true;
  fetch(resource).then(response=>{if(!response.ok)throw Error('Water schedule not found');return response.json()})
   .then(json=>{if(active)setData(json)}).catch(err=>{if(active)setError(err.message)});
  return()=>{active=false};
 },[]);
 useEffect(()=>{if(day<=28)setWeek(Math.floor((day-1)/7)+1)},[day]);
 const results=useMemo(()=>filterWaterDays(data.days,week,search),[data.days,week,search]);
 const current=data.days.find(item=>item.day===selected);
 function selectWeek(value){
  setWeek(value);
  if(value!==0)setSelected((value-1)*7+1);
 }
 function toggle(day){onToggleDone(day)}
 return <section className="hydration-studio" id="hydration" aria-labelledby="hydration-title">
  <div className="hydration-intro">
   <div><p className="eyebrow">THE ORIGINAL 28-DAY INFUSED-WATER SYSTEM</p>
    <h2 id="hydration-title">A little more color.<br/><em>In every glass.</em></h2>
    <p>Twenty-eight rotating fruit-and-herb combinations, exactly as listed in Mikey and Larrina's original hydration calendar. Choose a blend, view its source notes, and keep track of what you've tried.</p></div>
   <div className="hydration-total"><strong>{data.dayCount||28}</strong><span>ORIGINAL WATER<br/>CALENDAR DAYS</span></div>
  </div>
  <div className="hydration-notice">This is an optional flavor calendar, not a requirement to drink a particular amount of water. Original notes may describe health benefits that aren't independently established. Wash produce, refrigerate prepared infusions promptly, and check ingredient allergies or medication interactions, especially with grapefruit and herbs.</div>
  {error&&<p role="alert" className="hydration-empty">The water calendar could not load: {error}. The complete Word guide is still available in the original manuscript library.</p>}
  {!error&&!data.available&&<p className="hydration-empty">Original 28-day calendar awaits publication of its Word source.</p>}
  {data.available&&<>
   <div className="hydration-controls">
    <label>CHOOSE A WEEK<select value={week} onChange={e=>selectWeek(Number(e.target.value))}><option value={0}>All four weeks</option>{WATER_WEEKS.map(w=><option key={w.id} value={w.id}>{w.title}</option>)}</select></label>
    <label>FIND A FLAVOR<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Try mint, berry, citrus…"/></label>
    <span role="status">{completed.size} / 28 days noted</span>
   </div>
   <div className="hydration-layout">
    <div className="hydration-cards">
     {results.map(item=><article className={'hydration-card '+(selected===item.day?'selected':'')} key={item.day}>
      <div className="hydration-card-top"><span>DAY {String(item.day).padStart(2,'0')} · {item.weekday.toUpperCase()}</span><span>WEEK {item.week}</span></div>
      <h3>{item.blend}</h3><p>{item.notes}</p>
      <div className="hydration-card-actions"><button type="button" onClick={()=>setSelected(item.day)} aria-pressed={selected===item.day}>{selected===item.day?'Selected':'View day ↗'}</button><label><input type="checkbox" checked={completed.has(item.day)} onChange={()=>toggle(item.day)}/> Tried</label></div>
     </article>)}
     {!results.length&&<p className="hydration-empty">No matching blends. Try another fruit, herb, or week.</p>}
    </div>
    <aside className="hydration-focus">
     <p className="eyebrow">YOUR SELECTED ORIGINAL BLEND</p><h3>{current?'Day '+String(current.day).padStart(2,'0'):'No scheduled blend'}</h3>
     <p className="hydration-focus-day">{current?.weekday||''} · Week {current?.week||''}</p>
     <strong>{current?.blend||'The original calendar ends at Day 28'}</strong>
     <p>{current?.notes||'Days 29 and 30 have no original infused-water entry. You can choose an earlier blend if you wish.'}</p>
     <p className="hydration-focus-disclaimer">The calendar is a flavor suggestion, not a full preparation recipe. Refer to the original guide for ratios, handling and storage. There is no authored Day 29 or 30 in this 28-day water schedule.</p>
     <a href={import.meta.env.BASE_URL+'library/originals/infused-water.docx'} download="Fruit_Herb_Infused_Water_Complete_Guide.docx">Get the complete original water guide ↓</a>
    </aside>
   </div>
  </>}
 </section>;
}
