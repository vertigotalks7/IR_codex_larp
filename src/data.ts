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
  { id: 'dli', name: 'New Delhi', city: 'Delhi', kind: 'railway', opened: 1926, coordinates: [77.2195, 28.6431], lines: ['indian-railways'], source: 'https://en.wikipedia.org/wiki/New_Delhi_railway_station' },
  { id: 'kashmere', name: 'Kashmere Gate', city: 'Delhi', kind: 'metro', opened: 2004, coordinates: [77.2295, 28.6675], lines: ['yellow'], source: 'https://delhimetrorail.com/' },
  { id: 'chandni', name: 'Chandni Chowk', city: 'Delhi', kind: 'metro', opened: 2004, coordinates: [77.2307, 28.6562], lines: ['yellow'], source: 'https://delhimetrorail.com/' },
  { id: 'new-delhi-metro', name: 'New Delhi Metro', city: 'Delhi', kind: 'metro', opened: 2005, coordinates: [77.2199, 28.6428], lines: ['yellow'], source: 'https://delhimetrorail.com/' },
  { id: 'rajiv-chowk', name: 'Rajiv Chowk', city: 'Delhi', kind: 'metro', opened: 2005, coordinates: [77.2185, 28.6328], lines: ['yellow', 'blue'], source: 'https://delhimetrorail.com/' },
  { id: 'hauz-khas', name: 'Hauz Khas', city: 'Delhi', kind: 'metro', opened: 2010, coordinates: [77.2066, 28.5434], lines: ['yellow', 'magenta'], source: 'https://delhimetrorail.com/' },
  { id: 'huda-city', name: 'Millennium City Centre', city: 'Gurugram', kind: 'metro', opened: 2010, coordinates: [77.0726, 28.4595], lines: ['yellow'], source: 'https://delhimetrorail.com/' },
]

export const routes: Route[] = [
  { id: 'indian-railways', name: 'New Delhi railway corridor', operator: 'Indian Railways', kind: 'railway', color: '#f4b942', opened: 1926, status: 'operational', coordinates: [[77.20, 28.61], [77.2195, 28.6431], [77.24, 28.67]], source: 'https://en.wikipedia.org/wiki/New_Delhi_railway_station' },
  { id: 'yellow', name: 'Yellow Line', operator: 'Delhi Metro Rail Corporation', kind: 'metro', color: '#f2c94c', opened: 2004, status: 'operational', coordinates: [[77.2295, 28.6675], [77.2307, 28.6562], [77.2199, 28.6428], [77.2185, 28.6328], [77.2066, 28.5434], [77.0726, 28.4595]], source: 'https://delhimetrorail.com/' },
  { id: 'blue', name: 'Blue Line', operator: 'Delhi Metro Rail Corporation', kind: 'metro', color: '#3298dc', opened: 2005, status: 'operational', coordinates: [[77.2185, 28.6328], [77.19, 28.625], [77.16, 28.62]], source: 'https://delhimetrorail.com/' },
  { id: 'magenta', name: 'Magenta Line extension', operator: 'Delhi Metro Rail Corporation', kind: 'metro', color: '#d44c9a', opened: 2018, status: 'operational', coordinates: [[77.2066, 28.5434], [77.18, 28.535], [77.15, 28.53]], source: 'https://delhimetrorail.com/' },
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
