# Public Launch Gate

Every GitHub Pages verification and deployment run executes npm run build. This now automatically invokes npm's postbuild script to audit **the actual dist artifacts**, not simply the source tree. Any failure blocks the PR check or deployment.

## Checks

- The full 21-manuscript allowlist appears **exactly** once in the public reader catalog and full-text corpus.
- Every published original DOCX is verified **byte for byte** against the approved safe ZIP in content/source. No private tracker, duplicate master or hidden unpublished Word file may appear among the public download assets.
- All 21 source readers are published in HTML JSON, searchable, and included in the service-worker core cache.
- The core data counts are checked: 90 original recipes, 23 original movement practices, 28 flavored-water days, 3 historic budget approaches, 8 frequency mentions, 13 crystal keywords, 34 botanical/supplement mentions and 21 original searchable books with at least 5,000 source passages.
- Day IDs, water day boundaries, and original meal recipe IDs are validated.
- All nine Gumroad release cards link only to approved manuscript IDs.
- Internal literal hash links and the two authored route ledgers (Start Here and Original Releases) must resolve to actual component section anchors.
- The offline manifest precaches essential app data and reader JSON but **keeps all 21 DOCX downloads optional**. PWA manifest path and scope must match the real GitHub Pages subpath.
- Published robots.txt, sitemap.xml, canonical HTML URL and social metadata must agree on the real canonical site URL.

The full-text source index is bounded at 12 MiB. The build fails if any original download changes byte contents, if a public link loses its destination, or if the source corpus stops being the approved 21 documents.

## Running locally

Run \`npm install\`, then \`npm test\` and \`npm run build\`. **No extra manual audit command is required**: npm automatically executes \`postbuild\` after Vite finishes. CI's verify and deploy jobs both use this command.

## What the automated gate cannot prove

This is a strong static artifact audit, **not a real browser session**. It cannot verify interactive click handlers, audio levels, exact scroll positions, every possible device/screen reader, live social crawler indexing, or cache persistence on a visitor's phone. Prior to a wide public announcement, still manually check:

1. Open the live site in private browsing on desktop and phone. Use all five Start Here routes and a shared Day 12 link.
2. Open/download representative original Word files from both the archive and Gumroad release ledger. Verify Word opens them.
3. Search for a term near the end of a long original, open passage, save a reading spot, then resume.
4. Favorite a recipe and movement and ensure each opens correctly from My Shelf.
5. Verify Offline Kitchen readiness, go offline, reload the home URL and read a cached book.
6. Download a Sovereign Pocket backup, then test importing it in a separate browser profile without leaking another user's progress.
7. Review contrast, keyboard/focus order, touch target sizes and how the page behaves at 320px width.
8. Manually review the wording around archival herbal, supplement, energetic and spiritual claims; source publication is not scientific endorsement.

This audit does not guarantee search rank, traffic, efficacy, accessibility conformance or offline cache permanence.
