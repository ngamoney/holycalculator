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

## Mobile Input Layout Standard
All calculator input tables (assignment/grade/weight style rows, or any 
multi-column input grid) must follow this on mobile:
- No input value or placeholder text may visibly truncate for realistic 
  inputs (names up to ~20 chars, values up to 3 digits)
- Delete/action icons must be small tap-target icons (~36-40px), never a 
  full-width dedicated column that steals space from data fields
- Use the site's standard sans-serif input font — never inherit a 
  monospace/wide font on number inputs
- Input tables must use the full viewport width on mobile (full-bleed), not 
  the page's default reading-width margins — only a small internal gutter 
  (~8-12px) should remain. Page-level margins are for text content; the 
  input table gets priority on width since every pixel here reduces 
  truncation risk. This applies to every calculator's input table, not 
  just grade/GPA.
- Touch targets stay ≥40x40px even at narrow widths
- Reference: /reference/grade-calculator-mobile-fix.png (calculator.net 
  layout = target clarity level)