import { useParams } from 'react-router-dom'
import { Link } from '../components/links'
import { useApp } from '../App'
import { Blocks, DrugUseCard, SourceBadge, StatusBadge } from '../components/clinical'
import { DOSE_CONFLICTS } from '../content/medication-regimens'

export function EmergencyHub() {
  const { data } = useApp()
  if (!data) return <p className="muted">Loading…</p>
  const groups = [...new Set(data.emergencies.map((e) => e.group))]
  return (
    <div>
      <div className="hero" style={{ background: 'linear-gradient(135deg,#7f1d1d,#b91c1c)' }}>
        <h1>⚡ Emergency Hub</h1>
        <p>RECOGNIZE → CALL FOR HELP → IMMEDIATE ACTION → INVESTIGATIONS → DEFINITIVE MANAGEMENT → ESCALATION → POST-EVENT CARE. Every protocol follows the same spine.</p>
      </div>
      {groups.map((g) => (
        <div key={g}>
          <h2 className="section-h">{g}</h2>
          <div className="grid-cards">
            {data.emergencies.filter((e) => e.group === g).map((e) => (
              <Link key={e.id} className="tile" to={`/emergency/${e.id}`} style={{ borderLeft: '4px solid var(--danger)' }}>
                <h3>{e.title}</h3><p>{e.recognize[0]}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function EmergencyDetail() {
  const { id } = useParams()
  const { data } = useApp()
  const emg = data?.emergencies.find((e) => e.id === id)
  if (!emg) return <p className="muted">Protocol not found.</p>
  const Step = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
    <details className="acc" id={`emergency-step-${n}`} open>
      <summary><span><span className="badge danger">{n}</span> {title}</span></summary>
      <div className="acc-body">{children}</div>
    </details>
  )
  return (
    <article className="clinical-article">
      <span className="small muted"><Link to="/emergencies">Emergency Hub</Link> / {emg.group}</span>
      <h1 style={{ color: 'var(--danger)' }}>⚡ {emg.title}</h1>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <StatusBadge status={emg.status} />
        <span className="badge">{emg.lastVerifiedAt ? `Last clinically verified ${emg.lastVerifiedAt}` : 'PENDING CLINICAL VERIFICATION'}</span>
        <span className="badge danger">TIME-CRITICAL PROTOCOL</span>
        {emg.topicRef && <Link className="badge src" to={`/topic/${emg.topicRef}`}>Full clinical topic →</Link>}
      </div>

      <nav className="row emergency-jump" aria-label="Emergency protocol sections">
        <a className="btn sm" href="#emergency-step-3">Immediate action</a>
        {!!emg.drugs?.length && <a className="btn sm" href="#emergency-regimens">Drug doses & preparation</a>}
        <a className="btn sm" href="#emergency-step-5">Definitive treatment</a>
        <a className="btn sm" href="#emergency-step-6">Escalation</a>
      </nav>

      <Step n="1" title="RECOGNIZE">
        <ul style={{ paddingLeft: 20, fontSize: 14 }}>{emg.recognize.map((r, i) => <li key={i}>{r}</li>)}</ul>
      </Step>
      <Step n="2" title="CALL FOR HELP">
        <ul style={{ paddingLeft: 20, fontSize: 14 }}>{emg.callForHelp.map((r, i) => <li key={i}>{r}</li>)}</ul>
      </Step>
      <Step n="3" title="IMMEDIATE ACTION">
        <Blocks blocks={emg.immediateAction} />
        {!!emg.drugs?.length && <section id="emergency-regimens">
          <h2 className="section-h">Drug doses & preparation</h2>
          <p className="small muted">Choose the regimen for the stated indication. Alternatives are not instructions to give every medicine. Check prior doses, contraindications, concentration and the response before repeating.</p>
          {emg.drugs.some((d) => /nifedipine/i.test(d.drug)) && <Blocks blocks={DOSE_CONFLICTS.nifedipine} />}
          {emg.drugs.some((d) => /labetalol IV/i.test(d.drug)) && <Blocks blocks={DOSE_CONFLICTS.labetalol} />}
          {emg.drugs.map((d, i) => <DrugUseCard key={i} drug={d} />)}
        </section>}
      </Step>
      <Step n="4" title="INVESTIGATIONS (never delaying treatment)">
        <ul style={{ paddingLeft: 20, fontSize: 14 }}>{emg.investigations.map((r, i) => <li key={i}>{r}</li>)}</ul>
      </Step>
      <Step n="5" title="DEFINITIVE MANAGEMENT">
        <Blocks blocks={emg.definitiveManagement} />
      </Step>
      <Step n="6" title="ESCALATION">
        <ul style={{ paddingLeft: 20, fontSize: 14 }}>{emg.escalation.map((r, i) => <li key={i}>{r}</li>)}</ul>
      </Step>
      <Step n="7" title="POST-EVENT CARE">
        <ul style={{ paddingLeft: 20, fontSize: 14 }}>{emg.postEventCare.map((r, i) => <li key={i}>{r}</li>)}</ul>
      </Step>

      <h2 className="section-h">Sources</h2>
      <div className="row">{emg.sourceIds.map((s) => <SourceBadge key={s} id={s} />)}</div>
    </article>
  )
}
