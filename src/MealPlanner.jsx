import {useEffect,useMemo,useState} from 'react';
import {TYPES,WEEKS,dayRecipes,searchRecipes,rangeRecipes,shoppingRows,shoppingListText,readChecked,readFavorites,remainingShoppingRows,weeklyMenu,weekForDay} from './mealUtils.js';
import WeekOverview from './WeekOverview.jsx';
import './mealPlanner.css';

const mealsUrl=import.meta.env.BASE_URL+'meals/recipes.json';
const checkedKey='sovereign-body-method.meals.shopping.v1';
const dayKey='sovereign-body-method.meals.day.v1';
const favoritesKey='sovereign-body-method.meals.favorites.v1';
const pantryKey='sovereign-body-method.meals.pantry.v1';

function RecipeCard({recipe,expanded,onToggle,isFavorite,onToggleFavorite}){
  const typeName=TYPES.find(t=>t.id===recipe.type)?.name||recipe.type;
  return <article className={'meal-recipe-card '+(expanded?'expanded':'')}>
    <div className="meal-card-head"><span>{typeName.toUpperCase()}</span><span>{recipe.prepTime}</span></div>
    <div className="meal-title-row">
      <h4>{recipe.title}</h4>
      <button type="button" className={'meal-favorite-button '+(isFavorite?'saved':'')} aria-label={(isFavorite?'Remove from':'Save to')+' favorites: '+recipe.title} aria-pressed={isFavorite} onClick={onToggleFavorite} title={isFavorite?'Remove favorite':'Save favorite'}>{isFavorite?'★':'☆'}</button>
    </div>
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
  const [weekId,setWeekId]=useState(()=>weekForDay((()=>{
    try{const n=Number(localStorage.getItem(dayKey));return Number.isInteger(n)&&n>=1&&n<=30?n:1}
    catch{return 1}
  })()).id);
  const [favorites,setFavorites]=useState(()=>{
    try{return readFavorites(localStorage.getItem(favoritesKey))}catch{return new Set()}
  });
  const [pantry,setPantry]=useState(()=>{
    try{return readChecked(localStorage.getItem(pantryKey))}catch{return new Set()}
  });
  const [printView,setPrintView]=useState(null);
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
  useEffect(()=>{try{localStorage.setItem(favoritesKey,JSON.stringify([...favorites]))}catch{}},[favorites]);
  useEffect(()=>{try{localStorage.setItem(pantryKey,JSON.stringify([...pantry]))}catch{}},[pantry]);
  useEffect(()=>{
    const onPrintFinished=()=>setPrintView(null);
    window.addEventListener('afterprint',onPrintFinished);
    return()=>window.removeEventListener('afterprint',onPrintFinished);
  },[]);

  const recipes=catalog.recipes;
  const todaysMeals=useMemo(()=>dayRecipes(recipes,day),[recipes,day]);
  const searchMatches=useMemo(()=>searchRecipes(recipes,query,filter),[recipes,query,filter]);
  const shoppingMeals=useMemo(()=>rangeRecipes(recipes,scope,day),[recipes,scope,day]);
  const rows=useMemo(()=>shoppingRows(shoppingMeals),[shoppingMeals]);
  const checkedCount=rows.filter(r=>checked.has(r.id)).length;
  const shoppingDays=[...new Set(shoppingMeals.map(r=>r.day))].sort((a,b)=>a-b);
  const visibleMatches=seeAll?searchMatches:searchMatches.slice(0,18);
  const favoriteRecipes=recipes.filter(r=>favorites.has(r.id));
  const neededRows=remainingShoppingRows(rows,checked,pantry);
  const pantryCount=rows.filter(r=>pantry.has(r.id)).length;
  const weekDays=weeklyMenu(recipes,weekId);


  function setActiveDay(next){
    const nextDay=Math.max(1,Math.min(30,next));
    setDay(nextDay);
    setWeekId(weekForDay(nextDay).id);
    setOpened('');
    if(scope==='day')setCopyFeedback('');
  }
  function openShopping(selection=false){
    setScope(typeof selection==='string'?selection:selection?'day':weekForDay(day).id);
    setCopyFeedback('');
    setTab('shopping');
  }
  function toggleFavorite(id){
    setFavorites(prev=>{
      const next=new Set(prev);
      if(next.has(id))next.delete(id);else next.add(id);
      return next;
    });
  }
  function togglePantry(id){
    setPantry(prev=>{
      const next=new Set(prev);
      if(next.has(id))next.delete(id);else next.add(id);
      return next;
    });
    setChecked(prev=>{
      const next=new Set(prev);next.delete(id);return next;
    });
  }
  function printPage(view){
    setPrintView(view);
    // Allow React to commit the print-only view before opening print dialog.
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.print()));
  }
  function toggleIngredient(id){
    setChecked(old=>{
      const next=new Set(old);
      if(next.has(id))next.delete(id);else next.add(id);
      return next;
    });
    setPantry(old=>{const next=new Set(old);next.delete(id);return next});
  }
  function clearSelection(){
    const ids=new Set(rows.map(r=>r.id));
    setChecked(previous=>new Set([...previous].filter(id=>!ids.has(id))));
    setPantry(previous=>new Set([...previous].filter(id=>!ids.has(id))));
  }
  async function copyShopping(){
    const txt=shoppingListText(neededRows,scope,day);
    try{
      if(!navigator.clipboard?.writeText)throw Error('No clipboard permission');
      await navigator.clipboard.writeText(txt);
      setCopyFeedback('Only items still needed were copied, with original recipe quantities.');
    }catch{
      setCopyFeedback('Copy unavailable in this browser. You can select and copy the ingredient list below.');
    }
  }
  function recipeList(list){return list.map(recipe=><RecipeCard key={recipe.id} recipe={recipe} expanded={opened===recipe.id} isFavorite={favorites.has(recipe.id)} onToggleFavorite={()=>toggleFavorite(recipe.id)} onToggle={()=>setOpened(v=>v===recipe.id?'':recipe.id)}/>)}

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
        ['week','Weekly overview'],
        ['search','Find a recipe'],
        ['favorites','Favorites ('+favorites.size+')'],
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
      <div className="meal-recipe-grid">{recipeList(todaysMeals)}</div>
      {todaysMeals.length!==3&&<p role="alert">One or more recipes are missing for this day. Please consult the original weekly Word document.</p>}
    </div>}
    {catalog.available&&tab==='week'&&<WeekOverview recipes={recipes} weekId={weekId} onWeekChange={setWeekId} onSelectDay={n=>{setActiveDay(n);setTab('day')}} onShop={openShopping} onPrint={printPage}/>}
    {catalog.available&&tab==='favorites'&&<div className="meal-favorites-view">
      <div className="meal-favorites-intro"><p className="eyebrow">YOUR PERSONAL RECIPE SHELF</p><h3>Keep your favorites close.</h3><p>Tap the star on any original recipe to save it here. Favorites stay in this browser and never change the source collection.</p></div>
      {favoriteRecipes.length>0?<div className="meal-recipe-grid">{recipeList(favoriteRecipes)}</div>:<p className="meal-empty">No favorites saved yet. Visit the daily plan or recipe search and tap ☆ on a recipe to keep it here.</p>}
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
        <div><p className="eyebrow">THE ORIGINAL INGREDIENTS</p><h3>Gather what you need.</h3><p>Shop for one day or a full week. Mark items you already have, then check off purchases. Every ingredient keeps its original source quantity.</p></div>
        <div className="meal-shopping-counter"><strong>{neededRows.length}<span> / {rows.length}</span></strong><small>STILL NEEDED · {pantryCount} HAVE · {checkedCount} BOUGHT</small></div>
      </div>
      <div className="meal-shopping-toolbar">
        <label><span>SHOPPING PERIOD</span><select value={scope} onChange={e=>{setScope(e.target.value);setCopyFeedback('')}}><option value="day">Selected day ({day})</option>{WEEKS.map(w=><option value={w.id} key={w.id}>{w.label}</option>)}</select></label>
        <div className="meal-shopping-buttons"><button type="button" onClick={copyShopping}>Copy items to buy ↗</button><button type="button" className="meal-outline-button" onClick={()=>printPage('shopping')}>Print shopping list ↗</button><button type="button" className="meal-shopping-reset" onClick={clearSelection}>Reset this period</button></div>
      </div>
      {copyFeedback&&<p className="meal-copy-feedback" role="status">{copyFeedback}</p>}
      <div className="meal-shopping-body">
        {shoppingDays.map(n=><div className="meal-shopping-day" key={n}>
          <h4>Day {String(n).padStart(2,'0')}</h4>
          <div className="meal-shopping-meals">{dayRecipes(shoppingMeals,n).map(recipe=><details key={recipe.id} className="meal-shopping-group" open>
            <summary>{recipe.type.toUpperCase()} · {recipe.title} <span>{recipe.ingredients.length} items</span></summary>
            <ul>{recipe.ingredients.map((ingredient,index)=>{
              const id=recipe.id+'-ingredient-'+index;
              return <li key={id}><div className="meal-ingredient-line"><label><input type="checkbox" checked={checked.has(id)} onChange={()=>toggleIngredient(id)} /><span className={checked.has(id)||pantry.has(id)?'done':''}>{ingredient}</span></label><button type="button" aria-pressed={pantry.has(id)} aria-label={(pantry.has(id)?'Mark as needed: ':'Already have: ')+ingredient} className={'meal-pantry-button '+(pantry.has(id)?'has-item':'')} onClick={()=>togglePantry(id)}>{pantry.has(id)?'✓ Have':'Have?'}</button></div></li>;
            })}</ul>
          </details>)}</div>
        </div>)}
      </div>
      <p className="meal-list-footnote">Have? marks ingredients already on hand for that specific recipe. Checking the box marks a purchase; using one clears the other. Both stay saved in this browser. Copies and printouts show only lines still needed, keeping original quantities unscaled and repeats uncombined.</p>
    </div>}
    {printView&&<section className="meal-printout" aria-label="Printable meal planning sheet">
      <header><strong>THE SOVEREIGN BODY METHOD</strong><p>Mikey &amp; Larrina · Original 30-day recipes</p></header>
      {printView==='week'&&<>
        <h1>{WEEKS.find(w=>w.id===weekId)?.label} · Menu at a glance</h1>
        <p className="print-disclaimer">Original smoothie, salad and dinner names. Choose the corresponding day on the website for complete instructions.</p>
        <div className="meal-print-week">{weekDays.map(item=><article key={item.day} className="meal-print-day">
          <h2>Day {item.day}</h2>
          {item.recipes.map(recipe=><p key={recipe.id}><strong>{recipe.type}:</strong> {recipe.title}</p>)}
        </article>)}</div>
      </>}
      {printView==='shopping'&&<>
        <h1>{scope==='day'?'Day '+day:WEEKS.find(w=>w.id===scope)?.label} · Grocery checklist</h1>
        <p className="print-disclaimer">Only items not marked as already-have or purchased. Original measurements by recipe; repeats intentionally not combined.</p>
        {shoppingDays.map(n=><div key={n} className="meal-print-shopping-day">
          <h2>Day {n}</h2>
          {dayRecipes(shoppingMeals,n).map(recipe=>{
            const ingredients=neededRows.filter(row=>row.id.startsWith(recipe.id+'-ingredient-'));
            return ingredients.length?<div key={recipe.id} className="meal-print-shopping-recipe">
              <h3>{recipe.type} · {recipe.title}</h3>
              <ul>{ingredients.map(row=><li key={row.id}>□ {row.ingredient}</li>)}</ul>
            </div>:null;
          })}
        </div>)}
        {!neededRows.length&&<p>All items in this period were marked as already available or purchased.</p>}
      </>}
      <footer>Source: original weekly recipe manuscripts. Check food safety, allergens and personal dietary needs. Recipes are educational.</footer>
    </section>}
  </section>;
}
