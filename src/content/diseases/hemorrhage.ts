import type { DiseaseTopic } from '../types'

/* ============================================================
   HAEMORRHAGE MODULES
   Primary international source: WHO Consolidated guidelines for
   prevention, diagnosis & treatment of PPH (Oct 2025, WHO/FIGO/ICM)
   + WHO TXA recommendation 2017 + WHO 2023 blood-loss/bundle recs.
   India context: FOGSI blood-transfusion & obstetric-haemorrhage GCPRs.
   Verified 2026-08-23.
   ============================================================ */

const SRC = { whoPph: 'who-pph-consolidated-2025', whoTxa: 'who-txa-pph-2017', whoBundle: 'who-bloodloss-bundle-2023', whoUtero: 'who-uterotonics-2018' }

export const HEMORRHAGE_TOPICS: DiseaseTopic[] = [
  /* ==================== POSTPARTUM HAEMORRHAGE ==================== */
  {
    id: 'pph',
    title: 'Postpartum Haemorrhage (PPH)',
    category: 'obstetric-emergency',
    tags: ['pph', 'postpartum-haemorrhage', 'atony', 'txa', 'uterotonics', 'balloon-tamponade', 'massive-transfusion'],
    aliases: ['primary pph', 'secondary pph', 'heavy bleeding after delivery', 'bleeding after birth'],
    status: 'clinically-verified',
    version: 2,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'india-first',
    summary: 'Blood loss >500 mL vaginal / >1000 mL caesarean OR any loss compromising haemodynamics. Treat as a BUNDLE: call help → uterine massage → oxytocin infusion → TXA within 3 h → examine for trauma/tissue → escalate to tamponade/surgery. Never wait for the count to fall.',
    definition: 'Primary PPH: bleeding from genital tract within 24 h of birth exceeding 500 mL after vaginal birth or 1000 mL after caesarean, or any loss sufficient to compromise haemodynamic stability (WHO 2025). Secondary PPH: abnormal/excessive bleeding from 24 h up to 12 weeks postpartum.',
    riskFactors: [
      'Previous PPH', 'Placenta praevia/accreta', 'Multiple pregnancy', 'Polyhydramnios', 'Anaemia (Hb<9 g/dL)', 'Grandmultiparity', 'Obesity', 'Bleeding disorder / anticoagulants',
      'Intrapartum: prolonged labour (oxytocin use)', 'Precipitate labour', 'Operative vaginal birth', 'Caesarean esp. emergency', 'Chorioamnionitis', 'Retained placenta', 'MgSO4 therapy', 'Severe anaemia',
    ],
    redFlags: [
      'SHOCK INDEX (HR÷SBP) ≥0.9 — early hypovolaemia marker',
      'BP falling / HR rising / pallor-sweating',
      'Continued ooze with "normal" vitals in anaemic women (Hb<8 masks collapse)',
      'Boggy uterus despite massage',
      'Bleeding continuing after uterine contraction achieved → trauma/tissue/coagulopathy',
      'Oliguria <0.5 mL/kg/h',
    ],
    differentials: [
      { condition: 'Uterine atony (70–80%)', clue: 'Soft boggy uterus; contracts with massage' },
      { condition: 'Genital tract trauma', clue: 'Firm uterus + bright continuous bleeding — inspect cervix/vagina/perineum' },
      { condition: 'Retained tissue/placenta', clue: 'Incomplete placenta/membranes; US shows retained products' },
      { condition: 'Coagulopathy/DIC', clue: 'Oozing from IV sites, no formed clot; low fibrinogen first to fall' },
      { condition: 'Uterine inversion', clue: 'Fundus not palpable/dimpled; mass at introitus (see emergency)' },
      { condition: 'Uterine rupture', clue: 'Prior scar + fetal parts superficial + shock + CTG catastrophe' },
    ],
    initialAssessment: [
      { kind: 'steps', steps: [
        'CALL FOR HELP — declare "PPH"; activate unit protocol; note time zero',
        'ABC: high-flow O₂ if shocked; position flat/left-lateral',
        'Two large-bore (14–16G) IV cannulae; send: CBC, crossmatch, coagulation (+fibrinogen), renal/liver, lactate where available',
        'Quantify blood loss (calibrated drape/weigh swabs) — visual estimation underestimates by 30–50%',
        'Palpate uterus → ATONIC? start massage immediately',
        'Empty bladder (catheter)',
        'Start crystalloid + oxytocin infusion while assessing cause (4Ts: Tone/Trauma/Tissue/Thrombin)',
      ] },
    ],
    investigations: [
      { kind: 'table', headers: ['Investigation', 'Purpose'], rows: [
        ['CBC + platelets (repeat q1–2h if major)', 'Baseline + trend; transfuse thresholds'],
        ['Group & save/CROSSMATCH', 'Component availability; MTP if ongoing'],
        ['PT/APTT/Fibrinogen (fibrinogen FIRST to fall in OB DIC)', 'Coagulopathy detection before overt oozing'],
        ['Lactate/ABG/ionised calcium', 'Shock depth; transfusion-related hypocalcaemia'],
        ['Bedside US', 'Retained tissue/free fluid; NOT a delay to treatment'],
      ] },
      { kind: 'warning', text: 'Life-saving resuscitation must NEVER wait for lab results — treat the patient, confirm with labs.' },
    ],
    treatment: {
      immediateStabilization: [
        { kind: 'steps', steps: [
          'Declare emergency + assign roles (team leader, drugs, recorder, runner)',
          'Massage uterus bimanually until firm',
          'Oxytocin 10 IU IM/IV slow + start INFUSION oxytocin 10 IU in 500 mL crystalloid at ~125 mL/h (40 mIU/min)',
          'TXA 1 g IV over 10 min AS EARLY AS POSSIBLE within 3 h of birth (2nd dose 1 g if bleeding continues at 30 min)',
          'Warm crystalloid rapid bolus; prepare blood',
          'Examine in theatre conditions: cervix, vagina, perineum, uterus cavity — repair trauma, remove tissue',
        ] },
        { kind: 'info', title: 'WHO PPH treatment bundle (2025)', text: 'The bundle pairs: message/call help · IV access · uterine massage · oxytocin infusion · TXA · empty bladder · examination — delivered TOGETHER rather than sequentially.' },
      ],
      firstLine: [
        { kind: 'doseCard', drug: 'Oxytocin', dose: '10 IU IM or IV slow (treatment); then 10 IU in 500 mL at 125 mL/h', route: 'IM/IV infusion', notes: ['First-line uterotonic (WHO Rec 7 family)', 'Cold-chain dependent — if storage doubtful, add alternative'], sourceId: SRC.whoUtero },
        { kind: 'doseCard', drug: 'Tranexamic acid', dose: '1 g in 10 mL IV over 10 min; repeat 1 g after 30 min if bleeding continues or restarts within 24 h', route: 'IV', frequency: 'Max 2 doses (2 g total)', prep: 'Slow push at 1 mL/min', contraindications: ['Do NOT initiate >3 h after birth (except restarted bleeding within 24 h window)', 'History of thromboembolism in this pregnancy', 'Active renal failure caution'], notes: ['For ALL PPH causes (not only trauma/atony)', 'NOT for prophylaxis (2025 Recs 14–15)'], sourceId: SRC.whoTxa },
      ],
      alternativesFirstLine: [
        { kind: 'table', headers: ['Second uterotonic', 'Dose', 'Cautions'], rows: [
          ['Ergometrine', '0.5 mg IM (repeat ×4 q6–15 min max 1 mg total acute)', 'AVOID hypertension/pre-eclampsia/cardiac disease/peripheral vascular disease'],
          ['Carboprost (PGF2α)', '250 µg IM q15 min — max 8 doses', 'Asthma (bronchospasm); avoid intramyometrial unless expert'],
          ['Misoprostol', '800 µg sublingual (single rescue dose)', 'Where injectables unavailable; pyrexia/shivering'],
        ] },
      ],
      drugTreatment: [],
      nonDrugTreatment: [
        { kind: 'list', items: [
          'Bimanual compression while preparing next step',
          'Non-pneumatic anti-shock garment (NASG) where available for transfer/stabilisation',
          'Warming (blankets/fluids) — hypothermia worsens coagulopathy',
          'Keep cumulative tally on whiteboard: EBL, products given, vitals timeline',
        ] },
      ],
      definitiveTreatment: [
        { kind: 'steps', steps: [
          'STEPWISE ESCALATION once uterotonics+TXA fail:',
          '1. UTERINE TAMPONADE: intrauterine balloon (Bakri/Rusch/Foley condom catheter) — fill with warm saline until bleeding stops (typical 150–500 mL); leave 6–24 h with antibiotic cover; document fill volume; keep traction tape',
          '2. If balloon fills >2× without control or refills → proceed to laparotomy (do not persist)',
          '3. LAPAROTOMY ladder: B-Lynch/compression sutures → uterine artery ligation → internal iliac ligation (expert) → stepwise devascularisation',
          '4. PERIPARTUM HYSTERECTOMY when conservative steps fail or accreta/intractable atony — decision early beats late (mortality rises with repeated failed attempts)',
          '5. INTERVENTIONAL RADIOLOGY: prophylactic/therapeutic iliac embolisation where available and patient stable enough',
          '6. RECOMBINATION of care: post-op ICU transfer, repeat coags, documentation',
        ] },
      ],
      monitoring: [
        { kind: 'table', headers: ['Parameter', 'Major-PPH schedule', 'Target'], rows: [
          ['Vitals (BP/HR/RR/SpO₂/temp)', 'q15 min until stable', 'SBP>90, HR<120, RR<24, SpO₂>95%'],
          ['Urine output', 'Hourly catheter', '>0.5 mL/kg/h (>30 mL/h)'],
          ['Hb + platelets + coags + fibrinogen', 'q1–2h during active phase', 'Hb>70 g/L; Plt>50; fibrinogen >1.5–2 g/L'],
          ['Calcium (ionised) + K⁺ + ABG', 'After every 4 units', 'Correct ionised Ca <1.1 mmol/L'],
          ['Conscious level/temp', 'Continuous', 'Normothermia ≥36°C'],
        ] },
      ],
      responseAssessment: [{ kind: 'list', items: ['Bleeding slowing; firm uterus; balloon holding without refill', 'Vitals normalising; urine output recovering', 'Coags correcting; no progressive oozing'] }],
      treatmentFailure: [{ kind: 'list', items: [
        'Re-examine for MISSED cause: retained cotyledon, upper vaginal/cervical tear, broad ligament haematoma, rupture',
        'Recheck coagulation — dilutional/fibrinogen loss common after 4 units crystalloid',
        'Consider uterine inversion or rupture if anatomy confusing',
        'If bleeding persists with packed pelvis → hysterectomy decision point',
      ] }],
      secondLine: [{ kind: 'list', items: ['rVIIa (recombinant activated factor VII): last-resort adjunct ONLY after pH/calcium/fibrinogen/platelet optimisation — haematology consult', 'Fibrinogen concentrate vs cryoprecipitate per availability'] }],
      rescue: [{ kind: 'list', items: ['Massive transfusion protocol activation: components in 1:1:1 ratio (PRBC:FFP:platelets) aiming fibrinogen >1.5 g/L', 'Aortic compression/NASG as bridge during transfer', 'Perimortem caesarean if arrest ≥20 wks at 4 min'] }],
      procedures: [{ kind: 'text', text: 'See procedures-mva (retained tissue), procedures-balloon-tamponade, procedures-blynch, procedures-peripartum-hysterectomy pages.' }],
      escalation: [
        { kind: 'list', items: [
          'IN-HOUSE: HDU/ICU for ongoing shock, transfusion >4 units, coagulopathy, oliguria',
          'TRANSFER (resource-limited): stabilise first — two IVs running, uterotonics given, balloon placed, NASG applied, catheter in, notes+crossmatch sample accompany; call receiving OT/blood bank ahead; skilled escort with adrenaline-free focus on volume+pressure',
          'Never transfer an uncontrolled bleeder without tamponade/compression attempted',
        ] },
      ],
      complications: [
        { name: 'DIC / dilutional coagulopathy', management: [{ kind: 'text', text: 'Ratio-based component therapy; fibrinogen replacement target >1.5 g/L; avoid FFP-only loops; recheck q1h' }] },
        { name: 'Dilutional thrombocytopenia', management: [{ kind: 'text', text: 'Platelets 1 pool per 6–8 units RBC or when <50×10⁹/L bleeding' }] },
        { name: 'Hypocalcaemia/hypothermia/acidosis (lethal triad partners)', management: [{ kind: 'text', text: 'Ionised Ca correction; active warming; ventilatory support for acidosis' }] },
        { name: 'Acute kidney injury', management: [{ kind: 'text', text: 'Volume restoration priority; avoid nephrotoxins; dialysis if AEIOU' }] },
        { name: 'Sheehan syndrome (late)', management: [{ kind: 'text', text: 'Post-event pituitary screen: prolactin/FT4/cortisol if lactation failure/fatigue; endocrinology referral' }] },
        { name: 'Secondary PPH', management: [{ kind: 'text', text: 'US for RPOC ± sepsis screen; antibiotics if infected; evacuation (MVA) with sepsis precautions; rare: GTN — send βhCG if persistent' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Anaemia correction: oral/IV iron per anaemia module; transfuse if symptomatic/Hb<70', 'Thromboprophylaxis reassessed AFTER haemostasis (high VTE risk category)', 'Lactation support; psychological debrief (PPH is traumatic)', 'Document timeline + products + decisions; incident reporting/MTP audit', 'Follow-up Hb check 2 weeks; contraception discussion delayed until stable'] }],
    },
    algorithm: [
      { id: 'p1', label: 'EBL >500 mL vaginal / >1000 mL CS or haemodynamic compromise', type: 'start', tone: 'danger' },
      { id: 'p2', label: 'CALL HELP · time zero · roles assigned', type: 'action', next: [{ to: 'p3' }] },
      { id: 'p3', label: '2×16G IVs · bloods+crossmatch · quantify loss · catheter', type: 'action', next: [{ to: 'p4' }] },
      { id: 'p4', label: 'Uterus soft?', type: 'decision', next: [{ to: 'p5', edgeLabel: 'YES (atony)' }, { to: 'p7', edgeLabel: 'NO' }] },
      { id: 'p5', label: 'MASSAGE + oxytocin bolus&infusion + 2nd uterotonic + TXA 1g', type: 'action', tone: 'danger', next: [{ to: 'p6' }] },
      { id: 'p6', label: 'Bleeding controlled in 10–15 min?', type: 'decision', next: [{ to: 'p10', edgeLabel: 'YES' }, { to: 'p8', edgeLabel: 'NO' }] },
      { id: 'p7', label: 'EXAMINE THEATRE CONDITIONS: tears? tissue? clotting? inversion? rupture?', type: 'action', tone: 'warn', next: [{ to: 'p9' }] },
      { id: 'p9', label: 'Repair/remove/correct — recheck tone loop', type: 'step', next: [{ to: 'p6' }] },
      { id: 'p8', label: 'BALLOON TAMPONADE (fill till stops)', type: 'action', tone: 'danger', next: [{ to: 'p11' }] },
      { id: 'p11', label: 'Balloon holds?', type: 'decision', next: [{ to: 'p10', edgeLabel: 'YES → observe 6–24h' }, { to: 'p12', edgeLabel: 'NO/refills' }] },
      { id: 'p12', label: 'LAPAROTOMY: B-Lynch → vessel ligation → HYSTERECTOMY decision', type: 'end', tone: 'danger' },
      { id: 'p10', label: 'Continue MTP if needed · ICU review · debrief · iron/VTE plans', type: 'end', tone: 'ok' },
    ],
    followUp: [{ kind: 'list', items: ['Hb recheck day 3 & 2 weeks', 'Lactation/psychological support', 'Future-pregnancy risk counselling + birth plan in equipped unit'] }],
    patientEducation: [{ kind: 'list', items: ['Danger signs at home: heavy clots/soaking pad hourly, dizziness, fainting → return immediately'] }],
    sourceIds: [SRC.whoPph, SRC.whoTxa, SRC.whoBundle, SRC.whoUtero],
    emergencyRef: 'emg-pph',
  },

  /* ==================== PLACENTA PRAEVIA ==================== */
  {
    id: 'aph-previa',
    title: 'Placenta Praevia & Low-lying Placenta (APH pathway)',
    category: 'obstetrics',
    tags: ['previa', 'aph', 'painless-bleeding', 'caesarean'],
    aliases: ['placenta previa', 'low lying placenta', 'bleeding painless third trimester'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Painless bright-red APH after 20 wks with malpresentation/high presenting part. NEVER digital examination. Localise with ultrasound; plan birth: resolve by 32 wks if minor/low-lying; caesarean for true praevia ~36–37 wks.',
    definition: 'Placenta covering/abutting internal os: low-lying (edge <20 mm from os), minor praevia (marginal/partially covering), major praevia (fully covering). Bleeding from placental-bed separation at lower-segment stretching.',
    riskFactors: ['Previous caesarean/scars', 'Grandmultiparity', 'Advanced maternal age', 'Smoking', 'Multiple pregnancy', 'Previous praevia', 'Assisted conception'],
    presentation: ['PAINLESS bright red vaginal bleeding (any amount may herald massive bleed)', 'Malpresentation/transverse/unstable lie', 'High free head', 'Often first bleed resolves then recurs larger'],
    redFlags: ['Active bleeding + CTG abnormality → deliver now', 'Bleeding after prior caesarean → suspect ACCRETA spectrum simultaneously', 'Haemodynamic instability', 'Bleeding at home remote from hospital → admit'],
    initialAssessment: [
      { kind: 'steps', steps: [
        'NO DIGITAL VAGINAL EXAMINATION (ever, until placenta excluded)',
        'Speculum ONLY if placenta excluded and diagnosis unclear (gentle, at os level)',
        'Stabilise: two IV lines, crossmatch, CBC+coags, Kleihauer if Rh-negative',
        'CTG continuous if viable gestation',
        'Transabdominal THEN transvaginal ultrasound (safe) to localise placental edge distance',
        'Steroids <34+6; consider MgSO4 neuroprotection <30–32 if birth imminent',
      ] },
    ],
    investigations: [
      { test: 'TVS placental localisation', lookingFor: 'Edge-to-os distance (<20 mm = low-lying; placenta COVERING os = praevia)' },
      { test: 'Signs of accreta (loss of clear zone, bladder-line interruption, lacunae)', lookingFor: 'Coexisting PAS — changes surgical planning entirely' },
      { test: 'CBC/coags/crossmatch', lookingFor: 'Anaemia baseline; readiness for surgery' },
      { test: 'Kleihauer (Rh-negative)', lookingFor: 'Anti-D dose calculation (500 IU standard; more per Kleihauer)' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Admit ALL significant APH', 'Crossmatch 2 units minimum (major praevia: group&save at minimum + immediate availability)', 'Continuous maternal+fetal monitoring', 'Nothing per vaginam'] }],
      firstLine: [
        { kind: 'list', items: [
          '<34+0 weeks + stable mother + viable fetus: EXPECTANT inpatient management — steroids complete, monitor, deliver on deterioration or reaching 36–37 wks',
          '≥34+0–37 wks with recurrent/significant bleeding: DELIVER by caesarean',
          'Asymptomatic low-lying (<20 mm): rescan 32 & 36 wks; vaginal birth permitted if edge ≥20 mm at 36 wks (NICE); individualise 15–20 mm',
          'True praevia asymptomatic: planned caesarean 36+0–37+0 (uncomplicated major); 37+0–38+6 for low-lying borderline cases per unit policy',
        ] },
        { kind: 'doseCard', drug: 'Betamethasone', dose: '12 mg IM ×2 doses 24 h apart', route: 'IM', duration: 'If <34+6 and any chance of preterm birth', sourceId: 'rcog-gtg74-steroids-2022' },
      ],
      definitiveTreatment: [{ kind: 'list', items: ['CAESAREAN BIRTH for praevia covering os — senior obstetrician + anaesthetist, cell-salvage/rapid infuser where available, anticipate accreta (see pas-spectrum)', 'Anterior praevia with prior scar: consent for possible hysterectomy; urology on standby for percreta'] }],
      monitoring: [{ kind: 'table', headers: ['Expectant inpatient schedule', 'Frequency'], rows: [['Vitals + PV loss chart', '4–6 hourly'], ['CTG', 'Daily (viable)'], ['Hb', 'Twice weekly (keep >100 g/L with iron)'], ['Rescan growth', 'Every 2–3 wks'], ['Steroid status', 'Complete course if <34+6']] }],
      responseAssessment: [{ kind: 'list', items: ['No further bleeding episodes ×48 h + stable Hb → discuss discharge criteria (living near hospital, reliable transport, companion)'] }],
      treatmentFailure: [{ kind: 'list', items: ['Any fresh bleeding episode in expectant phase → reassess for delivery', 'Massive bleed → activate massive haemorrhage pathway + emergency caesarean regardless of gestation (maternal life takes precedence)'] }],
      procedures: [{ kind: 'list', items: ['Caesarean technique: transverse uterine incision away from placenta where possible; anticipate need for internal iliac balloons/embolisation pre-placed in complex cases', 'NEVER attempt vaginal birth with placenta covering os'] }],
      escalation: [{ kind: 'list', items: ['Suspected accreta + limited facilities → IN-UTERO TRANSFER to centre with interventional radiology + blood bank + urology (do not deliver locally)', 'Massive haemorrhage team activation'] }],
      complications: [
        { name: 'Massive antepartum haemorrhage', management: [{ kind: 'text', text: 'Emergency caesarean + MTP; left-lateral tilt; vasopressor-supported anaesthesia' }] },
        { name: 'Accreta spectrum invasion', management: [{ kind: 'text', text: 'pas-spectrum pathway' }] },
        { name: 'PPH after birth', management: [{ kind: 'text', text: 'Lower segment poorly contracts → carbetocin/oxytocin infusion, balloon readiness, compression sutures standby' }] },
        { name: 'Rh sensitisation', management: [{ kind: 'text', text: 'Anti-D 500 IU (or Kleihauer-guided) within 72 h of every bleed if Rh-negative' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Post-caesarean surveillance for PPH/DIC', 'Thromboprophylaxis per risk assessment', 'Histopathology of placenta (confirm accreta)', 'Next-pregnancy counselling: recurrence + imaging strategy'] }],
    },
    sourceIds: [SRC.whoPph, 'rcog-gtg74-steroids-2022', 'nice-ng235-intrapartum-2026'],
    emergencyRef: 'emg-aph-massive',
  },

  /* ==================== PLACENTAL ABRUPTION ==================== */
  {
    id: 'aph-abruption',
    title: 'Placental Abruption',
    category: 'obstetric-emergency',
    tags: ['abruption', 'aph', 'painful bleeding', 'dic', 'couvelaire'],
    aliases: ['accidental haemorrhage', 'abruptio placentae', 'tight painful uterus'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Premature separation — PAINFUL tense uterus ± dark bleeding ± fetal distress. Hidden losses mislead; DIC is the killer. Delivery decision dominates management; steroids <34, MgSO4 <32, aggressive coagulation support.',
    definition: 'Premature separation of a normally situated placenta before birth. Revealed/concealed/mixed patterns; grades I–III (clinical severity).',
    riskFactors: ['Hypertensive disorders (strongest)', 'Trauma/RTA/domestic violence', 'Cocaine use', 'Smoking', 'Preterm PROM', 'Rapid decompression (polyhydramnios amniotomy)', 'Thrombophilia', 'Previous abruption (recurrence 5–17%)'],
    presentation: ['Constant abdominal/back PAIN + woody tender uterus', 'Dark venous bleeding (may be concealed — shock out of proportion to visible loss)', 'Reduced movements/abnormal CTG', 'Idiopathic preterm labour', 'Rare: couvelaire uterus found at surgery'],
    redFlags: ['Abnormal CTG/decelerations → birth NOW', 'Maternal shock with small visible loss', 'Oozing from puncture sites (DIC established)', 'No fetal heart → stillbirth pathway + coagulopathy vigilance', 'Renal failure signs'],
    initialAssessment: [
      { kind: 'steps', steps: [
        'Call senior help; declare abruption',
        'Left lateral tilt + O₂; two IV lines; crossmatch ×4 + coags INCLUDING fibrinogen',
        'CTG immediately (viability) — category determination',
        'Estimate fundal height trend + palpate tonicity',
        'Kleihauer if Rh-negative (anti-D)',
        'Urinary catheter — hourly output',
        'Decision clock starts: deliver or stabilise-and-deliver',
      ] },
    ],
    investigations: [
      { test: 'CTG', lookingFor: 'Category III patterns mandate immediate birth' },
      { test: 'Fibrinogen (most sensitive OB-DIC marker) + PT/APTT + platelets', lookingFor: 'Coagulopathy BEFORE oozing visible' },
      { test: 'CBC (Hb misleading acutely)', lookingFor: 'Serial trend' },
      { test: 'US', lookingFor: 'Usually NORMAL — do not exclude abruption sonographically; excludes praevia' },
      { test: 'Creatinine + LFTs', lookingFor: 'End-organ injury; differentiate PE-driven abruption' },
    ],
    classificationTable: {
      caption: 'Clinical grading (traditional)',
      headers: ['Grade', 'Features', 'Action implication'],
      rows: [
        ['I (mild)', 'Mild pain/bleeding; uterus irritable; CTG normal', 'Observe closely; steroids; individualise'],
        ['II (moderate)', 'Moderate-severe pain; uterus tense; fetal distress present', 'Deliver (caesarean usually)'],
        ['III (severe)', 'Severe pain ± shock; fetal death or profound distress ± DIC/renal failure', 'Emergency birth; massive coagulation support'],
      ] },
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Resuscitate aggressively — visible loss underestimates total', 'Blood EARLY (not crystalloid-only): target SBP>90, Hb>80 pending full picture', 'Prepare theatre + neonatal team simultaneously'] }],
      firstLine: [
        { kind: 'list', items: [
          'VIABLE fetus + Category II/III CTG or maternal instability → EMERGENCY CAESAREAN',
          'Viable fetus, Grade I stable, CTG normal: close observation; steroids <34+6; induction reasonable once stable (vaginal often achievable quickly with abruption-induced labour)',
          'PRE-VIABLE (<24 wks) or fetal death: aim VAGINAL birth (safer with DIC) — augment labour; avoid caesarean in coagulopathic mother unless obstetric necessity',
          'MgSO4 neuroprotection if <30–32 wks birth imminent',
          'Steroids <34+6 if birth not imminent within hours',
        ] },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Birth empties the uterus and removes the procoagulant trigger — speed matters more than mode except where DIC tips balance toward vaginal route.' }],
      monitoring: [{ kind: 'table', headers: ['Domain', 'Schedule'], rows: [['Coags incl. fibrinogen', 'On admission + hourly until stable (DIC evolves fast)'], ['Urine output', 'Hourly (>0.5 mL/kg/h target)'], ['CTG', 'Continuous until birth'], ['Fundal height marking', 'Hourly (concealed expansion)'], ['Hb', 'Serial q1–2h']] }],
      responseAssessment: [{ kind: 'list', items: ['Pain settling post-birth', 'Uterus contracting; bleeding controlled', 'Coags stabilising; urine output recovering'] }],
      treatmentFailure: [{ kind: 'list', items: ['Persistent bleeding post-birth → atony (couvelaire uterus responds POORLY to uterotonics — proceed early to balloon/compression sutures)', 'Coagulopathy worsening → MTP ratios; cryoprecipitate/fibrinogen concentrate', 'Anuria >6 h → ICU/nephrology'] }],
      secondLine: [{ kind: 'list', items: ['Interventional radiology embolisation for refractory uterine bleeding (stable enough)', 'Hysterectomy for uncontrollable atonic haemorrhage'] }],
      rescue: [{ kind: 'text', text: 'Massive haemorrhage protocol + tranexamic acid 1 g IV (within 3 h of birth) per PPH bundle; renal replacement if indicated.' }],
      procedures: [{ kind: 'list', items: ['Caesarean: anticipate couvelaire uterus + PPH; active third stage mandatory; consider internal iliac identification early', 'Avoid regional anaesthesia if coagulopathy suspected pending results'] }],
      escalation: [{ kind: 'list', items: ['ICU for organ failure/coagulopathy', 'Peripheral centres: stabilize (volume+blood if any)+transfer WITH escort; do not await viability debates when mother bleeding'] }],
      complications: [
        { name: 'DIC', management: [{ kind: 'text', text: 'Ratio components; fibrinogen >1.5–2 g/L; platelets >50–75; recheck hourly' }] },
        { name: 'Acute tubular necrosis/renal cortical necrosis', management: [{ kind: 'text', text: 'Fluid resuscitation first; nephrology; dialysis indications AEIOU; long-term BP/proteinuria follow-up' }] },
        { name: 'Couvelaire uterus + PPH', management: [{ kind: 'text', text: 'Escalate directly: balloon → compression sutures → hysterectomy ladder' }] },
        { name: 'Stillbirth/neonatal encephalopathy', management: [{ kind: 'text', text: 'Bereavement care; neonatal cooling pathway where available; debrief + autopsy offer' }] },
        { name: 'Recurrence', management: [{ kind: 'text', text: 'Next-pregnancy: aspirin if hypertensive risk, earlier growth surveillance, timed birth discussion' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Renal function + BP checks at discharge and 6 weeks', 'Iron replacement; thromboprophylaxis once secure', 'Bereavement/psychological support pathways', 'Documentation for medico-legal clarity (trauma cases: safeguarding referral)'] }],
    },
    sourceIds: [SRC.whoPph],
    emergencyRef: 'emg-aph-massive',
  },

  /* ==================== VASA PRAEVIA ==================== */
  {
    id: 'vasa-previa',
    title: 'Vasa Praevia',
    category: 'obstetrics',
    tags: ['vasa-previa', 'fetal-bleeding', 'bradycardia-after-ROM'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Fetal vessels traversing membranes over the os — ROM tears them → exsanguinating FETAL blood loss with sinus bradycardia. Antenatal detection (TVS colour Doppler) converts a catastrophe into a planned 35-week caesarean.',
    definition: 'Type I: velamentous cord insertion vessels crossing os. Type II: vessels between placental lobes (bilobed/succenturiate lobe).',
    riskFactors: ['Velamentous cord insertion', 'Bilobed/succenturiate placenta', 'Second-trimester low-lying placenta (resolving)', 'Multiple pregnancy', 'IVF conception'],
    presentation: ['Usually ANTENATALLY SILENT unless screened', 'Classic intrapartum: rupture of membranes → sudden fetal bradycardia → dark bleeding (often minimal visible!)'],
    redFlags: ['Fetal bradycardia after ROM', 'Any APH with known vasa praevia', 'Triangular vessel pattern seen at speculum'],
    initialAssessment: [
      { kind: 'steps', steps: [
        'Suspect with risk factors → TVS greyscale + colour Doppler across os at booking/anomaly/28-wk scans',
        'Confirmed case: document clearly, counsel, plan birth',
        'Intrapartum suspicion: IMMEDIATE caesarean — do not wait for blood confirmation (Apt/alkali denaturation tests are historic adjuncts only)',
      ] },
    ],
    investigations: [
      { test: 'TVS colour Doppler', lookingFor: 'Vessels overlying internal os (diagnostic)' },
      { test: 'CTG', lookingFor: 'Variable decelerations→bradycardia sequence' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Unsuspected intrapartum event: declare fetal emergency → category-1 caesarean within minutes', 'Neonatal team primed for anaemia/resuscitation (cord gases, possible transfusion)'] }],
      firstLine: [
        { kind: 'list', items: [
          'ANTENATAL DIAGNOSIS: corticosteroids 28+0–33+6 window (course completion before planned birth)',
          'PLANNED CAESAREAN 35+0–36+0 weeks (asymptomatic uncomplicated Type I/II per SMFM/RCOG-era practice; individualise earlier with bleeding/growth issues)',
          'Admit ~30–34 wks if bleeding episodes/risk factors accumulate',
          'ROM at home with confirmed vasa praevia: come in immediately even without contractions',
        ] },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Timed caesarean BEFORE membrane rupture. Vaginal birth is contraindicated.' }],
      monitoring: [{ kind: 'list', items: ['Growth scans q3–4 wks (coexisting FGR risk)', 'CTG on any bleeding/ROM presentation', 'Colour-flow confirmation scan at 32 & 35 wks (persistent)'] }],
      escalation: [{ kind: 'list', items: ['Category-1 caesarean pathway', 'Neonatal ICU alert for anticipated anaemia (Hb check at birth; isotonic volume expander/O-negative blood ready)'] }],
      complications: [
        { name: 'Fetal exsanguination', management: [{ kind: 'text', text: 'Immediate birth + neonatal resuscitation with volume; umbilical cord blood gas; O-negative emergency blood for neonate' }] },
        { name: 'Missed diagnosis', management: [{ kind: 'text', text: 'Audit + document; risk-factor-based screening policy improvement' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Standard caesarean recovery', 'Next pregnancy: early TVS Doppler screening at 16–20 wks + 28 wks'] }],
    },
    sourceIds: ['rcog-gtg74-steroids-2022'],
  },

  /* ==================== PLACENTA ACCRETA SPECTRUM ==================== */
  {
    id: 'pas-spectrum',
    title: 'Placenta Accreta Spectrum (acreta/increta/percreta)',
    category: 'obstetrics',
    tags: ['accreta', 'percreta', 'invasion', 'caesarean-hysterectomy', 'multidisciplinary'],
    aliases: ['morbidly adherent placenta', 'MAP', 'abnormally invasive placenta', 'AIP'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Abnormal placental invasion through the decidua — the modern maternal-surgery killer (praevia + previous caesarean is the classic setup). OUTCOME IS PLANNED: detect on imaging, refer to a centre with blood bank + IR + urology, deliver electively 35–37 wks with multidisciplinary team.',
    definition: 'Accreta (attached to myometrium), increta (into myometrium), percreta (through serosa ± adjacent organs). FIGO/AIP classification grades 1–3 based on topography.',
    riskFactors: ['PLACENTA PRAEVIA + PRIOR CAESAREAN (synergistic — risk rises steeply with number of scars)', 'Any uterine scar (myomectomy)', 'Grandmultiparity', 'Asherman/previous curettage', 'Submucous fibroids', 'Maternal age'],
    presentation: ['Usually ANTENATAL IMAGE DETECTION', 'May present as APH/PFH at caesarean with placenta that will not separate', 'Percreta: haematuria, bladder symptoms, rectal bleeding rarely'],
    redFlags: ['Praevia + ≥1 prior caesarean → SCREEN EVERY CASE', 'Loss of retroplacental clear zone', 'Numerous placental lacunae (grade 2–3)', 'Bladder wall interruption + subplacental hypervascularity', 'Abnormal fetal-MRI findings where used'],
    initialAssessment: [
      { kind: 'steps', steps: [
        'Screening ultrasound (greyscale + colour Doppler) for ALL praevia-with-scar cases at anomaly scan (~18–22 wks) AND again ~28 wks',
        'Suspicion → REFER to accredited centre (FIGO-endorsed multidisciplinary model) — do not manage operatively in unequipped facilities',
        'MRI adjunct where topographic mapping needed (posterior/parametrial invasion, ureteric involvement)',
        'Multidisciplinary board: obstetrics, anaesthesia, interventional radiology, urology, neonatology, haematology, intensive care',
      ] },
    ],
    investigations: [
      { test: 'TVS/TAS Doppler', lookingFor: 'Lacunae, clear-zone loss, bladder-line interruption, bridging vessels, subplacental vascularity' },
      { test: 'MRI pelvis (selected)', lookingFor: 'Depth/topography; parametrial/posterior extension; ureteric proximity' },
      { test: 'CBC, group&save, antibody screen', lookingFor: 'Transfusion planning; anaemia optimisation' },
      { test: 'Renal function ± CT urogram (percreta with urinary symptoms)', lookingFor: 'Ureteric involvement mapping' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Unsuspected finding at caesarean: DO NOT pull the placenta — call senior help, close over placenta in situ (conservative bridge) and transfer to capable centre OR convert to caesarean hysterectomy if team assembled', 'Never piecemeal-remove an accreta'] }],
      firstLine: [
        { kind: 'list', items: [
          'PLANNED MULTIDISCIPLINARY CAESAREAN HYSTERECTOMY (standard recommended management) at 35+0–36+6 weeks (earlier 34+0–35+0 for bleeding episodes/extreme invasion)',
          'Conservative management (leaving placenta in situ/methotrexate-assisted resorption) = SELECTED EXPERT-CENTRE ALTERNATIVE only — high risks: infection, haemorrhage, late hysterectomy, GTN-confounding follow-up',
          'Cell salvage + rapid infuser prepared; 4–6 units crossmatched minimum (complex: 10+)',
          'Prophylactic internal iliac balloon occlusion/pre-operative embolisation: institution-dependent evidence — use per local protocol',
        ] },
      ],
      definitiveTreatment: [{ kind: 'steps', steps: [
        'THEATRE SEQUENCE (planned case):',
        '1. Regional±GA strategy per anaesthetics (long case; GA conversion readiness)',
        '2. Midline/transverse access chosen for exposure; bladder flap HIGH',
        '3. Fetus delivered via incision AVOIDING placenta (transverse fundal where anterior percreta)',
        '4. Cord clamped; NO placental traction',
        '5. Hysterectomy performed WITH placenta in situ (total hysterectomy ± parametrial dissection per grade)',
        '6. Bladder cystotomy repair/ureteric stenting as mapped pre-op by urology',
        '7. Haemostasis layer-wise; packing option; IR embolisation on standby',
      ] }],
      monitoring: [{ kind: 'table', headers: ['Phase', 'Watch'], rows: [['Intra-op', 'Cumulative blood loss >2 L → activate MTP formally'], ['HDU/ICU 24–48 h', 'Ongoing ooze, urine output, coags, bladder drain contents (haematuria)'], ['Day 2–5', 'Ileus, infection, VTE prophylaxis timing, wound']] }],
      responseAssessment: [{ kind: 'list', items: ['Stable counts/coags', 'Drains dry/declining', 'Ambulating; bowel function returning'] }],
      treatmentFailure: [{ kind: 'list', items: ['Re-look laparotomy for bleeding → IR embolisation → packing + damage-control closure', 'Urine leak → urology re-imaging (CT urogram) + stent revision'] }],
      secondLine: [{ kind: 'list', items: ['Delayed-interval approach complications managed jointly (sepsis → antibiotics ± completion hysterectomy; secondary haemorrhage → embolisation)'] }],
      rescue: [{ kind: 'text', text: 'Catastrophic haemorrhage: aortic compression/clamp, massive transfusion ratios, damage-control surgery with packing + transfer to ICU, re-look in 24–48 h.' }],
      procedures: [{ kind: 'text', text: 'Detailed operative pages: see procedures-caesarean-hysterectomy (linked).' }],
      escalation: [{ kind: 'list', items: ['ALL suspected/confirmed PAS births belong in centres with: 24/7 blood bank incl. massive supply, interventional radiology, urology, experienced obstetric surgeon, ICU, neonatal unit', 'In-utero transfer BEFORE labour beats emergency retrieval'] }],
      complications: [
        { name: 'Massive haemorrhage', management: [{ kind: 'text', text: 'MTP activation; ratio components; cell salvage; consider rFVIIa adjunct only after physiology corrected' }] },
        { name: 'Bladder/ureteric injury', management: [{ kind: 'text', text: 'Intra-op urology repair; stents 6 weeks; post-op cystogram/urogram' }] },
        { name: 'VTE', management: [{ kind: 'text', text: 'Extended prophylaxis post-discharge (28 days) balancing bleeding risk' }] },
        { name: 'Psychological trauma/fertility loss', management: [{ kind: 'text', text: 'Debrief; counselling referral; documented fertility discussion pre-operatively' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Histopathology confirmation', '6-week pelvic review; urinary function check', 'Contraception: permanent methods discussion appropriate', 'Next pregnancy impossible without uterus — document counselling'] }],
    },
    algorithm: [
      { id: 'pa1', label: 'Praevia + previous caesarean identified', type: 'start' },
      { id: 'pa2', label: 'Targeted US Doppler screening (18–22 & 28 wks)', type: 'step', next: [{ to: 'pa3' }] },
      { id: 'pa3', label: 'Signs of invasion?', type: 'decision', next: [{ to: 'pa4', edgeLabel: 'YES' }, { to: 'pa5', edgeLabel: 'NO → routine pathway' }] },
      { id: 'pa4', label: 'REFERRAL CENTRE: MDT board ± MRI · blood/IR/urology logistics', type: 'action', tone: 'warn', next: [{ to: 'pa6' }] },
      { id: 'pa6', label: 'Planned caesarean hysterectomy 35–37 wks (earlier if bleeding)', type: 'end', tone: 'ok' },
    ],
    sourceIds: [SRC.whoPph],
    emergencyRef: 'emg-massive-transfusion',
  },
]
