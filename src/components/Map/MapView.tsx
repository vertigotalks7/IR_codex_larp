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
  getNationalRailwaysTrackGeoJson,
  getNationalRailwaysJunctionsGeoJson,
  getTrainPositionAtProgress,
  getTrainMarkerGeoJson,
  findJunctionByCode,
  findCorridorById,
} from '../../services/railwayService'
import { train17216, type RailwayStationStop } from '../../data/indianRailways'
import type { RailwayJunction } from '../../data/nationalRailways'
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
  selectedCorridorId?: string
  trainProgress?: number
  onSelectStation: (station: Station) => void
  onSelectRailwayStop?: (stop: RailwayStationStop) => void
  onSelectRailwayJunction?: (junction: RailwayJunction) => void
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
  onSelectRailwayJunction: ((junction: RailwayJunction) => void) | undefined,
  network: NetworkMode,
) {
  const visibleStations = network === 'metro' ? visibleStationsFor(system, year) : []
  map.addSource('routes', { type: 'geojson', data: emptyRouteCollection() })
  map.addSource('stations', { type: 'geojson', data: geoJson(visibleStations) })
  map.addSource('train-marker', { type: 'geojson', data: emptyRouteCollection() })

  // Railway & Metro Route Lines
  map.addLayer({
    id: 'routes',
    type: 'line',
    source: 'routes',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': ['get', 'color'], 'line-width': 4.5, 'line-opacity': 0.9 },
  })

  // Stations / Junctions Layer
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

  // Live Train Radar Pulse Layer (Outer glow)
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

  // Live Train Radar Dot Layer (Inner marker)
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
    let content = `<strong>${feature.properties?.name}</strong><br/><span>Route history available in the source record.</span>`

    if (isRailway) {
      const corridorId = feature.properties?.id
      const corridor = findCorridorById(corridorId)
      if (corridor) {
        content =
          `<strong>${corridor.name} (${corridor.code})</strong><br/>` +
          `<span>${corridor.origin} → ${corridor.destination}</span><br/>` +
          `<small>Zone: <b>${corridor.zone}</b> · Distance: <b>${corridor.distanceKm} km</b><br/>` +
          `Gauge: ${corridor.gauge} · Electrification: ${corridor.electrification}</small>`
      } else {
        content =
          `<strong>${feature.properties?.name}</strong><br/>` +
          `<span>Indian Railways verified GIS alignment</span><br/>` +
          `<small>Source: Humanitarian Data Exchange (HDX) & OpenStreetMap</small>`
      }
    }

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

    // Railway Junction / Stop handling
    if (id.startsWith('ir-')) {
      const code = feature.properties?.code ?? id.replace('ir-', '')

      const junction = findJunctionByCode(code)
      if (junction) {
        onSelectRailwayJunction?.(junction)
        new maplibre.Popup({ closeButton: true, offset: 8 })
          .setLngLat(event.lngLat)
          .setHTML(
            `<strong>${junction.name} (${junction.code})</strong><br/>` +
              `<span>Zone: <b>${junction.zone}</b> · Division: <b>${junction.division}</b></span><br/>` +
              `<small>State: ${junction.state} · Platforms: ${junction.platforms}</small>`,
          )
          .addTo(map)
        return
      }

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
        return
      }
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
  selectedCorridorId = 'all',
  trainProgress = 0.58,
  onSelectStation,
  onSelectRailwayStop,
  onSelectRailwayJunction,
  onReady,
  onRouteStatus,
}: MapViewProps) {
  const container = useRef<HTMLDivElement>(null)
  const hydrateVersion = useRef(0)
  const stationSelectRef = useRef(onSelectStation)
  stationSelectRef.current = onSelectStation
  const railStopSelectRef = useRef(onSelectRailwayStop)
  railStopSelectRef.current = onSelectRailwayStop
  const railJunctionSelectRef = useRef(onSelectRailwayJunction)
  railJunctionSelectRef.current = onSelectRailwayJunction

  // 1. Initialize MapLibre
  useEffect(() => {
    if (!container.current) return
    let disposed = false
    let mapInstance: Map | null = null

    void loadMapLibre().then((maplibre) => {
      if (!container.current || disposed) return
      const initialCenter: [number, number] = network === 'rail' ? [79.45, 21.0] : [78.96, 20.59]
      const initialZoom = network === 'rail' ? 4.8 : 4.5

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
          (stop) => railStopSelectRef.current?.(stop),
          (junction) => railJunctionSelectRef.current?.(junction),
          network,
        )
        onReady()

        if (network === 'rail') {
          const routeSource = createdMap.getSource('routes') as GeoJSONSource | undefined
          const stationSource = createdMap.getSource('stations') as GeoJSONSource | undefined
          const trainSource = createdMap.getSource('train-marker') as GeoJSONSource | undefined

          if (routeSource && showRoutes) {
            routeSource.setData(getNationalRailwaysTrackGeoJson(selectedCorridorId))
          }
          if (stationSource && showStations) {
            stationSource.setData(getNationalRailwaysJunctionsGeoJson(selectedCorridorId))
          }

          if (trainSource && selectedCorridorId === 'rayalaseema-scr-dmm-mtm') {
            const { position, bearing } = getTrainPositionAtProgress(trainProgress)
            trainSource.setData(getTrainMarkerGeoJson(position, bearing))
          }

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

  // 2. Synchronize layers when parameters change
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    const routeSource = map.getSource('routes') as GeoJSONSource | undefined
    const stationSource = map.getSource('stations') as GeoJSONSource | undefined
    const trainSource = map.getSource('train-marker') as GeoJSONSource | undefined

    if (network === 'rail') {
      // Real Indian Railways Track Network
      if (routeSource) {
        routeSource.setData(showRoutes ? getNationalRailwaysTrackGeoJson(selectedCorridorId) : emptyRouteCollection())
      }
      if (stationSource) {
        stationSource.setData(showStations ? getNationalRailwaysJunctionsGeoJson(selectedCorridorId) : emptyRouteCollection())
      }

      // Show live train radar marker if viewing the Rayalaseema / 17216 corridor or overall network
      if (trainSource && (selectedCorridorId === 'all' || selectedCorridorId === 'rayalaseema-scr-dmm-mtm')) {
        const { position, bearing } = getTrainPositionAtProgress(trainProgress)
        trainSource.setData(getTrainMarkerGeoJson(position, bearing))
      } else if (trainSource) {
        trainSource.setData(emptyRouteCollection())
      }

      onRouteStatus('real')
      return
    }

    // Non-rail modes: clear train marker
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
  }, [year, system, network, selectedCorridorId, trainProgress, showStations, showRoutes, mapRef, onRouteStatus])

  return (
    <div
      ref={container}
      className="map-canvas"
      aria-label={`Historical map for ${year}`}
    />
  )
}
