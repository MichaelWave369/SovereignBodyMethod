import {useEffect,useMemo,useRef,useState} from 'react';
import {playableFrequency,clampTone} from './soundSources.js';
import './soundStudio.css';
const feed=import.meta.env.BASE_URL+'sound/index.json';
const docs=import.meta.env.BASE_URL+'library/originals/';

const learning=[
  {id:'reference',title:'Sound & frequency references',filename:'Reference_Appendices.docx',description:'Source passages on sound and frequency, within the original reference appendix.'},
  {id:'crystals',title:'Crystal & Energy Work',filename:'Crystal_Energy_Work_Complete_Guide.docx',description:'Original crystal traditions, geometry and spiritual practices, preserved in their authored context.'},
  {id:'channels',title:'Sacred Channels',filename:'CHAPTER_13_Sacred_Channels_PART8.docx',description:'The original chakra and symbolic energy framework as a spiritual interpretation.'}
];

export default function SoundStudio(){
  const [source,setSource]=useState({available:false,sourceFrequencies:[],sourceCrystals:[]});
  const [loadError,setLoadError]=useState('');
  const [hz,setHz]=useState(432);
  const [level,setLevel]=useState(10);
  const [duration,setDuration]=useState(45);
  const [playing,setPlaying]=useState(false);
  const [error,setError]=useState('');
  const [filter,setFilter]=useState('');
  const audio=useRef(null);
  const timer=useRef(null);

  function stop(){
    if(timer.current!==null){clearTimeout(timer.current);timer.current=null}
    const active=audio.current;audio.current=null;
    if(active){
      try{
        active.gain.gain.setTargetAtTime(0,active.ctx.currentTime,0.016);
        setTimeout(()=>{
          try{active.osc.stop()}catch{}
          active.ctx.close().catch(()=>{});
        },100);
      }catch{
        try{active.osc.stop()}catch{}
        active.ctx.close().catch(()=>{});
      }
    }
    setPlaying(false);
  }
  useEffect(()=>{
    let active=true;
    fetch(feed).then(r=>{if(!r.ok)throw Error('Archive index missing');return r.json()})
      .then(data=>{if(active)setSource(data)})
      .catch(e=>{if(active)setLoadError(e.message)});
    return()=>{active=false};
  },[]);
  useEffect(()=>{
    function onHidden(){if(document.hidden)stop()}
    document.addEventListener('visibilitychange',onHidden);
    return()=>{document.removeEventListener('visibilitychange',onHidden);stop()};
  },[]);
  useEffect(()=>{
    if(audio.current){
      audio.current.osc.frequency.setTargetAtTime(hz,audio.current.ctx.currentTime,0.015);
    }
  },[hz]);
  useEffect(()=>{
    if(audio.current)audio.current.gain.gain.setTargetAtTime(level*0.0002,audio.current.ctx.currentTime,0.03);
  },[level]);
  async function toggleSound(){
    if(playing){stop();return}
    setError('');
    if(!playableFrequency(hz)){setError('Choose a tone between 80 and 1,000 Hz.');return}
    const Context=window.AudioContext||window.webkitAudioContext;
    if(!Context){setError('Your browser does not support generated audio.');return}
    let ctx;
    try{
      ctx=new Context();
      await ctx.resume();
      const gain=ctx.createGain(),osc=ctx.createOscillator();
      osc.type='sine';
      osc.frequency.value=hz;
      gain.gain.setValueAtTime(0.00001,ctx.currentTime);
      gain.gain.linearRampToValueAtTime(level*0.0002,ctx.currentTime+0.08);
      osc.connect(gain);gain.connect(ctx.destination);
      osc.start();
      audio.current={ctx,gain,osc};
      setPlaying(true);
      timer.current=setTimeout(()=>stop(),duration*1000);
    }catch(e){
      if(ctx)ctx.close().catch(()=>{});
      setError('Audio could not start: '+String(e.message||e));
      setPlaying(false);
    }
  }
  function selectTone(value){
    if(!playableFrequency(value))return;
    setHz(clampTone(value));
  }
  const results=useMemo(()=>source.sourceCrystals.filter(item=>
    !filter||item.name.toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase())||
    item.sourceExcerpt.toLocaleLowerCase().includes(filter.trim().toLocaleLowerCase())
  ),[source.sourceCrystals,filter]);

  return <section className="sound-studio" id="sound-studio" aria-labelledby="sound-title">
    <div className="sound-intro">
      <div><p className="eyebrow">ORIGINAL SOUND & CRYSTAL COLLECTION</p>
      <h3 id="sound-title">Explore the sound.<br/><em>Keep the context.</em></h3>
      <p>Browse the original frequency references and crystal passages, then experiment with a quiet, optional pure-tone player. The historic spiritual material remains available in full, exactly where it belongs: in the original manuscripts.</p></div>
      <div className="sound-symbol" aria-hidden="true">◉</div>
    </div>
    <p className="sound-caution"><strong>Important distinction:</strong> Solfeggio frequencies, chakras and crystal energies are traditional or spiritual interpretations, not proven cures. The player generates one electronic sine tone. It does not reproduce the advertised Gumroad sound-healing package, its music, or six unverified rituals. Keep device volume low, especially with headphones; stop immediately if sound causes discomfort or ringing.</p>
    <div className="sound-grid">
      <div className="sound-player">
        <p className="eyebrow">AUDIO EXPERIMENT · NOT A TREATMENT</p>
        <h4>A single tone, at your pace.</h4>
        <div className={'sound-dial '+(playing?'playing':'')}><strong>{hz}</strong><span>Hz</span></div>
        <label className="sound-range"><span>TONE FREQUENCY <small>80–1000 Hz</small></span><input type="range" min="80" max="1000" step="1" value={hz} onChange={e=>setHz(clampTone(e.target.value))}/></label>
        <div className="sound-player-fields">
          <label>RELATIVE LEVEL<input type="range" min="0" max="40" step="1" value={level} onChange={e=>setLevel(Number(e.target.value))}/><small>{level}/40 · limited output</small></label>
          <label>AUTO-STOP<select value={duration} onChange={e=>setDuration(Number(e.target.value))}><option value="30">30 seconds</option><option value="45">45 seconds</option><option value="120">2 minutes</option></select></label>
        </div>
        <button className="sound-play" type="button" onClick={toggleSound}>{playing?'■ Stop the tone':'▷ Play a quiet tone'}</button>
        {error&&<p role="alert" className="sound-error">{error}</p>}
        <p className="sound-fineprint">Playback requires a click and stops automatically, when you leave the page, or when you switch tabs. Your browser controls the final device volume. Start with speakers or headphones at a low hardware volume.</p>
      </div>
      <div className="sound-source-column">
        <p className="eyebrow">FREQUENCIES FOUND IN THE ORIGINALS</p>
        <h4>Words, not prescriptions.</h4>
        {loadError&&<p role="alert">Source index not available: {loadError}</p>}
        {!loadError&&!source.available&&<p>The original reading index will appear when the published manuscript archive is imported.</p>}
        {source.available&&<>
          {source.sourceFrequencies.length>0?<div className="sound-frequency-grid">{source.sourceFrequencies.map(item=><button type="button" key={item.hz} disabled={!playableFrequency(item.hz)}
            onClick={()=>selectTone(item.hz)} className={hz===item.hz?'selected':''}
            title={playableFrequency(item.hz)?'Select source-mentioned tone':'Outside demonstration tone range'}>
            <strong>{item.hz} Hz</strong><span>{playableFrequency(item.hz)?'Use tone ↗':'Source only'}</span>
          </button>)}</div>:<p>No numerical Hz mentions were detected in the converted reference text. Read the original source directly below.</p>}
          <details className="sound-source-excerpts"><summary>Read the exact source lines behind these numbers</summary>
            <ul>{source.sourceFrequencies.map(item=><li key={item.hz}><strong>{item.hz} Hz · Reference Appendices:</strong> {item.sourceExcerpt}</li>)}</ul>
          </details>
        </>}
        <p className="sound-source-note">A listed number means only that it occurs in the source manuscript; it does not demonstrate a claimed physical, neurological or medical effect. Numbers outside the player's comfortable range are shown as references only.</p>
      </div>
    </div>
    <div className="sound-crystals">
      <div className="sound-crystal-heading">
        <div><p className="eyebrow">CRYSTALS · ORIGINAL TEXT INDEX</p><h4>Find the original crystal passages.</h4><p>These keywords are indexed only when mentioned in the source file. No healing properties have been added or endorsed.</p></div>
        <label>SEARCH INDEX<input type="search" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search crystal names or excerpts"/></label>
      </div>
      {source.available&&<div className="sound-crystal-grid">{results.map(item=><article key={item.name}>
        <h5>{item.name}</h5><p>{item.sourceExcerpt}</p><small>Original: {item.sourceFile}</small>
      </article>)}</div>}
      {source.available&&results.length===0&&<p className="sound-source-note">No matching original crystal keyword appears in this index. Browse the full manuscript below.</p>}
    </div>
    <div className="sound-documents">
      <p className="eyebrow">READ THE FULL ORIGINALS</p><h4>Keep the manuscripts whole.</h4>
      <div>{learning.map(item=><article key={item.id}>
        <h5>{item.title}</h5><p>{item.description}</p>
        <a href={docs+item.id+'.docx'} download={item.filename}>Download original Word file ↓</a>
      </article>)}</div>
    </div>
    <p className="sound-final">This is a new interactive companion to the authors' archival content, not a reconstruction of the unverified Gumroad audio bundle. All source indices join the offline PWA once its cache finishes preparing online. No analytics, recording, microphone, or data upload.</p>
  </section>;
}
