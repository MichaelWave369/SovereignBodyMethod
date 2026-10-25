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

## Respecting authorship and evidence

- **Creators:** Mikey & Larrina
- **Content rights:** © 2026 creators; free access does **not** mean public domain or blanket reuse rights.
- Health, herbal, supplement, frequency and celestial assertions in originals are historical authorial content and **not independently fact-checked or clinically endorsed**.
- Personal tracker and unfilled compilation scaffolds are explicitly excluded from publishing. See `docs/SOURCE-INVENTORY.md`.
