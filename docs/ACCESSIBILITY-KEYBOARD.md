# Accessibility and Keyboard Navigation (PR #20)

## Improvements
- The original manuscript dialog now acts like a real keyboard modal: first focus moves to **Close original manuscript**, Tab and Shift+Tab stay within the visible dialog, Escape closes it, focus returns to the original button, and background document scrolling pauses while open.
- The mobile **Explore** menu closes on Escape and returns focus to its summary. Following an anchor link closes the menu and moves keyboard focus to the linked content section, avoiding invisible keyboard focus trapped inside a collapsed menu.
- Clear \`:focus-visible\` outlines extend beyond links and buttons to search inputs, file inputs, checkboxes, selects and the mobile summary.
- The existing reduced-motion preference is honored globally, now including pseudo-elements and very short/disabled transitions.

## Continuous browser checks
The existing Playwright production-browser gate gains:
1. An automated axe-core check of core **names, labels, valid ARIA attributes, document language/title, duplicate IDs and nested interactive structures**, at both the landing experience and reading dialog/mobile navigation.
2. A keyboard-only real original-manuscript open → Tab/Shift+Tab trap → Escape → focus-restore test.
3. A mobile menu keyboard and anchor-focus test.
4. A reduced-motion media preference test.

These tests are designed to run against the built GitHub Pages Vite preview and block a deploy on failure alongside existing six real-browser smoke checks. They create no external service connection, medical profile or new user data.

## Boundaries
An axe scan of a subset of rules **does not certify WCAG conformance** or replace real assistive-technology testing. Color contrast, zoom/reflow, audio pacing, Android TalkBack, iOS VoiceOver and site-wide heading hierarchy still require separate, human-assisted review. Historical source content is preserved and its original claims remain attributed, not validated.
