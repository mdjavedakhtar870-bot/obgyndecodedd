import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPage, NOT_FOUND_PAGE, metadataHtml } from '../lib/seo'

declare const __SITE_ORIGIN__: string
declare const __SITE_INDEXABLE__: boolean

// The same metadata is written into each HTML file at build time. This effect
// keeps it correct after in-app navigation without waiting for a page reload.
export function PageMetadata() {
  const { pathname } = useLocation()
  useEffect(() => {
    const p = getPage(pathname) || NOT_FOUND_PAGE
    const origin = typeof __SITE_ORIGIN__ === 'string' ? __SITE_ORIGIN__ : window.location.origin
    const indexable = typeof __SITE_INDEXABLE__ === 'boolean' ? __SITE_INDEXABLE__ : false
    const template = document.createElement('template')
    template.innerHTML = metadataHtml(p, origin, indexable)
    document.head.querySelectorAll('title, meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], link[rel="sitemap"], link[title="AI-readable site directory"], #page-schema').forEach((node) => node.remove())
    document.head.append(template.content)
  }, [pathname])
  return null
}
