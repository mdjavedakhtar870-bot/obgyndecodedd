import ipaddr from 'ipaddr.js'

// Shared policy stays outside the function entrypoint directory.

export type FeedId = 'google-common' | 'google-user' | 'openai-search' | 'openai-user' | 'openai-training' | 'anthropic'
export const FEED_URLS: Record<FeedId, string> = {
  'google-common': 'https://developers.google.com/static/crawling/ipranges/common-crawlers.json',
  // This is the Google-controlled list, NOT the customer-controlled fetchers
  // list and NOT the much broader general Google Cloud ranges.
  'google-user': 'https://developers.google.com/static/crawling/ipranges/user-triggered-fetchers-google.json',
  'openai-search': 'https://openai.com/searchbot.json',
  'openai-user': 'https://openai.com/chatgpt-user.json',
  'openai-training': 'https://openai.com/gptbot.json',
  anthropic: 'https://claude.com/crawling/bots.json',
}

export type Decision = { action: 'allow' | 'deny' | 'unavailable'; reason: string }
export type LoadRanges = (feed: FeedId) => Promise<string[]>

function canonicalIp(value: string) {
  const parsed = ipaddr.parse(value)
  return parsed.kind() === 'ipv6' && (parsed as ipaddr.IPv6).isIPv4MappedAddress() ? (parsed as ipaddr.IPv6).toIPv4Address() : parsed
}
export function ipInRanges(ip: string, ranges: string[]): boolean {
  try {
    const address = canonicalIp(ip)
    return ranges.some((cidr) => {
      try {
        const [network, bits] = ipaddr.parseCIDR(cidr)
        return address.kind() === network.kind() && address.match(network as never, bits)
      } catch { return false }
    })
  } catch { return false }
}

export function parseRanges(value: unknown): string[] {
  if (!value || typeof value !== 'object' || !('prefixes' in value) || !Array.isArray(value.prefixes) || !value.prefixes.length || value.prefixes.length > 5000) throw new Error('Invalid crawler range feed')
  return value.prefixes.map((entry: unknown) => {
    if (!entry || typeof entry !== 'object') throw new Error('Invalid prefix')
    const p = entry as { ipv4Prefix?: unknown; ipv6Prefix?: unknown }
    const cidr = p.ipv4Prefix || p.ipv6Prefix
    if (typeof cidr !== 'string') throw new Error('Missing CIDR')
    const [, bits] = ipaddr.parseCIDR(cidr)
    if (bits === 0) throw new Error('Refusing a whole-internet allow range')
    return cidr
  })
}

function normalizePath(path: string): string {
  for (let i = 0; i < 2; i++) path = decodeURIComponent(path)
  if (path.includes('%') || path.includes('\\') || path.split('/').includes('..')) throw new Error('Invalid path encoding')
  return path.replace(/\/+/g, '/').replace(/\/+$/, '').toLowerCase() || '/'
}

function isExport(path: string): boolean {
  return path.startsWith('/reference/') || ['/reference', '/llms.txt', '/llms-full.txt', '/content-index.json', '/clinical-sources.json'].includes(path)
}

// A token is a candidate identity, never proof. Every candidate must also pass
// the matching dedicated network check using the platform-provided client IP.
function candidate(ua: string): { name: string; feeds: FeedId[] } | undefined {
  if (/\bOAI-SearchBot\b/i.test(ua)) return { name: 'ChatGPT search', feeds: ['openai-search'] }
  if (/\bChatGPT-User\b/i.test(ua)) return { name: 'ChatGPT user retrieval', feeds: ['openai-user'] }
  if (/\bGPTBot\b/i.test(ua)) return { name: 'OpenAI', feeds: ['openai-training'] }
  if (/\bClaude(?:Bot|-SearchBot|-User)\b/i.test(ua)) return { name: 'Claude', feeds: ['anthropic'] }
  if (/\b(?:Googlebot(?:-Image|-Video)?|Google-InspectionTool|Google-CloudVertexBot)\b/i.test(ua)) return { name: 'Google Search/Vertex', feeds: ['google-common'] }
  if (/\bGoogle-GeminiNotebook\b/i.test(ua)) return { name: 'Gemini Notebook retrieval', feeds: ['google-user'] }
  return undefined
}

const AUTOMATED = /bot\b|crawler|spider|scrap(?:e|er|ing)|headless|python|curl\b|wget\b|httpclient|go-http-client|node-fetch|undici|axios|aiohttp|requests\b|selenium|playwright|puppeteer|facebookexternalhit|whatsapp|GPT|Claude|Gemini|Grok|muse\.ai|MuseBot|GoogleOther|Google-Agent|Google-NotebookLM|Google-CWS|GoogleMessages|Google-Pinpoint|GoogleProducer|Google-Read-Aloud|Perplexity|DeepSeek|Qwen|Meta-External|Amazon-User|Ahrefs|Semrush/i

export async function evaluateCrawlerRequest(request: Request, trustedIp: string, load: LoadRanges): Promise<Decision> {
  let path: string
  try { path = normalizePath(new URL(request.url).pathname) } catch { return { action: 'deny', reason: 'invalid-path' } }
  if (path === '/robots.txt' || path === '/sitemap.xml') return { action: 'allow', reason: 'public-discovery' }
  const ua = request.headers.get('user-agent') || ''
  const who = candidate(ua)
  if (who) {
    try {
      const sets = await Promise.all(who.feeds.map(load))
      return sets.some((ranges) => ipInRanges(trustedIp, ranges)) ? { action: 'allow', reason: `verified-${who.name}` } : { action: 'deny', reason: 'unverified-provider-claim' }
    } catch { return { action: 'unavailable', reason: 'verification-unavailable' } }
  }
  // Full text/JSON dumps have no anonymous browser exception. The clinical
  // HTML app remains public because that is the owner's explicit choice.
  if (isExport(path)) return { action: 'deny', reason: 'export-requires-verified-crawler' }
  if (!ua || AUTOMATED.test(ua)) return { action: 'deny', reason: 'non-allowlisted-automation' }
  if (/^Mozilla\/5\.0\b.*(?:AppleWebKit|Gecko)/i.test(ua)) return { action: 'allow', reason: 'public-browser-unverified' }
  return { action: 'deny', reason: 'unrecognized-client' }
}
