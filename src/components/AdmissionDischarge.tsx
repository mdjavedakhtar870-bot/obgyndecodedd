import type { AdmissionDischargePlan } from '../content/types'
import { DISCHARGE_CHECKLIST, DISCHARGE_SHARED_SOURCES } from '../content/admission-discharge'
import { REGIMENS, type RegimenId } from '../content/medication-regimens'
import { Blocks, ClinicalTable, DrugUseCard, SourceBadge } from './clinical'
import { Link } from './links'

export function DischargeChecklist() {
  return <section id="discharge-checklist" style={{ scrollMarginTop: 150 }}>
    <h2 className="section-h">Complete discharge checklist</h2>
    <p>Complete the items that apply to this patient and the condition-specific plan. Record the decision, prescriptions, results ownership and follow-up in the discharge summary.</p>
    <div className="grid-cards">{DISCHARGE_CHECKLIST.map((item, i) => <section className="card card-pad" key={item.id}><h3>{i + 1}. {item.title}</h3><Blocks blocks={[{ kind: 'list', items: item.items }]} /></section>)}</div>
    <div className="source-line"><span className="small muted">Checklist sources:</span><div className="row">{DISCHARGE_SHARED_SOURCES.map((id) => <SourceBadge key={id} id={id} />)}</div></div>
  </section>
}

export function AdmissionDischargeView({ plan }: { plan: AdmissionDischargePlan }) {
  const sections = [
    ['admit', 'When admission or continued hospital care is needed', plan.admit],
    ['outpatient', 'When clinic, day care or home care may be suitable', plan.outpatient],
    ['ready', 'Before going home', plan.ready],
    ['medicines', 'Discharge medicines and treatment changes', plan.medicines],
    ['results', 'Tests, pending results and their reviewer', plan.tests],
    ['home', 'Home care and counselling', plan.homeCare],
  ] as const
  return <section id="admission-discharge" style={{ scrollMarginTop: 150 }}>
    <div className="block-info"><b>Care setting:</b> {plan.setting}</div>
    <p className="review-scope">Admission/discharge guidance checked {plan.checkedAt} against the linked sources. This is a clinical checklist for an individual decision, not an automatic discharge order.</p>
    {plan.scopeNote && <p className="block-warning">{plan.scopeNote}</p>}
    <nav className="row" aria-label="Admission and discharge sections" style={{ marginBottom: 16 }}><a className="btn sm" href="#care-admit">Admission</a><a className="btn sm" href="#care-ready">Discharge readiness</a><a className="btn sm" href="#care-medicines">Medicines</a><a className="btn sm" href="#care-follow-up">Follow-up</a><a className="btn sm" href="#care-return">Urgent return</a></nav>
    {sections.map(([id, heading, items]) => <section key={id} id={`care-${id}`} style={{ scrollMarginTop: 150 }}><h3 className="section-h">{heading}</h3><Blocks blocks={[{ kind: 'list', items: [...items] }]} />{id === 'medicines' && plan.medicineDetails.length > 0 && <details className="acc"><summary>Medicine doses — use only when indicated</summary><div className="acc-body"><p>Use the medicines selected for this patient. Listed alternatives are not instructions to prescribe all of them together. Confirm the actual remaining course, pregnancy/postnatal context and monitoring plan.</p>{plan.medicineDetails.map((m) => <div key={m.regimenId}><p><b>{m.when}</b></p><DrugUseCard drug={REGIMENS[m.regimenId as RegimenId]} /></div>)}</div></details>}</section>)}
    <section id="care-follow-up" style={{ scrollMarginTop: 150 }}><h3 className="section-h">Follow-up: when and what to review</h3><ClinicalTable headers={['When', 'Action / responsible service']} rows={plan.followUp.map((r) => [r.when, r.action])} /></section>
    <section id="care-return" className="block-warning" style={{ scrollMarginTop: 150 }}><h3>Return urgently</h3><Blocks blocks={[{ kind: 'list', items: plan.returnImmediately }]} /></section>
    <p><Link className="btn sm" to="/admission-discharge">Open the complete discharge checklist →</Link></p>
    <div className="source-line"><span className="small muted">Sources for this plan:</span><div className="row">{plan.sourceIds.map((id) => <SourceBadge key={id} id={id} />)}</div></div>
  </section>
}
