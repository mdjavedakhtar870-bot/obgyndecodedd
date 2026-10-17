import { forwardRef } from 'react'
import { Link as RouterLink, NavLink as RouterNavLink, type LinkProps, type NavLinkProps, type To } from 'react-router-dom'
import { canonicalPath, getPage } from '../lib/seo'

// Netlify serves prerendered directory pages with trailing slashes. Keep real
// hrefs on those final URLs so crawlers and full-page navigation avoid a hop.
function canonicalTo(to: To): To {
  if (typeof to !== 'string') return to.pathname && getPage(to.pathname) ? { ...to, pathname: canonicalPath(getPage(to.pathname)!.path) } : to
  if (!to.startsWith('/')) return to
  const [path] = to.split(/[?#]/, 1)
  const page = getPage(path)
  return page ? `${canonicalPath(page.path)}${to.slice(path.length)}` : to
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => <RouterLink {...props} to={canonicalTo(props.to)} ref={ref} />)
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => <RouterNavLink {...props} to={canonicalTo(props.to)} ref={ref} />)
Link.displayName = 'Link'
NavLink.displayName = 'NavLink'
