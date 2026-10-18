import data from '../../data/admission-discharge-plans.json'
import type { AdmissionDischargePlan, DiseaseTopic, EmergencyProtocol, ProcedureDoc } from './types'
import { REGIMENS, type RegimenId } from './medication-regimens'

export const DISCHARGE_CHECKED_AT = '2026-10-18'
export const DISCHARGE_SHARED_SOURCES = ['discharge-nice-postnatal', 'discharge-nhm-postnatal', 'discharge-who-postnatal', 'discharge-rcog-surgery', 'discharge-nice-acutely-ill']
export const ADMISSION_DISCHARGE_PLANS = data.plans as Record<string, AdmissionDischargePlan>
export const EMERGENCY_CARE_MAP = data.emergencies as Record<string, string>
export const PROCEDURE_CARE_MAP = data.procedures as Record<string, string>

export const DISCHARGE_CHECKLIST = [
  { id: 'diagnosis', title: 'Diagnosis, course and responsible clinician', items: ['Record the diagnosis, pregnancy/postnatal status, relevant comorbidities, reason for admission, procedures, significant events and treatment response.', 'Document the clinician approving transfer/home care, date/time, destination and the level of support still required. ICU-to-ward transfer is a separate decision from going home.'] },
  { id: 'readiness', title: 'Clinical readiness and ongoing risks', items: ['Reassess observations, consciousness, breathing, circulation, bleeding, infection and pain against the condition-specific plan below.', 'Confirm oral fluids/food and required medicines are feasible, mobility is safe and bladder function is adequate or has an explicit catheter plan. Review bowel function when the illness/operation makes it relevant.', 'Review important blood/imaging findings and the trend. A normal single BP, glucose, Hb or CTG does not by itself establish discharge readiness.'] },
  { id: 'medicines', title: 'Complete medicine reconciliation', items: ['For every take-home medicine write its indication, generic/formulation name, dose, route, frequency, duration or stop/review date, and quantity. Record medicines started, changed, continued and stopped.', 'Check allergies, pregnancy/breastfeeding, renal/hepatic function, interactions and duplicate OTC products. Explain the last hospital dose and next home dose where timing matters.', 'Confirm supply, affordability, administration technique and understanding. Insulin, anticoagulants, devices and other high-risk medicines need practical teaching and a monitoring/rescue plan.'] },
  { id: 'results', title: 'Pending results and repeat investigations', items: ['List every pending culture, histology, hCG, imaging or other relevant result. Name who checks it, by when, how the patient is contacted and what to do if no result arrives.', 'Book required repeat blood tests/scans with a reviewer and action plan for an abnormal result. A pending result can be followed outside hospital only when clinical safety and reliable tracking allow it.'] },
  { id: 'vte', title: 'Bleeding and thrombosis prevention', items: ['Reassess thrombosis risk against current bleeding, operation, mobility and other risk factors. Record whether prophylaxis is indicated and why.', 'If anticoagulation is prescribed, specify prophylactic versus therapeutic dose, duration, hold/restart instructions and injection/sharps training. Explain bleeding and VTE warning signs.'] },
  { id: 'devices', title: 'Wounds, perineum, drains, catheters and bowel care', items: ['Record the wound/repair assessment and teach hygiene, dressing and activity care relevant to the actual operation.', 'For any catheter/drain/stoma left in place, record its purpose, care, output/blockage warnings and who removes/reviews it at which appointment. Record suture/clip removal if needed.'] },
  { id: 'obstetric', title: 'Pregnancy, birth and newborn handover', items: ['If still pregnant, document gestation, fetal assessment, pending surveillance, birth plan and indications for earlier return/birth.', 'After birth, communicate delivery/operative details, major blood loss, infection/GBS, RhD/antibody findings and any indicated prophylaxis or neonatal assessment.', 'Assess mother and baby separately. Confirm newborn clinical assessment, an observed effective feed or documented feeding support plan, and screening/jaundice/weight follow-up. Arrange maternal support if the baby remains in neonatal care.'] },
  { id: 'home', title: 'Recovery and practical home care', items: ['Explain expected bleeding/discharge and pain, diet/hydration, graded activity, hygiene and bladder/bowel recovery. Give operation-specific restrictions and driving advice when relevant.', 'Discuss feeding support, contraception and future pregnancy/fertility advice appropriate to the diagnosis and treatment. Explain medicine safety while breastfeeding.'] },
  { id: 'follow-up', title: 'Appointments that are actually arranged', items: ['Write the date/time or defined interval, place/contact, purpose and responsible service for each follow-up. Include BP, hCG, glucose, Hb, wound, specialty and neonatal reviews as applicable.', 'Confirm who continues care in the community and how the discharge summary/prescription reaches them. Give the patient a copy in an understandable format.'] },
  { id: 'return', title: 'Urgent-return instructions and access', items: ['Give condition-specific warnings and a 24-hour contact/appropriate destination. Confirm transport and a realistic way to return for urgent care.', 'After birth: heavy/increasing bleeding, severe headache/visual symptoms, fever/offensive lochia, worsening pain, chest pain/breathlessness, unilateral leg swelling, collapse or marked mental-state change needs urgent assessment.', 'Discuss newborn poor feeding, abnormal breathing, unusual sleepiness, temperature concerns and early/worsening jaundice with the newborn team’s return instructions.'] },
  { id: 'support', title: 'Mental health, support and safeguarding', items: ['Ask about emotional recovery, distress, loss/trauma and available support. Arrange help for significant mental-health or immediate safety concerns.', 'Assess support at home, communication/language needs, ability to care for self/baby and any safeguarding concern. Unresolved safety barriers can change the care setting.'] },
  { id: 'understanding', title: 'Final handover and understanding', items: ['Ask the patient/support person to explain the medicine plan, next appointments and what symptoms would make them seek help.', 'Document the advice, prescriptions, results ownership and contact details provided. Confirm that the patient agrees with and can carry out the plan; complete applicable items rather than treating elapsed hours as a discharge order.'] },
]

export const POSTNATAL_TIMING = [
  ['India NHM / LaQshya', 'After normal delivery: do not discharge before 48 hours; clinical or newborn concerns require longer care.'],
  ['WHO international baseline', 'Healthy women/newborns should receive facility care for at least 24 hours after birth; assess individual needs before transfer. Routine further contacts: 48–72 hours, day 7–14 and week 6.'],
  ['NICE UK caesarean pathway', 'Selected women recovering well, afebrile and without complications may be offered discharge after 24 hours with home follow-up. This is not an automatic Indian post-caesarean discharge time.'],
  ['Individualised care', 'Use the applicable local service plan and condition-specific criteria. Maternal and newborn readiness, access to follow-up and support can require a longer stay.'],
]

export function carePlan(id: string): AdmissionDischargePlan | undefined {
  const plan = ADMISSION_DISCHARGE_PLANS[id]
  if (!plan) return undefined
  return { ...plan, sourceIds: [...new Set([...plan.sourceIds, ...plan.medicineDetails.map((m) => REGIMENS[m.regimenId as RegimenId]?.sourceId).filter((s): s is string => !!s)])] }
}
export function withAdmissionDischarge(topic: DiseaseTopic): DiseaseTopic {
  const plan = carePlan(topic.id)
  if (!plan) return topic
  return { ...topic, admissionDischarge: plan, sourceIds: [...new Set([...topic.sourceIds, ...plan.sourceIds, ...DISCHARGE_SHARED_SOURCES])], status: 'review', lastVerifiedAt: undefined, version: topic.version + 1, reviewerNote: [topic.reviewerNote, 'Admission/discharge guidance checked 18 October 2026. This adds a scoped clinical synthesis and does not certify every statement in the module.'].filter(Boolean).join(' ') }
}
export function withEmergencyCare(protocol: EmergencyProtocol): EmergencyProtocol {
  let plan = carePlan(EMERGENCY_CARE_MAP[protocol.id])
  if (plan && protocol.id === 'emg-aph-massive') plan = { ...plan, scopeNote: 'This is recovery after major antepartum haemorrhage. Identify the actual cause: placenta praevia/PAS/vasa praevia and abruption need their own specialist surveillance, birth and postoperative plans.' }
  if (plan && protocol.id === 'emg-uterine-inversion') plan = { ...plan, ready: ['The inversion has been reduced, uterine position/tone is satisfactory and the obstetric team has excluded recurrent inversion or continuing haemorrhage.', ...plan.ready], sourceIds: [...plan.sourceIds, 'med-msf-inversion'] }
  if (plan && protocol.id === 'emg-uterine-rupture') plan = { ...plan, ready: ['The operative team has documented the rupture, uterine repair or hysterectomy, associated bladder/bowel injury and any continuing catheter or organ-recovery needs. A routine uncomplicated caesarean timetable is insufficient.', ...plan.ready], homeCare: [...plan.homeCare, 'Provide a senior debrief before discharge and a postnatal consultation in a few weeks. Discuss fertility, contraception and future pregnancy with the operative findings available; hysterectomy needs procedure-specific counselling.'], sourceIds: [...plan.sourceIds, 'discharge-nhs-rupture'] }
  return plan ? { ...protocol, admissionDischarge: plan, sourceIds: [...new Set([...protocol.sourceIds, ...plan.sourceIds, ...DISCHARGE_SHARED_SOURCES])] } : protocol
}
export function withProcedureCare(procedure: ProcedureDoc): ProcedureDoc {
  let plan = carePlan(PROCEDURE_CARE_MAP[procedure.id])
  if (plan && procedure.id === 'proc-balloon-tamponade') plan = { ...plan, ready: ['The intrauterine haemorrhage balloon and any associated packing have been removed under the obstetric team’s monitored plan and bleeding reassessed. A uterine tamponade balloon is not a home-care device.', ...plan.ready], scopeNote: 'Balloon tamponade requires monitored hospital care with rapid access to resuscitation and operative treatment. Stabilisation for interfacility transfer is a separate decision from discharge home.' }
  return plan ? { ...procedure, admissionDischarge: plan, sourceIds: [...new Set([...procedure.sourceIds, ...plan.sourceIds, ...DISCHARGE_SHARED_SOURCES])], status: 'review', lastVerifiedAt: undefined } : procedure
}
