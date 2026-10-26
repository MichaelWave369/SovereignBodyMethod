/**
 * Reader Desk state: opt-in bookmarks and last-reading spots for the 21
 * public original manuscripts. No account, tracking, personal notes,
 * medical fields or source text beyond a short local source locator.
 */
import {archiveDocuments} from './archiveCatalog.js';

export const READING_DESK_KEY='sovereign-body-method.library.reading-desk.v1';
export const READING_DESK_LIMIT=10;
const ids=new Set(archiveDocuments.map(doc=>doc.id));
const plain=obj=>obj!==null&&typeof obj==='object'&&!Array.isArray(obj)&&Object.getPrototypeOf(obj)===Object.prototype;
const owns=(obj,keys)=>Object.keys(obj).every(k=>keys.includes(k));
export function validateReadingLocation(value){
 if(!plain(value)||!owns(value,['position','probe','ratio'])||
    !Number.isInteger(value.position)||value.position<0||value.position>50000||
    typeof value.probe!=='string'||value.probe.trim().length<2||value.probe.length>140||
    /[\u0000-\u001f\u007f]/.test(value.probe)||
    typeof value.ratio!=='number'||!Number.isFinite(value.ratio)||
    value.ratio<0||value.ratio>1)throw Error('Invalid original manuscript reading location');
 return true;
}
export function validateReadingDesk(value){
 if(!plain(value)||Object.keys(value).length>21)throw Error('Invalid reading desk shape');
 for(const [id,record] of Object.entries(value)){
  if(!ids.has(id)||!plain(record)||!owns(record,['last','bookmarks'])||
    !Array.isArray(record.bookmarks)||record.bookmarks.length>READING_DESK_LIMIT){
   throw Error('Invalid reading desk manuscript');
  }
  if(record.last!==null&&record.last!==undefined)validateReadingLocation(record.last);
  for(const bookmark of record.bookmarks)validateReadingLocation(bookmark);
  const keys=record.bookmarks.map(x=>x.position+':'+x.probe);
  if(new Set(keys).size!==keys.length)throw Error('Duplicate manuscript bookmark');
 }
 return true;
}
export function readReadingDesk(raw){
 try{
  if(!raw||typeof raw!=='string'||raw.length>75000)return {};
  const obj=JSON.parse(raw);
  validateReadingDesk(obj);
  return obj;
 }catch{return {}}
}
export function readingBookmarkCount(desk){
 return Object.values(desk).reduce((sum,record)=>sum+record.bookmarks.length,0);
}
function nextRecord(desk,id){
 if(!ids.has(id))throw Error('Unknown original manuscript');
 return desk[id]||{last:null,bookmarks:[]};
}
export function saveReadingLocation(desk,id,location){
 validateReadingDesk(desk);validateReadingLocation(location);
 const old=nextRecord(desk,id);
 return {...desk,[id]:{last:location,bookmarks:old.bookmarks}};
}
export function toggleReadingBookmark(desk,id,location){
 validateReadingDesk(desk);validateReadingLocation(location);
 const old=nextRecord(desk,id);
 const existing=old.bookmarks.findIndex(x=>x.position===location.position&&x.probe===location.probe);
 const bookmarks=existing>=0?old.bookmarks.filter((_,i)=>i!==existing):
  [...old.bookmarks,location];
 if(bookmarks.length>READING_DESK_LIMIT)throw Error('Ten saved passages per book is the current limit.');
 return {...desk,[id]:{last:old.last??null,bookmarks}};
}
export function deleteReadingBookmark(desk,id,position,probe){
 validateReadingDesk(desk);
 const old=nextRecord(desk,id);
 return {...desk,[id]:{last:old.last??null,
  bookmarks:old.bookmarks.filter(x=>!(x.position===position&&x.probe===probe))}};
}
