# Start Here: Guided Paths for First-Time Visitors

## Purpose
The Sovereign Body Method has grown from separate original Gumroad files into one free, offline-capable site. New visitors should not need to understand every feature to begin.

This adds **five short routes** selectable in the new \`#start-here\` section, immediately below the hero:

1. **Start with one day:** Set shared Day 1 if chosen, then explore the original daily content.
2. **Explore the kitchen:** Original 90 recipes, 28-day optional infused-water guide, shopping/budget tools and saved favorites.
3. **Explore movement & breath:** Preserved 23 original practices with modifications, plus repeating source training rhythm.
4. **Read the manuscripts:** 21 approved original documents, 5,178 search passages, recovery ledger, Reading Desk and My Shelf.
5. **Prepare offline & privacy:** Offline Kitchen readiness, optional Word downloads, local backups in Sovereign Pocket, and saved collections.

All destination links point to **already existing** source sections. The Offline Kitchen and Sovereign Pocket components receive stable deep-link anchors; no new backend or settings are introduced.

## Editorial and privacy

These are newly written **navigation instructions only**, not additions to the authors' original wellness protocol. Clicking Start Day 1 changes the existing day selector to Day 1; merely switching between intro routes does not change or store anything. The language distinguishes original manuscripts from modern website reflections, spiritual interpretations from science, and offline PWA caches from permanent storage. No health profiling, completion streaks, analytics, account or background syncing.

## Navigation

The desktop header replaces its Philosophy shortcut with **Start here** (the philosophy section remains accessible below), while mobile adds Start here in the existing Explore menu. The hero's primary action now points to Start Here. On screens 1020px and below, the menu uses the existing mobile accessible disclosure layout instead of cramming too many links into the header.

## Tests and manual checks

Unit tests confirm all five routes have unique IDs, exactly four descriptive steps, the Day 1 action is the only day-changing route, and every promised anchor actually exists in the source components.

After merge, verify the following in a real browser:
- Start Here has five paths, and every link navigates to the correct destination.
- Start Day 1 sets the shared day to 1 but doesn't mark anything complete.
- Offline and Pocket links jump to actual sections, not just the top of Meals or Daily.
- At 750px, 900px and desktop widths, the header does not overflow.
- On mobile, keyboard users can open Explore and use the navigation links.
- Existing Offline Kitchen, daily-plan printing and Sovereign Pocket export/restore still work.
