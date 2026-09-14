/* Content integrity tests: validate the bundled clinical library (no server, no auth).
   Run with: npm test */
import assert from 'node:assert/strict'
import test from 'node:test'
import { ALL_TOPICS, EMERGENCIES, DRUGS, CALCULATORS, PROCEDURES, DDx_PRESENTATIONS, SOURCES } from '../src/content/index'

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
  for (const d of DRUGS) if (d.sourceId) assert.ok(sourceIds.has(d.sourceId), `drug ${d.id}: unknown sourceId "${d.sourceId}"`)
  for (const c of CALCULATORS) if (c.sourceId) assert.ok(sourceIds.has(c.sourceId), `calculator ${c.id}: unknown sourceId "${c.sourceId}"`)
})
