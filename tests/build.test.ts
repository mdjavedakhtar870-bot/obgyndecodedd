import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { ALL_TOPICS, SOURCES } from '../src/content'
import { ALL_PAGES, PUBLIC_PAGES, pageUrl, getPage, ICU_DECODED_URL } from '../src/lib/seo'
import { resolveSiteConfig } from '../scripts/site-config'

const require = createRequire(import.meta.url)
// The HTML parser used by the Markdown renderer is also used for static QA.
const { createWindow } = require('@mixmark-io/domino')
const site = resolveSiteConfig()
const fileFor = (path: string) => join('dist', path === '/' ? 'index.html' : path === '/404.html' ? '404.html' : `${path.slice(1)}/index.html`)
const documents = new Map(ALL_PAGES.map((p) => [p.path, createWindow(readFileSync(fileFor(p.path), 'utf8')).document]))

test('every generated page contains its own readable content and metadata before JavaScript', () => {
  for (const p of ALL_PAGES) {
    const d = documents.get(p.path)
    assert.equal(d.querySelectorAll('title').length, 1, p.path)
    assert.equal(d.title, p.title, p.path)
    assert.equal(d.querySelectorAll('h1').length, 1, `${p.path}: heading`)
    assert.ok(d.querySelector('main').textContent.trim().length > 70, `${p.path}: empty content`)
    assert.equal(d.querySelector('link[rel="canonical"]').getAttribute('href'), pageUrl(site.origin, p.path), p.path)
    assert.equal(d.querySelector('meta[name="description"]').getAttribute('content'), p.description)
    assert.match(d.querySelector('meta[name="robots"]').getAttribute('content'), p.index && site.indexable ? /^index,/ : /^noindex,/)
    assert.equal(d.querySelector('meta[property="og:url"]').getAttribute('content'), pageUrl(site.origin, p.path))
    const graph = JSON.parse(d.querySelector('#page-schema').textContent)['@graph']
    assert.ok(graph.some((x: Record<string, unknown>) => x.url === pageUrl(site.origin, p.path)))
    assert.ok(d.querySelector('noscript') || readFileSync(fileFor(p.path), 'utf8').includes('<noscript>'))
    const backlink = d.querySelector(`footer a[href="${ICU_DECODED_URL}"]`)
    assert.ok(backlink, `${p.path}: missing ICU Decoded backlink`)
    assert.ok(!/nofollow|sponsored/.test(backlink.getAttribute('rel') || ''), `${p.path}: publisher link is not followable`)
  }
})

test('clinical content from all topic tabs and its registered sources is in the initial HTML', () => {
  for (const t of ALL_TOPICS) {
    const d = documents.get(`/topic/${t.id}`)
    assert.ok(d.querySelector('main').textContent.includes(t.summary), `${t.id}: summary missing`)
    for (const id of t.sourceIds) {
      const source = SOURCES.find((s) => s.id === id)!
      assert.ok([...d.querySelectorAll('main a')].some((a: any) => a.getAttribute('href') === source.url), `${t.id}: missing source ${id}`)
    }
    const panels = [...d.querySelectorAll('[role="tabpanel"]')]
    assert.ok(panels.some((panel: any) => panel.textContent.includes('Open source')), `${t.id}: source tab omitted from HTML`)
    if (t.algorithm?.length) assert.ok(d.querySelector('main').textContent.includes(t.algorithm[0].label), `${t.id}: algorithm missing`)
    if (!t.lastVerifiedAt) assert.ok(d.querySelector('main').textContent.includes('PENDING CLINICAL VERIFICATION'), t.id)
  }
})

test('all internal page links and static assets resolve to generated output', () => {
  for (const [path, d] of documents) {
    for (const node of [...d.querySelectorAll('a[href], script[src], link[href], img[src]')]) {
      const href = node.getAttribute('href') || node.getAttribute('src')
      if (!href || !href.startsWith('/') || href.startsWith('//')) continue
      const target = new URL(href, site.origin).pathname
      assert.ok(getPage(target) || existsSync(join('dist', decodeURIComponent(target))), `${path}: broken internal target ${href}`)
    }
  }
})

test('the sitemap contains only canonical indexable pages and has no fabricated dates', () => {
  const xml = readFileSync('dist/sitemap.xml', 'utf8')
  const expected = site.indexable ? PUBLIC_PAGES.filter((p) => p.index) : []
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
  assert.equal(urls.length, expected.length)
  assert.equal(new Set(urls).size, urls.length)
  for (const p of expected) assert.ok(urls.includes(pageUrl(site.origin, p.path)), p.path)
  assert.ok(!xml.includes('<lastmod>'))
  assert.ok(!xml.includes('/profile'))
  assert.ok(!xml.includes('#'))
})

test('text exports preserve clinical tables, statuses and canonical provenance', () => {
  const index = JSON.parse(readFileSync('dist/content-index.json', 'utf8'))
  assert.equal(index.pages.length, PUBLIC_PAGES.filter((p) => p.index).length)
  for (const p of index.pages) {
    const text = readFileSync(join('dist', new URL(p.textUrl).pathname), 'utf8')
    assert.ok(text.includes(`Canonical page: ${p.url}`))
    if (p.status) assert.ok(text.includes(`Content status: ${p.status.replaceAll('-', ' ')}`))
  }
  const drug = readFileSync('dist/llms-full.txt', 'utf8')
  assert.ok(drug.includes('<table'))
  assert.ok(drug.includes('PENDING CLINICAL VERIFICATION'))
  assert.equal(readFileSync('dist/clinical-sources.json', 'utf8'), readFileSync('data/clinical-source-map.json', 'utf8'))
})

test('robots deny other agents and Netlify is configured to enforce identity checks and real 404s', () => {
  const robots = readFileSync('dist/robots.txt', 'utf8')
  assert.match(robots, /User-agent: \*\nDisallow: \/\n/)
  assert.ok(!robots.includes('User-agent: bingbot'))
  if (site.indexable) {
    for (const ua of ['Googlebot', 'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'Google-Extended']) assert.ok(robots.includes(`User-agent: ${ua}\n`))
    assert.ok(robots.includes(`Sitemap: ${site.origin}/sitemap.xml`))
  }
  const edge = readFileSync('netlify/edge-functions/crawler-access.ts', 'utf8')
  assert.ok(edge.includes("path: '/*', onError: 'fail'"))
  assert.ok(edge.includes('context.ip'))
  const config = readFileSync('netlify.toml', 'utf8')
  assert.match(config, /to = "\/404.html"\n  status = 404/)
  const headers = readFileSync('dist/_headers', 'utf8')
  assert.match(headers, /\/reference\/\*\n  X-Robots-Tag: noindex/)
  if (!site.indexable) assert.ok(headers.startsWith('/*\n  X-Robots-Tag: noindex'))
})
