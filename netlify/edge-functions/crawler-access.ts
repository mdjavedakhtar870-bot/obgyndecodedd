import type { Config, Context } from '@netlify/edge-functions'
import { evaluateCrawlerRequest, FEED_URLS, parseRanges, type FeedId } from '../lib/crawler-policy.ts'

const TTL = 60 * 60 * 1000
const cache = new Map<FeedId, { expires: number; ranges: string[] }>()
const pending = new Map<FeedId, Promise<string[]>>()
const failures = new Map<FeedId, number>()

async function load(feed: FeedId): Promise<string[]> {
  const saved = cache.get(feed)
  if (saved && saved.expires > Date.now()) return saved.ranges
  if ((failures.get(feed) || 0) > Date.now()) throw new Error('Crawler verification is temporarily unavailable')
  const inflight = pending.get(feed)
  if (inflight) return inflight
  const job = (async () => {
    const response = await fetch(FEED_URLS[feed], { signal: AbortSignal.timeout(3000), redirect: 'error' })
    if (!response.ok) throw new Error('Crawler feed unavailable')
    const body = await response.text()
    if (body.length > 1_000_000) throw new Error('Crawler feed too large')
    const ranges = parseRanges(JSON.parse(body))
    cache.set(feed, { expires: Date.now() + TTL, ranges })
    failures.delete(feed)
    return ranges
  })()
  pending.set(feed, job)
  try { return await job } catch (error) { failures.set(feed, Date.now() + 60_000); throw error } finally { pending.delete(feed) }
}

export default async function crawlerAccess(request: Request, context: Context) {
  const decision = await evaluateCrawlerRequest(request, context.ip, load)
  if (decision.action === 'allow') return
  const unavailable = decision.action === 'unavailable'
  return new Response(unavailable ? 'Automated identity verification is temporarily unavailable.' : 'Automated access is not permitted or could not be verified.', {
    status: unavailable ? 503 : 403,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store', 'CDN-Cache-Control': 'no-store', 'Netlify-CDN-Cache-Control': 'no-store', ...(unavailable ? { 'Retry-After': '900' } : { 'X-Robots-Tag': 'noindex' }) },
  })
}

// Every path is intentional: otherwise a blocked bot could fetch the same
// content from an asset bundle or a text export. No caching or bypass-on-error.
export const config: Config = { path: '/*', onError: 'fail' }
