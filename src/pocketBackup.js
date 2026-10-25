/**
 * Versioned, source-free browser backup for the Sovereign Body Method.
 * No cookies, arbitrary localStorage keys, source ZIPs or credentials are copied.
 * All keys and values are allowlisted and strictly validated before any restore.
 */
import {parsePriceInput} from './budgetUtils.js';

export const POCKET_FORMAT='sovereign-body-pocket';
export const POCKET_VERSION=1;
export const MAX_BACKUP_BYTES=512*1024;
export const POCKET_KEYS=Object.freeze([
 'sovereign-body-method.meals.day.v1',
 'sovereign-body-method.days.v1',
 'sovereign-body-method.movement.done.v1',
 'sovereign-body-method.hydration.done.v1',
 'sovereign-body-method.meals.favorites.v1',
 'sovereign-body-method.meals.shopping.v1',
 'sovereign-body-method.meals.pantry.v1',
 'sovereign-body-method.movement.bookmarks.v1',
 'sovereign-body-method.botanicals.reading-list.v1',
 'sovereign-body-method.budget.line-prices.v1',
 'sovereign-body-method.budget.targets.v1'
]);

const dayRe=/^day-(?:[1-9]|[12]\d|30)-(?:smoothie|salad|dinner)$/;
const ingredientRe=/^day-(?:[1-9]|[12]\d|30)-(?:smoothie|salad|dinner)-ingredient-\d{1,3}$/;
const topicRe=/^(?:botanical|oil|supplement)-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const practiceRe=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const targetRe=/^(?:week[1-4]|day-(?:[1-9]|[12]\d|30))$/;

const integerWithin=(x,max)=>Number.isInteger(x)&&x>=1&&x<=max;
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;
function parseJSON(raw,key){
 try{return JSON.parse(raw)}catch{throw Error('Invalid saved JSON for '+key)}
}
function checkArray(raw,key,validate,limit=800){
 const items=parseJSON(raw,key);
 if(!Array.isArray(items)||items.length>limit||items.some(item=>!validate(item)))
  throw Error('Saved values are invalid for '+key);
 return items;
}
function checkPrices(raw,key,target=false){
 const values=parseJSON(raw,key);
 if(!plain(values)||Object.keys(values).length>1400)throw Error('Invalid price map for '+key);
 for(const [entry,amount] of Object.entries(values)){
  if(!(target?targetRe:ingredientRe).test(entry))throw Error('Unexpected saved budget entry');
  if(typeof amount!=='string'&&!(typeof amount==='number'&&Number.isFinite(amount)))throw Error('Invalid saved price');
  if(amount===''&&target)continue;
  if(parsePriceInput(amount)===null)throw Error('Price must be a nonnegative amount with at most two decimal places');
 }
}
export function validatePocketEntry(key,raw){
 if(!POCKET_KEYS.includes(key)||typeof raw!=='string'||raw.length>MAX_BACKUP_BYTES)throw Error('Unrecognized or oversized saved field');
 if(key===POCKET_KEYS[0]){
  if(!/^(?:[1-9]|[12]\d|30)$/.test(raw))throw Error('Invalid selected day');
  return true;
 }
 if([POCKET_KEYS[1],POCKET_KEYS[2],POCKET_KEYS[3]].includes(key)){
  checkArray(raw,key,n=>integerWithin(n,key===POCKET_KEYS[3]?28:30),30);
 }else if(key===POCKET_KEYS[4]){
  checkArray(raw,key,n=>typeof n==='string'&&dayRe.test(n),90);
 }else if([POCKET_KEYS[5],POCKET_KEYS[6]].includes(key)){
  checkArray(raw,key,n=>typeof n==='string'&&ingredientRe.test(n));
 }else if(key===POCKET_KEYS[7]){
  checkArray(raw,key,n=>typeof n==='string'&&practiceRe.test(n),150);
 }else if(key===POCKET_KEYS[8]){
  checkArray(raw,key,n=>typeof n==='string'&&topicRe.test(n),250);
 }else if(key===POCKET_KEYS[9])checkPrices(raw,key);
 else if(key===POCKET_KEYS[10])checkPrices(raw,key,true);
 return true;
}

export function makePocketBackup(storage,date=new Date()){
 const entries={};
 for(const key of POCKET_KEYS){
  const raw=storage.getItem(key);
  if(raw===null)continue;
  validatePocketEntry(key,raw);
  entries[key]=raw;
 }
 return {format:POCKET_FORMAT,version:POCKET_VERSION,exportedAt:date.toISOString(),entries};
}
export function parsePocketBackup(input){
 if(typeof input!=='string'||input.length>MAX_BACKUP_BYTES)throw Error('Backup exceeds 512 KB or is not text');
 const parsed=parseJSON(input,'backup');
 if(!plain(parsed)||parsed.format!==POCKET_FORMAT||parsed.version!==POCKET_VERSION)throw Error('Not a supported Sovereign Pocket backup');
 if(!plain(parsed.entries))throw Error('Missing saved entries');
 const fields=Object.keys(parsed.entries);
 if(fields.length<1||fields.length>POCKET_KEYS.length)throw Error('Backup has no saved preferences or too many fields');
 for(const key of fields)validatePocketEntry(key,parsed.entries[key]);
 if(typeof parsed.exportedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(parsed.exportedAt))throw Error('Missing export timestamp');
 return parsed;
}
export function restorePocketBackup(storage,document){
 const parsed=typeof document==='string'?parsePocketBackup(document):parsePocketBackup(JSON.stringify(document));
 const previous=new Map(POCKET_KEYS.map(key=>[key,storage.getItem(key)]));
 try{
  for(const key of POCKET_KEYS){
   if(Object.hasOwn(parsed.entries,key))storage.setItem(key,parsed.entries[key]);
   else storage.removeItem(key);
  }
 }catch(error){
  for(const [key,value] of previous){
   try{if(value===null)storage.removeItem(key);else storage.setItem(key,value)}catch{}
  }
  throw Error('Restore was interrupted by browser storage limits. Original data was restored where possible. '+String(error?.message||''));
 }
 return POCKET_KEYS.filter(key=>Object.hasOwn(parsed.entries,key)).length;
}
export function pocketSummary(backup){
 const entries=backup.entries;
 const arr=key=>{try{const parsed=JSON.parse(entries[key]||'[]');return Array.isArray(parsed)?parsed.length:0}catch{return 0}};
 return {
  savedGroups:Object.keys(entries).length,
  reflections:arr(POCKET_KEYS[1]),
  movements:arr(POCKET_KEYS[2]),
  water:arr(POCKET_KEYS[3]),
  favorites:arr(POCKET_KEYS[4]),
  shopping:arr(POCKET_KEYS[5]),
  pantry:arr(POCKET_KEYS[6]),
  reading:arr(POCKET_KEYS[7])+arr(POCKET_KEYS[8]),
  hasBudgets:Object.hasOwn(entries,POCKET_KEYS[9])||Object.hasOwn(entries,POCKET_KEYS[10])
 };
}
