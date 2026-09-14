import type { DiseaseTopic } from '../types'

/* ============================================================
   EARLY PREGNANCY / EPL / MTP (INDIA LAW MODULE)
   Sources: RCOG GTG 21-era principles (Green-top 21 ectopic),
   NICE NG126 ectopic/miscarriage framework; INDIA MTP Act 2021 +
   Rules verified from Gazette 2026-08-23; WHO abortion-care guidance.
   ============================================================ */

export const EPL_TOPICS: DiseaseTopic[] = [
  /* ============ PREGNANCY OF UNKNOWN LOCATION ============ */
  {
    id: 'pul',
    title: 'Pregnancy of Unknown Location (PUL)',
    category: 'early-pregnancy',
    tags: ['pul', 'bhcg', 'early-pregnancy', 'ectopic-rule-out'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Positive pregnancy test with no pregnancy visualised on TVS. It is a DESCRIPTION, not a diagnosis. Serial hCG + review until location declared; ~7–20% are ectopic.',
    definition: 'Positive urinary/serum pregnancy test without sonographic evidence of intrauterine OR extrauterine pregnancy.',
    presentation: ['Asymptomatic screen finding', 'PV bleeding/pain prompting scan'],
    redFlags: ['Haemodynamic instability → treat as ruptured ectopic NOW', 'Severe unilateral pain', 'Shoulder-tip pain'],
    initialAssessment: [{ kind: 'steps', steps: ['TVS by trained operator', 'Baseline serum βhCG', 'Group&save; Rh status', 'Safety-net instructions in writing'] }],
    investigations: [
      { test: 'Serial serum βhCG (48 h apart)', lookingFor: '≥63% rise at 48h → likely viable IUP; plateau/declining or suboptimal rise → suspect non-viable/ectopic' },
      { test: 'Repeat TVS at βhCG >1500–2000 IU/L (discriminatory zone)', lookingFor: 'Location declaration' },
      { test: 'Progesterone (where available)', lookingFor: '<5 ng/mL strongly suggests failing pregnancy' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'Unstable patient bypasses PUL pathway entirely — resuscitate + laparotomy for presumed ruptured ectopic.' }],
      firstLine: [
        { kind: 'list', items: [
          'Stable + suboptimal hCG kinetics: repeat hCG 48-hourly; consider methotrexate pathway ONLY once ectopic suspected/confirmed per local protocol',
          'Stable + likely failing pregnancy (hCG falling): expectant with weekly hCG to negative',
          'hCG rising normally: rescan at 10–14 days for viability/location',
        ] },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Pathway ends when pregnancy is located as viable IUP, failing PUL resolved to negative hCG, or ectopic confirmed → respective pathways.' }],
      monitoring: [{ kind: 'list', items: ['Documented safety-netting: return immediately with pain/bleeding/dizziness', 'Every woman gets a contact number + review date'] }],
      escalation: [{ kind: 'list', items: ['Any instability → emergency gynaecology theatre'] }],
      complications: [{ name: 'Missed ectopic during follow-up', management: [{ kind: 'text', text: 'Strict adherence to review schedule prevents; document each step' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Confirm resolution with negative hCG', 'Contraception discussion; recurrence counselling'] }],
    },
    sourceIds: ['rcog-gtg73-pprom-2019'],
  },

  /* ============ ECTOPIC PREGNANCY ============ */
  {
    id: 'ectopic-pregnancy',
    title: 'Ectopic Pregnancy',
    category: 'obstetric-emergency',
    tags: ['ectopic', 'tubal', 'methotrexate', 'salpingectomy', 'ruptured'],
    aliases: ['tubal pregnancy', 'extrauterine pregnancy', 'implantation outside uterus'],
    status: 'clinically-verified',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'india-first',
    summary: 'Implantation outside endometrial cavity (95% tubal). Rupture kills young women — ANY reproductive-age woman with pain+bleeding has an ectopic until proven otherwise. Choose expectant/medical/surgical by stability, hCG, size, heartbeat.',
    definition: 'Pregnancy implanted outside the uterine cavity — fallopian tube (ampullary commonest), interstitial, ovarian, caesarean-scar, cervical, abdominal.',
    riskFactors: ['Previous ectopic/PID/chlamydia', 'Tubal surgery', 'IVF', 'IUCD in situ (pregnancy rare but disproportionately ectopic)', 'Smoking', 'Advanced age', 'Prior tubal pathology'],
    presentation: ['Amenorrhoea 6–8 wks + unilateral pelvic pain + PV bleeding (classic triad incomplete)', 'Diarrhoea/vomiting (pelvic irritation) misleads', 'Shoulder-tip pain/dizziness (haemoperitoneum)', 'Up to 50% asymptomatic before rupture on first scans'],
    redFlags: [
      'HAEMODYNAMIC INSTABILITY — straight to theatre',
      'Shoulder-tip pain/rebound guarding',
      'Cervical motion tenderness with fainting',
      'βhCG rising + empty uterus + any pain',
    ],
    differentials: [
      { condition: 'Corpus luteum bleed', clue: 'Similar pain; ring of fire on Doppler but no gestational sac' },
      { condition: 'Threatened/incomplete miscarriage', clue: 'Central cramping, visible IUP' },
      { condition: 'Torted adnexa', clue: 'Vomiting prominent; ovular mass' },
      { condition: 'Appendicitis', clue: 'Migrating pain, fever, GI focus' },
    ],
    initialAssessment: [
      { kind: 'steps', steps: [
        'ABC + vitals; two IV lines if unstable',
        'Urine/serum hCG FIRST in every reproductive-age woman with abdominal pain',
        'TVS: empty uterus? adnexal mass? free fluid? pseudosac caution',
        'Bloods: CBC, group&save/crossmatch, hCG quantitative, Rh',
        'Stable → pathway selection below; UNSTABLE → resuscitate + emergency laparotomy/laparoscopy',
      ] },
    ],
    investigations: [
      { test: 'TVS', lookingFor: 'Adnexal sac ± yolk sac/fetal pole; interstitial line sign; "bagel sign"' },
      { test: 'Quantitative βhCG serial', lookingFor: 'Kinetics guiding eligibility for MTX vs expectant vs surgery' },
      { test: 'CBC + coags if bleeding', lookingFor: 'Anaemia/coagulopathy before surgery' },
    ],
    classificationTable: {
      caption: 'Management selection (stable tubal ectopic)',
      headers: ['Option', 'Typical criteria', 'Key numbers'],
      rows: [
        ['Expectant', 'Minimal pain, no heartbeat, size <~3 cm, hCG <1500 IU/L and falling', '~70% success; weekly hCG to negative'],
        ['Methotrexate (single-dose protocol)', 'Unruptured, minimal symptoms, size <3.5 cm, no fetal heartbeat (heartbeat = relative), hCG <5000 IU/L, normal FBC/renal/LFTs, reliable follow-up', 'Success ~78–88%; day 4 vs day 1 hCG: fall ≥15% between d4–d7 predicts success'],
        ['Salpingectomy (laparoscopic)', 'Contralateral tube healthy; rupture/unstable; MTX failure; large/heart-beat masses', 'Gold standard surgical treatment'],
        ['Salpingostomy', 'Only tube affected / desire future fertility (specialist decision)', 'Higher persistent-trophoblast rate (~14–20%) — weekly hCG mandatory'],
      ] },
    treatment: {
      immediateStabilization: [
        { kind: 'warning', title: 'Ruptured ectopic — minutes matter', text: 'Call senior + anaesthetist · two 16G lines · crossmatch 4 units · start crystalloid/blood early · O-negative where immediate · theatre while resuscitating — do not wait for stability' },
      ],
      investigations: [{ kind: 'list', items: ['Never delay unstable patients for imaging beyond bedside US'] }],
      firstLine: [
        { kind: 'doseCard', drug: 'Methotrexate (single-dose protocol)', dose: '50 mg/m² BSA IM (calculate body surface area!)', route: 'IM', frequency: 'Single dose day 1; check hCG day 4 & 7', duration: 'If day4→day7 fall ≥15%: weekly hCG until negative; if rise/plateau or +15%: SECOND dose 50 mg/m² day 7 (or convert to surgery)', prep: 'Prescribe with folic acid WITHHELD; antiemetic prn', maxDose: 'Two doses total then surgical conversion', contraindications: ['Rupture/signs of bleeding', 'Haemodynamic instability', 'Moderate-severe pain despite analgesia', 'Fetal heartbeat (relative — multidose protocols exist in expert units)', 'Size >3.5–4 cm', 'hCG >5000 IU/L relative', 'Breastfeeding', 'Immunodeficiency/liver/renal disease', 'Blood dyscrasias', 'Peptic ulcer disease', 'Inability to attend follow-up'], adverseEffects: ['Fatigue, nausea/mucositis, transient transaminitis, bone-marrow suppression (rare)', 'Teratogenic — no conception 3 months after'], monitoring: ['Day 4 & 7 hCG + CBC + LFT/RFT', 'Weekly hCG to <5 IU/L', 'Warn about increasing pain days 2–3 (separation pain vs rupture — telephone triage rules)'], sourceId: 'rcog-gtg73-pprom-2019' },
      ],
      alternativesFirstLine: [{ kind: 'list', items: ['Multidose MTX protocol (1 mg/kg alternating leucovorin) — specialist centres for heartbeat/hCG>5000 cases', 'Expectant management per table above'] }],
      drugTreatment: [],
      definitiveTreatment: [
        { kind: 'steps', steps: [
          'SURGERY (laparoscopic preferred):',
          'Salpingectomy when contralateral tube healthy — lower persistent-trophoblast risk',
          'Salpingostomy only for sole tube/fertility priority — plan weekly hCG ×4 weeks minimum',
          'Interstitial/angular pregnancies: specialist-led (cornual resection/hysterectomy risk counselling; MTX/systemic±local injection options)',
          'Caesarean-scar ectopic: expert-centre options (HIFU/D&C under US±balloon, laparoscopic excision, UAE adjuncts)',
          'Cervical: UAE + medical/surgical per centre expertise',
        ] },
      ],
      monitoring: [{ kind: 'table', headers: ['Pathway', 'Schedule'], rows: [['Post-MTX', 'hCG d4, d7, then weekly to negative; CBC/LFT day 7'], ['Post-salpingostomy', 'Weekly hCG ×4 (persistent trophoblast surveillance)'], ['Rh-negative', 'Anti-D 250–500 IU within 72 h for surgical/medical management']] }],
      responseAssessment: [{ kind: 'list', items: ['hCG declining ≥15% d4→d7 (MTX)', 'Post-op hCG trending down appropriately'] }],
      treatmentFailure: [
        { kind: 'list', items: ['MTX failure signs: rising/plateaued hCG, new/worsening pain, free fluid growth → SURGERY (do not simply re-dose beyond protocol)', 'Persistent trophoblast post-salpingostomy: MTX 50 mg/m² rescue'] },
      ],
      procedures: [{ kind: 'text', text: 'Laparoscopy is standard-of-care approach (faster recovery, less blood loss); laparotomy for instability/massive haemoperitoneum per surgeon judgement.' }],
      escalation: [{ kind: 'list', items: ['Massive haemoperitoneum → MTP + senior surgeon + anaesthetist simultaneously', 'Rare cervical/caesarean-scar haemorrhage: UAE standby'] }],
      complications: [
        { name: 'Haemorrhagic shock', management: [{ kind: 'text', text: 'Per massive-transfusion protocol; warm products; calcium; consider cell salvage' }] },
        { name: 'Persistent ectopic post-surgery/MTX', management: [{ kind: 'text', text: 'Weekly-hCG surveillance catches it; treat as above' }] },
        { name: 'Recurrent ectopic (~10%)', management: [{ kind: 'text', text: 'Early scan next pregnancy at 5–6 wks; fertility counselling (hSG assessment of remaining tube)' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['hCG confirmation of resolution', 'Anti-D where indicated', 'Psychological support (pregnancy loss + emergency)', 'STI screening offer (PID association); partner treatment', 'Preconception planning: early-scan policy next pregnancy'] }],
    },
    algorithm: [
      { id: 'ep1', label: 'Positive hCG + pain/bleeding', type: 'start' },
      { id: 'ep2', label: 'Stable?', type: 'decision', next: [{ to: 'ep3', edgeLabel: 'NO' }, { to: 'ep4', edgeLabel: 'YES' }] },
      { id: 'ep3', label: 'RESUSCITATE + EMERGENCY THEATRE (laparoscopy/laparotomy salpingectomy)', type: 'end', tone: 'danger' },
      { id: 'ep4', label: 'TVS: ectopic seen?', type: 'decision', next: [{ to: 'ep5', edgeLabel: 'NO → PUL pathway' }, { to: 'ep6', edgeLabel: 'YES' }] },
      { id: 'ep6', label: 'Criteria met for MTX/expectant?', type: 'decision', next: [{ to: 'ep7', edgeLabel: 'YES' }, { to: 'ep8', edgeLabel: 'NO → surgery' }] },
      { id: 'ep7', label: 'MTX 50 mg/m² IM · hCG d4/d7 ≥15% fall?', type: 'decision', tone: 'warn', next: [{ to: 'ep9', edgeLabel: 'YES → weekly hCG' }, { to: 'ep8', edgeLabel: 'NO' }] },
      { id: 'ep8', label: 'Laparoscopic surgery (salpingectomy vs salpingostomy decision)', type: 'end', tone: 'warn' },
      { id: 'ep9', label: 'hCG to negative · safety-netting · follow-up complete', type: 'end', tone: 'ok' },
    ],
    sourceIds: ['rcog-gtg73-pprom-2019'],
    emergencyRef: 'emg-ectopic',
  },

  /* ============ MISCARRIAGE MANAGEMENT ============ */
  {
    id: 'miscarriage-management',
    title: 'Miscarriage Management (threatened/incomplete/missed)',
    category: 'early-pregnancy',
    tags: ['miscarriage', 'mva', 'misoprostol', 'expectant', 'evacuation'],
    aliases: ['spontaneous abortion', 'threatened abortion', 'missed abortion', 'incomplete abortion'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'india-first',
    summary: 'Offer ALL three management routes (expectant, medical, surgical) where safe. Medical: mifepristone+miso or miso-alone regimens. Surgical: MVA/EVA under analgesia. Watch: sepsis, heavy bleeding, Rh prophylaxis, psychological care.',
    definition: 'Pregnancy loss <24 wks (WHO/RCOG usage; India MTP framework covers termination contexts separately). Threatened = bleeding with closed os + viable pregnancy; Inevitable = open os; Incomplete = partial expulsion; Missed = non-viable retained; Septic = infection overlay.',
    redFlags: ['Heavy bleeding soaking >1 pad/hour', 'Fever/rigors/foul discharge (septic abortion → antibiotics THEN evacuation urgently)', 'Haemodynamic instability', 'Suspected molar (grape-like vesicles/US snowstorm — see molar module)'],
    initialAssessment: [{ kind: 'steps', steps: ['TVS diagnosis (empty sac ≥25 mm mean or CRL ≥7 mm without cardiac activity = failed pregnancy; repeat in 7 days by second observer if borderline)', 'CBC, group&save, Rh', 'Sepsis screen if symptomatic', 'Exclude ectopic in all PUL-adjacent presentations'] }],
    investigations: [
      { test: 'TVS', lookingFor: 'Viability + completeness' },
      { test: 'CBC + Rh', lookingFor: 'Anaemia/transfusion thresholds; anti-D need' },
      { test: 'hCG follow-up where retention uncertain', lookingFor: 'Decline pattern' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Resuscitate if shocked; IV access; crossmatch', 'Antibiotics FIRST if septic: e.g., ceftriaxone 1 g IV + metronidazole 500 mg IV (or ampicillin-gentamicin-metronidazole triple) then evacuate promptly'] }],
      firstLine: [
        { kind: 'table', headers: ['Route', 'Regimen (incomplete/missed)', 'Notes'], rows: [
          ['Expectant', 'Wait 7–14 days; success ~50–80% depending on type', 'Requires reliable return precautions'],
          ['Medical (preferred pharmacologic)', 'Incomplete: misoprostol 600 µg PO/single dose (or 400 µg SL/sublingual); missed: mifepristone 200 mg PO 24–48 h BEFORE misoprostol 800 µg PV (then 400 µg SL/PO q3h up to 4 doses if needed)', 'Analgesia NSAIDs; antiemetics; success ~85–90% missed with combined regimen'],
          ['Surgical', 'Manual vacuum aspiration (MVA) local anaesthesia OR electric VA/S&C under sedation', 'Immediate definitive; tissue sent histology (exclude molar)'],
        ] },
        { kind: 'doseCard', drug: 'Misoprostol (miscarriage regimen)', dose: 'Incomplete: 600 µg oral single dose. Missed: 800 µg vaginal then 400 µg SL/PO q3h ×up to 4', route: 'PV/SL/PO', frequency: 'Per regimen', notes: ['Give NSAID analgesia (e.g., ibuprofen 400–800 mg q8h)', 'Anti-D if Rh-negative'], sourceId: 'india-mtp-act-rules-2021' },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Complete evacuation (by whichever route) resolves bleeding/infection risk; histopathology of products where molar suspected or recurrent loss.' }],
      monitoring: [{ kind: 'list', items: ['Bleeding should reduce within days', 'hCG check 1–2 wks (or urine test 3 wks) to confirm resolution', 'Temperature/odour surveillance (retained tissue sepsis)'] }],
      treatmentFailure: [{ kind: 'list', items: ['Medical failure/retention → offer repeat dose or MVA', 'Ongoing heavy bleeding → examine + evacuate'] }],
      procedures: [{ kind: 'text', text: 'See procedure page: MVA technique (linked).' }],
      escalation: [{ kind: 'list', items: ['Septic miscarriage = obstetric emergency: broad-spectrum IV antibiotics + source control (evacuation) ± ICU per sepsis module'] }],
      complications: [
        { name: 'Haemorrhage', management: [{ kind: 'text', text: 'Evacuate; uterotonics; balloon rarely needed' }] },
        { name: 'Infection/sepsis', management: [{ kind: 'text', text: 'Cultures + IV antibiotics + prompt evacuation; never leave infected tissue' }] },
        { name: 'Asherman (late)', management: [{ kind: 'text', text: 'Gentle technique reduces risk; amenorrhoea post-EVAC → hysteroscopy referral' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Anti-D 250 IU (<12 wks)/standard dose per policy for Rh-negative women undergoing evacuation/medical loss', 'Contraception started same-day counselling (ovulation ~2 wks later!)', 'Psychological bereavement support; pregnancy-loss information leaflet', 'Recurrent loss → dedicated clinic pathway'] }],
    },
    sourceIds: ['india-mtp-act-rules-2021', 'rcog-gtg73-pprom-2019'],
  },

  /* ============ RECURRENT MISCARRIAGE ============ */
  {
    id: 'recurrent-miscarriage',
    title: 'Recurrent Miscarriage',
    category: 'early-pregnancy',
    tags: ['rm', 'aps', 'progesterone', 'karyotype'],
    status: 'review',
    version: 1,
    regionPriority: 'international-first',
    summary: '≥3 consecutive losses (or ≥2 with risk factors): investigate APS, parental karyotypes, thyroid/PCOS/anatomical factors; evidence-supported treatments: progesterone for bleeding+prior loss (PRISM), LMWH+aspirin ONLY for APS.',
    definition: 'Loss of three or more consecutive pregnancies before 24 weeks (ESHRE allows investigation from two).',
    investigations: [
      { test: 'Antiphospholipid panel (lupus anticoagulant + anticardiolipin + anti-β2GPI ×2, 12 wks apart)', lookingFor: 'APS — the one clearly treatable cause' },
      { test: 'Parental peripheral karyotypes', lookingFor: 'Balanced translocations (~2–5% of couples)' },
      { test: 'TSH, HbA1c/OGTT, PCOS screen, prolactin', lookingFor: 'Endocrine contributors' },
      { test: 'Pelvic ultrasound ± 3D/hysteroscopy', lookingFor: 'Uterine anomalies/polyps/fibroids' },
      { test: 'Thrombophilia testing NOT routine (factor V Leiden etc.)', lookingFor: 'Contested utility outside APS' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'Not an emergency pathway — structured preconception clinic.' }],
      firstLine: [
        { kind: 'list', items: [
          'APS confirmed: low-dose aspirin 75–100 mg + prophylactic LMWH from positive test (live-birth benefit ~50%+)',
          'Progesterone 400 mg PV twice daily from positive test through 12 wks IF previous miscarriage AND early bleeding (PRISM trial subgroup benefit)',
          'Genetic: product karyotyping each loss; PGTA counselling where balanced translocation',
          'Untreated/unexplained: supportive early-pregnancy scanning programme (reassurance scans improve outcomes modestly)',
        ] },
      ],
      monitoring: [{ kind: 'list', items: ['Early viability scans 6–8 wks', 'APS: platelet counts on LMWH; BP surveillance'] }],
      escalation: [{ kind: 'list', items: ['Reproductive immunology/experimental therapies (intralipid, steroids unselected) NOT recommended outside research'] }],
      complications: [{ name: 'Late losses', management: [{ kind: 'text', text: 'Consider cervical-length screening for cerclage indications (history-indicated if classic prior mid-trimester loss)' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Psychological support integral', 'Document cumulative live-birth rates (~65–75% overall with support)'] }],
    },
    sourceIds: ['rcog-gtg73-pprom-2019'],
  },

  /* ============ MOLAR PREGNANCY / GTD ============ */
  {
    id: 'molar-pregnancy',
    title: 'Molar Pregnancy & Gestational Trophoblastic Disease',
    category: 'gynae-oncology',
    tags: ['hydatidiform', 'mole', 'gtn', 'bhcg-surveillance', 'chemotherapy-referral'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Complete mole (46XX paternal-only, no fetus) vs partial (triploid, fetus parts). Definite EVACUATION + histology + hCG REGISTRY surveillance; 15–20% complete moles become GTN needing chemotherapy. Contraception throughout surveillance.',
    definition: 'Abnormal proliferative trophoblast: complete hydatidiform mole (diploid androgenetic), partial mole (diandric triploid), invasive mole/choriocarcinoma/placental-site tumours (GTN spectrum).',
    presentation: ['First-trimester bleeding ± hyperemesis', 'Uterus larger than dates', 'Hyperthyroidism (hCG-TSH cross-reactivity)', 'Early pre-eclampsia <20 wks (classic, now less common with earlier scans)', 'US snowstorm (complete) vs focal cystic changes with fetal parts (partial)'],
    initialAssessment: [
      { kind: 'steps', steps: ['TVS + baseline βhCG (often >100,000 IU/L complete mole)', 'CBC, coags, TFTs, creatinine, LFTs', 'Chest X-ray only if symptoms/score suggests metastasis workup', 'Type&screen; anaesthesia review for evacuation'] },
    ],
    investigations: [
      { test: 'TVS', lookingFor: 'Diagnostic features; exclude coexisting normal twin (rare)' },
      { test: 'Serum βhCG baseline + registry', lookingFor: 'Surveillance platform entry (India: regional cancer-centre registries where available)' },
      { test: 'Histopathology + p57 immunostain (complete = p57 negative)', lookingFor: 'Definitive typing (partial vs complete matters for follow-up risk)' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Correct thyroid crisis/anaemia before anaesthesia if severe', 'Crossmatch; suction evacuation readiness'] }],
      firstLine: [
        { kind: 'doseCard', drug: 'Suction curettage (complete mole, desired fertility)', dose: '12mm suction cannula ± oxytocin infusion during procedure; second look curettage optional single pass', route: 'OR', notes: ['Avoid hysterectomy unless family complete (reduces GTN risk only marginally)', 'Medical induction methods discouraged (embolisation risk)'], sourceId: 'rcog-gtg73-pprom-2019' },
      ],
      definitiveTreatment: [{ kind: 'list', items: ['EVACUATION IS TREATMENT for molar pregnancy itself', 'GTN diagnosed by hCG criteria (rise/plateau per FIGO 2000 scoring) → oncology chemotherapy referral: low-risk single-agent (methotrexate/actinomycin-D); high-risk multiagent (EMA-CO) at accredited centre'] }],
      monitoring: [
        { kind: 'table', headers: ['Phase', 'Schedule'], rows: [
          ['Post-evacuation', 'βhCG every 1–2 wks until 3 consecutive normals, then monthly×6 (complete) / shorter for partial per registry protocol'],
          ['Contraception', 'Effective hormonal/IUD THROUGHOUT surveillance (mandatory)'],
          ['GTN suspicion triggers', 'Plateau (±10% over 4 values ×3 wks), rise (>10% over 3 values ×2 wks), persistence >6 months, histological choriocarcinoma, metastases'],
        ] },
      ],
      treatmentFailure: [{ kind: 'list', items: ['Second uterine evacuation considered ONLY for heavy bleeding with retained tissue + plateauing low hCG (max once; raises perforation risk)'] }],
      escalation: [{ kind: 'list', items: ['ALL GTN → specialised trophoblastic centre (chemotherapy outcomes >90% even high-risk)', 'Heavy haemoptysis/metastatic symptoms → urgent oncology'] }],
      complications: [
        { name: 'Invasive mole/GTN', management: [{ kind: 'text', text: 'Chemotherapy pathways above; hysterectomy adjunct selected cases' }] },
        { name: 'Haemorrhage at evacuation', management: [{ kind: 'text', text: 'Uterotonics; balloon; embolisation standby' }] },
        { name: 'Hyperthyroidism', management: [{ kind: 'text', text: 'Beta-blocker cover peri-operatively until hCG falls' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Registry follow-up completion before conceiving (usually 6–12 months normal hCG)', 'Next-pregnancy: early US + hCG + products histology again'] }],
    },
    sourceIds: ['rcog-gtg73-pprom-2019'],
  },

  /* ============ MTP INDIA (LEGAL MODULE) ============ */
  {
    id: 'mtp-india',
    title: 'Medical Termination of Pregnancy — Indian Legal Framework',
    category: 'early-pregnancy',
    tags: ['mtp', 'abortion-law-india', 'medical-board', '24-weeks', 'confidentiality'],
    aliases: ['abortion law india', 'termination limits', 'MTP amendment act'],
    status: 'clinically-verified',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'india-first',
    summary: 'VERIFIED against Gazette (Aug 2026): ≤20 wks needs ONE RMP; >20–24 wks needs TWO RMPs for Rule 3B categories; >24 wks ONLY via State Medical Board for substantial foetal abnormalities; NO upper limit where woman’s life at risk. Section 5A confidentiality is statutory.',
    definition: 'The Medical Termination of Pregnancy Act 1971 as amended 2021, plus MTP (Amendment) Rules 2021, govern lawful termination in India. Termination must occur at a Government hospital or approved facility (Section 4).',
    specialSituations: [
      { kind: 'table', headers: ['Provision', 'Requirement'], rows: [
        ['≤20 weeks gestation', 'Opinion of ONE registered medical practitioner formed in good faith (risk to life/physical or mental health incl. rape anguish presumption; substantial foetal abnormality risk)'],
        ['>20–24 weeks (Rule 3B categories)', 'Opinion of TWO registered medical practitioners. Categories: survivors of sexual assault/rape/incest; minors; change of marital status during pregnancy (widowhood/divorce); major physical disability (RPwD Act 2016 criteria); mental illness including retardation; foetal malformation with substantial risk of incompatibility with life/serious handicap; humanitarian/disaster settings declared by Government'],
        ['>24 weeks (any category)', 'ONLY where substantial foetal abnormality diagnosed by STATE MEDICAL BOARD (gynaecologist + paediatrician + radiologist/sonologist + others). Board opinion within 3 DAYS of request (Form D); procedure performed within 5 DAYS of Board advice'],
        ['No gestational limit', 'Where termination necessitated by risk to LIFE of pregnant woman'],
        ['Provider norms (Rule 4 ca)', 'Medical methods up to 9 weeks: RMP with ≥3 months OBG hospital experience OR 10 supervised MMA cases; surgical limits per Rules'],
        ['Confidentiality (Section 5A)', 'Name/particulars must NOT be revealed except to person authorised by law — punishable (imprisonment up to 1 year/fine/both)'],
        ['Place (Section 4)', 'Government hospital OR facility approved by Government'],
      ] },
      { kind: 'info', title: 'Documentation essentials', text: 'Form A (opinion ≤20 wks single RMP), Form B (two-RMP opinion 20–24 wks), Form C (Board request), Form D (Board opinion), Form E/F (admission/register entries), consent Form G. Retain register per Rules.' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'Clinical emergencies override paperwork: life-saving termination permitted at ANY gestation — document contemporaneously.' }],
      investigations: [{ kind: 'list', items: ['Confirm gestation (LMP + earliest US; late-presenters: biometry dating note)', 'Exclude ectopic before medical abortion', 'CBC/Rh; bleeding profile where indicated'] }],
      firstLine: [
        { kind: 'list', items: [
          'MEDICAL ABORTION (≤9 wks typical MMA window per provider norms; WHO supports up to 12 wks outpatient where legal): mifepristone 200 mg PO day 1 → misoprostol 800 µg PV/SL 24–48 h later → confirm expulsion; add 400 µg SL q3h if needed',
          'MEDICAL ABORTION >9–12 wks (facility-based): misoprostol 800 µg PV then 400 µg SL/PV q3h until expulsion (or mifepristone priming improves efficacy)',
          'SURGICAL: MVA ≤12 wks; D&E 13+ wks (trained provider, osmotic dilators overnight)',
        ] },
        { kind: 'warning', title: 'Before any medication', text: 'EXCLUDE ECTOPIC (scan when indicated) · confirm intrauterine pregnancy for MMA · Rh status · contraception plan ready' },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Confirmed complete evacuation + stable vitals + contraception initiated = episode complete.' }],
      monitoring: [{ kind: 'list', items: ['Expulsion confirmation (products seen/US if doubt)', 'Follow-up visit 1–2 wks or urine hCG at 3 wks', 'Bleeding patterns explained (up to 2–4 wks light loss normal)'] }],
      treatmentFailure: [{ kind: 'list', items: ['Ongoing pregnancy after MA → surgical completion (misoprostol exposure is not a teratogenic contraindication but completion required)', 'Retained tissue with heavy bleeding → MVA'] }],
      procedures: [{ kind: 'text', text: 'See procedure pages: Medical Methods of Abortion and MVA/D&E (linked).' }],
      escalation: [{ kind: 'list', items: ['Complications (perforation/haemorrhage/sepsis) managed per respective emergency modules'] }],
      complications: [
        { name: 'Incomplete abortion', management: [{ kind: 'text', text: 'Re-dose misoprostol or MVA' }] },
        { name: 'Haemorrhage', management: [{ kind: 'text', text: 'Uterotonics + evacuation ± balloon' }] },
        { name: 'Infection', management: [{ kind: 'text', text: 'Antibiotics per vaginitis/PID severity ladder' }] },
        { name: 'Undiagnosed ectopic', management: [{ kind: 'text', text: 'Ectopic pathway immediately' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['CONTRACEPTION SAME DAY (PPIUCD implant DMPA POP all compatible)', 'Anti-D for Rh-negative (250 IU <12 wks / full dose later)', 'Psychological support; confidentiality assured (statutory)', 'Legal register completed; Forms filed'] }],
    },
    sourceIds: ['india-mtp-act-rules-2021'],
  },

  /* ============ GTN quick-link placeholder handled inside molar topic ============ */
]
