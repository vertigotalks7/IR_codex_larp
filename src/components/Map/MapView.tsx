import { useEffect, useRef } from 'react'
import { mapStyle } from '../../config/map'
import { loadMapLibre } from '../../services/mapLibre'
import {
  emptyRouteCollection,
  geoJson,
  getRouteFeaturesForSystem,
  visibleStationsFor,
  hydrateMapWithBundledRoutes,
  isTransitDataLoaded,
  findStationById,
} from '../../services/transitData'
import {
  getTrain17216RouteGeoJson,
  getTrain17216StationsGeoJson,
  getTrainPositionAtProgress,
  getTrainMarkerGeoJson,
} from '../../services/railwayService'
import { train17216, type RailwayStationStop } from '../../data/indianRailways'
import type { MetroSystemId, NetworkMode, Station, RouteStatus } from '../../types'

type Map = import('maplibre-gl').Map
type GeoJSONSource = import('maplibre-gl').GeoJSONSource

interface MapViewProps {
  year: number
  system: MetroSystemId | 'all'
  network: NetworkMode
  mapRef: React.MutableRefObject<Map | null>
  showStations?: boolean
  showRoutes?: boolean
  trainProgress?: number
  onSelectStation: (station: Station) => void
  onSelectRailwayStop?: (stop: RailwayStationStop) => void
  onReady: () => void
  onRouteStatus: (status: RouteStatus) => void
}

function addLayers(
  map: Map,
  maplibre: typeof import('maplibre-gl'),
  year: number,
  system: MetroSystemId | 'all',
  onSelectStation: (station: Station) => void,
  onSelectRailwayStop: ((stop: RailwayStationStop) => void) | undefined,
  network: NetworkMode,
) {
  const visibleStations = network === 'metro' ? visibleStationsFor(system, year) : []
  map.addSource('routes', { type: 'geojson', data: emptyRouteCollection() })
  map.addSource('stations', { type: 'geojson', data: geoJson(visibleStations) })
  map.addSource('train-marker', { type: 'geojson', data: emptyRouteCollection() })

  // Route layer
  map.addLayer({
    id: 'routes',
    type: 'line',
    source: 'routes',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': ['get', 'color'], 'line-width': 5, 'line-opacity': 0.88 },
  })

  // Stations circle layer
  map.addLayer({
    id: 'stations',
    type: 'circle',
    source: 'stations',
    paint: {
      'circle-radius': 6,
      'circle-color': '#f7f3ea',
      'circle-stroke-color': '#10283b',
      'circle-stroke-width': 2,
    },
  })

  // Live Train Radar Pulse Layer (Outer)
  map.addLayer({
    id: 'train-marker-pulse',
    type: 'circle',
    source: 'train-marker',
    paint: {
      'circle-radius': 14,
      'circle-color': '#e11d48',
      'circle-opacity': 0.35,
    },
  })

  // Live Train Radar Dot Layer (Inner)
  map.addLayer({
    id: 'train-marker-dot',
    type: 'circle',
    source: 'train-marker',
    paint: {
      'circle-radius': 7,
      'circle-color': '#e11d48',
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2.5,
    },
  })

  map.on('mouseenter', 'routes', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'routes', () => {
    map.getCanvas().style.cursor = ''
  })
  map.on('click', 'routes', (event) => {
    const feature = event.features?.[0]
    if (!feature) return

    const isRailway = feature.properties?.system === 'rail'
    const content = isRailway
      ? `<strong>17216 · DMM MTM Express</strong><br/><span>Dharmavaram Jn → Machilipatnam (694 km)</span><br/><small>South Central Railway · Real-time corridor</small>`
      : `<strong>${feature.properties?.name}</strong><br/><span>Route history available in the source record.</span>`

    new maplibre.Popup({ closeButton: true, offset: 8 })
      .setLngLat(event.lngLat)
      .setHTML(content)
      .addTo(map)
  })

  map.on('mouseenter', 'stations', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'stations', () => {
    map.getCanvas().style.cursor = ''
  })
  map.on('click', 'stations', (event) => {
    const feature = event.features?.[0]
    const id = feature?.properties?.id
    if (!id) return

    if (id.startsWith('ir-')) {
      const code = feature.properties?.code ?? id.replace('ir-', '')
      const railwayStop = train17216.stops.find((s) => s.code === code)
      if (railwayStop) {
        onSelectRailwayStop?.(railwayStop)
        new maplibre.Popup({ closeButton: true, offset: 8 })
          .setLngLat(event.lngLat)
          .setHTML(
            `<strong>${railwayStop.name} (${railwayStop.code})</strong><br/>` +
              `<span>Arrival: <b>${railwayStop.arrival}</b> · Departure: <b>${railwayStop.departure}</b></span><br/>` +
              `<small>Distance: ${railwayStop.distanceKm} km · Halt: ${railwayStop.haltMinutes}m</small>`,
          )
          .addTo(map)
      }
      return
    }

    const station = findStationById(id)
    if (station) onSelectStation(station)
  })
}

export function MapView({
  year,
  system,
  network,
  mapRef,
  showStations = true,
  showRoutes = true,
  trainProgress = 0.58, // Default location around Guntur / Vijayawada
  onSelectStation,
  onSelectRailwayStop,
  onReady,
  onRouteStatus,
}: MapViewProps) {
  const container = useRef<HTMLDivElement>(null)
  const hydrateVersion = useRef(0)
  const stationSelectRef = useRef(onSelectStation)
  stationSelectRef.current = onSelectStation
  const railSelectRef = useRef(onSelectRailwayStop)
  railSelectRef.current = onSelectRailwayStop

  // 1. Initialize MapLibre
  useEffect(() => {
    if (!container.current) return
    let disposed = false
    let mapInstance: Map | null = null

    void loadMapLibre().then((maplibre) => {
      if (!container.current || disposed) return
      const initialCenter: [number, number] = network === 'rail' ? [79.45, 15.45] : [78.96, 20.59]
      const initialZoom = network === 'rail' ? 7.2 : 4.5

      const createdMap = new maplibre.Map({
        container: container.current,
        style: mapStyle,
        center: initialCenter,
        zoom: initialZoom,
        minZoom: 3.5,
        maxZoom: 14,
      })

      mapInstance = createdMap
      mapRef.current = createdMap
      createdMap.addControl(new maplibre.NavigationControl({ showCompass: false }), 'bottom-right')

      createdMap.on('load', async () => {
        addLayers(
          createdMap,
          maplibre,
          year,
          system,
          (station) => stationSelectRef.current(station),
          (stop) => railSelectRef.current?.(stop),
          network,
        )
        onReady()

        if (network === 'rail') {
          const routeSource = createdMap.getSource('routes') as GeoJSONSource | undefined
          const stationSource = createdMap.getSource('stations') as GeoJSONSource | undefined
          const trainSource = createdMap.getSource('train-marker') as GeoJSONSource | undefined

          if (routeSource && showRoutes) routeSource.setData(getTrain17216RouteGeoJson())
          if (stationSource && showStations) stationSource.setData(getTrain17216StationsGeoJson())

          const { position, bearing } = getTrainPositionAtProgress(trainProgress)
          if (trainSource) trainSource.setData(getTrainMarkerGeoJson(position, bearing))

          onRouteStatus('real')
          return
        }

        if (network !== 'metro') {
          onRouteStatus('unavailable')
          return
        }

        onRouteStatus('loading')
        const version = ++hydrateVersion.current
        const loaded = await hydrateMapWithBundledRoutes(
          createdMap,
          system,
          year,
          () => hydrateVersion.current === version,
          { showStations, showRoutes },
        )
        if (hydrateVersion.current === version) {
          onRouteStatus(loaded > 0 ? 'real' : 'unavailable')
        }
      })
    })

    return () => {
      disposed = true
      mapInstance?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2. Synchronize layers when parameters change (year, system, network, trainProgress, toggles)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    const routeSource = map.getSource('routes') as GeoJSONSource | undefined
    const stationSource = map.getSource('stations') as GeoJSONSource | undefined
    const trainSource = map.getSource('train-marker') as GeoJSONSource | undefined

    if (network === 'rail') {
      // Indian Railways Train 17216 mode
      if (routeSource) {
        routeSource.setData(showRoutes ? getTrain17216RouteGeoJson() : emptyRouteCollection())
      }
      if (stationSource) {
        stationSource.setData(showStations ? getTrain17216StationsGeoJson() : emptyRouteCollection())
      }

      const { position, bearing } = getTrainPositionAtProgress(trainProgress)
      if (trainSource) {
        trainSource.setData(getTrainMarkerGeoJson(position, bearing))
      }

      onRouteStatus('real')
      return
    }

    // Non-rail: clear train marker
    if (trainSource) {
      trainSource.setData(emptyRouteCollection())
    }

    if (network !== 'metro') {
      ++hydrateVersion.current
      routeSource?.setData(emptyRouteCollection())
      stationSource?.setData(geoJson([]))
      onRouteStatus('unavailable')
      return
    }

    if (isTransitDataLoaded()) {
      // Data is in cache: update directly without flicker
      const features = showRoutes ? getRouteFeaturesForSystem(system, year) : []
      const stations = showStations ? visibleStationsFor(system, year) : []

      if (routeSource) {
        routeSource.setData(
          features.length ? { type: 'FeatureCollection', features } : emptyRouteCollection(),
        )
      }
      if (stationSource) {
        stationSource.setData(geoJson(stations))
      }

      onRouteStatus(features.length > 0 ? 'real' : 'unavailable')
    } else {
      // First load: hydrate asynchronously
      onRouteStatus('loading')
      const version = ++hydrateVersion.current
      hydrateMapWithBundledRoutes(
        map,
        system,
        year,
        () => hydrateVersion.current === version,
        { showStations, showRoutes },
      ).then((loadedCount) => {
        if (hydrateVersion.current === version) {
          onRouteStatus(loadedCount > 0 ? 'real' : 'unavailable')
        }
      })
    }
  }, [year, system, network, trainProgress, showStations, showRoutes, mapRef, onRouteStatus])

  return (
    <div
      ref={container}
      className="map-canvas"
      aria-label={`Historical map for ${year}`}
    />
  )
}
