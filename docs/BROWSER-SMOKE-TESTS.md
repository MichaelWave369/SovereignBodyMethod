# Browser Smoke Tests (Actual GitHub Pages Build)

The public-launch gate checks every published source file, but it cannot click buttons or observe browser behavior. This adds **Playwright Chromium smoke tests** in \`e2e/public-launch.spec.js\`.

## Coverage

- **Shared day URL:** Opening \`?day=12#daily\` selects Day 12 consistently in Dashboard, Meals and Movement, loads three original recipes, carries no other user's checkmarks, and omits private data from the share URL.
- **Source boundary:** Day 30 still has three original recipes but clearly says the original infused-water program ends at Day 28, with no fabricated water checkmark.
- **Personal browser state:** Saving a recipe favorite populates My Sovereign Shelf, and reopening it takes the visitor to the full original recipe.
- **Full-text archive:** Searching actual original source passages opens the correct manuscript reader, which can save the reading place.
- **Mobile:** At 390px, the accessible Explore menu navigates to Start Here and a release-card Word download returns actual DOCX ZIP bytes.
- **Offline:** After the production service worker completes its core cache, reloading while offline still renders the site, Day 1 recipes and the manuscript catalog.

## How to run

\`\`\`sh
npm install
npx playwright install --with-deps chromium
npm run build
npm run test:e2e
\`\`\`

Playwright starts a \`vite preview\` web server automatically at \`http://127.0.0.1:4173/SovereignBodyMethod/\`. **Test the compiled site, not \`npm run dev\`.** GitHub Actions installs Chromium after the build and runs browser checks in the existing \`verify\` job. A browser failure blocks deployment, just like the public launch artifact audit.

These tests use disposable Playwright browser profiles and browser-local state. No login, external service, browser extension, private medical data or production analytics are required. Playwright captures traces/screenshots/videos **only on failure**, kept as a short-lived CI artifact for investigating a failed run. No live user data is included in that artifact.

## Limits

Passing Chromium on Ubuntu does not prove Safari, every Android variant, accessibility conformance, social crawler behavior or guaranteed cache persistence. The browser checks deliberately validate essential user journeys rather than attempting fragile screenshot pixel snapshots. Real-device manual QA remains useful.
