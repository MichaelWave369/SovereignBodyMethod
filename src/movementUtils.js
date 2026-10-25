/** Source-preserving helpers: no generated exercise techniques or claims. */
export const PRACTICE_TYPES=[
  {key:'All',label:'All'},
  {key:'Opening Practices',label:'Breathing'},
  {key:'Tibetan Rites',label:'Tibetan Rites'},
  {key:'Qigong',label:'Qigong'},
  {key:'Tai Chi',label:'Tai Chi'},
  {key:'Modern Movement',label:'Strength, dance & rest'}
];
export const BREATH_PATTERNS=[
  {id:'369',title:'3-6-9 breathing',sourceTitle:'3-6-9 Breathing Technique',
   phases:[{name:'Inhale gently',seconds:3},{name:'Pause gently',seconds:6},{name:'Exhale naturally',seconds:9}]},
  {id:'box',title:'Box breathing',sourceTitle:'Box Breathing (4-4-4-4)',
   phases:[{name:'Inhale gently',seconds:4},{name:'Pause gently',seconds:4},{name:'Exhale naturally',seconds:4},{name:'Pause gently',seconds:4}]}
];
export function practiceForDay(day,schedule){
  if(!Number.isInteger(day)||day<1||day>30)return null;
  return schedule?.cycles?.[(day-1)%3]||null;
}
export function visiblePractices(protocols,category,query){
  const term=query.trim().toLocaleLowerCase();
  return protocols.filter(p=>(category==='All'||p.category===category)&&
    (!term||[p.title,p.description,p.category,p.section,p.duration,...p.steps,...p.modifications].join(' ').toLocaleLowerCase().includes(term)));
}
export function readMovementDone(raw){
  try{
    const data=JSON.parse(raw||'[]');
    return new Set(Array.isArray(data)?data.filter(n=>Number.isInteger(n)&&n>=1&&n<=30):[]);
  }catch{return new Set()}
}
export function readPracticeBookmarks(raw){
  try{
    const data=JSON.parse(raw||'[]');
    return new Set(Array.isArray(data)?data.filter(id=>typeof id==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)):[]);
  }catch{return new Set()}
}
export function cycleForDay(day){
  if(!Number.isInteger(day)||day<1||day>30)return null;
  return ((day-1)%3)+1;
}
