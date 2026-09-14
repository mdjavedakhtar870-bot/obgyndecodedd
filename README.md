# OBGYN Decoded

Doctor-facing **obstetrics & gynaecology clinical reference and decision-support application**, built India-first.

A doctor opens it during a clinical problem, searches the condition, and gets: assessment → a detailed source-traceable treatment pathway (exact doses, routes, frequencies, durations) → monitoring → failure/second-line/rescue logic → escalation — with the underlying guideline one click away.

> Supports clinical decision-making; does not replace clinical judgement or institutional protocols. Content carries explicit verification status — never treat flagged/pending content as authoritative.

## Stack (single static bundle)

| Layer | Technology |
| --- | --- |
| Web app / PWA | Vite + React 18 + TypeScript, custom design system (dark/light) |
| Clinical content | Typed library in `src/content` + `data/clinical-source-map.json`, bundled at build time |
| Hosting | Static Netlify deploy (`netlify.toml`, SPA fallback) — no server, no accounts, no sign-in |
| Docs pipeline | `npm run docs:matrix` regenerates clinical docs from `data/clinical-source-map.json` |

## Quick start

```powershell
npm install
npm run dev            # web :5173
```

Production build (static output in `dist/`):

```powershell
npm run build
npm run preview        # serve the production build locally
```

**Netlify deploy:** connect the repository — `netlify.toml` sets the build command (`npm run build`), publish directory (`dist`) and SPA redirect. No environment variables are required.

## Tests & verification

```powershell
npm run typecheck      # strict TS across app + content
npm test               # content integrity: unique ids, every sourceId registered
npm run docs:matrix    # regenerate CLINICAL-SOURCE-MATRIX / AUDIT / FINAL-REVIEW
```

## Clinical architecture

- **Source registry** — `data/clinical-source-map.json`: every recommendation traces to a registered source with URL, version, population, date-checked and honest status (`verified-live` / `verified-summary` / `pending-verification` / `outdated`).
- **India-first tiering** — FOGSI/ICOG GCPRs lead where they exist (e.g., HDP GCPR 3rd Ed 2026). International references are labelled per module: ISSHP 2021, ACOG CHAP advisory 2022, NICE NG235 (updated Jun 2026), WHO Consolidated PPH guidelines (Oct 2025), CDC STI Treatment Guidelines 2021, FIGO endometrial staging 2023 + ESGO-ESTRO-ESP 2025, International PCOS Guideline 2023, MTP Amendment Act/Rules 2021 (Gazette-verified).
- **Guideline-conflict blocks** show both positions, the population difference, the practical India consideration, and the app default with reasoning.
- **Treatment engine** renders the full 17-section structure with dose cards, warning boxes, tables, algorithms and escalation ladders.
- **Honest statuses** — each topic/drug/procedure carries authored `status` + `lastVerifiedAt`, shown in-app with source badges. There is no CMS: edits happen in source files and are reviewed like code.

## Documentation

- `docs/CLINICAL-SOURCE-MATRIX.md` — every source, version, date checked, status, usage map
- `docs/CLINICAL-AUDIT.md` — module-by-module verification table (never claims unverified work)
- `docs/FINAL-CLINICAL-REVIEW.md` — honest review report including unresolved items
