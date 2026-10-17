import { Link } from '../components/links'
import { useEffect, useState } from 'react'
import { useApp } from '../App'
import { favs, recents } from '../lib/app'
import { CATEGORY_LABELS } from '../content'

const CATEGORY_INTROS: Record<string, string> = {
  antenatal: 'Antenatal contacts, maternal assessment and the routine-care schedule.',
  obstetrics: 'Labour, induction, mode of birth, fetal assessment and membrane rupture.',
  'obstetric-emergency': 'Haemorrhage, hypertensive emergencies and complications of early pregnancy and birth.',
  'medical-disorders': 'Diabetes, anaemia, thrombosis and other medical disorders during pregnancy.',
  'infections-pregnancy': 'Maternal infection, pregnancy-specific treatment, partner care and follow-up.',
  'early-pregnancy': 'Pregnancy location, pregnancy loss, recurrent miscarriage and termination care.',
  gynaecology: 'Bleeding, pelvic pain, benign gynaecology, menopause and pelvic-floor symptoms.',
  'gynae-oncology': 'Cancer recognition, screening, staging references and specialist referral.',
  urogynaecology: 'Urinary symptoms, prolapse, continence assessment and pelvic-floor care.',
  'contraception-infertility': 'Contraceptive choices, reproductive goals and fertility assessment.',
}

export default function Home() {
  const { data } = useApp()
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  const categories = [...new Set(data.topics.map((t) => t.category))]
  const recentIds = ready ? [...new Set([...favs.all(), ...recents.all()])].slice(0, 6) : []
  const personal = recentIds.map((id) => data.topics.find((t) => t.id === id)).filter((t) => t !== undefined)
  const pending = data.topics.filter((t) => !['published', 'clinically-verified'].includes(t.status)).length
  return <div>
    <section className="hero">
      <span className="eyebrow">For doctors · India-first reference</span>
      <h1>From clinical problem<br />to the next decision.</h1>
      <p>Find the assessment, treatment pathway, drug regimen and follow-up in one guide. Open the sources beside the clinical detail, or go straight to an emergency protocol.</p>
      <div className="hero-actions"><Link className="btn" to="/browse">Find a condition →</Link><Link className="btn secondary" to="/emergencies">Emergency pathways</Link></div>
    </section>

    <nav className="library-stats" aria-label="Clinical reference collections">
      {[['/browse', data.topics.length, 'Clinical topics'], ['/emergencies', data.emergencies.length, 'Emergency protocols'], ['/drugs', data.drugs.length, 'Drug references'], ['/calculators', data.calculators.length, 'Calculators']].map(([to, count, label]) => <Link key={to} className="library-stat" to={String(to)}><strong>{count}</strong><span>{label}</span></Link>)}
    </nav>

    <h2 className="section-h">Urgent problems</h2>
    <p className="section-intro">Recognition, help, immediate actions and escalation are grouped in each emergency pathway.</p>
    <div className="grid-cards">
      {data.emergencies.slice(0, 4).map((e) => <Link key={e.id} className="tile emergency-tile" to={`/emergency/${e.id}`}><span className="eyebrow">{e.group}</span><h3>{e.title} →</h3><p>{e.recognize[0]}</p></Link>)}
    </div>
    <p><Link className="btn" to="/emergencies">All {data.emergencies.length} emergency protocols →</Link></p>

    {personal.length > 0 && <section><h2 className="section-h">Continue reading</h2><div className="grid-cards">{personal.map((t) => <Link className="tile" key={t.id} to={`/topic/${t.id}`}><h3>{t.title}</h3><p>{favs.has(t.id) ? 'Saved on this device' : 'Recently opened'}</p></Link>)}</div></section>}

    <section>
      <span className="eyebrow" style={{ marginTop: 32 }}>Explore the complete library</span>
      <h2>Obstetrics & gynaecology, by clinical problem</h2>
      <p className="section-intro">Read the full guide or focus on one section. Each topic displays its own review status; section-specific source checks do not imply that the entire module has been audited.</p>
      {categories.map((cat) => <section key={cat} className="category-section">
        <header><h3>{CATEGORY_LABELS[cat]}</h3><p>{CATEGORY_INTROS[cat]}</p></header>
        <ul className="topic-list">{data.topics.filter((t) => t.category === cat).map((t) => <li key={t.id}><Link to={`/topic/${t.id}`}><span><strong>{t.title}</strong><small>{t.summary}</small></span><span className="topic-arrow" aria-hidden="true">↗</span></Link></li>)}</ul>
      </section>)}
    </section>

    <section className="card card-pad" style={{ marginTop: 28 }}>
      <h2>Clinical tools beside the guide</h2>
      <p>Use <Link to="/ddx">differential-diagnosis presentations</Link> for structured workup, <Link to="/drugs">drug references</Link> for indication-specific regimens, <Link to="/calculators">calculators</Link> for entered clinical values, and <Link to="/procedures">procedure guides</Link> for preparation and follow-up.</p>
      <p className="small muted">{pending} modules remain in review or marked outdated. Check the page status and <Link to="/sources">source register</Link> when using the reference.</p>
    </section>
  </div>
}
