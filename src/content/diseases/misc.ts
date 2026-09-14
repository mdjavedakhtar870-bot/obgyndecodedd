import type { DiseaseTopic } from '../types'

/* ============================================================
   CONTRACEPTION · INFERTILITY · ANTENATAL CORE
   Sources: WHO MEC/SPR framework, PCOS 2023 (verified), WHO ANC
   2016+updates (verified). Checked 2026-08-23.
   ============================================================ */

function t(partial: Partial<DiseaseTopic> & Pick<DiseaseTopic, 'id' | 'title' | 'summary' | 'sourceIds'>): DiseaseTopic {
  return { category: 'contraception-infertility', tags: [], status: 'published', version: 1, lastVerifiedAt: '2026-08-23', regionPriority: 'india-first', redFlags: [], ...partial } as DiseaseTopic
}

export const MISC_TOPICS: DiseaseTopic[] = [
  t({
    id: 'contraception',
    title: 'Contraception Master Module',
    tags: ['contraception', 'iucd', 'implant', 'ecp', 'sterilization', 'larc'],
    aliases: ['family planning', 'emergency contraceptive pill'],
    summary: 'Effectiveness hierarchy favours LARC. WHO MEC categories guide eligibility by condition. Postpartum: PPIUCD/POP/DMPA anytime; implant anytime; COCP delayed 6 wks breastfeeding. Emergency contraception: copper IUD gold standard; LNG 1.5 mg within 72 h (or 3 d window); ulipristal where available.',
    sourceIds: ['cdc-sti-2021'],
    initialAssessment: [{ kind: 'steps', steps: ['Pregnancy exclusion when relevant', 'Medical eligibility screening (WHO MEC categories 1-4 per condition)', 'STI risk assessment pre-IUD/implant insertion', 'Informed-method counselling documented'] }],
    investigations: [{ test: 'BP measurement', lookingFor: 'MEC screening for oestrogen methods' }],
    treatment: {
      firstLine: [
        { kind: 'table', headers: ['Method', 'Key practical points'], rows: [
          ['Copper IUD', '>99% effective, 10 y; heavier periods; EC gold standard (within 5 d of sex/ovulation); insertion procedure page linked'],
          ['LNG-IUS 52 mg', '5 y; reduces bleeding; MEC mostly 1-2'],
          ['Etonogestrel implant', '3 y; irregular bleeding commonest discontinuation reason; insert days 1-5 or postpartum anytime'],
          ['DMPA injection', '150 mg IM q12 wks; BMD caution long-term; delayed return fertility'],
          ['COCP', '~9 in 100 typical-use failures; missed-pill rules on card; AVOID migraine-with-aura/VTE history/POSTPARTUM <6 wks breastfeeding (MEC 4)'],
          ['POP (desogestrel/drospirenone)', 'Breastfeeding-safe any time postpartum; strict timing for older POPs'],
          ['Emergency hormonal', 'LNG 1.5 mg single dose ASAP <=72 h (efficacy falls with delay); ulipristal 30 mg <=120 h where available'],
          ['Sterilization', 'Permanent: laparoscopic tubal occlusion/vasectomy - statutory consent documentation (India forms)'],
        ] },
        { kind: 'doseCard', drug: 'Levonorgestrel ECP', dose: '1.5 mg PO single dose as soon as possible after unprotected sex (within 72 h)', route: 'PO', frequency: 'Once', notes: ['Repeat-dose safe if vomiting within 3 h', 'Copper IUD superior when accessible'], sourceId: 'cdc-sti-2021' },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Method continuation with scheduled reviews; switching strategies documented.' }],
      monitoring: [{ kind: 'list', items: ['IUD string checks; BP reviews for hormonal users; weight/BMD awareness DMPA long-term'] }],
      complications: [{ name: 'IUD expulsion/malposition', management: [{'kind':'text','text':'US localisation; reinsertion options'}] }, { name: 'Ectopic pregnancy on contraception', management: [{ kind: 'text', text: 'Any pain+positive test = ectopic pathway regardless of method' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Postpartum/post-abortion immediate-LARC counselling improves uptake'] }],
    },
  }),

  t({
    id: 'infertility-female',
    title: 'Female Infertility Evaluation & Management',
    tags: ['infertility', 'ovulation-induction', 'iui', 'ivf'],
    summary: 'Structured workup at 12 m trying (<35 y) or 6 m (>=35). Ovulation status, semen analysis FIRST, tubal patency (HSG/hyCoSy), ovarian reserve contextualised. Treat cause: letrozole-first OI for anovulation (PCOS 2023), gonadotrophins second line, ART escalation.',
    sourceIds: ['pcos-international-2023'],
    initialAssessment: [{ kind: 'steps', steps: [
      'History: cycle regularity, HSG-relevant infection history, surgeries, BMI',
      'Semen analysis x2 for partner (always early!)',
      'Day-21 progesterone / LH kits confirming ovulation',
      'AMH/AFC as context (not destiny)',
      'HSG or hyCoSy for tubal patency',
    ] }],
    investigations: [
      { test: 'Semen analysis (WHO reference limits)', lookingFor: 'Male factor triage' },
      { test: 'HSG', lookingFor: 'Tubal blockage/proximal filling defects' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'Not acute; structured timed-cycle clinic.' }],
      firstLine: [
        { kind: 'table', headers: ['Cause', 'Treatment ladder'], rows: [
          ['Anovulatory (WHO II/PCOS)', 'Letrozole first-line -> clomiphene/metformin combos -> low-dose gonadotrophins -> IVF'],
          ['Unexplained', 'Expectant/IUI ± OS -> IVF after failed cycles'],
          ['Tubal disease', 'IVF primary; salpingectomy (hydrosalpinx) improves IVF outcomes'],
          ['Endometriosis-associated', 'Surgery then individualised ART timing'],
          ['Diminished reserve/poor response', 'Counselling + tailored protocols/oocyte considerations'],
        ] },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'ART escalation per ladder; donor/gestational pathways counselled where applicable.' }],
      monitoring: [{ kind: 'list', items: ['OI cycles monitored to prevent multiples/OHSS'] }],
      responseAssessment: [{ kind: 'list', items: ['Monofollicular ovulation; clinical pregnancy milestones'] }],
      treatmentFailure: [{ kind: 'list', items: ['Failed OI lines -> escalate per ladder'] }],
      secondLine: [{ kind: 'list', items: ['Gonadotrophins/IUI/IVF sequences above'] }],
      rescue: [{ kind: 'warning', title: 'OHSS management essentials', text: 'Grading by weight gain/ascites/Hct; albumin-threshold debates; cabergoline adjuncts; paracentesis for tense ascites; THROMBOSIS vigilance is the killer - LMWH prophylaxis in hospitalised moderate-severe cases.' }],
      procedures: [{ kind: 'text', text: 'Oocyte-retrieval/transfer pages queued v1.1.' }],
      complications: [{ name: 'Multiple pregnancy', management: [{ kind: 'text', text: 'Monofollicular targets; single-embryo transfer policies' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Early-pregnancy support after conception (bleeding/miscarriage anxiety)'] }],
    },
  }),

  t({
    id: 'anc-overview',
    title: 'Antenatal Care Core Schedule (WHO 8-contact model)',
    category: 'antenatal',
    tags: ['anc', 'booking', 'contacts', 'ifa', 'tt', 'aspirin-prophylaxis'],
    summary: 'WHO model: >=8 contacts (first <12 wks; then 20/26/30/34/36/38/40). Booking: dating scan, blood group/Rh, Hb, syphilis/HIV/HBV screens, urine culture context, TT/Td per programme, IFA daily, calcium in low-intake populations, aspirin prophylaxis for high-risk PE groups from ~12 wks.',
    sourceIds: ['who-anc-2016-updates'],
    initialAssessment: [{ kind: 'steps', steps: [
      'BOOKING panel: CBC, blood group+Rh(+antibodies), VDRL, HIV, HBsAg (+HCV where policy), urine routine±culture, TSH where policy/risk, HbA1c if pregestational DM suspicion',
      'Dating ultrasound (best accuracy 8-14 wks) + nuchal translucency window 11-13+6 where aneuploidy screening chosen',
      'Risk assessment: PET-prevention tiering (FOGSI HDP-Gestosis score available), GDM screen scheduling, haemoglobinopathy screening where indicated',
    ] }],
    investigations: [
      { test: 'CBC each trimester', lookingFor: 'Anaemia trend' },
      { test: 'OGTT 24-28 wks (universal India DIPSI often earlier booking)', lookingFor: 'GDM detection' },
      { test: 'Anomaly scan 18-22 wks', lookingFor: 'Structural survey + placental localisation' },
      { test: 'Growth scans 28-32 & 36 (risk-adapted)', lookingFor: 'FGR/placental issues' },
    ],
    treatment: {
      firstLine: [
        { kind: 'doseCard', drug: 'Daily iron-folic acid', dose: '60 mg elemental iron + 400 mcg folate daily (programme IFA)', route: 'PO', frequency: 'Daily', duration: 'From 2nd trimester through postpartum per programme', sourceId: 'who-anc-2016-updates' },
        { kind: 'doseCard', drug: 'Calcium supplementation', dose: '1.5-2 g/day elemental calcium where dietary intake low (WHO recommendation for populations at PET risk)', route: 'PO', frequency: 'Daily', duration: 'From ~20 wks (or 12 wks per some programmes) to birth', sourceId: 'who-anc-2016-updates' },
        { kind: 'doseCard', drug: 'Aspirin prophylaxis (high-risk PE)', dose: '75-150 mg nocte from 11-14+0 to 16+0 weeks until 36 wks (ISSHP prefers 150 mg after screening)', route: 'PO', frequency: 'Once nightly', duration: 'To 36 wks', contraindications: ['Active ulcer/bleeding/allergy'], sourceId: 'isshp-2021' },
        { kind: 'doseCard', drug: 'Anti-D prophylaxis (Rh-negative, nonsensitised)', dose: '300 mcg (1500 IU) IM ~28 wks +/- birth dose per programme; additional doses after bleeds/procedures', route: 'IM', frequency: 'Per schedule', sourceId: 'who-anc-2016-updates' },
      ],
      monitoring: [{ kind: 'table', headers: ['Contact', 'Core actions'], rows: [
        ['First <12 wks', 'Booking bundle + education + supplements start'],
        ['20 wks', 'Anomaly scan review window ends; BP/Hb'],
        ['26/30 wks', 'OGTT window; anaemia correction; growth baseline'],
        ['34/36 wks', 'Growth/presentation checks; birth-plan discussion; Rh prophylaxis ~28 wks window'],
        ['38/40 wks', 'Postdates planning; CTG/BPP policy for >41 wks induction offer'],
      ] }],
      responseAssessment: [{ kind: 'list', items: ['Normal surveillance trajectory; supplements tolerated'] }],
      escalation: [{ kind: 'list', items: ['Any red-flag symptom pathway same-day access'] }],
      complications: [{ name: 'Hyperemesis/anaemia/infections', management: [{ kind: 'text', text: 'Respective modules' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Postnatal contact schedule linkage (WHO PNC guidance)'] }],
    },
  }),
]
