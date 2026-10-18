import { useState } from 'react'
import { ALL_TOPICS, CATEGORY_LABELS } from '../content'
import { DISCHARGE_CHECKED_AT, POSTNATAL_TIMING } from '../content/admission-discharge'
import { ClinicalTable, SourceBadge, StatusBadge } from '../components/clinical'
import { DischargeChecklist } from '../components/AdmissionDischarge'
import { Link } from '../components/links'

export function AdmissionDischargePage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const topics = ALL_TOPICS.filter((t) => t.admissionDischarge && (!category || t.category === category) && `${t.title} ${t.tags.join(' ')} ${t.admissionDischarge.setting} ${t.admissionDischarge.admit.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  return <article className="clinical-article">
    <span className="eyebrow">Admission · safe transfer · discharge · follow-up</span>
    <h1>Admission & discharge guide</h1>
    <p>Find when a case needs hospital care, when outpatient care may be suitable, and what must be arranged before going home. Every clinical topic has its own admission/discharge plan, with medicine changes, result tracking, follow-up and return warnings.</p>
    <p className="review-scope"><StatusBadge status="review" /> Guidance checked {DISCHARGE_CHECKED_AT}; section-level checks do not certify every statement elsewhere in a module.</p>
    <nav className="row" aria-label="Admission and discharge guide sections"><a className="btn" href="#case-plans">Find a case</a><a className="btn" href="#discharge-checklist">Complete checklist</a><a className="btn" href="#postnatal-timing">Postnatal stay & contacts</a></nav>
    <section id="case-plans" style={{ scrollMarginTop: 150 }}>
      <h2 className="section-h">Case-specific admission and discharge</h2>
      <div className="row" style={{ marginBottom: 16 }}><input className="input" aria-label="Find an admission or discharge plan" placeholder="Find PPH, ectopic, diabetes, caesarean…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ maxWidth: 390 }} /><select className="input" aria-label="Filter discharge plans by category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ maxWidth: 280 }}><option value="">All categories</option>{[...new Set(ALL_TOPICS.map((t) => t.category))].map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}</select><span className="small muted" aria-live="polite">{topics.length} plans</span></div>
      <div className="grid-cards">{topics.map((t) => <article className="card card-pad" key={t.id}><span className="eyebrow">{CATEGORY_LABELS[t.category]}</span><h3>{t.title}</h3><p><b>Usual setting:</b> {t.admissionDischarge!.setting}</p><p className="small"><b>Admission trigger:</b> {t.admissionDischarge!.admit[0]}</p><Link className="btn sm" to={`/topic/${t.id}/#admission-discharge`}>Open admission & discharge plan →</Link></article>)}</div>
      {!topics.length && <p>No matching case. Try the condition name or select all categories.</p>}
    </section>
    <section id="postnatal-timing" style={{ scrollMarginTop: 150 }}><h2 className="section-h">Postnatal stay and follow-up contacts</h2><ClinicalTable headers={['Setting / source', 'Timing and conditions']} rows={POSTNATAL_TIMING} /><p>Before transfer, assess maternal recovery and newborn needs, confirm feeding support, and arrange the actual local follow-up. A minimum stay is not a discharge order when complications remain.</p><div className="row">{['discharge-nhm-postnatal', 'discharge-who-postnatal', 'nice-ng192-detail'].map((id) => <SourceBadge id={id} key={id} />)}</div></section>
    <DischargeChecklist />
    <section className="card card-pad" style={{ marginTop: 20 }}><h2>What the discharge summary must contain</h2><p>Diagnosis and clinical course; procedures and complications; condition at transfer; medicines with doses and stop/review dates; allergies; pending results with their reviewer; wound/device instructions; pregnancy/newborn information when relevant; follow-up appointments; urgent-return advice and contacts; the responsible clinician and destination.</p><p>Provide the patient and receiving service with a clear copy. Confirm understanding of the medicine, test and return plan before leaving.</p></section>
  </article>
}
