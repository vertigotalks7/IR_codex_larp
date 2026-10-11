import { systems, stations, isVisible } from '../data'
import type { MetroSystemId, Route, Station, OSMFeatureCollection, LocalTransitData } from '../types'

type Map = import('maplibre-gl').Map
type GeoJSONSource = import('maplibre-gl').GeoJSONSource

const localRouteCache = new Map<MetroSystemId, OSMFeatureCollection>()
const localStationCache = new Map<MetroSystemId, Station[]>()
let localTransitDataPromise: Promise<LocalTransitData | null> | null = null
let isLoaded = false

type OsmMetroStationBundle = {
  features?: {
    properties?: {
      system?: unknown
      stationName?: unknown
      officialLines?: unknown
      officialSource?: unknown
      officialLine?: unknown
      officialSourceUrl?: unknown
      osmFeatureId?: unknown
      sourceFeatureId?: unknown
    }
    geometry?: { type?: unknown; coordinates?: unknown }
  }[]
}

export function isTransitDataLoaded(): boolean {
  return isLoaded
}

export function emptyRouteCollection(): OSMFeatureCollection {
  return { type: 'FeatureCollection', features: [] }
}

export function geoJson(items: Route[] | Station[]) {
  const isRoutes = items.length === 0 || 'color' in items[0]
  return {
    type: 'FeatureCollection' as const,
    features: items.map((item) =>
      isRoutes
        ? {
            type: 'Feature' as const,
            properties: {
              id: (item as Route).id,
              name: (item as Route).name,
              color: (item as Route).color,
            },
            geometry: {
              type: 'LineString' as const,
              coordinates: (item as Route).coordinates,
            },
          }
        : {
            type: 'Feature' as const,
            properties: {
              id: (item as Station).id,
              name: (item as Station).name,
            },
            geometry: {
              type: 'Point' as const,
              coordinates: (item as Station).coordinates,
            },
          },
    ),
  }
}

export function cachedRouteFeatures(system: MetroSystemId, year: number) {
  const systemInfo = systems.find((item) => item.id === system)
  if (!systemInfo || systemInfo.opened > year) return []
  return localRouteCache.get(system)?.features ?? []
}

export function getRouteFeaturesForSystem(system: MetroSystemId | 'all', year: number) {
  if (system === 'all') {
    return systems.flatMap((item) => cachedRouteFeatures(item.id, year))
  }
  return cachedRouteFeatures(system, year)
}

export function visibleStationsFor(system: MetroSystemId | 'all', year: number) {
  const importedSystems = new Set(localStationCache.keys())
  const imported = [...localStationCache.values()].flat()
  const sourceStations = stations.filter((station) => !importedSystems.has(station.system)).concat(imported)
  return sourceStations.filter((station) => isVisible(station.opened, year, 'operational') && (system === 'all' || station.system === system))
}

export async function loadLocalTransitData(): Promise<LocalTransitData | null> {
  if (!localTransitDataPromise) {
    localTransitDataPromise = Promise.all([
      fetch('/data/routes.json', { cache: 'no-store' }),
      fetch('/data/metro-stations-osm.json', { cache: 'no-store' }).catch(() => null),
      fetch('/data/metro-stations-extra.json', { cache: 'no-store' }).catch(() => null),
    ])
      .then(async ([response, osmStationsResponse, extraOsmStationsResponse]) => {
        if (!response.ok) return null
        const [payload, osmStationPayload, extraOsmStationPayload] = await Promise.all([
          response.json() as Promise<LocalTransitData>,
          osmStationsResponse?.ok
            ? osmStationsResponse.json() as Promise<OsmMetroStationBundle>
            : Promise.resolve({ features: [] } as OsmMetroStationBundle),
          extraOsmStationsResponse?.ok
            ? extraOsmStationsResponse.json() as Promise<OsmMetroStationBundle>
            : Promise.resolve({ features: [] } as OsmMetroStationBundle),
        ])
        const allOsmStationFeatures = [
          ...(osmStationPayload.features ?? []),
          ...(extraOsmStationPayload.features ?? []),
        ]
        for (const system of systems.map((item) => item.id)) {
          const features = payload.features?.filter((feature) => feature.properties.system === system) ?? []
          if (features.length) {
            localRouteCache.set(system, { type: 'FeatureCollection', features })
          }
          const importedStations = (payload.stations ?? [])
            .filter((station) => station.properties.system === system)
            .map((station) => ({
              id: station.properties.id,
              name: station.properties.name,
              city: station.properties.city ?? systems.find((item) => item.id === system)?.city ?? '',
              kind: 'metro' as const,
              opened: Number(station.properties.opened),
              coordinates: station.geometry.coordinates,
              lines: (() => {
                try {
                  return JSON.parse(station.properties.lines ?? '[]') as string[]
                } catch {
                  return []
                }
              })(),
              system,
              source: station.properties.source,
              coordinateSource: station.properties.coordinateSource,
            }))
          const importedOsmStations = allOsmStationFeatures
            .filter((feature) => feature.properties?.system === system
              && feature.geometry?.type === 'Point'
              && Array.isArray(feature.geometry.coordinates)
              && typeof feature.geometry.coordinates[0] === 'number'
              && typeof feature.geometry.coordinates[1] === 'number'
              && typeof feature.properties.stationName === 'string'
              && (typeof feature.properties.osmFeatureId === 'string' || typeof feature.properties.sourceFeatureId === 'string'))
            .map((feature) => {
              const properties = feature.properties!
              const systemInfo = systems.find((item) => item.id === system)!
              const osmId = (properties.osmFeatureId ?? properties.sourceFeatureId) as string
              const officialLines = Array.isArray(properties.officialLines)
                ? properties.officialLines.filter((line): line is string => typeof line === 'string')
                : typeof properties.officialLine === 'string' ? [properties.officialLine] : []
              const sourceUrl = typeof properties.officialSource === 'string'
                ? properties.officialSource
                : typeof properties.officialSourceUrl === 'string' ? properties.officialSourceUrl : systemInfo.source
              return {
                id: `${system}-${osmId.replace('/', '-')}`,
                name: properties.stationName as string,
                city: systemInfo.city,
                kind: 'metro' as const,
                opened: systemInfo.opened,
                coordinates: feature.geometry!.coordinates as [number, number],
                lines: officialLines,
                system,
                source: sourceUrl,
                coordinateSource: `https://www.openstreetmap.org/${osmId}`,
              }
            })
          if (importedStations.length || importedOsmStations.length) {
            localStationCache.set(system, [...importedStations, ...importedOsmStations])
          }
        }
        isLoaded = true
        return payload
      })
      .catch(() => null)
  }
  return localTransitDataPromise
}

export async function loadBundledRoutes(system: MetroSystemId): Promise<OSMFeatureCollection | null> {
  await loadLocalTransitData()
  return localRouteCache.get(system) ?? null
}

export async function hydrateMapWithBundledRoutes(
  map: Map,
  system: MetroSystemId | 'all',
  year: number,
  isCurrent: () => boolean = () => true,
  options: { showStations?: boolean; showRoutes?: boolean } = {},
): Promise<number> {
  const systemsToLoad = system === 'all' ? systems : systems.filter((item) => item.id === system)
  const datasets = await Promise.all(systemsToLoad.map((item) => loadBundledRoutes(item.id)))
  if (!isCurrent()) return 0

  const features = datasets.flatMap((dataset, index) =>
    systemsToLoad[index].opened <= year ? dataset?.features ?? [] : [],
  )

  const routeSource = map.getSource('routes') as GeoJSONSource | undefined
  if (routeSource) {
    const showRoutes = options.showRoutes !== false
    routeSource.setData(showRoutes && features.length ? { type: 'FeatureCollection', features } : emptyRouteCollection())
  }

  const stationSource = map.getSource('stations') as GeoJSONSource | undefined
  if (stationSource) {
    const showStations = options.showStations !== false
    stationSource.setData(geoJson(showStations ? visibleStationsFor(system, year) : []))
  }

  return features.length
}

export function findStationById(id: string): Station | undefined {
  return [...stations, ...[...localStationCache.values()].flat()].find((item) => item.id === id)
}
