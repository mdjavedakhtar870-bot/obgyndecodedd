import type { CalculatorDef } from './types'

/* CALCULATORS B */
const n = (v: string | undefined) => Number(v)
const has = (v: string | undefined) => v !== undefined && v !== '' && !Number.isNaN(Number(v))

export const CALCULATORS_B: CalculatorDef[] = [
  {
    id: 'mgso4-pritchard', name: 'MgSO4 Loading Assistant (Pritchard)', category: 'drugs-fluids',
    description: 'Fixed Pritchard regimen components + toxicity checklist.',
    inputs: [],
    compute() {
      return {
        value: 'Loading 4 g IV slow + 5 g IM each buttock | Maintenance 5 g IM q4h alternate buttocks',
        interpretation: 'Before EVERY maintenance dose: reflexes present, RR >=12/min, urine >=25 mL/h',
        breakdown: ['Antidote: calcium gluconate 10% 10 mL IV over 3 min'],
      }
    },
    formulaAndSource: 'Pritchard regimen - FOGSI-GESTOSIS-ICOG HDP GCPR 3rd Ed 2026.',
    sourceId: 'fogsi-hdp-gcpr-2026',
  },
  {
    id: 'txa-pph', name: 'TXA PPH Timing Check', category: 'drugs-fluids',
    description: 'Verifies the 3-hour WOMAN-trial window and dose plan.',
    inputs: [{ name: 'mins', label: 'Minutes since birth', type: 'number' }],
    compute(v) {
      if (!has(v.mins)) return { value: '1 g IV over 10 min; repeat after 30 min if bleeding continues', interpretation: 'Enter minutes since birth to check eligibility' }
      const m = n(v.mins)
      if (m <= 180) return { value: `Eligible (${m} min): give 1 g IV over 10 min`, interpretation: 'Repeat 1 g after 30 min if bleeding continues/restarts within 24 h', tone: 'ok' }
      return { value: 'Beyond 3-h window: do NOT initiate', interpretation: 'Exception: restarted bleeding within 24 h of first course', tone: 'danger' }
    },
    formulaAndSource: 'WHO TXA recommendation 2017 (WOMAN); WHO Consolidated PPH 2025 Recs 27/29.',
    sourceId: 'who-txa-pph-2017',
  },
  {
    id: 'iron-deficit', name: 'Iron Deficit (Ganzoni-style)', category: 'drugs-fluids',
    description: 'Approximate elemental iron deficit for replacement planning.',
    inputs: [
      { name: 'wt', label: 'Weight', type: 'number', unit: 'kg' },
      { name: 'hbNow', label: 'Current Hb', type: 'number', unit: 'g/dL' },
      { name: 'hbTgt', label: 'Target Hb', type: 'number', unit: 'g/dL' },
    ],
    compute(v) {
      if (!has(v.wt) || !has(v.hbNow)) return { value: '-' }
      const tgt = has(v.hbTgt) ? n(v.hbTgt) : 12
      const mg = Math.round(Math.max(0, n(v.wt) * (tgt - n(v.hbNow)) * 2.21 + n(v.wt) * 10))
      return { value: `${mg} mg elemental iron`, interpretation: 'Round to available preparations; verify product label maxima', breakdown: ['wt x dHb x 2.21 + stores'] }
    },
    formulaAndSource: 'Simplified Ganzoni formula (factor 2.21).',
  },
  {
    id: 'transfusion-target', name: 'Transfusion Units for Hb Target', category: 'labs',
    description: 'Approximate PRBC units to reach a target Hb at term blood volume.',
    inputs: [
      { name: 'wt', label: 'Weight', type: 'number', unit: 'kg' },
      { name: 'hbNow', label: 'Current Hb', type: 'number', unit: 'g/dL' },
      { name: 'hbTgt', label: 'Target Hb', type: 'number', unit: 'g/dL' },
    ],
    compute(v) {
      if (!has(v.wt) || !has(v.hbNow) || !has(v.hbTgt)) return { value: '-' }
      const rise = n(v.hbTgt) - n(v.hbNow)
      if (rise <= 0) return { value: '0 units needed', tone: 'ok' }
      const units = Math.ceil((n(v.wt) * rise * 0.08) / 0.28)
      return {
        value: `${units} unit(s) approx`,
        interpretation: 'One adult unit (~280 mL RBC mass) raises Hb ~1.4 g/dL in average adult; transfuse per clinical context not numbers alone',
        tone: 'warn',
      }
    },
    formulaAndSource: 'Standard transfusion arithmetic (blood volume ~8% body weight; unit yield ~1.4 g/dL).',
  },
  {
    id: 'corrected-na-anion-gap', name: 'Corrected Sodium & Anion Gap', category: 'labs',
    description: 'Hyperglycaemia-corrected Na and AG for DKA assessment.',
    inputs: [
      { name: 'na', label: 'Na', type: 'number', unit: 'mEq/L' },
      { name: 'glu', label: 'Glucose', type: 'number', unit: 'mg/dL' },
      { name: 'cl', label: 'Cl', type: 'number', unit: 'mEq/L' },
      { name: 'hco3', label: 'HCO3', type: 'number', unit: 'mEq/L' },
    ],
    compute(v) {
      if (!has(v.na) || !has(v.glu)) return { value: '-' }
      const corrNa = n(v.na) + 0.016 * (n(v.glu) - 100)
      let out = `Corrected Na ${corrNa.toFixed(1)} mEq/L`
      let tone: CalcTone = 'ok'
      if (has(v.cl) && has(v.hco3)) {
        const ag = Math.round(n(v.na) - n(v.cl) - n(v.hco3))
        out += ` | Anion gap ${ag}`
        if (ag > 12) tone = 'danger'
      }
      return { value: out, interpretation: 'Corrected Na <130 with DKA picture = true hyponatraemia severity marker', tone }
    },
    formulaAndSource: 'corrNa = Na + 0.016x(glucose-100); AG = Na-Cl-HCO3. Standard electrolyte formulas.',
  },
  {
    id: 'qtc', name: 'QTc (Bazett)', category: 'labs',
    description: 'Rate-corrected QT before QT-prolonging drugs (ondansetron etc.).',
    inputs: [{ name: 'qt', label: 'QT interval', type: 'number', unit: 'ms' }, { name: 'hr', label: 'Heart rate', type: 'number', unit: 'bpm' }],
    compute(v) {
      if (!has(v.qt) || !has(v.hr) || n(v.hr) === 0) return { value: '-' }
      const rr = 60 / n(v.hr)
      const qtc = n(v.qt) / Math.sqrt(rr)
      return {
        value: `${qtc.toFixed(0)} ms`,
        interpretation: qtc > 500 ? 'Prolonged - avoid/hold QT-prolonging agents' : qtc > 470 ? 'Borderline - caution' : 'Acceptable',
        tone: qtc > 500 ? 'danger' : qtc > 470 ? 'warn' : 'ok',
      }
    },
    formulaAndSource: "Bazett QTc = QT/sqrt(RR s).",
  },
  {
    id: 'lmwh-dose', name: 'LMWH Weight-Band Assistant', category: 'drugs-fluids',
    description: 'Treatment-dose enoxaparin by weight band (specialist confirm).',
    inputs: [{ name: 'wt', label: 'Weight', type: 'number', unit: 'kg' }],
    compute(v) {
      if (!has(v.wt)) return { value: '-' }
      const w = n(v.wt)
      let dose = ''
      if (w < 50) dose = '0.5 mg/kg q12h (low-weight specialist advice)'
      else if (w <= 90) dose = '1 mg/kg q12h SC'
      else if (w <= 120) dose = '80 mg q12h SC'
      else dose = '100 mg q12h SC (or 0.9-1 mg/kg capped)'
      return { value: dose, interpretation: 'Confirm anti-Xa in extremes of weight/renal impairment', tone: 'warn' }
    },
    formulaAndSource: 'RCOG GTG37a-era weight-banded treatment dosing conventions.',
    sourceId: 'rcog-gtg36-gbs-2017',
  },
]

type CalcTone = 'ok' | 'warn' | 'danger'
