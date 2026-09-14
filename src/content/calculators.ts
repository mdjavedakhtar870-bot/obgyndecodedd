import type { CalculatorDef } from './types'

/* CALCULATORS A — validated formulas only */
const n = (v: string | undefined) => Number(v)
const has = (v: string | undefined) => v !== undefined && v !== '' && !Number.isNaN(Number(v))

export const CALCULATORS_A: CalculatorDef[] = [
  {
    id: 'edd-ga', name: 'EDD & Gestational Age (Naegele)', category: 'pregnancy',
    description: 'Estimated due date and current gestation from LMP or scan EDD.',
    inputs: [
      { name: 'lmp', label: 'First day of LMP', type: 'date' },
      { name: 'scanEdd', label: 'OR scan-provided EDD', type: 'date' },
      { name: 'onDate', label: 'Calculate on date', type: 'date' },
    ],
    compute(v) {
      const base = has(v.scanEdd) ? new Date(v.scanEdd!) : has(v.lmp) ? new Date(new Date(v.lmp!).getTime() + 280 * 86400000) : null
      if (!base) return { value: '-', interpretation: 'Enter LMP or scan EDD' }
      const ref = has(v.onDate) ? new Date(v.onDate!) : new Date()
      const gaDays = Math.floor((ref.getTime() - (base.getTime() - 280 * 86400000)) / 86400000)
      const weeks = Math.floor(gaDays / 7), days = gaDays % 7
      return {
        value: `EDD ${base.toISOString().slice(0, 10)} | GA today ${weeks}w+${days}d`,
        interpretation: gaDays < 0 ? 'Pre-dating' : gaDays >= 294 ? 'Post-term (>42 wks)' : gaDays >= 259 ? 'Term window' : '',
        tone: gaDays > 294 ? 'danger' : 'ok',
        breakdown: ['Naegele: LMP + 280 days', 'Scan dating supersedes LMP per programme thresholds'],
      }
    },
    formulaAndSource: 'Naegele rule (LMP + 280 d); standard obstetric dating.',
  },
  {
    id: 'bmi-iom', name: 'BMI & Pregnancy Weight-Gain Category (IOM)', category: 'maternal',
    description: 'Body mass index with recommended total pregnancy gain range.',
    inputs: [{ name: 'wt', label: 'Weight', type: 'number', unit: 'kg' }, { name: 'ht', label: 'Height', type: 'number', unit: 'cm' }],
    compute(v) {
      if (!has(v.wt) || !has(v.ht)) return { value: '-' }
      const bmi = n(v.wt) / Math.pow(n(v.ht) / 100, 2)
      let range = '', cat = ''
      if (bmi < 18.5) { cat = 'Underweight'; range = '12.5-18 kg' }
      else if (bmi < 25) { cat = 'Normal'; range = '11.5-16 kg' }
      else if (bmi < 30) { cat = 'Overweight'; range = '7-11.5 kg' }
      else { cat = 'Obese'; range = '5-9 kg' }
      return { value: bmi.toFixed(1), interpretation: `${cat} | IOM total gain ${range}`, tone: bmi >= 30 ? 'warn' : 'ok', breakdown: ['IOM/NRC 2009 ranges'] }
    },
    formulaAndSource: 'BMI = kg/m2; IOM 2009 gestational weight gain guidelines.',
  },
  {
    id: 'bishop', name: 'Bishop Score', category: 'pregnancy',
    description: 'Cervical favourability before induction.',
    inputs: [
      { name: 'dil', label: 'Dilation (cm)', type: 'select', options: ['0', '1-2', '3-4', '>=5'] },
      { name: 'eff', label: 'Effacement (%)', type: 'select', options: ['0-30', '40-50', '60-70', '>=80'] },
      { name: 'sta', label: 'Station', type: 'select', options: ['-3', '-2', '-1/0', '+1/+2'] },
      { name: 'cons', label: 'Consistency', type: 'select', options: ['Firm', 'Medium', 'Soft'] },
      { name: 'pos', label: 'Position', type: 'select', options: ['Posterior', 'Mid', 'Anterior'] },
    ],
    compute(v) {
      const d: Record<string, number> = { '0': 0, '1-2': 1, '3-4': 2, '>=5': 3 }
      const e: Record<string, number> = { '0-30': 0, '40-50': 1, '60-70': 2, '>=80': 3 }
      const s: Record<string, number> = { '-3': 0, '-2': 1, '-1/0': 2, '+1/+2': 3 }
      const c: Record<string, number> = { Firm: 0, Medium: 1, Soft: 2 }
      const p: Record<string, number> = { Posterior: 0, Mid: 1, Anterior: 2 }
      const score = (d[v.dil] ?? -99) + (e[v.eff] ?? -99) + (s[v.sta] ?? -99) + (c[v.cons] ?? -99) + (p[v.pos] ?? -99)
      if (score < 0) return { value: '-' }
      return {
        value: String(score),
        interpretation: score >= 8 ? 'Favourable - ARM/oxytocin' : score >= 6 ? 'Intermediate' : 'Unfavourable - ripening required',
        tone: score >= 8 ? 'ok' : score >= 6 ? 'warn' : 'danger',
      }
    },
    formulaAndSource: 'Modified Bishop score (1964).',
  },
  {
    id: 'map', name: 'Mean Arterial Pressure', category: 'maternal',
    description: 'MAP; FOGSI HDP-Gestosis screening uses MAP>85 as risk point.',
    inputs: [{ name: 'sbp', label: 'Systolic', type: 'number', unit: 'mmHg' }, { name: 'dbp', label: 'Diastolic', type: 'number', unit: 'mmHg' }],
    compute(v) {
      if (!has(v.sbp) || !has(v.dbp)) return { value: '-' }
      const map = Math.round((n(v.sbp) + 2 * n(v.dbp)) / 3)
      return { value: `${map} mmHg`, interpretation: map > 85 ? '>85 FOGSI risk point' : 'Below threshold', tone: map > 85 ? 'warn' : 'ok' }
    },
    formulaAndSource: 'MAP = (SBP + 2xDBP)/3; FOGSI HDP GCPR risk table.',
    sourceId: 'fogsi-hdp-gcpr-2026',
  },
  {
    id: 'shock-index', name: 'Obstetric Shock Index (HR/SBP)', category: 'risk',
    description: 'Early PPH shock detection.',
    inputs: [{ name: 'hr', label: 'Heart rate', type: 'number', unit: 'bpm' }, { name: 'sbp', label: 'Systolic BP', type: 'number', unit: 'mmHg' }],
    compute(v) {
      if (!has(v.hr) || !has(v.sbp) || n(v.sbp) === 0) return { value: '-' }
      const si = n(v.hr) / n(v.sbp)
      return {
        value: si.toFixed(2),
        interpretation: si >= 1 ? '>=1 significant shock likely' : si >= 0.9 ? '>=0.9 early warning (PPH red flag)' : 'Reassuring (<0.9)',
        tone: si >= 0.9 ? 'danger' : 'ok',
      }
    },
    formulaAndSource: 'Shock index HR/SBP; 0.9 threshold flags occult haemorrhage.',
  },
]
