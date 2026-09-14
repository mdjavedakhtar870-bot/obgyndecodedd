import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { theme, PUBLISHED_CONTENT, favs, recents, type PubData } from './lib/app'
import { search, buildDocs } from './lib/search'
import Home from './pages/Home'
import { BrowsePage, TopicPage } from './pages/BrowseTopic'
import { EmergencyHub, EmergencyDetail } from './pages/EmergencyPages'
import { DrugsPage, CalculatorsPage, DdxPage, ProceduresPage, SourcesPage } from './pages/RefPages'

/* ---------------- App context ---------------- */
interface Ctx {
  data: PubData
  toast(msg: string): void
}
export const AppCtx = createContext<Ctx>(null as never)
export const useApp = () => useContext(AppCtx)

/* ---------------- Search palette ---------------- */
function Palette({ close }: { close(): void }) {
  const { data } = useApp()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const docs = useMemo(() => buildDocs(data), [data])
  const hits = useMemo(() => search(docs, q), [docs, q])
  return (
    <div className="palette-backdrop" onClick={close}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <input autoFocus placeholder="Search topics, drugs, emergencies, calculators… e.g. “PPH”, “high BP 34 weeks”, “ectopic”" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') close(); if (e.key === 'Enter' && hits[0]) { nav(hits[0].route); close() } }} />
        <div className="palette-results">
          {q && !hits.length && <div className="pal-empty">No matches for “{q}”</div>}
          {!q && <div className="pal-empty">Try: PPH · eclampsia · ectopic · PCOS infertility · heavy menstrual bleeding · postpartum fever</div>}
          {hits.map((h) => (
            <button key={`${h.kind}-${h.id}`} className="pal-hit" onClick={() => { recents.push(h.id); nav(h.route); close() }}>
              <span className="badge">{h.kind}</span><span className="t">{h.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Shell ---------------- */
function Shell({ children }: { children: ReactNode }) {
  const [palOpen, setPalOpen] = useState(false)
  const { toast } = useApp()
  const loc = useLocation()
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalOpen(true) } }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  const navCls = ({ isActive }: { isActive: boolean }) => `nav-item ${isActive ? 'active' : ''}`
  const sideNav = (
    <>
      <Link to="/" className="brand"><span className="brand-mark">OD</span><span>OBGYN Decoded<small>Clinical reference · India-first</small></span></Link>
      <div className="nav-section">Clinical</div>
      <NavLink to="/" end className={navCls}><span className="ico">⌂</span>Dashboard</NavLink>
      <NavLink to="/browse" className={navCls}><span className="ico">☰</span>Browse topics</NavLink>
      <NavLink to="/ddx" className={navCls}><span className="ico">⑃</span>Differential engine</NavLink>
      <NavLink to="/drugs" className={navCls}><span className="ico">℞</span>Drugs</NavLink>
      <NavLink to="/calculators" className={navCls}><span className="ico">∑</span>Calculators</NavLink>
      <NavLink to="/procedures" className={navCls}><span className="ico">✚</span>Procedures</NavLink>
      <NavLink to="/sources" className={navCls}><span className="ico">§</span>Guidelines & sources</NavLink>
      <div className="nav-section">Settings</div>
      <NavLink to="/profile" className={navCls}><span className="ico">◉</span>Profile & settings</NavLink>
      <div className="emergency-rail">
        ⚡ EMERGENCY HUB<br />
        <Link to="/emergency/emg-pph">PPH</Link>
        <Link to="/emergency/emg-eclampsia">Eclampsia</Link>
        <Link to="/emergency/emg-shoulder-dystocia">Shoulder dystocia</Link>
        <Link to="/emergencies" style={{ color: 'var(--ink-2)', fontWeight: 600 }}>All protocols →</Link>
      </div>
    </>
  )
  return (
    <div className="app">
      <aside className="sidebar">{sideNav}</aside>
      <div className="main">
        <header className="topbar">
          <button className="search-btn" onClick={() => setPalOpen(true)}>🔍 Search clinical content…<kbd>Ctrl K</kbd></button>
          <button className="icon-btn" title="Toggle theme" onClick={() => { theme.toggle(); toast(`Theme: ${theme.current()}`) }}>{theme.current() === 'dark' ? '☀' : '☾'}</button>
        </header>
        <main className="content">{children}</main>
        <nav className="bottom-nav">
          <NavLink to="/" end className={({ isActive }) => `icon-btn`} style={{ border: 'none' }}>⌂</NavLink>
          <NavLink to="/browse" className={({ isActive }) => `icon-btn`} style={{ border: 'none' }}>☰</NavLink>
          <button className="icon-btn" onClick={() => setPalOpen(true)} style={{ border: 'none' }}>🔍</button>
          <NavLink to="/emergencies" className={({ isActive }) => `icon-btn`} style={{ border: 'none', color: 'var(--danger)' }}>⚡</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `icon-btn`} style={{ border: 'none' }}>◉</NavLink>
        </nav>
      </div>
      {palOpen && <Palette close={() => setPalOpen(false)} />}
    </div>
  )
}

/* ---------------- App root ---------------- */
export default function App() {
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])
  const toastFn = (msg: string) => { const id = Date.now(); setToasts((t) => [...t, { id, msg }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600) }
  useEffect(() => { theme.init() }, [])
  const ctx = useMemo(() => ({ data: PUBLISHED_CONTENT, toast: toastFn }), [])

  return (
    <AppCtx.Provider value={ctx}>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/topic/:id" element={<TopicPage />} />
          <Route path="/emergencies" element={<EmergencyHub />} />
          <Route path="/emergency/:id" element={<EmergencyDetail />} />
          <Route path="/drugs" element={<DrugsPage />} />
          <Route path="/calculators" element={<CalculatorsPage />} />
          <Route path="/ddx" element={<DdxPage />} />
          <Route path="/procedures" element={<ProceduresPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<div className="card card-pad">Not found. <Link to="/">Home →</Link></div>} />
        </Routes>
        <div className="toast-wrap">{toasts.map((t) => <div key={t.id} className="toast">{t.msg}</div>)}</div>
      </Shell>
    </AppCtx.Provider>
  )
}

function ProfilePage() {
  const { data } = useApp()
  const myFavs = favs.all().map((id) => data.topics.find((t) => t.id === id)).filter(Boolean)
  return (
    <div>
      <h1>Profile & settings</h1>
      <div className="card card-pad" style={{ maxWidth: 560 }}>
        <p className="small muted">Clinical region mode: <b>India</b> (Indian guidance shown first where relevant; international references labelled).</p>
        <p className="small muted">The clinical library is bundled with this app — no sign-in required. Preferences (theme, favourites, recents) are stored only on this device.</p>
      </div>
      <h2 className="section-h" style={{ marginTop: 26 }}>Favourites</h2>
      <div className="grid-cards">
        {myFavs.length === 0 && <p className="muted small">No favourites yet — tap ☆ on any topic.</p>}
        {myFavs.map((t) => t && <Link key={t.id} className="tile" to={`/topic/${t.id}`}><h3>{t.title}</h3><p>{t.summary.slice(0, 90)}…</p></Link>)}
      </div>
    </div>
  )
}
