import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../App'
import { SourceBadge, StatusBadge } from '../components/clinical'
import { getSource } from '../content/sources'

/* ---------------- Drugs ---------------- */
export function DrugsPage() {
  const { data } = useApp()
  const [q, setQ] = useState(() => new URLSearchParams(location.hash.slice(1)).get('q') || '')
  const cats = useMemo(() => [...new Set((data?.drugs || []).map((d) => d.dbCategory))].sort(), [data])
  const [cat, setCat] = useState('')
  if (!data) return <p className="muted">Loading…</p>
  const list = data.drugs.filter((d) => (!cat || d.dbCategory === cat) && (!q || `${d.name} ${d.drugClass} ${d.indications.join(' ')}`.toLowerCase().includes(q.toLowerCase())))
  return (
    <div>
      <h1>Drug database</h1>
      <p className="small muted">Pregnancy & gynaecology-specific. Every dose row is source-referenced; verify against institutional protocols.</p>
      <div className="row" style={{ margin: '14px 0' }}>
        <input className="input" style={{ maxWidth: 320 }} placeholder="Search drug / class…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" style={{ maxWidth: 240 }} value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{cats.map((c) => <option key={c}>{c}</option>)}</select>
        <span className="small muted">{list.length}</span>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {list.map((d) => (
          <details key={d.id} className="acc">
            <summary><span className="row">{d.name}{d.emergencyKit && <span className="badge danger">EMERGENCY KIT</span>}<span className="badge">{d.drugClass}</span></span></summary>
            <div className="acc-body">
              <table className="clinical"><thead><tr><th>Indication</th><th>Dose</th><th>Route</th><th>Frequency</th><th>Duration/Prep</th><th>Max</th></tr></thead>
                <tbody>{d.doseRows.map((r, i) => <tr key={i}><td>{r.indication}</td><td><b>{r.dose}</b></td><td>{r.route}</td><td>{r.frequency ?? '-'}</td><td>{[r.duration, r.preparation].filter(Boolean).join(' · ')}</td><td>{r.max ?? '-'}</td></tr>)}</tbody></table>
              <div className="kv-grid small">
                <div className="kv"><div className="k">Pregnancy safety</div><div className="v" style={{ fontSize: 12.5 }}>{d.pregnancySafety}</div></div>
                <div className="kv"><div className="k">Lactation</div><div className="v" style={{ fontSize: 12.5 }}>{d.lactation}</div></div>
                {d.contraindications?.length ? <div className="kv"><div className="k">Contraindications</div><div className="v" style={{ fontSize: 12.5 }}>{d.contraindications.join('; ')}</div></div> : null}
                {d.monitoring?.length ? <div className="kv"><div className="k">Monitoring</div><div className="v" style={{ fontSize: 12.5 }}>{d.monitoring.join('; ')}</div></div> : null}
                {d.renalHepatic ? <div className="kv"><div className="k">Renal/hepatic</div><div className="v" style={{ fontSize: 12.5 }}>{d.renalHepatic}</div></div> : null}
              </div>
              <div className="row" style={{ marginTop: 10 }}><SourceBadge id={d.sourceId} /><StatusBadge status={d.status} /></div>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Calculators ---------------- */
export function CalculatorsPage() {
  const { data } = useApp()
  return (
    <div>
      <h1>Clinical calculators</h1>
      <p className="small muted">Validated formulas only — every calculator lists its formula and source.</p>
      <div style={{ display: 'grid', gap: 16 }}>
        {(data?.calculators || []).map((c) => <CalcCard key={c.id} c={c} />)}
      </div>
    </div>
  )
}
function CalcCard({ c }: { c: import('../content/types').CalculatorDef }) {
  const id = `calc-${c.id}`
  const [vals, setVals] = useState<Record<string, string>>({})
  const result = useMemo(() => { try { return c.compute(vals) } catch { return null } }, [c, vals])
  return (
    <div className="card card-pad" id={id}>
      <div className="spread">
        <h3 style={{ margin: 0 }}>{c.name}</h3>
        <SourceBadge id={c.sourceId} />
      </div>
      <p className="small muted">{c.description}</p>
      <div className="kv-grid">
        {c.inputs.map((inp) => (
          <label key={inp.name} style={{ display: 'block' }}>
            <span className="small" style={{ fontWeight: 650 }}>{inp.label}{inp.unit ? ` (${inp.unit})` : ''}</span>
            {inp.type === 'select'
              ? <select className="input" style={{ marginTop: 4 }} value={vals[inp.name] || ''} onChange={(e) => setVals({ ...vals, [inp.name]: e.target.value })}>
                  <option value="">—</option>{inp.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              : <input className="input" style={{ marginTop: 4 }} type={inp.type === 'date' ? 'date' : inp.type === 'number' ? 'number' : 'text'} step={inp.step} value={vals[inp.name] || ''} onChange={(e) => setVals({ ...vals, [inp.name]: e.target.value })} />}
          </label>
        ))}
      </div>
      {result && (
        <div className={`block-${result.tone === 'danger' ? 'warning' : 'info'}`} style={{ marginTop: 14 }}>
          <b style={{ fontSize: 15 }}>{result.value}</b>
          {result.interpretation && <div className="small">{result.interpretation}</div>}
          {result.breakdown?.map((b, i) => <div key={i} className="small muted">· {b}</div>)}
        </div>
      )}
      <p className="small muted" style={{ marginBottom: 0 }}>Formula/source: {c.formulaAndSource}</p>
    </div>
  )
}

/* ---------------- DDx engine ---------------- */
export function DdxPage() {
  const { data } = useApp()
  const [sel, setSel] = useState(data?.ddx[0]?.id)
  if (!data?.ddx.length) return <p className="muted">No presentations loaded.</p>
  const p = data.ddx.find((x) => x.id === sel) || data.ddx[0]
  const prioCls = (pr: string) => pr === 'cannot-miss' ? 'danger' : pr === 'common' ? '' : 'warn'
  return (
    <div>
      <h1>Differential-diagnosis engine</h1>
      <div className="row" style={{ margin: '12px 0 18px', flexWrap: 'wrap' }}>
        {data.ddx.map((x) => <button key={x.id} className={`btn sm ${x.id === p.id ? 'primary' : ''}`} onClick={() => setSel(x.id)}>{x.presentation}</button>)}
      </div>
      <div className="block-warning"><b>Immediate red flags:</b><ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>{p.redFlagsImmediate.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
      <div className="card card-pad" style={{ margin: '14px 0' }}>
        <b>Urgent workup:</b><ul style={{ paddingLeft: 20, margin: '6px 0 0' }}>{p.urgentWorkup.map((w, i) => <li key={i}>{w}</li>)}</ul>
      </div>
      <h2 className="section-h">Structured differential — act in priority order</h2>
      <table className="clinical">
        <thead><tr><th></th><th>Condition</th><th>Key features</th><th>Action</th></tr></thead>
        <tbody>{p.differential.map((d, i) => (
          <tr key={i}>
            <td><span className={`badge ${prioCls(d.priority)}`}>{d.priority === 'cannot-miss' ? 'CANNOT MISS' : d.priority.toUpperCase()}</span></td>
            <td><b>{d.condition}</b></td><td>{d.keyFeatures}</td>
            <td>{d.topicRef ? <Link to={`/topic/${d.topicRef}`}>{d.action} →</Link> : d.action}</td>
          </tr>
        ))}</tbody>
      </table>
      <h2 className="section-h">First moves</h2>
      <ol className="steps-list">{p.firstMoves.map((m, i) => <li key={i}>{m}</li>)}</ol>
    </div>
  )
}

/* ---------------- Procedures ---------------- */
export function ProceduresPage() {
  const { data } = useApp()
  return (
    <div>
      <h1>Procedures & operative gynaecology</h1>
      <div style={{ display: 'grid', gap: 12 }}>
        {(data?.procedures || []).map((p) => (
          <details key={p.id} className="acc" id={p.id}>
            <summary><span>{p.title} <span className="badge">{p.setting}</span></span></summary>
            <div className="acc-body">
              <div className="grid-cards small" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', margin: '8px 0' }}>
                <div className="card card-pad"><b>Indications</b><ul style={{ paddingLeft: 18, margin: '6px 0 0' }}>{p.indications.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
                <div className="card card-pad"><b>Consent points</b><ul style={{ paddingLeft: 18, margin: '6px 0 0' }}>{p.consentPoints.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
                <div className="card card-pad"><b>Equipment</b><ul style={{ paddingLeft: 18, margin: '6px 0 0' }}>{p.equipment.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
                <div className="card card-pad"><b>Anaesthesia</b><ul style={{ paddingLeft: 18, margin: '6px 0 0' }}>{p.anaesthesia.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              </div>
              <b>Procedure steps</b>
              <ol className="steps-list">{p.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              {p.intraOpTroubleshooting?.length ? <div className="block-info"><b>Troubleshooting:</b><ul style={{ paddingLeft: 18, margin: '4px 0 0' }}>{p.intraOpTroubleshooting.map((x, i) => <li key={i}>{x}</li>)}</ul></div> : null}
              <b>Complications & management</b>
              {p.complications.map((cc, i) => (
                <details key={i} className="acc"><summary>{cc.name}</summary><div className="acc-body">{(cc.management || []).map((m, j) => m.kind === 'text' ? <p key={j} style={{ fontSize: 13.5 }}>{m.text}</p> : null)}</div></details>
              ))}
              <div className="row small muted" style={{ marginTop: 10 }}>Follow-up: {p.followUp.join(' · ')} · Sources: {p.sourceIds.map((s) => getSource(s)?.organisation).filter(Boolean).join(', ')}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Sources registry ---------------- */
export function SourcesPage() {
  const { data } = useApp()
  const [q, setQ] = useState('')
  const sources = (data?.sources as import('../content/sources').SourceEntry[] || []).filter((s) => !q || `${s.organisation} ${s.title} ${s.topic}`.toLowerCase().includes(q.toLowerCase()))
  const tone = (st: string) => st === 'verified-live' ? 'ok' : st === 'outdated' ? 'danger' : 'warn'
  return (
    <div>
      <h1>Guideline & source register</h1>
      <p className="small muted">Canonical clinical-source map. “Verified” = the implemented recommendations were checked against the source on the recorded date. Nothing is marked verified without that check.</p>
      <input className="input" style={{ maxWidth: 380, margin: '12px 0' }} placeholder="Filter…" value={q} onChange={(e) => setQ(e.target.value)} />
      <table className="admin-tbl card" style={{ padding: '6px 10px' }}>
        <thead><tr><th>Organisation</th><th>Title</th><th>Version/date</th><th>Checked</th><th>Status</th><th></th></tr></thead>
        <tbody>{sources.map((s) => (
          <tr key={s.id}>
            <td><b>{s.organisation}</b><br /><span className="muted small">{s.region}</span></td>
            <td>{s.title}<br /><span className="muted small">{s.usedBySections.length} module(s)</span></td>
            <td className="small">{s.publishedDate}{s.lastUpdatedDate ? ` · upd ${s.lastUpdatedDate}` : ''}{s.version ? <br /> : ''}<span className="muted">{s.version}</span></td>
            <td className="small">{s.dateChecked ?? '—'}</td>
            <td><span className={`badge ${tone(s.status)}`}>{s.status.replace('verified-', 'verified ')}</span></td>
            <td><a href={s.url} target="_blank" rel="noreferrer" className="btn sm">Open ↗</a></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}
