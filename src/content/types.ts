/* ============================================================
   OBGYN DECODED — Clinical content model
   ============================================================ */

export type WorkflowStatus =
  | 'draft'
  | 'review'
  | 'clinically-verified'
  | 'published'
  | 'outdated'
  | 'archived'

export type Category =
  | 'antenatal'
  | 'obstetrics'
  | 'obstetric-emergency'
  | 'medical-disorders'
  | 'infections-pregnancy'
  | 'early-pregnancy'
  | 'gynaecology'
  | 'gynae-oncology'
  | 'urogynaecology'
  | 'contraception-infertility'
  | 'procedure'

/* ---------- Blocks: atomic renderable content units ---------- */

export type Block =
  | { kind: 'text'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { kind: 'warning'; title?: string; text: string }
  | { kind: 'info'; title?: string; text: string }
  | {
      kind: 'doseCard'
      drug: string
      dose: string
      route?: string
      frequency?: string
      duration?: string
      prep?: string
      maxDose?: string
      notes?: string[]
      contraindications?: string[]
      adverseEffects?: string[]
      monitoring?: string[]
      sourceId?: string
    }
  | { kind: 'steps'; steps: string[] }
  /* Guideline-conflict block: never silently pick one guideline over another */
  | {
      kind: 'conflict'
      guidelineA: { org: string; recommendation: string }
      guidelineB: { org: string; recommendation: string }
      populationDifference: string
      indiaConsideration: string
      appDefault: string
      appDefaultReason: string
    }

export interface DrugUse {
  /** drug name as used clinically (should match a drug DB record where one exists) */
  drug: string
  indication: string
  /** exact dose incl. weight/BSA basis where relevant */
  dose: string
  route: string
  frequency: string
  duration: string
  preparation?: string
  maxDose?: string
  renalHepatic?: string
  pregnancyLactation?: string
  adverseEffects?: string[]
  monitoring?: string[]
  contraindications?: string[]
  /** id from /data/clinical-source-map.json */
  sourceId?: string
}

export interface ComplicationEntry {
  name: string
  management?: Block[]
}

/** The 17-section treatment engine (requirement §49). Optional sections render only when authored. */
export interface TreatmentEngine {
  immediateStabilization?: Block[]
  initialAssessment?: Block[]
  investigations?: Block[]
  firstLine: Block[]
  alternativesFirstLine?: Block[]
  drugTreatment?: DrugUse[]
  nonDrugTreatment?: Block[]
  definitiveTreatment?: Block[]
  monitoring?: Block[]
  responseAssessment?: Block[]
  treatmentFailure?: Block[]
  secondLine?: Block[]
  rescue?: Block[]
  procedures?: Block[]
  escalation?: Block[]
  complications?: ComplicationEntry[]
  postTreatmentCare?: Block[]
}

export interface AlgorithmNode {
  id: string
  label: string
  type: 'start' | 'step' | 'decision' | 'action' | 'end'
  tone?: 'default' | 'danger' | 'warn' | 'ok'
  detail?: string
  next?: { to: string; edgeLabel?: string }[]
}

export interface InvestigationItem {
  test: string
  lookingFor: string
}

export interface DiseaseTopic {
  id: string
  title: string
  category: Category
  tags: string[]
  aliases?: string[]
  status: WorkflowStatus
  version: number
  /** ISO date of last clinical verification; absent => pending verification */
  lastVerifiedAt?: string
  reviewerNote?: string
  regionPriority: 'india-first' | 'international-first'
  summary: string
  definition?: string
  riskFactors?: string[]
  presentation?: string[]
  redFlags?: string[]
  differentials?: { condition: string; clue: string }[]
  initialAssessment?: Block[]
  /** either structured {test, lookingFor} rows or free-form blocks */
  investigations?: (InvestigationItem | Block)[]
  classificationTable?: { caption?: string; headers: string[]; rows: string[][] }
  managementPrinciples?: Block[]
  treatment?: TreatmentEngine
  algorithm?: AlgorithmNode[]
  followUp?: Block[]
  prevention?: Block[]
  specialSituations?: Block[]
  patientEducation?: Block[]
  sourceIds: string[]
  emergencyRef?: string
}

/* ---------- Emergency protocols (§54) ---------- */

export interface EmergencyProtocol {
  id: string
  title: string
  group: string
  tone: 'critical' | 'urgent'
  keywords: string[]
  recognize: string[]
  callForHelp: string[]
  immediateAction: Block[]
  investigations: string[]
  definitiveManagement: Block[]
  escalation: string[]
  postEventCare: string[]
  topicRef?: string
  drugs?: DrugUse[]
  sourceIds: string[]
  status: WorkflowStatus
  lastVerifiedAt?: string
}

/* ---------- Drug database (§53) ---------- */

export interface DrugDoseRow {
  indication: string
  dose: string
  route: string
  frequency?: string
  duration?: string
  preparation?: string
  max?: string
  notes?: string[]
}

export interface DrugRecord {
  id: string
  name: string
  drugClass: string
  dbCategory: string
  indications: string[]
  pregnancySafety: string
  trimesterNotes?: string
  lactation: string
  doseRows: DrugDoseRow[]
  contraindications?: string[]
  interactions?: string[]
  adverseEffects?: string[]
  monitoring?: string[]
  renalHepatic?: string
  sourceId?: string
  emergencyKit?: boolean
  status: WorkflowStatus
}

/* ---------- Calculators (§52) ---------- */

export type CalcInputType = 'number' | 'date' | 'select'

export interface CalcInput {
  name: string
  label: string
  type: CalcInputType
  unit?: string
  step?: number
  min?: number
  max?: number
  options?: string[]
  placeholder?: string
}

export interface CalcResult {
  value: string
  interpretation?: string
  tone?: 'ok' | 'warn' | 'danger'
  breakdown?: string[]
}

export interface CalculatorDef {
  id: string
  name: string
  category: 'pregnancy' | 'maternal' | 'fetal' | 'drugs-fluids' | 'labs' | 'risk'
  description: string
  inputs: CalcInput[]
  compute(values: Record<string, string>): CalcResult
  formulaAndSource: string
  sourceId?: string
}

/* ---------- Procedures (§48) ---------- */

export interface ProcedureDoc {
  id: string
  title: string
  setting: 'office/outpatient' | 'operating theatre - obstetric' | 'operating theatre - gynaecology' | 'radiology/interventional'
  tags: string[]
  indications: string[]
  absoluteContraindications?: string[]
  relativeContraindications?: string[]
  consentPoints: string[]
  preparation: string[]
  equipment: string[]
  anaesthesia: string[]
  steps: string[]
  intraOpTroubleshooting?: string[]
  complications: ComplicationEntry[]
  postopCare: string[]
  followUp: string[]
  sourceIds: string[]
  status: WorkflowStatus
  lastVerifiedAt?: string
}

/* ---------- Differential-diagnosis engine (§51) ---------- */

export interface DDxPresentation {
  id: string
  presentation: string
  redFlagsImmediate: string[]
  urgentWorkup: string[]
  firstMoves: string[]
  differential: {
    condition: string
    priority: 'cannot-miss' | 'common' | 'consider'
    keyFeatures: string
    action: string
    topicRef?: string
  }[]
}
