import { useEffect, useState } from 'react';
import { completedFromStorage, journey, phases, subjects } from './method.js';

const STORAGE='sovereign-body-method.days.v1';
function Mark({small=false}) { return <span className={'mark '+(small?'mark-small':'')} aria-hidden="true"><i/><i/><i/></span>; }
function SectionHeading({eyebrow,title,children}) {return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{children&&<p className="section-intro">{children}</p>}</div>;}
function App() {
  const [current,setCurrent]=useState(1);
  const [completed,setCompleted]=useState(()=> {
    try { return completedFromStorage(window.localStorage.getItem(STORAGE)); } catch { return new Set(); }
  });
  const [selectedSubject,setSelectedSubject]=useState(null);
  const day=journey[current-1];
  const done=completed.size;

  useEffect(()=>{ try { window.localStorage.setItem(STORAGE,JSON.stringify([...completed].sort((a,b)=>a-b))); } catch {} },[completed]);
  useEffect(()=>{ document.title=selectedSubject ? selectedSubject.name+' | The Sovereign Body Method' : 'The Sovereign Body Method | Free for Everyone'; },[selectedSubject]);
  function toggleDay(n) { setCompleted(previous => { const next=new Set(previous); if(next.has(n))next.delete(n);else next.add(n);return next; }); }
  function nextDay(step){ setCurrent(v=>Math.min(30,Math.max(1,v+step))); }
  function navigate(n){setCurrent(n);document.getElementById('journey').scrollIntoView({behavior:'smooth',block:'start'});}
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <div className="announcement"><span className="announcement-star">✳</span> THE METHOD, FREELY SHARED <span className="announcement-star">✳</span> NO PAYWALL. NO GATEKEEPING.</div>
    <header className="header">
      <a className="logo" href="#top" aria-label="Sovereign Body Method home"><Mark small/><span>THE SOVEREIGN<br/><strong>BODY METHOD</strong></span></a>
      <nav aria-label="Main navigation"><a href="#philosophy">The philosophy</a><a href="#journey">30-day companion</a><a href="#library">Library</a><a href="#origin">Our story</a></nav>
      <a className="header-cta" href="#journey">Begin here <span aria-hidden="true">↗</span></a>
    </header>
    <main id="main">
      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="pill"><span className="live-dot"/> A FREE RESOURCE FOR EVERY BODY</div>
          <p className="hero-overline">A way back to yourself</p>
          <h1>Your body.<br/>Your rhythm.<br/><em>Your sovereignty.</em></h1>
          <p className="hero-lead">A grounded and expansive approach to well-being. Nourishment, movement, rest, nature, reflection, and the freedom to build a practice that belongs to you.</p>
          <div className="hero-actions"><a className="button button-light" href="#journey">Explore the 30 days <span aria-hidden="true">→</span></a><a className="text-link" href="#philosophy">Discover the method <span aria-hidden="true">↘</span></a></div>
          <div className="byline"><span className="line"/> Created with care by <strong>Mikey &amp; Larrina</strong></div>
        </div>
        <div className="hero-art" aria-label="Abstract concentric circles and organic landscape motif" role="img">
          <div className="art-glow"/><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="orbit orbit-four"/><div className="orbit-center"><Mark/></div>
          <div className="art-caption">A WHOLE PERSON <span>•</span> A LIVING PRACTICE</div>
          <div className="vertical-text">✳ EST. IN CARE, SHARED IN FREEDOM</div>
        </div>
      </section>
      <div className="marquee" aria-hidden="true"><span>YOUR BODY IS YOURS</span><b>✳</b><span>BEGIN WHERE YOU ARE</span><b>✳</b><span>GROW AT YOUR PACE</span><b>✳</b><span>YOUR BODY IS YOURS</span></div>
      <section className="section philosophy" id="philosophy">
        <div className="philosophy-side"><p className="eyebrow">01 / THE PHILOSOPHY</p><div className="side-glyph">✳</div></div>
        <div className="philosophy-content"><h2>Well-being isn't something you <em>earn.</em><br/>It's something you <em>practice.</em></h2><p>The Sovereign Body Method was created to bring pieces of daily living together. Not another set of impossible rules. A framework for listening, experimenting, reflecting, and reconnecting with yourself.</p><p>The practical foundations and the optional spiritual explorations belong in the same conversation, but they are not the same type of evidence. Choose what resonates, question what doesn't, and stay in charge of your own decisions.</p>
          <div className="principles"><div><span>01</span><strong>Start where you are</strong><small>No perfect starting line.</small></div><div><span>02</span><strong>Listen, don't force</strong><small>Your capacity matters.</small></div><div><span>03</span><strong>Keep your agency</strong><small>You decide what fits.</small></div></div>
        </div>
      </section>
      <section className="section journey-section" id="journey">
        <div className="journey-head"><SectionHeading eyebrow="02 / YOUR STARTING POINT" title={<>Thirty days.<br/><em>Your own pace.</em></>}>A gentle interactive companion inspired by the Method's 30-day structure. These are newly written starter reflections, not the original book's daily instructions.</SectionHeading><div className="journey-progress"><span>YOUR PROGRESS</span><strong>{done}<small> / 30</small></strong><div className="progress-track"><div style={{width:(done/30*100)+'%'}}/></div><small>Stored only in this browser. No account needed.</small></div></div>
        <div className="phase-grid">{phases.map((phase,i)=><button type="button" className={'phase-card '+(day.phase===phase.title?'active':'')} onClick={()=>navigate(i===0?1:i===1?8:i===2?15:22)} key={phase.title}><span className="phase-index">0{i+1} / {phase.tag}</span><strong>{phase.title}</strong><small>{phase.days}</small><p>{phase.note}</p><span className="phase-arrow">↗</span></button>)}</div>
        <div className="day-layout">
          <div className="day-picker"><div className="picker-head"><span>CHOOSE A DAY</span><span>{done} COMPLETE</span></div><div className="day-grid">{journey.map(item=><button type="button" aria-label={'Day '+item.day+(completed.has(item.day)?', completed':'')} aria-pressed={current===item.day} className={'day-dot '+(current===item.day?'selected ':'')+(completed.has(item.day)?'finished':'')} key={item.day} onClick={()=>setCurrent(item.day)}>{String(item.day).padStart(2,'0')}</button>)}</div><p className="day-note">No deadlines or streaks. Skip, revisit, or take all the time you need.</p></div>
          <article className="day-detail"><div className="day-label"><span>DAY {String(day.day).padStart(2,'0')} / 30</span><span>{day.phase.toUpperCase()} · {day.rhythm.toUpperCase()}</span></div><h3>{day.name}<span className="title-asterisk">✳</span></h3><p className="day-prompt">{day.prompt}</p><div className="today-task"><span className="task-icon">✦</span><div><strong>A reflection, not a prescription</strong><p>Meet yourself wherever you are today. Small and sustainable counts.</p></div></div><div className="day-buttons"><button className={'button '+(completed.has(day.day)?'button-complete':'button-dark')} onClick={()=>toggleDay(day.day)}>{completed.has(day.day)?'✓ Marked complete':'Mark today complete'}</button><div className="step-buttons"><button aria-label="Previous day" disabled={current===1} onClick={()=>nextDay(-1)}>←</button><button aria-label="Next day" disabled={current===30} onClick={()=>nextDay(1)}>→</button></div></div></article>
        </div>
      </section>
      <section className="section library-section" id="library">
        <SectionHeading eyebrow="03 / THE METHOD LIBRARY" title={<>A whole world of<br/><em>possibilities.</em></>}>Explore the themes that shape the Method. The original manuals, recipes, and teachings will be added here as their canonical files are verified for free publication.</SectionHeading>
        <div className="subject-grid">{subjects.map(s=><button className="subject" onClick={()=>setSelectedSubject(s)} key={s.name}><span className="eyebrow">{s.eyebrow}</span><strong>{s.name}</strong><p>{s.summary}</p><span className="subject-arrow">↗</span></button>)}</div>
        <div className="archive-banner"><div><p className="eyebrow">THE ORIGINAL ARCHIVE</p><h3>The full source collection deserves a proper home.</h3><p>We're building this public library around the creators' original documents, not AI-rewritten stand-ins. Until those files are reviewed and published, this site is a free introductory companion.</p></div><span className="archive-seal">FREE<br/><small>FOREVER<br/>TO READ</small></span></div>
      </section>
      <section className="origin-section" id="origin"><div className="origin-symbol"><Mark/></div><div className="origin-copy"><p className="eyebrow">04 / FROM US TO YOU</p><h2>Made together.<br/><em>Shared with everyone.</em></h2><p>The Sovereign Body Method is a collaboration between Mikey and Larrina, born out of a desire to connect practical daily well-being with a wider sense of personal meaning and freedom.</p><p>It was once offered through a storefront. This new chapter is about opening a door. No account, payment, or agreement with every idea is required to begin.</p><div className="signature">Mikey + Larrina <span>✳</span></div></div></section>
      <section className="section care-section" id="care"><div><p className="eyebrow">A NOTE ON CARE & CHOICE</p><h2>Curiosity and care<br/>can coexist.</h2></div><div><p>This site is educational, reflective and spiritual in places. It is not healthcare, diagnosis, or a treatment plan. Some traditional, celestial, chakra-based, or frequency-based frameworks are not supported as medical claims by clinical evidence.</p><p>If you are changing diet, exercise, herbs, supplements, or treatment, especially with a medical condition, medication use, pregnancy, or mobility concerns, consult an appropriately qualified professional. Stop any practice that causes pain, dizziness, or distress.</p><p>Your autonomy includes the right to question, adapt, or leave out any part.</p></div></section>
    </main>
    <footer className="footer"><div className="footer-top"><a className="logo" href="#top"><Mark small/><span>THE SOVEREIGN<br/><strong>BODY METHOD</strong></span></a><p>Belong to yourself.<br/>Begin where you are.</p></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Mikey &amp; Larrina · Content rights reserved until the creators publish a license.</span><a href="https://github.com/MichaelWave369/SovereignBodyMethod" target="_blank" rel="noreferrer">VIEW ON GITHUB ↗</a><a href="#top">BACK TO TOP ↑</a></div></footer>
    {selectedSubject&&<div className="dialog-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedSubject(null)}}><section className="dialog" role="dialog" aria-modal="true" aria-label={selectedSubject.name}><button className="dialog-close" onClick={()=>setSelectedSubject(null)} aria-label="Close details">×</button><p className="eyebrow">{selectedSubject.eyebrow}</p><h2>{selectedSubject.name}</h2><p>{selectedSubject.detail}</p><p className="dialog-foot">Original source chapter and downloadable resources will appear here once verified.</p><button className="button button-dark" onClick={()=>setSelectedSubject(null)}>Back to library</button></section></div>}
  </>;
}
export default App;
