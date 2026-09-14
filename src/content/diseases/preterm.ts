import type { Block, DiseaseTopic, DrugUse } from '../types'
import { ANTENATAL_STEROIDS } from './hdp'

function doseCard(d: DrugUse): Extract<Block, { kind: 'doseCard' }> {
  return { kind: 'doseCard', drug: d.drug, dose: d.dose, route: d.route, frequency: d.frequency, duration: d.duration, prep: d.preparation, maxDose: d.maxDose, sourceId: d.sourceId }
}

function tocolysisBlock(): Extract<Block, { kind: 'doseCard' }> {
  return {
    kind: 'doseCard',
    drug: 'Nifedipine (tocolysis)',
    dose: '20 mg oral loading, then 10-20 mg q6-8h (or ER 60-160 mg/day) for up to 48 h',
    route: 'PO',
    frequency: 'q6-8h',
    duration: 'Maximum 48 h (goal: complete steroids + transfer)',
    contraindications: ['Hypotension', 'Concurrent MgSO4 caution (additive neuromuscular effects)', 'Maternal cardiac disease'],
    notes: ['Headache/flushing/hypotension common', 'Monitor BP/HR during initiation'],
  }
}

/* ============================================================
   PRETERM LABOUR / PPROM / TERM PROM
   Sources: RCOG GTG73 (PPROM 2019/rev2024), GTG74 (steroids 2022),
   NICE NG25-era principles, WHO. Verified 2026-08-23.
   ============================================================ */

export const PRETERM_TOPICS: DiseaseTopic[] = [
  {
    id: 'ptl-threatened',
    title: 'Threatened Preterm Labour (<37 weeks with contractions, unchanging cervix)',
    category: 'obstetrics',
    tags: ['preterm', 'contractions', 'fetal-fibronectin', 'cervical-length'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Regular contractions WITHOUT cervical change are often false labour. Objective testing (transvaginal cervical length; fFN where available) prevents unnecessary admissions and treatments.',
    definition: 'Uterine activity before 37+0 weeks without documented cervical progression.',
    redFlags: ['Cervical change on serial exam -> convert to established pathway', 'Rupture of membranes', 'Bleeding (abruption!)', 'Abnormal CTG'],
    initialAssessment: [{ kind: 'steps', steps: [
      'CTG + maternal obs',
      'Speculum: membranes intact? cervical length visualised; collect fFN/swabs where available',
      'TVS cervical length <15 mm high risk; >30 mm low risk (at 24 wks context)',
      'Exclude causes: infection (urine/cervical), abruption, overdistension (twins/polyhydramnios)',
    ] }],
    investigations: [
      { test: 'TVS cervical length', lookingFor: 'Objective risk stratification' },
      { test: 'Fetal fibronectin (where available)', lookingFor: '<50 ng/mL at 22-35+6 predicts very low 7-day birth risk' },
      { test: 'MSU/high vaginal swabs', lookingFor: 'Asymptomatic bacteriuria/infection triggers' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'Not an emergency unless converted to established labour.' }],
      firstLine: [
        { kind: 'list', items: [
          'LOW-risk results (>30 mm / negative fFN): discharge with safety-netting after observation period',
          'HIGH-risk: admit, steroids if <34+0 (consider to 34+6 per GTG74), discuss transfer to neonatal-capable centre',
          'Cervical cerclage consideration: history-indicated or ultrasound-indicated (<25 mm before 24 wks) per specialist',
        ] },
        doseCard(ANTENATAL_STEROIDS),
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Prevent conversion: treat reversible drivers (infection), progesterone maintenance where indicated for prior spontaneous PTB (vaginal progesterone 200 mg nocte for short cervix).' }],
      monitoring: [{ kind: 'list', items: ['Serial exams only if symptoms evolve', 'Re-scan cervical length q1-2 wks in high-risk surveillance'] }],
      responseAssessment: [{ kind: 'list', items: ['Contractions settle without change; discharged with clear return instructions'] }],
      treatmentFailure: [{ kind: 'list', items: ['Progressive change -> established preterm labour pathway'] }],
      escalation: [{ kind: 'list', items: ['In-utero transfer BEFORE birth whenever feasible (best neonatal outcomes)'] }],
      complications: [{ name: 'Conversion to established labour', management: [{ kind: 'text', text: 'Switch pathways' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Progesterone continuation plan; follow-up schedule; education on warning symptoms'] }],
    },
    sourceIds: ['rcog-gtg74-steroids-2022', 'rcog-gtg73-pprom-2019'],
  },

  {
    id: 'ptl-established',
    title: 'Established Preterm Labour (<37 weeks, cervical change)',
    category: 'obstetrics',
    tags: ['preterm-labour', 'tocolysis', 'mgso4-neuroprotection', 'steroids', 'gbp'],
    aliases: ['premature labour', 'preterm birth imminent'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'india-first',
    summary: 'Steroids <34 (+/-34+6), MgSO4 neuroprotection <30-32, nifedipine tocolysis ONLY to complete these + transfer. GBS prophylaxis per protocol. Birth in right place beats heroic delay.',
    definition: 'Regular uterine contractions causing progressive cervical dilatation/effacement before 37+0 weeks.',
    redFlags: ['Abnormal CTG -> abandon delay strategies', 'Chorioamnionitis signs -> antibiotics + BIRTH (no tocolysis)', 'Breech/transverse complicating mode', 'Multiple pregnancy planning differences'],
    initialAssessment: [{ kind: 'steps', steps: [
      'Confirm gestation accuracy (dating scans!)',
      'CTG continuous; maternal vitals; urinalysis; infection screen',
      'Presentation confirmed by US',
      'Neonatology consult for counselling at viability margins (24-28 wks India-context individualisation)',
      'Decide: expectant-with-interventions vs active birth pathway',
    ] }],
    investigations: [
      { test: 'CBC, CRP, urine culture', lookingFor: 'Occult infection' },
      { test: 'GBS screening status', lookingFor: 'Prophylaxis need' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Admit; continuous monitoring; IV access'] }],
      firstLine: [
        doseCard(ANTENATAL_STEROIDS),
        tocolysisBlock(),
        {
          kind: 'doseCard',
          drug: 'Magnesium sulfate - fetal NEUROPROTECTION',
          dose: '4 g IV over 30 min then 1 g/h until birth',
          route: 'IV',
          frequency: 'Loading + infusion',
          duration: 'Until delivery',
          contraindications: ['Myasthenia gravis'],
          notes: ['Indicated when birth anticipated <30-32 wks (guideline variation 30 vs 32)'],
        },
      ],
      alternativesFirstLine: [{ kind: 'list', items: ['Atosiban where available/costed; no other tocolytic superior for the 48-h window goal'] }],
      drugTreatment: [],
      nonDrugTreatment: [{ kind: 'list', items: ['IN-UTERO TRANSFER priority to NICU-equipped centre while tocolysis window open', 'Birth position/mode planned early (breech -> caesarean usual for very preterm)'] }],
      definitiveTreatment: [{ kind: 'list', items: ['Birth (vaginal usually appropriate cephalic; continuous CTG; avoid routine episiotomy; paediatric team present)', 'Delayed cord clamping 30-60 s standard for preterm (unless compromise/intervals conflicting)'] }],
      monitoring: [{ kind: 'table', headers: ['Domain', 'Schedule'], rows: [
        ['Maternal obs/temp', 'Hourly during tocolysis (infection watch)'],
        ['CTG', 'Continuous'],
        ['Tocolysis BP/HR', 'Each titration step'],
        ['MgSO4 toxicity', 'RR/reflexes/UO hourly'],
      ] }],
      responseAssessment: [{ kind: 'list', items: ['Contractions controlled through steroid completion + transfer achieved'] }],
      treatmentFailure: [{ kind: 'list', items: ['Labour progressing despite tocolysis -> stop agents, prepare birth; chorioamnionitis -> antibiotics + expedite'] }],
      secondLine: [{ kind: 'list', items: ['No repeat tocolysis courses beyond window goals'] }],
      rescue: [{ kind: 'text', text: 'Shoulder dystocia/breech entrapment readiness at very-preterm births; theatre standby for selected cases.' }],
      procedures: [{ kind: 'text', text: 'Mode decisions individualised: breech <32 wks commonly caesarean in Indian practice; cephalic vaginal birth supported.' }],
      escalation: [{ kind: 'list', items: ['Transfer criteria above', 'HDU if PET overlap/sepsis'] }],
      complications: [
        { name: 'Chorioamnionitis', management: [{ kind: 'text', text: 'Ampicillin+gentamicin(+metronidazole) NOW + birth regardless of gestation' }] },
        { name: 'Breech entrapment', management: [{ kind: 'text', text: 'Delivery-emergency protocols' }] },
        { name: 'Neonatal prematurity complications', management: [{ kind: 'text', text: 'Paediatric-led; surfactant availability checked at receiving centre' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Post-birth debrief + documentation of interventions given', 'Next-pregnancy prevention plan: progesterone/cerclage indications reviewed'] }],
    },
    algorithm: [
      { id: 'pl1', label: 'Preterm labour confirmed (<37 wks + change)', type: 'start', tone: 'warn' },
      { id: 'pl2', label: 'Steroids if <34+6 · MgSO4 if <30-32', type: 'action', tone: 'ok', next: [{ to: 'pl3' }] },
      { id: 'pl3', label: 'Tocolysis 48h window IF benefits transfer/steroids AND no infection/compromise', type: 'decision', tone: 'warn', next: [{ to: 'pl4', edgeLabel: 'YES' }, { to: 'pl5', edgeLabel: 'NO' }] },
      { id: 'pl4', label: 'Nifedipine + IN-UTERO TRANSFER arrangement', type: 'action', next: [{ to: 'pl5' }] },
      { id: 'pl5', label: 'BIRTH: right place, right people, CTG continuous', type: 'end' },
    ],
    sourceIds: ['rcog-gtg74-steroids-2022', 'rcog-gtg73-pprom-2019'],
  },

  {
    id: 'pprom',
    title: 'PPROM (Preterm Prelabour Rupture of Membranes 24+0-36+6)',
    category: 'obstetrics',
    tags: ['pprom', 'ruptured-membranes', 'erythromycin', 'latency', 'chorioamnionitis'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Confirm rupture, exclude labour/infection, then EXPECTANCY with latency antibiotics (erythromycin 250 mg QDS x10 days per GTG73), steroids, surveillance for chorioamnionitis; deliver ~34 wks (individualise 30-36+6).',
    definition: 'Spontaneous membrane rupture before labour onset between 24+0 and 36+6 weeks.',
    redFlags: [
      'Chorioamnionitis (fever, maternal/fetal tachycardia, foul liquor, uterine tenderness) -> antibiotics + DELIVER',
      'Abrupt placental separation signs',
      'Cord prolapse (check every presentation)',
      'Non-reassuring CTG',
    ],
    initialAssessment: [{ kind: 'steps', steps: [
      'History + speculum pooling (avoid digital exams!); confirm rupture (IGFBP-1/PLGA swabs where equivocal)',
      'TVS presentation check; cord location',
      'CTG; CBC/CRP baseline',
      'GBS status noted',
      'Viability/dating confirmation',
    ] }],
    investigations: [
      { test: 'Speculum + confirmatory tests', lookingFor: 'Diagnosis without digital examination' },
      { test: 'Serial CBC/CRP + temp chart', lookingFor: 'Latency infection surveillance' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Admit initially; no digital PV exams', 'Anti-D for Rh-negative women'] }],
      firstLine: [
        { kind: 'doseCard', drug: 'Erythromycin (latency antibiotic)', dose: '250 mg orally four times daily for 10 days OR until birth if sooner', route: 'PO', frequency: 'QDS', duration: '10 days max', contraindications: ['Macrolide allergy'], notes: ['GTG73 regimen; co-amoxiclav AVOIDED (NEC association)'], sourceId: 'rcog-gtg73-pprom-2019' },
        doseCard(ANTENATAL_STEROIDS),
        { kind: 'list', items: [
          'EXPECTANT management if no labour/infection and mother stable',
          'Planned birth around 34 wks (individualise earlier with infection/growth issues; some units extend 34-36+6 for favourable late cases)',
        ] },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Birth on reaching threshold gestation or ANY red-flag trigger.' }],
      monitoring: [{ kind: 'table', headers: ['Latency schedule', 'Frequency'], rows: [
        ['Temperature/pulse', '4-6 hourly (fever >37.8 = review now)'],
        ['CTG', 'Daily from viability thresholds per unit policy'],
        ['CBC/CRP', 'Twice weekly minimum'],
        ['Liquor/presentation US', 'Weekly'],
        ['Fetal growth/Doppler', 'Every 2 weeks'],
      ] }],
      responseAssessment: [{ kind: 'list', items: ['Afebrile latency with stable labs; pregnancy advances toward target'] }],
      treatmentFailure: [{ kind: 'list', items: ['Any infection sign -> antibiotics (broaden: ampicillin+gentamicin+metronidazole IV) + birth', 'Labour onset -> established-PTL pathway additions'] }],
      escalation: [{ kind: 'list', items: ['Transfer to NICU-centre once stable if local nursery limited', 'Previable (<24 wks) rupture: specialist counselling pathway - expectancy vs termination options, infection/limb-defect risks discussed honestly'] }],
      complications: [
        { name: 'Chorioamnionitis', management: [{ kind: 'text', text: 'Triple antibiotics + birth; placental histology; neonatal sepsis workup alert' }] },
        { name: 'Cord prolapse', management: [{ kind: 'text', text: 'Emergency module' }] },
        { name: 'Abruption', management: [{ kind: 'text', text: 'Abruption pathway' }] },
        { name: 'Pulmonary hypoplasia (very early rupture)', management: [{ kind: 'text', text: 'Counselled at previable/early-second-trimester ruptures; neonatal expectations set' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Post-birth: placenta histology, neonatal cultures coordination', 'Subsequent-pregnancy advice: progesterone considerations, serial cervix surveillance'] }],
    },
    sourceIds: ['rcog-gtg73-pprom-2019', 'rcog-gtg74-steroids-2022'],
  },

  {
    id: 'prom-term',
    title: 'Term PROM (>=37 weeks)',
    category: 'obstetrics',
    tags: ['prom', 'term-promise', 'gbs', 'induction-24h'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Confirm rupture; offer choice of induction (usually within 24 h) vs supervised waiting 24 h if GBS-negative and reassuring. GBS-positive/recent positive screen -> induction + intrapartum penicillin.',
    definition: 'Membrane rupture at term before labour onset.',
    redFlags: ['Cord prolapse on presentation', 'Meconium/foul liquor', 'Fever', 'Reduced movements/abnormal CTG'],
    initialAssessment: [{ kind: 'steps', steps: [
      'Speculum confirmation if history unclear; nitrazine/ferning or IGFBP1 adjuncts',
      'CTG 20-30 min; presentation check',
      'GBS screening status (rectovaginal swab if not done within 5 wks)',
      'Temp/pulse baseline',
    ] }],
    investigations: [{ test: 'CTG + presentation', lookingFor: 'Immediate reassurance' }, { test: 'GBS status', lookingFor: 'Antibiotic pathway trigger' }],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'Outpatient-safe only if fully assessed, low-risk, GBS-negative, clear return instructions.' }],
      firstLine: [
        { kind: 'list', items: [
          'Offer INDUCTION OF LABOUR generally within 24 h (NICE NG235 framework) - reduces infection without raising caesarean rates',
          'OR wait up to 24 h if woman prefers + all reassuring (advise avoiding intercourse; report fever/reduced movements)',
          'GBS colonisation/known carrier: induction promptly + INTRAPARTUM benzylpenicillin 1.8 g IV then 900 mg q4h until birth (or clindamycin if penicillin-allergic per sensitivities)',
        ] },
        { kind: 'doseCard', drug: 'Benzylpenicillin (GBS intrapartum prophylaxis)', dose: '1.8 g IV loading then 900 mg q4h', route: 'IV', frequency: 'q4h', duration: 'Until birth (>=4 h before birth ideal)', contraindications: ['Penicillin anaphylaxis -> clindamycin 900 mg q8h if sensitive isolate known, else vancomycin per protocol'], sourceId: 'rcog-gtg36-gbs-2017' },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Labour onset/birth.' }],
      monitoring: [{ kind: 'table', headers: ['Waiting option', 'Schedule'], rows: [['Maternal temp/pulse', '4-hourly self-report + clinic checks'], ['Liquor colour', 'Report meconium/foul immediately'], ['FM counts', 'Daily awareness']] }],
      treatmentFailure: [{ kind: 'list', items: ['Fever/tachycardia -> chorioamnionitis workup + antibiotics + birth'] }],
      escalation: [{ kind: 'list', items: ['Neonatal observation plan at birth per GBS risk factors'] }],
      complications: [
        { name: 'Chorioamnionitis', management: [{ kind: 'text', text: 'Antibiotics + expedited birth' }] },
        { name: 'Early-onset neonatal GBS', management: [{ kind: 'text', text: 'Risk-based neonatal observation per GTG36' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Standard fourth-stage care', 'Document GBS pathway followed'] }],
    },
    sourceIds: ['nice-ng235-intrapartum-2026', 'rcog-gtg36-gbs-2017'],
  },
]

