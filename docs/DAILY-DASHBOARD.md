# Daily Sovereign Dashboard: Shared 30-Day Navigation

## Why

Previously the site's Journey, 90-recipe meal planner, 23-technique movement studio, and 28-day water calendar had disconnected day selectors. The dashboard connects all four to one **selected day**, avoiding accidental mismatched content.

## Source integrity

| Dashboard panel | Source |
|---|---|
| Smoothie, salad and dinner | Source-authored weekly recipe DOCX files, published as \`meals/recipes.json\` |
| Movement rhythm | Original three-day training structure from the foundational manual, published as \`movement/studio.json\` |
| Water flavor | Original 28-day infused-water Word guide, published as \`hydration/schedule.json\` |
| Reflection | Newly-authored introductory website companion \`src/method.js\`, **not** from an original Word manual |

Day 29 and 30 have no water entry in the source and correctly show an explicit boundary notice. Movement remains a repeating **three-day source template**, not thirty separately authored workouts. Recipes are neither rescaled nor invented. The dashboard imports the same cached JSON sources as the existing sections. Its expanded meal card shows original ingredients, preparation instructions, prep time, serving size and filename.

## Storage and sharing

App owns the currently selected day and three optional completed-day sets:

- \`sovereign-body-method.meals.day.v1\` (shared day)
- \`sovereign-body-method.days.v1\` (reflection)
- \`sovereign-body-method.movement.done.v1\` (movement)
- \`sovereign-body-method.hydration.done.v1\` (water)

These **existing** browser-local keys remain compatible with previous visits. All three checklists are optional, reversible, and independent. No account, tracking, cloud data or personal medical records.

The original subtools now receive the shared day and their progress via React props rather than holding duplicate unsynchronized state. The app defaults to the stored meal-planner day or day one if storage is unavailable. The fourth week still covers days 22–30; water days stop at 28.

## Mobile and offline

The header offers a keyboard-accessible **Explore** disclosure menu on mobile, instead of silently hiding all section links. The desktop navigation adds **Your day**. Offline builds use the existing scoped PWA with the already-cached recipe, movement and hydration source JSON; no extra download or permission required.

## Acceptance checklist

1. Choose Day 12 in the dashboard. Journey, Meals and Movement should all display Day 12, and hydration should display the Day 12 blend.
2. Choose Day 29 and 30. All 90 original recipes and the repeating movement rhythm remain, but water correctly reports no authored entry.
3. Tick a reflection/movement/water item in the dashboard; check its original section for matching progress and undo it there.
4. Pick another day in Meals or Movement; dashboard and Journey must follow.
5. On a narrow mobile viewport, open **Explore**, follow the movement or water link, and use keyboard navigation.
6. Confirm Offline Kitchen status is ready, disable network and reload; dashboard must still show the source day.
