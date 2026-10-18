import catalogue from '../../data/drug-catalogue.json'
import { REGIMENS, type RegimenId } from './medication-regimens'
import type { DrugRecord, DrugUse, WorkflowStatus } from './types'

// Drug pages and emergency/topic cards read the same indication-specific regimen.
// The check date covers these regimens, not a certification of all clinical modules.
export const DRUGS: DrugRecord[] = catalogue.map(({ regimens: ids, ...entry }) => {
  const rows = ids.map((id) => REGIMENS[id as RegimenId] as DrugUse)
  return {
    ...entry,
    status: entry.status as WorkflowStatus,
    regimenCheckedAt: entry.regimenCheckedAt || '2026-10-17',
    sourceId: rows[0].sourceId,
    doseRows: rows.map((r) => ({ indication: r.indication, dose: r.dose, route: r.route, frequency: r.frequency, duration: r.duration, preparation: r.preparation, max: r.maxDose, monitoring: r.monitoring, contraindications: r.contraindications, notes: [...(r.notes || []), ...(r.renalHepatic ? [`Renal / hepatic: ${r.renalHepatic}`] : [])], sourceId: r.sourceId })),
    contraindications: [...new Set(rows.flatMap((r) => r.contraindications || []))],
    monitoring: [...new Set(rows.flatMap((r) => r.monitoring || []))],
  }
})
