import type { DiseaseTopic } from '../types'

/* ============================================================
   GYNAECOLOGICAL ONCOLOGY + CERVICAL SCREENING
   Sources: FIGO endometrial staging 2023 + ESGO-ESTRO-ESP 2025
   (both verified 2026-08-23). Others flagged pending full audit.
   Chemotherapy protocols deliberately NOT detailed from memory -
   referral-centre regimens referenced.
   ============================================================ */

function t(partial: Partial<DiseaseTopic> & Pick<DiseaseTopic, 'id' | 'title' | 'summary' | 'sourceIds'>): DiseaseTopic {
  return { category: 'gynae-oncology', tags: [], status: 'review', version: 1, lastVerifiedAt: '2026-08-23', regionPriority: 'international-first', redFlags: [], ...partial } as DiseaseTopic
}

export const ONC_TOPICS: DiseaseTopic[] = [
  {
    id: 'gyonc-endometrial',
    title: 'Endometrial Cancer',
    category: 'gynae-oncology',
    tags: ['endometrial-cancer', 'figo-2023', 'molecular-classification'],
    status: 'clinically-verified',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    summary: 'PMB workup -> biopsy. Staged per FIGO 2023 (molecular classes POLEmut/MMRd/NSMP/p53abn integrated; IAm/IICm annotations). Surgery core; adjuvant by risk group per ESGO-ESTRO-ESP Update 2025.',
    definition: 'Malignancy of endometrial epithelium - majority endometrioid (oestrogen-driven), aggressive types serous/clear cell/carcinosarcoma.',
    redFlags: ['Postmenopausal bleeding (90% present so)', 'Thickened endometrium on TVS postmenopause', 'Cervical involvement on biopsy', 'Rising CA125 with uterine mass'],
    initialAssessment: [{ kind: 'steps', steps: ['Pipelle/outpatient biopsy -> histology', 'TVS endometrial thickness', 'Staging imaging: MRI pelvis + CT chest/abdo (or PET where available)', 'Serum CA125', 'Molecular classification panel requested (MMR-IHC minimum; POLE/p53 as available)'] }],
    investigations: [
      { test: 'Endometrial biopsy/hysteroscopy-D&C', lookingFor: 'Histology + grade' },
      { test: 'MRI pelvis', lookingFor: 'Myometrial/cervical invasion planning' },
      { test: 'MMR-IHC +/- POLE/p53', lookingFor: 'Molecular class (FIGO 2023 integration)' },
    ],
    treatment: {
      immediateStabilization: [{ kind: 'text', text: 'Hyperplasia-with-atypia in fertility-desire: progestogen therapy + hysteroscopy-guided surveillance at specialist centres.' }],
      firstLine: [
        { kind: 'list', items: [
          'PRIMARY SURGERY: hysterectomy + BSO (+/- sentinel node mapping/peritoneal washings) - staging quality drives adjuvant decisions',
          'ADJUVANT therapy by FIGO-2023/ESGO risk group: low-risk none; intermediate brachytherapy consideration; high-risk EBRT(+chemo); advanced chemo±radiotherapy combinations',
          'POLEmut stage I-II: consider omitting adjuvant; p53abn with myoinvasion: escalate',
        ] },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Complete surgical staging with molecular-integrated risk assignment; metastatic disease -> platinum-based systemic therapy at oncology centre.' }],
      monitoring: [{ kind: 'table', headers: ['Follow-up', 'Schedule'], rows: [
        ['Clinical review', 'q3-6 months x2 y then annually (symptom-led vaginal assessment)'],
        ['Imaging', 'Only if symptomatic/recurrence suspicion (routine scans low-yield)'],
      ] }],
      responseAssessment: [{ kind: 'list', items: ['Final pathology concordant staging; adjuvant plan documented at MDT'] }],
      treatmentFailure: [{ kind: 'list', items: ['Vaginal recurrence -> radiotherapy ± surgery; distant recurrence -> systemic trials/oncology'] }],
      secondLine: [{ kind: 'list', items: ['MMRd recurrent: PD-1 inhibitor options (oncology-led); hormonal agents indolent cases'] }],
      rescue: [{ kind: 'text', text: 'Not applicable - oncology pathways.' }],
      procedures: [{ kind: 'text', text: 'Surgical pages queued v1.1 (hysterectomy/staging).' }],
      escalation: [{ kind: 'list', items: ['ALL confirmed carcinomas discussed at gynae-oncology MDT; surgery at accredited centres'] }],
      complications: [{ name: 'Treatment-related morbidity', management: [{ kind: 'text', text: 'Lymphoedema services; pelvic radiotherapy bowel management programmes' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Lymphoedema/vaginal-health support; HRT discussion individualised after early-stage'] }],
    },
    sourceIds: ['figo-endometrial-staging-2023', 'esgo-estro-esp-endometrial-2025'],
  },

  t({
    id: 'gyonc-cervical',
    title: 'Cervical Cancer',
    tags: ['cervical-cancer', 'hpv', 'radical-hysterectomy', 'ccrt'],
    summary: 'Screening-detected CIN vs invasive cancer pathways diverge at histology. FIGO 2018 clinical staging drives therapy: early = radical hysterectomy; locally advanced = concurrent chemoradiation (cisplatin-based standard). India: HPV vaccination + VIA/screening scale-up national priority.',
    sourceIds: ['cdc-sti-2021'],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Haemorrhagic tumour: packing/haemostatic radiotherapy pathways urgent'] }],
      firstLine: [
        { kind: 'table', headers: ['Stage band', 'Standard therapy'], rows: [
          ['IA1 (cone margins clear)', 'Cone excision alone may suffice (fertility contexts)'],
          ['IB1-IIA1 selected', 'Radical hysterectomy + nodal assessment OR radical chemoradiation equivalent outcomes'],
          ['IIB-IVA', 'Concurrent cisplatin-based chemoradiotherapy + brachytherapy'],
          ['IVB/metastatic', 'Systemic therapy (oncology protocols at centre)'],
        ] },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Stage-appropriate above; fertility-preserving radical trachelectomy strictly selected early tumours.' }],
      monitoring: [{ kind: 'list', items: ['Post-treatment: symptom-led review q3-6 m; imaging only if suspicion'] }],
      complications: [{ name: 'Ureteric obstruction/renal failure', management: [{'kind':'text','text':'Stents/nephrostomy coordination during therapy'}] }, { name: 'Fistulae post-radio', management: [{ kind: 'text', text: 'Specialist urogynae/oncology repair centres' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Vaginal dilator programme post-radio; menopause management (ovarian failure)'] }],
    },
  }),

  t({
    id: 'cervical-screening-hpv',
    title: 'Cervical Screening & HPV (incl. vaccination)',
    tags: ['pap', 'hpv-test', 'colposcopy', 'cin', 'hpv-vaccine'],
    category: 'gynaecology',
    status: 'published',
    regionPriority: 'india-first',
    summary: 'India lacks universal organised screening - opportunistic VIA/Pap/HPV testing per national cancer-programme guidance; WHO elimination strategy: HPV vaccination girls 9-14 + lifetime screening targets. Abnormal results -> colposcopy pathway with defined biopsy/treatment rules.',
    sourceIds: ['cdc-sti-2021'],
    treatment: {
      firstLine: [
        { kind: 'table', headers: ['Result context', 'Action'], rows: [
          ['Normal cytology/HPV-negative', 'Routine re-screening interval per programme'],
          ['HPV+ with abnormal cytology / LSIL etc.', 'Colposcopy-directed biopsies'],
          ['CIN1', 'Observe + repeat testing 12 m (regression common)'],
          ['CIN2+ (treatable)', 'Excisional treatment LLETZ/LEEP preferred (histology-complete); cold-knife cone selected cases'],
          ['Glandular abnormalities', 'Diagnostic excision always'],
          ['Pregnancy', 'Colposcopy safe; treatment deferred to postpartum unless invasive suspicion'],
        ] },
        { kind: 'info', title: 'HPV vaccination', text: 'Two-dose schedule 9-14 y (0,6 m) per Indian programme adoption; catch-up per product labels up to indicated ages.' },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Excisional treatment clears CIN2+ in ~90-95%; follow-up co-testing schedules mandatory post-treatment.' }],
      monitoring: [{ kind: 'list', items: ['Post-LLETZ HPV test-of-cure at 6-18 m per programme'] }],
      complications: [{ name: 'Post-excision bleeding/infection', management: [{ kind: 'text', text: 'Silver nitrate/vaginal packing; antibiotics if infected' }] }, { name: 'Preterm-birth risk after excision depth', management: [{ kind: 'text', text: 'Documented depth; cervical-length surveillance next pregnancy' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Screening continues post-treatment per schedule even after vaccine'] }],
    },
  }),

  t({
    id: 'gyonc-ovarian-vulval-gtn-index',
    title: 'Ovarian · Vulval · Vaginal Cancer & GTN Index',
    tags: ['ovarian-cancer', 'vulval-cancer', 'gtn', 'brca'],
    reviewerNote: 'Index module: full staging/surgery/systemic-therapy expansions queued v1.1 with current ESGO/NCCN cross-checks. GTN chemotherapy belongs ONLY at specialised centres.',
    summary: 'Adnexal mass with malignancy markers -> direct oncology referral (avoid incomplete surgery outside centres). Ovarian: cytoreductive surgery + platinum chemo backbone. Vulval/vaginal: stage-based surgery±radiotherapy. GTN: hCG registry + single/multi-agent chemo at trophoblastic centres (>90% cure).',
    sourceIds: ['cdc-sti-2021'],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Torsion/bleeding from masses -> emergency surgical pathways first'] }],
      firstLine: [
        { kind: 'table', headers: ['Disease', 'Core pathway'], rows: [
          ['Suspected ovarian carcinoma', 'CA125/HE4 RMI -> CT -> gynae-oncology centre upfront debulking OR neoadjuvant chemo per decision; BRCA/HRD testing informs PARP maintenance era'],
          ['Vulval carcinoma', 'Biopsy -> wide local excision with groin-node protocol (sentinel-node for selected) ± radiotherapy'],
          ['Vaginal carcinoma', 'Rare - stage-based radiotherapy±surgery at centres'],
          ['GTN (post-mole or non-molar)', 'hCG criteria diagnosis -> FIGO score -> single-agent MTX/actinomycin low-risk; EMA-CO high-risk; ALL at trophoblastic centres'],
        ] },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Centre-specific protocols; this app intentionally does NOT reproduce chemotherapy dose details without verified source documents.' }],
      monitoring: [{ kind: 'list', items: ['Tumour-marker schedules per disease; survivorship plans'] }],
      complications: [{ name: 'Bowel obstruction advanced ovarian ca', management: [{'kind':'text','text':'Palliative pathways: decompression/stents/symptom care discussions'}] }],
      postTreatmentCare: [{ kind: 'list', items: ['Genetic counselling referrals (BRCA/HBOC); lymphoedema services; sexual-health support'] }],
    },
  }),
]
