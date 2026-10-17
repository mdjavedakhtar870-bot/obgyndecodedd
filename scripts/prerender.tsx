import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import TurndownService from 'turndown'
import App from '../src/App'
import { ALL_PAGES, PUBLIC_PAGES, SITE_NAME, SITE_DESCRIPTION, ICU_DECODED_URL, canonicalPath, pageUrl, escapeHtml, metadataHtml, verificationText } from '../src/lib/seo'
import { resolveSiteConfig } from './site-config'

const site = resolveSiteConfig()
const output = 'dist'
const template = await readFile(join(output, 'index.html'), 'utf8')
if (!template.includes('<!--seo-head-start-->') || !template.includes('<div id="root"></div>')) throw new Error('Prerender placeholders missing from the Vite build.')

const markdown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' })
// Keeping the original HTML tables preserves the relationship between drug,
// dose, route, frequency and duration instead of flattening their columns.
markdown.keep(['table'])
markdown.remove(['button', 'input', 'select', 'script', 'style'])
const renderedText = new Map<string, string>()

async function save(path: string, content: string) {
  const target = join(output, path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content, 'utf8')
}

function markdownPath(path: string) { return `/reference${path === '/' ? '/index' : path}.md` }

for (const p of ALL_PAGES) {
  const app = renderToString(<StaticRouter location={canonicalPath(p.path)}><App /></StaticRouter>)
  const html = template
    .replace(/<!--seo-head-start-->[\s\S]*?<!--seo-head-end-->/, () => metadataHtml(p, site.origin, site.indexable))
    .replace('<div id="root"></div>', () => `<div id="root" data-prerendered="true">${app}</div>`)
  const path = p.path === '/' ? 'index.html' : p.path === '/404.html' ? '404.html' : `${p.path.slice(1)}/index.html`
  await save(path, html)
  if (PUBLIC_PAGES.includes(p) && p.index) {
    const main = app.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]
    if (!main) throw new Error(`No main content for ${p.path}`)
    const text = `Canonical page: ${pageUrl(site.origin, p.path)}\n\n${p.status ? `Content status: ${verificationText(p.status, p.lastReviewed)}.\n\n` : ''}${markdown.turndown(main)}\n\nRelated clinical reference: [ICU Decoded](${ICU_DECODED_URL})\n`
    renderedText.set(p.path, text)
    await save(markdownPath(p.path), text)
  }
}

const indexable = PUBLIC_PAGES.filter((p) => p.index)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${(site.indexable ? indexable : []).map((p) => `  <url><loc>${escapeHtml(`${pageUrl(site.origin, p.path)}`)}</loc></url>`).join('\n')}\n</urlset>\n`
// There is no reliable per-page modification date in the content model. Omit
// optional lastmod fields rather than presenting every build as a new review.
await save('sitemap.xml', sitemap)
await save('robots.txt', site.indexable ? `# Owner policy: only the documented allowed provider agents below.\n# Network identity is separately enforced by the edge function.\nUser-agent: *\nDisallow: /\n\nUser-agent: Googlebot\nUser-agent: Google-InspectionTool\nUser-agent: Google-CloudVertexBot\nUser-agent: Google-GeminiNotebook\nUser-agent: Google-Extended\nUser-agent: OAI-SearchBot\nUser-agent: ChatGPT-User\nUser-agent: GPTBot\nUser-agent: ClaudeBot\nUser-agent: Claude-SearchBot\nUser-agent: Claude-User\nAllow: /\n\n# Grok and muse.ai have no unverified name-only exception.\nSitemap: ${site.origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n')
await save('_redirects', ALL_PAGES.filter((p) => p.path !== '/404.html').map((p) => `${p.path === '/' ? '/index.html' : `${p.path}/index.html`} ${canonicalPath(p.path)} 301!`).join('\n') + '\n')

const sections = indexable.filter((p) => !p.parent && !['/', '/sitemap'].includes(p.path))
const catalog = sections.map((s) => `## ${s.name}\n\n- [${s.name}](${pageUrl(site.origin, s.path)}): ${s.description}\n${indexable.filter((p) => p.parent === s.path).map((p) => `- [${p.name.replace(/[\[\]]/g, '')}](${site.origin}${markdownPath(p.path)}): ${p.status ? verificationText(p.status, p.lastReviewed) : p.description}`).join('\n')}`).join('\n\n')
await save('llms.txt', `# ${SITE_NAME}\n\n> ${SITE_DESCRIPTION}\n\nThis site is a doctor-facing clinical reference. Content is derived from the authored library and retains its review status. Publication is not a claim of clinical verification. Individual pages link to their underlying guideline sources.\n\n## Discovery\n\n- [HTML site directory](${site.origin}/sitemap/)\n- [XML sitemap](${site.origin}/sitemap.xml)\n- [Structured content index](${site.origin}/content-index.json)\n- [Clinical source register (JSON)](${site.origin}/clinical-sources.json)\n- [Full reference text](${site.origin}/llms-full.txt)\n\nMarkdown references below are generated from the same HTML shown to users. Clinical tables retain HTML formatting to preserve column meaning. Interactive calculators require JavaScript and entered values; their formulas and sources are available in the HTML and text.\n\n${catalog}\n`)
await save('llms-full.txt', `# ${SITE_NAME} — reference text\n\n${SITE_DESCRIPTION}\n\nGenerated from public page HTML. Existing clinical content has not been independently reverified by this SEO build. Statuses, verification dates and source references are preserved.\n\n${indexable.filter((p) => p.parent || ['/about', '/sources'].includes(p.path)).map((p) => renderedText.get(p.path)).join('\n\n---\n\n')}`)
await save('content-index.json', JSON.stringify({ name: SITE_NAME, url: site.origin, description: SITE_DESCRIPTION, sitemap: `${site.origin}/sitemap.xml`, sourceRegister: `${site.origin}/clinical-sources.json`, pages: indexable.map((p) => ({ title: p.name, url: `${pageUrl(site.origin, p.path)}`, textUrl: `${site.origin}${markdownPath(p.path)}`, description: p.description, status: p.status || null, lastClinicalVerificationRecorded: p.lastReviewed || null, sourceIds: p.sourceIds || [] })) }, null, 2) + '\n')
await save('clinical-sources.json', await readFile('data/clinical-source-map.json', 'utf8'))

// Text exports remain fetchable for AI tools, while search indexes the canonical
// human pages. Netlify sets these response headers on static files.
const exportHeaders = ['/reference/*', '/llms.txt', '/llms-full.txt', '/content-index.json', '/clinical-sources.json'].map((path) => `${path}\n  X-Robots-Tag: noindex\n  Content-Type: ${path.endsWith('.json') ? 'application/json' : 'text/plain'}; charset=utf-8\n`).join('\n')
await save('_headers', `${site.indexable ? '' : '/*\n  X-Robots-Tag: noindex\n\n'}${exportHeaders}`)
console.log(`Prerendered ${ALL_PAGES.length} HTML pages; ${site.indexable ? indexable.length : 0} sitemap entries; ${renderedText.size} text references. Canonical origin: ${site.origin}`)
