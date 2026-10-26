# My Sovereign Shelf

## Purpose and provenance

My Sovereign Shelf joins already-saved original recipes, movement practices, manuscript passages and botanical reading terms from the browser's **existing** local state. It creates no new saved-state keys, account, telemetry, server endpoint, or alternate source content.

### What links where

- Favorite recipes → original Meal Planner's Favorites tab, expanded original recipe, and corresponding 30-day selection.
- Bookmarked movements → original Movement Studio, expanded authored steps and modifications.
- Original manuscripts → validated Reading Desk last place or individual saved passage in the existing source reader.
- Bookmarked botanical topics → original botanical source search, with safety and evidence context still shown.
- Optional completed-day notes → original unified 30-day Daily Dashboard.

All metadata and titles resolve against existing generated JSON files already present in Offline Kitchen. Missing content is not fabricated, and archived medical/energetic claims are not endorsed.

### State and privacy

The shelf reads only the existing favorites, bookmarks, original-book passage locators and optional completed-day IDs. All existing tools remain the owners of their data. After any save, the tool emits a payload-free same-tab event so the shelf can refresh, and the shelf also listens for cross-tab storage and browser focus. Separate click events ask the original on-page section to open the selected source; there is no external navigation or user tracking.

Sovereign Pocket already backs up the underlying preferences, including the new Reading Desk, without requiring any additional persistent categories. No original Word book is copied into the personal backup.

### Manual verification

1. Star an original recipe and open My Shelf. Choose it, confirm the original saved recipe expands in the correct day.
2. Save a movement and select it from My Shelf to see its original steps.
3. Save a book place and a passage in Source Atlas, then resume each from My Shelf.
4. Save a botanical term, use the shelf link and verify original source filtering.
5. Mark days 28 and 30 and use the My Days overview to return to them. Water still ends at day 28.
6. Export and restore a Sovereign Pocket backup, then verify the saved items return.
7. Reload offline after the PWA says ready, confirm locally cached source indexes populate the shelf.

No streaks, medical scores, or inferred wellness benefits are associated with saved choices.
