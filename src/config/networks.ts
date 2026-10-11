import type { NetworkModeConfig } from '../types'

export const networkModes: NetworkModeConfig[] = [
  {
    id: 'metro',
    name: 'Metro',
    description: 'Bundled GTFS route geometry for Hyderabad, Bengaluru, and Chennai; other systems have no local route geometry yet',
    source: 'DATA_SOURCES.md',
    sourceLabel: 'Atlas source ledger',
    center: [78.96, 20.59],
    zoom: 4.5,
  },
  {
    id: 'rail',
    name: 'Indian Railways',
    description: 'National rail GIS track layer; source provider and capture date are not recorded in the repository',
    source: 'DATA_SOURCES.md',
    sourceLabel: 'Railway GIS source notes',
    center: [78.96, 21.5],
    zoom: 4.8,
  },
  {
    id: 'suburban',
    name: 'Suburban Rail',
    description: 'Physical OpenStreetMap rail tracks and stations in six city focus areas; not commuter-service-only',
    source: 'https://data.humdata.org/dataset/hotosm_ind_railways',
    sourceLabel: 'HOTOSM India railways snapshot',
    center: [72.88, 19.08],
    zoom: 9.8,
  },
  {
    id: 'nhsrcl',
    name: 'NHSRCL',
    description: 'Mumbai–Ahmedabad High-Speed Rail project overview; alignment geometry is not bundled',
    source: 'https://nhsrcl.in/index.php/en/project/project-overview',
    sourceLabel: 'Official NHSRCL project overview',
    center: [73.25, 20.5],
    zoom: 5.5,
  },
]

export const ALL_INDIA_CENTER: [number, number] = [78.96, 20.59]
export const ALL_INDIA_ZOOM = 4.5
