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
    description: 'Official GIS track network (2,390 routes, 2,033 junctions) & Train 17216 radar',
    source: 'DATA_SOURCES.md',
    sourceLabel: 'Indian Railways GIS Network',
    center: [78.96, 21.5],
    zoom: 4.8,
  },
  {
    id: 'suburban',
    name: 'Suburban Rail',
    description: '6 Commuter networks (572 stations, 201 routes) across Mumbai, Kolkata, Chennai, Delhi NCR, Hyderabad & Pune',
    source: 'https://github.com/datameet/railways',
    sourceLabel: 'DataMeet Railways & CRIS Reference',
    center: [72.88, 19.08],
    zoom: 9.8,
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
