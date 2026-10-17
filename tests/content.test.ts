/* Content integrity tests: validate the bundled clinical library (no server, no auth).
   Run with: npm test */
import assert from 'node:assert/strict'
import test from 'node:test'
import { ALL_TOPICS, EMERGENCIES, DRUGS, CALCULATORS, PROCEDURES, DDx_PRESENTATIONS, SOURCES } from '../src/content/index'
import { CLINICAL_DETAILS } from '../src/content/clinical-details'

const sourceIds = new Set(SOURCES.map((s) => s.id))

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
