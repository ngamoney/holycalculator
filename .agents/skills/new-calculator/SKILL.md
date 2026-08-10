---
name: new-calculator
description: Use when creating a new calculator page for Holy Calculator. Scaffolds the page, calculation logic, FAQ schema, and registry entry following project conventions.
---

# Creating a new calculator

1. Ask the user for: calculator name, category, and the formula/logic if non-obvious.
2. Add an entry to data/calculators.json (slug, category, title, metaDescription, relatedSlugs).
3. Create the pure calculation function in lib/calculations/[category].js — plain JavaScript, no TypeScript, unit-testable, no UI code.
4. Create app/[category]/[slug]/page.jsx using components/calculators/CalculatorShell.jsx.
5. Write the "how it works" explanation (200-400 words) and 3-5 FAQ entries — real, specific content, not filler.
6. Add FAQ schema (JSON-LD) via lib/seo/schema.js.
7. Add 2-4 related calculator links, pulled from calculators.json.
8. Verify: run the dev server, open the page in the browser tool, test the form with real inputs, confirm no layout shift when the ad slot area renders.