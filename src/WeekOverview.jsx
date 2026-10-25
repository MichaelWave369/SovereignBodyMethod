import {WEEKS,weeklyMenu} from './mealUtils.js';

export default function WeekOverview({recipes,weekId,onWeekChange,onSelectDay,onShop,onPrint}){
  const week=WEEKS.find(w=>w.id===weekId)||WEEKS[0];
  const days=weeklyMenu(recipes,week.id);
  return <section className="meal-week-overview" aria-labelledby="meal-week-title">
    <div className="meal-week-header">
      <div><p className="eyebrow">YOUR WEEK AT A GLANCE</p><h3 id="meal-week-title">A plan you can <em>actually use.</em></h3><p>See every original smoothie, salad and dinner. Select a day for the full recipes, or make a paper copy for the kitchen.</p></div>
      <label className="meal-week-select">CHOOSE YOUR WEEK<select value={week.id} onChange={e=>onWeekChange(e.target.value)}>{WEEKS.map(w=><option key={w.id} value={w.id}>{w.label}</option>)}</select></label>
    </div>
    <div className="meal-week-actions">
      <button type="button" onClick={()=>onShop(week.id)}>Open this week's shopping list ↗</button>
      <button type="button" onClick={()=>onPrint('week')} className="meal-outline-button">Print menu / Save PDF ↗</button>
    </div>
    <div className="meal-week-grid">{days.map(item=><article key={item.day} className="meal-week-day">
      <div className="meal-week-day-head"><span>DAY {String(item.day).padStart(2,'0')}</span><small>{week.label.split(' · ')[0]}</small></div>
      <div className="meal-week-meals">{item.recipes.map(recipe=><div className="meal-week-meal" key={recipe.id}><span>{recipe.type.toUpperCase()}</span><strong>{recipe.title}</strong></div>)}</div>
      {item.recipes.length!==3&&<p role="alert">Original recipe missing</p>}
      <button type="button" onClick={()=>onSelectDay(item.day)}>See Day {item.day} recipes →</button>
    </article>)}</div>
    <p className="meal-week-foot">The original fourth week has nine days (22–30). This is intentional and follows the authors' original manuscript structure.</p>
  </section>;
}
