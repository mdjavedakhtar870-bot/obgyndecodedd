import records from '../../data/medication-regimens.json'
import type { Block, DrugUse } from './types'

export type CompleteRegimen = DrugUse & Required<Pick<DrugUse, 'preparation' | 'maxDose' | 'sourceId' | 'monitoring' | 'contraindications'>>
export const REGIMENS = records satisfies Record<string, CompleteRegimen>
export type RegimenId = keyof typeof REGIMENS
export const regimens = (...ids: RegimenId[]): DrugUse[] => ids.map((id) => REGIMENS[id])
export const DOSE_CONFLICTS: Record<string, Block[]> = {
  ondansetron: [{ kind: 'conflict',
    guidelineA: { org: 'MSF injectable ondansetron monograph', recommendation: 'General postoperative-vomiting reference advises avoiding first-trimester use and does not recommend it for nausea/vomiting of pregnancy.' },
    guidelineB: { org: 'RCOG Green-top 69, 2024', recommendation: 'Includes ondansetron as a second-line HG treatment with counselling about the small absolute fetal-risk signal and the harms of inadequately treated HG.' },
    populationDifference: 'A general injectable/postoperative reference and a specialist pregnancy/HG pathway address different indications and prescribing decisions.',
    indiaConsideration: 'Review first-line response, gestation, electrolyte/QT risk and available routes with the patient and treating obstetric team.',
    appDefault: 'Use the RCOG HG-specific second-line schedules after assessment and counselling; do not import the postoperative injection schedule.',
    appDefaultReason: 'The specialist pregnancy pathway directly addresses HG, its competing risks and route-specific dosing.' }],
  nifedipineMagnesium: [{ kind: 'conflict',
    guidelineA: { org: 'MSF nifedipine tocolysis monograph', recommendation: 'Advises against combining nifedipine with magnesium sulfate because of hypotension/neuromuscular-blockade concerns.' },
    guidelineB: { org: 'India NHM CEmONC 2024, chapter 4', recommendation: 'States the feared interaction has not been demonstrated in retrospective reviews, while requiring careful BP and pulse monitoring.' },
    populationDifference: 'MSF addresses nifedipine tocolysis; NHM discusses emergency hypertension/eclampsia care. Dose, indication and monitoring setting differ.',
    indiaConsideration: 'Magnesium for indicated seizure prevention or fetal neuroprotection has its own priority; do not withhold it merely to continue tocolysis.',
    appDefault: 'Avoid routine concurrent tocolytic nifedipine and magnesium in this reference. If both are clinically required, a senior obstetric/anaesthetic decision must define monitoring and doses.',
    appDefaultReason: 'This preserves the source-specific caution and does not turn a monitored emergency-use discussion into blanket permission for coadministration.' }],
  vitaminK: [{ kind: 'conflict',
    guidelineA: { org: 'NHS Lanarkshire local ICP pathway, October 2020', recommendation: 'Discusses off-label menadiol 10 mg daily from 34 weeks, particularly with prolonged PT, and acknowledges neonatal risks.' },
    guidelineB: { org: 'Menadiol 10 mg product information / current RCOG counselling', recommendation: 'The product contraindicates use in late pregnancy because of neonatal haemolysis, hyperbilirubinaemia and kernicterus risk. RCOG says most women with ICP do not need vitamin K.' },
    populationDifference: 'The older local pathway proposes off-label use in the very pregnancy stage covered by the product contraindication; the disagreement is not resolved by calling every preparation “vitamin K”.',
    indiaConsideration: 'Confirm the exact vitamin K molecule, formulation and indication with obstetric/haematology/pharmacy review; do not substitute menadiol for phytomenadione.',
    appDefault: 'No routine menadiol course for ICP. Assess clotting/deficiency and obtain an appropriate product-specific prescription if replacement is indicated.',
    appDefaultReason: 'This avoids applying an older local proposal despite a clear product contraindication and avoids treating women without a demonstrated need.' }],
  nifedipine: [{ kind: 'conflict',
    guidelineA: { org: 'India NHM CEmONC, chapter 4 — prose', recommendation: 'Acute oral nifedipine: 10 mg, reassess at 20 minutes, repeat 10–20 mg; stated initial-course maximum 30 mg.' },
    guidelineB: { org: 'Same NHM chapter — adjacent flowchart', recommendation: 'The flowchart shows 10 mg, then 20 mg, then another 20 mg at 20-minute reassessments, implying 50 mg.' },
    populationDifference: 'These refer to the same severe-pregnancy-hypertension setting; this is an internal document discrepancy, not a demonstrated population difference.',
    indiaConsideration: 'Confirm the sequence formally approved in the treating unit. Extended-release maintenance tablets are a separate regimen.',
    appDefault: 'Use the prose-based 30 mg initial limit with prompt senior reassessment and selection of another agent if severe BP persists.',
    appDefaultReason: 'This avoids silently combining incompatible limits or prolonging oral loading in uncontrolled severe hypertension.' }],
  labetalol: [{ kind: 'conflict',
    guidelineA: { org: 'India NHM CEmONC, chapter 4 — prose', recommendation: '20 mg, then 40 mg, then 80 mg at 10-minute reassessments; further dosing may reach a cumulative 300 mg.' },
    guidelineB: { org: 'Same NHM chapter — adjacent flowchart', recommendation: 'Stops the displayed 20 → 40 → 80 mg sequence at a stated 140 mg maximum.' },
    populationDifference: 'Same emergency setting; the flowchart and prose show different stopping points.',
    indiaConsideration: 'Use the approved local sequence and track every previous IV dose. Persistent severe BP needs senior/anaesthetic involvement.',
    appDefault: 'The card records the prose ceiling of 300 mg; persistent severe BP after the initial 140 mg sequence requires senior reassessment before additional doses or another agent.',
    appDefaultReason: 'A cumulative ceiling is not an instruction to continue dosing without reassessing treatment failure and contraindications.' }],
}
export function regimenCard(id: RegimenId): Extract<Block, { kind: 'doseCard' }> {
  const d: DrugUse = REGIMENS[id]
  return { kind: 'doseCard', drug: d.drug, dose: d.dose, route: d.route, frequency: d.frequency, duration: d.duration, prep: d.preparation, maxDose: d.maxDose, monitoring: d.monitoring, contraindications: d.contraindications, adverseEffects: d.adverseEffects, sourceId: d.sourceId, notes: [d.indication, ...(d.notes || []), ...(d.renalHepatic ? [`Renal / hepatic: ${d.renalHepatic}`] : [])] }
}
