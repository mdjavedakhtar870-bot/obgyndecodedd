import type { DiseaseTopic } from '../types'
import { ANTENATAL_STEROIDS } from './hdp'

/* Fetal wellbeing modules: FGR/SGA + multiple pregnancy.
   Sources: ISUOG/SMFM/NICE-era practice, FOGSI multifetal GCPR context.
   Steroid source GTG74 verified. Statuses reflect audit level honestly. */

function doseCard(d: typeof ANTENATAL_STEROIDS) {
  return { kind: 'doseCard', drug: d.drug, dose: d.dose, route: d.route, frequency: d.frequency, duration: d.duration, sourceId: d.sourceId } as const
}

export const FETAL_TOPICS: DiseaseTopic[] = [
  {
    id: 'fgr',
    title: 'Fetal Growth Restriction / SGA',
    category: 'obstetrics',
    tags: ['fgr', 'sga', 'doppler', 'stillbirth-prevention', 'growth'],
    aliases: ['IUGR', 'small baby', 'poor growth'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'SGA = size <10th centile; FGR = failure to reach genetic potential (pathology). Doppler-driven management: UA/MCA/DV surveillance, steroids <34+6 at risk of birth, MgSO4 <32, deliver by severity trajectory - not by centile alone.',
    definition: 'SGA: EFW/AC below 10th customised centile. FGR: placenta-mediated failure to achieve growth potential (may be normal-size!). Early-onset (<32 wks) vs late-onset (>=32 wks) differ in surveillance/delivery logic.',
    riskFactors: ['Severe pre-eclampsia/hypertension', 'Previous FGR/stillbirth', 'Smoking', 'Low PAPP-a', 'Antiphospholipid syndrome', 'Maternal disease (CKD/anaemia/thalassaemia)', 'Multiple pregnancy discordance', 'Teratogens/malaria/TORCH where relevant'],
    redFlags: [
      'Absent/reversed end-diastolic flow in umbilical artery (EARLY-onset marker)',
      'Reduced variability/abnormal CTG',
      'MCA PI fall + DV abnormality (late decompensation)',
      'Maternal hypertension/proteinuria emerging alongside',
    ],
    initialAssessment: [{ kind: 'steps', steps: [
      'Confirm dating accuracy first!',
      'Customised growth charting (inter-growth/WHO standards where applicable)',
      'UA Doppler + amniotic fluid; MCA PI from 26-28 wks context',
      'Screen maternal causes: BP panel, anaemia, infection history, substance use',
      'Classify: early vs late onset; SGA-with-normal-Doppler vs true FGR',
    ] }],
    investigations: [
      { test: 'Umbilical artery PI trend', lookingFor: 'Core surveillance axis (q1-3 wks by severity)' },
      { test: 'MCA PI', lookingFor: 'Brain-sparing sign in late-onset deterioration' },
      { test: 'Ductus venosus + CTG (early-onset severe)', lookingFor: 'Timing decisions <32 wks' },
      { test: 'Maternal panel + TORCH where indicated', lookingFor: 'Reversible/non-placental causes' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'Not acute unless CTG pathological -> birth pathway.' }],
      firstLine: [
        { kind: 'list', items: [
          'LATE-ONSET FGR (>=32 wks): surveillance 2x weekly (CTG+UA); DELIVER ~37 wks when SGA with risk factors (NICE-style), earlier on deterioration',
          'EARLY-ONSET (<32 wks): intensive pathway - steroids complete if birth likely, MgSO4 <30-32, deliver on DV abnormality/reversed AEDF/CTG loss; expectancy only in tertiary centres with daily review',
          'Aspirin next-pregnancy prevention discussion; treat maternal disease aggressively',
        ] },
        doseCard(ANTENATAL_STEROIDS),
      ],
      definitiveTreatment: [{ kind: 'text', text: 'BIRTH remains the only definitive therapy once fetus outgrows placental support.' }],
      monitoring: [{ kind: 'table', headers: ['Severity band', 'Surveillance'], rows: [
        ['SGA, normal Dopplers', 'Growth q2-3 wks + UA q1-2 wks + CTG weekly-ish per unit'],
        ['AEDF present', 'Hospital-based: UA/MCA/DV 2-3x weekly + daily CTG'],
        ['REDF/DV absent-flow', 'Daily assessment; delivery decision imminent'],
      ] }],
      responseAssessment: [{ kind: 'list', items: ['Stable Doppler trends; growth continuing along its curve'] }],
      treatmentFailure: [{ kind: 'list', items: ['Deterioration cascade -> escalate frequency then deliver'] }],
      escalation: [{ kind: 'list', items: ['Early-onset severe FGR belongs in units with NICU + fetal-medicine expertise - transfer BEFORE crisis'] }],
      complications: [
        { name: 'Stillbirth', management: [{ kind: 'text', text: 'Timely delivery is the preventable lever; document surveillance compliance' }] },
        { name: 'Neonatal hypoglycaemia/polycythaemia', management: [{ kind: 'text', text: 'Paediatric anticipation at birth' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Placental histology request', 'Next-pregnancy aspirin ± LMWH (APS cases) planning'] }],
    },
    sourceIds: ['rcog-gtg74-steroids-2022'],
  },

  {
    id: 'multiples',
    title: 'Multiple Pregnancy (twins incl. TTTS/TAPS/TRAP)',
    category: 'obstetrics',
    tags: ['twins', 'chorionicity', 'ttts', 'taps', 'delivery-timing'],
    status: 'review',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'india-first',
    summary: 'Chorionicity at 11-13+6 wks is destiny-defining: DCDA surveillance q4 wks; MCDA q2 wks from 16 wks (TTTS screening); MCMA inpatient from 26-28 wks typical. Delivery timing: DCDA 37-38, MCDA 36-37 (+/-34-37 range), MCMA ~32-34.',
    definition: 'DCDA/MCDA/MCMA classifications determine surveillance intensity and complications (TTTS Quintero staging, TAPS MCA-PSV delta, TRAP/acardiac, sFGR).',
    redFlags: ['MC polyhydramnios-oligohydramnios sequence -> TTTS referral NOW', 'Discordant EFW >25% (sFGR)', 'One twin demise (co-twin injury risk)', 'Any MC complication -> fetal-medicine centre referral'],
    initialAssessment: [{ kind: 'steps', steps: [
      'Label chorionicity/amnionicity EARLY (lambda vs T-sign)',
      'Schedule surveillance calendar per type',
      'Anaemia screening + iron optimisation (higher demands)',
      'Mode-of-birth planning: vertex/vertex vaginal reasonable DCDA uncomplicated',
    ] }],
    investigations: [
      { test: 'CRL/crown-rump + NT 11-13+6', lookingFor: 'Dating + chorionicity + aneuploidy risk' },
      { test: 'Serial EFW discordance', lookingFor: '>20-25% triggers escalation' },
      { test: 'MCA-PSV (MC pairs)', lookingFor: 'TAPS (>0.5 MoM delta)/anaemia screening' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'TTTS stages II+: fetoscopic laser coagulation at specialised centre (survival benefit) - refer immediately.' }],
      firstLine: [
        { kind: 'table', headers: ['Type', 'Surveillance', 'Delivery timing'], rows: [
          ['DCDA', 'US q4 wks from 16 wks (growth/fluid)', '37-38 wks (elective)'],
          ['MCDA', 'US q2 wks from 16 wks (fluid discordance, EFW, MCA-PSV)', '~36-37 wks (range 34-37 individualised)'],
          ['MCMA', 'Inpatient from ~26-28 wks; frequent US/CTG', '~32-34 wks after steroids'],
        ] },
        doseCard(ANTENATAL_STEROIDS),
        { kind: 'info', title: 'India note', text: 'FOGSI multifetal guidance emphasises iron/folate intensification, early anaemia correction, and structured referral networks for monochorionic complications.' },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Planned timed birth; TTTS laser; selective procedures (reduction/coagulation) for complicated MC cases at expert centres.' }],
      monitoring: [{ kind: 'list', items: ['Calendar-driven scans (audit-friendly)', 'BP surveillance (twin pregnancies higher PET risk)', 'GBS/steroids plans before each window'] }],
      responseAssessment: [{ kind: 'list', items: ['Stable discordance <20%, fluids symmetric, growth curves parallel'] }],
      treatmentFailure: [{ kind: 'list', items: ['Emerging TTTS/sFGR signs -> immediate fetal-medicine contact'] }],
      escalation: [{ kind: 'list', items: ['ALL monochorionic complications to tertiary fetal-medicine units', 'NICU capacity confirmed before scheduled preterm births'] }],
      complications: [
        { name: 'TTTS', management: [{ kind: 'text', text: 'Quintero staging; laser for II+; serial amnioreduction bridge only' }] },
        { name: 'Single intrauterine death', management: [{ kind: 'text', text: 'Co-twin surveillance (brain injury risk esp. MC): MRI/neuroimaging plan + delivery timing decision' }] },
        { name: 'Postpartum haemorrhage', management: [{ kind: 'text', text: 'Overdistended uterus: prophylactic oxytocin infusion standard; PPH bundle ready' }] },
        { name: 'Preterm birth', management: [{ kind: 'text', text: 'PTL pathways apply; steroids timing per twin-specific windows' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Standard recovery + lactation support (twins breastfeeding feasible - support!)', 'Contraception counselling', 'Next-pregnancy counselling (recurrence modest; IVF-related factors)'] }],
    },
    sourceIds: ['rcog-gtg74-steroids-2022'],
  },

  {
    id: 'reduced-fetal-movements',
    title: 'Reduced Fetal Movements',
    category: 'obstetrics',
    tags: ['rfm', 'stillbirth-prevention', 'ctg'],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'Never dismiss. Assessment = CTG + US (growth/fluid/Doppler as indicated). Recurrent RFM warrants structured follow-up; associated with stillbirth risk elevation.',
    definition: 'Maternal perception of decreased fetal activity relative to her normal pattern.',
    initialAssessment: [{ kind: 'steps', steps: ['Immediate CTG (viability)', 'US: EFW + AFI ± UA Doppler', 'Risk-factor review (hypertension, FGR, smoking)', 'Kick-chart education + explicit return instructions'] }],
    investigations: [
      { test: 'CTG', lookingFor: 'Acute compromise' },
      { test: 'Growth/fluid scan', lookingFor: 'Silent FGR/oligohydramnios' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'Abnormal CTG -> ctg-fetal-monitoring pathway.' }],
      firstLine: [{ kind: 'list', items: ['Normal workup: reassure with structured advice; return same-day for ANY repeat episode', 'Recurrent episodes (>=2): consider induction discussion >=37 wks after shared counselling'] }],
      definitiveTreatment: [{ kind: 'text', text: 'Birth when recurrent/unexplained pattern persists late pregnancy.' }],
      monitoring: [{ kind: 'list', items: ['Documented movement diary', 'Follow-up scan interval per findings'] }],
      responseAssessment: [{ kind: 'list', items: ['Normalized perception with reassuring surveillance'] }],
      treatmentFailure: [{ kind: 'list', items: ['Second episode -> full re-assessment (not telephone reassurance)'] }],
      escalation: [{ kind: 'list', items: ['Abnormal CTG/Dopplers -> senior obstetric decision same visit'] }],
      complications: [{ name: 'Unrecognised stillbirth risk', management: [{ kind: 'text', text: 'Structured pathways exist precisely to intercept this' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Awareness leaflet; partner education'] }],
    },
    sourceIds: ['nice-ng235-intrapartum-2026'],
  },
]
