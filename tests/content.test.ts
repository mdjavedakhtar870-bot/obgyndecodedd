/* Content integrity tests: validate the bundled clinical library (no server, no auth).
   Run with: npm test */
import assert from 'node:assert/strict'
import test from 'node:test'
import { ALL_TOPICS, EMERGENCIES, DRUGS, CALCULATORS, PROCEDURES, DDx_PRESENTATIONS, SOURCES } from '../src/content/index'
import { CLINICAL_DETAILS } from '../src/content/clinical-details'
import { REGIMENS } from '../src/content/medication-regimens'
import { TOPIC_REGIMENS } from '../src/content/medication-audit'
import { ANTENATAL_CONTACTS, ANTENATAL_DETAIL } from '../src/content/antenatal-care'
import catalogue from '../data/drug-catalogue.json'
import protocols from '../data/emergency-protocols.json'
import type { Block } from '../src/content/types'

const sourceIds = new Set(SOURCES.map((s) => s.id))

test('antenatal guidance keeps an eight-contact calendar and separate trimester investigation windows', () => {
  const topic = ALL_TOPICS.find((t) => t.id === 'anc-overview')!
  assert.equal(topic.clinicalDetail, ANTENATAL_DETAIL)
  assert.equal(topic.status, 'review')
  assert.equal(ANTENATAL_CONTACTS.rows.length, 8)
  for (const [label, count] of [['First', 1], ['Second', 2], ['Third', 5]] as const) assert.equal(ANTENATAL_CONTACTS.rows.filter((r) => r[0].includes(label)).length, count)
  assert.deepEqual(ANTENATAL_CONTACTS.rows.slice(1).map((r) => r[1]), ['20 weeks', '26 weeks', '30 weeks', '34 weeks', '36 weeks', '38 weeks', '40 weeks'])
  const tables = ANTENATAL_DETAIL.blocks!.filter((b) => b.kind === 'table')
  assert.equal(new Set(tables.map((b) => b.id)).size, tables.length)
  for (const trimester of ['first', 'second', 'third']) assert.ok(tables.some((b) => b.id === `antenatal-${trimester}-trimester` && b.rows.length >= 5))
  const text = JSON.stringify(topic)
  for (const detail of ['75 g', '300 mL', '5–10', '≥140 mg/dL', 'at least 4 weeks', '11+2–14+1', '18+0–20+6', 'after 28 weeks', '10 routine appointments', '7 for a woman']) assert.ok(text.includes(detail), `ANC missing ${detail}`)
  assert.doesNotMatch(text, /CBC each trimester|34\/36.*Rh prophylaxis/)
})

test('diabetes dependencies keep diagnostic frameworks and complete rescue treatment distinct', () => {
  const topic = ALL_TOPICS.find((t) => t.id === 'gdm')!
  assert.ok(topic.sourceIds.includes('anc-india-gdm') && topic.sourceIds.includes('nice-ng3-detail'))
  const text = JSON.stringify(topic)
  assert.doesNotMatch(text, /DIPSI\/WHO|WHO\/DIPSI|500-1000 mg BD-TDS|1 U per 4 g glucose|50% dextrose 50 mL/)
  for (const detail of ['≥5.6 mmol/L', '≥7.8 mmol/L', '≥140 mg/dL', '6 weeks postpartum', '6–13 weeks', '40+6', 'at or after 39 weeks']) assert.ok(text.includes(detail), `GDM missing ${detail}`)
  assert.ok(topic.treatment!.rescue!.filter((b) => b.kind === 'doseCard').length === 2)
  const preexisting = JSON.stringify(ALL_TOPICS.find((t) => t.id === 'pregestational-diabetes'))
  assert.match(preexisting, /below 6.5%/)
  assert.doesNotMatch(preexisting, /HbA1c monthly|eGFR\/ACR monthly|25-50%|4-4.25 kg/)
})

function assertUniqueIds(items: { id: string }[], label: string) {
  const seen = new Set<string>()
  for (const it of items) {
    assert.ok(it.id, `${label}: item with missing id`)
    assert.ok(!seen.has(it.id), `${label}: duplicate id "${it.id}"`)
    seen.add(it.id)
  }
}

test('collection ids are unique', () => {
  assertUniqueIds(ALL_TOPICS, 'topics')
  assertUniqueIds(EMERGENCIES, 'emergencies')
  assertUniqueIds(DRUGS, 'drugs')
  assertUniqueIds(CALCULATORS, 'calculators')
  assertUniqueIds(PROCEDURES, 'procedures')
  assertUniqueIds(DDx_PRESENTATIONS, 'ddx presentations')
})

test('all source references resolve against the clinical source registry', () => {
  for (const t of ALL_TOPICS) for (const sid of t.sourceIds) assert.ok(sourceIds.has(sid), `topic ${t.id}: unknown sourceId "${sid}"`)
  for (const e of EMERGENCIES) for (const sid of e.sourceIds) assert.ok(sourceIds.has(sid), `emergency ${e.id}: unknown sourceId "${sid}"`)
  for (const p of PROCEDURES) for (const sid of p.sourceIds) assert.ok(sourceIds.has(sid), `procedure ${p.id}: unknown sourceId "${sid}"`)
  for (const d of DRUGS) {
    if (d.sourceId) assert.ok(sourceIds.has(d.sourceId), `drug ${d.id}: unknown sourceId "${d.sourceId}"`)
    for (const row of d.doseRows) if (row.sourceId) assert.ok(sourceIds.has(row.sourceId), `drug ${d.id}: unknown dose-row source ${row.sourceId}`)
  }
  for (const c of CALCULATORS) if (c.sourceId) assert.ok(sourceIds.has(c.sourceId), `calculator ${c.id}: unknown sourceId "${c.sourceId}"`)
})

test('additional clinical detail belongs to a real topic and has dated, scoped source checks', () => {
  for (const [id, detail] of Object.entries(CLINICAL_DETAILS)) {
    const topic = ALL_TOPICS.find((t) => t.id === id)
    assert.ok(topic, `Orphan clinical detail: ${id}`)
    assert.ok(detail.sourceIds.length, `${id}: no detail sources`)
    assert.match(detail.checkedAt, /^\d{4}-\d{2}-\d{2}$/)
    for (const sid of detail.sourceIds) {
      const source = SOURCES.find((s) => s.id === sid)
      assert.ok(source?.dateChecked && source.checkedAgainst, `${id}: missing source check scope for ${sid}`)
      assert.ok(source.dateChecked >= detail.checkedAt, `${id}: detail postdates its source check`)
      assert.ok(topic.sourceIds.includes(sid), `${id}: clinical detail source omitted from page citations`)
    }
  }
})

test('early-pregnancy corrections do not retain the unrelated membrane-rupture reference or automatic methotrexate redosing', () => {
  for (const id of ['pul', 'ectopic-pregnancy', 'miscarriage-management', 'recurrent-miscarriage']) {
    const topic = ALL_TOPICS.find((t) => t.id === id)!
    assert.ok(!topic.sourceIds.includes('rcog-gtg73-pprom-2019'), id)
    assert.equal(topic.status, 'review', id)
    assert.equal(topic.lastVerifiedAt, undefined, `${id}: partial corrections must not certify the entire module`)
  }
  const ectopic = ALL_TOPICS.find((t) => t.id === 'ectopic-pregnancy')!
  assert.ok(!JSON.stringify(ectopic.treatment).includes('or +15%'))
  const mtx = DRUGS.find((d) => d.id === 'methotrexate-ectopic')!
  assert.ok(mtx.doseRows.some((row) => row.notes?.some((n) => n.includes('do not automatically redose'))))
})

test('every medication regimen is complete, traceable and used by a drug reference', () => {
  const used = new Set(catalogue.flatMap((d) => d.regimens))
  for (const [id, r] of Object.entries(REGIMENS)) {
    for (const key of ['drug', 'indication', 'dose', 'route', 'frequency', 'duration', 'preparation', 'maxDose', 'sourceId'] as const) {
      assert.ok(r[key]?.trim(), `${id}: missing ${key}`)
      assert.doesNotMatch(r[key], /as per protocol|per protocol|not recorded|to be added/i, `${id}: placeholder ${key}`)
    }
    assert.ok(r.monitoring.length && r.contraindications.length, `${id}: missing safety assessment`)
    const source = SOURCES.find((s) => s.id === r.sourceId)
    assert.ok(source?.dateChecked && source.checkedAgainst, `${id}: source lacks a check scope`)
    assert.ok(used.has(id), `${id}: no drug reference`)
  }
  for (const d of catalogue) for (const id of d.regimens) assert.ok(id in REGIMENS, `${d.id}: missing regimen ${id}`)
  for (const d of DRUGS) {
    assert.equal(d.regimenCheckedAt, '2026-10-17')
    assert.equal(d.status, 'review', `${d.id}: a regimen check must not certify the full reference`)
    for (const r of d.doseRows) assert.ok(r.frequency && r.duration && r.preparation && r.max && r.sourceId && r.monitoring?.length && r.contraindications?.length, `${d.id}: incomplete displayed row`)
  }
})

test('topic dose cards retain preparation, limits, monitoring and source after assembly', () => {
  function check(value: unknown, id: string) {
    if (!value || typeof value !== 'object') return
    const block = value as Block
    if (block.kind === 'doseCard') {
      for (const key of ['dose', 'route', 'frequency', 'duration', 'prep', 'maxDose', 'sourceId'] as const) assert.ok(block[key], `${id}/${block.drug}: missing ${key}`)
      assert.ok(sourceIds.has(block.sourceId!), `${id}: unresolved dose source`)
      assert.ok(block.monitoring?.length && block.contraindications?.length, `${id}/${block.drug}: lost safety fields`)
    }
    for (const v of Object.values(value)) if (v && typeof v === 'object') check(v, id)
  }
  for (const t of ALL_TOPICS) check(t.treatment, t.id)
  for (const id of Object.keys(TOPIC_REGIMENS)) {
    const t = ALL_TOPICS.find((t) => t.id === id)!
    assert.ok(t, `Orphan medication audit: ${id}`)
    assert.equal(t.status, 'review')
    assert.equal(t.lastVerifiedAt, undefined)
  }
})

test('all emergency drug lists use the shared indication-specific regimens', () => {
  for (const protocol of protocols) {
    const e = EMERGENCIES.find((e) => e.id === protocol.id)!
    assert.equal(e.status, 'review')
    assert.equal(e.drugs?.length, protocol.regimens.length)
    for (const [i, id] of protocol.regimens.entries()) {
      const r = REGIMENS[id as keyof typeof REGIMENS]
      assert.equal(e.drugs![i], r, `${e.id}: copied/stale regimen ${id}`)
      assert.ok(e.sourceIds.includes(r.sourceId), `${e.id}: regimen source omitted`)
    }
  }
  const pph = EMERGENCIES.find((e) => e.id === 'emg-pph')!
  assert.equal(pph.drugs?.length, 6)
  assert.ok(pph.drugs?.some((d) => d.drug.includes('Carboprost') && d.preparation?.includes('250') && d.maxDose?.includes('2 mg')))
})

test('high-risk corrections remain consistent across dependent modules', () => {
  assert.match(REGIMENS['ampicillin-gbs'].dose, /2 g.*1 g/)
  assert.match(REGIMENS['benzylpenicillin-gbs'].dose, /3 g.*1\.5 g/)
  assert.match(REGIMENS['carboprost-pph'].maxDose, /2 mg/)
  assert.match(REGIMENS['txa-pph'].maxDose, /does NOT permit a first dose/)
  assert.match(REGIMENS['insulin-dka'].preparation, /50/)
  assert.match(REGIMENS['adrenaline-anaphylaxis'].route, /IM/)
  assert.match(REGIMENS['adrenaline-arrest'].dose, /1 mg/)
  assert.match(REGIMENS['iron-fcm'].notes.join(' '), /1500 mg TOTAL/)
  for (const id of ['vte', 'maternal-sepsis']) assert.ok(!ALL_TOPICS.find((t) => t.id === id)!.sourceIds.includes('rcog-gtg36-gbs-2017'))
  const thyroid = JSON.stringify(ALL_TOPICS.find((t) => t.id === 'thyroid-pregnancy'))
  assert.doesNotMatch(thyroid, /Block-replace strategy for high-demand|Switch to carbimazole after T1/)
  assert.match(thyroid, /beyond 20 weeks/)
  assert.doesNotMatch(JSON.stringify(ALL_TOPICS.find((t) => t.id === 'prom-term')), /1\.8 g IV then 900 mg/)
  const mole = ALL_TOPICS.find((t) => t.id === 'molar-pregnancy')!
  assert.ok(mole.sourceIds.includes('med-figo-gtd-2025'))
  assert.ok(!mole.sourceIds.includes('rcog-gtg73-pprom-2019'))
})
