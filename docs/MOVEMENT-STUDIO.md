# Movement & Breathing Studio

**Source provenance:** Original author-supplied `Detailed_Exercise_Protocols.docx` and `30_Day_Holistic_Health_Manual.docx`, from the curated public archive.

## What is imported

- 23 distinct protocols: opening practices (3-6-9 and box breathing), 5 Tibetan Rites, 3 Qigong practices, 5 Tai Chi fundamentals, 4 bodyweight strength exercises, 3 dance movements, and Yoga Nidra.
- For each protocol, the build imports the original title, short description, duration, every numbered instruction, all original modification tips, and the original stated benefits.
- Benefits are **explicitly attributed original claims** and placed behind a reader-controlled disclosure, not presented as clinically verified effects.
- The source manual's repeating 3-day cycle (strength; flexibility/cardio; recovery), including original sequences and teaching notes. The website maps this repeating pattern across 30 days but does not invent distinct daily plans.

## User experience

- Searchable filter by practice family; original instructions and variations appear on expandable cards.
- Day 1–30 movement schedule and optional local progress/check marks.
- Optional saved/bookmarked practices stored in this browser only.
- Breath count guide supports the original 3-6-9 or box 4-4-4-4 sequences, with start, pause, reset and explicit **skip holds** option. Timer is voluntary, not medical treatment.
- A safety notice advises stopping when dizzy, uncomfortable or in pain, not practicing breath holds in water or driving, and obtaining personalized clinical guidance where relevant.
- By default, all generated movement studio JSON is precached with the other site assets on an online PWA visit; no new worker permission or background data submission.

## Health and evidence caution

The original manuscripts include claims about internal energy, chakra healing, cortisol, and sleep equivalencies. These claims are faithfully attributed as historical statements **without scientific or clinical endorsement**. The program's session suggestions also mention supplements and healing frequencies; they remain labeled as source material, not instructions to take supplements or replace standard care.

## Build and validation

`npm run build` and `npm run dev` run `scripts/import-movement.mjs` after the existing manuscript and recipe importers. A strict source parser reads original DOCX XML and fails CI when any of the 23 technique tables or 3 original training templates is absent. `tests/movement.test.mjs` checks the imported source ZIP end-to-end as well as the locally saved state and 30-day cycle mapping.

To verify after deployment: select Day 30, expand the 3-6-9 and yoga nidra techniques, switch categories, bookmark a practice, select Skip holds in the pacer, and confirm content remains available after the Offline Kitchen status reports ready and connection is disabled.
