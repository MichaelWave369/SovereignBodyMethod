# Full-Text Source Atlas (21 Original Manuscripts)

## Goal
Readers can search **inside the full original 21 documents**, see the exact manuscript excerpt, and open the original book scrolled to its matching source passage. This extends the first archival catalog, which allowed search over **up to 100,000 characters per document** but gave no matches or locations.

## Provenance, privacy and safety
- Corpus is generated **only from the allowlisted, already-sanitized manuscript reader HTML** in \`public/library/docs/*.json\`.
- The personal family tracker, duplicate files and incomplete master compilation are excluded upstream and **cannot enter the search index**.
- No invented content, AI-generated medical summaries, interpretation of health claims or synthesized source text is added.
- Passage index stores only original textual blocks and references to approved document identifiers.
- Search runs locally in the browser and does not submit search queries, reading habits or book passages to a backend.
- A search hit opens the existing source reader, focusing the matching paragraph. The manuscript remains unmodified and available as original DOCX.
- Source health/supplement/energetic claims remain historical authorial content, with existing caution notices, not clinical recommendations.

## Technical route
The build runs \`scripts/import-search.mjs\` after the existing DOCX-to-sanitized-reader importer. It constructs \`public/library/search-index.json\` using \`src/archiveSearch.js\`.

Each \`p\`, \`h1-h6\`, \`li\`, table cell or blockquote is indexed as a separate textual source passage. Entire paragraph text is kept for matching; excerpts are derived from source text and shown without injecting unsafe markup. Each hit has the original document ID and matching source passage text probe, for scrolling to the corresponding DOM element in the existing reader.

The index is created **only for the 21 approved originals**. The build rejects any missing approved document or unexpected >12 MiB search index. Offline Kitchen's existing build scanner precaches the generated JSON as a normal site asset. The browser downloads it lazily on the user's first 3+ character library search.

### Search behavior
- A query with at least three characters is matched case-insensitively within each source passage.
- Multiple query words must be found in the **same** passage.
- Categories apply to both results and document catalog.
- Groups show matching manuscript titles, counts of matching source passages, and up to four **original excerpts per book**. The original reader contains all matching text for further exploration.
- Clicking a hit opens the original reader and attempts to scroll to the passage, with a temporary visual outline to clarify the location.

## Verification
Tests exercise paragraph extraction, XML/HTML entity decoding, source-only snippets, full-text category searches, passage counts, and actual 21-document ZIP integration through Mammoth and sanitizer.

Manual QA: search \`breathing\`, \`herbal\`, \`Tibetan\`, and terms near the end of longer manuscripts; open a result and confirm the highlighted reader paragraph, then close and verify normal browse/download still works. Repeat offline after the site's cache reports ready.
