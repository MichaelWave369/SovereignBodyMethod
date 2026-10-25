/* Scoped service worker generated from this template after Vite builds. */
const BASE=__BASE__;
const REVISION=__REVISION__;
const CORE_LIST=__CORE_URLS__;
const DOCX_LIST=__ORIGINAL_URLS__;
const CORE_CACHE='sbm-offline-core-'+REVISION;
const WORD_CACHE='sbm-offline-word-'+REVISION;
const OWN_PREFIX='sbm-offline-';
const SHELL=BASE+'index.html';

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CORE_CACHE);
    await cache.addAll(CORE_LIST);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const all=await caches.keys();
    await Promise.all(all.filter(n=>n.startsWith(OWN_PREFIX)&&n!==CORE_CACHE&&n!==WORD_CACHE).map(n=>caches.delete(n)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin||!url.pathname.startsWith(BASE))return;
  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try{const response=await fetch(req);if(response.ok)return response;}catch{}
      return await caches.match(SHELL)||Response.error();
    })());
    return;
  }
  event.respondWith((async()=>{
    const cached=await caches.match(req);
    return cached||fetch(req);
  })());
});
async function currentStatus(){
  const core=await caches.open(CORE_CACHE);
  const responses=await Promise.all(CORE_LIST.map(u=>core.match(u).then(Boolean)));
  const downloads=await caches.open(WORD_CACHE);
  const wordResponses=await Promise.all(DOCX_LIST.map(u=>downloads.match(u).then(Boolean)));
  return {ready:responses.every(Boolean),coreCount:responses.filter(Boolean).length,
    coreTotal:CORE_LIST.length,originalCount:wordResponses.filter(Boolean).length,
    originalTotal:DOCX_LIST.length,revision:REVISION};
}
self.addEventListener('message',event=>{
  const port=event.ports&&event.ports[0];
  if(!port)return;
  const send=message=>port.postMessage(message);
  const type=event.data&&event.data.type;
  event.waitUntil((async()=>{
    try{
      if(type==='STATUS')send({type:'DONE',status:await currentStatus()});
      else if(type==='SAVE_ORIGINALS'){
        const cache=await caches.open(WORD_CACHE);
        let done=0;
        for(const path of DOCX_LIST){
          if(!await cache.match(path)){
            const response=await fetch(path,{cache:'no-store'});
            if(!response.ok)throw Error('Cannot download original: '+path+' ('+response.status+')');
            await cache.put(path,response);
          }
          done++;
          send({type:'PROGRESS',done,total:DOCX_LIST.length});
        }
        send({type:'DONE',status:await currentStatus()});
      }else if(type==='CLEAR_ORIGINALS'){
        await caches.delete(WORD_CACHE);
        send({type:'DONE',status:await currentStatus()});
      }else send({type:'ERROR',message:'Unknown offline command'});
    }catch(error){send({type:'ERROR',message:String(error&&error.message||error)});}
  })());
});
