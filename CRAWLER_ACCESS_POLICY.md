# Crawler access policy

Owner instruction, 17 October 2026: allow Gemini, ChatGPT, muse.ai, Grok and Claude; deny other identified automated clients. Keep the clinical pages public to doctors without sign-in. Treat a Google referrer, device type and apparent location as untrusted.

## Enforcement

`netlify/edge-functions/crawler-access.ts` runs before static file delivery on all paths. It uses Netlify's `context.ip`, never `X-Forwarded-For`, `X-Real-IP`, a query parameter or a Referer as proof of origin. Supported declared bots must match the official provider's dedicated published crawler networks. Failed identity checks deny access. A temporary verification-feed outage returns 503 instead of granting access. IPv4 and IPv6 are both checked.

`robots.txt` denies unspecified agents by default and permits documented Google, OpenAI and Anthropic agents. This communicates preferences; the edge function is the enforcement layer. The robots file and XML sitemap remain readable so crawlers can discover the rules and canonical URLs. Text/JSON exports require a verified supported crawler, even if the request uses a browser-like User-Agent.

## Provider identities

| Intended service | Verification source | Current support |
| --- | --- | --- |
| Gemini / Google Search | Google's dedicated common-crawler and Google-controlled user-triggered-fetcher ranges | Verified range check; excludes general Google Cloud ranges and customer-controlled fetchers |
| ChatGPT / OpenAI | `openai.com/searchbot.json`, `openai.com/chatgpt-user.json`, `openai.com/gptbot.json` | Verified range check per documented agent |
| Claude / Anthropic | `claude.com/crawling/bots.json`, linked by Anthropic's crawler documentation | Verified range check |
| Grok | No dedicated official verifiable crawler identity source established in this research | No automatic exception; requests claiming this service are denied until verified support is added |
| muse.ai | No dedicated official verifiable crawler identity source established in this research | No automatic exception; requests claiming this service are denied until verified support is added |

No broad network, guessed crawler identity, IP copied from a third-party bot directory or client-supplied claim is an acceptable replacement for provider verification.

## Public access limits accepted by the owner

Keeping pages public means unidentified automation can imitate an ordinary browser. The public JavaScript bundle contains clinical content, and the public GitHub repository also contains the source. These are not closed by robots rules or by a declared-bot filter. Allowed AI services may also answer user questions using retrieved public information; origin checks cannot determine the identity or intentions of every downstream user.

A materially stronger confidentiality boundary would require authenticated doctor access, removing protected content from public bundles and making the repository private. That is not the owner's selected access mode. Do not claim that this implementation achieves a five-service-only guarantee against all scraping.

## Sources researched

- Google AI/search requirements: https://developers.google.com/search/docs/appearance/ai-features
- Google JavaScript rendering: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google request verification: https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests
- OpenAI crawlers and dedicated range feeds: https://developers.openai.com/api/docs/bots
- Anthropic crawlers and official range feed: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler

Do not confuse this SEO/crawler work with a new clinical audit. Existing clinical content and its authored verification statuses have not been independently reverified by this change.

## Search Console ownership verification — 18 October 2026

The owner authorised deploying the supplied HTML verification tag. `Google-Site-Verification` is recognised only for homepage GET/HEAD requests and must match `user-triggered-fetchers-google.json` using trusted `context.ip`. It receives no exception for clinical pages, assets or text exports. Other Google user-triggered tools and customer-controlled Google Cloud fetchers remain outside this exception. Feed failure still returns 503, and forged names/referrers/forwarded IPs are denied.

References checked: https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers and https://support.google.com/webmasters/answer/9008080 .
