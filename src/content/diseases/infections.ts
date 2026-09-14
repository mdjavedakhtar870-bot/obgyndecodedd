import type { DiseaseTopic } from '../types'

/* ============================================================
   INFECTIONS IN PREGNANCY
   Primary regimen source: CDC STI Treatment Guidelines 2021
   (verified current 2026-08-23). India-adapted notes added.
   Compact but complete treatment entries.
   ============================================================ */

const CDC = 'cdc-sti-2021'
function t(partial: Partial<DiseaseTopic> & Pick<DiseaseTopic, 'id' | 'title' | 'summary' | 'sourceIds'>): DiseaseTopic {
  return {
    category: 'infections-pregnancy',
    tags: [],
    status: 'published',
    version: 1,
    lastVerifiedAt: '2026-08-23',
    regionPriority: 'international-first',
    redFlags: ['Haemodynamic instability -> sepsis pathway'],
    initialAssessment: [{ kind: 'text', text: 'See treatment table for testing and regimens.' }],
    ...partial,
  } as DiseaseTopic
}

export const INFECTION_TOPICS: DiseaseTopic[] = [
  t({
    id: 'uti-pyelonephritis',
    title: 'UTI & Pyelonephritis in Pregnancy',
    tags: ['uti', 'pyelonephritis', 'nitrofurantoin', 'asymptomatic-bacteriuria'],
    summary: 'Screen asymptomatic bacteriuria (treat ALL positive - pyelo/preterm risk). Cystitis: nitrofurantoin/cephalexin courses. Pyelonephritis = ADMISSION + IV ceftriaxone; preterm-labour watch.',
    sourceIds: [CDC],
    initialAssessment: [{ kind: 'steps', steps: ['MSU culture BEFORE therapy', 'Temp/loin exam for upper tract', 'CTG if viable + contractions'] }],
    investigations: [{ test: 'MSU', lookingFor: 'Organism+sensitivities guide course' }],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Pyelo: admit, IV fluids, antiemetics, CTG surveillance'] }],
      firstLine: [
        { kind: 'table', headers: ['Entity', 'Regimen'], rows: [
          ['Asymptomatic bacteriuria/cystitis', 'Nitrofurantoin 100 mg BD x5-7 d OR cephalexin 500 mg QID x7 d OR amoxicillin-clavulanate 500+125 BD x7 d (culture-guided); AVOID nitrofurantoin at term/G6PD'],
          ['Pyelonephritis', 'Ceftriaxone 1 g IV daily (+/- gentamicin) until afebrile 24-48 h then oral course to complete 10-14 d total'],
        ] },
      ],
      monitoring: [{ kind: 'list', items: ['Test-of-cure MSU after course', 'Recurrent infections: suppression dose discussion + renal US postpartum if recurrent pyelo'] }],
      complications: [{ name: 'Preterm labour during pyelo', management: [{ kind: 'text', text: 'PTL pathway alongside antibiotics' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Hygiene/voiding counselling; low-dose prophylaxis for recurrences per specialist'] }],
    },
  }),
  t({
    id: 'chorioamnionitis',
    title: 'Chorioamnionitis / Intra-amniotic Infection',
    tags: ['chorioamnionitis', 'intrapartum-fever'],
    summary: 'Fever >=38 intrapartum or maternal/fetal tachycardia+foul liquor: antibiotics NOW + expedite birth. Ampicillin+gentamicin(+metronidazole post-CS). Neonatal team alerted.',
    sourceIds: [CDC],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Start antibiotics immediately on suspicion - do NOT await cultures', 'Expedite birth decision (induction/augment vs CS by obstetric picture)'] }],
      firstLine: [
        { kind: 'doseCard', drug: 'Ampicillin + Gentamicin', dose: 'Ampicillin 2 g IV q6h + Gentamicin 5 mg/kg q24h (loading 2 mg/kg q8h alternative)', route: 'IV', frequency: 'q6h/q24h', duration: 'Until birth; continue post-CS (add metronidazole 500 mg q8h) until afebrile 24-48 h', notes: ['Vaginal birth without further extension typically'], sourceId: CDC },
      ],
      monitoring: [{ kind: 'list', items: ['Hourly obs; CTG continuous; placenta histology at birth'] }],
      complications: [{ name: 'Neonatal sepsis', management: [{ kind: 'text', text: 'Paediatric workup at delivery' }] }, { name: 'PPH', management: [{ kind: 'text', text: 'Infected uterus contracts poorly - PPH bundle ready' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Complete antibiotic course; lactation continues safely'] }],
    },
  }),
  t({
    id: 'gbs',
    title: 'GBS Colonisation (prevention of early-onset neonatal disease)',
    tags: ['gbs', 'penicillin-prophylaxis'],
    summary: 'Rectovaginal screening 36-37 wks where policy-based; risk-based approach where not. Intrapartum benzylpenicillin for positives/risk factors.',
    sourceIds: ['rcog-gtg36-gbs-2017'],
    treatment: {
      firstLine: [
        { kind: 'doseCard', drug: 'Benzylpenicillin (IAP)', dose: '1.8 g IV then 900 mg q4h until birth', route: 'IV', frequency: 'q4h', duration: 'Until birth (>=4 h ideal)', contraindications: ['Anaphylactic penicillin allergy -> clindamycin 900 mg q8h if susceptible else vancomycin per protocol'], sourceId: 'rcog-gtg36-gbs-2017' },
      ],
      definitiveTreatment: [{ kind: 'text', text: 'Risk factors mandating IAP even when unscreened: previous GBS-affected neonate, GBS bacteriuria this pregnancy, preterm labour/PPROM, fever in labour, ROM >18 h.' }],
      monitoring: [{ kind: 'list', items: ['Neonatal observation per GTG36 risk framework at birth'] }],
      postTreatmentCare: [{ kind: 'list', items: ['Document pathway; no antenatal eradication attempts'] }],
    },
  }),
  t({
    id: 'sti-syphilis',
    title: 'Syphilis in Pregnancy',
    tags: ['syphilis', 'rpr', 'vdrl', 'congenital-syphilis'],
    summary: 'Universal early screening (India programme) + third-trimester repeat in high-risk. Penicillin is the ONLY fetal-safe curative agent - desensitise if allergic. Treat stage-appropriately; partner management; follow-up titres.',
    sourceIds: [CDC],
    treatment: {
      firstLine: [
        { kind: 'table', headers: ['Stage', 'Regimen (pregnancy)'], rows: [
          ['Primary/secondary/early latent', 'Benzathine penicillin G 2.4 million units IM single dose'],
          ['Late latent/unknown duration/tertiary (non-neuro)', 'Benzathine penicillin G 2.4 MU IM weekly x3 doses'],
          ['Neurosyphilis', 'Aqueous crystalline penicillin G 18-24 MU/day IV (3-4 MU q4h) x10-14 days'],
        ] },
        { kind: 'info', title: 'Jarisch-Herxheimer', text: 'Warn about febrile reaction within 24 h of treating early syphilis; supportive care; fetal monitoring counselled late pregnancy.' },
      ],
      monitoring: [{ kind: 'list', items: ['Quantitative titres at 8 wks then monthly-ish; 4-fold fall expected', 'Serofast states reviewed by specialist', 'Partner(s) treated; congenital-syphilis evaluation at birth'] }],
      complications: [{ name: 'Congenital syphilis', management: [{'kind':'text','text':'Aqueous penicillin G 50,000 U/kg IV q12h x10 days neonatal regimen'}] }],
      postTreatmentCare: [{ kind: 'list', items: ['Repeat serology postpartum per programme; STI co-screening (HIV etc.)'] }],
    },
  }),
  t({
    id: 'sti-chlamydia',
    title: 'Chlamydia in Pregnancy',
    tags: ['chlamydia', 'azithromycin'],
    summary: 'Azithromycin 1 g PO single dose (doxycycline CONTRAINDICATED in pregnancy). Re-test 4 weeks post-completion; partner treatment; re-screen T3 high-risk.',
    sourceIds: [CDC],
    treatment: {
      firstLine: [
        { kind: 'doseCard', drug: 'Azithromycin', dose: '1 g PO single dose', route: 'PO', frequency: 'Once', duration: 'Single dose', notes: ['Amoxicillin 500 mg TDS x7 d alternative'], sourceId: CDC },
      ],
      monitoring: [{ kind: 'list', items: ['NAAT test-of-cure 4 wks', 'Partners treated; abstain until both complete'] }],
      postTreatmentCare: [{ kind: 'list', items: ['Neonatal opthalmia/pneumonia awareness at birth'] }],
    },
  }),
  t({
    id: 'sti-gonorrhoea',
    title: 'Gonorrhoea in Pregnancy',
    tags: ['gonorrhoea', 'ceftriaxone'],
    summary: 'Ceftriaxone 500 mg IM single dose (<150 kg; 1 g >=150 kg) + chlamydia cover if unexcluded. Test-of-cure NAAT 2 wks (pregnancy-specific recommendation).',
    sourceIds: [CDC],
    treatment: {
      firstLine: [
        { kind: 'doseCard', drug: 'Ceftriaxone', dose: '500 mg IM single dose (1 g if >=150 kg)', route: 'IM', frequency: 'Once', duration: 'Single dose', notes: ['Cephalosporin allergy -> specialist consultation (CDC)', 'Add azithromycin 1 g if chlamydia not excluded'], sourceId: CDC },
      ],
      monitoring: [{ kind: 'list', items: ['NAAT test-of-cure ~2 wks (pregnancy)', 'Pharyngeal sites considered per exposure'] }],
      postTreatmentCare: [{ kind: 'list', items: ['Ophthalmia neonatorum prevention via cure; partner management'] }],
    },
  }),
  t({
    id: 'sti-hsv',
    title: 'Genital Herpes in Pregnancy',
    tags: ['herpes', 'acyclovir', 'csection-lesions'],
    summary: 'First episode: acyclovir 400 mg TDS x7-10d + suppressive acyclovir from 36 wks for recurrent-genital-HSV mothers. Active lesions AT BIRTH -> caesarean offered (primary episode esp.).',
    sourceIds: [CDC],
    treatment: {
      firstLine: [
        { kind: 'doseCard', drug: 'Acyclovir', dose: '400 mg PO TDS (first episode 7-10 d; suppression 36 wks-birth)', route: 'PO', frequency: 'TDS', notes: ['Valacyclovir alternatives per protocol'], sourceId: CDC },
      ],
      definitiveTreatment: [{ kind: 'list', items: ['Primary-episode lesions near term -> caesarean offer', 'Recurrent lesions at birth -> individualised (risk lower) documented choice'] }],
      postTreatmentCare: [{ kind: 'list', items: ['Swab-culture newborn if lesions exposed; paediatric informed'] }],
    },
  }),
  t({
    id: 'vaginitis',
    title: 'Vaginitis Bundle (BV · candidiasis · trichomoniasis)',
    tags: ['bacterial-vaginosis', 'thrush', 'trichomonas'],
    summary: 'BV: metronidazole 400 mg BD x5 d (asymptomatic BV treatment in pregnancy debated - treat symptomatic/high-risk PTB contexts). Candida: topical imidazoles (oral azoles avoided T1). Trichomonas: metronidazole 400-500 mg BD x5-7 d (treat symptomatic pregnancy infection; partners too).',
    sourceIds: [CDC],
    treatment: {
      firstLine: [
        { kind: 'table', headers: ['Condition', 'Pregnancy regimen'], rows: [
          ['Bacterial vaginosis (symptomatic)', 'Metronidazole 400 mg BD x5 d (or clindamycin 300 mg BD x5 d)'],
          ['Vulvovaginal candidiasis', 'Clotrimazole/miconazole vaginal pessaries/cream 7-day courses (ORAL AZOLES avoided esp. first trimester)'],
          ['Trichomoniasis (symptomatic)', 'Metronidazole 400-500 mg BD x7 days; treat partners simultaneously'],
        ] },
      ],
      monitoring: [{ kind: 'list', items: ['Symptom resolution review; recurrent candida: glucose screen + longer maintenance topical'] }],
      postTreatmentCare: [{ kind: 'list', items: ['Avoid douching practices; hygiene counselling'] }],
    },
  }),
  t({
    id: 'pid',
    title: 'Pelvic Inflammatory Disease',
    tags: ['pid', 'tubo-ovarian-abscess', 'ceftriaxone-doxycycline-metronidazole'],
    aliases: ['pelvic infection', 'TOA'],
    summary: 'Low threshold to treat. Outpatient (uncomplicated): ceftriaxone 500 mg IM x1 + doxycycline 100 BD x14 d + metronidazole 500 BD x14 d (CDC 2021 PID). Inpatient criteria incl. TOA/pregnancy/severe. TOA >5 cm or rupturing -> drainage.',
    sourceIds: [CDC],
    redFlags: ['Tubu-ovarian abscess rupture -> emergency laparotomy', 'Pregnancy-associated PID -> admit', 'No improvement 72 h -> reimagine/drain'],
    treatment: {
      immediateStabilization: [{ kind: 'list', items: ['Admission triggers: TOA, severe illness/vomiting, pregnancy, failed outpatient, surgical abdomen uncertainty'] }],
      firstLine: [
        { kind: 'table', headers: ['Setting', 'Regimen'], rows: [
          ['Outpatient (non-pregnant)', 'Ceftriaxone 500 mg IM x1 + Doxycycline 100 mg BD x14 d + Metronidazole 500 mg BD x14 d'],
          ['Inpatient', 'Ceftriaxone 1 g IV q24h (or cefoxitin/ampicillin protocols) + doxycycline + metronidazole; step-down oral to complete 14 d'],
        ] },
      ],
      monitoring: [{ kind: 'list', items: ['Clinical review 72 h', 'Repeat STI testing; partner therapy mandatory', 'IUD management decision (usually remove if not improving)'] }],
      complications: [
        { name: 'Tubo-ovarian abscess', management: [{ kind: 'text', text: 'IV antibiotics; imaging-guided drainage >5-7 cm; surgery for rupture/no response' }] },
        { name: 'Hydrosalpinx/infertility sequelae', management: [{'kind':'text','text':'Fertility counselling later; ectopic-risk flag next pregnancies'}] },
        { name: 'Fitz-Hugh-Curtis', management: [{ kind: 'text', text: 'Perihepatitis responds to standard PID therapy' }] },
      ],
      postTreatmentCare: [{ kind: 'list', items: ['Abstinence until partner completion; retest guidance', 'Documentation for chronic-pain/fertility follow-up'] }],
    },
  }),
  t({
    id: 'viral-pregnancy-hbv-hcv-hiv-rubella-cmv-varicella-parvo-covid-flu',
    title: 'Viral Infections Quick-Reference (HIV · HBV · HCV · rubella · CMV · varicella · influenza · COVID)',
    tags: ['hiv', 'hbv', 'hcv', 'rubella', 'cmv', 'varicella', 'influenza', 'covid'],
    status: 'review',
    version: 1,
    reviewerNote: 'Condensed index module; full expansions queued v1.1 with NACO/WHO/CDC cross-checks.',
    summary: 'Key actions: universal HIV/HBV/HCV screening; ART for all HIV+ (viral suppression = near-zero transmission); HBV immunoglobulin+vaccine to newborns of HBsAg+ mothers; NO live vaccines in pregnancy (MMR/varicella) - immunoglobulin post-exposure instead; influenza vaccine safe & recommended; COVID current-era management per national guidance.',
    specialSituations: [
      { kind: 'table', headers: ['Infection', 'Pregnancy-critical actions'], rows: [
        ['HIV', 'ART regardless of CD4 (dolutegravir-based national programmes); mode by viral load; neonatal prophylaxis; avoid breastfeeding ONLY per national guidance context (India follows formula-replacement historically - verify current NACO)'],
        ['Hepatitis B', 'HBsAg screen; high viral load -> tenofovir T3; neonate HBIG + vaccine within 12-24 h; breastfeeding SAFE with immunisation'],
        ['Hepatitis C', 'DAA therapy POSTPARTUM (curative); breastfeeding OK unless cracked nipples bleeding'],
        ['Rubella', 'Non-immune: MMR POSTPARTUM only; exposure -> Ig within window; congenital-rubella counselling'],
        ['CMV', 'No routine treatment; hygiene counselling for seronegative mothers (toddlers!); congenital CMV specialist pathways'],
        ['Varicella', 'Non-immune exposure: VZIG within 96-144 h; chickenpox in mother around delivery = neonatal VZIG; acyclovir for severe maternal cases; live vaccine postpartum'],
        ['Influenza', 'Oseltamivir early for suspected flu ANY severity threshold lower in pregnancy; vaccination any trimester'],
        ['COVID-19', 'Follow current MoHFW/national protocol; vaccination recommended; treat hypoxia aggressively (prone positioning safe)'],
      ] },
    ],
    treatment: {
      firstLine: [{ kind: 'list', items: ['Each row above contains the actionable core; detailed dosing pages queued for v1.1 verification cycle'] }],
      monitoring: [{ kind: 'list', items: ['Viral-load schedules for HIV/HBV as per specialist programmes'] }],
      escalation: [{ kind: 'list', items: ['ID physician involvement for all complex vertical-transmission scenarios'] }],
      complications: [{ name: 'Vertical transmission events', management: [{ kind: 'text', text: 'Paediatric ID referral; registry reporting per programme' }] }],
      postTreatmentCare: [{ kind: 'list', items: ['Postpartum vaccination catch-ups (live vaccines now allowed while breastfeeding)'] }],
    },
    sourceIds: [CDC],
  }),
]
