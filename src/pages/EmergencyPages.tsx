import { Link, useParams } from 'react-router-dom'
import { useApp } from '../App'
import { Blocks, SourceBadge, StatusBadge } from '../components/clinical'

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
    <details className="acc" open={n === '1' || n === '3'}>
      <summary><span><span className="badge danger">{n}</span> {title}</span></summary>
      <div className="acc-body">{children}</div>
    </details>
  )
  return (
    <article>
      <span className="small muted"><Link to="/emergencies">Emergency Hub</Link> / {emg.group}</span>
      <h1 style={{ color: 'var(--danger)' }}>⚡ {emg.title}</h1>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <StatusBadge status={emg.status} />
        <span className="badge danger">TIME-CRITICAL PROTOCOL</span>
        {emg.topicRef && <Link className="badge src" to={`/topic/${emg.topicRef}`}>Full clinical topic →</Link>}
      </div>

      <Step n="1" title="RECOGNIZE">
        <ul style={{ paddingLeft: 20, fontSize: 14 }}>{emg.recognize.map((r, i) => <li key={i}>{r}</li>)}</ul>
      </Step>
      <Step n="2" title="CALL FOR HELP">
        <ul style={{ paddingLeft: 20, fontSize: 14 }}>{emg.callForHelp.map((r, i) => <li key={i}>{r}</li>)}</ul>
      </Step>
      <Step n="3" title="IMMEDIATE ACTION">
        <Blocks blocks={emg.immediateAction} />
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

      {!!emg.drugs?.length && (
        <>
          <h2 className="section-h">Emergency drugs</h2>
          <Blocks blocks={emg.drugs.map((d) => ({ kind: 'doseCard', drug: d.drug, dose: d.dose, route: d.route, frequency: d.frequency, prep: d.preparation, maxDose: d.maxDose, notes: d.adverseEffects, contraindications: d.contraindications })) as never} />
        </>
      )}
      <h2 className="section-h">Sources</h2>
      <div className="row">{emg.sourceIds.map((s) => <SourceBadge key={s} id={s} />)}</div>
    </article>
  )
}
