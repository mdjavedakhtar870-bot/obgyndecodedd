/* Clinical search: tokenised weighted scoring + synonym expansion */

interface Doc { id: string; kind: string; title: string; text: string; route: string }

const SYNONYMS: Record<string, string[]> = {
  pph: ['postpartum haemorrhage', 'bleeding after delivery', 'atony'],
  pet: ['pre-eclampsia'], preclampsia: ['pre-eclampsia'], preeclampsia: ['pre-eclampsia'],
  hbp: ['hypertension', 'blood pressure'], 'high bp': ['hypertension', 'hdp'],
  fits: ['eclampsia', 'seizure', 'convulsion'], convulsions: ['eclampsia', 'seizure'],
  iud: ['iucd', 'copper device', 'contraception'], pcod: ['pcos'],
  iugr: ['fgr', 'growth restriction'], sga: ['small for gestational age', 'fgr'],
  hmb: ['heavy menstrual bleeding', 'aub'], menorrhagia: ['heavy menstrual bleeding'],
  gdm: ['gestational diabetes'], ida: ['iron deficiency anaemia', 'anaemia'],
  vte: ['dvt', 'pe', 'thrombosis'], pe: ['pulmonary embolism'], dvt: ['deep vein thrombosis'],
  lscs: ['caesarean', 'cesarean', 'cs'], vbac: ['tolac', 'prior caesarean'],
  mtp: ['abortion', 'termination'], abortion: ['mtp', 'termination', 'miscarriage'],
  hg: ['hyperemesis', 'vomiting pregnancy'], icp: ['cholestasis', 'obstetric cholestasis'],
}

function expand(q: string): string[] {
  const toks = q.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 1)
  const out = new Set(toks)
  const joined = q.toLowerCase()
  for (const [k, vs] of Object.entries(SYNONYMS)) {
    if (toks.includes(k) || joined.includes(k)) vs.forEach((v) => out.add(v))
  }
  return [...out]
}

export function buildDocs(data: { topics: { id: string; title: string; tags: string[]; aliases?: string[]; summary: string; category: string }[]; emergencies: { id: string; title: string; keywords: string[]; group: string }[]; drugs: { id: string; name: string; drugClass: string; dbCategory: string }[]; calculators: { id: string; name: string; description: string }[]; procedures: { id: string; title: string; tags: string[] }[]; ddx: { id: string; presentation: string }[] }): Doc[] {
  const docs: Doc[] = []
  for (const t of data.topics) docs.push({ id: t.id, kind: 'Topic', title: t.title, text: [t.title, ...(t.tags || []), ...(t.aliases || []), t.summary].join(' ').toLowerCase(), route: `/topic/${t.id}` })
  for (const e of data.emergencies) docs.push({ id: e.id, kind: 'Emergency', title: `EMERGENCY: ${e.title}`, text: [e.title, ...e.keywords, e.group, 'emergency'].join(' ').toLowerCase(), route: `/emergency/${e.id}` })
  for (const d of data.drugs) docs.push({ id: d.id, kind: 'Drug', title: d.name, text: [d.name, d.drugClass, d.dbCategory, 'drug dose'].join(' ').toLowerCase(), route: `/drugs?q=${encodeURIComponent(d.name)}` })
  for (const c of data.calculators) docs.push({ id: c.id, kind: 'Calculator', title: c.name, text: `${c.name} ${c.description} calculator`.toLowerCase(), route: `/calculators#${c.id}` })
  for (const p of data.procedures) docs.push({ id: p.id, kind: 'Procedure', title: p.title, text: [p.title, ...p.tags].join(' ').toLowerCase(), route: `/procedures#${p.id}` })
  for (const d of data.ddx) docs.push({ id: d.id, kind: 'DDx', title: d.presentation, text: `${d.presentation} differential diagnosis presentation`.toLowerCase(), route: `/ddx` })
  return docs
}

export interface Hit extends Doc { score: number }

export function search(docs: Doc[], query: string): Hit[] {
  if (!query.trim()) return []
  const terms = expand(query)
  const hits: Hit[] = []
  for (const d of docs) {
    let score = 0
    const title = d.title.toLowerCase()
    for (const term of terms) {
      if (!d.text.includes(term)) continue
      score += 1
      if (title.includes(term)) score += 4
      if (title.startsWith(term)) score += 2
      if (d.kind === 'Emergency' && /emergency|pph|collapse|arrest/.test(term)) score += 3
    }
    if (score > 0) hits.push({ ...d, score })
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 14)
}
