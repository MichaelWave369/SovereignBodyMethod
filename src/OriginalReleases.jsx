import {releaseCoverage} from './releaseCoverage.js';
import './originalReleases.css';

export default function OriginalReleases(){
 const covered=releaseCoverage.filter(x=>x.status==='covered').length;
 const source=(id)=>import.meta.env.BASE_URL+'library/originals/'+encodeURIComponent(id)+'.docx';
 return <section className="release-crosswalk" id="original-releases" aria-labelledby="releases-heading">
   <div className="release-intro"><div><p className="eyebrow">ARCHIVE INVENTORY / ORIGINAL GUMROAD COLLECTION</p>
    <h3 id="releases-heading">Nine original releases.<br/><em>One free home.</em></h3>
    <p>We compared the nine items in the creators' original Gumroad dashboard with the approved ZIP. This is a transparent guide to what has been recovered, what is available as a related chapter, and which advertised extras aren't yet verified.</p></div>
    <div className="release-count"><strong>9</strong><span>LISTINGS CHECKED</span></div>
   </div>
   <p className="release-inventory-note">Four weekly recipe manuscripts are fully accounted for. Other releases may combine material from several documents and cannot be certified as exact copies of their original purchase bundles. No unavailable diagrams, downloads or medical evidence are being invented.</p>
   <div className="release-grid">
    {releaseCoverage.map((entry,index)=><article className="release-entry" key={entry.id}>
      <div className="release-meta"><span>{String(index+1).padStart(2,'0')} / 09</span><span className={'release-status release-'+entry.status}>{entry.statusText}</span></div>
      <h4>{entry.title}</h4>
      <p className="release-subtitle">{entry.subtitle}</p>
      <p className="release-detail">{entry.detail}</p>
      <h5>Original documents available here</h5>
      <ul>{entry.sources.map(file=><li key={file.id}><a href={source(file.id)} download>{file.title} <span aria-hidden="true">↓</span></a></li>)}</ul>
      <a className="release-explore" href={entry.anchor}>Explore the free site section →</a>
    </article>)}
   </div>
   <p className="release-endnote">This catalog records source coverage only, not permission to resell or alter the creators' material. Supplement and herbal instructions, sound-healing claims, planetary interpretations, and crystal-energy practices are archival authorial content, not proven clinical treatments. Older grocery-budget figures may not reflect today's prices.</p>
 </section>;
}
