# AGENTS.md — OBGYN Decoded

Instructions for AI agents / contributors working in this repository.

## Project nature

Clinical reference application for doctors (obstetrics & gynaecology, India-first), distributed as a static, Netlify-deployable PWA built with Vite + React. **Clinical accuracy and source traceability outrank everything else.**

## Non-negotiable rules

1. **Never write clinical content from memory without a registered source.** Every topic must list `sourceIds` referencing `data/clinical-source-map.json`. If a source is not yet verified for the specific recommendation, set the topic's `status` honestly (`review`/`outdated`) and leave `lastVerifiedAt` unset — the app displays "PENDING CLINICAL VERIFICATION".
2. **Never mark a source `verified-live`** unless you actually opened it and checked the implemented recommendations on that date. Record the check in `dateChecked` + `checkedAgainst`.
3. **Doses must be complete**: drug/dose/route/frequency/duration (+preparation/max/contraindications where clinically relevant). No "as per protocol" placeholders.
4. **Conflicting guidelines**: use the `conflict` block — show both, the population difference, India consideration, then the app default with reasoning. Never silently pick one.
5. **Static site only**: no servers, APIs, accounts, sign-in, Google client IDs, cookies or backend dependencies. Content lives in source files and is bundled into the static build; deploy is to Netlify.
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
