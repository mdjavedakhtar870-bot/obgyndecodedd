import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../App'
import { favs, recents } from '../lib/app'
import { Accordion, AlgorithmFlow, Blocks, SourceBadge, StatusBadge, Tabs } from '../components/clinical'
import { CATEGORY_LABELS } from '../content'
import { getSource } from '../content/sources'
import type { Block, DiseaseTopic, TreatmentEngine } from '../content/types'

/* ---------------- Browse ---------------- */
export function BrowsePage() {
  const { data } = useApp()
  const [q, setQ] = useState(''); const [cat, setCat] = useState('')
  if (!data) return <p className="muted">Loading…</p>
  const cats = [...new Set(data.topics.map((t) => t.category))]
  const list = data.topics.filter((t) =>
    (!cat || t.category === cat) && (!q || `${t.title} ${t.tags.join(' ')} ${(t.aliases || []).join(' ')}`.toLowerCase().includes(q.toLowerCase())))
  return (
    <div>
      <h1>Browse clinical topics</h1>
      <div className="row" style={{ margin: '12px 0 18px' }}>
        <input className="input" style={{ maxWidth: 320 }} placeholder="Filter topics…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" style={{ maxWidth: 260 }} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {cats.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>)}
        </select>
        <span className="small muted">{list.length} topics</span>
      </div>
      <div className="grid-cards">
        {list.map((t) => (
          <Link key={t.id} className="tile" to={`/topic/${t.id}`}>
            <div className="spread"><h3>{t.title}</h3><StatusBadge status={t.status} /></div>
            <p>{CATEGORY_LABELS[t.category]} · v{t.version}{t.lastVerifiedAt ? ` · verified ${t.lastVerifiedAt}` : ' · pending verification'}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Topic page (treatment engine UI) ---------------- */
const TE_SECTIONS: { id: keyof TreatmentEngine; label: string }[] = [
  { id: 'immediateStabilization', label: 'Immediate stabilization' },
  { id: 'initialAssessment', label: 'Initial assessment' },
  { id: 'investigations', label: 'Investigations' },
  { id: 'firstLine', label: 'First-line treatment' },
  { id: 'alternativesFirstLine', label: 'Alternatives first-line' },
  { id: 'nonDrugTreatment', label: 'Non-drug treatment' },
  { id: 'definitiveTreatment', label: 'Definitive treatment' },
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'responseAssessment', label: 'Response assessment' },
  { id: 'treatmentFailure', label: 'Treatment failure' },
  { id: 'secondLine', label: 'Second-line treatment' },
  { id: 'rescue', label: 'Rescue treatment' },
  { id: 'procedures', label: 'Procedure / surgery' },
  { id: 'escalation', label: 'Escalation' },
  { id: 'complications', label: 'Complications' },
  { id: 'postTreatmentCare', label: 'Post-treatment care' },
]

function TreatmentEngineView({ topic }: { topic: DiseaseTopic }) {
  const te = topic.treatment
  if (!te) return <p className="muted">Treatment section pending authoring for this module.</p>
  return (
    <div>
      <Accordion title="① Immediate stabilization — first minutes" defaultOpen>
        <Blocks blocks={te.immediateStabilization as Block[] | undefined} />
      </Accordion>
      {(te.initialAssessment || te.investigations) && (
        <Accordion title="② Assessment & investigations">
          <Blocks blocks={te.initialAssessment as Block[] | undefined} />
          <Blocks blocks={te.investigations as unknown as Block[] | undefined} />
        </Accordion>
      )}
      <Accordion title="③ First-line treatment & drug regimens" defaultOpen>
        <Blocks blocks={te.firstLine as Block[]} />
        <Blocks blocks={te.alternativesFirstLine as Block[] | undefined} />
      </Accordion>
      {!!te.drugTreatment?.length && (
        <Accordion title={`④ Drug treatment detail (${te.drugTreatment.length} agents)`}>
          {te.drugTreatment.map((d, i) => (
            <div key={i}>
              <Blocks blocks={[{ kind: 'doseCard', drug: d.drug, dose: d.dose, route: d.route, frequency: d.frequency, duration: d.duration, prep: d.preparation, maxDose: d.maxDose, notes: d.adverseEffects, contraindications: d.contraindications, sourceId: d.sourceId } as never]} />
              {d.monitoring?.length ? <p className="small muted">Monitoring: {d.monitoring.join(' · ')}</p> : null}
            </div>
          ))}
        </Accordion>
      )}
      {TE_SECTIONS.filter((s) => !['immediateStabilization', 'initialAssessment', 'investigations', 'firstLine', 'alternativesFirstLine'].includes(s.id)).map((s) => {
        const val = te[s.id]
        if (!val || (Array.isArray(val) && val.length === 0)) return null
        if (s.id === 'complications') {
          return (
            <Accordion key={s.id} title={`⑮ Complications & their management`}>
              {(val as { name: string; management?: Block[] }[]).map((c, i) => (
                <Accordion key={i} title={c.name}><Blocks blocks={c.management} /></Accordion>
              ))}
            </Accordion>
          )
        }
        return <Accordion key={s.id} title={`${s.label}`}><Blocks blocks={val as Block[] | undefined} /></Accordion>
      })}
    </div>
  )
}

export function TopicPage() {
  const { id } = useParams()
  const { data } = useApp()
  recents.push(id || '')
  const topic = data?.topics.find((t) => t.id === id)
  if (!data || !topic) return <p className="muted">Loading / topic not found.</p>
  const isFav = favs.has(topic.id)
  const relatedEmergencies = data.emergencies.filter((e) => e.topicRef === topic.id)

  const tabs = [
    topic.treatment && { id: 'tx', label: 'Treatment', content: <TreatmentEngineView topic={topic} /> },
    topic.classificationTable && {
      id: 'class', label: 'Classification',
      content: (
        <table className="clinical">
          {topic.classificationTable.caption && <caption style={{ captionSide: 'top', textAlign: 'left', fontSize: 12.5, color: 'var(--ink-3)', paddingBottom: 4 }}>{topic.classificationTable.caption}</caption>}
          <thead><tr>{topic.classificationTable.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
          <tbody>{topic.classificationTable.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
        </table>
      ),
    },
    (topic.initialAssessment || topic.presentation || topic.riskFactors || topic.differentials) && {
      id: 'dx', label: 'Diagnosis & assessment',
      content: (
        <>
          {topic.redFlags?.length ? <div className="block-warning"><b>Red flags:</b><ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>{topic.redFlags.map((r, i) => <li key={i}>{r}</li>)}</ul></div> : null}
          {topic.definition && <p style={{ fontSize: 14 }}><b>Definition:</b> {topic.definition}</p>}
          {topic.riskFactors && <><h3 style={{ marginTop: 14 }}>Risk factors</h3><div className="row">{topic.riskFactors.map((r) => <span key={r} className="badge">{r}</span>)}</div></>}
          {topic.presentation && <><h3 style={{ marginTop: 14 }}>Presentation</h3><Blocks blocks={[{ kind: 'list', items: topic.presentation }]} /></>}
          {topic.initialAssessment && <><h3 style={{ marginTop: 14 }}>Initial assessment</h3><Blocks blocks={topic.initialAssessment} /></>}
          {topic.investigations && <><h3 style={{ marginTop: 14 }}>Investigations</h3><table className="clinical"><thead><tr><th>Test</th><th>Looking for</th></tr></thead><tbody>{topic.investigations.map((iv, i) => iv && typeof iv === 'object' && 'test' in (iv as object) ? <tr key={i}><td><b>{(iv as { test: string }).test}</b></td><td>{(iv as { lookingFor: string }).lookingFor}</td></tr> : null)}</tbody></table></>}
          {topic.differentials && <><h3 style={{ marginTop: 14 }}>Differential diagnosis</h3><table className="clinical"><thead><tr><th>Condition</th><th>Clue</th></tr></thead><tbody>{topic.differentials.map((d, i) => <tr key={i}><td>{d.condition}</td><td>{d.clue}</td></tr>)}</tbody></table></>}
        </>
      ),
    },
    topic.algorithm && { id: 'algo', label: 'Algorithm', content: <AlgorithmFlow nodes={topic.algorithm} /> },
    (topic.managementPrinciples || topic.specialSituations || topic.followUp || topic.prevention) && {
      id: 'extra', label: 'Principles & follow-up',
      content: (
        <>
          {topic.managementPrinciples && <Accordion title="Management principles" defaultOpen><Blocks blocks={topic.managementPrinciples} /></Accordion>}
          {topic.specialSituations && <Accordion title="Special situations"><Blocks blocks={topic.specialSituations} /></Accordion>}
          {topic.prevention && <Accordion title="Prevention"><Blocks blocks={topic.prevention} /></Accordion>}
          {topic.followUp && <Accordion title="Follow-up"><Blocks blocks={topic.followUp} /></Accordion>}
          {topic.patientEducation && <Accordion title="Patient education"><Blocks blocks={topic.patientEducation} /></Accordion>}
        </>
      ),
    },
    {
      id: 'src', label: `Sources (${topic.sourceIds.length})`,
      content: (
        <div>
          {topic.sourceIds.map((sid) => { const s = getSource(sid); return s ? (
            <div key={sid} className="card card-pad small" style={{ marginBottom: 10 }}>
              <b>{s.organisation}</b> — {s.title}<br />
              <span className="muted">{s.publishedDate}{s.lastUpdatedDate ? ` · updated ${s.lastUpdatedDate}` : ''} · checked {s.dateChecked} · {s.status}</span><br />
              <a href={s.url} target="_blank" rel="noreferrer">Open source ↗</a>
              {s.checkedAgainst && <p className="muted" style={{ marginBottom: 0 }}>{s.checkedAgainst.slice(0, 300)}{s.checkedAgainst.length > 300 ? '…' : ''}</p>}
            </div>
          ) : <span key={sid} className="badge warn">{sid} — registry entry missing</span> })}
        </div>
      ),
    },
  ].filter(Boolean) as { id: string; label: string; content: React.ReactNode }[]

  return (
    <article>
      <div className="spread">
        <div>
          <span className="small muted">{CATEGORY_LABELS[topic.category]}</span>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{topic.title}</h1>
        </div>
        <button className="icon-btn" style={{ width: 42, height: 42 }} onClick={() => favs.toggle(topic.id)} title="Favourite">{isFav ? '★' : '☆'}</button>
      </div>
      <div className="badges" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <StatusBadge status={topic.status} />
        <span className="badge">v{topic.version}</span>
        <span className={`badge ${topic.regionPriority === 'india-first' ? 'accent' : ''}`}>
          {topic.regionPriority === 'india-first' ? '🇮🇳 India-first' : '🌍 International reference'}
        </span>
        <span className="badge">{topic.lastVerifiedAt ? `Last clinically verified ${topic.lastVerifiedAt}` : 'PENDING CLINICAL VERIFICATION'}</span>
        {relatedEmergencies.map((e) => <Link key={e.id} to={`/emergency/${e.id}`} className="badge danger">⚡ {e.title}</Link>)}
      </div>
      <div className="block-info">{topic.summary}</div>
      {topic.reviewerNote && <div className="block-warning"><b>Reviewer note:</b> {topic.reviewerNote}</div>}
      <Tabs tabs={tabs} />
    </article>
  )
}
