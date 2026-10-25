# Original Gumroad Release Coverage Audit

Reviewed against the creators' October 25, 2026 Gumroad dashboard screenshot of **nine** listings, the original uploaded `SovereignBodyMethod.zip` containing 28 Word documents, and the public-safe curated 21-document ZIP already committed to the repository.

**Evidence standard:** Product titles are taken from the screenshot. Word manuscripts establish content presence but **not** exact Gumroad purchase-bundle equivalence. We do not have the original Gumroad purchase download manifests to compare byte-for-byte.

| Screenshot listing | Evidence in approved ZIP | Status |
|---|---|---|
| Budget Wellness Guide (college, RV, standard) | `Reference_Appendices.docx` includes a three-tier Grocery Budget Guide; some weekly recipe budget tips | **Partial.** Exact standalone product unconfirmed; dollar figures historical |
| Sound Healing & Crystal Energy | `Reference_Appendices.docx` has sound-frequency section; `Crystal_Energy_Work_Complete_Guide.docx` and `CHAPTER_13_Sacred_Channels_PART8.docx` provide related material | **Partial.** Exact standalone six-ritual pack unverified; sound/crystal healing not established treatment |
| Supplement & Herb Mastery Guide | `Reference_Appendices.docx`, `Complete_Herbals_Guide.docx`, `Herbal_Medicine_Tinctures_Appendix.docx`, `Herbals Guide.docx`, `Complete_Sacred_Herbal_Medicine_Appendix.docx` | **Partial.** Complete specific product bundle and hormone-related stack unverified |
| Detailed Exercise Protocols + visual diagrams | `Detailed_Exercise_Protocols.docx` contains 23 written tables of instructions, imported into Movement Studio | **Written instructions covered; diagrams not found.** The source DOCX contains no embedded `word/media` diagram images |
| COMPLETE 30-Day Transformation + 28-day infused water | Four full week manuscripts total 90 recipes; `Fruit_Herb_Infused_Water_Complete_Guide.docx` includes four seven-day weekday tables; `30_Day_Holistic_Health_Manual.docx` available | **Core components covered**; exact bundle/bonuses not verified |
| Week 4 Completion Pack | `Week4_Recipes.docx` contains nine authored days 22–30 / 27 original recipes | **Manuscript content covered** |
| Week 3 Deep Dive Pack | `Week3_Recipes.docx` contains days 15–21 / 21 original recipes | **Manuscript content covered** |
| Week 2 Momentum Pack | `Week2_Recipes.docx` contains days 8–14 / 21 original recipes | **Manuscript content covered** |
| Week 1 Kickstart Pack | `Week1_Recipes.docx` contains days 1–7 / 21 original recipes | **Manuscript content covered** |

## What was added in this PR

- Interactive 28-day infused-water schedule from **four exact source Word tables**, with original flavors and notes, filters, local completion tracking, and a direct original DOCX download.
- Public **Original Gumroad Collection** ledger showing all nine releases with source links and explicit coverage caveats, without claiming missing files or products are fully restored.
- Strict build-time source parsing and validation that fails if any of 28 water calendar entries or week rows are missing; the generated PWA offline cache picks up the data automatically.

## Important unresolved sources

- Exact standalone original `Budget Wellness Guide` export.
- Exact standalone `Sound Healing & Crystal Energy` export and the advertised six integrated rituals.
- Exact standalone `Supplement & Herb Mastery` export, with ingredients, oils and any additional medical claims.
- Advertised **visual diagrams** for the exercise product (no embedded images in supplied Word doc).
- Potential extras/bonuses not in the approved 21-file archive.

When the authors find missing Gumroad downloads, review them for privacy, intellectual-property permission, and clinical safety before import. **Do not guess at diagrams, dosages, ritual scripts, or missing content.**

## Health/food safety

Infused fruit and herbs are offered as flavors, not cures. Some ingredients, including grapefruit, interact with medications. Any original historical claims about supplements, detoxification, planetary timing, crystals or sound frequencies remain attributed material rather than verified efficacy. No fixed hydration intake target is imposed.
