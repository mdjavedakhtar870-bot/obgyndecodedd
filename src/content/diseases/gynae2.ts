import type { DiseaseTopic } from '../types'

/* Gynaecology Part B: adnexal/torsion, urogynae, menopause. Checked 2026-08-23. */

function t(partial: Partial<DiseaseTopic> & Pick<DiseaseTopic, 'id' | 'title' | 'summary' | 'sourceIds'>): DiseaseTopic {
  return { category: 'gynaecology', tags: [], status: 'published', version: 1, lastVerifiedAt: '2026-08-23', regionPriority: 'india-first', redFlags: [], ...partial } as DiseaseTopic
}

export const GYNAE_TOPICS_B: DiseaseTopic[] = [
  t({
    id: 'adnexal-mass-torsion',
    title: 'Adnexal Masses, Ovarian Cysts & Torsion',
    tags: ['ovarian-cyst', 'torsion', 'dermoid'],
    summary: 'Functional cysts observe/reimage 6-12 wks. Risk scoring directs oncology referral. TORSION = emergency laparoscopy with DETORSION (ovary-sparing standard); normal Doppler does NOT exclude.',
    sourceIds: ['cdc-sti-2021'],
    category: 'gynaecology',
    redFlags: ['Acute unilateral pain+vomiting = torsion until excluded', 'Solid/papillary/ascites -> malignancy referral', 'Androgenising features -> tumour workup'],
    treatment: {
      immediateStabilization: [{ kind: 'warning', title: 'Suspected torsion', text: 'Emergency gynaecology review -> diagnostic laparoscopy with detorsion; do not delay for Doppler confirmation.' }],
      firstLine: [
        { kind: 'table', headers: ['Mass', 'Management'], rows: [
          ['Simple functional <5 cm reproductive age', 'Observe + repeat US 6-12 wks'],
          ['Endometrioma', 'See endometriosis module'],
          ['Dermoid >5 cm/symptomatic', 'Elective cystectomy (torsion risk)'],
          ['Complex raised-RMI mass', 'Oncology pathway'],
          ['Intra-op torsion', 'Detorsion ALL viable ovaries; cystectomy per ischaemia state'],
        ] },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Definitive surgery per histology.' }],
      monitoring: [{ kind: 'list', items: ['CA125 contextualised; documented imaging intervals'] }],
      complications: [{ name: 'Post-detorsion viability uncertainty', management: [{ kind: 'text', text: 'Second-look policy debates; AMH counselling' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Histology review; fertility-preservation discussions'] }],
    },
  }),
  t({
    id: 'urogynaecology-core',
    title: 'Urogynaecology Core (SUI · OAB · POP · rUTI · fistula)',
    tags: ['sui', 'oab', 'prolapse', 'fistula', 'pessary'],
    category: 'urogynaecology',
    summary: 'SUI: supervised PFMT 3 months first, then sling/colposuspension. OAB: bladder training -> antimuscarinic/mirabegron -> specialist therapies. POP: PFMT+pessary vs repair. Fistula: catheter drainage then specialist repair centres.',
    sourceIds: ['cdc-sti-2021'],
    treatment: {
      firstLine: [
        { kind: 'table', headers: ['Condition', 'Conservative -> escalation'], rows: [
          ['Stress urinary incontinence', 'PFMT x3 months -> midurethral sling/bulking/colposuspension'],
          ['Overactive bladder', 'Training+fluids -> solifenacin 5 mg OD class OR mirabegron 25-50 mg -> Botox/neuromodulation'],
          ['Pelvic organ prolapse', 'PFMT + pessary fitting -> native-tissue repairs/sacrocolpopexy by compartment'],
          ['Recurrent UTI', 'Behavioural + topical vaginal oestrogen (postmenopausal) -> prophylaxis strategies'],
          ['Vesico-vaginal fistula', 'Continuous drainage early; specialist repair at dedicated centres (typical 3-month rule)'],
        ] },
      ],
      monitoring: [{ kind: 'list', items: ['ICIQ-type scores pre/post; pessary reviews q3-6 months'] }],
      complications: [{ name: 'Mesh complications', management: [{ kind: 'text', text: 'Specialist mesh clinics; regulatory guidance followed' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['PFMT maintenance; caesarean planning after prolapse surgery often advised'] }],
    },
  }),
  t({
    id: 'menopause',
    title: 'Menopause, Perimenopause & POI',
    tags: ['menopause', 'hrt', 'vasomotor', 'poi', 'gsm'],
    category: 'gynaecology',
    summary: 'Individualise HRT: uterus intact = estrogen+progestogen; hysterectomy = estrogen-only; POI = replacement AT LEAST to average natural menopause age. Vaginal estrogen safe long-term. EVERY postmenopausal bleed investigated.',
    sourceIds: ['cdc-sti-2021'],
    treatment: {
      immediateStabilization: [{ kind: 'warning', title: 'Postmenopausal bleeding', text: 'TVS endometrial thickness -> hysteroscopy+biopsy pathway; never assume HRT cause unevaluated.' }],
      firstLine: [
        { kind: 'table', headers: ['Domain', 'Options'], rows: [
          ['Vasomotor', 'HRT first-line (transdermal preferred vascular-risk profiles); non-hormonal: SSRI/SNRI/gabapentin/clonidine'],
          ['Genitourinary syndrome', 'Topical vaginal estrogen long-term safe / lubricants'],
          ['POI <40 y', 'Estrogen-progestogen until ~51 y'],
          ['Bone health', 'Ca/vit-D + exercise; bisphosphonates when indicated'],
        ] },
        { kind: 'doseCard', drug: 'HRT example regimens', dose: 'Transdermal estradiol 50 mcg twice-weekly patch + micronized progesterone 200 mg nocte (or dydrogesterone 10 mg) sequential/continuous by phase', route: 'TD/PO', frequency: 'Per regimen', contraindications: ['Undiagnosed bleeding', 'Active VTE/liver disease/oestrogen-sensitive cancer'], notes: ['Review annually; bleeding pattern expectations set'], sourceId: 'cdc-sti-2021' },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Symptom-based duration; no arbitrary stop dates - annual benefit-risk reviews.' }],
      monitoring: [{ kind: 'list', items: ['BP; weight; bleeding-pattern surveillance; mammography per programme'] }],
      responseAssessment: [{ kind: 'list', items: ['Symptom relief without unscheduled bleeding (after adaptation window)'] }],
      treatmentFailure: [{ kind: 'list', items: ['Unscheduled bleeding >6 months -> evaluate endometrium'] }],
      secondLine: [{ kind: 'list', items: ['Non-hormonal switches; compounded alternatives discouraged'] }],
      rescue: [{ kind: 'text', text: 'Not applicable.' }],
      procedures: [{ kind: 'text', text: 'Endometrial biopsy page linked for PMB workups.' }],
      complications: [{ name: 'VTE risk with oral estrogen', management: [{ kind: 'text', text: 'Prefer transdermal in risk profiles' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Bone/BP/lipid lifestyle programmes continue lifelong'] }],
    },
  }),
]
