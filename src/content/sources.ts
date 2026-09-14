import sourceMap from '../../data/clinical-source-map.json'

export interface SourceEntry {
  id: string
  topic: string
  organisation: string
  title: string
  url: string
  publishedDate?: string
  lastUpdatedDate?: string
  version?: string
  sourceType: string
  region: string
  population?: string
  gestationalAge?: string
  postpartumApplicability?: string
  evidenceLevel?: string
  dateChecked?: string
  checkedAgainst?: string
  usedBySections: string[]
  status: 'verified-live' | 'verified-summary' | 'pending-verification' | 'outdated'
}

export const SOURCES = (sourceMap.sources as unknown) as SourceEntry[]
export const SOURCE_MAP_META = sourceMap.meta

export function getSource(id: string): SourceEntry | undefined {
  return SOURCES.find((s) => s.id === id)
}

export function sourceBadgeLabel(s: SourceEntry): string {
  return `${s.organisation}${s.version ? ` · ${s.version}` : ''}`
}
