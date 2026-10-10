export type TransportKind = 'metro' | 'railway'
export type Status = 'operational' | 'planned'

export type Station = {
  id: string
  name: string
  city: string
  kind: TransportKind
  opened: number
  closed?: number
  coordinates: [number, number]
  lines: string[]
  source: string
  coordinateSource: string
}

export type Route = {
  id: string
  name: string
  operator: string
  kind: TransportKind
  color: string
  opened: number
  status: Status
  coordinates: [number, number][]
  source: string
}

export const stations: Station[] = [
  { id: 'dli', name: 'New Delhi', city: 'Delhi', kind: 'railway', opened: 1926, coordinates: [77.22144, 28.64307], lines: ['indian-railways'], source: 'https://en.wikipedia.org/wiki/New_Delhi_railway_station', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'kashmere', name: 'Kashmere Gate', city: 'Delhi', kind: 'metro', opened: 2004, coordinates: [77.22817, 28.66750], lines: ['yellow'], source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'chandni', name: 'Chandni Chowk', city: 'Delhi', kind: 'metro', opened: 2004, coordinates: [77.23014, 28.65785], lines: ['yellow'], source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'new-delhi-metro', name: 'New Delhi', city: 'Delhi', kind: 'metro', opened: 2005, coordinates: [77.22144, 28.64307], lines: ['yellow'], source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'rajiv-chowk', name: 'Rajiv Chowk', city: 'Delhi', kind: 'metro', opened: 2005, coordinates: [77.21826, 28.63282], lines: ['yellow', 'blue'], source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'hauz-khas', name: 'Hauz Khas', city: 'Delhi', kind: 'metro', opened: 2010, coordinates: [77.20667, 28.54335], lines: ['yellow', 'magenta'], source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
  { id: 'huda-city', name: 'Millennium City Centre', city: 'Gurugram', kind: 'metro', opened: 2010, coordinates: [77.07268, 28.45927], lines: ['yellow'], source: 'https://delhimetrorail.com/pages/about-us/present-network', coordinateSource: 'https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json' },
]

export const routes: Route[] = [
  { id: 'indian-railways', name: 'New Delhi railway corridor', operator: 'Indian Railways', kind: 'railway', color: '#f4b942', opened: 1926, status: 'operational', coordinates: [[77.20, 28.61], [77.22144, 28.64307], [77.24, 28.67]], source: 'https://en.wikipedia.org/wiki/New_Delhi_railway_station' },
  { id: 'yellow', name: 'Yellow Line sample corridor', operator: 'Delhi Metro Rail Corporation', kind: 'metro', color: '#f2c94c', opened: 2004, status: 'operational', coordinates: [[77.22817, 28.66750], [77.23014, 28.65785], [77.22144, 28.64307], [77.21826, 28.63282], [77.20667, 28.54335], [77.07268, 28.45927]], source: 'https://delhimetrorail.com/pages/about-us/present-network' },
  { id: 'blue', name: 'Blue Line sample corridor', operator: 'Delhi Metro Rail Corporation', kind: 'metro', color: '#3298dc', opened: 2005, status: 'operational', coordinates: [[77.21826, 28.63282], [77.19, 28.625], [77.16, 28.62]], source: 'https://delhimetrorail.com/pages/about-us/present-network' },
  { id: 'magenta', name: 'Magenta Line sample extension', operator: 'Delhi Metro Rail Corporation', kind: 'metro', color: '#d44c9a', opened: 2018, status: 'operational', coordinates: [[77.20667, 28.54335], [77.18, 28.535], [77.15, 28.53]], source: 'https://delhimetrorail.com/pages/about-us/present-network' },
  { id: 'future-rtds', name: 'Delhi–Meerut RRTS (planned view)', operator: 'NCRTC', kind: 'railway', color: '#9b8afb', opened: 2025, status: 'planned', coordinates: [[77.23, 28.64], [77.38, 28.68], [77.75, 28.98]], source: 'https://ncrtc.in/' },
]

export const years = [1926, 2004, 2005, 2010, 2018, 2025]

export function isVisible(opened: number, year: number, status: Status, closed?: number) {
  return opened <= year && (!closed || year < closed) && (status === 'operational' || year >= opened)
}

export const milestones = [
  { year: 1926, label: 'New Delhi station opens', detail: 'The city’s major rail gateway begins service.', coordinates: [77.2195, 28.6431] as [number, number] },
  { year: 2004, label: 'Yellow Line reaches Old Delhi', detail: 'The first metro stations in this sample become operational.', coordinates: [77.2307, 28.6562] as [number, number] },
  { year: 2010, label: 'Yellow Line reaches Gurugram', detail: 'The corridor extends south beyond Delhi.', coordinates: [77.0726, 28.4595] as [number, number] },
  { year: 2018, label: 'Magenta Line extension', detail: 'A new cross-city connection appears in the comparison.', coordinates: [77.2066, 28.5434] as [number, number] },
]
