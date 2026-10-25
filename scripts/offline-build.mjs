/** Build-only generator. Original recipes and manuscripts are already imported. */
import {readdir,readFile,writeFile,stat,unlink} from 'node:fs/promises';
import {resolve,join,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';

export const BASE='/SovereignBodyMethod/';
export function planFromFiles(files,base=BASE){
  if(!/^\/[A-Za-z0-9/_-]+\/$/.test(base))throw Error('Invalid site base');
  const core=new Set([base]);
  const originals=[];
  for(const path of files){
    if(typeof path!=='string'||path.startsWith('/')||path.includes('\\')||path.split('/').some(x=>x==='..'||x===''||x==='.'))throw Error('Unsafe build path: '+path);
    if(path==='sw.js'||path==='sw-template.js'||path.startsWith('content/')||path.startsWith('source/'))continue;
    if(path.startsWith('library/originals/')&&path.endsWith('.docx'))originals.push(base+path);
    else core.add(base+path);
  }
  for(const required of ['index.html','site.webmanifest','meals/recipes.json','library/catalog.json']){
    if(!core.has(base+required))throw Error('Missing critical offline asset: '+required);
  }
  if(new Set(originals).size!==originals.length)throw Error('Duplicate Word asset');
  return {core:[...core].sort(),originals:originals.sort()};
}
async function walk(root,at=root){
  const found=[];
  for(const entry of await readdir(at,{withFileTypes:true})){
    const p=join(at,entry.name);
    if(entry.isDirectory())found.push(...await walk(root,p));
    else if(entry.isFile())found.push(relative(root,p).split(sep).join('/'));
  }
  return found;
}
export function serviceWorkerSource(template,plan,revision,base=BASE){
  if(!/^[0-9a-f]{12,32}$/.test(revision))throw Error('Invalid revision');
  const bindings={
    '__BASE__':JSON.stringify(base),
    '__REVISION__':JSON.stringify(revision),
    '__CORE_URLS__':JSON.stringify(plan.core),
    '__ORIGINAL_URLS__':JSON.stringify(plan.originals)
  };
  let result=template;
  for(const [key,value] of Object.entries(bindings)){
    if(!result.includes(key))throw Error('Missing template token '+key);
    result=result.replaceAll(key,value);
  }
  return result;
}
export async function generateOfflineAssets(distDir='dist'){
  const root=resolve(distDir);
  const files=await walk(root);
  const plan=planFromFiles(files);
  const hash=createHash('sha256');
  for(const path of files.filter(p=>p!=='sw.js').sort()){
    const file=join(root,path);
    hash.update(path+' '+(await stat(file)).size+' ');
    hash.update(await readFile(file));
  }
  const revision=hash.digest('hex').slice(0,14);
  const template=await readFile(join(root,'sw-template.js'),'utf8');
  await writeFile(join(root,'sw.js'),serviceWorkerSource(template,plan,revision),'utf8');
  await unlink(join(root,'sw-template.js'));
  console.log('Offline Kitchen:',plan.core.length,'cached core assets,',plan.originals.length,'optional Word originals');
  return {...plan,revision};
}
