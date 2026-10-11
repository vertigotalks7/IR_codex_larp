import { nationalCorridors, nationalJunctions, type RailwayCorridor, type RailwayJunction } from '../data/nationalRailways'
import { train17216, type RailwayStationStop, type TrainService } from '../data/indianRailways'
import { SUBURBAN_DIVISIONS, type SuburbanDivision } from '../data/suburbanDivisions'
import type { RailwayMeta } from '../types'

let cachedRoutesGeoJson: any | null = null
let cachedJunctionsGeoJson: any | null = null
let cachedMeta: RailwayMeta | null = null
let railwayLoadPromise: Promise<{
  routes: any
  junctions: any
  meta: RailwayMeta | null
}> | null = null

export async function preloadRailwayData(): Promise<{
  routes: any
  junctions: any
  meta: RailwayMeta | null
}> {
  if (cachedRoutesGeoJson && cachedJunctionsGeoJson) {
    return { routes: cachedRoutesGeoJson, junctions: cachedJunctionsGeoJson, meta: cachedMeta }
  }

  if (railwayLoadPromise) return railwayLoadPromise

  railwayLoadPromise = (async () => {
    const [routesRes, junctionsRes, metaRes] = await Promise.all([
      fetch('/data/railway-routes.json'),
      fetch('/data/railway-major-junctions.json'),
      fetch('/data/railway-meta.json'),
    ])

    if (!routesRes.ok || !junctionsRes.ok) {
      throw new Error(`Railway GIS bundles unavailable (routes ${routesRes.status}, junctions ${junctionsRes.status})`)
    }

    const [routes, junctions] = await Promise.all([routesRes.json(), junctionsRes.json()])
    const meta = metaRes.ok ? await metaRes.json() : null
    if (!Array.isArray(routes.features) || !Array.isArray(junctions.features)) {
      throw new Error('Railway GIS bundles are not valid GeoJSON feature collections')
    }

    cachedRoutesGeoJson = routes
    cachedJunctionsGeoJson = junctions
    cachedMeta = meta
    return { routes, junctions, meta }
  })().finally(() => {
    railwayLoadPromise = null
  })

  return railwayLoadPromise
}

export function isRailwayDataLoaded(): boolean {
  return cachedRoutesGeoJson !== null && cachedJunctionsGeoJson !== null
}

export function getRailwayMeta(): RailwayMeta | null {
  return cachedMeta
}

export function getNationalRailwaysTrackGeoJson(
  filterZoneOrCorridor: string = 'all',
  gauge: string = 'all',
) {
  if (!cachedRoutesGeoJson) {
    return { type: 'FeatureCollection' as const, features: [] }
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
    return { type: 'FeatureCollection' as const, features: [] }
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

const cachedSuburbanData = new Map<string, { routes: any; stations: any }>()
const suburbanLoadPromises = new Map<string, Promise<{ routes: any; stations: any }>>()

let cachedDatameetStationsGeoJson: any | null = null
let isDatameetPreloading = false

async function loadSuburbanDivision(divisionId: string): Promise<{ routes: any; stations: any }> {
  const cached = cachedSuburbanData.get(divisionId)
  if (cached) return cached

  const inFlight = suburbanLoadPromises.get(divisionId)
  if (inFlight) return inFlight

  const promise = (async () => {
    const response = await fetch(`/data/suburban/${divisionId}.json`)
    if (!response.ok) throw new Error(`City rail bundle unavailable (${response.status})`)

    const payload = await response.json()
    if (!Array.isArray(payload.routes?.features) || !Array.isArray(payload.stations?.features)) {
      throw new Error(`City rail bundle for ${divisionId} is not valid GeoJSON`)
    }

    cachedSuburbanData.set(divisionId, payload)
    return payload
  })().finally(() => {
    suburbanLoadPromises.delete(divisionId)
  })

  suburbanLoadPromises.set(divisionId, promise)
  return promise
}

export async function preloadSuburbanData(divisionId: string = 'all'): Promise<{
  routes: any
  stations: any
}> {
  if (divisionId !== 'all') return loadSuburbanDivision(divisionId)

  const divisions = await Promise.all(SUBURBAN_DIVISIONS.map(({ id }) => loadSuburbanDivision(id)))
  return {
    routes: {
      type: 'FeatureCollection',
      features: divisions.flatMap(({ routes }) => routes.features),
    },
    stations: {
      type: 'FeatureCollection',
      features: divisions.flatMap(({ stations }) => stations.features),
    },
  }
}

export function isSuburbanDataLoaded(divisionId: string = 'all'): boolean {
  return divisionId === 'all'
    ? SUBURBAN_DIVISIONS.every(({ id }) => cachedSuburbanData.has(id))
    : cachedSuburbanData.has(divisionId)
}

export function getSuburbanTracksGeoJson(divisionId: string = 'all') {
  const features = divisionId === 'all'
    ? SUBURBAN_DIVISIONS.flatMap(({ id }) => cachedSuburbanData.get(id)?.routes.features ?? [])
    : cachedSuburbanData.get(divisionId)?.routes.features ?? []

  return {
    type: 'FeatureCollection' as const,
    name: 'OSM_Physical_Railway_Tracks_By_City',
    features,
  }
}

export function getSuburbanStationsGeoJson(divisionId: string = 'all') {
  const features = divisionId === 'all'
    ? SUBURBAN_DIVISIONS.flatMap(({ id }) => cachedSuburbanData.get(id)?.stations.features ?? [])
    : cachedSuburbanData.get(divisionId)?.stations.features ?? []

  return {
    type: 'FeatureCollection' as const,
    name: 'OSM_Railway_Stations_By_City',
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
