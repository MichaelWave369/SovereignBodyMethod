import {useState} from 'react';
import {entryPaths,pathById} from './getStartedPaths.js';
import './getStarted.css';
export default function GetStarted({onDayChange}){
 const [chosen,setChosen]=useState('everyday');
 const path=pathById(chosen);
 return <section id="start-here" className="get-started" aria-labelledby="get-started-heading">
  <div className="get-started-heading"><div><p className="eyebrow">WELCOME / FIND YOUR OWN WAY IN</p>
   <h2 id="get-started-heading">Start somewhere.<br/><em>Not everywhere.</em></h2>
   <p>The Method has a lot inside it now. You do not have to do it all, start on Day 1, or agree with every idea. Choose what brought you here, then follow a few clear paths into the real source tools.</p></div>
   <div className="get-started-symbol" aria-hidden="true">✳</div></div>
  <div className="get-started-paths" role="group" aria-label="Choose a way to begin">
   {entryPaths.map(item=><button key={item.id} type="button" className={'get-started-path '+(path.id===item.id?'active':'')}
    onClick={()=>setChosen(item.id)} aria-pressed={path.id===item.id}>
    <span>{item.eyebrow}</span><strong>{item.title}</strong><small>{item.subtitle}</small>
   </button>)}</div>
  <div className="get-started-detail">
   <div className="get-started-intro" aria-live="polite"><p className="eyebrow">YOUR ROUTE · {path.eyebrow}</p><h3>{path.title}</h3><p>{path.introduction}</p></div>
   <ol className="get-started-steps">{path.steps.map((step,i)=><li key={step.title}>
    <span className="get-started-step-number">{String(i+1).padStart(2,'0')}</span>
    <div><h4>{step.title}</h4><p>{step.detail}</p>
     <a href={step.href} onClick={step.action==='day-one'?()=>onDayChange(1):undefined}>{step.button}</a>
    </div></li>)}</ol>
  </div>
  <p className="get-started-footnote">Original authors' texts stay distinct from this newly written website guide. It stores no personal information or medical profile. Switching routes does not erase your saved work.</p>
 </section>;
}
