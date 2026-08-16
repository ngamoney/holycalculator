---
description: Slash command to scaffold a new calculator end-to-end
---

Ask me for: calculator name, category, and formula/logic (if not obvious from the name).

Then follow the new-calculator skill exactly:
1. Register it in data/calculators.json
2. Write the calculation logic in lib/calculations/ (plain JavaScript, no TypeScript)
3. Build the page using CalculatorShell.jsx
4. Write the explanation + FAQ content
5. Add FAQ schema
6. Add related calculator links
7. Run it and verify in the browser before telling me it's done
8. Mobile input table reviewed against Mobile Input Layout Standard 
      in SKILL.md — no truncation, delete icon isn't stealing column width