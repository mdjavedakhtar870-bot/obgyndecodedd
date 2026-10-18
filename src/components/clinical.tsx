import { useId, useState, type ReactNode } from 'react'
import { getSource } from '../content/sources'
import type { Block, AlgorithmNode, DrugUse } from '../content/types'

/* ---------- Source badge ---------- */
export function SourceBadge({ id }: { id?: string }) {
  if (!id) return null
  const s = getSource(id)
  if (!s) return <span className="badge">{id}</span>
  const tone = s.status === 'verified-live' ? 'ok' : s.status === 'outdated' ? 'danger' : 'warn'
  return (
    <a className={`badge src`} href={s.url} target="_blank" rel="noreferrer" title={`${s.title} — ${s.dateChecked || 'not checked'}. ${s.checkedAgainst || ''}`}>
      {s.organisation}{s.version ? ` · ${s.version}` : ''}
      <span className={`badge ${tone}`}>{s.status === 'verified-live' ? 'checked' : s.status === 'verified-summary' ? 'summary checked' : s.status === 'outdated' ? 'OUTDATED' : 'pending check'}</span>
    </a>
  )
}

/* ---------- Blocks renderer ---------- */
export function Blocks({ blocks }: { blocks: Block[] | undefined }) {
  if (!blocks?.length) return null
  return <>{blocks.map((b, i) => <BlockView key={i} b={b} />)}</>
}
function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case 'text': return <p className="clinical-copy">{b.text}</p>
    case 'list': return b.ordered ? <ol className="clinical-copy clinical-list">{b.items.map((x, i) => <li key={i}>{x}</li>)}</ol> : <ul className="clinical-copy clinical-list">{b.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
    case 'table':
      return (
        b.id ? <section id={b.id} style={{ scrollMarginTop: 88 }}><ClinicalTable headers={b.headers} rows={b.rows} caption={b.caption} /></section> : <ClinicalTable headers={b.headers} rows={b.rows} caption={b.caption} />
      )
    case 'warning': return <div className="block-warning">{b.title && <b>{b.title}: </b>}{b.text}</div>
    case 'info': return <div className="block-info">{b.title && <b>{b.title}: </b>}{b.text}</div>
    case 'doseCard':
      return (
        <div className="dose-card">
          <div className="dose-head"><span>{b.drug}</span><SourceBadge id={b.sourceId} /></div>
          <div className="dose-body">
            <DoseRow k="Dose" v={b.dose} />
            {b.route && <DoseRow k="Route" v={b.route} />}
            {b.frequency && <DoseRow k="Frequency" v={b.frequency} />}
            {b.duration && <DoseRow k="Duration" v={b.duration} />}
            {b.prep && <DoseRow k="Preparation" v={b.prep} />}
            {b.maxDose && <DoseRow k="Max dose" v={b.maxDose} />}
            {b.notes?.length ? <ul className="dose-notes" style={{ margin: '4px 0 0', paddingLeft: 18 }}>{b.notes.map((x, i) => <li key={i}>{x}</li>)}</ul> : null}
            {b.adverseEffects?.length ? <DoseList k="Adverse effects" items={b.adverseEffects} /> : null}
            {b.monitoring?.length ? <DoseList k="Monitoring" items={b.monitoring} /> : null}
            {b.contraindications?.length ? <div className="block-warning" style={{ margin: '6px 0 0', padding: '8px 12px' }}><b>Contraindications:</b> {b.contraindications.join(' · ')}</div> : null}
          </div>
        </div>
      )
    case 'steps': return <ol className="steps-list">{b.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
    case 'conflict':
      return (
        <div className="conflict-box">
          <h4>Guideline conflict</h4>
          <p style={{ fontSize: 13.5 }}><b>{b.guidelineA.org}</b><br />{b.guidelineA.recommendation}</p>
          <p style={{ fontSize: 13.5 }}><b>{b.guidelineB.org}</b><br />{b.guidelineB.recommendation}</p>
          <p style={{ fontSize: 13.5 }}><b>Population/setting difference:</b> {b.populationDifference}</p>
          <p style={{ fontSize: 13.5 }}><b>Practical India consideration:</b> {b.indiaConsideration}</p>
          <div className="block-info"><b>App default:</b> {b.appDefault}<br /><span className="small muted">Reason: {b.appDefaultReason}</span></div>
        </div>
      )
    default: return null
  }
}
function DoseRow({ k, v }: { k: string; v: string }) { return <div className="dose-row"><span className="k">{k}</span><span>{v}</span></div> }
function DoseList({ k, items }: { k: string; items: string[] }) {
  return <div className="dose-row"><span className="k">{k}</span><ul style={{ margin: 0, paddingLeft: 16 }}>{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
}

/** Labelled rows retain dose/route/frequency relationships on narrow screens. */
export function ClinicalTable({ headers, rows, caption }: { headers: string[]; rows: ReactNode[][]; caption?: string }) {
  return <div className="clinical-table-wrap">
    <table className="clinical" role="table">
      {caption && <caption>{caption}</caption>}
      <thead role="rowgroup"><tr role="row">{headers.map((h, i) => <th key={i} scope="col" role="columnheader">{h}</th>)}</tr></thead>
      <tbody role="rowgroup">{rows.map((row, i) => <tr key={i} role="row">{row.map((cell, j) => <td key={j} role="cell"><span className="cell-label" aria-hidden="true">{headers[j]}</span><div className="cell-value">{cell}</div></td>)}</tr>)}</tbody>
    </table>
  </div>
}

export function DrugUseCard({ drug: d }: { drug: DrugUse }) {
  return <Blocks blocks={[{ kind: 'doseCard', drug: d.drug, dose: d.dose, route: d.route, frequency: d.frequency, duration: d.duration, prep: d.preparation, maxDose: d.maxDose, adverseEffects: d.adverseEffects, monitoring: d.monitoring, contraindications: d.contraindications, sourceId: d.sourceId, notes: [d.indication ? `Indication: ${d.indication}` : '', d.renalHepatic ? `Renal / hepatic: ${d.renalHepatic}` : '', d.pregnancyLactation ? `Pregnancy / lactation: ${d.pregnancyLactation}` : '', ...(d.notes || [])].filter(Boolean) }]} />
}

/* ---------- Algorithm renderer ---------- */
export function AlgorithmFlow({ nodes }: { nodes: AlgorithmNode[] }) {
  const prefix = useId().replaceAll(':', '')
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
  // Render every authored node. Several modules have a start node without an
  // edge; walking only that node previously hid the rest of the algorithm.
  // Explicit destination links preserve branches without implying that two
  // alternative outcomes should be performed sequentially.
  return <div className="flow">{nodes.map((node) => <section key={node.id} id={`${prefix}-${node.id}`} className={`flow-node ${node.type} ${node.tone ? `tone-${node.tone}` : ''}`} tabIndex={-1}>
    <span className="flow-type">{node.type === 'decision' ? 'Decision' : node.type === 'start' ? 'Entry point' : node.type === 'end' ? 'Outcome' : 'Action'}</span>
    <strong>{node.label}</strong>
    {node.detail && <span className="detail">{node.detail}</span>}
    {!!node.next?.length && <div className="flow-options">{node.next.filter((next) => byId[next.to]).map((next) => <a key={next.to} className="flow-option" href={`#${prefix}-${next.to}`}><b>{next.edgeLabel || 'Next'}</b><span>{byId[next.to].label} ↓</span></a>)}</div>}
  </section>)}</div>
}

/* ---------- Tabs ---------- */
export function Tabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const prefix = useId().replaceAll(':', '')
  const [active, setActive] = useState('all')
  return (
    <div className="clinical-sections">
      <div className="section-controls">
        <button className={`btn sm ${active === 'all' ? 'primary' : ''}`} aria-pressed={active === 'all'} onClick={() => setActive(active === 'all' ? tabs[0]?.id : 'all')}>{active === 'all' ? 'Full guide' : 'Read full guide'} <span aria-hidden="true">☷</span></button>
        {active === 'all' && <label className="section-jump"><span className="sr-only">Jump to a section</span><select className="input" aria-label="Jump to a section" defaultValue="" onChange={(e) => { const node = document.getElementById(e.target.value); node?.scrollIntoView({ block: 'start', behavior: 'smooth' }); node?.focus({ preventScroll: true }); e.target.value = '' }}><option value="" disabled>Jump to section…</option>{tabs.map((t) => <option key={t.id} value={`${prefix}-panel-${t.id}`}>{t.label}</option>)}</select></label>}
      </div>
      {active !== 'all' && <div className="tabs" role="tablist" aria-label="Clinical sections">
        {tabs.map((t) => <button key={t.id} id={`${prefix}-tab-${t.id}`} role="tab" aria-controls={`${prefix}-panel-${t.id}`} aria-selected={t.id === active} tabIndex={t.id === active ? 0 : -1} className={`tab ${t.id === active ? 'active' : ''}`} onClick={() => setActive(t.id)} onKeyDown={(e) => { const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (dir || e.key === 'Home' || e.key === 'End') { e.preventDefault(); const index = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (tabs.findIndex((x) => x.id === t.id) + dir + tabs.length) % tabs.length; setActive(tabs[index].id); document.getElementById(`${prefix}-tab-${tabs[index].id}`)?.focus() } }}>{t.label}</button>)}
      </div>}
      {tabs.map((t) => <section key={t.id} className="tab-panel" id={`${prefix}-panel-${t.id}`} role={active === 'all' ? 'region' : 'tabpanel'} aria-labelledby={active === 'all' ? `${prefix}-heading-${t.id}` : `${prefix}-tab-${t.id}`} tabIndex={-1} hidden={active !== 'all' && t.id !== active}><h2 id={`${prefix}-heading-${t.id}`} className="section-h">{t.label}</h2>{t.content}</section>)}
    </div>
  )
}

/* ---------- Accordion ---------- */
export function Accordion({ title, children, defaultOpen }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="acc" open={defaultOpen}>
      <summary>{title}</summary>
      <div className="acc-body">{children}</div>
    </details>
  )
}

/* ---------- Status badge ---------- */
const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  draft: { label: 'DRAFT', cls: '' }, review: { label: 'IN REVIEW', cls: 'warn' },
  'clinically-verified': { label: 'CLINICALLY VERIFIED', cls: 'ok' }, published: { label: 'PUBLISHED', cls: 'ok' },
  outdated: { label: 'OUTDATED', cls: 'danger' }, archived: { label: 'ARCHIVED', cls: '' },
}
export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] || { label: status.toUpperCase(), cls: '' }
  return <span className={`badge ${s.cls}`}>{s.label}</span>
}
