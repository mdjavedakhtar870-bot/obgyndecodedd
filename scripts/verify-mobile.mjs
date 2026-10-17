import assert from 'node:assert/strict'
import { readFile, stat, mkdir } from 'node:fs/promises'
import { createServer } from 'node:http'
import { resolve, extname, join } from 'node:path'
import { chromium } from 'playwright-core'

const root = resolve('dist')
const screenshots = process.env.MOBILE_QA_SCREENSHOTS
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' }
const server = createServer(async (request, response) => {
  try {
    let file = resolve(root, `.${new URL(request.url, 'http://localhost').pathname}`)
    if (!file.startsWith(`${root}/`) && file !== root) throw new Error('Invalid path')
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
    response.setHeader('Content-Type', mime[extname(file)] || 'text/plain')
    response.end(await readFile(file))
  } catch { response.writeHead(404, { 'Content-Type': 'text/html' }); response.end(await readFile(join(root, '404.html'))) }
})
await new Promise((done) => server.listen(0, '127.0.0.1', done))
const origin = `http://127.0.0.1:${server.address().port}`
const launch = () => chromium.launch({ executablePath: process.env.MOBILE_QA_BROWSER_PATH || undefined, headless: true, args: process.env.MOBILE_QA_SERVERLESS ? ['--no-sandbox', '--disable-setuid-sandbox', '--no-zygote', '--single-process', '--disable-gpu'] : [] })
let browser = await launch()
let count = 0
try {
  const index = JSON.parse(await readFile('dist/content-index.json', 'utf8'))
  const paths = [...index.pages.map((p) => new URL(p.url).pathname), '/profile/', '/404.html']
  const samples = ['/', '/browse/', '/topic/hdp-eclampsia/', '/topic/pul/', '/topic/sti-chlamydia/', '/topic/ectopic-pregnancy/', '/emergency/emg-pph/', '/drug/magnesium-sulfate/', '/drug/oxytocin/', '/calculator/edd-ga/', '/procedure/proc-pap-colposcopy/', '/ddx/', '/sources/', '/sitemap/']
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } })
  const page = await context.newPage()
  async function widthCheck(path, width) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto(`${origin}${path}`)
    const layout = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth, main: document.querySelector('main').getBoundingClientRect().width }))
    if (layout.width > width + 1) console.log('Overflow details', path, layout, await page.locator('body *').evaluateAll((nodes) => nodes.filter((node) => node.getBoundingClientRect().width && (node.getBoundingClientRect().right > innerWidth + 1 || node.scrollWidth > node.clientWidth + 1)).slice(-12).map((node) => ({ tag: node.tagName, class: node.className, text: node.textContent.slice(0, 130), right: node.getBoundingClientRect().right, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth, minWidth: getComputedStyle(node).minWidth }))))
    assert.equal(layout.viewport, width, `${path} expanded the viewport at ${width}px`)
    assert.ok(layout.width <= width + 1, `${path}: ${layout.width}px page overflows ${width}px screen`)
    assert.ok(layout.main > 0 && layout.main <= width, `${path}: main content is outside the screen`)
    count++
  }
  for (const width of [320, 390]) {
    for (const path of paths) await widthCheck(path, width)
    console.log(`All ${paths.length} pages fit ${width}px before JavaScript`)
  }
  for (const width of [768, 1440]) for (const path of samples) await widthCheck(path, width)
  await context.close()
  // Serverless Chromium uses a single process; use a fresh process when
  // switching from the no-JavaScript pass to the interactive browser context.
  await browser.close()
  browser = await launch()

  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const p = await phone.newPage()
  const errors = []
  p.on('pageerror', (e) => errors.push(e.message))
  async function open(path) {
    await p.goto(`${origin}${path}`)
    await p.waitForFunction(() => document.documentElement.hasAttribute('data-theme'))
  }
  async function screenshot(name) {
    if (!screenshots) return
    await mkdir(screenshots, { recursive: true })
    await p.screenshot({ path: join(screenshots, `${name}.png`) })
  }
  await open('/')
  await screenshot('home-390')
  for (const [name, path] of [['Calculators', '/calculators/'], ['Drugs', '/drugs/'], ['Procedures', '/procedures/'], ['Guidelines & sources', '/sources/']]) {
    await p.getByRole('button', { name: 'Open menu', exact: true }).click()
    const dialog = p.getByRole('dialog')
    assert.equal(await dialog.count(), 1)
    await dialog.getByRole('link', { name, exact: true }).click()
    await p.waitForURL(`${origin}${path}`)
    assert.equal(await p.getByRole('dialog').count(), 0, 'Menu did not close after navigation')
  }
  await p.getByRole('button', { name: 'Open menu', exact: true }).click()
  await screenshot('menu-390')
  await p.keyboard.press('Escape')
  assert.equal(await p.getByRole('dialog').count(), 0)
  assert.equal(await p.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Open menu', 'Menu did not restore focus')
  await p.locator('header.topbar').getByRole('button', { name: 'Search clinical content', exact: true }).click()
  await p.getByRole('textbox', { name: 'Condition, symptom, drug or calculator' }).fill('nonviable organisms')
  await p.getByRole('dialog').getByRole('button', { name: /Chlamydia in Pregnancy/ }).click()
  await p.waitForURL(`${origin}/topic/sti-chlamydia/`)
  assert.equal(await p.locator('.tab-panel[hidden]').count(), 0, 'Full guide hides clinical sections')
  await screenshot('clinical-detail-390')
  await p.getByRole('button', { name: 'Full guide', exact: false }).click()
  const sources = p.getByRole('tab', { name: /^Sources/ })
  await sources.click()
  await sources.press('Home')
  assert.equal(await p.getByRole('tab', { selected: true }).innerText(), 'Clinical detail')
  await p.getByRole('button', { name: 'Read full guide', exact: false }).click()
  assert.equal(await p.locator('.tab-panel[hidden]').count(), 0)

  await open('/drug/magnesium-sulfate/')
  await screenshot('drug-390')
  const cells = p.locator('main table.clinical tbody tr').first().locator('td')
  for (const cell of await cells.all()) assert.ok(await cell.locator('.cell-label').isVisible(), 'Mobile drug cell has lost its field label')
  const controls = await p.locator('.topbar button, .bottom-nav > *, input.input, select.input').evaluateAll((nodes) => nodes.filter((n) => n.getBoundingClientRect().width).map((n) => ({ text: n.getAttribute('aria-label') || n.textContent, width: n.getBoundingClientRect().width, height: n.getBoundingClientRect().height, font: parseFloat(getComputedStyle(n).fontSize) })))
  for (const control of controls) assert.ok(control.width >= 44 && control.height >= 44, `Small phone control: ${JSON.stringify(control)}`)
  await p.addStyleTag({ content: 'html { font-size: 20px }' })
  assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Enlarged text overflows the phone')

  for (const path of samples) {
    await open(path)
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} overflows after hydration`)
  }
  assert.deepEqual(errors, [], 'Production hydration or interaction errors')
  await p.setViewportSize({ width: 1440, height: 960 })
  await open('/')
  assert.ok(await p.locator('.sidebar').isVisible())
  assert.ok(!await p.locator('.bottom-nav').isVisible())
  await screenshot('home-1440')
  await phone.close()
  console.log(`${count} layout checks passed; phone menu, focus, search, full guide, keyboard tabs, labelled dose cards, enlarged text, hydration and desktop navigation passed.`)
} finally {
  await browser.close()
  await new Promise((done) => server.close(done))
}
