# Final Clinical Review — OBGYN Decoded

Date: 2026-09-14

## Honest summary

- Clinical modules authored this cycle: **44**
- Modules with recommendation-level verification against their cited source: **40**
- Remaining modules carry structured, guideline-anchored content but are explicitly flagged **pending specialist verification** in-app and in CLINICAL-AUDIT.md.
- Drug database entries: **32** (dose rows source-referenced; verify against local formularies before prescribing).
- Calculators: **12** (each lists formula + source; no invented tools).
- Emergency protocols: **18** following RECOGNIZE→CALL→ACT→INVESTIGATE→DEFINITIVE→ESCALATE→POST-EVENT.

## Verification performed this cycle (searched & opened 2026-08-23)

| Area | Primary source found current | Notes |
| ---- | ---------------------------- | ----- |
| HDP (India-first) | FOGSI–GESTOSIS–ICOG GCPR **3rd Ed 2026** (Jan 2026 PDF on fogsi.org) | definitions, thresholds ≥140/90, targets ≤140/90, delivery timing encoded |
| HDP international | ISSHP 2021; ACOG CHAP advisory Apr 2022; ESC/ESH 2024 | conflict-engine entries included where societies differ |
| Intrapartum | NICE NG235, published Sep 2023, **last updated 9 Jun 2026** | vitamin K reintroduction Jun 2026 noted in labour module |
| PPH | **WHO Consolidated guidelines Oct 2025** (+TXA 2017, bundle 2023) | TXA NOT prophylaxis at CS/vaginal birth encoded |
| STI regimens | CDC STI Treatment Guidelines 2021 (page reviewed Dec 2025 — still current edition) | ceftriaxone 500 mg monotherapy etc. |
| India MTP law | MTP Amendment Act 2021 (Gazette) + Amendment Rules 2021 | limits/categories/Medical Board/confidentiality encoded verbatim-level |
| Endometrial cancer | FIGO staging 2023 + ESGO-ESTRO-ESP Update 2025 | molecular staging integrated |
| PCOS | International Evidence-based Guideline 2023 | letrozole first-line OI; AMH alternative to ultrasound |
| ANC | WHO ANC 2016 + updates incl. Maternal Health compendium 2nd ed Mar 2025 | IFA/calcium/aspirin/anti-D doses |

## Unresolved issues / requiring manual specialist review

1. RCOG GTG43 (ICP) delivery-timing wording is dated relative to newer individualisation data — module flagged `outdated` pending re-audit.
2. RCOG GTG36 GBS replacement edition in development (draft stage Aug 2026) — monitor quarterly update page.
3. Viral-infections index module (HIV/HBV/HCV/rubella/CMV/varicella/flu/COVID) is a condensed quick-reference; full dosing expansions require NACO/WHO/CDC cross-checks (flagged in-module).
4. Chronic-disorders index module (asthma/epilepsy/cardiac/CKD/SLE/APS) likewise condensed — full expansions queued v1.1 with obstetric-medicine specialist input.
5. Chemotherapy protocols are deliberately NOT reproduced without verified documents; oncology modules route to centre protocols.
6. All "verified" statuses remain subject to named-clinician sign-off before clinical deployment — automated research cannot replace accountable professional review.

## Deployment notes

- Static Netlify deployment: the clinical library ships inside the app bundle (`npm run build` → `dist`); no server, no accounts, no sign-in.
- Each topic's authored `status` + `lastVerifiedAt` are the source of truth and are shown in-app alongside source badges.
- `npm test` validates content ids and that every source reference resolves in `data/clinical-source-map.json`; `npm run typecheck` must pass before deploy.
