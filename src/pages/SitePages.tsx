import { Link } from 'react-router-dom'
import { ALL_TOPICS, CALCULATORS, DDx_PRESENTATIONS, DRUGS, EMERGENCIES, PROCEDURES } from '../content'
import { PUBLIC_PAGES, SITE_DESCRIPTION } from '../lib/seo'

export function AboutPage() {
  return <article className="card card-pad">
    <h1>About OBGYN Decoded</h1>
    <p>{SITE_DESCRIPTION}</p>
    <p>The library contains {ALL_TOPICS.length} clinical topics, {EMERGENCIES.length} emergency protocols, {DRUGS.length} drug references, {CALCULATORS.length} calculators, {PROCEDURES.length} procedures and {DDx_PRESENTATIONS.length} differential-diagnosis presentations.</p>
    <h2>Guidelines and verification</h2>
    <p>Indian guidance is prioritised where relevant, with international references labelled. Clinical modules link to the <Link to="/sources">guideline and source register</Link>, which records each source's organisation, version, check date and verification status.</p>
    <p>Publication status and clinical verification are separate. A page without a recorded clinical verification date remains pending verification. Review and outdated labels identify content requiring further review. A source's publication date is not a clinical review date.</p>
    <p>Guideline-conflict blocks show the differing recommendations, population or setting differences, India considerations and the app's stated reasoning.</p>
    <h2>Intended use</h2>
    <p>This reference is intended for doctors. It supports clinical decision-making and does not replace clinical judgement or institutional protocols. Check the page's recorded status and underlying sources before relying on its recommendations.</p>
    <h2>Access and privacy</h2>
    <p>The clinical library is public and ships as static pages with an interactive app. No sign-in is required. Favourites, recents and theme preferences stay on the user's device.</p>
    <p><Link to="/sitemap">Explore the complete site directory →</Link></p>
  </article>
}

export function SitemapPage() {
  const collections = PUBLIC_PAGES.filter((p) => !p.parent && !['/', '/sitemap'].includes(p.path))
  return <article>
    <h1>OBGYN Decoded site directory</h1>
    <p>All public reference pages, grouped by section. Each clinical page retains its authored status and source links.</p>
    <p><a href="/sitemap.xml">XML sitemap</a> · <a href="/llms.txt">AI-readable directory</a></p>
    {collections.map((p) => <section key={p.path}>
      <h2><Link to={p.path}>{p.name}</Link></h2>
      <ul>{PUBLIC_PAGES.filter((c) => c.parent === p.path && c.index).map((c) => <li key={c.path}><Link to={c.path}>{c.name}</Link>{c.status ? <span className="small muted"> · {c.status.replaceAll('-', ' ')}</span> : null}</li>)}</ul>
    </section>)}
  </article>
}

export function NotFoundPage() {
  return <article className="card card-pad"><h1>Page not found</h1><p>This address is not in the clinical library.</p><p><Link to="/browse">Browse clinical topics</Link> · <Link to="/sitemap">Site directory</Link> · <Link to="/">Home</Link></p></article>
}
