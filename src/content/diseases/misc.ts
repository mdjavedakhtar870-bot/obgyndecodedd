import { regimenCard } from '../medication-regimens'
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
          ['Mirena LNG-IUS 52 mg', '8 years for contraception; HMB and HRT have different durations. See product-specific cards.'],
          ['Etonogestrel implant', '3 y; irregular bleeding commonest discontinuation reason; insert days 1-5 or postpartum anytime'],
          ['DMPA injection', '150 mg IM q12 wks; BMD caution long-term; delayed return fertility'],
          ['COCP', '~9 in 100 typical-use failures; missed-pill rules on card; AVOID migraine-with-aura/VTE history/POSTPARTUM <6 wks breastfeeding (MEC 4)'],
          ['POP (desogestrel/drospirenone)', 'Breastfeeding-safe any time postpartum; strict timing for older POPs'],
          ['Emergency hormonal', 'LNG 1.5 mg single dose ASAP <=72 h (efficacy falls with delay); ulipristal 30 mg <=120 h where available'],
          ['Sterilization', 'Permanent: laparoscopic tubal occlusion/vasectomy - statutory consent documentation (India forms)'],
        ] },
        regimenCard('levonorgestrel-ec'),
        regimenCard('mirena-contraception'),
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
    aliases: ["antenatal investigations","pregnancy checkups","how many antenatal visits","trimester investigations","eight contacts"],
    id: 'anc-overview',
    title: "Antenatal care: trimester tests & visit schedule",
    category: 'antenatal',
    tags: ["anc","booking","contacts","first trimester","second trimester","third trimester","pregnancy tests","visit calendar","ifa","aspirin-prophylaxis"],
    summary: "Plan at least 8 WHO antenatal contacts: 1 in the first trimester, 2 in the second and 5 in the third, with extra reviews for risk or symptoms. Use the trimester tables for booking tests, scheduled repeats, scan windows and the India glucose-testing method; give every result a follow-up plan.",
    sourceIds: ["anc-who-calendar","anc-india-programme","anc-india-gdm","nice-ng201-detail","anc-who-urine","anc-rcog-gbs"],
    initialAssessment: [{ kind: 'list', items: ["Book as soon as pregnancy is known. Review gestational age, prior pregnancies, medical and mental health, medicines, family history, infection risk and available reports.","Record BP, weight/BMI and baseline risk; plan indicated aspirin, supplements, immunisation and specialist referrals using the relevant criteria.","Arrange the dating/screening appointment within its valid window. Give the next visit date and a separate date for every time-sensitive investigation; do not wait for the next WHO contact when a test is due earlier."] }],
    investigations: [{"test":"First trimester: booking to 13+6 weeks","lookingFor":"Baseline CBC/Hb, group/RhD and antibodies, offered HIV/syphilis/HBV screening, urine culture pathway, dating/screening choices and India first-contact glucose testing; targeted additional tests follow risk."},{"test":"Second trimester: 14+0–27+6 weeks","lookingFor":"Structural scan within the local window, India glucose repeat at 24–28 weeks if the early test was negative, and arrangement of 28-week CBC/antibody/Rh care."},{"test":"Third trimester: from 28 weeks","lookingFor":"Review 28-week blood/antibody results, anaemia response, indicated growth/surveillance tests, presentation after 36 weeks and any missing late-booking tests."},{"test":"Every contact / symptoms between contacts","lookingFor":"Review symptoms, results and changing risk; BP and urine protein at routine face-to-face visits. New symptoms or abnormal results require their own prompt assessment, not the next calendar date."}],
    treatment: {
      firstLine: [
        regimenCard('iron-folate-prevention'),
        regimenCard('calcium-antenatal'),
        regimenCard('aspirin-pe'),
        regimenCard('anti-d-routine'),
        regimenCard('anti-d-postpartum'),
      ],
      monitoring: [{ kind: 'list', items: ["Use the eight-contact calendar and trimester investigation tables in Clinical detail; record the actual local appointment dates.","At each visit review results, symptoms, BP/proteinuria, adherence/tolerance and referrals. From 24 weeks assess growth and investigate a concerning trend.","Book the 24–28-week glucose test and indicated 28-week blood/anti-D care on time, even when they fall between routine contacts.","Arrange extra reviews for anaemia, diabetes, hypertension, antibodies, twins, infection or fetal concerns. Routine late-pregnancy scans and CTG are not required at every uncomplicated visit."] }],
      responseAssessment: [{ kind: 'list', items: ['Normal surveillance trajectory; supplements tolerated'] }],
      escalation: [{ kind: 'list', items: ['Any red-flag symptom pathway same-day access'] }],
      complications: [{ name: 'Hyperemesis/anaemia/infections', management: [{ kind: 'text', text: 'Respective modules' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Postnatal contact schedule linkage (WHO PNC guidance)'] }],
    },
  }),
]
