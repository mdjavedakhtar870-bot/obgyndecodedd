import type { DiseaseTopic } from './types'
import { HDP_TOPICS } from './diseases/hdp'
import { HEMORRHAGE_TOPICS } from './diseases/hemorrhage'
import { EPL_TOPICS } from './diseases/epl'
import { INTRAPARTUM_TOPICS } from './diseases/intrapartum'
import { DELIVERY_EMERGENCY_TOPICS } from './diseases/delivery-emergencies'
import { BREECH_CTG_TOPICS } from './diseases/breech-ctg'
import { PRETERM_TOPICS } from './diseases/preterm'
import { FETAL_TOPICS } from './diseases/fetal'

export * from './types'
export * from './sources'

export const DISEASE_TOPICS: DiseaseTopic[] = [
  ...HDP_TOPICS,
  ...HEMORRHAGE_TOPICS,
  ...EPL_TOPICS,
  ...INTRAPARTUM_TOPICS,
  ...DELIVERY_EMERGENCY_TOPICS,
  ...BREECH_CTG_TOPICS,
  ...PRETERM_TOPICS,
  ...FETAL_TOPICS,
]

/* Additional module files are appended below as they are authored */
import { MEDICAL_TOPICS_A } from './diseases/medical'
import { MEDICAL_TOPICS_B } from './diseases/medical-b'
import { INFECTION_TOPICS } from './diseases/infections'
import { GYNAE_TOPICS_A } from './diseases/gynae'
import { GYNAE_TOPICS_B } from './diseases/gynae2'
import { ONC_TOPICS } from './diseases/onc'
import { MISC_TOPICS } from './diseases/misc'

export const ALL_TOPICS: DiseaseTopic[] = [...DISEASE_TOPICS, ...MEDICAL_TOPICS_A, ...MEDICAL_TOPICS_B, ...INFECTION_TOPICS, ...GYNAE_TOPICS_A, ...GYNAE_TOPICS_B, ...ONC_TOPICS, ...MISC_TOPICS]

export function getTopic(id: string): DiseaseTopic | undefined {
  return ALL_TOPICS.find((t) => t.id === id)
}

export const CATEGORY_LABELS: Record<string, string> = {
  antenatal: 'Antenatal Care',
  obstetrics: 'Obstetrics',
  'obstetric-emergency': 'Obstetric Emergencies',
  'medical-disorders': 'Medical Disorders in Pregnancy',
  'infections-pregnancy': 'Infections in Pregnancy',
  'early-pregnancy': 'Early Pregnancy & Abortion Care',
  gynaecology: 'Gynaecology',
  'gynae-oncology': 'Gynaecological Oncology',
  urogynaecology: 'Urogynaecology',
  'contraception-infertility': 'Contraception & Infertility',
  procedure: 'Procedures',
}

import { DRUGS } from './drugs'
export { DRUGS }
import { CALCULATORS_A } from './calculators'
import { CALCULATORS_B } from './calculators-b'
export const CALCULATORS = [...CALCULATORS_A, ...CALCULATORS_B]
import { EMERGENCIES } from './emergencies'
export { EMERGENCIES }
import { PROCEDURES } from './procedures'
export { PROCEDURES }
import { DDx_PRESENTATIONS } from './ddx'
export { DDx_PRESENTATIONS }
