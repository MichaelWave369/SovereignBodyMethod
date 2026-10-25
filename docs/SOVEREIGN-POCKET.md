# Sovereign Pocket: Print and Personal Data Backup

## Why
The method's offline web app stores personal checkmarks, recipe favorites and budget values **only in the browser**. Clearing browser data or changing devices can lose those preferences even if the public original manuscripts remain available. Sovereign Pocket offers a manual user-controlled way to preserve and transfer them without creating an account or a private-data server.

## Daily print plan
The Daily Dashboard has a **Print today's complete plan** action (browser Print or Save as PDF). The sheet includes:
- All three original recipes, ingredients, instructions and source filenames
- The original repeating three-day movement template with source
- The original infused-water blend for Days 1–28, with an explicit "no source entry" message for Days 29–30
- Clearly marked newly-authored reflective website companion

A print-only stylesheet deliberately overrides the existing Meals print view **only when a Daily print is requested**. Standard weekly menu/grocery printing remains separate.

## Private JSON backup

**Data that may be included:** Eleven allowlisted, versioned Sovereign Body localStorage fields:
1. Shared selected day
2. Optional reflection progress
3. Optional movement progress
4. Optional infused-water progress
5. Recipe favorites
6. Shopping purchased-item checkmarks
7. Pantry already-have checkmarks
8. Movement bookmarks
9. Botanical reading topics
10. Personal grocery prices
11. Grocery budget targets

Only the user's existing site-local values are included. No document ZIPs, browser passwords, tokens, cookies, unrelated applications, telemetry or medical diagnoses are exported. Personal budget values *can* be sensitive, so the downloaded JSON should be kept private and **is not encrypted**.

Use **Download private backup** to create an offline \`.json\` file. Restore is deliberately two-stage: select a file, validate the format and every allowed entry, review a summary, then check explicit consent and choose **Replace saved data and reload**. The reload is required because existing React tools initialize from browser storage when mounting.

- The restore accepts **only** the exact \`sovereign-body-pocket\` format and version 1.
- No unknown localStorage keys, arbitrary objects, scripts, or off-site settings can be restored.
- Arrays are validated for item IDs and day boundaries, including hydration ending at Day 28.
- Monetary values must be bounded decimal prices or explicit blank optional targets.
- Entire input is limited to **512 KiB**. Parsing/validation happens *before any local write*.
- Replace behavior clears absent allowlisted keys; all non-Sovereign browser storage is untouched.
- If a storage write fails, restore attempts to roll back the previous local values.
- Backup/restore uses browser file APIs only. No network request, account or analytics.
- Importing on another device does not install the original book files offline. Open the published site online once to prepare the existing PWA cache.

## QA
Run \`npm test\` and \`npm run build\`. Tests verify full mock local round-trip, no unrelated key export, malicious key/invalid day rejection, size limits, safe budget validation, and rollback on a simulated quota error.

Manual browser acceptance:
1. Set Day 28 and save a reflection, movement note, water note, favorite recipe and budget line.
2. Download backup, inspect the JSON filename and categories, and keep the file private.
3. Change your progress and day, then choose the saved JSON, check confirmation and restore.
4. Confirm the shared dashboard day, Meal Planner, Movement, Hydration, favorites and budget values match the previous state.
5. Print Day 30: the three original recipes and movement should appear, the optional water block should say the 28-day schedule ended, and no website buttons should print.
6. Print weekly shopping/menu from Meals and confirm their existing print layouts are unaffected.
