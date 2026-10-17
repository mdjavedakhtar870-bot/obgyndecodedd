import assert from 'node:assert/strict'
import test from 'node:test'
import { ALL_TOPICS } from '../src/content'
import { PUBLISHED_CONTENT } from '../src/lib/app'
import { buildDocs } from '../src/lib/search'
import { ALL_PAGES, PUBLIC_PAGES, getPage, safeJson, structuredData } from '../src/lib/seo'
import { resolveSiteConfig } from '../scripts/site-config'

test('every search result has a directly addressable clinical page', () => {
  const docs = buildDocs(PUBLISHED_CONTENT)
  for (const d of docs) {
    assert.ok(getPage(d.route), `${d.kind}: missing page for ${d.route}`)
    assert.ok(!/[?#]/.test(d.route), `Search still relies on a fragment or filter: ${d.route}`)
  }
  assert.equal(new Set(PUBLIC_PAGES.map((p) => p.path)).size, PUBLIC_PAGES.length)
  assert.equal(new Set(PUBLIC_PAGES.map((p) => p.title)).size, PUBLIC_PAGES.length)
})

test('metadata does not turn review/outdated content into verified material', () => {
  for (const t of ALL_TOPICS) {
    const p = getPage(`/topic/${t.id}`)!
    const graph = structuredData(p, 'https://site.example')['@graph'] as Record<string, unknown>[]
    const medical = graph.find((x) => x['@type'] === 'MedicalWebPage')!
    assert.equal(medical.creativeWorkStatus, t.status.replaceAll('-', ' '))
    if (['review', 'outdated', 'draft', 'archived'].includes(t.status)) assert.equal(medical.lastReviewed, undefined)
    else assert.equal(medical.lastReviewed, t.lastVerifiedAt)
  }
  assert.equal(getPage('/profile')!.index, false)
  assert.equal(getPage('/404.html')!.index, false)
})

test('unknown routes are not silently canonicalized to the homepage', () => {
  assert.equal(getPage('/topic/not-a-topic'), undefined)
  assert.equal(getPage('/missing'), undefined)
  assert.equal(getPage('/browse/')!.path, '/browse')
  assert.ok(ALL_PAGES.some((p) => p.path === '/404.html'))
})

test('site URLs prefer the primary domain and preview builds cannot be indexed', () => {
  assert.equal(resolveSiteConfig({ URL: 'https://primary.example', DEPLOY_URL: 'https://random-preview.example' }).origin, 'https://primary.example')
  assert.equal(resolveSiteConfig({ SITE_URL: 'https://custom.example', URL: 'https://primary.example' }).origin, 'https://custom.example')
  assert.equal(resolveSiteConfig({ CONTEXT: 'deploy-preview' }).indexable, false)
  assert.equal(resolveSiteConfig({ CONTEXT: 'branch-deploy' }).indexable, false)
  assert.equal(resolveSiteConfig({ URL: 'http://obgyndecodedd.netlify.app' }).origin, 'https://obgyndecodedd.netlify.app')
  assert.equal(resolveSiteConfig({ SITE_URL: 'http://localhost:5173' }).indexable, false)
  assert.throws(() => resolveSiteConfig({ SITE_URL: 'https://site.example/path' }))
  assert.throws(() => resolveSiteConfig({ SITE_URL: 'http://public.example' }))
  assert.throws(() => resolveSiteConfig({ NETLIFY: 'true', URL: 'http://localhost:5173' }))
})

test('JSON-LD cannot break out of its script element', () => {
  const text = safeJson({ text: '</script><script>alert(1)</script>' })
  assert.ok(!text.includes('<'))
  assert.equal(JSON.parse(text).text, '</script><script>alert(1)</script>')
})
