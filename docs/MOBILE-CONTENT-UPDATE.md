# Mobile reading and clinical-content update

Prepared 17 October 2026 for OBGYN Decoded. The owner approved production publishing on 17 October 2026.

## Mobile findings and changes

Production verification also identified Netlify's injected attribution badge covering the phone Search, Urgent and Menu controls. Its frame now sits above the bottom navigation, with additional footer and toast clearance. Modal dialogs stay above the badge. A browser regression check reproduces the fixed frame and checks actual navigation hit targets; the attribution remains visible and functional.

The previous production build expanded a 390-pixel phone viewport to 702 pixels on the magnesium-sulfate reference and 999 pixels on the source register. The layout, forms, badges and tables now remain within the viewport. Clinical table rows become labelled cards below 640 pixels. Larger text and controls, safe-area spacing, labelled bottom navigation and a full menu make all sections reachable on phones.

Topics default to the full guide. A section jump control and focused-section mode support long-page reading. Search includes the additional assessment and clinical-detail text. The algorithm renderer now displays every authored node with explicit branch links; previously a start node without an outgoing connection could hide all remaining nodes. Drug-use cards now include the authored duration, monitoring, adverse effects and other available safety fields.

## Content scope

42 topics have additional assessment, management-decision, follow-up and pitfall explanations. 43 source records were added, bringing the register to 65. Each added section records its own source-check date and scope. This is a substantial content expansion, not a claim to have completed a full-library clinical audit.

New material is present in canonical page HTML and regenerated text references, with the relevant source links and existing module-review labels. Crawler identity controls and the ICU Decoded footer backlink are retained.

## Identified clinical corrections

- PUL: removed progesterone as a diagnostic adjunct; symptoms take priority over hCG; corrected the 48-hour hCG interpretation, review and repeat-scan pathway. Reference: NICE NG126 diagnosis chapter.
- Stable tubal ectopic pregnancy: corrected selection descriptions, day-4/day-7 hCG response wording and postoperative follow-up. Removed automatic repeat dosing and an unsupported universal two-dose ceiling. NICE eligibility and the NHS local dose reference are distinguished in a conflict block.
- Miscarriage: corrected the missed/incomplete medical-regimen distinction and repeat-scan/second-opinion wording. Replaced unrelated membrane-rupture/legal citations with relevant early-pregnancy references.
- Recurrent miscarriage: removed the consecutive-loss requirement; clarified scan-confirmed intrauterine pregnancy and the 16-week continuation criterion for the indicated progesterone pathway.
- Dependent methotrexate, misoprostol and mifepristone drug rows, ruptured-ectopic post-event care and the MVA RhD-prophylaxis reference were updated for consistency. The June 2026 NICE RhD guidance is explicitly linked and its local applicability is not assumed.

The affected early-pregnancy modules remain in review. A partial correction does not preserve a misleading full-module verification claim. The NHS GGC dose protocol's scheduled review date is recorded as September 2026; its limited check is labelled accordingly. Remaining legacy regimens and broader clinical material were not all independently re-audited in this update.

## Verification

Use the recorded command output for final results:

```sh
npm run typecheck
npm test
npm run docs:matrix
npm run build
npm run test:build
npm run test:client
npm run test:mobile
```

The browser verifier checks all 156 generated pages at 320 and 390 pixels and representative routes at 768 and 1440 pixels. It also exercises the phone menu, search, keyboard focus, full-guide/section controls, labelled medication fields, enlarged text, hydration and desktop navigation. Engineering checks do not constitute medical validation.

## Recorded results — 17 October 2026

- TypeScript check and production build passed.
- 18 content, source, SEO and crawler tests passed.
- 6 generated-output checks and 3 production-client tests passed (27 tests total).
- 340 Chromium layout checks passed: all 156 pages at 320 and 390 pixels, plus 14 representative routes at 768 and 1440 pixels.
- Phone menu navigation, dialog focus/escape, full-text search, full-guide/section controls, keyboard tab navigation, labelled dose cards, enlarged text, hydration and desktop navigation passed.
- A production-only hosting-badge overlap was identified during live screenshot review. The follow-up browser check reproduces its fixed frame and verifies that every bottom-navigation control receives taps and the badge stays below modal dialogs.
- Mobile and desktop screenshots were visually reviewed and are saved in `docs/mobile-review/`.
- `git diff --check` passed.
