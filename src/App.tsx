import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { milestones, stations, systems, years, isVisible, type MetroSystemId, type Route, type Station } from './data'

type Map = import('maplibre-gl').Map
type GeoJSONSource = import('maplibre-gl').GeoJSONSource
let maplibrePromise: Promise<typeof import('maplibre-gl')> | null = null

function loadMapLibre() {
  maplibrePromise ??= import('maplibre-gl')
  return maplibrePromise
}

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
type LocalStationFeature = { type: 'Feature'; properties: Record<string, string>; geometry: { type: 'Point'; coordinates: [number, number] } }
type LocalTransitData = { features: OSMFeatureCollection['features']; stations: LocalStationFeature[] }
const localRouteCache = new globalThis.Map<MetroSystemId, OSMFeatureCollection>()
const localStationCache = new globalThis.Map<MetroSystemId, Station[]>()
let localTransitDataPromise: Promise<LocalTransitData | null> | null = null

function emptyRouteCollection(): OSMFeatureCollection {
  return { type: 'FeatureCollection', features: [] }
}

function cachedRouteFeatures(system: MetroSystemId, year: number) {
  const systemInfo = systems.find((item) => item.id === system)
  if (!systemInfo || systemInfo.opened > year) return []
  return localRouteCache.get(system)?.features ?? []
}

function visibleStationsFor(system: MetroSystemId | 'all', year: number) {
  const importedSystems = new Set(localStationCache.keys())
  const imported = [...localStationCache.values()].flat()
  const sourceStations = stations.filter((station) => !importedSystems.has(station.system)).concat(imported)
  return sourceStations.filter((station) => isVisible(station.opened, year, 'operational') && (system === 'all' || station.system === system))
}

async function loadLocalTransitData() {
  if (!localTransitDataPromise) localTransitDataPromise = fetch('/data/routes.json', { cache: 'no-store' }).then(async (response) => {
    if (!response.ok) return null
    const payload = await response.json() as LocalTransitData
    for (const system of systems.map((item) => item.id)) {
      const features = payload.features?.filter((feature) => feature.properties.system === system) ?? []
      if (features.length) localRouteCache.set(system, { type: 'FeatureCollection', features })
      const importedStations = (payload.stations ?? []).filter((station) => station.properties.system === system).map((station) => ({
        id: station.properties.id,
        name: station.properties.name,
        city: station.properties.city ?? systems.find((item) => item.id === system)?.city ?? '',
        kind: 'metro' as const,
        opened: Number(station.properties.opened),
        coordinates: station.geometry.coordinates,
        lines: (() => { try { return JSON.parse(station.properties.lines ?? '[]') as string[] } catch { return [] } })(),
        system,
        source: station.properties.source,
        coordinateSource: station.properties.coordinateSource,
      }))
      if (importedStations.length) localStationCache.set(system, importedStations)
    }
    return payload
  }).catch(() => null)
  return localTransitDataPromise
}

async function loadBundledRoutes(system: MetroSystemId): Promise<OSMFeatureCollection | null> {
  await loadLocalTransitData()
  const local = localRouteCache.get(system)
  if (local) return local
  return null
}

async function hydrateMapWithBundledRoutes(map: Map, system: MetroSystemId | 'all', year: number, isCurrent: () => boolean = () => true) {
  const systemsToLoad = system === 'all' ? systems : systems.filter((item) => item.id === system)
  const datasets = await Promise.all(systemsToLoad.map((item) => loadBundledRoutes(item.id)))
  if (!isCurrent()) return 0
  const features = datasets.flatMap((dataset, index) => systemsToLoad[index].opened <= year ? dataset?.features ?? [] : [])
  const source = map.getSource('routes') as GeoJSONSource | undefined
  if (source) source.setData({ type: 'FeatureCollection', features })
  const stationSource = map.getSource('stations') as GeoJSONSource | undefined
  if (stationSource) stationSource.setData(geoJson(visibleStationsFor(system, year)))
  return features.length
}

function addLayers(map: Map, maplibre: typeof import('maplibre-gl'), year: number, system: MetroSystemId | 'all', onSelectStation: (station: Station) => void) {
  const visibleStations = visibleStationsFor(system, year)
  map.addSource('routes', { type: 'geojson', data: emptyRouteCollection() })
  map.addSource('stations', { type: 'geojson', data: geoJson(visibleStations) })
  map.addLayer({ id: 'routes', type: 'line', source: 'routes', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['get', 'color'], 'line-width': 5, 'line-opacity': 0.88 } })
  map.addLayer({ id: 'stations', type: 'circle', source: 'stations', paint: { 'circle-radius': 6, 'circle-color': '#f7f3ea', 'circle-stroke-color': '#10283b', 'circle-stroke-width': 2 } })
  map.on('mouseenter', 'routes', () => { map.getCanvas().style.cursor = 'pointer' })
  map.on('mouseleave', 'routes', () => { map.getCanvas().style.cursor = '' })
  map.on('click', 'routes', (event) => {
    const feature = event.features?.[0]
    if (!feature) return
    new maplibre.Popup({ closeButton: true, offset: 8 }).setLngLat(event.lngLat).setHTML(`<strong>${feature.properties?.name}</strong><br/><span>Route history available in the source record.</span>`).addTo(map)
  })
  map.on('click', 'stations', (event) => {
    const id = event.features?.[0]?.properties?.id
    const station = [...stations, ...[...localStationCache.values()].flat()].find((item) => item.id === id)
    if (station) onSelectStation(station)
  })
}

function MapView({ year, system, mapRef, onSelectStation, onReady, onRouteStatus }: { year: number; system: MetroSystemId | 'all'; mapRef: React.MutableRefObject<Map | null>; onSelectStation: (station: Station) => void; onReady: () => void; onRouteStatus: (status: 'loading' | 'real' | 'unavailable') => void }) {
  const container = useRef<HTMLDivElement>(null)
  const hydrateVersion = useRef(0)
  useEffect(() => {
    if (!container.current) return
    let disposed = false
    let map: Map | null = null
    void loadMapLibre().then((maplibre) => {
      if (!container.current || disposed) return
      const createdMap = new maplibre.Map({ container: container.current, style: mapStyle, center: [78.96, 20.59], zoom: 4.5, minZoom: 3.5, maxZoom: 14 })
      map = createdMap
      mapRef.current = createdMap
      createdMap.addControl(new maplibre.NavigationControl({ showCompass: false }), 'bottom-right')
      createdMap.on('load', async () => { addLayers(createdMap, maplibre, year, system, onSelectStation); onReady(); onRouteStatus('loading'); const version = ++hydrateVersion.current; const loaded = await hydrateMapWithBundledRoutes(createdMap, system, year, () => hydrateVersion.current === version); if (hydrateVersion.current === version) onRouteStatus(loaded ? 'real' : 'unavailable') })
    })
    return () => { disposed = true; map?.remove(); mapRef.current = null }
    // The map instance owns this lifecycle; parent renders must not recreate it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const routeSource = map.getSource('routes') as GeoJSONSource | undefined
    const stationSource = map.getSource('stations') as GeoJSONSource | undefined
    const realFeatures = system === 'all' ? systems.flatMap((item) => cachedRouteFeatures(item.id, year)) : cachedRouteFeatures(system, year)
    if (routeSource) routeSource.setData(realFeatures.length ? { type: 'FeatureCollection', features: realFeatures } : emptyRouteCollection())
    if (stationSource) stationSource.setData(geoJson(visibleStationsFor(system, year)))
  }, [year, system, mapRef])
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return
    onRouteStatus('loading')
    const version = ++hydrateVersion.current
    hydrateMapWithBundledRoutes(mapRef.current, system, year, () => hydrateVersion.current === version).then((loaded) => { if (hydrateVersion.current === version) onRouteStatus(loaded ? 'real' : 'unavailable') })
  }, [year, system, mapRef, onRouteStatus])
  return <div ref={container} className="map-canvas" aria-label={`Historical map for ${year}`} />
}

function Stat({ value, label }: { value: string | number; label: string }) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div> }

export default function App() {
  const [page, setPage] = useState<'landing' | 'atlas'>('landing')
  const [year, setYear] = useState(2022)
  const [system, setSystem] = useState<MetroSystemId | 'all'>('all')
  const [playing, setPlaying] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const mapRef = useRef<Map | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [routeStatus, setRouteStatus] = useState<'loading' | 'real' | 'unavailable'>('loading')
  const handleRouteStatus = useCallback((status: 'loading' | 'real' | 'unavailable') => setRouteStatus(status), [])
  const visibleStations = useMemo(() => visibleStationsFor(system, year), [year, system, routeStatus])
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

  if (page === 'landing') return <main className="landing-shell">
    <header className="landing-header"><button className="landing-mark" onClick={() => setPage('landing')}><span>↔</span><strong>Transit Time Machine</strong></button><p>India’s railway atlas · built from verifiable public records</p></header>
    <section className="landing-hero"><p className="landing-kicker">A living cartography of movement</p><h1>Travel through India’s <em>railway history.</em></h1><p className="landing-intro">Explore metro growth today, then follow the expanding story of conventional rail and high-speed corridors as their source archives are verified and added.</p><div className="landing-actions"><button className="landing-primary" onClick={() => setPage('atlas')}>Enter metro atlas <span>→</span></button><a href="#data-ledger">View data ledger ↓</a></div></section>
    <section className="landing-modes" aria-label="Atlas modes"><article><span className="mode-number">01</span><h2>City metros</h2><p>Interactive network geometry and station records for verified systems.</p><button onClick={() => setPage('atlas')}>Open atlas →</button></article><article><span className="mode-number">02</span><h2>Indian Railways</h2><p>National routes, services, junctions, and historic layers.</p><small>Source audit in progress</small></article><article><span className="mode-number">03</span><h2>High-speed rail</h2><p>Project corridors, milestones, and opening timelines.</p><small>Project records in review</small></article></section>
    <section className="landing-ledger" id="data-ledger"><div><p className="landing-kicker">Data ledger</p><h2>Nothing on the map is a guess.</h2></div><div className="ledger-grid"><p><strong>3</strong><span>verified metro source snapshots</span></p><p><strong>14</strong><span>GTFS route shapes available offline</span></p><p><strong>181</strong><span>station records with source links</span></p></div></section>
    <section className="landing-map-shelf" aria-labelledby="source-maps-title"><div><p className="landing-kicker">Source map shelf</p><h2 id="source-maps-title">Rail references, kept separate from live layers.</h2><p>These source maps are available while their geometry is reviewed for the interactive atlas.</p></div><nav><a href="https://surveyofindia.gov.in/pages/railway-map-of-india" target="_blank" rel="noreferrer"><span>01</span><strong>Indian Railways</strong><small>Survey of India national map ↗</small></a><a href="https://irfca.org/faq/faq-map-suburban.html" target="_blank" rel="noreferrer"><span>02</span><strong>Suburban rail</strong><small>Mumbai, Chennai, Kolkata and more ↗</small></a><a href="https://nhsrcl.in/en/project/feasibility-study-report" target="_blank" rel="noreferrer"><span>03</span><strong>NHSRCL</strong><small>Mumbai–Ahmedabad project material ↗</small></a></nav></section>
    <footer className="landing-footer"><span>Transit Time Machine · India rail research project</span><button onClick={() => setPage('atlas')}>Metro atlas</button></footer>
  </main>

  return <main className="atlas-shell">
    <header className="atlas-topbar"><button className="atlas-logo" onClick={() => setPage('landing')}><span>↔</span><strong>Metro<span>Atlas</span></strong></button><div className="atlas-status"><i /> India · Metro network <small>{routeStatus === 'real' ? 'verified route geometry loaded' : routeStatus === 'loading' ? 'loading route geometry…' : 'route geometry unavailable'}</small></div><div className="atlas-top-actions"><button>⌕</button><button>⚙</button></div></header>
    <section className="atlas-map"><MapView year={year} system={system} mapRef={mapRef} onSelectStation={setSelectedStation} onReady={() => setMapReady(true)} onRouteStatus={handleRouteStatus} /><div className="atlas-title"><h1>India Metro Map</h1><p>{selectedSystem?.name ?? 'All metro systems'} <em>· {year}</em></p></div><div className="map-time-control atlas-time"><div className="time-control-heading"><span>Network growth</span><strong>{year}</strong></div><input aria-label="Historical year" type="range" min="2002" max="2024" step="1" value={year} onChange={(event) => setYear(Number(event.target.value))} /><div className="time-ticks"><span>2002</span><span>2010</span><span>2017</span><span>2024</span></div></div><div className="atlas-legend"><strong>LEGEND</strong><span><i className="legend-line metro" /> Metro lines</span><span><i className="legend-dot" /> Imported station</span><small>© OpenStreetMap contributors · GTFS/OSM route geometry</small></div></section>
    <aside className="atlas-panel"><div className="panel-close">METRO SYSTEMS <span>⌃</span></div><div className="system-filter atlas-systems" role="tablist" aria-label="Filter metro system"><button className={system === 'all' ? 'active' : ''} onClick={() => setSystem('all')}><i style={{ background: '#8e4b38' }} />All India</button>{systems.map((item) => <button key={item.id} className={system === item.id ? 'active' : ''} onClick={() => { setSystem(item.id); mapRef.current?.flyTo({ center: item.center, zoom: 10 }) }}><i style={{ background: item.color }} />{item.name}<small>{item.lines.length} lines</small></button>)}</div><div className="settings-divider" /><div className="panel-close">MAP DETAILS <span>⌃</span></div><label className="toggle-row"><span>Show line labels</span><input type="checkbox" defaultChecked /></label><label className="toggle-row"><span>Show station samples</span><input type="checkbox" defaultChecked /></label><div className="atlas-stats"><div><strong>{routeStatus === 'real' ? 'GTFS/OSM' : routeStatus === 'loading' ? '…' : '—'}</strong><span>route source</span></div><div><strong>{visibleStations.length}</strong><span>stations in view</span></div><div><strong>{systems.length}</strong><span>systems mapped</span></div></div>{routeStatus === 'unavailable' && <p className="route-warning">No verified route geometry is bundled for this selection yet. Straight connector lines are intentionally hidden.</p>}{selectedStation && <div className="atlas-selection"><small>SELECTED STATION</small><strong>{selectedStation.name}</strong><span>{selectedStation.city} · Opened {selectedStation.opened}{selectedStation.lines.length ? ` · ${selectedStation.lines.length} line${selectedStation.lines.length === 1 ? '' : 's'}` : ''}</span><a href={selectedStation.source} target="_blank" rel="noreferrer">Opening/source record ↗</a><a href={selectedStation.coordinateSource} target="_blank" rel="noreferrer">Coordinate source ↗</a></div>}</aside>
    <div className="atlas-milestones"><div className="milestone-strip-head"><span>HISTORICAL THREAD</span><button onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ Pause' : '▶ Play'}</button></div><div className="milestone-strip">{milestones.map((milestone) => <button key={milestone.year} className={year === milestone.year ? 'active' : ''} onClick={() => { setYear(milestone.year); mapRef.current?.flyTo({ center: milestone.coordinates, zoom: system === 'all' ? 5 : 10 }) }}><b>{milestone.year}</b><span>{milestone.label}</span></button>)}</div></div>
    <footer className="atlas-footer">Transit Time Machine · India metro overview <span>Map tiles © OpenStreetMap contributors · <a href="https://delhimetrorail.com/pages/about-us/present-network" target="_blank" rel="noreferrer">Sources</a></span></footer>
  </main>
}
