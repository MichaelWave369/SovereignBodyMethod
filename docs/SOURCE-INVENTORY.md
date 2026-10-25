# Sovereign Body Method · Source Archive Review

**Received:** October 25, 2026  
**Supplied:** `SovereignBodyMethod.zip`  
**Total original Word files:** 28  
**Visible library candidates:** 21  
**Duplicate/alternate versions:** 4  
**Excluded private/scaffold files:** 3

## Findings

The archive is valid ZIP, with no CRC failures in the sampled inventory. The two files presented as master/complete compilations include literal placeholders (for example `[Week 1 Recipes Document Would Be Inserted Here]`), so they are **not** complete consolidated books. Read their individual sources instead.

Three pairs have equivalent extracted text:
- `Joy_Blueprint_Final_Insert_Ready.docx` duplicates `CHAPTER_9_Joy_Blueprint_FORMATTED.docx`
- `Symbolic-Awareness-Life-as-Oracle.docx` duplicates `CHAPTER_10_Symbolic_Awareness_FORMATTED.docx`
- `30_Day_Holistic_Health_Manual (2).docx` duplicates `30_Day_Holistic_Health_Manual.docx` in extracted text, though binary hashes differ

`Sacred_Rhythm_Unified_System_369_Phi_FINAL.docx` is near-identical to `CHAPTER_8_Rhythm_Code_FORMATTED.docx`: its paragraph text differs chiefly in the opening heading, with approximately 99.98% character-sequence similarity. The canonical Chapter 8 source is listed once.

`Health_Vitality_Tracker_Monthly.docx` contains family-specific personalization and **must not be in the public archive** without explicit consent and a separate privacy review.

Herbal, supplement, spiritual and planetary texts include original assertions about health. The public reader adds contextual notices; it neither validates those claims nor changes the original wording.

## Archive order and provenance

The allowlisted reader entries, names and intended original file paths are authored in `src/archiveCatalog.js`, not generated from guessed titles. Importer output is sanitized rich text preserving manuscript wording as rendered from Word paragraphs/tables. Embedded images, complex Word layout and some styling may require the downloadable original DOCX for full fidelity.

The source ZIP must be curated **before** uploading to a public GitHub repository. Merely excluding a file from a build does **not** make an uploaded public ZIP private.

## Next-stage content QA

- [ ] Confirm every name/title and public release permission with Larrina
- [ ] Confirm the 21-document selection, adjust exclusions if appropriate
- [ ] Review individual recipes for food allergy, storage and food-safety issues
- [ ] Review herbal and supplement dosage, contraindications and interaction risks with a qualified professional
- [ ] Consider separate history/interpretation tags for chakra and planetary sections
- [ ] Check conversion of tables and remaining embedded assets against original Word rendering
- [ ] Produce accessible PDF/EPUB editions after the canonical files are approved
