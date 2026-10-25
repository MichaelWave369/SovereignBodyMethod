# Sound & Crystal Explorer: archival materials, not medical treatment

## Why this exists

The original Gumroad dashboard listed a **Sound Healing & Crystal Energy** product. The approved source ZIP contains *related material* in three sources:

- \`Reference_Appendices.docx\`: sound / frequency references
- \`Crystal_Energy_Work_Complete_Guide.docx\`: crystals, geometry and spiritual traditions
- \`CHAPTER_13_Sacred_Channels_PART8.docx\`: sacred channel and chakra framework

The exact historic standalone Gumroad product with its advertised **six integrated rituals** has **not been verified** from this approved archive. This PR does not invent rituals, pretend that a tone oscillator is historic source audio, or advertise clinical healing effects.

## Source-driven index

The build reads the existing sanitized browser-reader JSON after the library importer finishes. It only publishes:

1. Numeric frequencies explicitly written in the reference manuscript, matching Hz/hertz units.
2. Crystal search keywords *actually mentioned* in the original crystal manuscript.
3. Short, attributed excerpts from the original texts, not assistant-generated descriptions of their effects.

A numeral is evidence of a **source mention**, not validation of the manuscript's interpretation. The keyword index is intentionally selective and not intended to replace the full source material. Source links open the exact original downloadable Word texts already published in the archive.

Generated \`public/sound/index.json\` is picked up automatically by the existing offline service-worker build, like recipes, movement, water and budgets.

## Optional browser audio demonstration

The explorer contains a small browser-only Web Audio oscillator for audible electronic tone experiments. The user chooses frequency, manually starts, and can stop at any time.

- A single **sine wave**, not a recording, music composition, binaural beat, brain entrainment or therapy
- Source-mentioned numbers between **80 and 1000 Hz** can be copied into the dial; other source numbers are reference-only
- Relative level capped at a low signal gain and defaulted very low, but device output volume still matters
- Auto-stop choices at **30, 45, or 120 seconds**
- Playback stops when the browser tab is hidden, site unmounts, or the user chooses stop
- Audio begins only after direct user interaction; no microphone, sound capture, saving files, analytics or network data transfer
- Not designed for use as tinnitus treatment, seizure treatment, medical care or any efficacy claim

Visitors should use low hardware volume; avoid sustained headphone playback at uncomfortable levels and stop if symptoms develop.

## Continued provenance ledger

The Original Releases crosswalk links the sound product to \`#sound-studio\` but retains its **partial** coverage status. Exact original Gumroad audio files, extra diagrams and six rituals are still unresolved. If the creators find those assets, they must be independently examined before publication.

## Validation

The suite checks:

- Source-only numeric mention index, no generated frequency "meanings"
- Named crystals only when observed in source paragraphs
- Safe audible tone bounds
- Original-ZIP integration via Mammoth, ensuring actual mentions exist
- Full site build, with automatic offline integration

Manual QA after deployment: frequency presets, start and 30-second stop, background tab stop, search crystal terms, download each original source, and test offline reading after cache status reports ready.
