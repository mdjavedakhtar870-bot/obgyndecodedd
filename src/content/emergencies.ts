import protocols from '../../data/emergency-protocols.json'
import { REGIMENS, type RegimenId } from './medication-regimens'
import type { EmergencyProtocol } from './types'

export const EMERGENCIES: EmergencyProtocol[] = protocols.map(({ regimens: ids, ...protocol }) => {
  const drugs = ids.map((id) => REGIMENS[id as RegimenId])
  return {
    ...protocol,
    drugs,
    sourceIds: [...new Set([...protocol.sourceIds, ...drugs.map((d) => d.sourceId)])],
  } as EmergencyProtocol
})
