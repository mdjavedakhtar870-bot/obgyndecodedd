import type { Block, DiseaseTopic, DrugUse, TreatmentEngine } from './types'
import { EMERGENCIES } from './emergencies'
import { DOSE_CONFLICTS, REGIMENS, regimenCard, type RegimenId } from './medication-regimens'

export const TOPIC_REGIMENS: Record<string, RegimenId[]> = {
  'hdp-chronic': ['labetalol-oral', 'nifedipine-maintenance', 'methyldopa', 'aspirin-pe'],
  'hdp-gestational': ['labetalol-oral', 'nifedipine-maintenance', 'methyldopa'],
  'hdp-pre-eclampsia': ['labetalol-oral', 'nifedipine-maintenance', 'methyldopa'],
  'hdp-severe-features': ['labetalol-iv', 'hydralazine-iv', 'nifedipine-acute', 'magnesium-pritchard', 'magnesium-iv', 'calcium-magnesium-toxicity', 'betamethasone-antenatal', 'dexamethasone-antenatal'],
  'hdp-eclampsia': ['magnesium-pritchard', 'magnesium-iv', 'magnesium-recurrence', 'calcium-magnesium-toxicity', 'labetalol-iv', 'hydralazine-iv', 'nifedipine-acute'],
  'hdp-hellp': ['magnesium-pritchard', 'magnesium-iv', 'calcium-magnesium-toxicity', 'labetalol-iv', 'hydralazine-iv', 'nifedipine-acute'],
  'hdp-postpartum': ['labetalol-oral', 'nifedipine-maintenance', 'enalapril-postpartum', 'labetalol-iv', 'hydralazine-iv', 'nifedipine-acute'],
  pph: ['oxytocin-pph', 'txa-pph', 'methylergometrine-pph', 'ergometrine-pph', 'carboprost-pph', 'misoprostol-pph'],
  'aph-previa': ['betamethasone-antenatal', 'dexamethasone-antenatal', 'magnesium-neuro'],
  'aph-abruption': ['betamethasone-antenatal', 'dexamethasone-antenatal', 'magnesium-neuro'],
  'ectopic-pregnancy': ['methotrexate-ectopic'],
  'miscarriage-management': ['mifepristone-missed', 'misoprostol-missed', 'misoprostol-incomplete'],
  'mtp-india': ['mifepristone-abortion', 'misoprostol-abortion'],
  'labour-management': ['oxytocin-augmentation'],
  iol: ['misoprostol-iol', 'dinoprostone-iol', 'oxytocin-augmentation'],
  lscs: ['cefazolin-cs', 'oxytocin-prevention'],
  'breech-ecv': ['terbutaline-ecv'],
  'prom-term': ['benzylpenicillin-gbs'],
  fgr: ['betamethasone-antenatal', 'dexamethasone-antenatal', 'magnesium-neuro'],
  multiples: ['betamethasone-antenatal', 'dexamethasone-antenatal', 'magnesium-neuro'],
  'ptl-threatened': ['nifedipine-tocolysis', 'betamethasone-antenatal', 'dexamethasone-antenatal', 'magnesium-neuro'],
  'ptl-established': ['nifedipine-tocolysis', 'betamethasone-antenatal', 'dexamethasone-antenatal', 'magnesium-neuro'],
  pprom: ['erythromycin-pprom', 'betamethasone-antenatal', 'dexamethasone-antenatal', 'magnesium-neuro'],
  gdm: ['metformin', 'insulin-nph', 'glucose-severe-hypo', 'glucagon-hypo'],
  'pregestational-diabetes': ['insulin-nph', 'insulin-dka', 'glucose-severe-hypo', 'glucagon-hypo'],
  'thyroid-pregnancy': ['levothyroxine-established', 'levothyroxine-new', 'ptu-graves', 'carbimazole-graves', 'ptu-storm', 'propranolol-storm', 'hydrocortisone-storm', 'iodide-storm'],
  'anaemia-iron-deficiency': ['iron-oral-treatment', 'iron-folate-prevention', 'iron-fcm'],
  vte: ['enoxaparin-treatment', 'enoxaparin-prophylaxis', 'heparin-pe', 'alteplase-pe'],
  'maternal-sepsis': ['ampicillin-chorio', 'gentamicin-obstetric', 'metronidazole-iv', 'clindamycin-endometritis', 'norepinephrine-shock'],
  'hyperemesis-gravidarum': ['doxylamine-pyridoxine', 'promethazine-hg', 'metoclopramide-hg', 'ondansetron-oral', 'ondansetron-iv', 'thiamine-hg-oral', 'thiamine-before-glucose'],
  icp: ['ursodeoxycholic-icp'],
  'uti-pyelonephritis': ['nitrofurantoin-lower', 'cefalexin-lower', 'ceftriaxone-pyelonephritis'],
  'sti-syphilis': ['benzathine-early', 'benzathine-late', 'benzyl-neurosyphilis'],
  chorioamnionitis: ['ampicillin-chorio', 'gentamicin-obstetric', 'metronidazole-iv'],
  gbs: ['benzylpenicillin-gbs', 'ampicillin-gbs'],
  'sti-chlamydia': ['azithromycin-chlamydia'],
  'sti-gonorrhoea': ['ceftriaxone-gonorrhoea', 'azithromycin-chlamydia'],
  'sti-hsv': ['acyclovir-initial', 'acyclovir-pregnancy-suppression'],
  vaginitis: ['metronidazole-bv', 'clindamycin-bv', 'metronidazole-trichomonas', 'clotrimazole-pregnancy'],
  pid: ['ceftriaxone-pid-im', 'ceftriaxone-pid-iv', 'doxycycline-pid', 'metronidazole-pid'],
  aub: ['txa-hmb', 'mirena-hmb'], fibroids: ['txa-hmb'], pcos: ['metformin-pcos', 'letrozole-ovulation', 'coc-ee-lng'],
  menopause: ['estradiol-hrt', 'progesterone-hrt-sequential', 'progesterone-hrt-continuous'],
  'anc-overview': ['iron-folate-prevention', 'calcium-antenatal', 'aspirin-pe', 'anti-d-routine', 'anti-d-postpartum'],
  'adnexal-mass-torsion': [], contraception: ['levonorgestrel-ec', 'mirena-contraception', 'coc-ee-lng'],
}

const textBlock = (text: string): Block => ({ kind: 'text', text })
const emergency = (id: string) => EMERGENCIES.find((e) => e.id === id)!

/** Replace matching legacy cards, rather than retaining two contradictory doses. */
function replacementIds(block: Extract<Block, { kind: 'doseCard' }>, ids: RegimenId[]): RegimenId[] {
  const name = block.drug.toLowerCase()
  const matching = ids.filter((id) => {
    const r = REGIMENS[id]
    const molecule = r.drug.split(/[ —(]/)[0].toLowerCase()
    if (id === 'labetalol-iv' && /oral/.test(name)) return false
    if (id === 'labetalol-oral' && /\biv\b/.test(name)) return false
    if (id === 'nifedipine-acute' && /\ber\b|sustained|maintenance/.test(name)) return false
    if (id === 'nifedipine-maintenance' && /acute|immediate/.test(name)) return false
    if (id === 'insulin-dka' && !/dka|infusion/.test(name)) return false
    if (id.endsWith('-storm') && !/storm/.test(name)) return false
    return name.includes(molecule) ||
      (id.startsWith('magnesium') && /mgso|magnesium/.test(name)) ||
      (id === 'doxylamine-pyridoxine' && /pyridoxine|doxylamine/.test(name)) ||
      (id === 'iron-fcm' && /carboxymaltose|iv iron|intravenous iron/.test(name)) ||
      (id.startsWith('ondansetron') && /antiemetic ladder/.test(name)) ||
      (id === 'iron-oral-treatment' && /oral elemental iron/.test(name)) ||
      (id === 'iron-folate-prevention' && /iron.folic|prophylactic ifa/.test(name)) ||
      (id.startsWith('mirena') && /lng.ius/.test(name)) ||
      (id === 'coc-ee-lng' && /cocp/.test(name)) ||
      (id.startsWith('anti-d') && /anti.d/.test(name)) ||
      (['estradiol-hrt', 'progesterone-hrt-sequential', 'progesterone-hrt-continuous'].includes(id) && /hrt example/.test(name)) ||
      (id.startsWith('enoxaparin') && /lmwh|low.molecular/.test(name)) ||
      (id === 'insulin-nph' && /insulin/.test(name) && !/infusion|dka/.test(name))
  })
  return matching
}

export function applyMedicationAudit(topic: DiseaseTopic): DiseaseTopic {
  const ids = TOPIC_REGIMENS[topic.id]
  if (!ids || !topic.treatment) return topic
  const seen = new Set<RegimenId>()
  const treatment = { ...topic.treatment } as TreatmentEngine
  for (const [key, value] of Object.entries(treatment)) {
    if (!Array.isArray(value) || key === 'drugTreatment' || key === 'complications') continue
    ;(treatment as unknown as Record<string, unknown>)[key] = value.flatMap<Block>((block: Block): Block[] => {
      if (block.kind !== 'doseCard') return [block]
      const matches = replacementIds(block, ids)
      if (!matches.length) return [block]
      return matches.filter((id) => { if (seen.has(id)) return false; seen.add(id); return true }).map(regimenCard)
    })
  }
  treatment.drugTreatment = ids.filter((id) => !seen.has(id)).map((id) => REGIMENS[id] as DrugUse)

  if (topic.id === 'pph') {
    const e = emergency('emg-pph')
    treatment.immediateStabilization = e.immediateAction
    treatment.firstLine = ['oxytocin-pph', 'txa-pph'].map((id) => regimenCard(id as RegimenId))
    treatment.alternativesFirstLine = ['methylergometrine-pph', 'ergometrine-pph', 'carboprost-pph', 'misoprostol-pph'].map((id) => regimenCard(id as RegimenId))
    treatment.drugTreatment = []
    treatment.definitiveTreatment = e.definitiveManagement
    treatment.monitoring = [{ kind: 'table', headers: ['Parameter', 'During active major bleeding', 'Action / goal'], rows: [
      ['Blood loss, uterine tone, BP/pulse, perfusion, consciousness', 'Continuous/frequent reassessment with recorded trend', 'Continuing loss or shock → escalate source control immediately'],
      ['Urine output', 'Hourly via catheter', 'Target ≥0.5 mL/kg/h; interpret with overall perfusion'],
      ['CBC/platelets, PT/APTT, fibrinogen', 'Repeat during ongoing loss and after component replacement', 'Fibrinogen ≥2 g/L; platelets generally >50×10⁹/L during major bleeding'],
      ['Blood gas/lactate, ionised calcium, potassium, temperature', 'Serially during rapid transfusion', 'Correct abnormalities and maintain normothermia; no undefined calcium prescription'],
    ] }]
    treatment.rescue = [textBlock('Activate major-haemorrhage support and definitive operative control early. If arrest occurs, follow maternal ALS with manual uterine displacement and immediate preparation for resuscitative birth at the arrest location.')]
    treatment.secondLine = [textBlock('Refractory coagulopathy needs senior haemostatic assessment, appropriate fibrinogen/platelet/plasma replacement and source control; haemostatic rescue agents are not substitutes for these measures.')]
    treatment.treatmentFailure = e.escalation.map(textBlock)
    treatment.escalation = e.escalation.map(textBlock)
    treatment.complications = treatment.complications?.map((c) => ({ ...c, management: c.management?.map((b) => b.kind === 'text' ? { ...b, text: b.text.replace(/>1\.5(?:–2)? g\/L/g, '≥2 g/L') } : b) }))
    topic = { ...topic, summary: 'Recognise PPH early: measured loss ≥500 mL, or ≥300 mL with abnormal haemodynamics; treat concerning ongoing bleeding/shock immediately. Resuscitation, uterotonics, early TXA and 4Ts source control proceed together, with timely tamponade or surgery.', definition: 'WHO 2025 adds the treatment trigger of ≥300 mL blood loss with abnormal vital signs to the traditional ≥500 mL threshold. Do not wait for 1000 mL after caesarean, a low Hb, or every classic shock sign before treating a deteriorating patient.', algorithm: topic.algorithm?.map((n) => n.id === 'p1' ? { ...n, label: '≥500 mL loss OR ≥300 mL with abnormal haemodynamics; treat shock/ongoing concerning bleeding immediately' } : n), sourceIds: [...topic.sourceIds, ...e.sourceIds] }
  }
  if (topic.id === 'maternal-sepsis') {
    const e = emergency('emg-sepsis')
    treatment.immediateStabilization = e.immediateAction
    treatment.firstLine = [textBlock('Use the indication-specific antimicrobial and vasopressor cards below with the source-control assessment. Regimens are labelled by source and syndrome; do not use one combination for every sepsis presentation.')]
    treatment.drugTreatment = ids.map((id) => REGIMENS[id])
    treatment.definitiveTreatment = e.definitiveManagement
    treatment.treatmentFailure = e.escalation.map(textBlock)
    topic = { ...topic, sourceIds: [...topic.sourceIds, ...e.sourceIds] }
  }
  if (topic.id === 'hdp-eclampsia') {
    const e = emergency('emg-eclampsia')
    treatment.immediateStabilization = e.immediateAction
    treatment.definitiveTreatment = e.definitiveManagement
    treatment.rescue = e.escalation.map(textBlock)
  }
  if (topic.id === 'pregestational-diabetes') treatment.rescue = emergency('emg-hypo-hyperglycemia').definitiveManagement
  if (topic.id === 'adnexal-mass-torsion') {
    const e = emergency('emg-torsion')
    treatment.firstLine = e.definitiveManagement
    treatment.definitiveTreatment = e.definitiveManagement
    treatment.escalation = e.escalation.map(textBlock)
    topic = { ...topic, sourceIds: [...topic.sourceIds, ...e.sourceIds] }
  }
  if (topic.id === 'chorioamnionitis') {
    treatment.firstLine = [textBlock('Select a source-specific combination from the complete drug cards below. Ampicillin and gentamicin are combination partners; caesarean/anaerobic cover and postpartum duration must be prescribed explicitly.')]
    treatment.drugTreatment = ids.map((id) => REGIMENS[id])
  }
  if (['uti-pyelonephritis', 'sti-syphilis', 'vaginitis'].includes(topic.id)) {
    treatment.firstLine = [textBlock(topic.id === 'uti-pyelonephritis'
      ? 'Distinguish lower UTI/asymptomatic bacteriuria from pyelonephritis before choosing an antibiotic. Use culture results and renal/allergy assessment; fever, loin pain or systemic illness needs the inpatient upper-UTI pathway. The complete cards state the separate courses.'
      : topic.id === 'sti-syphilis'
        ? 'Stage syphilis and assess neurological/ocular/otic symptoms before choosing the penicillin product. Benzathine IM and aqueous IV benzylpenicillin are not interchangeable. Pregnancy with true penicillin allergy requires desensitisation. Link maternal treatment dates, partner care and neonatal assessment.'
        : 'Establish whether symptoms are due to BV, Candida, trichomoniasis or another cause before selecting a course. The cards below separate treatment choices; they are not a combination to give every patient.')]
    treatment.drugTreatment = ids.map((id) => REGIMENS[id])
  }
  if (topic.id === 'hdp-pre-eclampsia') {
    treatment.firstLine = [textBlock('For non-severe hypertension choose one maintenance agent according to the maternal assessment; severe BP requires the separate emergency regimens. Magnesium prevents/treats seizures and does not replace antihypertensive treatment.'), ...ids.map(regimenCard)]
    treatment.drugTreatment = []
  }
  if (topic.id === 'hyperemesis-gravidarum') {
    treatment.firstLine = [textBlock('Rehydrate with sodium chloride 0.9%; add potassium only from the measured level and prescribed replacement plan. Review pulse/BP, urine output, weight and electrolytes daily, more often if unstable. Adjust volume/rate to deficit, ongoing losses and cardiac/renal status; a fixed multi-litre schedule is not appropriate for every patient. Give thiamine before carbohydrate when possible and prescribe antiemetics by the complete cards below.')]
    treatment.drugTreatment = ids.map((id) => REGIMENS[id])
    topic = { ...topic, sourceIds: [...topic.sourceIds, 'med-msf-ondansetron'] }
  }
  if (topic.id === 'icp') {
    treatment.firstLine = [regimenCard('ursodeoxycholic-icp'), textBlock('Most patients with ICP do not need vitamin K. Check PT/INR if clinically indicated, assess malabsorption and obtain a specific haematology/pharmacy prescription if deficiency/coagulopathy is present. Menadiol and phytomenadione are different products; the old routine “vitamin K 10 mg” instruction was insufficient and could select a product contraindicated in late pregnancy.'), ...DOSE_CONFLICTS.vitaminK]
    treatment.drugTreatment = []
    topic = { ...topic, sourceIds: [...topic.sourceIds, 'med-menadiol-label', 'med-icp-vitk-local', 'rcog-icp-detail'] }
  }
  if (topic.id === 'thyroid-pregnancy') {
    treatment.firstLine = ['levothyroxine-established', 'levothyroxine-new', 'ptu-graves', 'carbimazole-graves'].map((id) => regimenCard(id as RegimenId))
    treatment.drugTreatment = []
    treatment.alternativesFirstLine = [textBlock('Routine antithyroid block-and-replace is not recommended in pregnancy because of fetal hypothyroidism/goitre risk. Rare isolated fetal hyperthyroidism is an expert exception. Radioiodine is contraindicated during pregnancy.')]
    treatment.rescue = [
      { kind: 'warning', title: 'Thyroid storm: activate ICU/endocrine/obstetric care', text: 'Clinical fever, tachyarrhythmia, CNS disturbance or organ dysfunction requires immediate multidisciplinary treatment; do not wait for TFT confirmation. Assess ventricular function before beta-blockade, support airway/circulation, cool, monitor glucose/electrolytes and treat the trigger. Avoid aspirin for fever. The four cards below describe components, with beta-blockade and thionamide choice conditional on cardiac/hepatic status.' },
      ...['ptu-storm', 'propranolol-storm', 'hydrocortisone-storm', 'iodide-storm'].map((id) => regimenCard(id as RegimenId)),
      textBlock('Iodine must follow the antithyroid drug by at least one hour. Reassess urgently if not stabilising within 24–48 hours; check drug delivery, ongoing triggers and cardiomyopathy, and consider specialist rescue. Reduce antithyroid intensity and stop iodine/steroid support as clinically appropriate after stabilisation.'),
    ]
    treatment.monitoring = [{ kind: 'list', items: ['Replacement: TFTs every 4–6 weeks to 20 weeks and again at 28 weeks; recheck after dose changes.', 'Antithyroid treatment: FT4/TSH every 2–4 weeks initially; repeat about 2 weeks after a switch. After 20 weeks, follow the specialist 4–8-week schedule when stable.', 'Graves: TRAb in the first trimester; positive results/continued treatment need repeat assessment and fetal surveillance. The corrected RCOG advice starts monthly fetal biometry/Doppler at 26–28 weeks onwards when indicated, not only during that two-week window.', 'Postpartum: document a replacement/antithyroid plan, TFT follow-up and neonatal assessment rather than automatically stopping all treatment.'] }]
    topic = { ...topic, summary: 'Treat overt hypothyroidism with TFT-guided levothyroxine. Graves treatment uses the lowest effective antithyroid dose, with PTU favoured early and a possible carbimazole switch beyond 20 weeks. Thyroid storm requires ICU-led treatment with attention to cardiac function, liver risk and iodine timing.' }
  }

  const conflicts = [ ...(ids.includes('nifedipine-acute') ? DOSE_CONFLICTS.nifedipine : []), ...(ids.includes('labetalol-iv') ? DOSE_CONFLICTS.labetalol : []), ...(ids.includes('nifedipine-tocolysis') ? DOSE_CONFLICTS.nifedipineMagnesium : []), ...(ids.includes('ondansetron-oral') ? DOSE_CONFLICTS.ondansetron : []) ]
  const unrelated = ['vte', 'maternal-sepsis'].includes(topic.id) ? ['rcog-gtg36-gbs-2017'] : ['uti-pyelonephritis', 'chorioamnionitis', 'gbs', 'adnexal-mass-torsion', 'aub', 'menopause', 'contraception'].includes(topic.id) ? ['cdc-sti-2021'] : []
  const supporting = ['thyroid-pregnancy'].includes(topic.id) ? ['rcog-gtg76-thyroid', 'med-thyroid-storm-2026'] : topic.id === 'hyperemesis-gravidarum' ? ['med-rcog-hg'] : []
  const addedScope = topic.id === 'anc-overview' ? ' Trimester investigations and visit-calendar detail checked 18 October 2026.' : ['gdm', 'pregestational-diabetes'].includes(topic.id) ? ' Named glucose-testing frameworks and identified diabetes dependencies checked 18 October 2026.' : ''
  return { ...topic, treatment, managementPrinciples: [...(topic.managementPrinciples || []), ...conflicts], status: 'review', lastVerifiedAt: undefined, version: topic.version + 1, reviewerNote: 'Medication regimens and dependent emergency instructions checked 17 October 2026.' + addedScope + ' These targeted checks do not certify every statement in the module.', sourceIds: [...new Set([...topic.sourceIds.filter((id) => !unrelated.includes(id)), ...ids.map((id) => REGIMENS[id].sourceId), ...supporting])] }
}
