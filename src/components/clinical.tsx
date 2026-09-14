import { useState, type ReactNode } from 'react'
import { getSource } from '../content/sources'
import type { Block, AlgorithmNode } from '../content/types'

/* ---------- Source badge ---------- */
export function SourceBadge({ id }: { id?: string }) {
  if (!id) return null
  const s = getSource(id)
  if (!s) return <span className="badge">{id}</span>
  const tone = s.status === 'verified-live' ? 'ok' : s.status === 'outdated' ? 'danger' : 'warn'
  return (
    <a className={`badge src`} href={s.url} target="_blank" rel="noreferrer" title={`${s.title} — ${s.dateChecked || 'not checked'}`}>
      {s.organisation}{s.version ? ` · ${s.version}` : ''}
      <span className={`badge ${tone}`}>{s.status === 'verified-live' ? 'verified' : s.status === 'outdated' ? 'OUTDATED' : 'pending check'}</span>
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
    case 'text': return <p style={{ fontSize: 14 }}>{b.text}</p>
    case 'list': return b.ordered ? <ol style={{ fontSize: 14, paddingLeft: 20 }}>{b.items.map((x, i) => <li key={i} style={{ margin: '3px 0' }}>{x}</li>)}</ol> : <ul style={{ fontSize: 14, paddingLeft: 20 }}>{b.items.map((x, i) => <li key={i} style={{ margin: '3px 0' }}>{x}</li>)}</ul>
    case 'table':
      return (
        <div style={{ overflowX: 'auto' }}>
          {b.caption && <div className="small muted" style={{ marginBottom: 4 }}>{b.caption}</div>}
          <table className="clinical"><thead><tr>{b.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
        </div>
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

/* ---------- Algorithm renderer ---------- */
export function AlgorithmFlow({ nodes }: { nodes: AlgorithmNode[] }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
  const visited = new Set<string>()
  const seq = (id?: string): ReactNode[] => {
    if (!id || visited.has(id)) return []
    const node = byId[id]; if (!node) return []
    visited.add(id)
    const out: ReactNode[] = [
      <div key={node.id} className={`flow-node ${node.type === 'decision' ? 'decision' : ''} ${node.tone ? `tone-${node.tone}` : ''}`}>
        {node.type === 'decision' ? <>◆ {node.label}</> : node.label}
        {node.detail && <span className="detail">{node.detail}</span>}
      </div>,
    ]
    const nexts = node.next || []
    for (const n of nexts) {
      out.push(<div key={`${node.id}->${n.to}`} className="flow-arrow">↓{n.edgeLabel && <span>{n.edgeLabel}</span>}</div>)
      out.push(...seq(n.to))
    }
    return out
  }
  return <div className="flow">{seq(nodes[0]?.id)}</div>
}

/* ---------- Tabs ---------- */
export function Tabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id)
  return (
    <div>
      <div className="tabs" role="tablist">
        {tabs.map((t) => <button key={t.id} role="tab" aria-selected={t.id === active} className={`tab ${t.id === active ? 'active' : ''}`} onClick={() => setActive(t.id)}>{t.label}</button>)}
      </div>
      <div>{tabs.find((t) => t.id === active)?.content}</div>
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
