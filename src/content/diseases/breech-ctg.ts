import type { DiseaseTopic } from '../types'

/* Breech/ECV + CTG. Sources: NICE NG235 (2026). Verified 2026-08-23. */

export const BREECH_CTG_TOPICS: DiseaseTopic[] = [
  {
    id: 'breech-ecv',
    title: 'Breech Presentation & ECV',
    category: 'obstetrics',
    tags: ['breech', 'ecv', 'vaginal-breech', 'caesarean'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Offer ECV 36+0 wks (nullip) / 37+0 (multip): success ~50-60%. Vaginal breech only for selected cases by experienced attenders under strict criteria; otherwise planned caesarean ~39 wks.',
    definition: 'Pelvic pole presenting: frank/complete/footling varieties determine management.',
    riskFactors: ['Grandmultiparity', 'Uterine anomalies/fibroids', 'Praevia', 'Poly/oligohydramnios', 'Multiples', 'Fetal anomalies (screen)', 'Contracted pelvis'],
    initialAssessment: [{ kind: 'steps', steps: [
      'Confirm type + gestation by US; exclude praevia/anomalies',
      'ECV eligibility: >=36+0 wks, no contraindications (praevia, ROM, multiples beyond twin-1, severe PET, pathological CTG, major anomaly); prior scar relative - unit policy',
      'CTG + US immediately pre-procedure',
    ] }],
    investigations: [{ test: 'Pre-ECV CTG + US', lookingFor: 'Baseline reassurance' }],
    treatment: {
      immediateStabilization: [{ kind: 'warning', title: 'ECV emergencies (rare)', text: 'Transient FHR changes common -> stop/reposition/observe; persistent pathological CTG -> emergency caesarean capability mandatory wherever ECV is performed.' }],
      firstLine: [
        { kind: 'doseCard', drug: 'Terbutaline (ECV tocolysis)', dose: '250 mcg SC/IV slow before attempt', route: 'SC/IV', frequency: 'Once', notes: ['Anti-D after ECV if Rh-negative'], sourceId: 'nice-ng235-intrapartum-2026' },
        { kind: 'list', items: [
          'Technique: US-guided forward-roll/backward-flip; abandon after 2-3 attempts',
          'Failed/refused ECV -> PLANNED CAESAREAN at 39+0 wks standard recommendation',
          'SELECTED vaginal breech birth (expert centre criteria): frank/complete breech, adequate pelvis on clinical assessment, normal growth, flexed head on imaging, continuous monitoring, experienced operator + assistant, informed choice, immediate-caesarean availability',
        ] },
      ],
      definitiveTreatment: [{ kind: 'list', items: ['Successful version -> standard care', 'Planned caesarean 39 wks or selected vaginal breech with intrapartum rules'] }],
      monitoring: [{ kind: 'table', headers: ['Context', 'Watch'], rows: [
        ['Post-ECV', 'CTG 30 min minimum before discharge'],
        ['Labouring breech (selected)', 'Continuous CTG; progress strict; anaesthetist aware; neonatal team present'],
      ] }],
      treatmentFailure: [{ kind: 'list', items: ['Entangled cord/prolapse in labour -> cord-prolapse emergency pathway'] }],
      escalation: [{ kind: 'list', items: ['Any breech labour outside expert criteria -> convert to caesarean early rather than rescue late'] }],
      complications: [
        { name: 'Cord entanglement/prolapse', management: [{ kind: 'text', text: 'Emergency pathway' }] },
        { name: 'Entrapment of aftercoming head', management: [{ kind: 'text', text: 'McRoberts + episiotomy + forceps to aftercoming head (Piper); nitroglycerin uterine relaxation by anaesthesia in extreme cases' }] },
        { name: 'Fetal trauma', management: [{ kind: 'text', text: 'Neonatal orthopaedic/neuro review' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Standard birth recovery', 'Document counselling trail for medico-legal clarity'] }],
    },
    sourceIds: ['nice-ng235-intrapartum-2026'],
  },

  {
    id: 'ctg-fetal-monitoring',
    title: 'CTG Interpretation & Intrauterine Resuscitation',
    category: 'obstetrics',
    tags: ['ctg', 'fetal-monitoring', 'category', 'decelerations', 'resuscitation'],
    aliases: ['fetal distress', 'fetal heart monitoring', 'non-reassuring fetal status'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Classify systematically: baseline, variability, accelerations, decelerations vs contractions. NORMAL/SUSPICIOUS/PATHOLOGICAL categories drive action. Pathological = conservative measures x30 min then escalate; bradycardia = act within minutes.',
    definition: 'Cardiotocograph features assessed as a whole (not isolated parameters) per NICE classification framework.',
    redFlags: [
      'PROLONGED BRADYCARDIA <100 bpm >3 min -> call help; >9 min -> prepare operative birth (NG235-era thresholds)',
      'Sinusoidal pattern (severe anaemia/hypoxia)',
      'Repeated late decelerations + reduced variability',
      'Category III equivalent (absent variability with recurrent decels)',
    ],
    differentials: [
      { condition: 'Cord compression', clue: 'Variable decelerations' },
      { condition: 'Uteroplacental insufficiency', clue: 'Late decelerations' },
      { condition: 'Head compression (benign)', clue: 'Early decels mirroring contractions' },
      { condition: 'Fetal anaemia/sepsis', clue: 'Sinusoidal/reduced variability' },
      { condition: 'Maternal factors', clue: 'Fever/hypotension/drugs mimic patterns' },
    ],
    initialAssessment: [{ kind: 'steps', steps: [
      'Classify: baseline rate (110-160), variability (5-25 bpm), accelerations, deceleration type/timing vs contractions',
      'Assign category: NORMAL / SUSPICIOUS (one feature) / PATHOLOGICAL (2+ non-reassuring or 1 abnormal)',
      'Correlate clinically: contractions frequency/tone, maternal vitals, progress, risk factors',
    ] }],
    investigations: [{ test: 'Maternal obs + lactate where available', lookingFor: 'Sepsis/hypotension contributors' }, { test: 'Fetal scalp stimulation/lactate (where available)', lookingFor: 'Secondary confirmation when equivocal' }],
    treatment: {
      immediateStabilization: [{ kind: 'warning', title: 'Bradycardia clock', text: '3 min: call help · 9 min: move to theatre/prepare birth unless clearly recovering' }],
      firstLine: [
        { kind: 'steps', steps: [
          'CONSERVATIVE MEASURES (intrauterine resuscitation):',
          'Left-lateral tilt/position change',
          'Stop oxytocin; consider tocolysis for tachysystole (terbutaline 250 mcg SC slow)',
          'IV fluid bolus if hypotensive (esp. post-regional)',
          'Oxygen only if maternal hypoxia (routine O2 not beneficial)',
          'Bladder emptying; review analgesia (hypotension post-epidural)',
          'Reassess CTG after measures: PATHOLOGICAL persisting ~30 min despite measures -> escalate for birth decision',
        ] },
      ],
      definitiveTreatment: [{ kind: 'list', items: ['Operative delivery thresholds: pathological pattern unresponsive to resuscitation, prolonged bradycardia per clock, pH/equivocal adjuncts confirming compromise', 'Mode: instrumental if fully dilated+low; else category caesarean'] }],
      monitoring: [{ kind: 'list', items: ['Continuous CTG once classified suspicious/pathological', 'Document decisions + times each 15-30 min cycle', 'Senior review documented for any operative-birth decision'] }],
      responseAssessment: [{ kind: 'list', items: ['Return of normal variability/accelerations; decel resolution', 'Birth of vigorous neonate'] }],
      treatmentFailure: [{ kind: 'list', items: ['Deterioration despite resuscitation -> birth NOW', 'Consider causes missed: abruption (pain+tone!), cord prolapse, rupture in scarred uterus'] }],
      escalation: [{ kind: 'list', items: ['Senior obstetrician + anaesthetist for all operative conversions', 'Neonatal team alerted for compromised births'] }],
      complications: [
        { name: 'HIE (neonate)', management: [{ kind: 'text', text: 'Cooling eligibility within 6 h; gases + Apgar documentation' }] },
        { name: 'Missed abruption behind "distress"', management: [{ kind: 'text', text: 'Tense uterus/pain -> abruption pathway simultaneously' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['CTG trace stored + annotated', 'Debrief + incident review for category conversions', 'Parental explanation of events'] }],
    },
    algorithm: [
      { id: 'c1', label: 'CTG reviewed as a WHOLE', type: 'start' },
      { id: 'c2', label: 'Category?', type: 'decision', next: [{ to: 'c3', edgeLabel: 'NORMAL' }, { to: 'c4', edgeLabel: 'SUSPICIOUS' }, { to: 'c5', edgeLabel: 'PATHOLOGICAL / bradycardia' }] },
      { id: 'c3', label: 'Continue routine surveillance', type: 'end', tone: 'ok' },
      { id: 'c4', label: 'Increase vigilance; address contributors; repeat assessment', type: 'step', tone: 'warn', next: [{ to: 'c2' }] },
      { id: 'c5', label: 'Conservative measures NOW (tilt·stop oxytocin·fluids·tocolysis if tachysystole)', type: 'action', tone: 'danger', next: [{ to: 'c6' }] },
      { id: 'c6', label: 'Improving within ~30 min?', type: 'decision', next: [{ to: 'c7', edgeLabel: 'NO' }, { to: 'c8', edgeLabel: 'YES' }] },
      { id: 'c7', label: 'OPERATIVE BIRTH (instrumental if low/fully dilated; else cat-CS)', type: 'end', tone: 'danger' },
      { id: 'c8', label: 'Continue intensified monitoring', type: 'end', tone: 'warn' },
    ],
    sourceIds: ['nice-ng235-intrapartum-2026'],
  },
]
