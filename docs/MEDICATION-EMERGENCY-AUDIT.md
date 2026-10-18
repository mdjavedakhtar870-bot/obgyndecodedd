# Medication and emergency depth audit

Prepared 17 October 2026 following the owner's report that the PPH emergency page named drugs without usable dosing, preparation or duration. This report covers a targeted source-based medication and emergency update, not independent clinician certification of the entire library.

## Implemented scope

- **108 indication-specific regimens** shared by **68 drug references**. Each contains indication, dose, route, frequency/repeat interval, duration or stopping rule, preparation/concentration/administration, maximum or reassessment limit, monitoring, contraindications/cautions and a registered primary source.
- **All 18 emergency protocols** expanded through recognition, help, immediate action, investigations, definitive treatment, escalation and post-event care. Drug cards appear inside the initially open immediate-action section, with a direct medication jump link.
- **47 mapped topics** receive shared medication/dependency corrections, including PPH, hypertension/eclampsia, induction, early pregnancy, infection, diabetes/DKA, VTE, HG, thyroid disease, iron, antenatal prophylaxis and gynaecological treatment. A separate molar-pregnancy correction replaces an unrelated membrane-rupture citation and updates evacuation/surveillance guidance.
- All structured topic dose cards retain preparation, duration, frequency, limits, monitoring and safety fields after assembly. Medication instructions elsewhere in narrative text were checked for identified contradictions; that is not a claim that every sentence in all 66 topics was reverified.
- **143 registered sources**, with recommendation-level check scopes. Drug references and affected modules remain in review; regimen check dates are separate from full-module verification.

The 18 October addition expands the existing antenatal guide with first-, second- and third-trimester investigations, repeat timing, test purpose/action, a WHO eight-contact calendar (one/two/five by trimester), and the Indian glucose-test preparation. It labels NHM/NICE visit models, risk-driven extra reviews and scan/GBS policy differences. Related diabetes corrections distinguish screening methods, birth/labour/postpartum pathways and remove contradictory metformin, hypoglycaemia and fixed-infusion shorthand. Pre-existing-diabetes HbA1c, renal, birth and postpartum dependencies were checked against NICE NG3; this does not certify the whole module.

## Material corrections

| Area | Correction and practical consequence | Primary reference |
| --- | --- | --- |
| PPH | Six complete drug choices; distinguish ergometrine from methylergometrine, carboprost interval/2 mg ceiling, early TXA and its second-dose rule. Tamponade requires suitable conditions and source assessment; surgery must not be delayed by a rigid ladder. | WHO PPH 2025; MSF; individual uterotonic labels |
| Hypertension | Separate maintenance from acute formulations; explicit IV preparation and repeat sequences. Display NHM prose/flowchart discrepancies for nifedipine and labetalol. Remove the false claim that NICE treats only severe gestational BP. | India NHM CEmONC 2024, chapter 4; NICE NG133; MSF |
| Magnesium | Complete IV/IM alternatives, stop/monitoring criteria, recurrence ceiling and calcium rescue. Remove the false 4.8 mEq/L toxicity threshold and inappropriate needle specification. | MSF magnesium/calcium; NICE NG25 |
| Maternal arrest | Usual ALS with manual uterine displacement; prepare resuscitative birth early at the arrest location instead of waiting for a four-minute trigger. | RCUK 2025 ALS/special circumstances |
| Sepsis | Pregnancy-specific fluid reassessment, source-specific antibiotic examples and source control. Norepinephrine tartrate/base and pump units are explicit. | SMFM Consult 67; NICE NG255; Malaysian national antimicrobial guidance; MSF |
| GBS / penicillins | Ampicillin 2 g then 1 g every four hours; benzylpenicillin 3 g then 1.5 g every four hours. Separate grams/million units, benzathine IM and aqueous IV products. | National antimicrobial guidance; benzylpenicillin SmPC; CDC syphilis guidance |
| Syphilis | Stage-specific courses, pregnancy missed-dose restart rule and product identity. Remove a neonatal ten-day every-12-hour shorthand that ignored the infant's changing age. | CDC pregnancy/neurosyphilis/congenital-syphilis guidance |
| Anaphylaxis | Separate IM 500-microgram repeat treatment from 1 mg IV/IO arrest dosing; expert infusion preparation for refractory reactions. | RCUK anaphylaxis/ALS |
| DKA / hypoglycaemia | Explicit 1 unit/mL insulin preparation, weight-based infusion, glucose/potassium monitoring, resolution criteria and transition overlap. Do not delay lifesaving glucose while looking for thiamine. | JBDS-IP DKA/hypoglycaemia guidance |
| Thyroid | TFT-guided replacement; lowest-effective-dose antithyroid therapy and possible switch beyond 20 weeks. Remove routine block-and-replace; give a complete specialist storm sequence including iodine timing. | RCOG GTG76 2025 plus May 2026 correction; 2026 joint thyroid-storm consensus; product labels |
| HG | Separate oral/IV ondansetron, formulation-specific doxylamine/pyridoxine, oral/parenteral thiamine, first-line antihistamine and short-course metoclopramide. | RCOG GTG69 2024, Appendix III; product labels; MSF preparation reference |
| IV iron | Calculate total replacement need before splitting infusions; weight/session/week limits, saline dilution, observation and phosphate monitoring. | Ferinject SmPC |
| ICP | Symptom-directed UDCA with a limit and explicit absence of proven stillbirth prevention. No routine menadiol course: the old local proposal conflicts with the product's late-pregnancy contraindication. | SMFM Consult 53; RCOG ICP counselling; menadiol SmPC |
| Gynaecology | Separate PCOS metabolic metformin, monitored letrozole, combined-pill formulation, IUS indication-specific duration, and sequential/continuous HRT protection. | PCOS 2023; named NHS fertility pathway; MSF; Mirena/Estradot labels; BMS |
| Antenatal visits / investigations | Eight-contact calendar plus separate trimester tables, repeat timing, result actions and risk-driven testing. India programme and NICE appointments are labelled. | WHO; India NHM; NICE NG201; WHO bacteriuria; RCOG GBS |
| GDM dependencies | Separate non-fasting Indian testing from fasting NICE testing; explicit medication choice, complete hypoglycaemia rescue, and distinct growth/birth/labour/postpartum pathways. | India GDM 2018; NICE NG3; shared medication sources |
| Molar pregnancy | Ultrasound-guided suction approach, no routine second curettage, histology and referral; partial versus complete hCG surveillance and current plateau/rise criteria. | FIGO Cancer Report 2025 |

## Source limitations retained explicitly

- Indian NHM nifedipine/labetalol prose and flowcharts disagree. The app explains both and its selected limit/reassessment point; it does not combine them into a purported universal protocol.
- MSF's general postoperative ondansetron pregnancy caution differs from RCOG's HG-specific second-line pathway; both and the indication-based default are displayed.
- MSF's nifedipine tocolysis caution about magnesium differs from the monitored hypertension discussion in NHM. The indication/setting difference is displayed.
- The older local ICP menadiol proposal is not the app default because of its product contraindication and current RCOG advice that most patients do not need vitamin K.
- Some primary pages restrict direct access. The registry distinguishes full checks from primary indexed-text/summary checks. WHO PPH and ANC/calcium scope records do not pretend a browser challenge was a successful full-document review. The RCOG HG full primary paper was read via an accessible copy; its canonical publisher link is retained.
- The NHS GGC ectopic methotrexate protocol has a scheduled September 2026 review date; currency and NICE eligibility are distinguished. Existing 2015 RCOG VTE and 2014 cord-prolapse references are not described as new 2026 editions.
- Broader viral/chronic indexes, specialist oncology/rare-site ectopic protocols, neonatal treatment and legal details still need their own full source audit. Individualised drugs do not acquire invented universal maximum doses to satisfy a form.

## Engineering validation

Content tests require complete fields, registered and scoped sources, reused emergency regimens, retained topic safety details, honest statuses and selected high-risk correction regressions. Build checks require the full emergency medication fields in initial HTML and open sections. Chromium checks cover every generated page at phone widths and directly exercise the PPH medication jump, navigation, search, labelled tables and production-hosting badge clearance.

Recorded prepublication results, 18 October 2026 (including the trimester addition):

- TypeScript and clean production build passed: 192 HTML pages, 190 sitemap entries and 190 text references.
- 24 content/source/SEO/crawler tests, 8 generated-output checks and 3 production-client tests passed (35 total).
- 416 Chromium layout checks passed: all 192 pages at 320 and 390 pixels, plus 16 representative routes at 768 and 1440 pixels.
- Phone menu/search/focus, full-guide/section controls, all trimester investigation jumps and calendar entries, emergency drug/preparation jump, labelled fields, hosting-badge hit targets, enlarged text, hydration and desktop navigation passed.
- Phone screenshots for the trimester tables/calendar, PPH medication detail and a drug reference were visually reviewed; examples are in `docs/medication-review/`.
- `git diff --check` passed. The first local build found stale generated output; moving that output aside and running a clean build resolved it. A case-sensitive mobile assertion was corrected for CSS-uppercase field labels, then the full browser pass completed.

Production deployment and live-page verification are separate final checks against the committed result. Engineering checks demonstrate rendering and data consistency; they do not replace independent clinical review.
