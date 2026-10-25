/** Original-manuscript mention index. A mention is never a dose, endorsement or verified effect. */
export const manuscriptSources=[
 {id:'herbals',title:'Complete Herbals Guide',filename:'Complete_Herbals_Guide.docx'},
 {id:'herbal-sacred',title:'Sacred Herbal Medicine Appendix',filename:'Complete_Sacred_Herbal_Medicine_Appendix.docx'},
 {id:'tinctures',title:'Herbal Medicine & Tinctures',filename:'Herbal_Medicine_Tinctures_Appendix.docx'},
 {id:'herbals-addendum',title:'Herbals Guide · Additional Recipes',filename:'Herbals Guide.docx'},
 {id:'reference',title:'Reference Appendices',filename:'Reference_Appendices.docx'}
];
export const indexFamilies=[
 {id:'botanical',label:'Plants & botanicals'},
 {id:'oil',label:'Essential oils'},
 {id:'supplement',label:'Nutrients & supplements'}
];
const vocabulary={
 botanical:['Aloe Vera','Ashwagandha','Astragalus','Basil','Burdock','Calendula',
  'Chamomile','Cinnamon','Clove','Comfrey','Dandelion','Echinacea','Elderberry',
  'Fennel','Fenugreek','Garlic','Ginger','Ginkgo','Ginseng','Green Tea','Hawthorn',
  'Hibiscus','Holy Basil','Kava','Lavender','Lemon Balm','Licorice','Marshmallow Root',
  'Milk Thistle','Mugwort','Nettle','Oregano','Passionflower','Peppermint',
  'Red Clover','Rhodiola','Rosemary','Sage','St. John’s Wort','Thyme','Turmeric',
  'Valerian','Yarrow','Yerba Mate','Willow Bark'],
 oil:['Tea Tree Oil','Peppermint Oil','Lavender Oil','Eucalyptus Oil','Frankincense',
  'Myrrh','Lemon Essential Oil','Orange Essential Oil','Clove Oil','Rosemary Oil','Oregano Oil'],
 supplement:['Magnesium','Zinc','Vitamin C','Vitamin D','Vitamin B12','Vitamin B6',
  'Omega-3','CoQ10','Probiotics','Prebiotics','Collagen','Melatonin',
  'L-Theanine','Creatine','NAC','Calcium','Iron','Selenium','Potassium',
  'Vitamin K','Iodine','Vitamin E']
};
const slug=s=>s.toLocaleLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const indexTerms=Object.entries(vocabulary).flatMap(([family,names])=>names.map(name=>({
 id:slug(family+'-'+name),name,family
})));
if(new Set(indexTerms.map(x=>x.id)).size!==indexTerms.length)throw Error('Duplicate index ID');

function textOnly(html){
 if(typeof html!=='string')return '';
 return html.replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/gi,' ')
  .replace(/&amp;/gi,'&').replace(/&#39;|&apos;/gi,"'")
  .replace(/&quot;/gi,'"').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>')
  .replace(/\s+/g,' ').trim().normalize('NFKC');
}
function termExpression(name){
 // Escape regex operators while allowing curly/straight apostrophes.
 const escaped=name.normalize('NFKC').replace(/['’]/g,"~APOS~")
   .replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&').replaceAll('~APOS~',"['’]");
 return new RegExp('(^|[^A-Za-z0-9])'+escaped+'(?=$|[^A-Za-z0-9])','gi');
}
/** The public JSON intentionally contains no excerpt, dosage, protocol or effect claim. */
export function deriveHerbIndex(documents){
 if(!Array.isArray(documents))throw Error('Documents array required');
 const texts=new Map(documents.map(d=>[d.id,textOnly(d.html)]));
 const result=[];
 for(const term of indexTerms){
  const sources=[];
  for(const doc of manuscriptSources){
   const content=texts.get(doc.id)||'';
   const mentions=content?Array.from(content.matchAll(termExpression(term.name))).length:0;
   if(mentions)sources.push({id:doc.id,mentions});
  }
  if(sources.length)result.push({...term,mentions:sources.reduce((n,s)=>n+s.mentions,0),
    sourceCount:sources.length,sources});
 }
 return result.sort((a,b)=>a.name.localeCompare(b.name)||a.family.localeCompare(b.family));
}
