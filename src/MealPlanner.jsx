import {useEffect,useMemo,useState} from 'react';
import {TYPES,WEEKS,dayRecipes,searchRecipes,rangeRecipes,shoppingRows,shoppingListText,readChecked,weekForDay} from './mealUtils.js';
import './mealPlanner.css';

const mealsUrl=import.meta.env.BASE_URL+'meals/recipes.json';
const checkedKey='sovereign-body-method.meals.shopping.v1';
const dayKey='sovereign-body-method.meals.day.v1';

function RecipeCard({recipe,expanded,onToggle}){
  const typeName=TYPES.find(t=>t.id===recipe.type)?.name||recipe.type;
  return <article className={'meal-recipe-card '+(expanded?'expanded':'')}>
    <div className="meal-card-head"><span>{typeName.toUpperCase()}</span><span>{recipe.prepTime}</span></div>
    <h4>{recipe.title}</h4>
    <p className="meal-serving">From the original {recipe.sourceFile} · Source servings: {recipe.servings}</p>
    <button type="button" className="meal-view-recipe" onClick={onToggle} aria-expanded={expanded} aria-controls={'meal-details-'+recipe.id}>
      {expanded?'Close recipe':'See full original recipe'} <span aria-hidden="true">{expanded?'−':'↗'}</span>
    </button>
    {expanded&&<div className="meal-recipe-details" id={'meal-details-'+recipe.id}>
      <div className="meal-recipe-columns">
        <div><h5>Ingredients</h5><ul>{recipe.ingredients.map((line,i)=><li key={i}>{line}</li>)}</ul></div>
        <div><h5>Instructions</h5><ol>{recipe.instructions.map((line,i)=><li key={i}>{line}</li>)}</ol></div>
      </div>
      {recipe.variations?.length>0&&<div className="meal-variations"><h5>Original variations</h5><ul>{recipe.variations.map((line,i)=><li key={i}>{line}</li>)}</ul></div>}
      <p className="meal-provenance">Transcribed from {recipe.sourceFile}. Ingredient quantities and preparation directions are the authors' original text; numbering and bullet symbols are formatted for reading.</p>
    </div>}
  </article>;
}

export default function MealPlanner(){
  const [catalog,setCatalog]=useState({available:false,recipeCount:0,recipes:[]});
  const [loadError,setLoadError]=useState('');
  const [tab,setTab]=useState('day');
  const [day,setDay]=useState(()=>{
    try{const n=Number(localStorage.getItem(dayKey));return Number.isInteger(n)&&n>=1&&n<=30?n:1}catch{return 1}
  });
  const [opened,setOpened]=useState('');
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState('all');
  const [seeAll,setSeeAll]=useState(false);
  const [scope,setScope]=useState('week1');
  const [checked,setChecked]=useState(()=>{
    try{return readChecked(localStorage.getItem(checkedKey))}catch{return new Set()}
  });
  const [copyFeedback,setCopyFeedback]=useState('');

  useEffect(()=>{
    let active=true;
    fetch(mealsUrl).then(response=>{if(!response.ok)throw Error('Meal archive unavailable');return response.json()})
      .then(data=>{if(active)setCatalog({
        available:data.available===true,
        recipeCount:data.recipeCount||0,
        recipes:Array.isArray(data.recipes)?data.recipes:[],
      })}).catch(err=>{if(active)setLoadError(err.message)});
    return()=>{active=false};
  },[]);
  useEffect(()=>{try{localStorage.setItem(dayKey,String(day))}catch{}},[day]);
  useEffect(()=>{try{localStorage.setItem(checkedKey,JSON.stringify([...checked]))}catch{}},[checked]);

  const recipes=catalog.recipes;
  const today'sMeals=useMemo(()=>dayRecipes(recipes,day),[recipes,day]);
  const searchMatches=useMemo(()=>searchRecipes(recipes,query,filter),[recipes,query,filter]);
  const shoppingMeals=useMemo(()=>rangeRecipes(recipes,scope,day),[recipes,scope,day]);
  const rows=useMemo(()=>shoppingRows(shoppingMeals),[shoppingMeals]);
  const checkedCount=rows.filter(r=>checked.has(r.id)).length;
  const shoppingDays=[...new Set(shoppingMeals.map(r=>r.day))].sort((a,b)=>a-b);
  const visibleMatches=seeAll?searchMatches:searchMatches.slice(0,18);

  function setActiveDay(next){
    setDay(Math.max(1,Math.min(30,next)));
    setOpened('');
    if(scope==='day')setCopyFeedback('');
  }
  function openShopping(forDay=false){
    setScope(forDay?'day':weekForDay(day).id);
    setCopyFeedback('');
    setTab('shopping');
  }
  function toggleIngredient(id){
    setChecked(old=>{
      const next=new Set(old);
      if(next.has(id))next.delete(id);else next.add(id);
      return next;
    });
  }
  function clearSelection(){
    const ids=new Set(rows.map(r=>r.id));
    setChecked(previous=>new Set([...previous].filter(id=>!ids.has(id))));
  }
  async function copyShopping(){
    const txt=shoppingListText(rows,scope,day);
    try{
      if(!navigator.clipboard?.writeText)throw Error('No clipboard permission');
      await navigator.clipboard.writeText(txt);
      setCopyFeedback('List copied with the original measurements.');
    }catch{
      setCopyFeedback('Copy unavailable in this browser. You can select and copy the ingredient list below.');
    }
  }
  function recipeList(list){return list.map(recipe=><RecipeCard key={recipe.id} recipe={recipe} expanded={opened===recipe.id} onToggle={()=>setOpened(v=>v===recipe.id?'':recipe.id)}/>)}

  return <section className="meal-planner-section" id="meals" aria-labelledby="meal-planner-heading">
    <div className="meal-intro">
      <div><p className="eyebrow">03 / FROM THE ORIGINAL RECIPE BOOKS</p>
      <h2 id="meal-planner-heading">Nourish your day.<br/><em>One meal at a time.</em></h2>
      <p>Thirty days, ninety original recipes, and a practical grocery checklist. Smoothies, salads and dinners exactly as they appear in the weekly manuals by Mikey and Larrina.</p></div>
      <div className="meal-stamp"><strong>{catalog.recipeCount||'90'}</strong><span>RECIPES<br/>IN THE ORIGINAL<br/>30-DAY COLLECTION</span></div>
    </div>
    <div className="meal-note"><span aria-hidden="true">✳</span><p>All recipes are reproduced from the creators' Word documents. Quantities are written for their original serving size (usually two people). Check allergens, food handling and any dietary restrictions. This is a meal-planning resource, not a personalized medical diet.</p></div>
    <div className="meal-tabs" role="group" aria-label="Meal planner view">
      {[
        ['day','30-day plan'],
        ['search','Find a recipe'],
        ['shopping','Shopping list'],
      ].map(([id,label])=><button key={id} type="button" className={tab===id?'active':''} aria-pressed={tab===id} onClick={()=>{setTab(id);setOpened('');setCopyFeedback('')}}>{label}</button>)}
    </div>
    {loadError&&<div className="meal-empty" role="status">The meal collection couldn't be loaded: {loadError}. The original recipe books are still available in the manuscript library below.</div>}
    {!loadError&&!catalog.available&&<div className="meal-empty" role="status">The original recipes are waiting for publication. The build will populate this meal planner automatically when the approved weekly Word documents are present.</div>}
    {catalog.available&&tab==='day'&&<div className="meal-day-view">
      <div className="meal-day-picker"><div><p className="eyebrow">CHOOSE YOUR DAY</p><h3>Day <em>{String(day).padStart(2,'0')}</em> <span>/ 30</span></h3><p>{weekForDay(day).label}</p></div>
        <div className="meal-day-navigation"><button type="button" disabled={day===1} onClick={()=>setActiveDay(day-1)} aria-label="Previous meal-plan day">←</button><button type="button" disabled={day===30} onClick={()=>setActiveDay(day+1)} aria-label="Next meal-plan day">→</button></div>
      </div>
      <div className="meal-day-numbers" role="group" aria-label="Select day 1 through 30">
        {Array.from({length:30},(_,i)=>i+1).map(n=><button key={n} type="button" className={n===day?'active':''} aria-pressed={n===day} onClick={()=>setActiveDay(n)} aria-label={'View meals for day '+n}>{String(n).padStart(2,'0')}</button>)}
      </div>
      <div className="meal-day-actions"><p>Day {day} includes one smoothie, one salad and one dinner.</p><button type="button" onClick={()=>openShopping(true)}>Shopping list for day {day} ↗</button></div>
      <div className="meal-recipe-grid">{recipeList(today'sMeals)}</div>
      {todaysMeals.length!==3&&<p role="alert">One or more recipes are missing for this day. Please consult the original weekly Word document.</p>}
    </div>}
    {catalog.available&&tab==='search'&&<div className="meal-search-view">
      <div className="meal-search-controls">
        <label className="meal-search-box"><span>SEARCH BY NAME OR INGREDIENT</span><input type="search" value={query} onChange={e=>{setQuery(e.target.value);setSeeAll(false);setOpened('')}} placeholder="Try avocado, quinoa, berry…" /></label>
        <label className="meal-search-select"><span>RECIPE TYPE</span><select value={filter} onChange={e=>{setFilter(e.target.value);setSeeAll(false);setOpened('')}}><option value="all">All recipes</option>{TYPES.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
      </div>
      <p className="meal-results-count" role="status">{searchMatches.length} matching original recipes. Open a card for its full ingredient list and preparation steps.</p>
      <div className="meal-recipe-grid">{recipeList(visibleMatches)}</div>
      {searchMatches.length>visibleMatches.length&&<button className="meal-show-more" type="button" onClick={()=>setSeeAll(true)}>Show all {searchMatches.length} recipes ↓</button>}
      {!searchMatches.length&&<p className="meal-no-results">No matching recipe found. Try another ingredient or recipe type.</p>}
    </div>}
    {catalog.available&&tab==='shopping'&&<div className="meal-shopping-view">
      <div className="meal-shopping-head">
        <div><p className="eyebrow">THE ORIGINAL INGREDIENTS</p><h3>Gather what you need.</h3><p>Shop for one day or a full week. Ingredient lines are kept per recipe, so repeated items are deliberately not added together.</p></div>
        <div className="meal-shopping-counter"><strong>{checkedCount}<span> / {rows.length}</span></strong><small>LINES CHECKED</small></div>
      </div>
      <div className="meal-shopping-toolbar">
        <label><span>SHOPPING PERIOD</span><select value={scope} onChange={e=>{setScope(e.target.value);setCopyFeedback('')}}><option value="day">Selected day ({day})</option>{WEEKS.map(w=><option value={w.id} key={w.id}>{w.label}</option>)}</select></label>
        <div className="meal-shopping-buttons"><button type="button" onClick={copyShopping}>Copy grocery list ↗</button><button type="button" className="meal-shopping-reset" onClick={clearSelection}>Clear checkmarks</button></div>
      </div>
      {copyFeedback&&<p className="meal-copy-feedback" role="status">{copyFeedback}</p>}
      <div className="meal-shopping-body">
        {shoppingDays.map(n=><div className="meal-shopping-day" key={n}>
          <h4>Day {String(n).padStart(2,'0')}</h4>
          <div className="meal-shopping-meals">{dayRecipes(shoppingMeals,n).map(recipe=><details key={recipe.id} className="meal-shopping-group" open>
            <summary>{recipe.type.toUpperCase()} · {recipe.title} <span>{recipe.ingredients.length} items</span></summary>
            <ul>{recipe.ingredients.map((ingredient,index)=>{
              const id=recipe.id+'-ingredient-'+index;
              return <li key={id}><label><input type="checkbox" checked={checked.has(id)} onChange={()=>toggleIngredient(id)} /><span className={checked.has(id)?'done':''}>{ingredient}</span></label></li>;
            })}</ul>
          </details>)}</div>
        </div>)}
      </div>
      <p className="meal-list-footnote">Original measurements are for each individual recipe and have not been scaled or consolidated. Pantry staples may repeat; review before shopping. Checked items stay saved in this browser, without an account.</p>
    </div>}
  </section>;
}
