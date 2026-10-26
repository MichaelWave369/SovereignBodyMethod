import {useEffect,useMemo,useState} from 'react';
import {SHELF_UPDATED,SHELF_OPEN,loadShelfState,shelfTotals,selectedShelfEntries,selectedShelfManuscripts,savedDays} from './shelfUtils.js';
import './sovereignShelf.css';

const SITE=import.meta.env.BASE_URL;
const categories=[
 {id:'recipes',title:'Recipes'},
 {id:'movement',title:'Movements'},
 {id:'books',title:'Original books'},
 {id:'botanicals',title:'Botanicals'},
 {id:'days',title:'My days'}
];
async function source(path){
 const result=await fetch(SITE+path);
 if(!result.ok)throw Error('Original '+path+' is unavailable.');
 return result.json();
}
export default function SovereignShelf({onDayChange}){
 const [shelf,setShelf]=useState(()=>loadShelfState(window.localStorage));
 const [content,setContent]=useState({recipes:[],movements:[],botanicals:[]});
 const [dataError,setDataError]=useState('');
 const [active,setActive]=useState('recipes');

 useEffect(()=>{
  let live=true;
  Promise.allSettled([source('meals/recipes.json'),source('movement/studio.json'),source('botanicals/index.json')])
    .then(results=>{
      if(!live)return;
      const [meals,movements,botanicals]=results;
      setContent({
       recipes:meals.status==='fulfilled'&&Array.isArray(meals.value.recipes)?meals.value.recipes:[],
       movements:movements.status==='fulfilled'&&Array.isArray(movements.value.protocols)?movements.value.protocols:[],
       botanicals:botanicals.status==='fulfilled'&&Array.isArray(botanicals.value.terms)?botanicals.value.terms:[]
      });
      if(results.some(r=>r.status==='rejected'))setDataError('Some original source indexes are not available. Your saved IDs are intact.');
    });
  return()=>{live=false};
 },[]);
 useEffect(()=>{
  const update=()=>setShelf(loadShelfState(window.localStorage));
  window.addEventListener(SHELF_UPDATED,update);
  window.addEventListener('storage',update);
  window.addEventListener('focus',update);
  return()=>{
    window.removeEventListener(SHELF_UPDATED,update);
    window.removeEventListener('storage',update);
    window.removeEventListener('focus',update);
  };
 },[]);

 const totals=shelfTotals(shelf);
 const recipeList=useMemo(()=>selectedShelfEntries(shelf.recipeIds,content.recipes),[shelf,content.recipes]);
 const movementList=useMemo(()=>selectedShelfEntries(shelf.movementIds,content.movements),[shelf,content.movements]);
 const botanicalList=useMemo(()=>selectedShelfEntries(shelf.botanicalIds,content.botanicals),[shelf,content.botanicals]);
 const originalBooks=useMemo(()=>selectedShelfManuscripts(shelf),[shelf]);
 const days=useMemo(()=>savedDays(shelf),[shelf]);
 const sizes={recipes:totals.recipes,movement:totals.movements,books:totals.manuscriptBooks,
  botanicals:totals.botanical,days:totals.daysTouched};

 function open(type,id,where,location=null){
  window.dispatchEvent(new CustomEvent(SHELF_OPEN,{detail:{type,id,location}}));
  document.getElementById(where)?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 function visitDay(day){
  onDayChange(day);
  document.getElementById('daily')?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 const empty=<div className="shelf-empty"><p>Nothing saved in this collection yet.</p>
   <p>Explore the original source sections and use ☆ or Save my place to build your own shelf.</p>
   <div><a href="#meals">Recipes →</a><a href="#movement">Movements →</a><a href="#library">Original library →</a></div>
  </div>;
 return <section id="my-shelf" className="sovereign-shelf" aria-labelledby="shelf-title">
  <div className="shelf-heading">
   <div><p className="eyebrow">MY SOVEREIGN SHELF / PRIVATE TO THIS BROWSER</p>
    <h2 id="shelf-title">The pieces you <em>kept.</em></h2>
    <p>One home for your starred recipes, favorite movements, original-book passages and reading topics. Your choices remain local, and every item links back to the authentic source.</p></div>
   <div className="shelf-mark" aria-hidden="true">✳</div>
  </div>
  <div className="shelf-summary" aria-label="Your saved collection totals">
   <div><strong>{totals.recipes}</strong><span>Favorite recipes</span></div>
   <div><strong>{totals.movements}</strong><span>Movements saved</span></div>
   <div><strong>{totals.manuscriptPassages}</strong><span>Book passages</span></div>
   <div><strong>{totals.botanical}</strong><span>Reading topics</span></div>
   <div><strong>{totals.daysTouched}</strong><span>Days noted</span></div>
  </div>
  <div className="shelf-tabs" role="group" aria-label="Saved collection">
   {categories.map(item=><button type="button" key={item.id}
     className={active===item.id?'active':''} aria-pressed={active===item.id}
     onClick={()=>setActive(item.id)}>{item.title} <small>({sizes[item.id]})</small></button>)}
  </div>
  {dataError&&<p className="shelf-loading-notice" role="status">{dataError}</p>}
  {active==='recipes'&&(recipeList.length?<div className="shelf-cards">{recipeList.map(item=><article key={item.id} className="shelf-card">
    <span className="shelf-category">DAY {String(item.day).padStart(2,'0')} · {item.type.toUpperCase()}</span>
    <h3>{item.title}</h3><p>Original source: {item.sourceFile}. Your favorite recipe is unchanged.</p>
    <button type="button" onClick={()=>open('recipe',item.id,'meals')}>Open original recipe ↗</button>
   </article>)}</div>:empty)}
  {active==='movement'&&(movementList.length?<div className="shelf-cards">{movementList.map(item=><article className="shelf-card" key={item.id}>
    <span className="shelf-category">{item.category} · {item.duration}</span><h3>{item.title}</h3>
    <p>{item.description}</p>
    <button type="button" onClick={()=>open('movement',item.id,'movement')}>Read the original movements ↗</button>
   </article>)}</div>:empty)}
  {active==='books'&&(originalBooks.length?<div className="shelf-book-groups">{originalBooks.map(doc=><article className="shelf-book" key={doc.id}>
   <span className="shelf-category">{doc.category} · Original Word manuscript</span><h3>{doc.title}</h3>
   <div className="shelf-book-actions">{doc.last&&<button type="button" onClick={()=>open('manuscript',doc.id,'library',doc.last)}>Resume where I left off ↗</button>}
    <button type="button" onClick={()=>open('manuscript',doc.id,'library')}>Read the complete original ↗</button></div>
   {doc.bookmarks.length>0&&<div className="shelf-bookmarks"><h4>Saved original passages</h4>
    {doc.bookmarks.map(item=><button type="button" key={item.position+':'+item.probe}
     onClick={()=>open('manuscript',doc.id,'library',item)}>{item.probe.slice(0,170)}{item.probe.length>170?'…':''} <span aria-hidden="true">↗</span></button>)}
   </div>}
  </article>)}</div>:empty)}
  {active==='botanicals'&&(botanicalList.length?<div className="shelf-cards">{botanicalList.map(term=><article className="shelf-card" key={term.id}>
   <span className="shelf-category">ORIGINAL TEXT INDEX · {term.family.toUpperCase()}</span>
   <h3>{term.name}</h3><p>Mentioned in {term.sourceCount} original {term.sourceCount===1?'document':'documents'}. A source mention is not evidence of medical benefit or safety.</p>
   <button type="button" onClick={()=>open('botanical',term.id,'botanicals')}>Find in original sources ↗</button>
  </article>)}</div>:empty)}
  {active==='days'&&(days.length?<div className="shelf-days">
   <p className="shelf-day-intro">These marks mean you chose to explore a day, not that you met a health target. All notes are optional and reversible.</p>
   <div className="shelf-day-grid">{days.map(day=><button type="button" key={day} onClick={()=>visitDay(day)}>
    <strong>Day {String(day).padStart(2,'0')}</strong>
    <span>{[
      shelf.reflections.has(day)?'Reflection':null,
      shelf.movementDone.has(day)?'Movement':null,
      shelf.waterDone.has(day)?'Water':null
     ].filter(Boolean).join(' · ')}</span>
    <small>Open day ↗</small>
   </button>)}</div>
  </div>:empty)}
  <p className="shelf-privacy">This shelf reads your existing browser-only choices; it does not create a public profile or submit reading and spending activity to a server. To move saved items to another device, use <a href="#daily">Sovereign Pocket</a> to download a private backup. Original manuscripts, health claims and recipes remain as authored and are not changed here.</p>
 </section>;
}
