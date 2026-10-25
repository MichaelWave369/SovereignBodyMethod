import { useEffect,useMemo,useRef,useState } from 'react';
import {searchManuscriptPassages,queryTerms} from './archiveSearch.js';
import {archiveDocuments,archiveCategories} from './archiveCatalog.js';
import './archive.css';

const defaultItems = archiveDocuments.map(d=>({...d,available:false}));
const root = import.meta.env.BASE_URL+'library/';

function ResultExcerpt({text,query}){
 const word=queryTerms(query)[0]||'';
 const start=word?text.toLocaleLowerCase().indexOf(word):-1;
 if(start<0)return <>{text}</>;
 return <>{text.slice(0,start)}<mark>{text.slice(start,start+word.length)}</mark>{text.slice(start+word.length)}</>;
}
export default function ArchiveLibrary(){
  const [items,setItems]=useState(defaultItems);
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('All');
  const [reader,setReader]=useState(null);
  const [body,setBody]=useState(null);
  const [loading,setLoading]=useState(false);
  const [searchIndex,setSearchIndex]=useState(null);
  const [indexStatus,setIndexStatus]=useState('idle');
  const [jump,setJump]=useState(null);
  const manuscriptRef=useRef(null);
  const closeRef=useRef(null);
  const available=items.filter(d=>d.available).length;
  useEffect(()=>{
    let active=true;
    fetch(root+'catalog.json').then(r=>{if(!r.ok)throw new Error('Catalog unavailable');return r.json()})
      .then(data=>{if(active&&Array.isArray(data.documents))setItems(data.documents)})
      .catch(()=>{});return()=>{active=false};
  },[]);
  useEffect(()=>{
    if(query.trim().length<3||searchIndex||indexStatus!=='idle')return;
    // Do not cancel this in an effect cleanup when typing or when the status
    // becomes "loading". The first search owns one shared index request.
    setIndexStatus('loading');
    fetch(root+'search-index.json').then(r=>{
      if(!r.ok)throw Error('Full original passage index could not be loaded');
      return r.json();
    }).then(data=>{
      if(data.format!=='sovereign-source-atlas-v1'||!Array.isArray(data.documents))throw Error('Unexpected original passage index format');
      setSearchIndex(data);setIndexStatus('ready');
    }).catch(()=>setIndexStatus('error'));
  },[query,searchIndex,indexStatus]);
  useEffect(()=>{
    if(!reader)return;
    closeRef.current?.focus();
  },[reader]);
  useEffect(()=>{
    if(!reader||!body?.html||!jump||jump.id!==reader.id||!manuscriptRef.current)return;
    const source=jump.probe.toLocaleLowerCase().normalize('NFKC').slice(0,85);
    const words=queryTerms(jump.query);
    const blocks=Array.from(manuscriptRef.current.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,blockquote,td,th'));
    const norm=node=>(node.textContent||'').replace(/\s+/g,' ').trim().toLocaleLowerCase().normalize('NFKC');
    const selected=blocks.find(node=>norm(node).includes(source))||
      blocks.find(node=>words.every(w=>norm(node).includes(w)));
    if(selected){
      selected.setAttribute('data-atlas-target','true');
      selected.scrollIntoView({behavior:'auto',block:'center'});
    }
  },[reader,body,jump]);
  useEffect(()=>{
    if (!reader) return;
    let active=true;
    setBody(null);setLoading(true);
    fetch(root+'docs/'+encodeURIComponent(reader.id)+'.json')
      .then(r=>{if(!r.ok)throw Error('Original document could not be loaded');return r.json()})
      .then(data=>{if(active){setBody(data);setLoading(false)}})
      .catch(e=>{if(active){setBody({error:e.message});setLoading(false)}});
    return()=>{active=false};
  },[reader]);
  useEffect(()=>{
    if(!reader)return;
    const handler=e=>{if(e.key==='Escape')setReader(null)};
    window.addEventListener('keydown',handler);
    return()=>window.removeEventListener('keydown',handler);
  },[reader]);
  const passageResults=useMemo(()=>searchManuscriptPassages(searchIndex,query,category),[searchIndex,query,category]);
  function openPassage(docId,result){
    const document=items.find(item=>item.id===docId&&item.available);
    if(!document)return;
    setJump({id:document.id,probe:result.probe,query});
    setReader(document);
  }
  const filtered=useMemo(()=>items.filter(d=>(category==='All'||category===d.category)&&
    (d.title+' '+d.description+' '+(d.searchText||'')).toLowerCase().includes(query.trim().toLowerCase())),[items,category,query]);
  return <section className="original-archive" aria-labelledby="archive-title">
    <div className="original-archive-heading">
      <div><p className="eyebrow">THE ORIGINAL COLLECTION / ARCHIVAL EDITION</p>
      <h3 id="archive-title">The words behind<br/><em>the method.</em></h3>
      <p>Cataloged from the creators' original documents. Read the unabridged source and download the Word file where available. Traditional and spiritual claims appear as originally written, not as clinical endorsements.</p></div>
      <div className="archive-total"><strong>{available}<span> / {items.length}</span></strong><small>ORIGINAL READERS AVAILABLE</small></div>
    </div>
    <div className="archive-tools">
      <label htmlFor="archive-search" className="sr-only">Search original library</label>
      <input id="archive-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search every original manuscript passage…" type="search" />
      <label htmlFor="archive-filter" className="sr-only">Filter by category</label>
      <select id="archive-filter" value={category} onChange={e=>setCategory(e.target.value)}>
        {archiveCategories.map(c=><option key={c}>{c}</option>)}
      </select>
    </div>
    <p className="archive-status" role="status">{available ? `${available} of ${items.length} canonical originals currently readable.` : 'Originals inventoried. Online reading and download will activate when the approved source ZIP is added to the repository.'} {filtered.length} document-title/catalog matches.</p>
    {query.trim().length>=3&&<section className="archive-atlas-results" aria-labelledby="archive-atlas-heading">
      <div className="archive-atlas-header">
        <div><p className="eyebrow">FULL-TEXT SOURCE ATLAS</p><h4 id="archive-atlas-heading">Find the passage, not just the book.</h4>
          <p>These are excerpts from the original published Word manuscripts. Historical medical or energetic statements are the authors' original words, not independently validated recommendations.</p></div>
        <span>{indexStatus==='ready'?passageResults.documentCount+' books · '+passageResults.count+' passages':'21 original books'}</span>
      </div>
      {indexStatus==='loading'&&<p role="status" className="archive-atlas-note">Opening the full original text index locally…</p>}
      {indexStatus==='error'&&<p role="alert" className="archive-atlas-note">Passage search could not load. The document catalog search and original downloads remain available.</p>}
      {indexStatus==='ready'&&passageResults.groups.map(group=><article className="archive-atlas-group" key={group.id}>
        <div className="archive-atlas-group-heading"><h5>{group.title}</h5>
          <span>{group.total} matching {group.total===1?'passage':'passages'} · {group.category}</span></div>
        <div className="archive-atlas-excerpts">{group.previews.map(hit=><button type="button" className="archive-atlas-hit" key={hit.position} onClick={()=>openPassage(group.id,hit)}>
          <span className="archive-atlas-hit-body"><ResultExcerpt text={hit.excerpt} query={query}/></span>
          <strong>Open at this passage ↗</strong>
        </button>)}</div>
        {group.total>group.previews.length&&<p className="archive-atlas-more">Showing the first {group.previews.length} matching passages from this manuscript. Read the full original for more.</p>}
      </article>)}
      {indexStatus==='ready'&&passageResults.count===0&&<p className="archive-atlas-note">No matching source passages found. Try a different keyword or category.</p>}
    </section>}
    <div className="archive-entries">{filtered.map((d,index)=><article className="archive-entry" key={d.id}>
      <div className="archive-entry-n"><span>{String(index+1).padStart(2,'0')}</span><small>{d.category}</small></div>
      <h4>{d.title}</h4><p>{d.description}</p>
      {d.caution&&<p className="archive-caution">{d.caution}</p>}
      <div className="archive-entry-actions">{d.available
        ? <><button onClick={()=>{setJump(null);setReader(d)}}>Read original →</button><a href={root+'originals/'+encodeURIComponent(d.id)+'.docx'} download={d.file}>Download DOCX ↓</a></>
        : <span className="archive-pending">SOURCE AWAITING IMPORT</span>}</div>
      </article>)}</div>
    {!filtered.length&&<p className="archive-no-results">No matching documents. Try another search or category.</p>}
    {reader&&<div className="archive-modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setReader(null)}}>
      <div className="archive-modal" role="dialog" aria-modal="true" aria-label={'Original manuscript: '+reader.title} aria-busy={loading}>
        <div className="archive-modal-header"><div><span className="eyebrow">ORIGINAL MANUSCRIPT / {reader.category.toUpperCase()}</span><h3>{reader.title}</h3><p>Source file: {reader.file}</p></div><button ref={closeRef} aria-label="Close original manuscript" onClick={()=>setReader(null)}>×</button></div>
        <div className="archive-reader">
          <div className="archive-reader-notice"><strong>Read with context.</strong> Preserved archival material may include traditional health claims, specific herbs, dosages, spiritual interpretations or experimental routines. It is not medical advice. Speak with a qualified clinician about health decisions, medications and supplements. {reader.caution||''}</div>
          {loading&&<p>Loading original manuscript…</p>}
          {body?.error&&<p role="alert">{body.error}</p>}
          {body?.html&&<div ref={manuscriptRef} className="archive-manuscript" dangerouslySetInnerHTML={{__html:body.html}}/>}
          {body?.converterNotes?.length>0&&<details className="archive-conversion"><summary>Conversion notes</summary><ul>{body.converterNotes.map((n,i)=><li key={i}>{n}</li>)}</ul></details>}
        </div>
        <div className="archive-modal-footer"><a href={root+'originals/'+encodeURIComponent(reader.id)+'.docx'} download={reader.file}>Download original Word document ↓</a><button onClick={()=>setReader(null)}>Close</button></div>
      </div>
    </div>}
  </section>;
}
