// Source catalog transcribed from the authors' uploaded 28-document ZIP (October 25, 2026).
// Items listed here are eligible for the public archive; original files remain untouched.
// The importer publishes no document until the canonical ZIP is committed by its owners.
export const archiveDocuments = [
  {id:'core-manual',title:'30-Day Holistic Health Transformation',file:'30_Day_Holistic_Health_Manual.docx',category:'Foundation',description:'The teaching manual: movement, nourishment, recovery and a 30-day rhythm.',caution:'Exercise and supplements are educational, not individualized medical advice.'},
  {id:'week-one',title:'Week 1 Recipes · Foundation',file:'Week1_Recipes.docx',category:'Food & recipes',description:'Days 1–7: smoothies, salads, and dinners.'},
  {id:'week-two',title:'Week 2 Recipes · Energy Boost',file:'Week2_Recipes.docx',category:'Food & recipes',description:'Days 8–14: recipes and meal variations.'},
  {id:'week-three',title:'Week 3 Recipes · Clarity & Depth',file:'Week3_Recipes.docx',category:'Food & recipes',description:'Days 15–21: recipes and meal variations.'},
  {id:'week-four',title:'Week 4 Recipes · Integration',file:'Week4_Recipes.docx',category:'Food & recipes',description:'Days 22–30: recipes and meal variations.'},
  {id:'complete-recipes',title:'Complete 30-Day Recipe Appendix',file:'Complete_30Day_Recipes.docx',category:'Food & recipes',description:'A companion recipe appendix in its original format.'},
  {id:'movement',title:'Detailed Exercise Protocols',file:'Detailed_Exercise_Protocols.docx',category:'Movement',description:'Breathing, strength, mobility, movement and recovery instructions.',caution:'Modify movements for your abilities and stop for discomfort or dizziness.'},
  {id:'infused-water',title:'Fruit & Herb Infused Water',file:'Fruit_Herb_Infused_Water_Complete_Guide.docx',category:'Food & recipes',description:'Fruit and herb combinations for flavored water, with an accompanying schedule.'},
  {id:'herbals',title:'Complete Herbals Guide',file:'Complete_Herbals_Guide.docx',category:'Herbal traditions',description:'Original collection of traditional preparations and references.',caution:'Herbs can cause harm or interact with medicines. Do not treat this as dosing advice.'},
  {id:'herbal-sacred',title:'Sacred Herbal Medicine Appendix',file:'Complete_Sacred_Herbal_Medicine_Appendix.docx',category:'Herbal traditions',description:'Traditional and spiritual herbal preparations, with a dedication to Larrina.',caution:'Historical and personal traditions are not proof of medical efficacy or safety.'},
  {id:'tinctures',title:'Herbal Medicine & Tinctures',file:'Herbal_Medicine_Tinctures_Appendix.docx',category:'Herbal traditions',description:'Original herbal and tincture reference from the collection.',caution:'Some preparations include concentrations and dosages. Seek qualified clinical advice.'},
  {id:'herbals-addendum',title:'Herbals Guide · Additional Recipes',file:'Herbals Guide.docx',category:'Herbal traditions',description:'Additional original recipes and botanical traditions.',caution:'Ingredients, interactions and personal risk require individual review.'},
  {id:'reference',title:'Comprehensive Reference Appendices',file:'Reference_Appendices.docx',category:'Reference',description:'Supplement notes, budgeting and other source reference material.',caution:'Contains supplement dosage claims and health assertions that are not independently validated.'},
  {id:'crystals',title:'Crystal & Energy Work Guide',file:'Crystal_Energy_Work_Complete_Guide.docx',category:'Spiritual exploration',description:'Crystals, sacred geometry and reflective spiritual practices.',caution:'Claims about crystal frequencies and healing are spiritual beliefs, not established medical treatments.'},
  {id:'planetary',title:'Chapter 7 · Planetary Influences & Cosmic Rhythms',file:'CHAPTER_7_Planetary_Influences_COMPLETE.docx',category:'Spiritual exploration',description:'Planetary timing and symbolic reflection.',caution:'Astrological influences on health are not established by clinical evidence.'},
  {id:'rhythm',title:'Chapter 8 · The Rhythm Code',file:'CHAPTER_8_Rhythm_Code_FORMATTED.docx',category:'Spiritual exploration',description:'The 3-6-9 framework, personal cycles, reflection and worksheets.',caution:'Astrology and numerical symbolism are interpretive practices, not physiological science.'},
  {id:'joy',title:'Chapter 9 · The Joy Blueprint',file:'CHAPTER_9_Joy_Blueprint_FORMATTED.docx',category:'Reflection',description:'A thirty-day joy and self-reflection framework.'},
  {id:'symbolic',title:'Chapter 10 · Symbolic Awareness',file:'CHAPTER_10_Symbolic_Awareness_FORMATTED.docx',category:'Reflection',description:'Using symbols and experiences as prompts for self-inquiry.'},
  {id:'lens',title:'Chapter 11 · The Lens Doctrine',file:'CHAPTER_11_Lens_Doctrine_COMPLETE.docx',category:'Reflection',description:'Orientation freedom and gentle shifts in perspective.'},
  {id:'integration',title:'Chapter 12 · Sovereign Integration',file:'CHAPTER_12_Sovereign_Integration_COMPLETE.docx',category:'Reflection',description:'Bringing the collection into daily life and personal values.'},
  {id:'channels',title:'Chapter 13 · Sacred Channels',file:'CHAPTER_13_Sacred_Channels_PART8.docx',category:'Spiritual exploration',description:'The chakra-inspired spiritual framework and observer symbolism.',caution:'Chakras and energetic dimensions are spiritual models, not anatomical facts.'},
];
export const archiveCategories = ['All',...new Set(archiveDocuments.map(entry=>entry.category))];
export const archivalExcluded = [
  {file:'CHAPTER_9_Joy_Blueprint_FORMATTED.docx',canonical:'Joy_Blueprint_Final_Insert_Ready.docx',reason:'Exact-content duplicate'},
  {file:'CHAPTER_10_Symbolic_Awareness_FORMATTED.docx',canonical:'Symbolic-Awareness-Life-as-Oracle.docx',reason:'Exact-content duplicate'},
  {file:'30_Day_Holistic_Health_Manual.docx',canonical:'30_Day_Holistic_Health_Manual (2).docx',reason:'Same extracted content, formatting/ZIP bytes differ'},
  {file:'CHAPTER_8_Rhythm_Code_FORMATTED.docx',canonical:'Sacred_Rhythm_Unified_System_369_Phi_FINAL.docx',reason:'Almost identical chapter body with minor title variance'},
  {file:'Health_Vitality_Tracker_Monthly.docx',reason:'Personalized family tracker. Deliberately excluded from the public site.'},
  {file:'THE SOVEREIGN BODY METHOD.docx',reason:'Compilation scaffold includes unfilled chapter placeholders.'},
  {file:'The_Sovereign_Body_Method_MASTER.docx',reason:'Master compilation scaffold includes unfilled chapter placeholders.'},
];
