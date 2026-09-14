import { Link } from 'react-router-dom'
import { useApp } from '../App'
import { favs, recents } from '../lib/app'
import { StatusBadge } from '../components/clinical'

export default function Home() {
  const { data } = useApp()
  if (!data) return <p className="muted">Loading clinical library…</p>
  const emergencyTopics = data.emergencies.slice(0, 8)
  const myRecents = recents.all().map((id) => data.topics.find((t) => t.id === id)).filter(Boolean)
  const myFavs = favs.all().map((id) => data.topics.find((t) => t.id === id)).filter(Boolean)
  const unverified = data.topics.filter((t) => t.status !== 'published' && t.status !== 'clinically-verified').length

  return (
    <div>
      <section className="hero">
        <h1>Bedside answers. Source-traceable. India-first.</h1>
        <p>
          Open the problem you are facing → get assessment → exact treatment pathway with doses, routes and durations →
          monitoring → what to do when the patient fails to improve → escalation — every step traced to its guideline.
        </p>
        <div className="badges">
          <span className="badge" style={{ background: 'rgba(255,255,255,.14)', color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>FOGSI/ICOG GCPR 2026 · HDP</span>
          <span className="badge" style={{ background: 'rgba(255,255,255,.14)', color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>WHO Consolidated PPH (Oct 2025)</span>
          <span className="badge" style={{ background: 'rgba(255,255,255,.14)', color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>NICE NG235 (updated Jun 2026)</span>
        </div>
      </section>

      <h2 className="section-h">⚡ Emergencies — one tap away</h2>
      <div className="grid-cards">
        {emergencyTopics.map((e) => (
          <Link key={e.id} className="tile" to={`/emergency/${e.id}`} style={{ borderLeft: '4px solid var(--danger)' }}>
            <h3>{e.title}</h3><p>{e.group}</p>
          </Link>
        ))}
        <Link className="tile" to="/emergencies"><h3>All protocols →</h3><p>{data.emergencies.length} emergency pathways</p></Link>
      </div>

      {(myRecents.length > 0 || myFavs.length > 0) && (
        <>
          <h2 className="section-h">Jump back in</h2>
          <div className="grid-cards">
            {myFavs.map((t) => t && (
              <Link key={`f-${t.id}`} className="tile" to={`/topic/${t.id}`}><h3>☆ {t.title}</h3><p>Favourite</p></Link>
            ))}
            {myRecents.map((t) => t && !favs.has(t.id) && (
              <Link key={`r-${t.id}`} className="tile" to={`/topic/${t.id}`}><h3>{t.title}</h3><p>Recently viewed</p></Link>
            ))}
          </div>
        </>
      )}

      <h2 className="section-h">Clinical modules</h2>
      <div className="grid-cards">
        {data.topics.slice(0, 12).map((t) => (
          <Link key={t.id} className="tile" to={`/topic/${t.id}`}>
            <div className="spread"><h3>{t.title}</h3><StatusBadge status={t.status} /></div>
            <p>{t.summary.slice(0, 110)}…</p>
          </Link>
        ))}
      </div>

      <div className="card card-pad small muted" style={{ marginTop: 26 }}>
        <b>Content status:</b> {data.topics.length} topics · {data.drugs.length} drugs · {data.calculators.length} calculators ·
        {' '}{data.emergencies.length} emergency protocols · {unverified} flagged pending/outdated for specialist review.
        This application supports clinical decision-making but does not replace clinical judgement; verify doses against your institutional protocols.
      </div>
    </div>
  )
}
