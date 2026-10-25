# Offline Kitchen Mode

The published HTTPS site generates a scoped service worker caching the app shell, all 90 original recipes, the manuscript catalog, and all 21 converted reader texts.

## First online visit

Open the published site online and allow the Offline Kitchen panel to show **Offline reading ready**. Offline navigation then falls back to the cached shell, while the original recipe JSON and reader JSON files are read from cache. The existing favorites, progress and grocery checkmarks remain browser-local.

## Optional Word downloads

Use the **Save all Word originals** button to cache the 21 original downloadable DOCX files separately. They are **not** cached automatically. The button **Remove saved Word files** removes only this opt-in cache without touching the core recipe cache or browser settings.

## Browser behavior and limits

- Needs an online visit on a supported browser first. The site is not independently installable from USB.
- Cache Storage may be evicted, especially in private browsing or on low-storage devices.
- The worker responds only within the exact same-origin /SovereignBodyMethod/ path; other GitHub Pages apps are not intercepted.
- Updates require an online visit. A new core revision replaces older site cache versions.
- Externally hosted font files are not cached; system fallback fonts render offline.
- A PWA installation prompt is browser-dependent; some devices require manual Add to Home Screen.
- SVG-only installation icons may not meet every browser's installation requirements.
- Personal pantry/favorites checkmarks are not uploaded or synced.

## Technical build

The build plugin in vite.config.js runs scripts/offline-build.mjs after Vite output is complete. It scans dist, hashes build files, generates dist/sw.js from the checked-in template, and removes the template from dist. Original manuscript DOCX downloads are excluded from core precache and are opt-in.

## Offline acceptance check

1. Open the published site online and confirm Offline reading ready.
2. In browser DevTools, set Network to Offline, then reload.
3. Visit Day 30, browse recipes, view the shopping list, and open one manuscript from the library.
4. Optionally save all Word originals while online, then disconnect and download one.
5. Reconnect, confirm updates still work, and verify Check offline status remains accurate.

No analytics, push notifications, permissions to other apps, or background sync are included.
