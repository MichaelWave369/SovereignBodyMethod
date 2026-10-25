import { useEffect,useMemo,useState } from 'react';
import {archiveDocuments,archiveCategories} from './archiveCatalog.js';
import './archive.css';

const defaultItems = archiveDocuments.map(d=>({...d,available:false}));
const root = import.meta.env.BASE_URL+'library/';
export default function ArchiveLibrary(){
  const [items,setItems]=useState(defaultItems);
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('All');
  const [reader,setReader]=useState(null);
  const [body,setBody]=useState(null);
  const [loading,setLoading]=useState(false);
  const available=items.filter(d=>d.available).length;
  useEffect(()=>{
    let active=true;
    fetch(root+'catalog.json').then(r=>{if(!r.ok)throw new Error('Catalog unavailable');return r.json()})
      .then(data=>{if(active&&Array.isArray(data.documents))setItems(data.documents)})
      .catch(()=>{});return()=>{active=false};
  },[]);
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
      <input id="archive-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search document titles and text..." type="search" />
      <label htmlFor="archive-filter" className="sr-only">Filter by category</label>
      <select id="archive-filter" value={category} onChange={e=>setCategory(e.target.value)}>
        {archiveCategories.map(c=><option key={c}>{c}</option>)}
      </select>
    </div>
    <p className="archive-status" role="status">{available ? `${available} of ${items.length} canonical originals currently readable.` : 'Originals inventoried. Online reading and download will activate when the approved source ZIP is added to the repository.'} {filtered.length} matches.</p>
    <div className="archive-entries">{filtered.map((d,index)=><article className="archive-entry" key={d.id}>
      <div className="archive-entry-n"><span>{String(index+1).padStart(2,'0')}</span><small>{d.category}</small></div>
      <h4>{d.title}</h4><p>{d.description}</p>
      {d.caution&&<p className="archive-caution">{d.caution}</p>}
      <div className="archive-entry-actions">{d.available
        ? <><button onClick={()=>setReader(d)}>Read original →</button><a href={root+'originals/'+encodeURIComponent(d.id)+'.docx'} download={d.file}>Download DOCX ↓</a></>
        : <span className="archive-pending">SOURCE AWAITING IMPORT</span>}</div>
      </article>)}</div>
    {!filtered.length&&<p className="archive-no-results">No matching documents. Try another search or category.</p>}
    {reader&&<div className="archive-modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setReader(null)}}>
      <div className="archive-modal" role="dialog" aria-modal="true" aria-label={'Original manuscript: '+reader.title} aria-busy={loading}>
        <div className="archive-modal-header"><div><span className="eyebrow">ORIGINAL MANUSCRIPT / {reader.category.toUpperCase()}</span><h3>{reader.title}</h3><p>Source file: {reader.file}</p></div><button aria-label="Close original manuscript" onClick={()=>setReader(null)}>×</button></div>
        <div className="archive-reader">
          <div className="archive-reader-notice"><strong>Read with context.</strong> Preserved archival material may include traditional health claims, specific herbs, dosages, spiritual interpretations or experimental routines. It is not medical advice. Speak with a qualified clinician about health decisions, medications and supplements. {reader.caution||''}</div>
          {loading&&<p>Loading original manuscript…</p>}
          {body?.error&&<p role="alert">{body.error}</p>}
          {body?.html&&<div className="archive-manuscript" dangerouslySetInnerHTML={{__html:body.html}}/>}
          {body?.converterNotes?.length>0&&<details className="archive-conversion"><summary>Conversion notes</summary><ul>{body.converterNotes.map((n,i)=><li key={i}>{n}</li>)}</ul></details>}
        </div>
        <div className="archive-modal-footer"><a href={root+'originals/'+encodeURIComponent(reader.id)+'.docx'} download={reader.file}>Download original Word document ↓</a><button onClick={()=>setReader(null)}>Close</button></div>
      </div>
    </div>}
  </section>;
}
