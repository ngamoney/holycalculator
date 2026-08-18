# Holy Calculator — Project Rules

## Stack
- Next.js (App Router), static generation per page
- JavaScript only — no TypeScript, no .ts/.tsx files
- Tailwind CSS
- No backend/database — all calculators run client-side
- Deploy target: Vercel

## URL & file structure
- Route pattern: /[category]/[calculator-name]
- Categories: finance, health, math, date-time, conversions, spiritual
- Every new calculator = one entry in data/calculators.json + one page.jsx (or page.js)
- Components: .jsx
- Logic/utility files: .js

## Every calculator page MUST include (in this order)
1. Form (instant calculation on input, no submit button, debounce 150-300ms)
2. Result display
3. "How it works" explanation, 200-400 words, keyword-rich
4. FAQ section (3-5 Qs) with FAQ schema markup (JSON-LD)
5. Related calculators (2-4 links)
6. Unique <title>/<meta description>/<h1> per page — never reused

## Design tokens (do not deviate without asking)
- Colors: ink #14171F, paper #F6F3EC, paper-raised #FDFCF8,
  gold #C9992F, gold-deep #9C7420, indigo #3B3564 (spiritual category only), green #4F7A5B
- Fonts: Sora (headings), Inter (body), JetBrains Mono (numbers/labels/code)
- Category icon colors: finance=ink, health=green, math=gold-deep, date=#7A6A55, conversions=#4A5A6B, spiritual=indigo
- Section Vertical Rhythm tokens: --section-gap-sm (24px), --section-gap-md (36px), --section-gap-lg (56px), --section-gap-xl (80px)

## Performance rules (non-negotiable)
- No client-side data fetching for calculation logic — pure JS functions in lib/calculations/
- Reserve fixed height for ad slots (no layout shift)
- Lighthouse performance score must stay 90+ — flag me if a change risks this

## Retention features every calculator should support
- Save last 5 results to localStorage
- Shareable result URL via query params (e.g. ?rate=5&amount=200000)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
