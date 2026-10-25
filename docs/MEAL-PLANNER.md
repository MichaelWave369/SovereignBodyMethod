# 30-Day Original Recipe Import

## Source: four weekly Word manuscripts
- Days 1–7: `Week1_Recipes.docx`
- Days 8–14: `Week2_Recipes.docx`
- Days 15–21: `Week3_Recipes.docx`
- Days 22–30: `Week4_Recipes.docx`

Every day has exactly one **SMOOTHIE**, **SALAD**, and **DINNER**. The original ZIP contains 90 total recipes with complete ingredients, preparation steps, prep times, servings and variations. Original serving size in all 90 source headers is *2 people*.

## Originality and editorial integrity
- Word document paragraphs are read directly from `word/document.xml`.
- Ingredient and instruction rows are extracted from the original two-column recipe tables.
- Recipe names, variation text, amounts and steps are sourced directly from these files. Formatting glyphs, such as `•` and numbered prefixes, are removed for proper semantic HTML lists.
- The `Complete_30Day_Recipes.docx` appendix is **not** the data source: it includes only the first few fully written daily plans, followed by a day index.
- Import fails the build when even one expected daily meal or an ingredient/instruction section is missing; we never fill gaps with invented recipe content.
- No nutrition calculations, allergy-free assurances, or unverified wellness claims are added.

## Search and shopping
The site reads `/meals/recipes.json` generated at build time. Search covers recipe name, day, meal type, original ingredient lines and variations. Shopping lists preserve raw ingredient rows per recipe. Identical ingredient lines appear separately if recipes call for them separately; **the planner never guesses a combined quantity**. The weekly scope follows original week divisions: 7+7+7+9 days.

Browser checkmarks and preferred day are local-only. Copy list is supported on browsers allowing Clipboard API; if unavailable, the list remains selectable in the UI.

## Commands
```bash
npm install
npm test
npm run build
npm run dev
```
The existing source importer runs first, followed by the meal parser as part of the npm prebuild/predev scripts.

## Safety and editorial caveats
These originals contain their own dietary substitutions and wellness claims. They are preserved as archival content, not verified clinical advice. Readers should check allergens, cross-contamination, food safety and personal medical needs. Historical prep time is not necessarily total cooking time. No household-specific personalization or medical guarantee is implied.
