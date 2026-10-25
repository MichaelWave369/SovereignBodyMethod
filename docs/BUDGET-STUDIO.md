# Grocery Budget Studio · Original Food Strategy, Local Prices

## Original material and fidelity

The source \`Reference_Appendices.docx\` contains a **GROCERY BUDGET GUIDE** section with three historical tiers. We parse only the food budget tiers, their original shopping tips, and the weekly food figures. We do **not** extract the supplement stacks or present original supplement claims as validated clinical advice.

| Original plan | Manuscript's historical weekly food budget | Notes |
|---|---|---|
| College Kid Budget | $50–75 | Bulk grains and beans, store brands, seasonal/frozen produce |
| RV Living Budget | $75–100 | Small cooking space, simple equipment, limited storage |
| Standard Budget | $100–125 | Higher-priced options |

These are historical author figures from the original manuscript, **not current retail estimates** or individualized spending recommendations.

The exact standalone Gumroad **Budget Wellness Guide** purchase package remains unverified. This app is a new companion tool, not a claim to have recovered that exact file.

## Personal Budget Planner

Integrated into the existing **Meals → Shopping list** tab. There is exactly one source ingredient collection; no separate invented recipe catalog.

- For each original ingredient **line**, visitors can enter their own estimated total price in **USD**.
- A price means estimated spending for that source ingredient line, *not a unit price per pound, a verified real-world price, or a computed cost based on a recipe's volume*.
- Original measures and quantities are never scaled or altered.
- Lines marked **Already have** are excluded from the planned spending estimate; lines marked **Bought** are still included in the planned total and split into the already-bought subtotal.
- The planner displays subtotal of entered prices, purchased subtotal, remaining subtotal, and **number of non-pantry lines without prices**.
- It does not claim the user is under their budget if prices remain missing.
- Every day and every week gets its own editable user-defined spending cap.
- Historical weekly budget limits are suggested only via an explicit click for the first three seven-day weeks. Week 4 covers nine days, and single-day periods are not comparable to the historical seven-day budgets.
- Visitors can copy their locally entered budget and ingredient amounts. This requires browser clipboard permission; all values stay in localStorage. No payment provider, telemetry, store API, tracking or network backend.

Price inputs are deliberately bounded to $0–$9,999 and 0–2 decimal places. Users should enter **their own actual or expected costs**, not rely on historic estimates.

## Offline and QA

\`scripts/budget-parser.mjs\` extracts the three historical tiers directly from original DOCX XML; \`scripts/import-budget.mjs\` generates \`public/budget/tiers.json\` during \`npm run build\` and \`npm run dev\`. The already-installed scoped PWA automatically includes this JSON in its site precache. Private prices remain entirely local to each browser, not shared across devices.

CI tests parse the real source ZIP, validate prices, enforce incomplete-estimate states, and confirm already-have/purchased accounting. No additional dependencies are required.
