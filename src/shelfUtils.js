/**
 * My Sovereign Shelf is only a view over existing, browser-local preferences.
 * No new profile, account, health metric, or server synchronization.
 */
import {readFavorites,readChecked} from './mealUtils.js';
import {readPracticeBookmarks,readMovementDone} from './movementUtils.js';
import {readSavedReadingList} from './botanicalUtils.js';
import {readReadingDesk,readingBookmarkCount} from './readingDesk.js';
import {archiveDocuments} from './archiveCatalog.js';
import {completedFromStorage} from './method.js';
import {waterCompletion} from './hydrationUtils.js';

export const SHELF_UPDATED='sovereign-body-method:shelf-updated';
export const SHELF_OPEN='sovereign-body-method:open-saved';
export const SAVED_KEYS=Object.freeze({
 recipes:'sovereign-body-method.meals.favorites.v1',
 movements:'sovereign-body-method.movement.bookmarks.v1',
 botanicals:'sovereign-body-method.botanicals.reading-list.v1',
 manuscripts:'sovereign-body-method.library.reading-desk.v1',
 reflections:'sovereign-body-method.days.v1',
 movementDone:'sovereign-body-method.movement.done.v1',
 waterDone:'sovereign-body-method.hydration.done.v1',
 shopping:'sovereign-body-method.meals.shopping.v1',
 pantry:'sovereign-body-method.meals.pantry.v1'
});
const knownBooks=new Set(archiveDocuments.map(x=>x.id));
const read=(storage,key)=>{try{return storage.getItem(key)}catch{return null}};
export function loadShelfState(storage){
 const bookmarks=readReadingDesk(read(storage,SAVED_KEYS.manuscripts));
 return {
  recipeIds:readFavorites(read(storage,SAVED_KEYS.recipes)),
  movementIds:readPracticeBookmarks(read(storage,SAVED_KEYS.movements)),
  botanicalIds:readSavedReadingList(read(storage,SAVED_KEYS.botanicals)),
  manuscripts:Object.fromEntries(Object.entries(bookmarks).filter(([id,r])=>
    knownBooks.has(id)&&(r.last||r.bookmarks.length))),
  reflections:completedFromStorage(read(storage,SAVED_KEYS.reflections)),
  movementDone:readMovementDone(read(storage,SAVED_KEYS.movementDone)),
  waterDone:waterCompletion(read(storage,SAVED_KEYS.waterDone)),
  shopping:readChecked(read(storage,SAVED_KEYS.shopping)),
  pantry:readChecked(read(storage,SAVED_KEYS.pantry))
 };
}
export function shelfTotals(shelf){
 const manuscriptPassages=readingBookmarkCount(shelf.manuscripts);
 const manuscriptBooks=Object.keys(shelf.manuscripts).length;
 const touched=new Set([...shelf.reflections,...shelf.movementDone,...shelf.waterDone]);
 return {
  recipes:shelf.recipeIds.size,movements:shelf.movementIds.size,
  botanical:shelf.botanicalIds.size,manuscriptBooks,manuscriptPassages,
  daysTouched:touched.size,shopping:shelf.shopping.size,pantry:shelf.pantry.size
 };
}
export function selectedShelfEntries(savedIds,catalog){
 const map=new Map(catalog.map(item=>[item.id,item]));
 return [...savedIds].map(id=>map.get(id)).filter(Boolean);
}
export function selectedShelfManuscripts(shelf){
 const map=new Map(archiveDocuments.map(doc=>[doc.id,doc]));
 return Object.entries(shelf.manuscripts).map(([id,record])=>({
  ...map.get(id),last:record.last??null,bookmarks:record.bookmarks
 }));
}
export function savedDays(shelf){
 return [...new Set([...shelf.reflections,...shelf.movementDone,...shelf.waterDone])]
   .filter(day=>Number.isInteger(day)&&day>=1&&day<=30).sort((a,b)=>a-b);
}
