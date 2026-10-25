# Botanical & Supplement Reading Index

## Source provenance

This is a source-only reading guide to five already-published, approved originals from Mikey & Larrina:

- Complete Herbals Guide
- Sacred Herbal Medicine Appendix
- Herbal Medicine & Tinctures
- Herbals Guide (additional material)
- Comprehensive Reference Appendices

The importer reads their existing browser-reader JSON, which is generated directly from DOCX on each build. It indexes curated plant names, essential-oil terms and nutrient/supplement names **only if those exact names appear** in the source text. The public JSON contains only a term label, number of textual mentions and original source document IDs. **No source dosage, formulation instruction, purported treatment claim, or medical effect is reproduced or inferred into the index.**

It is not the original standalone Gumroad **Supplement & Herb Mastery Guide** as advertised; that package is still unverified. Original wording remains in its downloadable archival Word documents. Mentions may be incidental, not a comprehensive taxonomy.

## User experience

- Search names with filters for botanical plants, essential oils, supplements, and individual Word sources.
- See how many textual mentions an entry has in how many reviewed manuscripts.
- Follow links to the exact reviewed source DOCX. Open the site’s original manuscripts in the general reading library.
- Save a list of topics to read later. Saved data is stored only in localStorage; no account or external sync.
- Read independent safety and science guidance from **NIH NCCIH**, **NIH Office of Dietary Supplements**, and the **FDA**.
- All source JSON is automatically cached by the existing scoped Offline Kitchen PWA after the first successful online visit. External NIH/FDA pages still require internet.

## Why safety language matters

The original archived texts include traditional use cases, tincture preparations, claims about immunity/hormones and supplement dose schedules. Preserving those texts as history and authorial content is different from validating their effects or recommending doses.

The U.S. FDA does **not** approve dietary supplements for safety and effectiveness before sale. Supplements and herbs can have interactions with medicines; some are inappropriate for people who are pregnant or have health conditions. Individual clinical advice is required for supplement decisions. These facts are verified from FDA and NIH:

- https://www.fda.gov/consumers/consumer-updates/fda-101-dietary-supplements
- https://www.nccih.nih.gov/health/herbsataglance
- https://ods.od.nih.gov/factsheets/list-all/

The new interface deliberately has no “take this” recommendations, stack builder, symptom matcher, or dose calculator. It does not independently certify any plant's clinical benefits or safety.

## Build and tests

The build runs \`scripts/import-botanicals.mjs\` after the existing original library import and creates \`public/botanicals/index.json\`. It fails on partial source packages rather than silently implying complete coverage.

Test modules cover index provenance, whole-word matching, safe reading-list IDs, search filters, and source ZIP ingestion against real DOCX. The production Vite PWA scans and caches the resulting index without new permissions.

## Manual postmerge QA

Verify the source count and category filters, find Chamomile/Magnesium if mentioned in the originals, view the exact source documents, save a reading item, and reload offline after the Offline Kitchen has fully prepared its cache.
