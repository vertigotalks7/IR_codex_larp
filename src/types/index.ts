export type TransportKind = 'metro' | 'railway'
export type Status = 'operational' | 'planned'
export type MetroSystemId = 'delhi' | 'bengaluru' | 'chennai' | 'hyderabad' | 'kochi' | 'mumbai' | 'pune'
export type NetworkMode = 'metro' | 'rail' | 'suburban' | 'nhsrcl'

export interface MetroSystem {
  id: MetroSystemId
  name: string
  city: string
  opened: number
  lines: string[]
  color: string
  center: [number, number]
  source: string
  dataSource: string
}

export interface Station {
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
  system: MetroSystemId
}

export interface Route {
  id: string
  name: string
  operator: string
  kind: TransportKind
  color: string
  opened: number
  status: Status
  coordinates: [number, number][]
  source: string
  system: MetroSystemId
}

export interface Milestone {
  year: number
  label: string
  detail: string
  coordinates: [number, number]
}

export interface NetworkModeConfig {
  id: NetworkMode
  name: string
  description: string
  source: string
  sourceLabel: string
  center: [number, number]
  zoom: number
}

export type OSMFeatureCollection = {
  type: 'FeatureCollection'
  features: {
    type: 'Feature'
    properties: Record<string, any>
    geometry: { type: 'LineString'; coordinates: [number, number][] }
  }[]
}

export type LocalStationFeature = {
  type: 'Feature'
  properties: Record<string, any>
  geometry: { type: 'Point'; coordinates: [number, number] }
}

export type LocalTransitData = {
  features: OSMFeatureCollection['features']
  stations: LocalStationFeature[]
}

export type RouteStatus = 'loading' | 'real' | 'unavailable'
