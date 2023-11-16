import type { Agency } from '@core/types.js'

export const ROOT = '/restbus'
export const modifyMuniTitle = (agency: Agency) => {
  agency.title = agency.title.replace('Muni Sandbox', 'Muni CIS')
}
