import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { type Map } from 'maplibre-gl'
import { milestones, routes, stations, systems, years, isVisible, type MetroSystemId, type Route, type Station } from './data'

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

function addLayers(map: Map, year: number, system: MetroSystemId | 'all', onSelectStation: (station: Station) => void) {
  const visibleRoutes = routes.filter((route) => isVisible(route.opened, year, route.status) && (system === 'all' || route.system === system))
  const visibleStations = stations.filter((station) => isVisible(station.opened, year, 'operational') && (system === 'all' || station.system === system))
  map.addSource('routes', { type: 'geojson', data: geoJson(visibleRoutes) })
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

function MapView({ year, system, mapRef, onSelectStation, onReady }: { year: number; system: MetroSystemId | 'all'; mapRef: React.MutableRefObject<Map | null>; onSelectStation: (station: Station) => void; onReady: () => void }) {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!container.current) return
    const map = new maplibregl.Map({ container: container.current, style: mapStyle, center: [78.96, 20.59], zoom: 4.5, minZoom: 3.5, maxZoom: 14 })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.on('load', () => { addLayers(map, year, system, onSelectStation); onReady() })
    return () => { map.remove(); mapRef.current = null }
    // The map instance owns this lifecycle; parent renders must not recreate it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const routeSource = map.getSource('routes') as maplibregl.GeoJSONSource | undefined
    const stationSource = map.getSource('stations') as maplibregl.GeoJSONSource | undefined
    if (routeSource) routeSource.setData(geoJson(routes.filter((route) => isVisible(route.opened, year, route.status) && (system === 'all' || route.system === system))))
    if (stationSource) stationSource.setData(geoJson(stations.filter((station) => isVisible(station.opened, year, 'operational') && (system === 'all' || station.system === system))))
  }, [year, system, mapRef])
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
  const visibleStations = useMemo(() => stations.filter((station) => isVisible(station.opened, year, 'operational') && (system === 'all' || station.system === system)), [year, system])
  const visibleRoutes = useMemo(() => routes.filter((route) => isVisible(route.opened, year, route.status) && (system === 'all' || route.system === system)), [year, system])
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
    <header className="atlas-topbar"><button className="atlas-logo" onClick={() => { setSystem('all'); mapRef.current?.flyTo({ center: [78.96, 20.59], zoom: 4.5 }) }}><span>↔</span><strong>Metro<span>Atlas</span></strong></button><div className="atlas-status"><i /> India · Metro network <small>source-linked overview</small></div><div className="atlas-top-actions"><button>⌕</button><button>⚙</button></div></header>
    <section className="atlas-map"><MapView year={year} system={system} mapRef={mapRef} onSelectStation={setSelectedStation} onReady={() => setMapReady(true)} /><div className="atlas-title"><h1>India Metro Map</h1><p>{selectedSystem?.name ?? 'All metro systems'} <em>· {year}</em></p></div><div className="map-time-control atlas-time"><div className="time-control-heading"><span>Network growth</span><strong>{year}</strong></div><input aria-label="Historical year" type="range" min="2002" max="2024" step="1" value={year} onChange={(event) => setYear(Number(event.target.value))} /><div className="time-ticks"><span>2002</span><span>2010</span><span>2017</span><span>2024</span></div></div><div className="atlas-legend"><strong>LEGEND</strong><span><i className="legend-line metro" /> Metro lines</span><span><i className="legend-dot" /> Sourced station sample</span><small>© OpenStreetMap contributors</small></div></section>
    <aside className="atlas-panel"><div className="panel-close">METRO SYSTEMS <span>⌃</span></div><div className="system-filter atlas-systems" role="tablist" aria-label="Filter metro system"><button className={system === 'all' ? 'active' : ''} onClick={() => setSystem('all')}><i style={{ background: '#f05ca8' }} />All India</button>{systems.map((item) => <button key={item.id} className={system === item.id ? 'active' : ''} onClick={() => { setSystem(item.id); const line = routes.find((route) => route.system === item.id); if (line) mapRef.current?.flyTo({ center: line.coordinates[Math.floor(line.coordinates.length / 2)], zoom: 10 }) }}><i style={{ background: item.color }} />{item.name}<small>{item.lines.length} lines</small></button>)}</div><div className="settings-divider" /><div className="panel-close">MAP DETAILS <span>⌃</span></div><label className="toggle-row"><span>Show line labels</span><input type="checkbox" defaultChecked /></label><label className="toggle-row"><span>Show station samples</span><input type="checkbox" defaultChecked /></label><div className="atlas-stats"><div><strong>{visibleRoutes.length}</strong><span>lines visible</span></div><div><strong>{visibleStations.length}</strong><span>stations in view</span></div><div><strong>{systems.length}</strong><span>systems mapped</span></div></div>{selectedStation && <div className="atlas-selection"><small>SELECTED STATION</small><strong>{selectedStation.name}</strong><span>{selectedStation.city} · Opened {selectedStation.opened}</span><a href={selectedStation.source} target="_blank" rel="noreferrer">Opening/source record ↗</a><a href={selectedStation.coordinateSource} target="_blank" rel="noreferrer">Coordinate source ↗</a></div>}</aside>
    <div className="atlas-milestones"><div className="milestone-strip-head"><span>HISTORICAL THREAD</span><button onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ Pause' : '▶ Play'}</button></div><div className="milestone-strip">{milestones.map((milestone) => <button key={milestone.year} className={year === milestone.year ? 'active' : ''} onClick={() => { setYear(milestone.year); mapRef.current?.flyTo({ center: milestone.coordinates, zoom: system === 'all' ? 5 : 10 }) }}><b>{milestone.year}</b><span>{milestone.label}</span></button>)}</div></div>
    <footer className="atlas-footer">Transit Time Machine · India metro overview <span>Map tiles © OpenStreetMap contributors · <a href="https://delhimetrorail.com/pages/about-us/present-network" target="_blank" rel="noreferrer">Sources</a></span></footer>
  </main>
}
