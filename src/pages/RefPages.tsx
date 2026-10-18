import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Link } from '../components/links'
import { useApp } from '../App'
import { Blocks, ClinicalTable, SourceBadge, StatusBadge } from '../components/clinical'
import { DOSE_CONFLICTS } from '../content/medication-regimens'
import { getSource } from '../content/sources'
import { getPage } from '../lib/seo'

function referencePath(id: string) {
  return getPage(`/topic/${id}`)?.path || getPage(`/emergency/${id}`)?.path
}

/* ---------------- Drugs ---------------- */
export function DrugsPage() {
  const { data } = useApp()
  const { id } = useParams()
  const loc = useLocation()
  const [q, setQ] = useState('')
  useEffect(() => { setQ(new URLSearchParams(loc.hash.slice(1)).get('q') || '') }, [loc.hash])
  const cats = useMemo(() => [...new Set((data?.drugs || []).map((d) => d.dbCategory))].sort(), [data])
  const [cat, setCat] = useState('')
  if (!data) return <p className="muted">Loading…</p>
  const selected = data.drugs.find((d) => d.id === id)
  const list = data.drugs.filter((d) => id ? d.id === id : (!cat || d.dbCategory === cat) && (!q || `${d.name} ${d.drugClass} ${d.indications.join(' ')}`.toLowerCase().includes(q.toLowerCase())))
  return (
    <div>
      {id && <p className="small"><Link to="/drugs">← All drug references</Link></p>}
      <h1>{selected?.name || 'Drug database'}</h1>
      <p className="small muted">Pregnancy & gynaecology-specific. Every dose row is source-referenced; verify against institutional protocols.</p>
      {!id && <div className="row" style={{ margin: '14px 0' }}>
        <input className="input" aria-label="Search drug or drug class" style={{ maxWidth: 320 }} placeholder="Search drug / class…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" aria-label="Drug category" style={{ maxWidth: 240 }} value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{cats.map((c) => <option key={c}>{c}</option>)}</select>
        <span className="small muted">{list.length}</span>
      </div>}
      <div style={{ display: 'grid', gap: 12 }}>
        {list.map((d) => (
          <details key={d.id} className="acc" open={!!id}>
            <summary><span className="row">{d.name}{d.emergencyKit && <span className="badge danger">EMERGENCY KIT</span>}<span className="badge">{d.drugClass}</span></span></summary>
            <div className="acc-body">
              {!id && <p><Link to={`/drug/${d.id}`}>Open {d.name} reference →</Link></p>}
              {!id && <p className="small">Indications: {d.indications.join(' · ')}</p>}
              {DOSE_CONFLICTS[d.id] && <Blocks blocks={DOSE_CONFLICTS[d.id]} />}
              {d.id === 'nifedipine' && <Blocks blocks={DOSE_CONFLICTS.nifedipineMagnesium} />}
              {d.regimenCheckedAt && <p className="small muted">Regimens checked: {d.regimenCheckedAt}. Each indication has its own preparation, limits and safety checks.</p>}
              <ClinicalTable caption={`${d.name}: indication-specific regimens`} headers={['Indication', 'Dose', 'Route', 'Frequency', 'Duration / preparation', 'Maximum', 'Monitoring / cautions']} rows={d.doseRows.map((r) => [<>{r.indication}{r.sourceId && <div style={{ marginTop: 8 }}><SourceBadge id={r.sourceId} /></div>}</>, <b>{r.dose}</b>, r.route, r.frequency ?? 'Not recorded', <>{[r.duration, r.preparation].filter(Boolean).join(' · ')}{r.notes?.length ? <ul>{r.notes.map((n, j) => <li key={j}>{n}</li>)}</ul> : null}</>, r.max ?? 'Not recorded', <>{r.monitoring?.length ? <><b>Monitor</b><ul>{r.monitoring.map((n, j) => <li key={j}>{n}</li>)}</ul></> : null}{r.contraindications?.length ? <><b>Contraindications / cautions</b><ul>{r.contraindications.map((n, j) => <li key={j}>{n}</li>)}</ul></> : null}</>])} />
              <div className="kv-grid small">
                <div className="kv"><div className="k">Pregnancy safety</div><div className="v" style={{ fontSize: 12.5 }}>{d.pregnancySafety}</div></div>
                <div className="kv"><div className="k">Lactation</div><div className="v" style={{ fontSize: 12.5 }}>{d.lactation}</div></div>
                {d.trimesterNotes && <div className="kv"><div className="k">Trimester notes</div><div className="v">{d.trimesterNotes}</div></div>}
                {d.contraindications?.length && !d.doseRows.some((r) => r.contraindications?.length) ? <div className="kv"><div className="k">Contraindications</div><div className="v" style={{ fontSize: 12.5 }}>{d.contraindications.join('; ')}</div></div> : null}
                {d.monitoring?.length && !d.doseRows.some((r) => r.monitoring?.length) ? <div className="kv"><div className="k">Monitoring</div><div className="v" style={{ fontSize: 12.5 }}>{d.monitoring.join('; ')}</div></div> : null}
                {d.renalHepatic ? <div className="kv"><div className="k">Renal/hepatic</div><div className="v" style={{ fontSize: 12.5 }}>{d.renalHepatic}</div></div> : null}
                {d.interactions?.length ? <div className="kv"><div className="k">Interactions</div><div className="v">{d.interactions.join('; ')}</div></div> : null}
                {d.adverseEffects?.length ? <div className="kv"><div className="k">Adverse effects</div><div className="v">{d.adverseEffects.join('; ')}</div></div> : null}
              </div>
              <div className="row" style={{ marginTop: 10 }}><SourceBadge id={d.sourceId} /><StatusBadge status={d.status} /></div>
              {!d.regimenCheckedAt && <p className="small muted">Clinical verification date not recorded for this drug entry.</p>}
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
  const { id } = useParams()
  const selected = data.calculators.find((c) => c.id === id)
  return (
    <div>
      {id && <p className="small"><Link to="/calculators">← All calculators</Link></p>}
      <h1>{selected?.name || 'Clinical calculators'}</h1>
      <p className="small muted">Validated formulas only — every calculator lists its formula and source.</p>
      <div style={{ display: 'grid', gap: 16 }}>
        {(data?.calculators || []).filter((c) => !id || c.id === id).map((c) => <CalcCard key={c.id} c={c} />)}
      </div>
    </div>
  )
}
function CalcCard({ c }: { c: import('../content/types').CalculatorDef }) {
  const id = `calc-${c.id}`
  const [vals, setVals] = useState<Record<string, string>>({})
  const result = useMemo(() => { if (!Object.values(vals).some(Boolean)) return null; try { return c.compute(vals) } catch { return null } }, [c, vals])
  return (
    <div className="card card-pad" id={id}>
      <div className="spread">
        <h3 style={{ margin: 0 }}><Link to={`/calculator/${c.id}`}>{c.name}</Link></h3>
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
              : <input className="input" style={{ marginTop: 4 }} type={inp.type === 'date' ? 'date' : inp.type === 'number' ? 'number' : 'text'} inputMode={inp.type === 'number' ? 'decimal' : undefined} step={inp.step} min={inp.min} max={inp.max} placeholder={inp.placeholder} value={vals[inp.name] || ''} onChange={(e) => setVals({ ...vals, [inp.name]: e.target.value })} />}
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
  const { id } = useParams()
  if (!data?.ddx.length) return <p className="muted">No presentations loaded.</p>
  const p = data.ddx.find((x) => x.id === id) || data.ddx[0]
  const prioCls = (pr: string) => pr === 'cannot-miss' ? 'danger' : pr === 'common' ? '' : 'warn'
  return (
    <div>
      {id && <p className="small"><Link to="/ddx">← All presentations</Link></p>}
      <h1>{id ? p.presentation : 'Differential-diagnosis engine'}</h1>
      <div className="row" style={{ margin: '12px 0 18px', flexWrap: 'wrap' }}>
        {data.ddx.map((x) => <Link key={x.id} className={`btn sm ${x.id === p.id ? 'primary' : ''}`} to={`/ddx/${x.id}`}>{x.presentation}</Link>)}
      </div>
      <div className="block-warning"><b>Immediate red flags:</b><ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>{p.redFlagsImmediate.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
      <div className="card card-pad" style={{ margin: '14px 0' }}>
        <b>Urgent workup:</b><ul style={{ paddingLeft: 20, margin: '6px 0 0' }}>{p.urgentWorkup.map((w, i) => <li key={i}>{w}</li>)}</ul>
      </div>
      <h2 className="section-h">Structured differential — act in priority order</h2>
      <ClinicalTable headers={['Priority', 'Condition', 'Key features', 'Action']} rows={p.differential.map((d) => [<span className={`badge ${prioCls(d.priority)}`}>{d.priority === 'cannot-miss' ? 'CANNOT MISS' : d.priority.toUpperCase()}</span>, <b>{d.condition}</b>, d.keyFeatures, d.topicRef && referencePath(d.topicRef) ? <Link to={referencePath(d.topicRef)!}>{d.action} →</Link> : d.action])} />
      <h2 className="section-h">First moves</h2>
      <ol className="steps-list">{p.firstMoves.map((m, i) => <li key={i}>{m}</li>)}</ol>
    </div>
  )
}

/* ---------------- Procedures ---------------- */
export function ProceduresPage() {
  const { data } = useApp()
  const { id } = useParams()
  const selected = data.procedures.find((p) => p.id === id)
  return (
    <div>
      {id && <p className="small"><Link to="/procedures">← All procedures</Link></p>}
      <h1>{selected?.title || 'Procedures & operative gynaecology'}</h1>
      <div style={{ display: 'grid', gap: 12 }}>
        {(data?.procedures || []).filter((p) => !id || p.id === id).map((p) => (
          <details key={p.id} className="acc" id={p.id} open={!!id}>
            <summary><span>{p.title} <span className="badge">{p.setting}</span></span></summary>
            <div className="acc-body">
              {!id && <p><Link to={`/procedure/${p.id}`}>Open {p.title} reference →</Link></p>}
              <div className="badges"><StatusBadge status={p.status} /><span className="badge">{p.lastVerifiedAt ? `Last clinically verified ${p.lastVerifiedAt}` : 'PENDING CLINICAL VERIFICATION'}</span></div>
              <div className="grid-cards" style={{ margin: '8px 0' }}>
                <div className="card card-pad"><b>Indications</b><ul style={{ paddingLeft: 18, margin: '6px 0 0' }}>{p.indications.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
                <div className="card card-pad"><b>Consent points</b><ul style={{ paddingLeft: 18, margin: '6px 0 0' }}>{p.consentPoints.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
                <div className="card card-pad"><b>Equipment</b><ul style={{ paddingLeft: 18, margin: '6px 0 0' }}>{p.equipment.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
                <div className="card card-pad"><b>Anaesthesia</b><ul style={{ paddingLeft: 18, margin: '6px 0 0' }}>{p.anaesthesia.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              </div>
              {!!p.absoluteContraindications?.length && <p className="block-warning"><b>Absolute contraindications:</b> {p.absoluteContraindications.join(' · ')}</p>}
              {!!p.relativeContraindications?.length && <p className="small"><b>Relative contraindications:</b> {p.relativeContraindications.join(' · ')}</p>}
              {!!p.preparation.length && <><h2 className="section-h">Preparation</h2><ul>{p.preparation.map((s, i) => <li key={i}>{s}</li>)}</ul></>}
              <b>Procedure steps</b>
              <ol className="steps-list">{p.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              {p.intraOpTroubleshooting?.length ? <div className="block-info"><b>Troubleshooting:</b><ul style={{ paddingLeft: 18, margin: '4px 0 0' }}>{p.intraOpTroubleshooting.map((x, i) => <li key={i}>{x}</li>)}</ul></div> : null}
              <b>Complications & management</b>
              {p.complications.map((cc, i) => (
                <details key={i} className="acc"><summary>{cc.name}</summary><div className="acc-body"><Blocks blocks={cc.management} /></div></details>
              ))}
              {!!p.postopCare.length && <><h2 className="section-h">Postoperative care</h2><ul>{p.postopCare.map((s, i) => <li key={i}>{s}</li>)}</ul></>}
              <div className="row small muted" style={{ marginTop: 10 }}>Follow-up: {p.followUp.join(' · ')} · Sources: {p.sourceIds.map((s) => getSource(s)?.organisation).filter(Boolean).join(', ')}</div>
              <div className="row">{p.sourceIds.map((s) => <SourceBadge key={s} id={s} />)}</div>
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
      <input className="input" aria-label="Filter guidelines and sources" style={{ maxWidth: 380, margin: '12px 0' }} placeholder="Filter…" value={q} onChange={(e) => setQ(e.target.value)} />
      <ClinicalTable headers={['Organisation', 'Title', 'Version / date', 'Checked', 'Status', 'Reference']} rows={sources.map((s) => [<><b>{s.organisation}</b><br /><span className="muted small">{s.region}</span></>, <>{s.title}<br /><span className="muted small">{s.usedBySections.length} module(s)</span>{s.checkedAgainst && <details className="source-scope"><summary>Scope of check</summary><p>{s.checkedAgainst}</p></details>}</>, <>{s.publishedDate}{s.lastUpdatedDate ? ` · updated ${s.lastUpdatedDate}` : ''}<br /><span className="muted">{s.version}</span></>, s.dateChecked ?? 'Not recorded', <span className={`badge ${tone(s.status)}`}>{s.status.replace('verified-', 'verified ')}</span>, <a href={s.url} target="_blank" rel="noreferrer" className="btn sm">Open source ↗</a>])} />
    </div>
  )
}
