import {useEffect,useMemo,useState} from 'react';
import {dailySources,dayProgress,uniqueCompletedDays} from './dailyUtils.js';
import PocketPanel from './PocketPanel.jsx';
import ShareMethod from './ShareMethod.jsx';
import './dailyDashboard.css';

const BASE=import.meta.env.BASE_URL;
async function fetchJSON(path){
 const response=await fetch(BASE+path);
 if(!response.ok)throw Error(path+' could not be loaded');
 return response.json();
}
export default function DailyDashboard({
 day,onDayChange,reflectionDone,movementDone,hydrationDone,
 onToggleReflection,onToggleMovement,onToggleHydration
}){
 const [data,setData]=useState({meals:[],schedule:null,water:[]});
 const [warning,setWarning]=useState([]);
 const [expandedMeal,setExpandedMeal]=useState(null);
 useEffect(()=>{
  let active=true;
  const sources=[
   {path:'meals/recipes.json',label:'Meal recipes'},
   {path:'movement/studio.json',label:'Movement sessions'},
   {path:'hydration/schedule.json',label:'Infused-water calendar'}
  ];
  Promise.allSettled(sources.map(s=>fetchJSON(s.path))).then(results=>{
   if(!active)return;
   const issues=[];
   for(let i=0;i<results.length;i++){
    if(results[i].status!=='fulfilled'||results[i].value.available!==true)issues.push(sources[i].label);
   }
   const meals=results[0].status==='fulfilled'&&results[0].value.available?results[0].value.recipes||[]:[];
   const schedule=results[1].status==='fulfilled'&&results[1].value.available?results[1].value.schedule:null;
   const water=results[2].status==='fulfilled'&&results[2].value.available?results[2].value.days||[]:[];
   setData({meals,schedule,water});setWarning(issues);
  });
  return()=>{active=false};
 },[]);
 useEffect(()=>{setExpandedMeal(null)},[day]);
 useEffect(()=>{
  const cleanup=()=>delete document.documentElement.dataset.sovereignPrint;
  window.addEventListener('afterprint',cleanup);
  return()=>{window.removeEventListener('afterprint',cleanup);cleanup()};
 },[]);
 const view=useMemo(()=>dailySources(day,data.meals,data.schedule,data.water),
  [day,data.meals,data.schedule,data.water]);
 const progress=dayProgress(day,reflectionDone,movementDone,hydrationDone);
 const markedDays=uniqueCompletedDays(reflectionDone,movementDone,hydrationDone);
 if(!view||!progress)return null;
 function change(delta){onDayChange(v=>Math.max(1,Math.min(30,v+delta)))}
 function printToday(){
  document.documentElement.dataset.sovereignPrint='daily';
  window.print();
 }
 return <section id="daily" className="daily-dashboard" aria-labelledby="daily-heading">
  <div className="daily-head">
   <div><p className="eyebrow">YOUR DAILY SOVEREIGN HOME</p>
    <h2 id="daily-heading">One day.<br/><em>Everything together.</em></h2>
    <p>Meals, movement, infused water and personal reflection from the same day of the Method. Original manuscripts stay original; the dashboard simply brings them to one place.</p></div>
   <div className="daily-index"><strong>{markedDays}<span> / 30</span></strong><small>DAYS WITH ANY OPTIONAL PROGRESS</small></div>
  </div>
  <div className="daily-picker">
   <div className="daily-picker-title"><div><span className="eyebrow">YOUR SELECTED DAY</span><h3>Day {String(day).padStart(2,'0')} <small>/ 30</small></h3></div>
    <div className="daily-prev-next"><button type="button" onClick={()=>change(-1)} disabled={day===1} aria-label="Previous day">←</button>
    <button type="button" onClick={()=>change(1)} disabled={day===30} aria-label="Next day">→</button></div></div>
   <div className="daily-day-grid" role="group" aria-label="Choose a day across all sections">{Array.from({length:30},(_,i)=>i+1).map(n=><button
    type="button" key={n} aria-label={'Select shared day '+n} aria-pressed={day===n}
    className={n===day?'selected':''} onClick={()=>onDayChange(n)}>{String(n).padStart(2,'0')}</button>)}</div>
  </div>
  <ShareMethod mode="day" day={day}/>
  {warning.length>0&&<p role="status" className="daily-warning">Some original collections are unavailable in this build: {warning.join(', ')}. Unavailable material will not be replaced by invented content.</p>}
  <div className="daily-panels">
   <article className="daily-panel daily-meals">
    <p className="eyebrow">NOURISHMENT · THREE ORIGINAL RECIPES</p><h3>What we're making.</h3>
    {view.meals.length===3?<div className="daily-meal-list">{view.meals.map(recipe=><div className="daily-meal" key={recipe.id}>
      <div className="daily-meal-title"><span>{recipe.type.toUpperCase()}</span><h4>{recipe.title}</h4>
       <button type="button" aria-expanded={expandedMeal===recipe.id}
        aria-controls={'dashboard-recipe-'+recipe.id}
        onClick={()=>setExpandedMeal(p=>p===recipe.id?null:recipe.id)}>{expandedMeal===recipe.id?'Hide steps −':'Read recipe +'}</button></div>
      {expandedMeal===recipe.id&&<div id={'dashboard-recipe-'+recipe.id} className="daily-recipe-expanded">
        <p><strong>Original prep time:</strong> {recipe.prepTime} · <strong>Serves:</strong> {recipe.servings}</p>
        <h5>Ingredients</h5><ul>{recipe.ingredients.map((line,i)=><li key={i}>{line}</li>)}</ul>
        <h5>Instructions</h5><ol>{recipe.instructions.map((line,i)=><li key={i}>{line}</li>)}</ol>
        <p>Source: {recipe.sourceFile}</p>
      </div>}
     </div>)}</div>:<p className="daily-unavailable">The original three recipes for this day aren't available yet.</p>}
    <a href="#meals">Full meal planner and shopping list →</a>
   </article>
   <article className="daily-panel daily-motion">
    <p className="eyebrow">MOVEMENT · ORIGINAL TRAINING RHYTHM</p><h3>How we're moving.</h3>
    {view.movement?<div className="daily-motion-content">
      <strong>{view.movement.title}</strong>
      <p>{view.movement.sessionFormat}</p>
      <p className="daily-attribution">From {view.movement.sourceFile}; a repeating three-day session template, not a separately authored workout for every day.</p>
    </div>:<p className="daily-unavailable">Movement template unavailable in this build.</p>}
    <a href="#movement">Open original movements and breathing →</a>
   </article>
   <article className="daily-panel daily-water">
    <p className="eyebrow">HYDRATION · OPTIONAL INFUSION</p><h3>A flavor to try.</h3>
    {view.water?<div className="daily-water-content">
      <strong>{view.water.blend}</strong>
      <small>{view.water.weekday} · Water week {view.water.week}</small>
      <p>{view.water.notes}</p>
      <p className="daily-attribution">From {view.water.sourceFile}. The calendar is a flavor guide, not a required water intake target.</p>
    </div>:<p className="daily-unavailable">{view.waterScheduleEnded?
      'The original infused-water schedule ends at Day 28. No blend was authored for Days 29–30.':
      'The original water blend for this day is unavailable.'}</p>}
    <a href="#hydration">Open the original water calendar →</a>
   </article>
   <article className="daily-panel daily-reflection">
    <p className="eyebrow">REFLECTION · NEWLY WRITTEN COMPANION</p><h3>{view.reflection.name}</h3>
    <p>{view.reflection.prompt}</p>
    <p className="daily-attribution">This reflection is part of the new introductory website companion, not a transcription of the original manuscript.</p>
    <a href="#journey">Read the full 30-day companion →</a>
   </article>
  </div>
  <div className="daily-progress">
   <div><p className="eyebrow">NO STREAKS · NO PRESSURE</p><h3>What you've explored.</h3>
    <p>These are optional notes, not health scores or proof of completing medical, exercise or dietary requirements. You can undo them any time.</p>
    <strong>{progress.completed} <span>/ {progress.possible}</span></strong>
   </div>
   <div className="daily-checks">
    <label><input type="checkbox" checked={progress.journey} onChange={()=>onToggleReflection(day)}/> I explored today's reflection</label>
    <label><input type="checkbox" checked={progress.movement} onChange={()=>onToggleMovement(day)}/> I explored today's movement</label>
    {progress.waterEligible?<label><input type="checkbox" checked={progress.water} onChange={()=>onToggleHydration(day)}/> I tried or considered today's water flavor</label>:
     <p>The water calendar ends on Day 28, so there is no water checkmark for this day.</p>}
   </div>
  </div>
  <PocketPanel day={day} onPrint={printToday}/>
  <p className="daily-footer">Your selected day and progress are stored only in this browser and shared across the site. No account, no streak pressure, no automatic claims of medical benefits. The site's original source data is cached for supported offline visits.</p>
  <section className="pocket-print-sheet" aria-label={'Printable Sovereign Body Method Day '+day}>
    <header><strong>THE SOVEREIGN BODY METHOD</strong><p>Mikey &amp; Larrina · Day {String(day).padStart(2,'0')} · Original manuals + new reflection companion</p></header>
    <h1>Day {day}: Your daily plan</h1>
    <p className="pocket-print-note">Your day's recipe, movement and water sources are preserved as published. This is a convenient printout, not medical or nutritional advice.</p>
    <h2>Original smoothie, salad and dinner</h2>
    {view.meals.length===3?view.meals.map(recipe=><article className="pocket-print-recipe" key={recipe.id}>
      <h3>{recipe.type.charAt(0).toUpperCase()+recipe.type.slice(1)} · {recipe.title}</h3>
      <p>Prep: {recipe.prepTime} · Original servings: {recipe.servings} · Source: {recipe.sourceFile}</p>
      <h4>Ingredients</h4><ul>{recipe.ingredients.map((part,i)=><li key={i}>{part}</li>)}</ul>
      <h4>Instructions</h4><ol>{recipe.instructions.map((step,i)=><li key={i}>{step}</li>)}</ol>
      {recipe.variations?.length>0&&<p><strong>Original variations:</strong> {recipe.variations.join(' · ')}</p>}
    </article>):<p>Full original recipes not available in this build.</p>}
    <h2>Movement · original repeating three-day rhythm</h2>
    {view.movement?<section className="pocket-print-motion"><h3>{view.movement.title}</h3><p>{view.movement.sessionFormat}</p>
      <ol>{view.movement.sequence.map((step,i)=><li key={i}>{step}</li>)}</ol>
      <p><strong>Source:</strong> {view.movement.sourceFile}; a repeating template, not an individualized prescription.</p>
    </section>:<p>Original movement source unavailable.</p>}
    <h2>Optional infused water</h2>
    {view.water?<p><strong>{view.water.blend}</strong> ({view.water.weekday}): {view.water.notes} · {view.water.sourceFile}</p>:
      <p>{view.waterScheduleEnded?'The original infused-water schedule ends on Day 28.':'Original water entry unavailable.'}</p>}
    <h2>Optional reflection · newly written website companion</h2>
    <p><strong>{view.reflection.name}:</strong> {view.reflection.prompt}</p>
    <footer>Educational archive only. Adapt movement to your needs, check recipe allergens and food safety, and consult qualified professionals for individualized health advice. Sources: original Sovereign Body Method manuscripts by Mikey &amp; Larrina.</footer>
  </section>
 </section>;
}
