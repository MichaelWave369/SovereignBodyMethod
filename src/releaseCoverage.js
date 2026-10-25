/**
 * Crosswalk of the nine product listings in the owners' October 2026
 * Gumroad dashboard screenshot against the approved manuscript ZIP.
 * This is an evidence ledger, NOT a reconstruction of unavailable
 * proprietary product downloads or a medical endorsement.
 */
export const releaseCoverage=[
 {
  id:'budget',title:'Budget Wellness Guide',
  subtitle:'Eat clean & supplement smart at any income level',
  status:'partial',statusText:'Source sections available · standalone unverified',
  detail:'Reference appendices include college, RV-living and standard grocery-budget plans. The exact separate Gumroad package and any updated price lists are not present as a confirmed standalone source.',
  sources:[{id:'reference',title:'Budget sections · Reference Appendices'}],
  anchor:'#library'
 },
 {
  id:'sound',title:'Sound Healing & Crystal Energy',
  subtitle:'Frequency references, crystal practices & rituals',
  status:'partial',statusText:'Related original guides · bundle unverified',
  detail:'Original frequency tables and crystal/energy practices are published. The advertised standalone sound-healing product and its exact six-ritual package cannot be confirmed from this ZIP alone. Sound frequencies and energetic healing claims are spiritual interpretations, not established treatments.',
  sources:[{id:'reference',title:'Sound frequencies · Reference Appendices'},{id:'crystals',title:'Crystal & Energy Work'},{id:'channels',title:'Sacred Channels'}],
  anchor:'#sound-studio'
 },
 {
  id:'herbs',title:'Supplement & Herb Mastery Guide',
  subtitle:'Supplements, herbs, tinctures & essential oils',
  status:'partial',statusText:'Related source material · stack unverified',
  detail:'Several published original manuscripts cover herbs, tinctures, supplements and oil pairings. The exact advertised standalone full stack and hormone-oriented instructions are not verified. Supplement amounts and herbal claims require independent safety review.',
  sources:[{id:'reference',title:'Supplement notes · Reference Appendices'},{id:'herbals',title:'Complete Herbals Guide'},{id:'herbal-sacred',title:'Sacred Herbal Medicine'},{id:'tinctures',title:'Herbal Medicine & Tinctures'},{id:'herbals-addendum',title:'Herbals Guide · Additional Recipes'}],
  anchor:'#library'
 },
 {
  id:'exercise',title:'Detailed Exercise Protocols',
  subtitle:'Breathing, Tibetan Rites, Qigong, Tai Chi & strength',
  status:'partial',statusText:'23 written protocols · diagrams unverified',
  detail:'The written 23-technique guide is in the ZIP and is available through Movement Studio. However, the supplied Word document contains no embedded diagram images, despite the Gumroad listing advertising visual diagrams.',
  sources:[{id:'movement',title:'Original Detailed Exercise Protocols'}],
  anchor:'#movement'
 },
 {
  id:'complete',title:'Complete 30-Day Health Transformation',
  subtitle:'All smoothies, salads, dinners & 28-day infused water',
  status:'major',statusText:'Core recipe and water content confirmed',
  detail:'The approved archive includes 90 detailed recipes, an original 28-day infused-water calendar, and the foundational teaching manual. Exact Gumroad bundle packaging and any bonus visual assets have not been independently verified.',
  sources:[{id:'core-manual',title:'Foundational Health Manual'},{id:'complete-recipes',title:'Complete Recipe Appendix'},{id:'infused-water',title:'Fruit & Herb Infused Water'}],
  anchor:'#meals'
 },
 {
  id:'week4',title:'Week 4 Completion Pack',
  subtitle:'Original days 22–30 · nine days in the source',
  status:'covered',statusText:'Original weekly manuscript included',
  detail:'All 27 recipes for days 22–30 appear in the fourth-week source manuscript, with complete steps and original variations.',
  sources:[{id:'week-four',title:'Week 4 Recipes'}],
  anchor:'#meals'
 },
 {
  id:'week3',title:'Week 3 Deep Dive Pack',
  subtitle:'Original days 15–21',
  status:'covered',statusText:'Original weekly manuscript included',
  detail:'All 21 original recipes for days 15–21 are available in the searchable meal planner and as the source Word document.',
  sources:[{id:'week-three',title:'Week 3 Recipes'}],
  anchor:'#meals'
 },
 {
  id:'week2',title:'Week 2 Momentum Pack',
  subtitle:'Original days 8–14',
  status:'covered',statusText:'Original weekly manuscript included',
  detail:'All 21 original recipes for days 8–14 are available in the searchable meal planner and as the source Word document.',
  sources:[{id:'week-two',title:'Week 2 Recipes'}],
  anchor:'#meals'
 },
 {
  id:'week1',title:'Week 1 Kickstart Pack',
  subtitle:'Original days 1–7',
  status:'covered',statusText:'Original weekly manuscript included',
  detail:'All 21 original recipes for days 1–7 are available in the searchable meal planner and as the source Word document.',
  sources:[{id:'week-one',title:'Week 1 Recipes'}],
  anchor:'#meals'
 }
];
export const verifiedSourceIds=new Set([
 'reference','crystals','channels','herbals','herbal-sacred','tinctures',
 'herbals-addendum','movement','core-manual','complete-recipes','infused-water',
 'week-four','week-three','week-two','week-one'
]);
