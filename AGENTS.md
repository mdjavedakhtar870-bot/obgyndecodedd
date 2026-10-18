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

## Owner's medication-depth correction — 17 October 2026

- A drug name or “second uterotonic” alone is insufficient. For each indicated regimen give dose, route, frequency/repeat interval, duration/stop criteria, preparation/concentration/rate, maximum or reassessment limit, contraindications and monitoring, with an actually checked primary source.
- `data/medication-regimens.json` is the shared regimen source. `data/drug-catalogue.json`, `data/emergency-protocols.json` and topic `regimenCard()` references must reuse it. Do not restore copied legacy dose strings that can diverge between a topic, emergency and drug page.
- Keep products, indications, units and formulations separate: ergometrine/methylergometrine, IM/IV adrenaline, elemental iron/salt weight, benzathine/aqueous penicillin, steroid routes, immediate/modified-release nifedipine, and norepinephrine tartrate/base are not interchangeable.
- Do not invent fixed ceilings or durations when prescribing is individualised. State the titration, monitoring and reassessment decision explicitly. Product-specific preparation is not a universal recipe for all brands.
- Check surrounding summaries, tables, algorithms, complications and dependent procedures as well as dose cards. Display genuine guideline conflicts; remove false comparisons after checking the source.
- Emergency drug detail must remain in the initially open immediate-action section, reachable with the “Drug doses & preparation” link. On drug pages, keep monitoring/cautions attached to the indication they apply to.
- A dated regimen check does not certify the entire clinical module. Retain honest review status and the scoped source record. See `docs/MEDICATION-EMERGENCY-AUDIT.md` for this audit's scope and remaining work.

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

## Owner's mobile and content request — 17 October 2026

- Prioritise phone reading and navigation. Test generated pages at 320 and 390 pixels, plus representative tablet and desktop widths. Wide clinical tables must retain clear field labels without stretching the page viewport.
- Make content useful through actual assessment, decision, follow-up and pitfall explanations with relevant sources. Do not add filler, invented citations, rankings or claims that AI systems endorse the site.
- Additional detail is authored in `src/content/clinical-details.ts` and assembled into the same HTML shown to doctors and verified crawlers. Its section check date is separate from full-module verification. Preserve that distinction in metadata, exports and generated documentation.
- Render all authored algorithm nodes and keep branch destinations explicit. Do not invent clinical edges to repair incomplete graphs.
- `npm run test:mobile` exercises real Chromium; DOM-only tests do not establish responsive layout correctness.

## Owner's trimester and visit-calendar request — 18 October 2026

- Keep the antenatal guide explicit about first-, second- and third-trimester investigations, when to repeat each test, what an abnormal result changes, and how many routine contacts are recommended.
- The WHO baseline calendar has eight contacts (one/two/five by trimester); label India's programme minimum and NICE's parity-based appointment schedules separately. Risk-driven reviews and timed investigations may require extra appointments.
- Do not present every blood test, late ultrasound, CTG or GBS swab as mandatory in every pregnancy. Show routine, repeated and indication-driven care clearly.
- Keep the national Indian non-fasting glucose method distinct from fasting diagnostic frameworks, including preparation, sample timing, thresholds and postpartum follow-up. Preserve the scoped check date and full-module review status.
