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

  return <main>
    <header className="topbar"><div className="brand"><span className="brand-mark">↔</span><div><strong>Transit Time Machine</strong><small>India’s historical railway atlas</small></div></div><div className="topbar-note"><span className="live-dot" /> Historical data mode <span className="separator">·</span> Delhi sample network</div></header>
    <section className="hero"><div><p className="eyebrow">India’s metro atlas</p><h1>Watch India’s metro network <em>change shape.</em></h1><p className="intro">Explore metro systems across India on one living map. Filter by city, follow each system’s colored lines, and move through the years as new networks open.</p></div><div className="story-card"><span className="story-kicker">Network view</span><strong>{systems.length} metro systems · {systems.reduce((count, item) => count + item.lines.length, 0)} colored line families</strong><span>2002 → 2024 · source-linked overview</span></div></section>
    <section className="workspace"><div className="workspace-toolbar"><div><span className="panel-kicker">Metro systems</span><strong className="current-year">{selectedSystem?.city ?? 'India'}</strong></div><div className="toolbar-actions"><button className="quiet-button" onClick={() => setYear(2022)}>Jump to 2022</button><button className="play-button" onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ Pause' : '▶ Play time'}</button></div></div><div className="system-filter" role="tablist" aria-label="Filter metro system"><button className={system === 'all' ? 'active' : ''} onClick={() => setSystem('all')}>All India</button>{systems.map((item) => <button key={item.id} className={system === item.id ? 'active' : ''} onClick={() => { setSystem(item.id); const line = routes.find((route) => route.system === item.id); if (line) mapRef.current?.flyTo({ center: line.coordinates[Math.floor(line.coordinates.length / 2)], zoom: 10 }) }}><i style={{ background: item.color }} />{item.name}</button>)}</div>
      <div className="map-shell single-map"><MapView year={year} system={system} mapRef={mapRef} onSelectStation={setSelectedStation} onReady={() => setMapReady(true)} /><div className="map-label current-label">{selectedSystem?.name ?? 'India’s metro systems'} · <b>{year}</b></div><div className="map-time-control"><div className="time-control-heading"><span>Move through time</span><strong>{year}</strong></div><input aria-label="Historical year" type="range" min="2002" max="2024" step="1" value={year} onChange={(event) => setYear(Number(event.target.value))} /><div className="time-ticks"><span>2002</span><span>2010</span><span>2017</span><span>2024</span></div></div><div className="legend"><span><i className="legend-line metro" /> Metro line</span><span><i className="legend-dot" /> Station sample</span><span>{visibleRoutes.length} lines visible</span></div></div>
    </section>
    <section className="control-grid"><div className="panel year-panel"><div className="panel-heading"><div><span className="panel-kicker">Network snapshot</span><h2>{selectedSystem?.name ?? 'India’s metro systems'} in {year}</h2></div><span className="dataset-badge">Dataset · metro v0.2</span></div><div className="stats snapshot-stats"><Stat value={visibleStations.length} label="stations in view" /><Stat value={visibleRoutes.length} label="active lines" /><Stat value={systems.length} label="systems mapped" /><Stat value={mapReady ? 'Ready' : 'Loading'} label="map status" /></div><p className="dataset-note">System and line metadata are source-linked. The current cross-city lines are an overview layer; detailed station-by-station GTFS geometry is being added city by city.</p></div>
      <div className="panel inspect-panel"><div className="panel-heading"><div><span className="panel-kicker">At this moment</span><h2>{latestMilestone?.label ?? 'Before the sample'}</h2></div><span className="muted">{year}</span></div><p className="milestone-copy">{latestMilestone?.detail ?? 'Move the time slider forward to see the first milestone.'}</p><button className="quiet-button" onClick={() => latestMilestone && mapRef.current?.flyTo({ center: latestMilestone.coordinates, zoom: 11 })}>Fly to milestone ↗</button></div></section>
    <section className="below-fold"><div className="timeline panel"><div className="panel-heading"><div><span className="panel-kicker">Historical thread</span><h2>Delhi’s network, in milestones</h2></div></div><div className="milestones">{milestones.map((milestone) => <button key={milestone.year} className={year === milestone.year ? 'milestone active' : 'milestone'} onClick={() => { setYear(milestone.year); mapRef.current?.flyTo({ center: milestone.coordinates, zoom: 11 }) }}><span className="milestone-dot" /><span className="milestone-year">{milestone.year}</span><strong>{milestone.label}</strong><small>{milestone.detail}</small></button>)}</div></div><aside className="detail panel">{selectedStation ? <><span className="panel-kicker">Selected station</span><h2>{selectedStation.name}</h2><p>{selectedStation.city} · Opened {selectedStation.opened}</p><div className="tag-row">{selectedStation.lines.map((line) => <span key={line} className="tag">{line}</span>)}</div><div className="detail-links"><a href={selectedStation.source} target="_blank" rel="noreferrer">Opening/source record ↗</a><a href={selectedStation.coordinateSource} target="_blank" rel="noreferrer">Coordinate source ↗</a></div></> : <><span className="panel-kicker">Explore the map</span><h2>Click a station</h2><p>Inspect opening dates, connected lines and the source record behind this sample.</p><span className="hint">Tip · use the small time slider over the map to watch the network grow.</span></>}</aside></section>
    <footer><span>Transit Time Machine · Historical data is intentionally scoped to a small, source-backed Delhi sample.</span><span>Map tiles © OpenStreetMap contributors · <a href="https://delhimetrorail.com/" target="_blank" rel="noreferrer">DMRC source</a> · <a href="https://ncrtc.in/" target="_blank" rel="noreferrer">NCRTC source</a></span></footer>
  </main>
}
