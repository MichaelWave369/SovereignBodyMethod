# Original Reading Desk

The Source Atlas now supports reader-controlled progress and passage bookmarks for the **21 public, approved Word manuscripts**.

## How it works

1. Open an original book from the library or from a search result.
2. Scroll to a paragraph and choose **Save my place**.
3. Optionally choose **Bookmark visible passage** (up to 10 per book). A short excerpt is shown in the saved-passages list, where readers can jump back to it or remove it.
4. Close the book. Its archive card now offers **Resume saved place**. A filter can show only books with saved reading positions or bookmarks.

Source-locators include the public manuscript ID, a short original text probe (up to 135 characters), the visible block's index and the scroll ratio. When restoring a spot, the reader tries the exact source probe first, then uses the scroll ratio as a fallback if the source text changed. It does not modify the original text, track scroll events remotely, or create personal medical notes.

## Local storage and privacy

Reading Desk is **opt-in**: it only saves a spot when a visitor clicks a save or bookmark action. Its localStorage key is \`sovereign-body-method.library.reading-desk.v1\`.

The key's parser accepts only the 21 whitelisted manuscript IDs, a 0–50,000 passage position, a 2–140 character plain-text locator, and a normalized ratio. Ten unique bookmarks per book are allowed. No arbitrary links, HTML, filenames or outside library content are allowed. Bookmarks remain browser-local. Clearing browser storage removes them.

## Pocket backup compatibility

Sovereign Pocket now includes this one additional, strictly validated key in its **version 1** export/restore format. Existing v1 backup files remain readable and can still be restored. Restoring an older backup clears new saved reading-desk entries, just like other absent optional preferences; users should export their current state first.

No original Word documents or full manuscript texts are copied into personal backup files. The existing offline PWA covers the book content itself.

## QA

Unit tests confirm source-ID limits, malformed locators, duplicate bookmarks, bookmark toggles, restore support and backward compatibility. Full original import/build checks must pass.

Manual verification: open the long foundational book, scroll several pages, save current place, close, click Resume, and confirm it scrolls near the same original paragraph. Bookmark two passages, navigate between them and remove one. Repeat after export/import from Sovereign Pocket and in offline mode.
