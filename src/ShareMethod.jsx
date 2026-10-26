import {useMemo,useRef,useState} from 'react';
import {canonicalShareLink,dayShareLink,PUBLIC_SITE} from './shareLinks.js';
import './shareMethod.css';
export default function ShareMethod({mode='site',day=null}){
 const [notice,setNotice]=useState('');
 const input=useRef(null);
 const url=useMemo(()=>{
   if(typeof window==='undefined')return PUBLIC_SITE;
   return mode==='day'?dayShareLink(window.location.origin,import.meta.env.BASE_URL,day):
     canonicalShareLink(window.location.origin,import.meta.env.BASE_URL);
 },[mode,day]);
 const title=mode==='day'?'Sovereign Body Method · Day '+day:'The Sovereign Body Method · Free for Everyone';
 const subtitle=mode==='day'?
   'Share this public daily plan. Its original recipes and guides are open to anyone, but your personal progress is never included.':
   'Pass the complete original collection along. No signup, paywall or referral tracking.';
 async function copy(){
   try{
     if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
     await navigator.clipboard.writeText(url);
     setNotice('Public link copied. Personal saved information is not included.');
   }catch{
     input.current?.focus();
     input.current?.select();
     setNotice('Select and copy the public URL shown here. Automatic copying was blocked.');
   }
 }
 async function share(){
   if(typeof navigator.share!=='function'){await copy();return}
   try{
     await navigator.share({title,text:mode==='day'?'The free Sovereign Body Method, Day '+day:
       'The original Sovereign Body Method, shared for free.',url});
     setNotice('The device share sheet was opened.');
   }catch(error){
     if(error?.name!=='AbortError')setNotice('Device sharing is unavailable here. You can copy the public link.');
   }
 }
 return <aside className={'share-method share-'+mode} aria-label={mode==='day'?'Share this public day':'Share the free Method'}>
   <div className="share-method-intro">
     <p className="eyebrow">{mode==='day'?'SEND ONE DAY / NOTHING PERSONAL':'SHARE THE WHOLE FREE METHOD'}</p>
     <h3>{mode==='day'?'Pass this day along.':'Give the originals a wider home.'}</h3>
     <p>{subtitle}</p>
   </div>
   <div className="share-method-actions">
     <label htmlFor={'share-public-'+mode}>PUBLIC LINK</label>
     <input ref={input} id={'share-public-'+mode} value={url} readOnly onFocus={e=>e.target.select()}/>
     <div>
       <button type="button" onClick={copy}>Copy public link</button>
       {typeof navigator!=='undefined'&&typeof navigator.share==='function'&&
        <button type="button" className="share-method-native" onClick={share}>Share with device ↗</button>}
     </div>
     {notice&&<p className="share-method-notice" role="status">{notice}</p>}
   </div>
 </aside>;
}
