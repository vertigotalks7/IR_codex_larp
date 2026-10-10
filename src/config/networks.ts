import type { NetworkModeConfig } from '../types'

export const networkModes: NetworkModeConfig[] = [
  {
    id: 'metro',
    name: 'Metro',
    description: 'Verified city-metro geometry and stations',
    source: 'DATA_SOURCES.md',
    sourceLabel: 'Atlas source ledger',
    center: [78.96, 20.59],
    zoom: 4.5,
  },
  {
    id: 'rail',
    name: 'Indian Railways',
    description: 'National network reference layer',
    source: 'https://surveyofindia.gov.in/pages/railway-map-of-india',
    sourceLabel: 'Survey of India map',
    center: [78.96, 20.59],
    zoom: 4.5,
  },
  {
    id: 'suburban',
    name: 'Suburban Rail',
    description: 'Commuter networks and city rail references',
    source: 'https://irfca.org/faq/faq-map-suburban.html',
    sourceLabel: 'Suburban route maps',
    center: [72.88, 19.08],
    zoom: 8.5,
  },
  {
    id: 'nhsrcl',
    name: 'NHSRCL',
    description: 'High-speed project records and corridor studies',
    source: 'https://nhsrcl.in/en/project/feasibility-study-report',
    sourceLabel: 'NHSRCL project material',
    center: [73.25, 20.5],
    zoom: 5.5,
  },
]

export const ALL_INDIA_CENTER: [number, number] = [78.96, 20.59]
export const ALL_INDIA_ZOOM = 4.5
