import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluateCrawlerRequest, ipInRanges, parseRanges, type FeedId } from '../netlify/lib/crawler-policy'
import crawlerAccess from '../netlify/edge-functions/crawler-access'

const ranges: Record<FeedId, string[]> = {
  'google-common': ['66.249.64.0/19', '2001:4860:4801::/48'],
  'google-user': ['192.0.2.0/24'],
  'openai-search': ['198.51.100.0/25'],
  'openai-user': ['198.51.100.128/25'],
  'openai-training': ['203.0.113.0/25'],
  anthropic: ['203.0.113.128/25'],
}
const load = async (id: FeedId) => ranges[id]
const browser = 'Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36'
const request = (ua: string, path = '/topic/hdp-eclampsia', headers: Record<string, string> = {}) => new Request(`https://site.example${path}`, { headers: { 'user-agent': ua, ...headers } })

test('supported crawlers require the matching dedicated provider range', async () => {
  for (const [ua, ip] of [['OAI-SearchBot/1.4', '198.51.100.1'], ['ChatGPT-User/1.0', '198.51.100.129'], ['GPTBot/1.4', '203.0.113.1'], ['Claude-SearchBot/1.0', '203.0.113.129'], ['Claude-User/1.0', '203.0.113.130'], ['Googlebot/2.1', '66.249.66.1'], ['Google-GeminiNotebook', '192.0.2.1']]) {
    assert.equal((await evaluateCrawlerRequest(request(ua), ip, load)).action, 'allow', ua)
    assert.equal((await evaluateCrawlerRequest(request(ua), '8.8.8.8', load)).action, 'deny', `spoofed ${ua}`)
  }
  assert.equal((await evaluateCrawlerRequest(request('OAI-SearchBot/1.4'), '203.0.113.129', load)).action, 'deny', 'A different approved provider is not proof of this claimed agent')
})

test('referrers, location/device claims and forwarded IP headers do not grant access', async () => {
  const forged = request(`${browser} (compatible; Googlebot/2.1)`, '/', { referer: 'https://www.google.com/', 'x-forwarded-for': '66.249.66.1', 'x-real-ip': '66.249.66.1', 'x-country': 'US' })
  assert.equal((await evaluateCrawlerRequest(forged, '8.8.8.8', load)).action, 'deny')
  const forgedOpenAI = request('ChatGPT-User/1.0', '/llms-full.txt', { 'x-forwarded-for': '198.51.100.129' })
  assert.equal((await evaluateCrawlerRequest(forgedOpenAI, '8.8.8.8', load)).action, 'deny')
})

test('Google site verification requires its Google-controlled network and is limited to the homepage', async () => {
  const ua = 'Mozilla/5.0 (compatible; Google-Site-Verification/1.0)'
  assert.equal((await evaluateCrawlerRequest(request(ua, '/'), '192.0.2.1', load)).action, 'allow')
  assert.equal((await evaluateCrawlerRequest(new Request('https://site.example/', { method: 'HEAD', headers: { 'user-agent': ua } }), '192.0.2.1', load)).action, 'allow')
  assert.equal((await evaluateCrawlerRequest(request(ua, '/', { referer: 'https://www.google.com/', 'x-forwarded-for': '192.0.2.1' }), '8.8.8.8', load)).action, 'deny')
  assert.equal((await evaluateCrawlerRequest(request(ua, '/'), '66.249.66.1', load)).action, 'deny', 'Common crawler ranges are not verifier identity')
  for (const path of ['/topic/anc-overview/', '/assets/app.js', '/llms-full.txt']) assert.equal((await evaluateCrawlerRequest(request(ua, path), '192.0.2.1', load)).reason, 'verification-homepage-only')
  assert.equal((await evaluateCrawlerRequest(new Request('https://site.example/', { method: 'POST', headers: { 'user-agent': ua } }), '192.0.2.1', load)).action, 'deny')
  assert.equal((await evaluateCrawlerRequest(request(ua, '/'), '192.0.2.1', async () => { throw new Error('feed down') })).action, 'unavailable')
  assert.equal((await evaluateCrawlerRequest(request('Google-Read-Aloud', '/'), '192.0.2.1', load)).action, 'deny')
})

test('other declared bots and services without verified identities are denied', async () => {
  for (const ua of ['bingbot/2.0', 'Perplexity-User/1.0', 'Applebot/0.1', 'Bytespider', 'CCBot/2.0', 'GoogleOther', 'xAI-Grok/1.0', 'MuseBot/1.0', 'muse.ai', 'curl/8.0', '', `${browser} HeadlessChrome/140`]) {
    assert.equal((await evaluateCrawlerRequest(request(ua), '66.249.66.1', load)).action, 'deny', ua)
  }
})

test('plain browser pages remain public; text exports require verified access', async () => {
  assert.equal((await evaluateCrawlerRequest(request(browser), '8.8.8.8', load)).reason, 'public-browser-unverified')
  for (const p of ['/llms.txt', '/llms-full.txt', '/llms-full.txt/', '/reference/topic/hdp-eclampsia.md', '/%72eference/topic/a.md', '/%6clms-full.txt', '/content-index.json', '/clinical-sources.json']) {
    assert.equal((await evaluateCrawlerRequest(request(browser, p), '8.8.8.8', load)).action, 'deny', p)
    assert.equal((await evaluateCrawlerRequest(request('OAI-SearchBot/1.4', p), '198.51.100.1', load)).action, 'allow', p)
  }
})

test('robots and XML sitemap are discoverable without trusting the caller', async () => {
  for (const p of ['/robots.txt', '/sitemap.xml']) assert.equal((await evaluateCrawlerRequest(request('curl/8', p), '', load)).reason, 'public-discovery')
})

test('verification failures do not grant access and can be retried', async () => {
  assert.equal((await evaluateCrawlerRequest(request('OAI-SearchBot/1.4'), '198.51.100.1', async () => { throw new Error('feed down') })).action, 'unavailable')
  assert.equal((await evaluateCrawlerRequest(request('OAI-SearchBot/1.4'), 'not an IP', load)).action, 'deny')
})

test('IPv4, IPv6 and mapped IPv4 checks respect CIDR boundaries', () => {
  assert.ok(ipInRanges('66.249.66.1', ranges['google-common']))
  assert.ok(ipInRanges('2001:4860:4801:10::1', ranges['google-common']))
  assert.ok(ipInRanges('::ffff:66.249.66.1', ranges['google-common']))
  assert.ok(!ipInRanges('66.249.96.1', ranges['google-common']))
  assert.ok(!ipInRanges('2001:4860:4802::1', ranges['google-common']))
  assert.ok(!ipInRanges('127.0.0.1', ranges['google-common']))
  assert.ok(!ipInRanges('66.249.66.1, 8.8.8.8', ranges['google-common']))
  assert.throws(() => parseRanges({ prefixes: [{ ipv4Prefix: '0.0.0.0/0' }] }))
  assert.throws(() => parseRanges({ prefixes: [] }))
  assert.throws(() => parseRanges({ prefixes: [{ ipv4Prefix: 'invalid' }] }))
})

test('the edge adapter enforces denials without caching them as public content', async () => {
  const response = await crawlerAccess(request('Bytespider', '/assets/app.js'), { ip: '8.8.8.8' } as never)
  assert.equal(response?.status, 403)
  assert.equal(response?.headers.get('cache-control'), 'private, no-store')
  assert.equal(await crawlerAccess(request(browser), { ip: '8.8.8.8' } as never), undefined)
})

test('the edge adapter uses official feed results and fails closed during outages', async () => {
  const originalFetch = globalThis.fetch
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({ prefixes: [{ ipv4Prefix: '198.51.100.0/25' }] }))
    assert.equal(await crawlerAccess(request('OAI-SearchBot/1.4', '/llms-full.txt'), { ip: '198.51.100.1' } as never), undefined)
    assert.equal((await crawlerAccess(request('OAI-SearchBot/1.4', '/llms-full.txt', { 'x-forwarded-for': '198.51.100.1' }), { ip: '8.8.8.8' } as never))?.status, 403)
    let failures = 0
    globalThis.fetch = async () => { failures++; throw new Error('feed offline') }
    for (let i = 0; i < 2; i++) {
      const response = await crawlerAccess(request('ChatGPT-User/1.0'), { ip: '198.51.100.129' } as never)
      assert.equal(response?.status, 503)
      assert.equal(response?.headers.get('retry-after'), '900')
      assert.equal(response?.headers.get('x-robots-tag'), null)
    }
    assert.equal(failures, 1, 'A feed outage should not trigger a fresh network request on every hit')
  } finally { globalThis.fetch = originalFetch }
})
