/**
 * Website companion prompts, newly authored for the public launch.
 * Not extracted from, or a substitute for, the original Method manuals.
 */
export const phases = [
  { title:'Foundation', days:'01 — 07', note:'Build a gentle daily rhythm.', tag:'GROUND' },
  { title:'Energy', days:'08 — 14', note:'Explore what helps you feel alive.', tag:'MOVE' },
  { title:'Clarity', days:'15 — 21', note:'Listen a little more closely.', tag:'NOTICE' },
  { title:'Integration', days:'22 — 30', note:'Bring the practice into everyday life.', tag:'BECOME' },
];
const plan = [
  ['Arrive', 'Notice what your body and mind might need today.'],
  ['Make space', 'Find a comfortable place to pause or move.'],
  ['Find your pace', 'Try movement that feels accessible to you.'],
  ['Practice rest', 'Make deliberate space for a break.'],
  ['A simple anchor', 'Choose a low-pressure morning or evening ritual.'],
  ['Nourishment', 'Prepare one meal that feels satisfying and supportive.'],
  ['Look back', 'Notice what felt useful this first week.'],
  ['Move with curiosity', 'Explore movement you actually enjoy.'],
  ['Listen', 'Give sound or silence a moment of attention.'],
  ['Seek daylight', 'Spend time in natural light if you can.'],
  ['Explore strength', 'Try comfortable effort with appropriate modifications.'],
  ['Notice energy', 'Reflect on when you feel alert or ready to rest.'],
  ['Care through food', 'Prepare a familiar meal slowly and attentively.'],
  ['Reset', 'Choose what to keep or adjust after two weeks.'],
  ['Pause', 'Observe your thoughts without having to change them.'],
  ['Your senses', 'Notice something you see, hear, and feel.'],
  ['Another lens', 'Consider a situation from a new perspective.'],
  ['Make room for joy', 'Take part in one enjoyable activity.'],
  ['Be still', 'Choose a quiet moment in a comfortable setting.'],
  ['Recognize rhythms', 'Write down one recurring pattern in your day.'],
  ['Seek clarity', 'Name one quality you want to bring into your life.'],
  ['Choose your anchors', 'Keep only the habits that fit your real life.'],
  ['Adapt', 'Make one demanding routine more compassionate.'],
  ['A return point', 'Design a simple reset for a difficult day.'],
  ['Connection', 'Reach out to someone supportive if you wish.'],
  ['Care', 'Offer yourself one practical act of care.'],
  ['Look beyond numbers', 'Consider what well-being means to you personally.'],
  ['A sustainable week', 'Sketch a flexible weekly routine.'],
  ['Recognize progress', 'Notice your effort without demanding perfection.'],
  ['Begin again', 'Write an intention for the next chapter.'],
];
export const journey = plan.map(([name,prompt],i) => ({
  day:i+1,name,prompt,phase:phases[i<7?0:i<14?1:i<21?2:3].title,
  rhythm:['Move','Reflect','Restore'][i%3]
}));
export const subjects = [
  { name:'Nourishment', eyebrow:'01 / BODY', summary:'Food, approachable cooking, and the original recipe collection.', detail:'The original method includes a 30-day recipe plan. Those original recipes will appear here once their source files are imported and approved for public release.' },
  { name:'Movement', eyebrow:'02 / BODY', summary:'Adaptable movement, dance, strength and restorative practice.', detail:'Start within your capabilities. Avoid pain and increase activity gradually; individualized advice from qualified professionals takes priority.' },
  { name:'Daily foundations', eyebrow:'03 / BODY', summary:'Rest, attention, sustainable rhythms and everyday care.', detail:'Foundational practices are invitations, not requirements. The right routine is one that works with your circumstances.' },
  { name:'Plant traditions', eyebrow:'04 / NATURE', summary:'Herbal histories, preparations, and careful evidence review.', detail:'The source material includes herbal practices. They are not automatically safe: plants can interact with medications and conditions. Specific instructions will require expert safety review.' },
  { name:'Sound & ritual', eyebrow:'05 / NATURE', summary:'Music, personal ceremony, sensory awareness and stillness.', detail:'Explore sound and ritual as subjective relaxation or spiritual practices, without medical claims about specific frequencies.' },
  { name:'Natural cycles', eyebrow:'06 / NATURE', summary:'Seasonal rhythms and optional lunar or planetary reflection.', detail:'Lunar or planetary timing may be used symbolically for reflection. There is no established clinical evidence that it treats disease.' },
  { name:'The Rhythm Code', eyebrow:'07 / MIND', summary:'Pattern, repetition and the Method’s 3-6-9 symbolism.', detail:'The Rhythm Code offers an interpretive lens for reflection. It is not a validated model of human physiology.' },
  { name:'The Lens Doctrine', eyebrow:'08 / MIND', summary:'HERE and THERE, NOW and THEN, and the freedom to shift perspective.', detail:'Explore the pairs HERE/THERE, NOW/THEN, WITH/WITHOUT, NEAR/FAR, OPEN/CLOSED, HOLDING/LETTING-GO as prompts for reflection.' },
  { name:'Symbolic awareness', eyebrow:'09 / MIND', summary:'Imagination and meaning-making without demanding certainty.', detail:'Use metaphor, imagery, or journaling if they support your own sense of agency. No specific spiritual beliefs are required.' },
  { name:'Sacred channels', eyebrow:'10 / SPIRIT', summary:'Chakra-inspired symbolism and optional contemplative practices.', detail:'Energy centers are part of spiritual traditions, not medically established anatomical structures.' },
  { name:'Consciousness', eyebrow:'11 / SPIRIT', summary:'Self-inquiry, awareness, agency and values.', detail:'No particular altered state is required or promised. Start with honest attention to your experience.' },
  { name:'Lifelong integration', eyebrow:'12 / SPIRIT', summary:'A method that bends to your life instead of ruling it.', detail:'The point is a flexible personal relationship with well-being, not a competition or a perfect thirty-day streak.' },
];
export function completedFromStorage(value) {
  try { const parsed=JSON.parse(value || '[]'); return new Set(Array.isArray(parsed)?parsed.filter(n=>Number.isInteger(n)&&n>=1&&n<=30):[]); } catch { return new Set(); }
}
