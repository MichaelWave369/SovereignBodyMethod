import {useEffect,useMemo,useState} from 'react';
import {searchableTerms,readSavedReadingList} from './botanicalUtils.js';
import './botanicalStudio.css';
import {SHELF_OPEN,SHELF_UPDATED} from './shelfUtils.js';

const indexUrl=import.meta.env.BASE_URL+'botanicals/index.json';
const docRoot=import.meta.env.BASE_URL+'library/originals/';
const saveKey='sovereign-body-method.botanicals.reading-list.v1';
const guides=[
 {name:'NIH NCCIH · Herbs at a Glance',link:'https://www.nccih.nih.gov/health/herbsataglance',
  detail:'Independent fact sheets covering research, possible adverse effects and precautions.'},
 {name:'NIH Office of Dietary Supplements',link:'https://ods.od.nih.gov/factsheets/list-all/',
  detail:'Independent supplement ingredient fact sheets and current evidence summaries.'},
 {name:'FDA · Dietary Supplement Safety',link:'https://www.fda.gov/consumers/consumer-updates/fda-101-dietary-supplements',
  detail:'How U.S. supplement regulation and interaction risks differ from prescription drugs.'}
];
export default function BotanicalStudio(){
 const [archive,setArchive]=useState({available:false,terms:[],sources:[],families:[]});
 const [loadError,setLoadError]=useState('');
 const [query,setQuery]=useState('');
 const [family,setFamily]=useState('all');
 const [source,setSource]=useState('all');
 const [savedOnly,setSavedOnly]=useState(false);
 const [saved,setSaved]=useState(()=>{
  try{return readSavedReadingList(localStorage.getItem(saveKey))}catch{return new Set()}
 });
 useEffect(()=>{
  let active=true;
  fetch(indexUrl).then(r=>{if(!r.ok)throw Error('Index not available');return r.json()})
   .then(data=>{if(active)setArchive(data)}).catch(e=>{if(active)setLoadError(e.message)});
  return()=>{active=false};
 },[]);
 useEffect(()=>{
   try{localStorage.setItem(saveKey,JSON.stringify([...saved]))}catch{}
   window.dispatchEvent(new Event(SHELF_UPDATED));
 },[saved]);
 useEffect(()=>{
   const openSaved=e=>{
     if(e.detail?.type!=='botanical'||typeof e.detail.label!=='string')return;
     setFamily('all');setSource('all');setSavedOnly(false);setQuery(e.detail.label);
   };
   window.addEventListener(SHELF_OPEN,openSaved);
   return()=>window.removeEventListener(SHELF_OPEN,openSaved);
 },[]);
 const shown=useMemo(()=>searchableTerms(archive.terms||[],{query,family,source,savedOnly,saved}),
  [archive.terms,query,family,source,savedOnly,saved]);
 function toggleSaved(id){
  setSaved(old=>{
   const next=new Set(old);if(next.has(id))next.delete(id);else next.add(id);return next;
  });
 }
 const familyLabel=id=>archive.families.find(f=>f.id===id)?.label||id;
 const sourceFor=id=>archive.sources.find(s=>s.id===id);
 return <section className="botanical-studio" id="botanicals" aria-labelledby="botanical-heading">
  <div className="botanical-heading">
   <div><p className="eyebrow">THE ORIGINAL HERBAL & SUPPLEMENT COLLECTION</p>
    <h3 id="botanical-heading">Explore the botanicals.<br/><em>Keep the evidence clear.</em></h3>
    <p>Find plants, essential oils and supplement ingredients that are actually mentioned in your original Sovereign Body Method manuscripts. Browse the source references, save items for further reading, and check independent scientific resources before considering any health decisions.</p></div>
   <div className="botanical-total"><strong>{archive.terms?.length||'—'}</strong><span>INDEXED SOURCE<br/>TERMS</span></div>
  </div>
  <div className="botanical-warning">
    <strong>This is a manuscript index, not a treatment or dosage guide.</strong>
    <p>A mention does not mean an herb or supplement is effective, safe, appropriate for you, or approved by regulators. Botanical products can interact with medicines and supplements, may be unsafe in pregnancy or with medical conditions, and essential oils are concentrated substances. Do not ingest oils or use historical dosing guidance without qualified professional advice. Seek medical care for symptoms rather than substituting supplements for treatment.</p>
  </div>
  <div className="botanical-authority">
   <p className="eyebrow">CHECK THE INDEPENDENT EVIDENCE</p>
   <div className="botanical-guides">{guides.map(g=><a href={g.link} target="_blank" rel="noopener noreferrer" key={g.link}>
    <strong>{g.name} <span aria-hidden="true">↗</span></strong><span>{g.detail}</span>
   </a>)}</div>
   <p className="botanical-guide-note">These official resources are independently published and may contain more recent findings than the archived manuscripts. A clinician or pharmacist can help identify relevant interactions.</p>
  </div>
  <div className="botanical-source-list">
   <p className="eyebrow">FIVE ORIGINAL WORD DOCUMENTS</p>
   <div>{archive.sources.map(item=><article key={item.id}>
    <h4>{item.title}</h4><p>{item.filename}</p>
    <a href={docRoot+item.id+'.docx'} download={item.filename}>Download unabridged original ↓</a>
   </article>)}</div>
  </div>
  {loadError&&<p className="botanical-empty" role="alert">Index failed to load: {loadError}. The complete original manuscripts are still in the main library.</p>}
  {!loadError&&!archive.available&&<p className="botanical-empty" role="status">The source-only index will activate once the five reviewed original manuscripts have been imported. No unverified entries are shown.</p>}
  {archive.available&&<>
   <div className="botanical-filter-head">
    <div><p className="eyebrow">SEARCH THE ORIGINAL INDEX</p><h4>Which ingredients appear in the books?</h4><p>Entries are generated only from the published source text; the counts represent textual mentions, not research citations or evidence of an effect.</p></div>
    <span>{shown.length} / {archive.terms.length} terms</span>
   </div>
   <div className="botanical-filters">
    <label>SEARCH BY NAME<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try chamomile, magnesium, lavender…"/></label>
    <label>READING CATEGORY<select value={family} onChange={e=>setFamily(e.target.value)}>
     <option value="all">All categories</option>{archive.families.map(f=><option key={f.id} value={f.id}>{f.label}</option>)}
    </select></label>
    <label>FOUND IN DOCUMENT<select value={source} onChange={e=>setSource(e.target.value)}>
     <option value="all">Any manuscript</option>{archive.sources.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
    </select></label>
   </div>
   <label className="botanical-saved-option"><input type="checkbox" checked={savedOnly} onChange={e=>setSavedOnly(e.target.checked)}/> Show saved reading topics only ({saved.size})</label>
   <div className="botanical-cards">{shown.map(item=><article key={item.id} className="botanical-card">
    <div className="botanical-card-top"><span>{familyLabel(item.family)}</span>
     <button type="button" className={saved.has(item.id)?'saved':''} aria-pressed={saved.has(item.id)}
       aria-label={(saved.has(item.id)?'Remove saved reading topic: ':'Save reading topic: ')+item.name}
       onClick={()=>toggleSaved(item.id)}>{saved.has(item.id)?'★':'☆'}</button></div>
    <h5>{item.name}</h5>
    <p><strong>{item.mentions}</strong> textual {item.mentions===1?'mention':'mentions'} in <strong>{item.sourceCount}</strong> original {item.sourceCount===1?'manuscript':'manuscripts'}</p>
    <details><summary>Where it appears in the originals</summary>
     <ul>{item.sources.map(s=><li key={s.id}>
      <span>{sourceFor(s.id)?.title||s.id} · {s.mentions} {s.mentions===1?'mention':'mentions'}</span>
      <a href={docRoot+s.id+'.docx'} download={sourceFor(s.id)?.filename}>Original Word source ↓</a>
     </li>)}</ul>
    </details>
    <p className="botanical-card-foot">Source occurrence only · no inferred purpose or dose</p>
   </article>)}</div>
   {!shown.length&&<p className="botanical-empty">No matching original source terms. Clear a filter to see more.</p>}
  </>}
  <p className="botanical-endnote">The separate historical Gumroad “Supplement & Herb Mastery” product package has not been verified. This is a new reading interface for the five source documents that are actually available. Saved reading topics stay only in this browser; no prescriptions, supplement stacks, symptom tracking, or personal medical information are recorded. Index pages join Offline Kitchen automatically on first successful online preparation.</p>
 </section>;
}
