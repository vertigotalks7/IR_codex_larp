export type TransportKind = 'metro' | 'railway'
export type Status = 'operational' | 'planned'
export type MetroSystemId = 'delhi' | 'bengaluru' | 'chennai' | 'hyderabad' | 'kochi' | 'mumbai' | 'pune' | 'noida' | 'gurugram-rapid' | 'navi-mumbai'
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
  sources?: { id: string; name: string; source: string; type: string; snapshot: string | null; license?: string }[]
}

export type RouteStatus = 'loading' | 'real' | 'unavailable'

export interface RailwayStationStop {
  id: string
  code: string
  name: string
  coordinates: [number, number]
  arrival: string
  departure: string
  day: number
  distanceKm: number
  haltMinutes: number
}

export interface TrainService {
  number: string
  name: string
  type: string
  origin: string
  destination: string
  operator: string
  zone: string
  distanceKm: number
  totalDuration: string
  date: string
  stops: RailwayStationStop[]
  coordinates: [number, number][]
}

export interface RailwayGISRoute {
  id: string
  name: string
  from: string
  to: string
  zone: string
  gauge: string
  color: string
  speed: number
  lanes: number
  length: number
  stations: number
  bridge: boolean
  tunnel: boolean
}

export interface RailwayGISJunction {
  id: string
  name: string
  zones: string
  primaryZone: string
  color: string
  connections: number
}

export interface RailwayZoneInfo {
  name: string
  routes: number
  totalKm: number
  maxSpeed: number
  color: string
}

export interface RailwayMeta {
  totalRoutes: number
  totalJunctions: number
  totalMajorJunctions: number
  zones: Record<string, RailwayZoneInfo>
  gauges: string[]
  colors: Record<string, string>
  source: string
}
