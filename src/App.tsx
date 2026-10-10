import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { type Map } from 'maplibre-gl'
import { milestones, routes, stations, years, isVisible, type Route, type Station } from './data'

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

function addLayers(map: Map, year: number, onSelectStation: (station: Station) => void) {
  const visibleRoutes = routes.filter((route) => isVisible(route.opened, year, route.status))
  const visibleStations = stations.filter((station) => isVisible(station.opened, year, 'operational'))
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

function MapView({ year, mapRef, onSelectStation, onReady }: { year: number; mapRef: React.MutableRefObject<Map | null>; onSelectStation: (station: Station) => void; onReady: () => void }) {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!container.current) return
    const map = new maplibregl.Map({ container: container.current, style: mapStyle, center: [77.2, 28.57], zoom: 9.5, minZoom: 7.5, maxZoom: 14 })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.on('load', () => { addLayers(map, year, onSelectStation); onReady() })
    return () => { map.remove(); mapRef.current = null }
    // The map instance owns this lifecycle; parent renders must not recreate it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const routeSource = map.getSource('routes') as maplibregl.GeoJSONSource | undefined
    const stationSource = map.getSource('stations') as maplibregl.GeoJSONSource | undefined
    if (routeSource) routeSource.setData(geoJson(routes.filter((route) => isVisible(route.opened, year, route.status))))
    if (stationSource) stationSource.setData(geoJson(stations.filter((station) => isVisible(station.opened, year, 'operational'))))
  }, [year, mapRef])
  return <div ref={container} className="map-canvas" aria-label={`Historical map for ${year}`} />
}

function Stat({ value, label }: { value: string | number; label: string }) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div> }

export default function App() {
  const [year, setYear] = useState(2018)
  const [playing, setPlaying] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const mapRef = useRef<Map | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const visibleStations = useMemo(() => stations.filter((station) => isVisible(station.opened, year, 'operational')), [year])
  const visibleRoutes = useMemo(() => routes.filter((route) => isVisible(route.opened, year, route.status)), [year])
  const latestMilestone = [...milestones].reverse().find((milestone) => milestone.year <= year)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setYear((current) => {
        const nextIndex = years.indexOf(current) + 1
        if (nextIndex >= years.length || years[nextIndex] > 2018) { setPlaying(false); return current }
        return years[nextIndex]
      })
    }, 900)
    return () => window.clearInterval(timer)
  }, [playing])

  return <main>
    <header className="topbar"><div className="brand"><span className="brand-mark">↔</span><div><strong>Transit Time Machine</strong><small>India’s historical railway atlas</small></div></div><div className="topbar-note"><span className="live-dot" /> Historical data mode <span className="separator">·</span> Delhi sample network</div></header>
    <section className="hero"><div><p className="eyebrow">A cartographic research tool</p><h1>Watch India’s transit network <em>change shape.</em></h1><p className="intro">Move through Delhi’s transit history on one living map. Every route and station is filtered from dated source records so the map tells a traceable story of expansion.</p></div><div className="story-card"><span className="story-kicker">Featured story</span><strong>Delhi Metro: from one corridor to a city-scale network</strong><span>1926 → 2018 · 92 years of expansion</span></div></section>
    <section className="workspace"><div className="workspace-toolbar"><div><span className="panel-kicker">Historical map</span><strong className="current-year">{year}</strong></div><div className="toolbar-actions"><button className="quiet-button" onClick={() => setYear(2018)}>Jump to 2018</button><button className="play-button" onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ Pause' : '▶ Play time'}</button></div></div>
      <div className="map-shell single-map"><MapView year={year} mapRef={mapRef} onSelectStation={setSelectedStation} onReady={() => setMapReady(true)} /><div className="map-label current-label">Network in <b>{year}</b></div><div className="map-time-control"><div className="time-control-heading"><span>Move through time</span><strong>{year}</strong></div><input aria-label="Historical year" type="range" min="1926" max="2018" step="1" value={year} onChange={(event) => setYear(Number(event.target.value))} /><div className="time-ticks"><span>1926</span><span>2004</span><span>2010</span><span>2018</span></div></div><div className="legend"><span><i className="legend-line metro" /> Metro</span><span><i className="legend-line rail" /> Rail corridor</span><span><i className="legend-dot" /> Station</span></div></div>
    </section>
    <section className="control-grid"><div className="panel year-panel"><div className="panel-heading"><div><span className="panel-kicker">Network snapshot</span><h2>What exists in {year}?</h2></div><span className="dataset-badge">Dataset · v0.1</span></div><div className="stats snapshot-stats"><Stat value={visibleStations.length} label="stations present" /><Stat value={visibleRoutes.length} label="active routes" /><Stat value={latestMilestone?.year ?? '—'} label="latest milestone" /><Stat value={mapReady ? 'Ready' : 'Loading'} label="map status" /></div><p className="dataset-note">The historical layer changes immediately as you move the slider. Records reflect this verified sample, not every physical change.</p></div>
      <div className="panel inspect-panel"><div className="panel-heading"><div><span className="panel-kicker">At this moment</span><h2>{latestMilestone?.label ?? 'Before the sample'}</h2></div><span className="muted">{year}</span></div><p className="milestone-copy">{latestMilestone?.detail ?? 'Move the time slider forward to see the first milestone.'}</p><button className="quiet-button" onClick={() => latestMilestone && mapRef.current?.flyTo({ center: latestMilestone.coordinates, zoom: 11 })}>Fly to milestone ↗</button></div></section>
    <section className="below-fold"><div className="timeline panel"><div className="panel-heading"><div><span className="panel-kicker">Historical thread</span><h2>Delhi’s network, in milestones</h2></div></div><div className="milestones">{milestones.map((milestone) => <button key={milestone.year} className={year === milestone.year ? 'milestone active' : 'milestone'} onClick={() => { setYear(milestone.year); mapRef.current?.flyTo({ center: milestone.coordinates, zoom: 11 }) }}><span className="milestone-dot" /><span className="milestone-year">{milestone.year}</span><strong>{milestone.label}</strong><small>{milestone.detail}</small></button>)}</div></div><aside className="detail panel">{selectedStation ? <><span className="panel-kicker">Selected station</span><h2>{selectedStation.name}</h2><p>{selectedStation.city} · Opened {selectedStation.opened}</p><div className="tag-row">{selectedStation.lines.map((line) => <span key={line} className="tag">{line}</span>)}</div><a href={selectedStation.source} target="_blank" rel="noreferrer">Open source ↗</a></> : <><span className="panel-kicker">Explore the map</span><h2>Click a station</h2><p>Inspect opening dates, connected lines and the source record behind this sample.</p><span className="hint">Tip · use the small time slider over the map to watch the network grow.</span></>}</aside></section>
    <footer><span>Transit Time Machine · Historical data is intentionally scoped to a small, source-backed Delhi sample.</span><span>Map tiles © OpenStreetMap contributors · <a href="https://delhimetrorail.com/" target="_blank" rel="noreferrer">DMRC source</a> · <a href="https://ncrtc.in/" target="_blank" rel="noreferrer">NCRTC source</a></span></footer>
  </main>
}
