import {useCallback,useEffect,useState} from 'react';
import {sendOfflineCommand} from './offlineClient.js';
import './offlineKitchen.css';

const supported=()=>import.meta.env.PROD&&typeof navigator!=='undefined'&&'serviceWorker' in navigator;

export default function OfflineKitchen(){
  const [status,setStatus]=useState(null);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [progress,setProgress]=useState(null);
  const [isOnline,setIsOnline]=useState(()=>navigator.onLine);
  const [installPrompt,setInstallPrompt]=useState(null);

  const refresh=useCallback(async()=>{
    if(!supported())return;
    try{
      setStatus(await sendOfflineCommand('STATUS'));
      setError('');
    }catch(e){setError(String(e.message||e));}
  },[]);
  useEffect(()=>{
    const connection=()=>{setIsOnline(navigator.onLine);refresh()};
    const install=event=>{event.preventDefault();setInstallPrompt(event)};
    const installed=()=>setInstallPrompt(null);
    window.addEventListener('online',connection);
    window.addEventListener('offline',connection);
    window.addEventListener('beforeinstallprompt',install);
    window.addEventListener('appinstalled',installed);
    navigator.serviceWorker?.addEventListener('controllerchange',refresh);
    refresh();
    return()=>{
      window.removeEventListener('online',connection);
      window.removeEventListener('offline',connection);
      window.removeEventListener('beforeinstallprompt',install);
      window.removeEventListener('appinstalled',installed);
      navigator.serviceWorker?.removeEventListener('controllerchange',refresh);
    };
  },[refresh]);

  async function perform(action){
    setBusy(true);setError('');setProgress(null);
    try{
      const next=await sendOfflineCommand(action,(done,total)=>setProgress({done,total}));
      setStatus(next);
    }catch(e){setError(String(e.message||e))}
    finally{setBusy(false);setProgress(null)}
  }
  async function install(){
    if(!installPrompt)return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  }
  const ready=status?.ready===true;
  const originalCount=status?.originalCount||0;
  const originalTotal=status?.originalTotal||0;
  return <aside id="offline-access" className="offline-kitchen" aria-labelledby="offline-kitchen-title">
    <div className="offline-kitchen-heading">
      <span className="offline-symbol" aria-hidden="true">✳</span>
      <div>
        <p className="eyebrow">OFFLINE KITCHEN · ORIGINALS ON YOUR DEVICE</p>
        <h3 id="offline-kitchen-title">Good food shouldn't need a signal.</h3>
        <p>On a supported browser, one complete online visit saves the app, all 90 original recipes, and the 21 browser-readable manuscripts for offline access.</p>
      </div>
    </div>
    <div className="offline-kitchen-details">
      <div className="offline-state">
        <span aria-hidden="true" className={'offline-dot '+(ready?'offline-ready':'')}/>
        <strong>{!supported()?'Offline mode needs the published HTTPS site':ready?'Offline reading ready':error?'Offline setup needs attention':'Preparing offline access'}</strong>
        <span>{isOnline?'Connected':'No internet detected'}</span>
      </div>
      <p role="status" className="offline-kitchen-note">{ready?
        'The original recipes, meal planner, shopping tools and readable manuscripts are now cached on this device. Favorites and grocery checkmarks remain in your browser.':
        'Keep this page open while connected until all core offline files are saved. Browser settings can evict stored content.'}</p>
      {status&&<p className="offline-kitchen-counter">{status.coreCount} / {status.coreTotal} app and reader assets cached · {originalCount} / {originalTotal} Word originals downloaded</p>}
      {error&&<p role="alert" className="offline-kitchen-error">{error}</p>}
      {progress&&<p role="status" className="offline-kitchen-counter">Saving original Word downloads: {progress.done} / {progress.total}</p>}
      <div className="offline-actions">
        <button type="button" onClick={refresh} disabled={!supported()||busy}>Check offline status</button>
        {originalTotal>0&&originalCount<originalTotal&&
          <button type="button" onClick={()=>perform('SAVE_ORIGINALS')} disabled={!ready||!isOnline||busy}>{busy?'Saving…':'Save all Word originals'}</button>}
        {originalCount>0&&<button className="offline-outline" type="button" onClick={()=>perform('CLEAR_ORIGINALS')} disabled={busy}>Remove saved Word files</button>}
        {installPrompt&&<button type="button" onClick={install}>Install this app</button>}
      </div>
      <p className="offline-kitchen-small">Word downloads are optional and need extra storage. Offline access must first be prepared while online; browser storage is not permanent. To install on iPhone/iPad, use Add to Home Screen. This is a browser PWA, not yet a bootable PhiOS/USB edition.</p>
    </div>
  </aside>;
}
