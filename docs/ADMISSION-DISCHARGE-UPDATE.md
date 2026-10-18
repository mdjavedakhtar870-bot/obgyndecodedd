# Admission and discharge update — 18 October 2026

The missing admission and discharge decisions are now explicit throughout the clinical library: 66 clinical topics, all 18 emergency pages and all 6 procedure pages. The searchable `/admission-discharge/` guide links to each case and contains a 12-part discharge checklist. All care guidance is rendered into the initial public HTML and the generated text references.

## Clinical content

Every plan covers the care setting, indications for admission or continued hospital care, when outpatient/day care may be suitable, readiness for home care, medicine changes, repeat/pending investigations, home care, follow-up and urgent return symptoms. Plans contain case-specific decisions; a shared checklist supplies the handover requirements.

The checklist covers diagnosis/course and responsible clinician; clinical recovery and residual risks; full medicine reconciliation and supply; pending results and their reviewer; bleeding/VTE prevention; wound/perineum/drain/catheter care; pregnancy/newborn handover; recovery and counselling; arranged appointments; emergency access; mental health/support/safeguarding; and patient understanding with a written summary.

High-risk examples include:

- Pre-eclampsia: all NICE postnatal transfer criteria, BP medicine adjustment/monitoring, 2-week/6–8-week review and persistent-proteinuria renal follow-up.
- PUL/ectopic/miscarriage/mole: diagnosis uncertainty, treatment-specific hCG or urine-test schedules, histology ownership, rupture/haemorrhage warnings and contraception/fertility follow-up.
- Diabetes: postpartum GDM stopping differs from pre-existing insulin treatment; DKA recovery requires ketone/pH resolution and a safe insulin transition, with education and supplies.
- Infection: pregnancy pyelonephritis initially inpatient under the labelled ACOG pathway, renal-penetrating step-down treatment and 14-day total course; PID admission criteria, 72-hour response review and remaining 14-day treatment; culture/result ownership and source control after sepsis.
- Bleeding/operations: source control, organ/anaemia recovery and remaining treatment; removal/reassessment after uterine tamponade; restored uterus after inversion; rupture repair/hysterectomy, organ injury, catheter and fertility follow-up. Critical-care step-down and transfer are separate from home discharge.
- Fertility treatment: OHSS fluid/urine/renal/thrombosis assessment, admission when home monitoring is unsafe and avoiding NSAIDs in OHSS.
- Procedures: aftercare for colposcopy, IUD placement, MVA, balloon tamponade, hysteroscopy and caesarean, with wound/device/result follow-through.

Three shared indication-specific regimens were added: oral paracetamol, postpartum/nonpregnant ibuprofen and treatment-dose postpartum iron/folate. The library now contains 111 regimens across 70 drug references. Doses retain route, timing, duration/response endpoint, formulation/preparation, maximum, contraindications and monitoring. Listed alternatives are not simultaneous prescriptions. Emergency IV glucose is excluded from the discharge medicine examples.

## Source scope and service differences

The 18 new registry entries and scoped rechecks use official NICE, NHM, WHO, RCOG, NHS, CDC, MSF, RCUK, JBDS and other primary references. The registry records exactly which recommendations were checked and where access was limited. A source being available online does not make its edition new.

India NHM/LaQshya recommends at least 48 hours after normal delivery. WHO's international baseline is at least 24 hours, with further contacts at 48–72 hours, day 7–14 and week 6. NICE's 24-hour post-caesarean option is for selected uncomplicated UK recovery with home follow-up. These populations/service models are shown separately. None is automatic discharge clearance when maternal, newborn or support concerns remain.

The WHO postpartum iron recommendation was checked from indexed primary recommendation text; direct NCBI table access presented a browser check. ACOG full UTI/torsion recommendations are access-limited, so the existing summary scope remains explicit. RCOG OHSS patient information is the 2016 edition on the current webpage. No claim of a newly reviewed full guideline is made for those sources.

These are clinical checklists for individual decisions, not a validated discharge score. Whole modules remain in review, with full verification dates unset. Broad medical/viral indexes and oncology pages state their limits: they do not supply complete disease-specific specialty, neonatal, chemotherapy or complex postoperative protocols. A named clinician must confirm the actual prescription, monitoring and safe destination.

## Implementation and verification

`data/admission-discharge-plans.json` contains 69 profiles: the 66 topic plans plus three additional aftercare profiles used by procedures/emergencies. Source and medication references are assembled centrally so the clinical pages and exports agree. Emergency/procedure overlays retain their specific requirements.

The guide is linked from the home page, navigation and relevant pages; topic links open the care section even after focused reading. Search includes admission/discharge text. Canonical metadata, sitemap and text generation include the new guide and drug pages; the raw Google verification file remains separate and unchanged.

Release validation passed: type checking and production build; 27 content/SEO/crawler tests; 9 generated-build tests; 4 client tests; and 430 real-Chromium layout checks. All 195 generated app pages fit 320- and 390-pixel screens before JavaScript; 20 representative pages also fit tablet/desktop widths. The 193 canonical sitemap entries and text references include the new guide and drug pages. Interactive checks cover hub search/category filtering, care deep links, repeat jumps after focused reading, readiness/medicine/follow-up sections, dose expansion and the existing phone navigation. Google verification file bytes and the original crawler policy checks passed. These software checks do not independently establish clinical correctness.

Phone screenshots: [case finder](discharge-review/admission-discharge-hub-390.png), [PPH readiness](discharge-review/pph-discharge-readiness-390.png), [pre-eclampsia follow-up](discharge-review/preeclampsia-discharge-followup-390.png), [caesarean follow-up](discharge-review/caesarean-discharge-followup-390.png).
