import type { Block, ClinicalDetail } from './types'

export const ANTENATAL_CONTACTS: Extract<Block, { kind: 'table' }> = {
  kind: 'table', id: 'antenatal-calendar', caption: 'Visit calendar · WHO baseline of at least 8 contacts',
  headers: ['Contact', 'When', 'Focus / arrange before the next contact'],
  rows: [
    ['1 · First trimester', 'As soon as pregnancy is known; within the first 12 weeks', 'Booking history/examination, baseline tests and early screening choices; arrange a dated scan/screening appointment rather than waiting until the next routine visit.'],
    ['2 · Second trimester', '20 weeks', 'Review booking results and structural ultrasound, placental site, BP and emerging risks.'],
    ['3 · Second trimester', '26 weeks', 'Complete the 24–28-week GDM testing window, review anaemia risk and fetal growth; arrange the 28-week blood/antibody review.'],
    ['4 · Third trimester', '30 weeks', 'Review 28-week results, glucose plan and indicated RhD prophylaxis; reassess growth, symptoms and referrals.'],
    ['5 · Third trimester', '34 weeks', 'Review maternal/fetal wellbeing, anaemia response and the place-of-birth/transport plan.'],
    ['6 · Third trimester', '36 weeks', 'Assess presentation, growth concerns and birth readiness; review any condition requiring planned birth.'],
    ['7 · Third trimester', '38 weeks', 'Reassess symptoms, BP, fetal movement concerns and labour/ruptured-membrane contact arrangements.'],
    ['8 · Third trimester', '40 weeks', 'Review wellbeing and agree a documented plan if pregnancy continues, including the next assessment and birth/induction discussion.'],
  ],
}

const blocks: Block[] = [
  ANTENATAL_CONTACTS,
  { kind: 'info', title: 'How many visits in each trimester?', text: 'The WHO calendar has 1 contact in the first trimester, 2 in the second and 5 in the third: at least 8 in total. Book promptly; tests with an earlier deadline need their own appointment. Diabetes, hypertension, twins, anaemia, growth concerns or symptoms require additional reviews. These are care contacts, not eight ultrasound scans.' },
  { kind: 'conflict',
    guidelineA: { org: 'WHO eight-contact care model', recommendation: 'At least 8 contacts: within 12 weeks, then 20, 26, 30, 34, 36, 38 and 40 weeks.' },
    guidelineB: { org: 'India NHM programme / NICE UK', recommendation: 'NHM describes a minimum of 4 ANCs with first-trimester registration. NICE plans 10 routine appointments for a first pregnancy and 7 for a woman who has previously given birth.' },
    populationDifference: 'These are different service-delivery models. A programme minimum and a routine appointment calendar do not determine the extra care needed by an individual high-risk pregnancy.',
    indiaConsideration: 'Use the local maternity service and PMSMA specialist reviews to make a complete plan. PMSMA offers designated second/third-trimester care on the 9th of the month; it does not replace timely booking or an urgent assessment.',
    appDefault: 'Use the WHO eight-contact calendar as the baseline planning aid, then write the actual local appointment dates and add risk-driven reviews.',
    appDefaultReason: 'This gives a clear, more frequent baseline while making the national minimum and alternative service schedules explicit.' },
  { kind: 'table', id: 'antenatal-first-trimester', caption: 'First trimester · booking to 13+6 weeks', headers: ['Test / check', 'Timing and repeat', 'Purpose / next action'], rows: [
    ['CBC / haemoglobin', 'Booking; repeat later for the pregnancy schedule or sooner after an abnormal result/treatment.', 'Identify anaemia and review indices/cause. A low result needs a treatment-and-response plan, not just another test date.'],
    ['ABO blood group, RhD and red-cell antibody assessment', 'Establish at booking; arrange the later antibody check and document any previous sensitisation.', 'Plan RhD-negative care and blood compatibility. A positive antibody result needs identification and specialist assessment; prophylactic anti-D is not treatment of established sensitisation.'],
    ['HIV, syphilis and hepatitis B screening', 'Offer early with consent and a way to return results; repeat after new exposure/ongoing risk or when the national programme requires.', 'Positive screens need prompt confirmation/clinical referral and maternal-to-child-transmission prevention planning. Do not postpone a positive result to the next trimester.'],
    ['Urine assessment / midstream culture', 'Booking assessment; obtain a proper midstream culture to diagnose asymptomatic bacteriuria under the screening pathway. Test with urinary symptoms at any stage.', 'Protein dipsticks are useful for surveillance but do not replace a urine culture for bacteriuria. Treat significant infection using culture and pregnancy-appropriate antibiotics.'],
    ['Pregnancy dating, number of fetuses and screening choices', 'Arrange early ultrasound. NICE timing for dating/combined-screening assessment is 11+2–14+1 weeks; the exact aneuploidy programme window depends on the test offered.', 'Record a reliable gestational age/EDD and chorionicity if multiple. Screening is optional after counselling; an abnormal screen requires its own diagnostic discussion.'],
    ['Glucose testing · India programme', 'First antenatal contact, even if early; if negative, arrange the separate 24–28-week repeat.', 'Use the named 75 g test correctly; the detailed India method below differs from a fasting multi-sample OGTT.'],
    ['Additional tests selected from risk/history', 'Haemoglobinopathy/partner testing through the relevant programme; TFTs, renal/liver tests or other investigations when history, examination or local policy indicates.', 'Known thyroid disease, hypertension, pre-existing diabetes or a carrier result changes follow-up. Avoid presenting a single expanded blood panel as mandatory for every pregnancy.'],
  ] },
  { kind: 'table', id: 'antenatal-second-trimester', caption: 'Second trimester · 14+0–27+6 weeks', headers: ['Test / check', 'Timing and repeat', 'Purpose / next action'], rows: [
    ['Structural / anomaly ultrasound and placental location', 'Book within the accepted local window. NICE uses 18+0–20+6 weeks; WHO recommends an ultrasound before 24 weeks.', 'Review the actual report, completeness of views and any follow-up request. Abnormal findings or a low placenta need a dated specialist/repeat-scan plan.'],
    ['GDM testing', 'India programme: repeat at 24–28 weeks if the earlier test was negative, with at least 4 weeks between tests.', 'An early negative test does not exclude later GDM. A positive result needs glucose education, nutrition/therapy and follow-up.'],
    ['Anaemia / antibody review approaching 28 weeks', 'Arrange the 28-week CBC and antibody sample; bring forward testing for anaemia symptoms, bleeding or response assessment.', 'Review results and RhD status before the indicated anti-D injection. The WHO contact at 26 weeks does not mean postponing a 28-week intervention until 30 weeks.'],
    ['BP, proteinuria and fetal growth assessment', 'BP and urine protein at each routine face-to-face appointment; assess growth from 24 weeks and investigate a concerning trend.', 'New hypertension, symptoms or a growth discrepancy changes the care pathway. A growth/Doppler scan is driven by risk or findings.'],
    ['Targeted follow-up of earlier findings', 'Repeat/complete an incomplete scan or follow specialist plans for antibodies, infection, thyroid disease, diabetes or multiple pregnancy.', 'Write who will review the result and when. Avoid repeating an already completed screening panel solely because the trimester changed.'],
  ] },
  { kind: 'table', id: 'antenatal-third-trimester', caption: 'Third trimester · 28+0 weeks to birth', headers: ['Test / check', 'Timing and repeat', 'Purpose / next action'], rows: [
    ['CBC, blood group / antibody review', 'At 28 weeks in the NICE schedule; further Hb testing follows the local programme, anaemia treatment, bleeding or symptoms.', 'Check the response to treatment and plan birth with significant anaemia or antibodies. RhD prophylaxis has its own timing and product-specific regimen.'],
    ['Glucose testing if the routine window was missed', 'The India guideline tests at first presentation, including after 28 weeks; after a diagnosis, use glucose monitoring rather than repeated diagnostic OGTTs.', 'Late booking needs catch-up care now. Review glucose, growth and the birth plan if GDM is detected.'],
    ['Growth / fluid / Doppler ultrasound', 'When a maternal/fetal risk or examination finding indicates it; repeat frequency follows the diagnosed condition.', 'NICE does not routinely offer scans after 28 weeks for an uncomplicated singleton pregnancy. Routine 28–32/36-week scans are not a universal requirement.'],
    ['Fetal presentation', 'Assess after 36 weeks; ultrasound if breech or another malpresentation is suspected.', 'Confirm presentation before counselling about ECV or mode of birth.'],
    ['GBS and repeat infection testing', 'GBS testing follows the unit’s screening or risk-based policy. Repeat HIV/syphilis or other infection tests for programme requirements, new exposure or clinical concern.', 'GBS screening is not routine in every health system; a positive result informs intrapartum antibiotics. Recheck which tests were actually done and ensure the birth team can see the results.'],
    ['Additional maternal labs / fetal surveillance', 'Platelets, creatinine/LFTs, CTG and other surveillance when symptoms, hypertension, growth restriction or another complication warrants them.', 'Do not wait for a scheduled visit when reduced movements, bleeding, severe headache, visual symptoms or acute illness occur. Routine CTG/BPP at every low-risk visit is not the baseline calendar.'],
  ] },
  { kind: 'table', id: 'antenatal-glucose-test', caption: 'Glucose test · India 75 g method', headers: ['Step', 'National programme instruction'], rows: [
    ['When', 'First ANC; if negative repeat at 24–28 weeks, ≥4 weeks apart. If first seen after 28 weeks, test at that contact.'],
    ['Preparation', 'Dissolve 75 g glucose in approximately 300 mL water; take within 5–10 minutes, irrespective of the last meal in this Indian programme.'],
    ['Sample and threshold', 'Measure at 2 hours with an appropriate plasma-calibrated method. A 2-hour value ≥140 mg/dL meets this programme’s GDM criterion.'],
    ['Vomiting / different test frameworks', 'Vomiting within 30 minutes: repeat the next day or refer; do not label the incomplete test normal. A fasting multi-sample OGTT uses its own method and criteria; record the framework instead of mixing thresholds.'],
  ] },
]

export const ANTENATAL_DETAIL: ClinicalDetail = {
  checkedAt: '2026-10-18',
  overview: 'Plan the visit dates and investigation windows together. The WHO baseline is at least eight antenatal contacts for an uncomplicated pregnancy, with extra care for identified risks. The first, second and third trimester tables below distinguish booking tests, scheduled repeats and investigations triggered by a particular finding.',
  blocks,
  assessment: ['At every contact review new symptoms, wellbeing, medicines/supplements, results and whether the pregnancy has become higher risk. Record the next appointment and any outstanding test/referral.', 'At face-to-face visits measure BP and assess urine protein; discuss fetal movements and growth concerns as gestation advances. A test result needs an identified reviewer and a documented action.'],
  decisions: ['Arrange blood tests, scans and specialist visits within their own windows even when they fall between the eight scheduled contacts.', 'Late booking: establish gestation, obtain missing baseline tests promptly and arrange the tests still appropriate for the current gestation. Do not restart a missed first-trimester screening test after its valid window.', 'Symptoms or abnormal results override the routine timetable; increase review frequency for diabetes, hypertension, anaemia, antibodies, twins or suspected growth problems.'],
  followUp: ['Give a written list of the next visit date, investigations due, results awaiting review and where to seek urgent care.', 'Review all booking and 28-week results before birth planning; pass infection, antibody, glucose and significant scan findings to the birth/neonatal team.', 'At term document what happens if labour has not started, including the next assessment and discussion of planned birth.'],
  pitfalls: ['Eight contacts do not imply eight scans or a complete blood panel at every visit.', 'A routine 26-week contact does not replace 24–28-week glucose testing or appropriately timed 28-week blood/anti-D care.', 'Keep the national non-fasting glucose method distinct from a fasting OGTT, and do not count an uncompleted test as negative.'],
  sourceIds: ['anc-who-calendar', 'anc-india-programme', 'anc-india-gdm', 'nice-ng201-detail', 'anc-who-urine', 'anc-rcog-gbs'],
}
