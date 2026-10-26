/** Navigation aids written for the website, not recovered author instructions. */
export const entryPaths=[
 {id:'everyday',eyebrow:'A GENTLE FIRST VISIT',title:'Start with one day',
 subtitle:'Choose your pace, without a rigid program.',
 introduction:'Begin with Day 1 if you like. The daily dashboard connects original recipes, a repeating movement rhythm, the optional 28-day water calendar, and a clearly labeled new reflection.',
 steps:[
  {title:'Open Day 1',detail:'See three original daily recipes and the optional movement and water references together.',href:'#daily',action:'day-one',button:'Open Day 1 →'},
  {title:'Read a recipe',detail:'Ingredients and steps come from the actual week-by-week Word manuscripts.',href:'#meals',button:'Browse original meals →'},
  {title:'Explore a practice',detail:'Breathing and movement are optional. Adapt or skip anything uncomfortable.',href:'#movement',button:'Find original movements →'},
  {title:'Keep favorites nearby',detail:'Save recipes, practices and book passages to return to them in My Shelf.',href:'#my-shelf',button:'Visit My Shelf →'}
 ]},
 {id:'food',eyebrow:'NOURISHMENT FIRST',title:'Explore the kitchen',
 subtitle:'Start with food and your own grocery costs.',
 introduction:'No meal is mandatory. Read the actual authored recipes, choose what suits you, and use the shopping and budget tools to plan from prices you enter yourself.',
 steps:[
  {title:'Browse original recipes',detail:'Ninety smoothies, salads and dinners across the original 30-day sequence.',href:'#meals',button:'Open the meal planner →'},
  {title:'Explore flavored water',detail:'The source calendar has 28 days, not 30. It is a flavor guide, not a water quota.',href:'#hydration',button:'View the infused-water calendar →'},
  {title:'Prepare a grocery plan',detail:'The Meals area also contains pantry checklists and a personal price-based budget.',href:'#meals',button:'Open Meals and Shopping →'},
  {title:'Save your selections',detail:'Favorite recipes appear in My Shelf and in a private Sovereign Pocket backup.',href:'#my-shelf',button:'Open My Shelf →'}
 ]},
 {id:'movement',eyebrow:'MOVE AT YOUR OWN PACE',title:'Explore movement & breath',
 subtitle:'Learn what the source manuals actually say.',
 introduction:'Movement Studio preserves source steps and modifications. This is not an individualized exercise prescription; skip any breath hold or movement that causes discomfort.',
 steps:[
  {title:'Find an original practice',detail:'Browse 23 breathing, strength, flow, dance and relaxation practices.',href:'#movement',button:'Explore movement guides →'},
  {title:'Read adaptations',detail:'The historic source includes modifications and claims that are kept separate from evidence.',href:'#movement',button:'Read the original steps →'},
  {title:'See the daily rhythm',detail:'The 30-day view repeats an original three-day training template, not 30 unique prescriptions.',href:'#daily',button:'Open your day →'},
  {title:'Keep a favorite',detail:'Bookmarked practices can be revisited in My Shelf.',href:'#my-shelf',button:'Open My Shelf →'}
 ]},
 {id:'research',eyebrow:'THE ORIGINAL WORDS',title:'Read the manuscripts',
 subtitle:'Explore the full approved source collection.',
 introduction:'Search the 21 approved public manuscripts and judge the sources yourself. Historical spiritual beliefs and health claims are not equivalent to scientific evidence.',
 steps:[
  {title:'Search original passages',detail:'Source Atlas indexes 5,178 passages and links to matching sections of the real books.',href:'#library',button:'Search the source library →'},
  {title:'Review recovery status',detail:'See which of the nine historic products are covered and which extras remain unverified.',href:'#original-releases',button:'View the original releases →'},
  {title:'Save your reading place',detail:'Reading Desk lets you bookmark original passages and resume later.',href:'#library',button:'Open Reading Desk →'},
  {title:'Return to your books',detail:'Saved reading places and passages appear in your private Shelf.',href:'#my-shelf',button:'Open My Shelf →'}
 ]},
 {id:'offline',eyebrow:'ACCESS & PRIVACY',title:'Prepare for offline use',
 subtitle:'Keep the original resources closer to home.',
 introduction:'The site can prepare its original books and tools while connected. Browser caches can be removed, so offline access is useful but not guaranteed permanent.',
 steps:[
  {title:'Check offline readiness',detail:'Visit while online and check Offline Kitchen until all required app files report ready.',href:'#offline-access',button:'Check Offline Kitchen →'},
  {title:'Optionally save Word files',detail:'The 21 original .docx downloads use a separate, optional browser cache.',href:'#offline-access',button:'Manage Word originals →'},
  {title:'Back up saved progress',detail:'Sovereign Pocket saves allowed local preferences as an unencrypted file you keep privately.',href:'#sovereign-pocket',button:'Open Sovereign Pocket →'},
  {title:'Return to your saved Shelf',detail:'Preferences stay on this browser unless you explicitly export and restore them.',href:'#my-shelf',button:'Visit My Shelf →'}
 ]}
];
export const pathById=id=>entryPaths.find(x=>x.id===id)||entryPaths[0];
export const startHereAnchors=Object.freeze([
 'daily','meals','movement','my-shelf','hydration','library',
 'original-releases','offline-access','sovereign-pocket'
]);
