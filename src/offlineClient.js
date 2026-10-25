/** Browser bridge for this site's own scoped service worker. */
export async function registerOfflineWorker(){
  if(!import.meta.env.PROD||!('serviceWorker' in navigator))return null;
  return navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js',{
    scope:import.meta.env.BASE_URL,
    updateViaCache:'none'
  });
}
export async function sendOfflineCommand(type,onProgress=()=>{}){
  if(!('serviceWorker' in navigator))throw Error('Service workers are unavailable on this browser.');
  const ready=await Promise.race([
    navigator.serviceWorker.ready,
    new Promise((_,reject)=>setTimeout(()=>reject(Error('Offline setup did not finish. Reopen the site while online.')),25000))
  ]);
  const worker=ready.active;
  if(!worker)throw Error('Offline worker has not yet activated.');
  return new Promise((resolve,reject)=>{
    const channel=new MessageChannel();
    let timer=null;
    function settle(fn,value){clearTimeout(timer);channel.port1.close();fn(value)}
    function arm(){
      clearTimeout(timer);
      timer=setTimeout(()=>settle(reject,Error('Offline operation timed out. Reconnect and try again.')),120000);
    }
    arm();
    channel.port1.onmessage=event=>{
      const data=event.data||{};
      if(data.type==='PROGRESS'){arm();onProgress(data.done,data.total)}
      else if(data.type==='DONE')settle(resolve,data.status);
      else if(data.type==='ERROR')settle(reject,Error(data.message||'Offline action failed.'));
    };
    worker.postMessage({type},[channel.port2]);
  });
}
