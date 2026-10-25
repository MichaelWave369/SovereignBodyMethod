# The Sovereign Body Method

A **free-to-read**, progressively published home for the original Sovereign Body Method by **Mikey & Larrina**.

**Web:** https://michaelwave369.github.io/SovereignBodyMethod/

## The two layers

1. **Starter companion:** a gentle, newly written 30-day interactive introduction. It is not a transcription of the book.
2. **Original manuscript library:** an archive of the authors' own texts, preserving original wording and offering unabridged DOCX downloads once the approved source ZIP is added.

The site is an educational/spiritual reading resource, not a substitute for medical care.

## Publishing the originals

The canonical 28-document source ZIP from October 25, 2026 is inventoried in `docs/SOURCE-INVENTORY.md`. It contains some duplicates, two unfilled compilation scaffolds and a personalized tracker. We deliberately publish only **21 allowlisted titles** into the site.

To activate the originals **without installing anything**:

1. In GitHub open the folder `content/source` in the repository branch and choose **Add file → Upload files**. If the folder doesn't exist yet, use GitHub's create file feature to add the supplied `content/source/README.md` first (this PR does that for you).
2. Upload the ZIP **without renaming it** as `content/source/SovereignBodyMethod.zip`.
3. Commit the change. GitHub Actions builds the public library automatically. The zip is private only in the sense of not being directly linked from the public site; note that a **public GitHub repository exposes the uploaded ZIP to everyone**. **Do not upload the source ZIP until you accept that even excluded materials inside it would be publicly accessible through repository history.**

**Safer option:** Create a reduced ZIP containing only the 21 allowlisted DOCX files. Give it the same name before uploading. This is the recommended path, since it excludes the family tracker and duplicate scaffolds from the public GitHub history. [A prepared public-safe ZIP is provided in the chat alongside this PR.]

The build reads `content/source/SovereignBodyMethod.zip`, converts the 21 allowlisted DOCX to sanitized HTML for reading, creates searchable metadata, and copies those 21 exact DOCX files into the generated site. No AI paraphrasing happens during conversion.

## Local development

```sh
npm install
npm run dev
npm test
npm run build
```

The importer runs before the build. Without a source ZIP, the catalog is visible but original reading links remain disabled.


## Original 30-day meal planner (90 original recipes)

The home page now has a **Meals** section, built from `Week1_Recipes.docx` through `Week4_Recipes.docx` in the approved public-safe ZIP. The compiler extracts all 30 daily smoothie/salad/dinner combinations and creates `public/meals/recipes.json` automatically on `npm run build` or `npm run dev`.

- Choose days 1–30 and expand any original recipe for ingredients, preparation and original variations.
- Find recipes by dish name or ingredient with a meal-type filter.
- Generate shopping lists for a chosen day or week (weeks 1–3 have seven days; week 4 has nine days).
- Grocery checkmarks stay in browser local storage. Copy lists using your browser clipboard.
- No AI-generated meals, invented nutrition scores, serving conversions or unreliable ingredient quantity aggregation.
- Every recipe names its original Word source and retains original quantities and wording, while presentation strips bullet/step-number glyphs.

The strict importer (`scripts/import-meals.mjs` with `scripts/meal-parser.mjs`) rejects missing days or incomplete ingredient/instruction tables. It intentionally does not use the summarized `Complete_30Day_Recipes.docx` appendix for recipe bodies.

Recipes are historical author-supplied material, not personal dietary advice; users should check allergens, preparation temperatures and individual requirements.

## Respecting authorship and evidence

- **Creators:** Mikey & Larrina
- **Content rights:** © 2026 creators; free access does **not** mean public domain or blanket reuse rights.
- Health, herbal, supplement, frequency and celestial assertions in originals are historical authorial content and **not independently fact-checked or clinically endorsed**.
- Personal tracker and unfilled compilation scaffolds are explicitly excluded from publishing. See `docs/SOURCE-INVENTORY.md`.

## Kitchen Mode (weekly menus, favorites, pantry checklist, printing)

Beyond the original daily recipes, visitors can now:
- View an entire week of the original **smoothie + salad + dinner** menu, and open any day for the exact recipe.
- Print a week-at-a-glance menu (or use the browser's **Save as PDF**), including the original nine-day final week.
- Star their favorite original recipes, then revisit them in a personal favorites shelf.
- Mark individual shopping-list ingredient lines as **Already have**, or check them off as purchased. This is manual and per recipe, not ingredient normalization.
- Copy or print only the ingredients **still needed**, with all original measures and recipes still available.

Favorites, pantry labels and purchased items use browser-only local storage; no personal information or shopping activity is sent to a server. Clearing local browser data clears them. The printed sheets are generated from the same author-sourced data as the live meal planner, with no added nutritional claims or automatic serving scaling.

## Offline Kitchen Mode (PWA)

After an online visit, supported browsers can cache the site, all 90 original recipes, and 21 readable manuscripts for offline access. Original Word downloads are optional, initiated by the reader. No accounts, analytics, or cross-device syncing. See docs/OFFLINE-KITCHEN.md for browser-specific steps, limitations, and tests.

## Movement and Breathing Studio

A new **Movement** area presents 23 original protocols with full authored step-by-step instructions, modifications and source-attributed claims, a repeating three-day workout schedule mapped to the 30-day journey, browser-local bookmarks and practiced-day notes, and an optional start/pause/reset breathing count guide. Source comes only from the approved Word manuals and is re-imported during every build. **No independently validated medical benefits are claimed.** Original manuscripts and protocol steps are available offline after the normal first online PWA cache completes. See `docs/MOVEMENT-STUDIO.md`.

## Legacy Gumroad collection coverage and 28-day water planner

The site now inventories all nine historical Gumroad listings against the actual approved source ZIP. Four weekly meal manuscripts are covered; the full recipe/water components are present; budget/sound/herb materials are partially represented across other originals; and visual diagrams advertised for the exercise product were not embedded in the supplied Word source. **This does not certify byte-for-byte reconstruction of Gumroad downloads.** See `docs/GUMROAD-COVERAGE-AUDIT.md`.

The **Hydration** section imports the complete original 28-day fruit-and-herb infused water calendar, preserved as four seven-day tables with original blends and notes. The app adds weekly filtering, search, and browser-local day tracking, with a direct link to the unabridged original Word guide. As with other generated JSON, it is included in the existing offline PWA cache after a complete online visit.

## Grocery Budget Studio (local-only prices)

The Meals → Shopping List tab now includes a **Budget Studio** built on the exact same original ingredient lines. It imports the three historical food-only budget approaches from `Reference_Appendices.docx` (college, RV, standard), keeping them explicitly attributed and not presenting old figures as current prices. Users enter estimated USD costs per original ingredient line, see missing-price counts, set their own spending caps, and view bought vs still-needed subtotals. Pantry items are excluded; no amount or duplicated ingredient is silently merged or scaled. All settings remain on-device, and the budget source guide is cached for offline reading. The exact separate Gumroad Budget Wellness package remains unverified. See `docs/BUDGET-STUDIO.md`.

## Sound & Crystal Explorer

A new \`#sound-studio\` section links the original frequency references, crystal traditions and sacred channel manuscript. Its index extracts only **source-mentioned** frequencies and crystal keywords from the 21 approved public reader documents. A separate user-controlled low-level sine-tone demo is for simple listening experiments, **not healing or medical treatment**. No unverified Gumroad rituals or source audio recordings are fabricated. The historical release remains **partially recovered** in the product crosswalk. All textual index data joins the existing offline PWA. See \`docs/SOUND-CRYSTAL-EXPLORER.md\`.
