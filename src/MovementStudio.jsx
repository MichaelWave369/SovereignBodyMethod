import {useEffect,useMemo,useState} from 'react';
import {PRACTICE_TYPES,BREATH_PATTERNS,practiceForDay,visiblePractices,readPracticeBookmarks} from './movementUtils.js';
import './movementStudio.css';
import {SHELF_OPEN,SHELF_UPDATED} from './shelfUtils.js';

const sourceUrl=import.meta.env.BASE_URL+'movement/studio.json';
const bookmarksKey='sovereign-body-method.movement.bookmarks.v1';

function BreathPacer(){
  const [patternId,setPatternId]=useState('369');
  const [skipHolds,setSkipHolds]=useState(false);
  const pattern=BREATH_PATTERNS.find(p=>p.id===patternId)||BREATH_PATTERNS[0];
  const sequence=useMemo(()=>pattern.phases.filter(p=>!skipHolds||!p.name.toLowerCase().includes('pause')),[pattern,skipHolds]);
  const [timer,setTimer]=useState({running:false,index:0,remaining:3,cycles:0});
  useEffect(()=>{
    setTimer({running:false,index:0,remaining:sequence[0].seconds,cycles:0});
  },[sequence]);
  useEffect(()=>{
    if(!timer.running)return;
    const interval=window.setInterval(()=>setTimer(previous=>{
      if(!previous.running)return previous;
      if(previous.remaining>1)return {...previous,remaining:previous.remaining-1};
      const index=(previous.index+1)%sequence.length;
      return {...previous,index,remaining:sequence[index].seconds,cycles:previous.cycles+(index===0?1:0)};
    }),1000);
    return()=>window.clearInterval(interval);
  },[timer.running,sequence]);
  const phase=sequence[timer.index]||sequence[0];
  function reset(){setTimer({running:false,index:0,remaining:sequence[0].seconds,cycles:0})}
  return <div className="movement-breath-pacer" aria-labelledby="movement-breath-title">
    <div className="movement-breath-head">
      <div><p className="eyebrow">GENTLE, SELF-PACED BREATHING GUIDE</p><h3 id="movement-breath-title">A little room to breathe.</h3>
      <p>Follow the original counting patterns at your own comfort level. This optional timer is not a breathing test or medical treatment.</p></div>
      <div className="movement-breath-orbit" aria-hidden="true"><span>✳</span></div>
    </div>
    <div className="movement-breath-settings">
      <label>ORIGINAL PATTERN<select value={patternId} onChange={e=>setPatternId(e.target.value)}>
        {BREATH_PATTERNS.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
      </select></label>
      <label className="movement-hold-option"><input type="checkbox" checked={skipHolds} onChange={e=>setSkipHolds(e.target.checked)}/> Skip breath holds (modified counts)</label>
    </div>
    <div className="movement-breath-live">
      <div className="movement-breath-count" aria-label={phase.name+', '+timer.remaining+' seconds remaining'}>
        <strong>{timer.remaining}</strong><span>seconds</span>
      </div>
      <div className="movement-breath-phase"><p className="eyebrow">CURRENT PHASE</p><h4 aria-live="polite" aria-atomic="true">{phase.name}</h4><p>{timer.cycles} complete cycles · Stop or return to normal breathing whenever you need.</p></div>
    </div>
    <div className="movement-breath-controls">
      <button type="button" onClick={()=>setTimer(p=>({...p,running:!p.running}))}>{timer.running?'Pause':'Start gently'}</button>
      <button type="button" className="movement-secondary-button" onClick={reset}>Reset</button>
    </div>
    <p className="movement-breath-warning"><strong>Safety:</strong> Do not strain, force deep breaths, or push through dizziness, tingling or discomfort. Stop and breathe normally if symptoms occur. Breath holding may be unsuitable with some heart, lung or other conditions; consult a qualified clinician for individual guidance. Never practice in water or while driving.</p>
    <p className="movement-breath-source">Counts from the original <em>Detailed Exercise Protocols</em>. Skipping holds is a user-selected modification, not the original exact sequence.</p>
  </div>;
}

function PracticeCard({item,open,onToggle,saved,onBookmark}){
  return <article className={'movement-card '+(open?'movement-expanded':'')}>
    <div className="movement-card-top"><span>{item.section}</span><button type="button" className={'movement-bookmark '+(saved?'saved':'')} aria-pressed={saved} aria-label={(saved?'Remove bookmark: ':'Bookmark: ')+item.title} onClick={onBookmark}>{saved?'★':'☆'}</button></div>
    <h4>{item.title}</h4><p className="movement-card-description">{item.description}</p>
    <div className="movement-duration">SOURCE PRACTICE · {item.duration}</div>
    <button type="button" className="movement-card-expand" onClick={onToggle} aria-expanded={open} aria-controls={'movement-detail-'+item.id}>{open?'Close original instructions':'Read original instructions'} <span aria-hidden="true">{open?'−':'↗'}</span></button>
    {open&&<div id={'movement-detail-'+item.id} className="movement-card-details">
      <h5>Original step-by-step instructions</h5>
      <ol>{item.steps.map((s,i)=><li key={i}>{s}</li>)}</ol>
      <h5>Original modifications and tips</h5>
      <ul>{item.modifications.map((s,i)=><li key={i}>{s}</li>)}</ul>
      <details><summary>Original stated benefits (not independently verified)</summary>
        <p className="movement-original-note">The following claims are reproduced from the authors' historical manuscript. Traditional energetic or healing explanations are beliefs and should not be read as proven medical effects.</p>
        <ul>{item.originalClaims.map((s,i)=><li key={i}>{s}</li>)}</ul>
      </details>
      <p className="movement-source">Unabridged steps and modifications from {item.sourceFile}. For full formatting and context, consult the downloadable original in the Manuscript Library.</p>
    </div>}
  </article>;
}

export default function MovementStudio({day,onDayChange,completed,onToggleDone}){
  const setDay=onDayChange;
  const [data,setData]=useState({available:false,protocols:[],schedule:null});
  const [loadError,setLoadError]=useState('');
  const [tab,setTab]=useState('today');
  const [group,setGroup]=useState('All');
  const [query,setQuery]=useState('');
  const [savedOnly,setSavedOnly]=useState(false);
  const [opened,setOpened]=useState('');
  const [bookmarks,setBookmarks]=useState(()=>{
    try{return readPracticeBookmarks(localStorage.getItem(bookmarksKey))}catch{return new Set()}
  });
  useEffect(()=>{
    let active=true;
    fetch(sourceUrl).then(r=>{if(!r.ok)throw Error('Movement library not available');return r.json()})
      .then(json=>{if(active)setData(json)}).catch(e=>{if(active)setLoadError(e.message)});
    return()=>{active=false};
  },[]);
  useEffect(()=>{
    try{localStorage.setItem(bookmarksKey,JSON.stringify([...bookmarks]))}catch{}
    window.dispatchEvent(new Event(SHELF_UPDATED));
  },[bookmarks]);
  useEffect(()=>{
    const openSaved=e=>{
      if(e.detail?.type!=='movement'||typeof e.detail.id!=='string')return;
      setTab('guide');setGroup('All');setQuery('');setSavedOnly(false);
      setOpened(e.detail.id);
    };
    window.addEventListener(SHELF_OPEN,openSaved);
    return()=>window.removeEventListener(SHELF_OPEN,openSaved);
  },[]);
  const today=practiceForDay(day,data.schedule);
  const practices=useMemo(()=>visiblePractices(data.protocols,group,query).filter(p=>!savedOnly||bookmarks.has(p.id)),[data.protocols,group,query,savedOnly,bookmarks]);

  function toggleDay(n){onToggleDone(n)}
  function toggleBookmark(id){
    setBookmarks(old=>{const next=new Set(old);if(next.has(id))next.delete(id);else next.add(id);return next});
  }
  function goToLibrary(category='All'){
    setGroup(category);setQuery('');setSavedOnly(false);setOpened('');
    setTab('guide');
  }
  return <section className="movement-studio" id="movement" aria-labelledby="movement-title">
    <div className="movement-intro">
      <div><p className="eyebrow">04 / THE ORIGINAL PRACTICE MANUALS</p>
        <h2 id="movement-title">Move with intention.<br/><em>Breathe at your pace.</em></h2>
        <p>A free, accessible studio for the original breathing, mobility, strength, flow, dance and rest techniques from Mikey and Larrina's manuscripts.</p>
      </div>
      <div className="movement-total"><strong>{data.protocolCount||23}</strong><span>ORIGINAL TECHNIQUES<br/>FIVE PRACTICE FAMILIES</span></div>
    </div>
    <div className="movement-safety" role="note"><strong>Every body is different.</strong> This is an archive and educational guide, not a personal exercise prescription. Move gently, rest often, adapt to your abilities, and stop if you feel pain, dizzy or unwell. Get individualized guidance before starting if you have a health condition, injury or pregnancy. Avoid breath holds that are uncomfortable. Spiritual/energy descriptions in the original manuscript are not established medical mechanisms.</div>
    <nav className="movement-tabs" aria-label="Movement studio sections">
      {[
        ['today','30-day movement'],
        ['guide','Practice library'],
        ['breath','Breathing guide'],
      ].map(([id,label])=><button type="button" key={id} className={tab===id?'active':''} aria-pressed={tab===id} onClick={()=>setTab(id)}>{label}</button>)}
    </nav>
    {loadError&&<p className="movement-message" role="alert">Movement documents could not load: {loadError}. The Word originals remain available in the library below.</p>}
    {!loadError&&!data.available&&<p className="movement-message" role="status">The original movement library will activate when the approved Word source archive is included in this site's build.</p>}
    {data.available&&tab==='today'&&<div className="movement-day">
      <div className="movement-day-head"><div><p className="eyebrow">THE AUTHORS' REPEATING THREE-DAY RHYTHM</p><h3>Day <em>{String(day).padStart(2,'0')}</em> <small>/ 30</small></h3><p>{today?.title||'Choose your day'}</p></div><div className="movement-navigation"><button type="button" disabled={day===1} onClick={()=>setDay(n=>Math.max(1,n-1))} aria-label="Previous movement day">←</button><button type="button" disabled={day===30} onClick={()=>setDay(n=>Math.min(30,n+1))} aria-label="Next movement day">→</button></div></div>
      <div className="movement-day-grid" role="group" aria-label="Choose a movement day">{Array.from({length:30},(_,i)=>i+1).map(n=><button type="button" key={n} className={(day===n?'selected ':'')+(completed.has(n)?'done':'')} aria-pressed={day===n} onClick={()=>setDay(n)} aria-label={'Day '+n+(completed.has(n)?' noted complete':'')}>{String(n).padStart(2,'0')}</button>)}</div>
      {today&&<div className="movement-rhythm">
        <div className="movement-rhythm-header"><p className="eyebrow">SAMPLE SESSION FROM {today.sourceFile}</p><h4>{today.title}</h4><p>{today.sessionFormat}</p></div>
        <ol>{today.sequence.map((s,i)=><li key={i}>{s}</li>)}</ol>
        <div className="movement-teaching-note"><strong>Original teaching note</strong><p>{today.teachingNote.replace(/^Teaching Note:\s*/,'')}</p></div>
        <div className="movement-rhythm-actions"><button type="button" onClick={()=>toggleDay(day)}>{completed.has(day)?'✓ Practice noted · Undo':'Mark this day practiced'}</button><button type="button" className="movement-secondary-button" onClick={()=>goToLibrary('All')}>Explore individual techniques ↗</button></div>
      </div>}
      <p className="movement-rhythm-foot">The original manual describes a three-day strength / flexibility-cardio / recovery cycle repeating throughout the program. This interface maps it to days 1–30; it is <strong>not</strong> 30 separately authored workouts. Session times, supplements and frequencies are historical source text, not recommended requirements. Skipping or modifying any practice is completely okay.</p>
    </div>}
    {data.available&&tab==='guide'&&<div id="movement-library" className="movement-library">
      <div className="movement-library-heading"><h3>The whole movement library.</h3><p>23 original protocols with source instructions, modifications and attributed claims.</p></div>
      <div className="movement-filters"><label><span>SEARCH TECHNIQUES</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try standing, shuffle, plank, breathing…"/></label><label><span>FAMILY</span><select value={group} onChange={e=>setGroup(e.target.value)}>{PRACTICE_TYPES.map(p=><option key={p.key} value={p.key}>{p.label}</option>)}</select></label></div>
      <label className="movement-saved-filter"><input type="checkbox" checked={savedOnly} onChange={e=>setSavedOnly(e.target.checked)}/> Show my bookmarked practices ({bookmarks.size})</label>
      <p className="movement-count" role="status">{practices.length} original techniques match.</p>
      <div className="movement-card-grid">{practices.map(item=><PracticeCard key={item.id} item={item} open={opened===item.id} saved={bookmarks.has(item.id)} onToggle={()=>setOpened(n=>n===item.id?'':item.id)} onBookmark={()=>toggleBookmark(item.id)}/>)}</div>
      {!practices.length&&<p className="movement-message">No matching practice. Try another family or search term.</p>}
    </div>}
    {data.available&&tab==='breath'&&<div className="movement-breath-section">
      <BreathPacer/>
      <button type="button" className="movement-breath-source-link" onClick={()=>goToLibrary('Opening Practices')}>View both complete original breathing techniques, instructions and modifications ↗</button>
    </div>}
    <p className="movement-endnote">Movement progress and bookmarks are optional and saved only in this browser. The original source wording is preserved in the library, even when a teaching claim is not medically established. All 23 practice texts are included in the offline reading cache after first online preparation.</p>
  </section>;
}
