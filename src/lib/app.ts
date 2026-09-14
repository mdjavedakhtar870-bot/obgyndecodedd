/* Static content bundle + local preferences (favourites, recents, theme).
   The clinical library ships inside the app bundle — no sign-in, no API. */

import type { DiseaseTopic, EmergencyProtocol, DrugRecord, CalculatorDef, ProcedureDoc, DDxPresentation } from '../content/types'
import { ALL_TOPICS, EMERGENCIES, DRUGS, CALCULATORS, PROCEDURES, DDx_PRESENTATIONS, SOURCES } from '../content'

export interface PubData {
  topics: DiseaseTopic[]
  emergencies: EmergencyProtocol[]
  drugs: DrugRecord[]
  calculators: CalculatorDef[]
  procedures: ProcedureDoc[]
  ddx: DDxPresentation[]
  sources: unknown[]
}

export const PUBLISHED_CONTENT: PubData = {
  topics: ALL_TOPICS,
  emergencies: EMERGENCIES,
  drugs: DRUGS,
  calculators: CALCULATORS,
  procedures: PROCEDURES,
  ddx: DDx_PRESENTATIONS,
  sources: SOURCES,
}

/* ---------- favourites & recents ---------- */
type ListKey = 'od.favs' | 'od.recents'
function getList(k: ListKey): string[] { try { return JSON.parse(localStorage.getItem(k) || '[]') as string[] } catch { return [] } }
function saveList(k: ListKey, v: string[]) { localStorage.setItem(k, JSON.stringify(v.slice(0, 60))) }
export const favs = {
  has: (id: string) => getList('od.favs').includes(id),
  toggle(id: string) { const l = getList('od.favs'); const i = l.indexOf(id); i >= 0 ? l.splice(i, 1) : l.unshift(id); saveList('od.favs', l); return i < 0 },
  all: () => getList('od.favs'),
}
export const recents = {
  push(id: string) { const l = getList('od.recents').filter((x) => x !== id); l.unshift(id); saveList('od.recents', l) },
  all: () => getList('od.recents'),
}

/* ---------- theme ---------- */
export const theme = {
  init() { const t = localStorage.getItem('od.theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); this.set(t) },
  current(): string { return localStorage.getItem('od.theme') || 'light' },
  set(t: string) { localStorage.setItem('od.theme', t); document.documentElement.setAttribute('data-theme', t) },
  toggle() { this.set(this.current() === 'dark' ? 'light' : 'dark') },
}
