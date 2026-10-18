import { ALL_TOPICS, CALCULATORS, DDx_PRESENTATIONS, DRUGS, EMERGENCIES, PROCEDURES, SOURCES } from '../content'
import { DISCHARGE_SHARED_SOURCES } from '../content/admission-discharge'

export const SITE_NAME = 'OBGYN Decoded'
export const ICU_DECODED_URL = 'https://icudecodedd.com/'
export function canonicalPath(path: string): string {
  if (path === '/' || path.endsWith('.html')) return path
  return `${path.replace(/\/+$/, '')}/`
}
export function pageUrl(origin: string, path: string): string { return `${origin}${canonicalPath(path)}` }
export const SITE_DESCRIPTION = 'Obstetrics and gynaecology clinical reference for doctors in India: clinical topics, emergency pathways, drug references, calculators and guideline sources.'

export interface PageInfo {
  path: string
  name: string
  title: string
  description: string
  kind: 'WebPage' | 'CollectionPage' | 'MedicalWebPage' | 'AboutPage'
  index: boolean
  parent?: string
  sourceIds?: string[]
  status?: string
  lastReviewed?: string
}

function page(path: string, name: string, description: string, extra: Partial<PageInfo> = {}): PageInfo {
  return { path, name, title: `${name} | ${SITE_NAME}`, description, kind: 'CollectionPage', index: true, ...extra }
}

export function verificationText(status?: string, date?: string): string {
  const label = status ? status.replaceAll('-', ' ') : 'status not recorded'
  return `${label}; ${date ? `last clinical verification recorded: ${date}` : 'clinical verification date not recorded'}`
}

// This is the route inventory for the renderer, sitemap, metadata and AI index.
// Dates/statuses are copied from authored content, never inferred from a build.
export const PUBLIC_PAGES: PageInfo[] = [
  page('/', SITE_NAME, SITE_DESCRIPTION, { title: 'OBGYN Decoded | Obstetrics & Gynaecology Clinical Reference' }),
  page('/browse', 'Obstetrics & gynaecology topics', 'Browse clinical topics by category, with authored verification status and links to the guideline sources used by each module.'),
  page('/admission-discharge', 'Admission & discharge guide', 'Condition-specific hospital admission, discharge readiness, medicines, pending results, follow-up and urgent-return guidance, with a complete obstetric and gynaecology discharge checklist.', { kind: 'MedicalWebPage', sourceIds: [...DISCHARGE_SHARED_SOURCES, 'nice-ng192-detail'], status: 'review' }),
  page('/emergencies', 'Obstetric emergency protocols', 'Browse obstetric emergency pathways, including recognition, immediate actions, investigations, escalation and source references.'),
  page('/drugs', 'Obstetrics & gynaecology drug reference', 'Browse drug dose tables, routes, frequency, duration, pregnancy and lactation notes, contraindications and registered sources.'),
  page('/calculators', 'Obstetric & gynaecology calculators', 'Clinical calculators with inputs, formula explanations and source references for obstetrics and gynaecology.'),
  page('/ddx', 'Obstetric & gynaecology differential diagnosis', 'Browse clinical presentations, immediate red flags, urgent workup and structured differential diagnoses linked to clinical topics.'),
  page('/procedures', 'Obstetric & gynaecology procedures', 'Browse procedure references with indications, consent, preparation, steps, complications, follow-up and registered sources.'),
  page('/sources', 'Clinical guidelines & source register', 'View the clinical source register: guideline organisations, versions, source URLs, recorded check dates and verification status.'),
  page('/about', 'About OBGYN Decoded', 'About the doctor-facing, India-first OBGYN Decoded reference, its source register and its clinical verification labels.', { kind: 'AboutPage' }),
  page('/sitemap', 'Site directory', 'A complete directory of OBGYN Decoded clinical topics, emergencies, drugs, calculators, procedures and differential-diagnosis pages.'),
  ...ALL_TOPICS.map((t) => page(`/topic/${t.id}`, t.title,
    `${t.title}: assessment, treatment, monitoring and guideline sources for doctors. Content ${verificationText(t.status, t.lastVerifiedAt)}.`,
    { title: `${t.title} — Clinical Topic | ${SITE_NAME}`, kind: 'MedicalWebPage', parent: '/browse', sourceIds: t.sourceIds, status: t.status, lastReviewed: t.lastVerifiedAt, index: !['draft', 'archived'].includes(t.status) })),
  ...EMERGENCIES.map((e) => page(`/emergency/${e.id}`, e.title,
    `${e.title}: recognition, immediate action, definitive management and escalation. Content ${verificationText(e.status, e.lastVerifiedAt)}.`,
    { title: `${e.title} — Emergency Protocol | ${SITE_NAME}`, kind: 'MedicalWebPage', parent: '/emergencies', sourceIds: e.sourceIds, status: e.status, lastReviewed: e.lastVerifiedAt, index: !['draft', 'archived'].includes(e.status) })),
  ...DRUGS.map((d) => page(`/drug/${d.id}`, d.name,
    `${d.name}: dose tables, routes, frequency, duration, pregnancy and lactation notes, and sources. Content ${verificationText(d.status)}.`,
    { title: `${d.name} — Drug Reference | ${SITE_NAME}`, kind: 'MedicalWebPage', parent: '/drugs', sourceIds: [...new Set([d.sourceId, ...d.doseRows.map((r) => r.sourceId)].filter((id): id is string => !!id))], status: d.status, index: !['draft', 'archived'].includes(d.status) })),
  ...CALCULATORS.map((c) => page(`/calculator/${c.id}`, c.name, `${c.name}. ${c.description} Includes the formula and registered source where available.`,
    { title: `${c.name} — Calculator | ${SITE_NAME}`, kind: 'MedicalWebPage', parent: '/calculators', sourceIds: c.sourceId ? [c.sourceId] : [] })),
  ...PROCEDURES.map((p) => page(`/procedure/${p.id}`, p.title,
    `${p.title}: indications, preparation, steps, complications and follow-up. Content ${verificationText(p.status, p.lastVerifiedAt)}.`,
    { title: `${p.title} — Procedure | ${SITE_NAME}`, kind: 'MedicalWebPage', parent: '/procedures', sourceIds: p.sourceIds, status: p.status, lastReviewed: p.lastVerifiedAt, index: !['draft', 'archived'].includes(p.status) })),
  ...DDx_PRESENTATIONS.map((d) => page(`/ddx/${d.id}`, d.presentation,
    `${d.presentation}: red flags, urgent workup, differential diagnoses and first moves, with links to the relevant clinical modules.`,
    { title: `${d.presentation} — Differential Diagnosis | ${SITE_NAME}`, kind: 'MedicalWebPage', parent: '/ddx' })),
]

const EXTRA_PAGES: PageInfo[] = [
  page('/profile', 'Profile & settings', 'Device-local preferences and favourites.', { kind: 'WebPage', index: false }),
  page('/404.html', 'Page not found', 'This page could not be found. Browse the OBGYN Decoded reference or use the site directory.', { kind: 'WebPage', index: false }),
]
export const ALL_PAGES = [...PUBLIC_PAGES, ...EXTRA_PAGES]
const pagesByPath = new Map(ALL_PAGES.map((p) => [p.path, p]))

export function getPage(path: string): PageInfo | undefined {
  const normalized = path === '/index.html' ? '/' : path.replace(/\/+$/, '') || '/'
  return pagesByPath.get(normalized)
}
export const NOT_FOUND_PAGE = EXTRA_PAGES[1]

export function breadcrumbs(p: PageInfo): { name: string; path: string }[] {
  if (p.path === '/') return [{ name: SITE_NAME, path: '/' }]
  const parent = p.parent ? getPage(p.parent) : undefined
  return [{ name: SITE_NAME, path: '/' }, ...(parent ? [{ name: parent.name, path: parent.path }] : []), { name: p.name, path: p.path }]
}

export function structuredData(p: PageInfo, origin: string): Record<string, unknown> {
  const url = pageUrl(origin, p.path)
  const citations = (p.sourceIds || []).map((id) => SOURCES.find((s) => s.id === id)).filter((s) => s !== undefined)
  const children = p.path === '/sitemap' ? PUBLIC_PAGES.filter((x) => x.path !== '/sitemap' && x.index) : PUBLIC_PAGES.filter((x) => x.parent === p.path && x.index)
  const graph: Record<string, unknown>[] = [
    { '@type': 'Organization', '@id': `${origin}/#organization`, name: SITE_NAME, url: `${origin}/`, logo: { '@type': 'ImageObject', url: `${origin}/icons/icon-512.png`, width: 512, height: 512 } },
    { '@type': 'WebSite', '@id': `${origin}/#website`, name: SITE_NAME, url: `${origin}/`, description: SITE_DESCRIPTION, inLanguage: 'en-IN', publisher: { '@id': `${origin}/#organization` } },
    {
      '@type': p.kind, '@id': `${url}#webpage`, url, name: p.title, description: p.description, inLanguage: 'en-IN',
      isPartOf: { '@id': `${origin}/#website` }, publisher: { '@id': `${origin}/#organization` }, relatedLink: ICU_DECODED_URL,
      ...(p.kind === 'MedicalWebPage' ? { medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Physicians' } } : {}),
      ...(p.status ? { creativeWorkStatus: p.status.replaceAll('-', ' ') } : {}),
      // Do not imply that publication alone is a completed clinical review.
      ...(p.lastReviewed && ['clinically-verified', 'published'].includes(p.status || '') ? { lastReviewed: p.lastReviewed } : {}),
      ...(citations.length ? { citation: citations.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url, publisher: { '@type': 'Organization', name: s.organisation } })) } : {}),
      ...(p.path !== '/' ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
      ...(children.length ? { mainEntity: { '@type': 'ItemList', numberOfItems: children.length, itemListElement: children.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: pageUrl(origin, c.path) })) } } : {}),
    },
  ]
  if (p.path !== '/') graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: breadcrumbs(p).map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: pageUrl(origin, b.path) })) })
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]!)
}
export function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}
export function robotDirective(p: PageInfo, indexable: boolean): string {
  return `${p.index && indexable ? 'index' : 'noindex'}, follow, max-image-preview:large, max-snippet:-1`
}

export function metadataHtml(p: PageInfo, origin: string, indexable: boolean): string {
  const e = escapeHtml
  const url = pageUrl(origin, p.path)
  const tags: [string, string, string][] = [
    ['name', 'description', p.description], ['name', 'robots', robotDirective(p, indexable)],
    ['property', 'og:type', 'website'], ['property', 'og:site_name', SITE_NAME], ['property', 'og:locale', 'en_IN'],
    ['property', 'og:title', p.title], ['property', 'og:description', p.description], ['property', 'og:url', url],
    ['property', 'og:image', `${origin}/social-card.png`], ['property', 'og:image:alt', 'OBGYN Decoded — Obstetrics & Gynaecology Clinical Reference'],
    ['property', 'og:image:width', '1200'], ['property', 'og:image:height', '630'],
    ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', p.title], ['name', 'twitter:description', p.description],
    ['name', 'twitter:image', `${origin}/social-card.png`], ['name', 'twitter:image:alt', 'OBGYN Decoded — Obstetrics & Gynaecology Clinical Reference'],
  ]
  return [
    `<title>${e(p.title)}</title>`,
    ...tags.map(([attr, key, value]) => `<meta data-page-meta ${attr}="${e(key)}" content="${e(value)}" />`),
    `<link rel="canonical" href="${e(url)}" />`,
    '<link rel="sitemap" type="application/xml" href="/sitemap.xml" />',
    '<link rel="alternate" type="text/plain" title="AI-readable site directory" href="/llms.txt" />',
    `<script id="page-schema" type="application/ld+json">${safeJson(structuredData(p, origin))}</script>`,
  ].join('\n    ')
}
