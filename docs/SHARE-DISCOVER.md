# Share and Discover: public links and search discovery

## Why
The original nine-product Gumroad collection is free on GitHub Pages, but new visitors need easy share links and search engines need accurate static metadata. This release adds discoverability without introducing tracking, accounts or exposing a visitor's locally saved work.

## Share a public day
A URL such as:

https://michaelwave369.github.io/SovereignBodyMethod/?day=12#daily

opens the existing shared 30-day selector on **Day 12**. The correct source-authored recipes and three-day repeating movement template are loaded from existing original datasets; infused-water entries still end at Day 28. No routine is generated on the fly.

- The query contains **only** day=1 through day=30, never browser-local progress, bookmarks, personal prices, medical notes or favorite IDs.
- The day parser rejects duplicate, malformed, negative and out-of-range values.
- When a visitor selects a different day, the stale ?day= link is removed, preserving the section anchor; reloading then uses their current saved day.
- If no valid day parameter exists, the site's existing locally saved day takes precedence.
- Visitors can copy a full-site URL in Start Here or copy/share a day-specific URL on the Daily Dashboard.
- Optional browser Web Share is used only on direct user interaction; manual copying is available without that API.
- Clipboard failure leaves a selectable readonly URL so visitors can copy manually.

## Public SEO metadata
- One **canonical URL** for the GitHub Pages React single-page application.
- Accurate meta description, Open Graph and basic Twitter metadata for the **whole website**.
- Small JSON-LD \`WebSite\` object identifying the public authors and free-access website.
- \`public/robots.txt\` and \`public/sitemap.xml\` point crawlers at the single canonical URL.
- No fabricated stars, efficacy, testimonials, personal metadata, subscription terms or indexed copies of visitor progress.
- No social image is claimed: rich link-preview images vary by platform, and a static GitHub Pages app cannot emit a unique crawler-side OG title for each \`?day=\` URL.
- This helps eligibility for discovery; it **does not guarantee** search indexing or traffic.

## Offline and QA
The sharing widget is part of the existing React app, so it remains available with the scoped Offline Kitchen PWA. Copy/share functions may depend on browser permission and platform support. The URL points to the public site and must be visited online by someone who has not already cached it.

Tests cover strict day parsing, link output on GitHub Pages subpaths, stale query cleanup, public metadata and sitemap/robots consistency. Verify manually after merge on mobile, another browser and an incognito window that public links open the intended day **without** anyone else's saved completion marks.
