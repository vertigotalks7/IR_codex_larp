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
  findJunctionByCode,
  findCorridorById,
  preloadRailwayData,
  isRailwayDataLoaded,
} from '../../services/railwayService'
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
  onSelectStation: (station: Station) => void
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
  onSelectRailwayJunction: ((junction: RailwayJunction) => void) | undefined,
  network: NetworkMode,
) {
  const visibleStations = network === 'metro' ? visibleStationsFor(system, year) : []
  map.addSource('routes', { type: 'geojson', data: emptyRouteCollection() })
  map.addSource('stations', { type: 'geojson', data: geoJson(visibleStations) })

  // Railway & Metro Route Lines
  map.addLayer({
    id: 'routes',
    type: 'line',
    source: 'routes',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': ['coalesce', ['get', 'color'], '#1d4ed8'],
      'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1.8, 7, 3, 11, 4.5],
      'line-opacity': 0.9,
    },
  })

  // Stations / Junctions Layer
  map.addLayer({
    id: 'stations',
    type: 'circle',
    source: 'stations',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 2.5, 7, 4.5, 11, 6],
      'circle-color': ['coalesce', ['get', 'color'], '#f7f3ea'],
      'circle-stroke-color': '#10283b',
      'circle-stroke-width': 1.5,
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
      const p = feature.properties || {}
      if (p.from && p.to && p.from !== 'Track') {
        content =
          `<strong>${p.from} ↔ ${p.to}</strong><br/>` +
          `<span>Zone: <b>${p.zone}</b> · Gauge: <b>${p.gauge}</b></span><br/>` +
          `<small>Speed Limit: <b>${p.speed} km/h</b> · Track Length: <b>${p.length} km</b><br/>` +
          `Track: ${p.lanes === 2 ? 'Double Line' : 'Single Line'} ${p.bridge ? '· Bridge' : ''} ${p.tunnel ? '· Tunnel' : ''}<br/>` +
          `Source: Official Indian Railways GIS Network</small>`
      } else {
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
            `<strong>${feature.properties?.name || 'Railway Track'}</strong><br/>` +
            `<span>Indian Railways GIS Alignment</span><br/>` +
            `<small>Source: Official Indian Railways GIS Network</small>`
        }
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
    const p = feature?.properties || {}
    const id = p.id || ''

    // Railway Junction / Station handling
    if (p.kind === 'railway-junction' || id.startsWith('junc-') || id.startsWith('ir-')) {
      const code = p.code ?? id.replace('ir-', '')
      const junction = findJunctionByCode(code)
      if (junction) {
        onSelectRailwayJunction?.(junction)
      }

      new maplibre.Popup({ closeButton: true, offset: 8 })
        .setLngLat(event.lngLat)
        .setHTML(
          `<strong>${p.name || 'Railway Station'}</strong><br/>` +
            `<span>Zone: <b>${p.zones || p.zone || p.primaryZone || 'Indian Railways'}</b></span><br/>` +
            `<small>${p.connections ? `Connected Lines: <b>${p.connections}</b> · ` : ''}${p.platforms ? `Platforms: <b>${p.platforms}</b> · ` : ''}Type: Junction Hub</small>`,
        )
        .addTo(map)
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
  selectedCorridorId = 'all',
  onSelectStation,
  onSelectRailwayJunction,
  onReady,
  onRouteStatus,
}: MapViewProps) {
  const container = useRef<HTMLDivElement>(null)
  const hydrateVersion = useRef(0)
  const stationSelectRef = useRef(onSelectStation)
  stationSelectRef.current = onSelectStation
  const railJunctionSelectRef = useRef(onSelectRailwayJunction)
  railJunctionSelectRef.current = onSelectRailwayJunction

  // 1. Initialize MapLibre
  useEffect(() => {
    if (!container.current) return
    let disposed = false
    let mapInstance: Map | null = null

    void loadMapLibre().then((maplibre) => {
      if (!container.current || disposed) return
      const initialCenter: [number, number] = network === 'rail' ? [78.96, 21.5] : [78.96, 20.59]
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
          (junction) => railJunctionSelectRef.current?.(junction),
          network,
        )
        onReady()

        if (network === 'rail') {
          const routeSource = createdMap.getSource('routes') as GeoJSONSource | undefined
          const stationSource = createdMap.getSource('stations') as GeoJSONSource | undefined

          const applyRail = () => {
            if (routeSource && showRoutes) {
              routeSource.setData(getNationalRailwaysTrackGeoJson(selectedCorridorId))
            }
            if (stationSource && showStations) {
              stationSource.setData(getNationalRailwaysJunctionsGeoJson(selectedCorridorId))
            }
            onRouteStatus('real')
          }

          if (isRailwayDataLoaded()) {
            applyRail()
          } else {
            onRouteStatus('loading')
            preloadRailwayData().then(() => {
              applyRail()
            })
          }
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

    if (network === 'rail') {
      const applyRail = () => {
        if (routeSource) {
          routeSource.setData(showRoutes ? getNationalRailwaysTrackGeoJson(selectedCorridorId) : emptyRouteCollection())
        }
        if (stationSource) {
          stationSource.setData(showStations ? getNationalRailwaysJunctionsGeoJson(selectedCorridorId) : emptyRouteCollection())
        }
        onRouteStatus('real')
      }

      if (isRailwayDataLoaded()) {
        applyRail()
      } else {
        onRouteStatus('loading')
        preloadRailwayData().then(() => {
          applyRail()
        })
      }
      return
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
  }, [year, system, network, selectedCorridorId, showStations, showRoutes, mapRef, onRouteStatus])

  return (
    <div
      ref={container}
      className="map-canvas"
      aria-label={`Historical map for ${year}`}
    />
  )
}
