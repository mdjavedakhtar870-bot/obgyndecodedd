import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync, readdirSync } from 'node:fs'
import { JSDOM, VirtualConsole } from 'jsdom'
import { ALL_TOPICS, CALCULATORS, DRUGS } from '../src/content'
import { getPage, pageUrl } from '../src/lib/seo'

const bundle = readFileSync(`dist/assets/${readdirSync('dist/assets').find((f) => f.endsWith('.js'))}`, 'utf8')
const origin = 'https://obgyndecodedd.netlify.app'
const pause = () => new Promise((r) => setTimeout(r, 10))
async function until(predicate: () => unknown, message: string) {
  for (let i = 0; i < 200; i++) { if (predicate()) return; await pause() }
  assert.fail(message)
}
async function boot(path: string, favourites: string[] = []) {
  const errors: string[] = []
  const virtualConsole = new VirtualConsole()
  virtualConsole.on('error', (...args) => errors.push(args.map(String).join(' ')))
  virtualConsole.on('jsdomError', (error) => errors.push(String(error)))
  const file = path === '/' ? 'dist/index.html' : `dist${path}/index.html`
  const dom = new JSDOM(readFileSync(file, 'utf8'), { url: pageUrl(origin, path), runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole })
  const w = dom.window
  w.scrollTo = () => {}
  w.localStorage.setItem('od.theme', 'light')
  w.localStorage.setItem('od.favs', JSON.stringify(favourites))
  w.eval(bundle)
  await until(() => w.document.documentElement.getAttribute('data-theme') === 'light', 'Client did not hydrate and run its effects')
  return { dom, w, d: w.document, errors }
}

test('production HTML hydrates with device preferences and tab/source controls remain usable', async () => {
  const topic = ALL_TOPICS.find((t) => t.id === 'hdp-eclampsia')!
  const { dom, w, d, errors } = await boot(`/topic/${topic.id}`, [topic.id])
  try {
    const favourite = d.querySelector<HTMLButtonElement>('button[title="Favourite"]')!
    await until(() => favourite.textContent === '★', 'Saved favourite was not restored')
    favourite.click()
    await until(() => favourite.textContent === '☆', 'Favourite control did not update')
    const sources = [...d.querySelectorAll<HTMLButtonElement>('[role="tab"]')].find((n) => n.textContent!.startsWith('Sources'))!
    sources.click()
    const panel = d.getElementById(sources.getAttribute('aria-controls')!)!
    await until(() => !panel.hidden, 'Sources panel did not open')
    assert.ok(panel.textContent!.includes('Open source'))
    assert.ok(!JSON.parse(w.localStorage.getItem('od.favs')!).includes(topic.id))
    assert.deepEqual(errors, [], 'Hydration or client errors')
  } finally { dom.window.close() }
})

test('in-app navigation updates canonical, title and schema without duplicate head tags', async () => {
  const { dom, w, d, errors } = await boot('/')
  try {
    d.querySelector<HTMLAnchorElement>('a[href="/drugs/"]')!.click()
    await until(() => w.location.pathname === '/drugs/' && d.title === getPage('/drugs')!.title, 'Drug directory navigation/metadata failed')
    const details = d.querySelector<HTMLDetailsElement>('main details')!
    details.open = true
    const path = `/drug/${DRUGS[0].id}/`
    d.querySelector<HTMLAnchorElement>(`main a[href="${path}"]`)!.click()
    await until(() => w.location.pathname === path && d.title === getPage(path)!.title, 'Direct drug navigation/metadata failed')
    assert.equal(d.querySelectorAll('title').length, 1)
    assert.equal(d.querySelectorAll('meta[name="description"]').length, 1)
    assert.equal(d.querySelectorAll('link[rel="canonical"]').length, 1)
    assert.equal(d.querySelector('link[rel="canonical"]')!.getAttribute('href'), `${origin}${path}`)
    assert.equal(d.querySelectorAll('#page-schema').length, 1)
    w.history.pushState({}, '', '/not-a-real-page')
    w.dispatchEvent(new w.PopStateEvent('popstate'))
    await until(() => d.querySelector('h1')!.textContent === 'Page not found', 'Missing route did not show the 404 page')
    await until(() => d.querySelector('meta[name="robots"]')!.getAttribute('content')!.startsWith('noindex'), '404 metadata was not updated')
    assert.deepEqual(errors, [], 'Hydration or navigation errors')
  } finally { dom.window.close() }
})

test('calculator inputs remain interactive after prerendering and have no empty-input result', async () => {
  const calc = CALCULATORS.find((c) => /\bBMI\b/i.test(c.name))!
  const { dom, w, d, errors } = await boot(`/calculator/${calc.id}`)
  try {
    assert.equal(d.querySelector('main .block-info, main .block-warning'), null)
    const inputs = [...d.querySelectorAll<HTMLInputElement>('main input')]
    const setter = Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype, 'value')!.set!
    for (let i = 0; i < inputs.length; i++) {
      const def = calc.inputs[i]
      const value = /height/i.test(def.label) ? def.unit === 'm' ? '1.7' : '170' : '70'
      setter.call(inputs[i], value)
      inputs[i].dispatchEvent(new w.Event('input', { bubbles: true }))
      await pause()
    }
    await until(() => d.querySelector('main .block-info')?.textContent?.includes('24.2'), 'BMI calculator no longer responds to inputs')
    assert.deepEqual(errors, [], 'Hydration or calculator errors')
  } finally { dom.window.close() }
})
