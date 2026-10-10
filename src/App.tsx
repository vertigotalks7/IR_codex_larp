import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { type Map } from 'maplibre-gl'
import { milestones, routes, stations, isVisible, type Route, type Station } from './data'

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

function addLayers(map: Map, year: number) {
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
    new maplibregl.Popup({ closeButton: true, offset: 8 }).setLngLat(event.lngLat).setHTML(`<strong>${feature.properties?.name}</strong><br/><span>Route history available in the detail panel.</span>`).addTo(map)
  })
  map.on('click', 'stations', (event) => {
    const feature = event.features?.[0]
    if (!feature) return
    new maplibregl.Popup({ offset: 8 }).setLngLat(event.lngLat).setHTML(`<strong>${feature.properties?.name}</strong><br/><span>Station present in ${year}.</span>`).addTo(map)
  })
}

function MapView({ year, mapRef, onSelectStation, onReady }: { year: number; mapRef: React.MutableRefObject<Map | null>; onSelectStation: (station: Station) => void; onReady: () => void }) {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!container.current) return
    const map = new maplibregl.Map({ container: container.current, style: mapStyle, center: [77.2, 28.57], zoom: 9.5, minZoom: 7.5, maxZoom: 14 })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.on('load', () => {
      addLayers(map, year)
      map.on('click', 'stations', (event) => {
        const id = event.features?.[0]?.properties?.id
        const station = stations.find((item) => item.id === id)
        if (station) onSelectStation(station)
      })
      onReady()
    })
    return () => { map.remove(); mapRef.current = null }
    // Map instances are deliberately created once; year changes update their sources below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const [leftYear, setLeftYear] = useState(2004)
  const [rightYear, setRightYear] = useState(2018)
  const [divider, setDivider] = useState(51)
  const [mode, setMode] = useState<'swipe' | 'dual' | 'play'>('swipe')
  const [playing, setPlaying] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [mapsReady, setMapsReady] = useState(0)
  const leftMap = useRef<Map | null>(null)
  const rightMap = useRef<Map | null>(null)
  const previousYears = useRef({ left: leftYear, right: rightYear })

  const leftStations = useMemo(() => stations.filter((s) => isVisible(s.opened, leftYear, 'operational')), [leftYear])
  const rightStations = useMemo(() => stations.filter((s) => isVisible(s.opened, rightYear, 'operational')), [rightYear])
  const added = rightStations.filter((station) => !leftStations.some((left) => left.id === station.id))
  const removed = leftStations.filter((station) => !rightStations.some((right) => right.id === station.id))
  const visibleRouteCount = routes.filter((route) => isVisible(route.opened, rightYear, route.status)).length

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setRightYear((year) => {
        const next = year >= 2018 ? 2004 : year + 1
        if (next === 2004) setPlaying(false)
        return next
      })
    }, 700)
    return () => window.clearInterval(timer)
  }, [playing])

  useEffect(() => {
    if (mapsReady < 2) return
    let syncing = false
    const sync = (source: Map | null, target: Map | null) => {
      if (!source || !target) return
      const onMove = () => {
        if (syncing) return
        syncing = true
        target.jumpTo({ center: source.getCenter(), zoom: source.getZoom(), bearing: source.getBearing(), pitch: source.getPitch() })
        window.requestAnimationFrame(() => { syncing = false })
      }
      source.on('moveend', onMove)
      return () => source.off('moveend', onMove)
    }
    const cleanLeft = sync(leftMap.current, rightMap.current)
    const cleanRight = sync(rightMap.current, leftMap.current)
    return () => { cleanLeft?.(); cleanRight?.() }
  }, [mapsReady, mode])

  const swapYears = () => { setLeftYear(rightYear); setRightYear(leftYear) }
  const handleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.preventDefault()
  }

  return <main>
    <header className="topbar">
      <div className="brand"><span className="brand-mark">↔</span><div><strong>Transit Time Machine</strong><small>India’s historical railway atlas</small></div></div>
      <div className="topbar-note"><span className="live-dot" /> Historical data mode <span className="separator">·</span> Delhi sample network</div>
    </header>
    <section className="hero">
      <div><p className="eyebrow">A cartographic research tool</p><h1>Watch India’s transit network <em>change shape.</em></h1><p className="intro">Compare the Delhi network across time. Every route and station is filtered from dated source records so the map tells a traceable story of expansion.</p></div>
      <div className="story-card"><span className="story-kicker">Featured story</span><strong>Delhi Metro: from one corridor to a city-scale network</strong><span>2004 → 2018 · 14 years of expansion</span></div>
    </section>
    <section className="workspace">
      <div className="workspace-toolbar">
        <div className="mode-tabs" role="tablist" aria-label="Comparison mode">
          {([['swipe', 'Swipe compare'], ['dual', 'Dual maps'], ['play', 'Playback']] as const).map(([value, label]) => <button key={value} className={mode === value ? 'active' : ''} onClick={() => setMode(value)}>{label}</button>)}
        </div>
        <div className="toolbar-actions"><button className="quiet-button" onClick={swapYears}>⇄ Swap years</button><button className="quiet-button" onClick={() => { setLeftYear(2004); setRightYear(2018) }}>Reset view</button></div>
      </div>
      <div className={`map-shell ${mode === 'dual' ? 'dual-mode' : ''}`}>
        <div className="map-pane map-pane-left" style={mode === 'swipe' ? { width: `${divider}%` } : undefined}><MapView year={leftYear} mapRef={leftMap} onSelectStation={setSelectedStation} onReady={() => setMapsReady((value) => Math.min(2, value + 1))} /><div className="map-label left-label">Earlier network <b>{leftYear}</b></div></div>
        <div className="map-pane map-pane-right"><MapView year={rightYear} mapRef={rightMap} onSelectStation={setSelectedStation} onReady={() => setMapsReady((value) => Math.min(2, value + 1))} /><div className="map-label right-label">Later network <b>{rightYear}</b></div></div>
        {mode === 'swipe' && <div className="divider" style={{ left: `${divider}%` }}><input aria-label="Comparison divider" type="range" min="8" max="92" value={divider} onChange={(event) => setDivider(Number(event.target.value))} onKeyDown={handleKey} /><span className="divider-grip">↔</span></div>}
        <div className="legend"><span><i className="legend-line metro" /> Metro</span><span><i className="legend-line rail" /> Rail corridor</span><span><i className="legend-dot" /> Station</span></div>
      </div>
    </section>
    <section className="control-grid">
      <div className="panel year-panel"><div className="panel-heading"><div><span className="panel-kicker">Compare years</span><h2>Two moments in one map</h2></div><span className="dataset-badge">Dataset · v0.1</span></div><div className="year-controls"><label><span>Earlier</span><strong>{leftYear}</strong><input type="range" min="1926" max="2018" step="1" value={leftYear} onChange={(event) => setLeftYear(Number(event.target.value))} /></label><label><span>Later</span><strong>{rightYear}</strong><input type="range" min="1926" max="2025" step="1" value={rightYear} onChange={(event) => setRightYear(Number(event.target.value))} /></label></div><div className="stats"><Stat value={leftStations.length} label={`stations in ${leftYear}`} /><Stat value={rightStations.length} label={`stations in ${rightYear}`} /><Stat value={`+${added.length}`} label="new stations" /><Stat value={visibleRouteCount} label="active routes" /></div></div>
      <div className="panel inspect-panel"><div className="panel-heading"><div><span className="panel-kicker">Change inspection</span><h2>What moved?</h2></div><span className="muted">{leftYear} → {rightYear}</span></div><div className="change-list">{added.length ? <div className="change-row"><span className="change-icon added">+</span><div><strong>{added.length} station{added.length === 1 ? '' : 's'} added</strong><span>{added.map((station) => station.name).join(', ')}</span></div></div> : null}{removed.length ? <div className="change-row"><span className="change-icon removed">−</span><div><strong>{removed.length} station{removed.length === 1 ? '' : 's'} absent</strong><span>{removed.map((station) => station.name).join(', ')}</span></div></div> : null}<div className="change-row"><span className="change-icon neutral">≈</span><div><strong>Available historical records</strong><span>Changes reflect this verified sample, not every physical change.</span></div></div></div></div>
    </section>
    <section className="below-fold"><div className="timeline panel"><div className="panel-heading"><div><span className="panel-kicker">Historical thread</span><h2>Delhi’s network, in milestones</h2></div>{mode === 'play' && <button className="play-button" onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ Pause' : '▶ Play expansion'}</button>}</div><div className="milestones">{milestones.map((milestone) => <button key={milestone.year} className={rightYear === milestone.year ? 'milestone active' : 'milestone'} onClick={() => { setRightYear(milestone.year); rightMap.current?.flyTo({ center: milestone.coordinates, zoom: 11 }) }}><span className="milestone-dot" /><span className="milestone-year">{milestone.year}</span><strong>{milestone.label}</strong><small>{milestone.detail}</small></button>)}</div></div><aside className="detail panel">{selectedStation ? <><span className="panel-kicker">Selected station</span><h2>{selectedStation.name}</h2><p>{selectedStation.city} · Opened {selectedStation.opened}</p><div className="tag-row">{selectedStation.lines.map((line) => <span key={line} className="tag">{line}</span>)}</div><a href={selectedStation.source} target="_blank" rel="noreferrer">Open source ↗</a></> : <><span className="panel-kicker">Explore the map</span><h2>Click a station</h2><p>Inspect opening dates, connected lines and the source record behind this sample.</p><span className="hint">Tip · drag the handle, then move either map to keep the comparison aligned.</span></>}</aside></section>
    <footer><span>Transit Time Machine · Historical data is intentionally scoped to a small, source-backed Delhi sample.</span><span>Map tiles © OpenStreetMap contributors · <a href="https://delhimetrorail.com/" target="_blank" rel="noreferrer">DMRC source</a> · <a href="https://ncrtc.in/" target="_blank" rel="noreferrer">NCRTC source</a></span></footer>
  </main>
}
