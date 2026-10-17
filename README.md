# OBGYN Decoded

Doctor-facing **obstetrics & gynaecology clinical reference and decision-support application**, built India-first.

A doctor opens it during a clinical problem, searches the condition, and gets: assessment → a detailed source-traceable treatment pathway (exact doses, routes, frequencies, durations) → monitoring → failure/second-line/rescue logic → escalation — with the underlying guideline one click away.

> Supports clinical decision-making; does not replace clinical judgement or institutional protocols. Content carries explicit verification status — never treat flagged/pending content as authoritative.

## Stack (single static bundle)

| Layer | Technology |
| --- | --- |
| Web app / PWA | Vite + React 18 + TypeScript, custom design system (dark/light) |
| Clinical content | Typed library in `src/content` + `data/clinical-source-map.json`, bundled at build time |
| Hosting | Static Netlify pages (`netlify.toml`, real 404 fallback), with an owner-authorized edge crawler filter — no clinical server, accounts or sign-in |
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

**Netlify deploy:** `netlify.toml` sets the build command (`npm run build`) and publish directory (`dist`). The build prerenders every registered route. No secrets or custom environment variables are required. The primary Netlify `URL` is used for canonical links; `SITE_URL` can explicitly override it. Local production builds default to the verified site, `https://obgyndecodedd.netlify.app`. Deploy previews/branch deploys are noindex and deny automatic crawling. Ask the owner before updating the live production site.

## Tests & verification

```powershell
npm run typecheck      # strict TS across app + content
npm test               # content integrity: unique ids, every sourceId registered
npm run docs:matrix    # regenerate CLINICAL-SOURCE-MATRIX / AUDIT / FINAL-REVIEW
npm run build          # typecheck + Vite bundle + HTML/text/sitemap generation
npm run test:build     # validate every generated page, URL, source link and export
npm run test:client    # production-bundle hydration and interaction smoke tests (DOM)
npm run test:mobile    # Chromium layout + phone navigation/reading checks
```

The mobile check requires a Chromium installation (`npx playwright-core install chromium`). A managed browser executable can instead be selected with `MOBILE_QA_BROWSER_PATH`; `MOBILE_QA_SERVERLESS=1` enables the flags needed by a serverless Chromium build. `MOBILE_QA_SCREENSHOTS=docs/mobile-review` saves the reviewed screenshots. The verifier tests every generated page at 320 and 390 pixels, plus representative tablet and desktop routes, and exercises the production JavaScript on a touch viewport.

## Mobile reading and clinical detail

- Phone navigation includes a labelled bottom bar, a complete menu, searchable clinical text, 44-pixel touch targets and 16-pixel form inputs. Dialogs trap keyboard focus, close with Escape and restore focus.
- Clinical tables become labelled cards on narrow screens, retaining dose, route, frequency, duration and maximum relationships. No whole-page horizontal scrolling is required.
- Topic pages open as a full guide with a section jump control. Focused sections remain available. Every authored algorithm node is rendered, with explicit links to branch destinations; an incomplete start-node connection can no longer hide the rest of a pathway.
- Additional source-checked assessment, management-decision, follow-up and pitfall explanations cover 42 topics. Their check dates apply to those sections, not the entire module. The source register records the exact scope.
- Identified early-pregnancy reference and pathway errors were corrected alongside the expansion. The affected modules remain in review. See `docs/MOBILE-CONTENT-UPDATE.md` for scope and validation.

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

## SEO, AI discovery and crawler policy

- 154 public canonical routes: 66 topics, 18 emergency protocols, 32 drug references, 12 calculators, 6 procedures, 10 differential presentations and 10 directories/information pages. Local preferences and the error page are noindex.
- Each page is readable before JavaScript runs, with its own title, description, canonical link, Open Graph/Twitter metadata, Schema.org page/website/breadcrumb data and relevant clinical-source citations. All topic tabs are present in HTML; no-JavaScript readers can read each section.
- Directory-page canonical URLs, sitemap entries and internal links use trailing slashes to match Netlify's final 200 responses. Use the shared link components so new internal links keep that convention.
- Each page includes a normal footer backlink to [ICU Decoded](https://icudecodedd.com/), using the shared `ICU_DECODED_URL` constant. OBGYN pages retain their own canonical URLs.
- The build generates `/sitemap.xml`, `/robots.txt`, an HTML `/sitemap`, `/llms.txt`, `/llms-full.txt`, `/content-index.json`, `/clinical-sources.json`, and per-page `/reference/*.md` text exports. Tables retain their HTML columns in text exports. Exports require a verified supported crawler; clinical HTML remains public to browsers.
- `CRAWLER_ACCESS_POLICY.md` records the owner's five-service allowlist, verification sources and public-access limitations. Google, OpenAI and Anthropic have configured dedicated range checks. Grok and muse.ai remain pending a documented verifiable identity source; names alone never grant access.
- No clinical content, clinical statuses, review dates or guideline-source records are changed by the SEO pipeline. Sitemap dates are omitted rather than inferred from a build. `llms.txt` is an optional convenience, not a search-engine requirement or ranking guarantee.

After an approved deployment, submit `/sitemap.xml` in Google Search Console, inspect representative deep URLs, and check CDN/security settings allow the verified crawler requests. The edge guard intentionally runs on every site path, including assets, so its use has Netlify request/edge usage implications.
