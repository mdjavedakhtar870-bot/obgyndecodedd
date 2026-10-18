import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from '../components/links'
import { useApp } from '../App'
import { favs, recents } from '../lib/app'
import { Accordion, AlgorithmFlow, Blocks, ClinicalTable, DrugUseCard, SourceBadge, StatusBadge, Tabs } from '../components/clinical'
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
        <input className="input" aria-label="Filter clinical topics" style={{ maxWidth: 320 }} placeholder="Filter topics…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" aria-label="Clinical category" style={{ maxWidth: 260 }} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {cats.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>)}
        </select>
        <span className="small muted">{list.length} topics</span>
      </div>
      <div className="grid-cards">
        {list.map((t) => (
          <Link key={t.id} className="tile" to={`/topic/${t.id}`}>
            <div className="spread"><h3>{t.title}</h3><StatusBadge status={t.status} /></div>
            <p>{t.summary}</p>
            <span className="small muted">{CATEGORY_LABELS[t.category]} · {t.lastVerifiedAt ? `verified ${t.lastVerifiedAt}` : 'pending verification'}</span>
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
          {te.drugTreatment.map((d, i) => <DrugUseCard key={i} drug={d} />)}
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
  const [isFav, setIsFav] = useState(false)
  useEffect(() => { if (id) { recents.push(id); setIsFav(favs.has(id)) } }, [id])
  const topic = data?.topics.find((t) => t.id === id)
  if (!data || !topic) return <p className="muted">Loading / topic not found.</p>
  const relatedEmergencies = data.emergencies.filter((e) => e.topicRef === topic.id)

  const tabs = [
    topic.clinicalDetail && { id: 'detail', label: 'Clinical detail', content: <>
      <p className="review-scope">Additional detail checked {topic.clinicalDetail.checkedAt} against the linked sources. This check covers the section below; the rest of the module retains its displayed verification status.</p>
      <p className="clinical-copy">{topic.clinicalDetail.overview}</p>
      {topic.clinicalDetail.blocks?.some((b) => b.kind === 'table' && b.id) && <nav className="row" aria-label="Clinical detail sections" style={{ marginBottom: 16 }}>
        {topic.clinicalDetail.blocks.filter((b): b is Extract<Block, { kind: 'table' }> => b.kind === 'table' && !!b.id).map((b) => <a key={b.id} className="btn sm" href={`#${b.id}`}>{b.caption?.split('·')[0].trim()}</a>)}
      </nav>}
      <Blocks blocks={topic.clinicalDetail.blocks} />
      {[
        ['Assessment & interpretation', topic.clinicalDetail.assessment],
        ['Decisions that change management', topic.clinicalDetail.decisions],
        ['Follow-up & safety-netting', topic.clinicalDetail.followUp],
        ['Clinical pitfalls', topic.clinicalDetail.pitfalls],
      ].map(([heading, items]) => Array.isArray(items) && items.length ? <div className="clinical-detail" key={String(heading)}><h3>{String(heading)}</h3><Blocks blocks={[{ kind: 'list', items }]} /></div> : null)}
      <div className="source-line"><span className="small muted">Sources for this detail:</span><div className="row">{topic.clinicalDetail.sourceIds.map((sid) => <SourceBadge key={sid} id={sid} />)}</div></div>
    </> },
    topic.treatment && { id: 'tx', label: 'Treatment', content: <TreatmentEngineView topic={topic} /> },
    topic.classificationTable && {
      id: 'class', label: 'Classification',
      content: (
        <ClinicalTable {...topic.classificationTable} />
      ),
    },
    (topic.definition || topic.redFlags || topic.investigations || topic.initialAssessment || topic.presentation || topic.riskFactors || topic.differentials) && {
      id: 'dx', label: 'Diagnosis & assessment',
      content: (
        <>
          {topic.redFlags?.length ? <div className="block-warning"><b>Red flags:</b><ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>{topic.redFlags.map((r, i) => <li key={i}>{r}</li>)}</ul></div> : null}
          {topic.definition && <p><b>Definition:</b> {topic.definition}</p>}
          {topic.riskFactors && <><h3 style={{ marginTop: 14 }}>Risk factors</h3><div className="row">{topic.riskFactors.map((r) => <span key={r} className="badge">{r}</span>)}</div></>}
          {topic.presentation && <><h3 style={{ marginTop: 14 }}>Presentation</h3><Blocks blocks={[{ kind: 'list', items: topic.presentation }]} /></>}
          {topic.initialAssessment && <><h3 style={{ marginTop: 14 }}>Initial assessment</h3><Blocks blocks={topic.initialAssessment} /></>}
          {topic.investigations?.some((iv) => 'test' in iv) && <><h3 style={{ marginTop: 14 }}>Investigations</h3><ClinicalTable headers={['Test', 'Looking for']} rows={topic.investigations.filter((iv) => 'test' in iv).map((iv) => [<b>{'test' in iv ? iv.test : ''}</b>, 'lookingFor' in iv ? iv.lookingFor : ''])} /></>}
          <Blocks blocks={topic.investigations?.filter((iv): iv is Block => 'kind' in iv)} />
          {topic.differentials && <><h3 style={{ marginTop: 14 }}>Differential diagnosis</h3><ClinicalTable headers={['Condition', 'Clue']} rows={topic.differentials.map((d) => [d.condition, d.clue])} /></>}
        </>
      ),
    },
    topic.algorithm && { id: 'algo', label: 'Algorithm', content: <AlgorithmFlow nodes={topic.algorithm} /> },
    (topic.managementPrinciples || topic.specialSituations || topic.followUp || topic.prevention || topic.patientEducation) && {
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
    <article className="clinical-article">
      <p className="small"><Link to="/browse">← Clinical library</Link></p>
      <div className="spread topic-heading">
        <div>
          <span className="small muted">{CATEGORY_LABELS[topic.category]}</span>
          <h1>{topic.title}</h1>
        </div>
        <button className="icon-btn" aria-label={isFav ? 'Remove from favourites' : 'Save to favourites'} aria-pressed={isFav} onClick={() => setIsFav(favs.toggle(topic.id))} title="Favourite">{isFav ? '★' : '☆'}</button>
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
      <Tabs key={topic.id} tabs={tabs} />
      <aside className="related-references" aria-label="Related clinical references">
        <h2>Continue the clinical workup</h2>
        <ul>
          {relatedEmergencies.map((e) => <li key={e.id}><Link to={`/emergency/${e.id}`}>Emergency pathway: {e.title}</Link></li>)}
          {data.topics.filter((t) => t.category === topic.category && t.id !== topic.id).slice(0, 3).map((t) => <li key={t.id}><Link to={`/topic/${t.id}`}>{t.title}</Link></li>)}
          <li><Link to="/drugs">Drug doses, safety and monitoring</Link></li><li><Link to="/calculators">Clinical calculators and their formulas</Link></li>
        </ul>
      </aside>
    </article>
  )
}
