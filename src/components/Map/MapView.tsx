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
  onSelectStation: (station: Station) => void
  onReady: () => void
  onRouteStatus: (status: RouteStatus) => void
}

function addLayers(
  map: Map,
  maplibre: typeof import('maplibre-gl'),
  year: number,
  system: MetroSystemId | 'all',
  onSelectStation: (station: Station) => void,
  showMetro: boolean,
) {
  const visibleStations = showMetro ? visibleStationsFor(system, year) : []
  map.addSource('routes', { type: 'geojson', data: emptyRouteCollection() })
  map.addSource('stations', { type: 'geojson', data: geoJson(visibleStations) })

  map.addLayer({
    id: 'routes',
    type: 'line',
    source: 'routes',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': ['get', 'color'], 'line-width': 5, 'line-opacity': 0.88 },
  })

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

  map.on('mouseenter', 'routes', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'routes', () => {
    map.getCanvas().style.cursor = ''
  })
  map.on('click', 'routes', (event) => {
    const feature = event.features?.[0]
    if (!feature) return
    new maplibre.Popup({ closeButton: true, offset: 8 })
      .setLngLat(event.lngLat)
      .setHTML(
        `<strong>${feature.properties?.name}</strong><br/><span>Route history available in the source record.</span>`,
      )
      .addTo(map)
  })

  map.on('mouseenter', 'stations', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'stations', () => {
    map.getCanvas().style.cursor = ''
  })
  map.on('click', 'stations', (event) => {
    const id = event.features?.[0]?.properties?.id
    if (!id) return
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
  onSelectStation,
  onReady,
  onRouteStatus,
}: MapViewProps) {
  const container = useRef<HTMLDivElement>(null)
  const hydrateVersion = useRef(0)
  const stationSelectRef = useRef(onSelectStation)
  stationSelectRef.current = onSelectStation

  // 1. Initialize MapLibre
  useEffect(() => {
    if (!container.current) return
    let disposed = false
    let mapInstance: Map | null = null

    void loadMapLibre().then((maplibre) => {
      if (!container.current || disposed) return
      const createdMap = new maplibre.Map({
        container: container.current,
        style: mapStyle,
        center: [78.96, 20.59],
        zoom: 4.5,
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
          network === 'metro',
        )
        onReady()

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

  // 2. Synchronize layers when parameters change (year, system, network, toggles)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    const routeSource = map.getSource('routes') as GeoJSONSource | undefined
    const stationSource = map.getSource('stations') as GeoJSONSource | undefined

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
  }, [year, system, network, showStations, showRoutes, mapRef, onRouteStatus])

  return (
    <div
      ref={container}
      className="map-canvas"
      aria-label={`Historical map for ${year}`}
    />
  )
}
