# AGENTS.md — OBGYN Decoded

Instructions for AI agents / contributors working in this repository.

## Project nature

Clinical reference application for doctors (obstetrics & gynaecology, India-first), distributed as a static, Netlify-deployable PWA built with Vite + React. **Clinical accuracy and source traceability outrank everything else.**

## Non-negotiable rules

1. **Never write clinical content from memory without a registered source.** Every topic must list `sourceIds` referencing `data/clinical-source-map.json`. If a source is not yet verified for the specific recommendation, set the topic's `status` honestly (`review`/`outdated`) and leave `lastVerifiedAt` unset — the app displays "PENDING CLINICAL VERIFICATION".
2. **Never mark a source `verified-live`** unless you actually opened it and checked the implemented recommendations on that date. Record the check in `dateChecked` + `checkedAgainst`.
3. **Doses must be complete**: drug/dose/route/frequency/duration (+preparation/max/contraindications where clinically relevant). No "as per protocol" placeholders.
4. **Conflicting guidelines**: use the `conflict` block — show both, the population difference, India consideration, then the app default with reasoning. Never silently pick one.
5. **Static clinical application**: no clinical backend, accounts, sign-in, Google client IDs or cookies. Content lives in source files and is bundled into the static build; deploy is to Netlify. Owner-authorized exception (17 October 2026): a Netlify Edge Function verifies crawler identities and filters automated requests; ordinary doctor-facing pages remain public.
6. **No automatic publishing**: statuses are authored in source and reviewed in the PR. Never mark content `published`/`clinically-verified` without completing rule 2.

## Commands

- `npm run dev` — Vite dev server (:5173)
- `npm run build` — typecheck + static production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run typecheck` — strict TS; must pass before any commit
- `npm test` — content integrity: unique ids + every `sourceId` registered
- `npm run docs:matrix` — regenerate `/docs/*` from the registry; docs are generated, do not hand-edit

## Content authoring

- Topics live in `src/content/diseases/*.ts`, typed by `src/content/types.ts`.
- Reuse exported regimen constants (e.g., `MGSO4_PRITCHARD`, `ANTENATAL_STEROIDS` from hdp.ts) instead of duplicating doses; convert to dose cards with the local `doseCard()` helper.
- Keep strings single-line; files are written UTF-8.

## Error-correction loop

If an error is found: FIX → VERIFY SOURCE → UPDATE DATA → RETEST (`typecheck` + `test`) → CHECK DEPENDENT MODULES (drug DB rows, calculators, emergency protocols referencing the same agent) → REBUILD → REGENERATE DOCS.

## Security

- The deployed site is public and static: never commit secrets, credentials, patient data, or private endpoints.
- No environment variables are required for deploy; all shipped content is public clinical reference material with registered sources.

## Owner's crawler policy — 17 October 2026

- Intended AI allowlist: **Gemini/Google Search, ChatGPT, muse.ai, Grok and Claude**. Other identified automated clients are denied. Do not silently add Bing, other AI services, SEO crawlers or social preview bots.
- The owner explicitly selected **keep pages public for doctors**, rather than require sign-in. This is a public-site bot filter, not a confidentiality or zero-scraping guarantee. Never describe it as impossible to bypass: a scraper can impersonate a normal browser and the source repository is public.
- Never grant a bot access just because its User-Agent, Referer (`google.com` included), claimed device, country, location, or client-supplied forwarded-IP headers look legitimate.
- Use Netlify's trusted `context.ip` and a provider's documented, dedicated crawler ranges. Do not allow all Google Cloud/AWS/Azure addresses. Verification failures deny automated access; they must not fall back to trusting a name.
- Grok and muse.ai remain intended providers with **no configured verifiable identity** until a dedicated official identity/range source is established. Never invent their crawler names or open a User-Agent-only exception to claim all five work.
- See `CRAWLER_ACCESS_POLICY.md` and the edge-function security tests. Do not weaken these controls during SEO changes.
- Ask the owner before a production deployment or a `main` update that triggers one.

## Owner's backlink request — 17 October 2026

- Every public OBGYN page must include a visible, followable HTML link to ICU Decoded. The verified destination used by this implementation is `https://icudecodedd.com/`; `icudecode.com` was also named by the owner but its live destination was not verified.
- Use the shared `ICU_DECODED_URL` constant. Keep this link in the prerendered page footer, client navigation and generated text references. Do not add `nofollow` or `sponsored` to this owner's related-reference link.
- The implemented request is a backlink: OBGYN pages retain their own content and canonical URLs, with a normal link to ICU Decoded. Do not replace the clinical site with blanket redirects as part of this SEO work.
