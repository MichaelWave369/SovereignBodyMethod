import {useState} from 'react';
import {makePocketBackup,parsePocketBackup,restorePocketBackup,pocketSummary,MAX_BACKUP_BYTES} from './pocketBackup.js';
import './pocketPanel.css';

function BackupStats({summary}){
 return <div className="pocket-stats">
  <span><strong>{summary.savedGroups}</strong> local categories</span>
  <span><strong>{summary.reflections}</strong> reflections</span>
  <span><strong>{summary.movements}</strong> movement notes</span>
  <span><strong>{summary.water}</strong> water notes</span>
  <span><strong>{summary.favorites}</strong> favorite recipes</span>
  <span><strong>{summary.shopping+summary.pantry}</strong> grocery checks</span>
  <span><strong>{summary.reading}</strong> reading bookmarks</span>
  {summary.hasBudgets&&<span>Personal budget values included</span>}
 </div>;
}

export default function PocketPanel({day,onPrint}){
 const [message,setMessage]=useState('');
 const [preview,setPreview]=useState(null);
 const [confirm,setConfirm]=useState(false);

 function exportBackup(){
  try{
   const backup=makePocketBackup(window.localStorage);
   if(!Object.keys(backup.entries).length)throw Error('No saved local preferences were found.');
   const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob);
   const anchor=document.createElement('a');
   const stamp=new Date().toISOString().slice(0,10);
   anchor.href=url;
   anchor.download='SovereignBodyMethod-Pocket-'+stamp+'.json';
   anchor.style.display='none';
   document.body.appendChild(anchor);
   anchor.click();
   anchor.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1000);
   setMessage('Backup downloaded to your device. Keep it somewhere private; it can contain grocery spending details.');
  }catch(error){setMessage('Backup could not be downloaded: '+error.message);}
 }
 async function chooseFile(event){
  const file=event.target.files?.[0];
  event.target.value='';
  setPreview(null);setConfirm(false);
  if(!file)return;
  if(file.size>MAX_BACKUP_BYTES){setMessage('File is too large. Pocket backups are limited to 512 KB.');return}
  try{
   const parsed=parsePocketBackup(await file.text());
   setPreview({document:parsed,name:file.name,summary:pocketSummary(parsed)});
   setMessage('Backup checked. Review the categories below before choosing to replace this device’s saved progress.');
  }catch(error){setMessage('This backup cannot be restored: '+error.message);}
 }
 function restore(){
  if(!preview||!confirm)return;
  try{
   const count=restorePocketBackup(window.localStorage,preview.document);
   setMessage('Restored '+count+' saved categories. Reloading to synchronize all sections.');
   // Reload is deliberate: all existing tools initialize local state only on mount.
   window.location.reload();
  }catch(error){setMessage('Restore failed: '+error.message);}
 }
 return <section className="pocket-panel" aria-labelledby="pocket-heading">
  <div className="pocket-head"><div><p className="eyebrow">SOVEREIGN POCKET · YOUR DATA, YOUR DEVICE</p>
   <h3 id="pocket-heading">Take your practice with you.</h3>
   <p>Print today's source-grounded plan or keep a private copy of your progress, saved recipes, shopping checkmarks, reading bookmarks and personal grocery prices. No account and no upload.</p></div>
   <div className="pocket-symbol" aria-hidden="true">✳</div>
  </div>
  <div className="pocket-actions">
   <div className="pocket-action">
    <strong>01 · Keep a paper copy</strong>
    <p>Print Day {String(day).padStart(2,'0')} with its original meals, ingredients, preparation steps, movement rhythm, optional water blend and companion reflection. Choose Save as PDF in the print dialog if you'd rather keep a digital copy.</p>
    <button type="button" onClick={onPrint}>Print today's complete plan ↗</button>
   </div>
   <div className="pocket-action">
    <strong>02 · Back up your personal notes</strong>
    <p>Download one small JSON backup with only this site's approved preferences. No manuscripts, logins, browser cookies or other websites' information.</p>
    <button type="button" onClick={exportBackup}>Download private backup ↓</button>
   </div>
   <div className="pocket-action">
    <strong>03 · Restore an earlier backup</strong>
    <p>Select a Sovereign Pocket JSON file. We'll check the format and show what's inside before making any change.</p>
    <label className="pocket-file">Choose saved backup (.json)
     <input type="file" accept=".json,application/json" onChange={chooseFile}/></label>
   </div>
  </div>
  {preview&&<div className="pocket-preview">
   <h4>Backup ready for review</h4>
   <p><strong>File:</strong> {preview.name} · <strong>Created:</strong> {new Date(preview.document.exportedAt).toLocaleString()}</p>
   <BackupStats summary={preview.summary}/>
   <p><strong>Replacing means replacing:</strong> restoring will overwrite this site's currently saved categories and clear categories absent from the backup. Other websites and unrelated browser storage are not touched. Download your current backup first if you want to preserve it.</p>
   <label className="pocket-consent"><input type="checkbox" checked={confirm} onChange={e=>setConfirm(e.target.checked)}/> I understand that this backup will replace this device's saved Sovereign Body Method data.</label>
   <button type="button" disabled={!confirm} onClick={restore} className="pocket-restore-button">Replace saved data and reload</button>
   <button type="button" onClick={()=>{setPreview(null);setConfirm(false);setMessage('Restore cancelled. No saved data changed.')}} className="pocket-cancel-button">Cancel restore</button>
  </div>}
  <p className="pocket-feedback" role="status">{message}</p>
  <p className="pocket-privacy">Your backup file is stored wherever your browser downloads it, so keep it private. It is not encrypted. Restoring progress is a browser-only operation and does not install the original manuscripts on a new device: open the site online once to prepare its offline library. Saved checkmarks are personal notes, not health measurements.</p>
 </section>;
}
