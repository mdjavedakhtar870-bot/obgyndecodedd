export function resolveSiteConfig(env: Record<string, string | undefined> = process.env) {
  // Netlify supplies URL for the production site's primary domain, including
  // custom domains. DEPLOY_URL must not become a canonical production URL.
  const value = env.SITE_URL || env.URL || 'https://obgyndecodedd.netlify.app'
  const parsed = new URL(value)
  // The Netlify API may report an HTTP primary URL even though its .netlify.app
  // domain supports automatic HTTPS. Canonical pages use the verified HTTPS URL.
  if (parsed.protocol === 'http:' && parsed.hostname.endsWith('.netlify.app')) parsed.protocol = 'https:'
  if (parsed.pathname !== '/' || parsed.search || parsed.hash || parsed.username || parsed.password) {
    throw new Error('SITE_URL/URL must be a site origin without a path, credentials, query or fragment.')
  }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)
  if (parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:')) throw new Error('The public site URL must use HTTPS.')
  if (env.NETLIFY === 'true' && local) throw new Error('Netlify did not supply a public URL; refusing to publish localhost canonical links.')
  const preview = ['deploy-preview', 'branch-deploy', 'dev'].includes(env.CONTEXT || '')
  return { origin: parsed.origin, indexable: !local && !preview }
}
