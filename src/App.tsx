import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { type Map } from 'maplibre-gl'
import { milestones, stations, systems, years, isVisible, type MetroSystemId, type Route, type Station } from './data'

const mapStyle = {
  version: 8 as const,
  sources: { osm: { type: 'raster' as const, tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap contributors' } },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm', paint: { 'raster-opacity': 0.78 } }],
}

function geoJson(items: Route[] | Station[]) {
  const isRoutes = items.length === 0 || 'color' in items[0]
  return {
    type: 'FeatureCollection' as const,
    features: items.map((item) => isRoutes
      ? { type: 'Feature' as const, properties: { id: (item as Route).id, name: (item as Route).name, color: (item as Route).color }, geometry: { type: 'LineString' as const, coordinates: (item as Route).coordinates } }
      : { type: 'Feature' as const, properties: { id: (item as Station).id, name: (item as Station).name }, geometry: { type: 'Point' as const, coordinates: (item as Station).coordinates } }),
  }
}

type OSMFeatureCollection = { type: 'FeatureCollection'; features: { type: 'Feature'; properties: Record<string, string>; geometry: { type: 'LineString'; coordinates: [number, number][] } }[] }
const osmRouteCache = new globalThis.Map<MetroSystemId, OSMFeatureCollection>()
const localRouteCache = new globalThis.Map<MetroSystemId, OSMFeatureCollection>()

function emptyRouteCollection(): OSMFeatureCollection {
  return { type: 'FeatureCollection', features: [] }
}

function cachedRouteFeatures(system: MetroSystemId, year: number) {
  const systemInfo = systems.find((item) => item.id === system)
  if (!systemInfo || systemInfo.opened > year) return []
  return localRouteCache.get(system)?.features ?? osmRouteCache.get(system)?.features ?? []
}

async function loadOsmRoutes(system: MetroSystemId): Promise<OSMFeatureCollection | null> {
  if (system === 'hyderabad') {
    const local = localRouteCache.get(system)
    if (local) return local
    try {
      const response = await fetch('/data/routes.json', { cache: 'no-store' })
      if (!response.ok) return null
      const payload = await response.json() as { features?: OSMFeatureCollection['features'] }
      const result = { type: 'FeatureCollection' as const, features: payload.features ?? [] }
      if (result.features.length) localRouteCache.set(system, result)
      return result.features.length ? result : null
    } catch {
      return null
    }
  }
  const cached = osmRouteCache.get(system)
  if (cached) return cached
  const systemInfo = systems.find((item) => item.id === system)
  if (!systemInfo) return null
  const [longitude, latitude] = systemInfo.center
  const query = `[out:json][timeout:30];relation["route"="subway"](around:30000,${latitude},${longitude});out body geom;`
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 20000)
  try {
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, { signal: controller.signal })
    if (!response.ok) return null
    const payload = await response.json() as { elements?: { id: number; tags?: Record<string, string>; members?: { type: string; geometry?: { lon: number; lat: number }[] }[] }[] }
    const features = (payload.elements ?? []).flatMap((relation) => (relation.members ?? []).filter((member) => member.type === 'way' && member.geometry && member.geometry.length > 1).map((member) => ({
      type: 'Feature' as const,
      properties: { id: String(relation.id), name: relation.tags?.name ?? relation.tags?.ref ?? 'Metro route', color: relation.tags?.colour ?? systemInfo.color, system },
      geometry: { type: 'LineString' as const, coordinates: member.geometry!.map((point) => [point.lon, point.lat] as [number, number]) },
    })))
    const result = { type: 'FeatureCollection' as const, features }
    if (features.length) osmRouteCache.set(system, result)
    return features.length ? result : null
  } catch {
    return null
  } finally {
    window.clearTimeout(timeout)
  }
}

async function hydrateMapWithOsmRoutes(map: Map, system: MetroSystemId | 'all', year: number) {
  const systemsToLoad = system === 'all' ? systems : systems.filter((item) => item.id === system)
  const datasets = await Promise.all(systemsToLoad.map((item) => loadOsmRoutes(item.id)))
  const features = datasets.flatMap((dataset, index) => systemsToLoad[index].opened <= year ? dataset?.features ?? [] : [])
  const source = map.getSource('routes') as maplibregl.GeoJSONSource | undefined
  if (source) source.setData({ type: 'FeatureCollection', features })
  return features.length
}

function addLayers(map: Map, year: number, system: MetroSystemId | 'all', onSelectStation: (station: Station) => void) {
  const visibleStations = stations.filter((station) => isVisible(station.opened, year, 'operational') && (system === 'all' || station.system === system))
  map.addSource('routes', { type: 'geojson', data: emptyRouteCollection() })
  map.addSource('stations', { type: 'geojson', data: geoJson(visibleStations) })
  map.addLayer({ id: 'routes', type: 'line', source: 'routes', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['get', 'color'], 'line-width': 5, 'line-opacity': 0.88 } })
  map.addLayer({ id: 'stations', type: 'circle', source: 'stations', paint: { 'circle-radius': 6, 'circle-color': '#f7f3ea', 'circle-stroke-color': '#10283b', 'circle-stroke-width': 2 } })
  map.on('mouseenter', 'routes', () => { map.getCanvas().style.cursor = 'pointer' })
  map.on('mouseleave', 'routes', () => { map.getCanvas().style.cursor = '' })
  map.on('click', 'routes', (event) => {
    const feature = event.features?.[0]
    if (!feature) return
    new maplibregl.Popup({ closeButton: true, offset: 8 }).setLngLat(event.lngLat).setHTML(`<strong>${feature.properties?.name}</strong><br/><span>Route history available in the source record.</span>`).addTo(map)
  })
  map.on('click', 'stations', (event) => {
    const id = event.features?.[0]?.properties?.id
    const station = stations.find((item) => item.id === id)
    if (station) onSelectStation(station)
  })
}

function MapView({ year, system, mapRef, onSelectStation, onReady, onRouteStatus }: { year: number; system: MetroSystemId | 'all'; mapRef: React.MutableRefObject<Map | null>; onSelectStation: (station: Station) => void; onReady: () => void; onRouteStatus: (status: 'loading' | 'real' | 'unavailable') => void }) {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!container.current) return
    const map = new maplibregl.Map({ container: container.current, style: mapStyle, center: [78.96, 20.59], zoom: 4.5, minZoom: 3.5, maxZoom: 14 })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.on('load', async () => { addLayers(map, year, system, onSelectStation); onReady(); onRouteStatus('loading'); const loaded = await hydrateMapWithOsmRoutes(map, system, year); onRouteStatus(loaded ? 'real' : 'unavailable') })
    return () => { map.remove(); mapRef.current = null }
    // The map instance owns this lifecycle; parent renders must not recreate it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const routeSource = map.getSource('routes') as maplibregl.GeoJSONSource | undefined
    const stationSource = map.getSource('stations') as maplibregl.GeoJSONSource | undefined
    const realFeatures = system === 'all' ? systems.flatMap((item) => cachedRouteFeatures(item.id, year)) : cachedRouteFeatures(system, year)
    if (routeSource) routeSource.setData(realFeatures.length ? { type: 'FeatureCollection', features: realFeatures } : emptyRouteCollection())
    if (stationSource) stationSource.setData(geoJson(stations.filter((station) => isVisible(station.opened, year, 'operational') && (system === 'all' || station.system === system))))
  }, [year, system, mapRef])
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return
    onRouteStatus('loading')
    hydrateMapWithOsmRoutes(mapRef.current, system, year).then((loaded) => onRouteStatus(loaded ? 'real' : 'unavailable'))
  }, [year, system, mapRef, onRouteStatus])
  return <div ref={container} className="map-canvas" aria-label={`Historical map for ${year}`} />
}

function Stat({ value, label }: { value: string | number; label: string }) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div> }

export default function App() {
  const [year, setYear] = useState(2022)
  const [system, setSystem] = useState<MetroSystemId | 'all'>('all')
  const [playing, setPlaying] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const mapRef = useRef<Map | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [routeStatus, setRouteStatus] = useState<'loading' | 'real' | 'unavailable'>('loading')
  const handleRouteStatus = useCallback((status: 'loading' | 'real' | 'unavailable') => setRouteStatus(status), [])
  const visibleStations = useMemo(() => stations.filter((station) => isVisible(station.opened, year, 'operational') && (system === 'all' || station.system === system)), [year, system])
  const latestMilestone = [...milestones].reverse().find((milestone) => milestone.year <= year)
  const selectedSystem = systems.find((item) => item.id === system)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setYear((current) => {
        const next = years.find((candidate) => candidate > current)
        if (next === undefined) { setPlaying(false); return current }
        return next
      })
    }, 900)
    return () => window.clearInterval(timer)
  }, [playing])

  return <main className="atlas-shell">
    <header className="atlas-topbar"><button className="atlas-logo" onClick={() => { setSystem('all'); mapRef.current?.flyTo({ center: [78.96, 20.59], zoom: 4.5 }) }}><span>↔</span><strong>Metro<span>Atlas</span></strong></button><div className="atlas-status"><i /> India · Metro network <small>{routeStatus === 'real' ? 'verified route geometry loaded' : routeStatus === 'loading' ? 'loading route geometry…' : 'route geometry unavailable'}</small></div><div className="atlas-top-actions"><button>⌕</button><button>⚙</button></div></header>
    <section className="atlas-map"><MapView year={year} system={system} mapRef={mapRef} onSelectStation={setSelectedStation} onReady={() => setMapReady(true)} onRouteStatus={handleRouteStatus} /><div className="atlas-title"><h1>India Metro Map</h1><p>{selectedSystem?.name ?? 'All metro systems'} <em>· {year}</em></p></div><div className="map-time-control atlas-time"><div className="time-control-heading"><span>Network growth</span><strong>{year}</strong></div><input aria-label="Historical year" type="range" min="2002" max="2024" step="1" value={year} onChange={(event) => setYear(Number(event.target.value))} /><div className="time-ticks"><span>2002</span><span>2010</span><span>2017</span><span>2024</span></div></div><div className="atlas-legend"><strong>LEGEND</strong><span><i className="legend-line metro" /> Metro lines</span><span><i className="legend-dot" /> Sourced station sample</span><small>© OpenStreetMap contributors · route geometry from OSM</small></div></section>
    <aside className="atlas-panel"><div className="panel-close">METRO SYSTEMS <span>⌃</span></div><div className="system-filter atlas-systems" role="tablist" aria-label="Filter metro system"><button className={system === 'all' ? 'active' : ''} onClick={() => setSystem('all')}><i style={{ background: '#f05ca8' }} />All India</button>{systems.map((item) => <button key={item.id} className={system === item.id ? 'active' : ''} onClick={() => { setSystem(item.id); mapRef.current?.flyTo({ center: item.center, zoom: 10 }) }}><i style={{ background: item.color }} />{item.name}<small>{item.lines.length} lines</small></button>)}</div><div className="settings-divider" /><div className="panel-close">MAP DETAILS <span>⌃</span></div><label className="toggle-row"><span>Show line labels</span><input type="checkbox" defaultChecked /></label><label className="toggle-row"><span>Show station samples</span><input type="checkbox" defaultChecked /></label><div className="atlas-stats"><div><strong>{routeStatus === 'real' ? 'GTFS/OSM' : routeStatus === 'loading' ? '…' : '—'}</strong><span>route source</span></div><div><strong>{visibleStations.length}</strong><span>stations in view</span></div><div><strong>{systems.length}</strong><span>systems mapped</span></div></div>{routeStatus === 'unavailable' && <p className="route-warning">No verified route geometry is bundled for this selection yet. Straight connector lines are intentionally hidden.</p>}{selectedStation && <div className="atlas-selection"><small>SELECTED STATION</small><strong>{selectedStation.name}</strong><span>{selectedStation.city} · Opened {selectedStation.opened}</span><a href={selectedStation.source} target="_blank" rel="noreferrer">Opening/source record ↗</a><a href={selectedStation.coordinateSource} target="_blank" rel="noreferrer">Coordinate source ↗</a></div>}</aside>
    <div className="atlas-milestones"><div className="milestone-strip-head"><span>HISTORICAL THREAD</span><button onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ Pause' : '▶ Play'}</button></div><div className="milestone-strip">{milestones.map((milestone) => <button key={milestone.year} className={year === milestone.year ? 'active' : ''} onClick={() => { setYear(milestone.year); mapRef.current?.flyTo({ center: milestone.coordinates, zoom: system === 'all' ? 5 : 10 }) }}><b>{milestone.year}</b><span>{milestone.label}</span></button>)}</div></div>
    <footer className="atlas-footer">Transit Time Machine · India metro overview <span>Map tiles © OpenStreetMap contributors · <a href="https://delhimetrorail.com/pages/about-us/present-network" target="_blank" rel="noreferrer">Sources</a></span></footer>
  </main>
}
