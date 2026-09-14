import type { DiseaseTopic } from '../types'

/* ============================================================
   GYNAECOLOGY CORE — Part A
   Sources: PCOS International 2023 (verified), CDC 2021 STI/PID,
   FOGSI GCPR context. Checked 2026-08-23.
   ============================================================ */

function t(partial: Partial<DiseaseTopic> & Pick<DiseaseTopic, 'id' | 'title' | 'summary' | 'sourceIds'>): DiseaseTopic {
  return {
    category: 'gynaecology',
    tags: [],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'india-first',
    redFlags: ['Haemodynamic instability / severe anaemia -> acute pathway'],
    ...partial,
  } as DiseaseTopic
}

export const GYNAE_TOPICS_A: DiseaseTopic[] = [
  t({
    id: 'aub',
    title: 'Abnormal Uterine Bleeding (PALM-COEIN)',
    tags: ['aub', 'heavy-menstrual-bleeding', 'lng-ius', 'tranexamic-acid'],
    aliases: ['heavy periods', 'menorrhagia'],
    summary: 'Classify PALM-COEIN after excluding pregnancy/cervical/endometrial pathology by age/risk. Acute heavy bleeding: resuscitate -> TXA -> hormonal stop ladder -> D&C if failing. Chronic HMB: LNG-IUS first-line medical where suitable.',
    sourceIds: ['cdc-sti-2021'],
    initialAssessment: [{ kind: 'steps', steps: [
      'PREGNANCY TEST first in every case',
      'Cervical inspection + cervical screening status check',
      'Endometrial sampling if >=45 y, or <45 with risk factors/refractory AUB',
      'CBC+ferritin; coagulation screen if HMB since menarche (von Willebrand!)',
      'TVS pelvis; SIS/hysteroscopy for cavity detail',
    ] }],
    investigations: [
      { test: 'TVS pelvis', lookingFor: 'PALM structural lesions' },
      { test: 'Coagulation screen', lookingFor: 'Bleeding disorders in adolescent HMB' },
    ],
    treatment: {
      immediateStabilization: [
        { kind: 'warning', title: 'Acute heavy bleeding algorithm', text: 'Resuscitate (IV access, CBC, crossmatch) -> TXA 1 g IV over 10 min -> hormonal control: IV conjugated estrogen 25 mg q4h OR combined OCP taper OR progestogen regimens -> surgical control (D&C +/- balloon) if failing/unstable' },
      ],
      firstLine: [
        { kind: 'table', headers: ['Goal', 'Options'], rows: [
          ['Chronic HMB non-hormonal', 'TXA 1 g QID days 1-4 · NSAIDs mefenamic acid 500 mg TDS'],
          ['Chronic HMB hormonal', 'LNG-IUS 52 mg FIRST-LINE · COCP cyclic/continuous · norethisterone 5 mg days 5-26'],
          ['Fibroid adjuncts', 'GnRH agonist short pre-op courses; ulipristal regulatory/liver caution - verify Indian approval status'],
        ] },
        { kind: 'doseCard', drug: 'LNG-IUS (52 mg)', dose: 'Single device; reduces menstrual loss ~70-90%', route: 'Intrauterine', frequency: 'Replace 5-yearly', duration: 'Up to 5 y', contraindications: ['Current STI/PID', 'Unexplained bleeding until evaluated', 'GTD history'], notes: ['Best medical efficacy profile'], sourceId: 'cdc-sti-2021' },
      ],
      definitiveTreatment: [{ kind: 'list', items: ['Structural lesions: polypectomy/fibroid surgery', 'Endometrial ablation or hysterectomy after medical failure per preference'] }],
      monitoring: [{ kind: 'list', items: ['8-12 wk response review; Hb recovery'] }],
      treatmentFailure: [{ kind: 'list', items: ['Re-image cavity; escalate to hysteroscopy'] }],
      procedures: [{ kind: 'text', text: 'See procedure pages hysteroscopy/endometrial biopsy.' }],
      complications: [{ name: 'Anaemia', management: [{ kind: 'text', text: 'Iron alongside bleeding control' }] }, { name: 'Hyperplasia found', management: [{ kind: 'text', text: 'Progestogen vs hysterectomy per atypia - oncology input' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Surveillance per lesion; contraception alignment'] }],
    },
  }),
  t({
    id: 'pcos',
    title: 'Polycystic Ovary Syndrome',
    tags: ['pcos', 'letrozole', 'metformin'],
    aliases: ['pcod'],
    summary: '2 of 3 criteria (hyperandrogenism/OV dysfunction/PCOM-or-elevated AMH in adults). Lifestyle foundation. Menstrual control COCP/progestogens; metformin metabolic; LETROZOLE first-line ovulation induction (2023 guideline, high certainty).',
    sourceIds: ['pcos-international-2023'],
    initialAssessment: [{ kind: 'steps', steps: [
      'Exclude mimics: thyroid, hyperprolactinaemia, NC-CAH, Cushing, androgen tumours',
      'Metabolic panel: OGTT/HbA1c, lipids, BP, sleep-apnoea screen',
      'Psychological screening (guideline-emphasised)',
    ] }],
    investigations: [
      { test: 'AMH OR TVS follicle count', lookingFor: 'PCOM criterion (adults)' },
      { test: 'OGTT/lipids', lookingFor: 'Metabolic staging' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'Not acute.' }],
      firstLine: [
        { kind: 'doseCard', drug: 'Letrozole (ovulation induction)', dose: '2.5 mg daily cycle days 3-7 (up-titrate to 7.5 mg if no ovulation)', route: 'PO', frequency: 'Per cycle', duration: 'Up to ~6 monitored cycles before escalation', contraindications: ['Possible pregnancy', 'Hepatic impairment'], notes: ['FIRST-LINE OI - superior live birth vs clomiphene (off-label caveat discussed with patient)'], sourceId: 'pcos-international-2023' },
        { kind: 'doseCard', drug: 'Metformin', dose: '500 mg OD titrated to 1500-2000 mg/day', route: 'PO', frequency: 'OD-TDS', duration: 'Long-term metabolic therapy', sourceId: 'pcos-international-2023' },
        { kind: 'doseCard', drug: 'COCP (cycle/hirsutism control)', dose: 'Low-dose EE combination; anti-androgen progestins for dermatology after trial', route: 'PO', frequency: 'Daily', sourceId: 'pcos-international-2023' },
      ],
      alternativesFirstLine: [{ kind: 'list', items: ['Clomiphene 50-100 mg days 2-6 second-line order', 'Gonadotrophins low-dose step-up OR laparoscopic ovarian drilling as second line'] }],
      definitiveTreatment: [{ kind: 'list', items: ['IVF after failed lines; antagonist protocol + agonist trigger/all-freeze for OHSS-risk reduction'] }],
      monitoring: [{ kind: 'list', items: ['Follicular tracking during OI (multiple-pregnancy prevention)', 'Annual metabolic review'] }],
      responseAssessment: [{ kind: 'list', items: ['Monofollicular ovulation; regular bleeds on therapy'] }],
      treatmentFailure: [{ kind: 'list', items: ['Clomiphene resistance -> gonadotrophins/LOD; weight programme intensified'] }],
      secondLine: [{ kind: 'list', items: ['Per guideline hierarchy above'] }],
      rescue: [{ kind: 'text', text: 'OHSS management within infertility module.' }],
      complications: [{ name: 'Endometrial hyperplasia risk', management: [{ kind: 'text', text: 'Progestogen withdrawals/LNG-IUS protection; biopsy if prolonged amenorrhoea + risk' }] }, { name: 'Gestational diabetes', management: [{ kind: 'text', text: 'Early OGTT when pregnant' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Lifelong weight/mood/metabolic plan'] }],
    },
  }),
  t({
    id: 'endometriosis',
    title: 'Endometriosis',
    tags: ['endometriosis', 'dysmenorrhoea', 'dienogest', 'gnrh-addback'],
    summary: 'Dysmenorrhoea/dyspareunia/chronic pain ± subfertility. Empirical hormonal suppression reasonable with negative imaging; laparoscopy diagnostic+therapeutic; post-surgical suppression reduces recurrence.',
    sourceIds: ['cdc-sti-2021'],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'Acute pain -> exclude torsion/ruptured endometrioma.' }],
      firstLine: [
        { kind: 'table', headers: ['Line', 'Therapy'], rows: [
          ['First (pain)', 'NSAIDs + CHC (cyclic/continuous) OR progestogens (LNG-IUS/DMPA/norethisterone)'],
          ['Second', 'Dienogest 2 mg daily (contemporary strong option) OR GnRH agonist WITH ADD-BACK limited course'],
          ['Surgery', 'Laparoscopic excision/ablation; cystectomy endometrioma >4 cm symptomatic'],
        ] },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Definitive excision ± hysterectomy/oophorectomy completed-fertility refractory (HRT nuance). Subfertility: surgery then timed attempts/ART by severity.' }],
      monitoring: [{ kind: 'list', items: ['Symptom diaries; bone density awareness repeated GnRH'] }],
      complications: [{ name: 'Deep infiltrating disease (bowel/ureter)', management: [{ kind: 'text', text: 'Tertiary multidisciplinary surgery ONLY' }] }, { name: 'Rare malignant change', management: [{ kind: 'text', text: 'Postmenopausal enlarging endometrioma -> oncology pathway' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Suppression continues until conception/menopause; fertility counselling'] }],
    },
  }),
  t({
    id: 'fibroids',
    title: 'Uterine Fibroids',
    tags: ['fibroids', 'myomectomy', 'uae', 'hysterectomy'],
    summary: 'Manage by symptoms/fertility/location: medical as AUB module; hysteroscopic resection submucous FIGO 0-1; myomectomy fertility-preserving; UAE completed families alternative; hysterectomy definitive.',
    sourceIds: ['cdc-sti-2021'],
    treatment: {
      firstLine: [
        { kind: 'table', headers: ['Scenario', 'Approach'], rows: [
          ['HMB small intramural/submucous', 'Medical +/- hysteroscopic resection'],
          ['Bulk symptoms/large', 'Myomectomy or hysterectomy (family complete)'],
          ['Completed family declines surgery', 'UAE after imaging mapping (fertility impact counselled)'],
          ['Pre-op anaemia optimisation', 'Selective GnRH agonist 3 months + iron'],
        ] },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Surgical resolution per scenario table.' }],
      monitoring: [{ kind: 'list', items: ['Post-myomectomy contraception interval discussion (cavity-entry rupture risk)', 'Red degeneration pregnancy: analgesia, exclude torsion/abruption'] }],
      complications: [{ name: 'Pedunculated leiomyoma torsion', management: [{ kind: 'text', text: 'Emergency laparoscopic myomectomy' }] }, { name: 'Sarcoma suspicion', management: [{ kind: 'text', text: 'Oncology pathway; no uncontained morcellation' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Histopathology always; fertility follow-up as appropriate'] }],
    },
  }),
]
