import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Link, NavLink } from './components/links'
import { theme, PUBLISHED_CONTENT, favs, recents, type PubData } from './lib/app'
import { search, buildDocs } from './lib/search'
import Home from './pages/Home'
import { BrowsePage, TopicPage } from './pages/BrowseTopic'
import { EmergencyHub, EmergencyDetail } from './pages/EmergencyPages'
import { DrugsPage, CalculatorsPage, DdxPage, ProceduresPage, SourcesPage } from './pages/RefPages'
import { AboutPage, NotFoundPage, SitemapPage } from './pages/SitePages'
import { PageMetadata } from './components/PageMetadata'
import { getPage, ICU_DECODED_URL } from './lib/seo'
import { Dialog } from './components/Dialog'
import { AdmissionDischargePage } from './pages/AdmissionDischargePage'

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
    <Dialog title="Search the clinical library" close={close} className="palette">
        <label className="sr-only" htmlFor="clinical-search">Condition, symptom, drug or calculator</label>
        <input id="clinical-search" data-autofocus placeholder="Try PPH, ectopic, drug dose…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && hits[0]) { nav(hits[0].route); close() } }} />
        <div className="palette-results" aria-live="polite">
          {q && !hits.length && <div className="pal-empty">No matches for “{q}”</div>}
          {!q && <div className="pal-empty">Try: PPH · eclampsia · ectopic · PCOS infertility · heavy menstrual bleeding · postpartum fever</div>}
          {hits.map((h) => (
            <button key={`${h.kind}-${h.id}`} className="pal-hit" onClick={() => { recents.push(h.id); nav(h.route); close() }}>
              <span className="badge">{h.kind}</span><span className="t">{h.title}</span>
            </button>
          ))}
        </div>
    </Dialog>
  )
}

/* ---------------- Shell ---------------- */
function Shell({ children }: { children: ReactNode }) {
  const [palOpen, setPalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [themeName, setThemeName] = useState('light')
  const { toast } = useApp()
  const loc = useLocation()
  useEffect(() => { theme.init(); setThemeName(theme.current()) }, [])
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalOpen(true) } }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [])
  useEffect(() => { window.scrollTo(0, 0); setMenuOpen(false) }, [loc.pathname])
  const navCls = ({ isActive }: { isActive: boolean }) => `nav-item ${isActive ? 'active' : ''}`
  const sideNav = (
    <>
      <Link to="/" className="brand"><span className="brand-mark">OD</span><span>OBGYN Decoded<small>Clinical reference · India-first</small></span></Link>
      <div className="nav-section">Clinical</div>
      <NavLink to="/" end className={navCls}><span className="ico" aria-hidden="true">⌂</span>Dashboard</NavLink>
      <NavLink to="/browse" className={navCls}><span className="ico" aria-hidden="true">☰</span>Browse topics</NavLink>
      <NavLink to="/admission-discharge" className={navCls}><span className="ico" aria-hidden="true">↗</span>Admission & discharge</NavLink>
      <NavLink to="/ddx" className={navCls}><span className="ico" aria-hidden="true">⑃</span>Differential engine</NavLink>
      <NavLink to="/drugs" className={navCls}><span className="ico" aria-hidden="true">℞</span>Drugs</NavLink>
      <NavLink to="/calculators" className={navCls}><span className="ico" aria-hidden="true">∑</span>Calculators</NavLink>
      <NavLink to="/procedures" className={navCls}><span className="ico" aria-hidden="true">✚</span>Procedures</NavLink>
      <NavLink to="/sources" className={navCls}><span className="ico" aria-hidden="true">§</span>Guidelines & sources</NavLink>
      <NavLink to="/about" className={navCls}><span className="ico" aria-hidden="true">ⓘ</span>About this reference</NavLink>
      <div className="nav-section">Settings</div>
      <NavLink to="/profile" className={navCls}><span className="ico" aria-hidden="true">◉</span>Profile & settings</NavLink>
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
      <a className="skip-link" href="#main-content">Skip to clinical content</a>
      <aside className="sidebar"><nav aria-label="Main navigation">{sideNav}</nav></aside>
      <div className="main">
        <header className="topbar">
          <Link to="/" className="mobile-brand" aria-label="OBGYN Decoded home"><span className="brand-mark">OD</span><span>OBGYN<small>DECODED</small></span></Link>
          <button className="search-btn" aria-label="Search clinical content" onClick={() => setPalOpen(true)}><span aria-hidden="true">⌕</span><span className="search-label">Search clinical content…</span><kbd>Ctrl K</kbd></button>
          <button className="icon-btn" title="Toggle theme" aria-label="Toggle colour theme" onClick={() => { theme.toggle(); setThemeName(theme.current()); toast(`Theme: ${theme.current()}`) }}>{themeName === 'dark' ? '☀' : '☾'}</button>
          <button className="icon-btn mobile-menu-button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>☰</button>
        </header>
        <main className="content" id="main-content">{children}</main>
        <footer className="site-footer small muted"><Link to="/about">About</Link> · <Link to="/sources">Guidelines & sources</Link> · <Link to="/sitemap">Site directory</Link><p>Related clinical reference: <a href={ICU_DECODED_URL} target="_blank" rel="noopener">ICU Decoded — critical care & internal medicine ↗</a></p><p>Clinical reference for doctors. Check each page's verification status and underlying sources.</p></footer>
        <nav className="bottom-nav" aria-label="Mobile navigation">
          <NavLink to="/" end><span aria-hidden="true">⌂</span><span>Home</span></NavLink>
          <NavLink to="/browse"><span aria-hidden="true">☰</span><span>Topics</span></NavLink>
          <button onClick={() => setPalOpen(true)} aria-label="Search clinical content"><span aria-hidden="true">⌕</span><span>Search</span></button>
          <NavLink to="/emergencies" className="urgent-nav"><span aria-hidden="true">⚡</span><span>Urgent</span></NavLink>
          <button onClick={() => setMenuOpen(true)} aria-label="Open full menu" aria-expanded={menuOpen}><span aria-hidden="true">▦</span><span>Menu</span></button>
        </nav>
      </div>
      {palOpen && <Palette close={() => setPalOpen(false)} />}
      {menuOpen && <Dialog title="Explore OBGYN Decoded" close={() => setMenuOpen(false)} className="mobile-menu"><nav aria-label="All clinical sections" onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setMenuOpen(false) }}>{sideNav}</nav></Dialog>}
    </div>
  )
}

/* ---------------- App root ---------------- */
export default function App() {
  const { pathname } = useLocation()
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])
  const toastFn = (msg: string) => { const id = Date.now(); setToasts((t) => [...t, { id, msg }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600) }
  const ctx = useMemo(() => ({ data: PUBLISHED_CONTENT, toast: toastFn }), [])

  return (
    <AppCtx.Provider value={ctx}>
      <PageMetadata />
      <Shell>
        {getPage(pathname) ? <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/topic/:id" element={<TopicPage />} />
          <Route path="/emergencies" element={<EmergencyHub />} />
          <Route path="/emergency/:id" element={<EmergencyDetail />} />
          <Route path="/drugs" element={<DrugsPage />} />
          <Route path="/drug/:id" element={<DrugsPage />} />
          <Route path="/calculators" element={<CalculatorsPage />} />
          <Route path="/calculator/:id" element={<CalculatorsPage />} />
          <Route path="/ddx" element={<DdxPage />} />
          <Route path="/ddx/:id" element={<DdxPage />} />
          <Route path="/procedures" element={<ProceduresPage />} />
          <Route path="/procedure/:id" element={<ProceduresPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/admission-discharge" element={<AdmissionDischargePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes> : <NotFoundPage />}
        <div className="toast-wrap">{toasts.map((t) => <div key={t.id} className="toast">{t.msg}</div>)}</div>
      </Shell>
    </AppCtx.Provider>
  )
}

function ProfilePage() {
  const { data } = useApp()
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  const myFavs = (ready ? favs.all() : []).map((id) => data.topics.find((t) => t.id === id)).filter(Boolean)
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
