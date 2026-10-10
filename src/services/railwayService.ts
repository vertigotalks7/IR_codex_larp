import { nationalCorridors, nationalJunctions, type RailwayCorridor, type RailwayJunction } from '../data/nationalRailways'
import { train17216, type RailwayStationStop, type TrainService } from '../data/indianRailways'
import { SUBURBAN_DIVISIONS, type SuburbanDivision } from '../data/suburbanDivisions'
import type { RailwayMeta } from '../types'

let cachedRoutesGeoJson: any | null = null
let cachedJunctionsGeoJson: any | null = null
let cachedMeta: RailwayMeta | null = null
let isPreloading = false

export async function preloadRailwayData(): Promise<{
  routes: any
  junctions: any
  meta: RailwayMeta | null
}> {
  if (cachedRoutesGeoJson && cachedJunctionsGeoJson) {
    return { routes: cachedRoutesGeoJson, junctions: cachedJunctionsGeoJson, meta: cachedMeta }
  }

  if (isPreloading) {
    // Wait briefly if already in flight
    await new Promise((r) => setTimeout(r, 200))
    if (cachedRoutesGeoJson && cachedJunctionsGeoJson) {
      return { routes: cachedRoutesGeoJson, junctions: cachedJunctionsGeoJson, meta: cachedMeta }
    }
  }

  isPreloading = true
  try {
    const [routesRes, junctionsRes, metaRes] = await Promise.all([
      fetch('/data/railway-routes.json'),
      fetch('/data/railway-major-junctions.json'),
      fetch('/data/railway-meta.json').catch(() => null),
    ])

    if (routesRes.ok) {
      cachedRoutesGeoJson = await routesRes.json()
    }
    if (junctionsRes.ok) {
      cachedJunctionsGeoJson = await junctionsRes.json()
    }
    if (metaRes && metaRes.ok) {
      cachedMeta = await metaRes.json()
    }
  } catch (err) {
    console.warn('Failed to load official Railway GIS data, fallback to static corridors', err)
  } finally {
    isPreloading = false
  }

  return {
    routes: cachedRoutesGeoJson || getFallbackTrackGeoJson(),
    junctions: cachedJunctionsGeoJson || getFallbackJunctionsGeoJson(),
    meta: cachedMeta,
  }
}

export function isRailwayDataLoaded(): boolean {
  return cachedRoutesGeoJson !== null
}

export function getRailwayMeta(): RailwayMeta | null {
  return cachedMeta
}

function getFallbackTrackGeoJson(selectedCorridorId: string = 'all') {
  const filtered =
    selectedCorridorId === 'all'
      ? nationalCorridors
      : nationalCorridors.filter((c) => c.id === selectedCorridorId)

  return {
    type: 'FeatureCollection' as const,
    features: filtered.map((corridor) => ({
      type: 'Feature' as const,
      properties: {
        id: corridor.id,
        name: corridor.name,
        from: corridor.origin,
        to: corridor.destination,
        shortName: corridor.shortName,
        code: corridor.code,
        zone: corridor.zone,
        distanceKm: corridor.distanceKm,
        length: corridor.distanceKm,
        speed: 130,
        gauge: corridor.gauge,
        electrification: corridor.electrification,
        color: corridor.color,
        origin: corridor.origin,
        destination: corridor.destination,
        system: 'rail',
        kind: 'railway',
      },
      geometry: {
        type: 'LineString' as const,
        coordinates: corridor.coordinates,
      },
    })),
  }
}

function getFallbackJunctionsGeoJson(selectedCorridorId: string = 'all') {
  const filtered =
    selectedCorridorId === 'all'
      ? nationalJunctions
      : nationalJunctions.filter((j) => j.corridors.includes(selectedCorridorId))

  return {
    type: 'FeatureCollection' as const,
    features: filtered.map((junction) => ({
      type: 'Feature' as const,
      properties: {
        id: `ir-${junction.code}`,
        name: junction.name,
        code: junction.code,
        zone: junction.zone,
        division: junction.division,
        state: junction.state,
        platforms: junction.platforms,
        connections: junction.corridors.length,
        kind: 'railway-junction',
      },
      geometry: {
        type: 'Point' as const,
        coordinates: junction.coordinates,
      },
    })),
  }
}

export function getNationalRailwaysTrackGeoJson(
  filterZoneOrCorridor: string = 'all',
  gauge: string = 'all',
) {
  if (!cachedRoutesGeoJson) {
    return getFallbackTrackGeoJson(filterZoneOrCorridor)
  }

  let features = cachedRoutesGeoJson.features as any[]

  if (filterZoneOrCorridor !== 'all') {
    // Check if matching a zone
    features = features.filter((f) => {
      const z = f.properties?.zone
      if (z === filterZoneOrCorridor) return true
      // Also support matching corridor code or name if user passed corridor id
      const cid = f.properties?.id
      return cid === filterZoneOrCorridor
    })
  }

  if (gauge !== 'all') {
    features = features.filter((f) => f.properties?.gauge === gauge)
  }

  return {
    type: 'FeatureCollection' as const,
    name: 'Indian_Railways_Network_GIS',
    features,
  }
}

export function getNationalRailwaysJunctionsGeoJson(filterZoneOrCorridor: string = 'all') {
  if (!cachedJunctionsGeoJson) {
    return getFallbackJunctionsGeoJson(filterZoneOrCorridor)
  }

  let features = cachedJunctionsGeoJson.features as any[]

  if (filterZoneOrCorridor !== 'all') {
    features = features.filter((f) => {
      const zones = f.properties?.zones || ''
      const primary = f.properties?.primaryZone || ''
      return primary === filterZoneOrCorridor || zones.includes(filterZoneOrCorridor)
    })
  }

  return {
    type: 'FeatureCollection' as const,
    name: 'Indian_Railways_Junctions_GIS',
    features,
  }
}

export function getTrain17216RouteGeoJson(train: TrainService = train17216) {
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: {
          id: `train-${train.number}`,
          name: `${train.number} · ${train.name}`,
          shortName: `${train.number} Express`,
          operator: train.operator,
          color: '#e11d48',
          system: 'rail',
          kind: 'railway',
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: train.coordinates,
        },
      },
    ],
  }
}

export function getTrain17216StationsGeoJson(train: TrainService = train17216) {
  return {
    type: 'FeatureCollection' as const,
    features: train.stops.map((stop) => ({
      type: 'Feature' as const,
      properties: {
        id: `ir-${stop.code}`,
        name: stop.name,
        code: stop.code,
        arrival: stop.arrival,
        departure: stop.departure,
        day: stop.day,
        distanceKm: stop.distanceKm,
        haltMinutes: stop.haltMinutes,
        kind: 'railway',
      },
      geometry: {
        type: 'Point' as const,
        coordinates: stop.coordinates,
      },
    })),
  }
}

export function getTrainPositionAtProgress(
  progress: number,
  coordinates: [number, number][] = train17216.coordinates,
): { position: [number, number]; bearing: number; segmentIndex: number } {
  if (coordinates.length === 0) {
    return { position: [77.7152, 14.4261], bearing: 0, segmentIndex: 0 }
  }
  const clamped = Math.max(0, Math.min(1, progress))
  const totalSegments = coordinates.length - 1
  const scaled = clamped * totalSegments
  const index = Math.min(Math.floor(scaled), totalSegments - 1)
  const segmentFraction = scaled - index

  const p1 = coordinates[index]
  const p2 = coordinates[index + 1]

  const lng = p1[0] + (p2[0] - p1[0]) * segmentFraction
  const lat = p1[1] + (p2[1] - p1[1]) * segmentFraction

  const dLng = (p2[0] - p1[0]) * Math.cos((((p1[1] + p2[1]) / 2) * Math.PI) / 180)
  const dLat = p2[1] - p1[1]
  const angle = (Math.atan2(dLng, dLat) * 180) / Math.PI
  const bearing = (angle + 360) % 360

  return { position: [lng, lat], bearing, segmentIndex: index }
}

export function getTrainMarkerGeoJson(position: [number, number], bearing: number) {
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: {
          id: 'live-train-17216',
          name: '17216 DMM MTM EXP',
          bearing,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: position,
        },
      },
    ],
  }
}

export function findStopForProgress(
  progress: number,
  stops: RailwayStationStop[] = train17216.stops,
): { previousStop: RailwayStationStop; nextStop: RailwayStationStop | null } {
  const currentKm = progress * train17216.distanceKm
  let previous = stops[0]
  let next: RailwayStationStop | null = stops[1] ?? null

  for (let i = 0; i < stops.length; i++) {
    if (stops[i].distanceKm <= currentKm) {
      previous = stops[i]
      next = stops[i + 1] ?? null
    } else {
      break
    }
  }

  return { previousStop: previous, nextStop: next }
}

export function findJunctionByCode(code: string): RailwayJunction | undefined {
  return nationalJunctions.find((j) => j.code === code)
}
export function findCorridorById(id: string): RailwayCorridor | undefined {
  return nationalCorridors.find((c) => c.id === id)
}

let cachedSuburbanRoutesGeoJson: any | null = null
let cachedSuburbanStationsGeoJson: any | null = null
let isSuburbanPreloading = false

let cachedDatameetStationsGeoJson: any | null = null
let isDatameetPreloading = false

export async function preloadSuburbanData(): Promise<{
  routes: any
  stations: any
}> {
  if (cachedSuburbanRoutesGeoJson && cachedSuburbanStationsGeoJson) {
    return { routes: cachedSuburbanRoutesGeoJson, stations: cachedSuburbanStationsGeoJson }
  }

  if (isSuburbanPreloading) {
    await new Promise((r) => setTimeout(r, 200))
    if (cachedSuburbanRoutesGeoJson && cachedSuburbanStationsGeoJson) {
      return { routes: cachedSuburbanRoutesGeoJson, stations: cachedSuburbanStationsGeoJson }
    }
  }

  isSuburbanPreloading = true
  try {
    const [routesRes, stationsRes] = await Promise.all([
      fetch('/data/suburban-routes.json'),
      fetch('/data/suburban-stations.json'),
    ])

    if (routesRes.ok) {
      cachedSuburbanRoutesGeoJson = await routesRes.json()
    }
    if (stationsRes.ok) {
      cachedSuburbanStationsGeoJson = await stationsRes.json()
    }
  } catch (err) {
    console.warn('Failed to load Suburban Rail data', err)
  } finally {
    isSuburbanPreloading = false
  }

  return {
    routes: cachedSuburbanRoutesGeoJson || { type: 'FeatureCollection', features: [] },
    stations: cachedSuburbanStationsGeoJson || { type: 'FeatureCollection', features: [] },
  }
}

export function isSuburbanDataLoaded(): boolean {
  return cachedSuburbanRoutesGeoJson !== null && cachedSuburbanStationsGeoJson !== null
}

export function getSuburbanTracksGeoJson(divisionId: string = 'all') {
  if (!cachedSuburbanRoutesGeoJson) {
    return { type: 'FeatureCollection' as const, features: [] }
  }

  let features = cachedSuburbanRoutesGeoJson.features as any[]
  if (divisionId !== 'all') {
    features = features.filter((f) => f.properties?.divisionId === divisionId)
  }

  return {
    type: 'FeatureCollection' as const,
    name: 'Indian_Suburban_Railway_Network_GIS',
    features,
  }
}

export function getSuburbanStationsGeoJson(divisionId: string = 'all') {
  if (!cachedSuburbanStationsGeoJson) {
    return { type: 'FeatureCollection' as const, features: [] }
  }

  let features = cachedSuburbanStationsGeoJson.features as any[]
  if (divisionId !== 'all') {
    features = features.filter((f) => f.properties?.divisionId === divisionId)
  }

  return {
    type: 'FeatureCollection' as const,
    name: 'Indian_Suburban_Railway_Stations',
    features,
  }
}

export function getSuburbanDivisions(): SuburbanDivision[] {
  return SUBURBAN_DIVISIONS
}

export function findSuburbanDivisionById(id: string): SuburbanDivision | undefined {
  return SUBURBAN_DIVISIONS.find((d) => d.id === id)
}

export async function preloadDatameetStations(): Promise<any> {
  if (cachedDatameetStationsGeoJson) return cachedDatameetStationsGeoJson
  if (isDatameetPreloading) {
    await new Promise((r) => setTimeout(r, 200))
    if (cachedDatameetStationsGeoJson) return cachedDatameetStationsGeoJson
  }
  isDatameetPreloading = true
  try {
    const res = await fetch('/data/railway-stations-datameet.json')
    if (res.ok) {
      cachedDatameetStationsGeoJson = await res.json()
    }
  } catch (err) {
    console.warn('Failed to load DataMeet station catalog', err)
  } finally {
    isDatameetPreloading = false
  }
  return cachedDatameetStationsGeoJson || { type: 'FeatureCollection', features: [] }
}
