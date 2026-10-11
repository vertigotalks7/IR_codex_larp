import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'

const root = process.cwd()
const sourceFeeds = [
  { id: 'hyderabad', name: 'Hyderabad Metro', city: 'Hyderabad', operator: 'Hyderabad Metro Rail', opened: 2017, source: 'https://data.opencity.in/dataset/hyderabad-metro-rail-gtfs', snapshot: '2026-07-03', directory: path.join(root, 'data', 'source', 'hyderabad') },
  { id: 'bengaluru', name: 'Namma Metro', city: 'Bengaluru', operator: 'Bangalore Metro Rail Corporation', opened: 2011, source: 'https://github.com/Vonter/bmrcl-gtfs', directory: path.join(root, 'data', 'source', 'bengaluru') },
  { id: 'chennai', name: 'Chennai Metro', city: 'Chennai', operator: 'Chennai Metro Rail', opened: 2015, source: 'https://github.com/ungalsoththu/ChennaiGTFS', directory: path.join(root, 'data', 'source', 'chennai'), includeShapes: false },
]

const osmMetroSourcePath = path.join(root, 'data', 'source', 'openstreetmap', 'metro-ways-2026-10-11.json')
const osmMetroSystems = [
  { id: 'delhi', name: 'Delhi Metro', city: 'Delhi NCR', operator: 'Delhi Metro Rail Corporation', opened: 2002, source: 'https://delhimetrorail.com/pages/about-us/present-network', bounds: [76.75, 28.3, 77.55, 29.1] },
  { id: 'chennai', name: 'Chennai Metro', city: 'Chennai', operator: 'Chennai Metro Rail Limited', opened: 2015, source: 'https://chennaimetrorail.org/metro-line-map/', bounds: [79.9, 12.75, 80.4, 13.25] },
  { id: 'kochi', name: 'Kochi Metro', city: 'Kochi', operator: 'Kochi Metro Rail Limited', opened: 2017, source: 'https://kochimetro.org/phase-1-status/', bounds: [76.1, 9.8, 76.55, 10.25] },
  { id: 'mumbai', name: 'Mumbai Metro', city: 'Mumbai', operator: 'MMRDA / MMMOCL', opened: 2014, source: 'https://mmrda.maharashtra.gov.in/en/node/1229', bounds: [72.65, 18.7, 73.3, 19.4] },
  { id: 'pune', name: 'Pune Metro', city: 'Pune', operator: 'Maha Metro', opened: 2022, source: 'https://www.mahametro.org/route_maps.html', bounds: [73.6, 18.3, 74.1, 18.85] },
]

const metroColors = {
  'Red Line': '#df3d38',
  'Yellow Line': '#e1b43c',
  'Blue Line': '#2d79bd',
  'Green Line': '#25824b',
  'Violet Line': '#8041a1',
  'Pink Line': '#d95b9e',
  'Magenta Line': '#c63891',
  'Grey Line': '#68717d',
  'Airport Express Line': '#e98430',
  'Aqua Line': '#17889a',
  'Rapid Metro': '#526a7d',
  'Line 1': '#2478ad',
  'Line 2': '#e4bb3f',
  'Line 3': '#168b91',
  'Line 7': '#df4038',
  'Line 9': '#ba493c',
  'Purple Line': '#75469a',
  // Do not imply an unnamed OSM way belongs to Chennai's Blue or Green Line.
  'Chennai Metro track (line untagged)': '#8b7659',
}

function parseCsv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '')
  const rows = []; let row = []; let value = ''; let quoted = false
  for (const character of text) {
    if (character === '"') quoted = !quoted
    else if (character === ',' && !quoted) { row.push(value); value = '' }
    else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\n' && (value || row.length)) { row.push(value); rows.push(row); row = []; value = '' }
    } else value += character
  }
  if (value || row.length) { row.push(value); rows.push(row) }
  const headers = rows.shift().map((header) => header.trim())
  return rows.filter((item) => item.some(Boolean)).map((item) => Object.fromEntries(headers.map((header, index) => [header, (item[index] ?? '').trim()])))
}

function hashGtfsFiles(directory) {
  const hash = createHash('sha256')
  const files = fs.readdirSync(directory).filter((name) => name.endsWith('.txt')).sort()
  for (const name of files) {
    hash.update(name).update('\0').update(fs.readFileSync(path.join(directory, name)))
  }
  return hash.digest('hex')
}

function readFeed(feed) {
  const feedInfoPath = path.join(feed.directory, 'feed_info.txt')
  if (fs.existsSync(feedInfoPath)) {
    const info = parseCsv(feedInfoPath)[0]
    const rawDate = info?.feed_start_date ?? ''
    const feedDate = /^\d{8}$/.test(rawDate) ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}` : ''
    if (feed.snapshot && feedDate && feed.snapshot !== feedDate) {
      throw new Error(`${feed.id} snapshot metadata disagrees with feed_info.txt: ${feed.snapshot} vs ${feedDate}`)
    }
    feed.snapshot = feed.snapshot || feedDate
  }
  const routes = parseCsv(path.join(feed.directory, 'routes.txt'))
  const trips = parseCsv(path.join(feed.directory, 'trips.txt'))
  const shapes = parseCsv(path.join(feed.directory, 'shapes.txt'))
  const stops = parseCsv(path.join(feed.directory, 'stops.txt'))
  const stopTimes = parseCsv(path.join(feed.directory, 'stop_times.txt'))
  const routeById = new Map(routes.map((route) => [route.route_id, route]))
  const tripToRoute = new Map(trips.map((trip) => [trip.trip_id, trip.route_id]))
  const stopById = new Map(stops.map((stop) => [stop.stop_id, stop]))
  const stationLines = new Map()
  for (const stopTime of stopTimes) {
    const stop = stopById.get(stopTime.stop_id)
    const routeId = tripToRoute.get(stopTime.trip_id)
    if (!stop || !routeId) continue
    const stationId = stop.parent_station || stop.stop_id
    const lines = stationLines.get(stationId) ?? []
    if (!lines.includes(routeId)) lines.push(routeId)
    stationLines.set(stationId, lines)
  }
  const shapeToRoute = new Map(trips.map((trip) => [trip.shape_id, trip.route_id]))
  const grouped = new Map()
  for (const point of shapes) {
    const routeId = shapeToRoute.get(point.shape_id)
    if (!routeId || !routeById.has(routeId)) continue
    const key = `${routeId}:${point.shape_id}`
    const points = grouped.get(key) ?? []
    points.push({ sequence: Number(point.shape_pt_sequence), coordinate: [Number(point.shape_pt_lon), Number(point.shape_pt_lat)] })
    grouped.set(key, points)
  }
  const longestByRoute = new Map()
  for (const [key, points] of grouped) {
    const [routeId] = key.split(':')
    points.sort((a, b) => a.sequence - b.sequence)
    if (!longestByRoute.has(routeId) || points.length > longestByRoute.get(routeId).length) longestByRoute.set(routeId, points)
  }
  const routeFeatures = feed.includeShapes === false ? [] : [...longestByRoute].map(([routeId, points]) => {
    const route = routeById.get(routeId)
    const color = route.route_color && /^[0-9A-Fa-f]{6}$/.test(route.route_color) ? `#${route.route_color}` : '#9b6cff'
    return { type: 'Feature', properties: { id: `${feed.id}-${routeId}`, lineId: `${feed.id}-${routeId}`, name: route.route_long_name || route.route_short_name || routeId, color, system: feed.id, opened: String(feed.opened), sourceType: 'gtfs', source: feed.source, snapshot: feed.snapshot ?? '' }, geometry: { type: 'LineString', coordinates: points.map((point) => point.coordinate) } }
  })
  const stationRows = new Map()
  for (const stop of stops) {
    const isStation = stop.location_type === '1' || (!stop.parent_station && stop.location_type !== '2')
    if (!isStation || !stop.stop_lat || !stop.stop_lon) continue
    const stationId = stop.parent_station || stop.stop_id
    if (!stationRows.has(stationId)) stationRows.set(stationId, stop)
  }
  const stationFeatures = [...stationRows.values()].map((stop) => ({ type: 'Feature', properties: { id: `${feed.id}-${stop.stop_id}`, name: stop.stop_name, system: feed.id, opened: String(feed.opened), city: feed.city, source: feed.source, coordinateSource: feed.source, lines: JSON.stringify(stationLines.get(stop.stop_id) ?? []) }, geometry: { type: 'Point', coordinates: [Number(stop.stop_lon), Number(stop.stop_lat)] } }))
  return { feed, routes: routeFeatures, stations: stationFeatures }
}

function osmMetroLine(system, tags) {
  const name = tags.name ?? ''
  if (system.id === 'delhi') {
    if (/rapid metro/i.test(name) || /rapid metro/i.test(tags.network ?? '')) return 'Rapid Metro'
    if (/airport express/i.test(name)) return 'Airport Express Line'
    const colors = [
      ['red', 'Red Line'], ['yellow', 'Yellow Line'], ['blue', 'Blue Line'], ['green', 'Green Line'],
      ['violet', 'Violet Line'], ['pink', 'Pink Line'], ['magenta', 'Magenta Line'], ['grey|gray', 'Grey Line'],
      ['aqua', 'Aqua Line'],
    ]
    for (const [pattern, line] of colors) if (new RegExp(pattern, 'i').test(name)) return line
    const normalizedColor = (tags.colour ?? '').toLowerCase()
    const byColor = { '#ff0000': 'Red Line', '#ffc0e5': 'Pink Line', '#ffc0cb': 'Pink Line', '#1e90ff': 'Blue Line', '#ffff00': 'Yellow Line', '#008000': 'Green Line', '#7534c9': 'Violet Line', aqua: 'Aqua Line' }
    return byColor[normalizedColor] ?? ''
  }
  if (system.id === 'chennai') {
    if (!name && tags.network !== 'Chennai Metro') return ''
    if (/line\s*1\b/i.test(name)) return 'Blue Line'
    if (/line\s*2\b/i.test(name)) return 'Green Line'
    return name ? '' : 'Chennai Metro track (line untagged)'
  }
  if (system.id === 'kochi') {
    if (/phase\s*(ii|2)|proposed|test/i.test(name)) return ''
    return 'Blue Line'
  }
  if (system.id === 'mumbai') {
    if (/navi mumbai/i.test(name)) return ''
    const match = `${name} ${tags.alt_name ?? ''}`.match(/line[- ]?(1|2|2a|2b|3|7|7a|9)\b/i)
    if (!match) return ''
    const key = match[1].toLowerCase()
    if (key === '1') return 'Line 1'
    if (key === '2' || key === '2a' || key === '2b') return 'Line 2'
    if (key === '3') return 'Line 3'
    if (key === '7' || key === '7a') return 'Line 7'
    return 'Line 9'
  }
  if (system.id === 'pune') {
    if (/purple/i.test(name)) return 'Purple Line'
    if (/aqua/i.test(name)) return 'Aqua Line'
  }
  return ''
}

function buildOsmMetroRoutes() {
  if (!fs.existsSync(osmMetroSourcePath)) {
    throw new Error(`Missing current metro geometry snapshot: ${osmMetroSourcePath}`)
  }
  const sourceText = fs.readFileSync(osmMetroSourcePath, 'utf8')
  const source = JSON.parse(sourceText)
  const retrievedSnapshot = source.osm3s?.timestamp_osm_base?.slice(0, 10)
  if (!retrievedSnapshot) throw new Error('OSM metro snapshot has no timestamp_osm_base')
  const features = []

  for (const system of osmMetroSystems) {
    const [minLon, minLat, maxLon, maxLat] = system.bounds
    for (const element of source.elements ?? []) {
      const tags = element.tags ?? {}
      if (element.type !== 'way' || tags.railway !== 'subway' || !Array.isArray(element.geometry) || element.geometry.length < 2) continue
      if (!element.geometry.some((point) => point.lon >= minLon && point.lon <= maxLon && point.lat >= minLat && point.lat <= maxLat)) continue
      if (tags.service && tags.service !== 'main') continue
      if (tags.construction || tags.proposed || tags.disused || tags.abandoned) continue
      if (/test track|brake test|depot|workshop/i.test(tags.name ?? '')) continue
      const lineName = osmMetroLine(system, tags)
      if (!lineName) continue
      const color = metroColors[lineName] ?? '#6d2f2b'
      const geometryCoordinates = element.geometry.map(({ lon, lat }) => [lon, lat])
      const wayUrl = `https://www.openstreetmap.org/way/${element.id}`
      const lineId = `${system.id}-${lineName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      features.push({
        type: 'Feature',
        properties: {
          id: `osm-${system.id}-${element.id}`,
          lineId,
          name: tags.name || lineName,
          lineName,
          color,
          system: system.id,
          opened: String(system.opened),
          sourceType: 'osm-track',
          source: wayUrl,
          osmId: element.id,
          snapshot: retrievedSnapshot,
        },
        geometry: { type: 'LineString', coordinates: geometryCoordinates },
      })
    }
  }

  return { features, systems: osmMetroSystems, snapshot: retrievedSnapshot, hash: createHash('sha256').update(sourceText).digest('hex') }
}

const loadedFeeds = sourceFeeds.filter((feed) => fs.existsSync(path.join(feed.directory, 'routes.txt')))
if (!loadedFeeds.length) throw new Error('No GTFS feed directories found under data/source')
const snapshots = loadedFeeds.map(readFeed)
const osmMetro = buildOsmMetroRoutes()
const databasePath = path.join(root, 'data', 'routes.sqlite')
const exportPath = path.join(root, 'public', 'data', 'routes.json')
fs.mkdirSync(path.dirname(databasePath), { recursive: true }); fs.mkdirSync(path.dirname(exportPath), { recursive: true })
const database = new DatabaseSync(databasePath)
database.exec(`
  PRAGMA foreign_keys = ON;
  DROP TABLE IF EXISTS services; DROP TABLE IF EXISTS projects; DROP TABLE IF EXISTS historical_events; DROP TABLE IF EXISTS infrastructure_segments; DROP TABLE IF EXISTS sources; DROP TABLE IF EXISTS stations; DROP TABLE IF EXISTS route_shapes; DROP TABLE IF EXISTS lines; DROP TABLE IF EXISTS systems;
  CREATE TABLE sources (id TEXT PRIMARY KEY, name TEXT NOT NULL, source_url TEXT NOT NULL, source_type TEXT NOT NULL, licence_note TEXT NOT NULL, snapshot_hash TEXT NOT NULL, coverage_note TEXT NOT NULL, retrieved_at TEXT NOT NULL, snapshot_date TEXT NOT NULL);
  CREATE TABLE systems (id TEXT PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL, operator TEXT NOT NULL, source_url TEXT NOT NULL, retrieved_at TEXT NOT NULL);
  CREATE TABLE lines (id TEXT PRIMARY KEY, system_id TEXT NOT NULL REFERENCES systems(id), name TEXT NOT NULL, color TEXT NOT NULL, opened_year INTEGER NOT NULL, source_url TEXT NOT NULL);
  CREATE TABLE route_shapes (id TEXT PRIMARY KEY, line_id TEXT NOT NULL REFERENCES lines(id), geometry_geojson TEXT NOT NULL, point_count INTEGER NOT NULL, source_type TEXT NOT NULL, source_url TEXT NOT NULL, retrieved_at TEXT NOT NULL, snapshot_date TEXT NOT NULL);
  CREATE TABLE stations (id TEXT PRIMARY KEY, system_id TEXT NOT NULL REFERENCES systems(id), name TEXT NOT NULL, latitude REAL NOT NULL, longitude REAL NOT NULL, opened_year INTEGER NOT NULL, line_ids TEXT NOT NULL, source_url TEXT NOT NULL, coordinate_source TEXT NOT NULL);
  CREATE TABLE infrastructure_segments (id TEXT PRIMARY KEY, system_id TEXT, line_id TEXT, geometry_geojson TEXT NOT NULL, status TEXT NOT NULL, geometry_snapshot_date TEXT NOT NULL, source_id TEXT NOT NULL REFERENCES sources(id));
  CREATE TABLE historical_events (id TEXT PRIMARY KEY, system_id TEXT, line_id TEXT, segment_id TEXT, station_id TEXT, event_type TEXT NOT NULL, effective_date TEXT, confidence TEXT NOT NULL, source_id TEXT NOT NULL REFERENCES sources(id), note TEXT);
  CREATE TABLE projects (id TEXT PRIMARY KEY, name TEXT NOT NULL, mode TEXT NOT NULL, status TEXT NOT NULL, geometry_geojson TEXT, source_id TEXT NOT NULL REFERENCES sources(id), last_verified_at TEXT NOT NULL);
  CREATE TABLE services (id TEXT PRIMARY KEY, system_id TEXT, line_id TEXT, service_number TEXT, name TEXT, validity_start TEXT, validity_end TEXT, source_id TEXT NOT NULL REFERENCES sources(id));
`)
const retrievedAt = new Date().toISOString()
const insertSource = database.prepare('INSERT INTO sources VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
const insertSystem = database.prepare('INSERT INTO systems VALUES (?, ?, ?, ?, ?, ?)')
const insertLine = database.prepare('INSERT INTO lines VALUES (?, ?, ?, ?, ?, ?)')
const insertShape = database.prepare('INSERT INTO route_shapes VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
const insertStation = database.prepare('INSERT INTO stations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
for (const snapshot of snapshots) {
  const { feed } = snapshot
  const snapshotHash = hashGtfsFiles(feed.directory)
  insertSource.run(`${feed.id}-gtfs`, `${feed.name} GTFS snapshot`, feed.source, 'gtfs', 'See DATA_SOURCES.md for source-specific attribution and terms.', snapshotHash, `GTFS records for ${feed.city}. Route geometry is imported only when the source shape is usable.`, retrievedAt, feed.snapshot ?? '')
  insertSystem.run(feed.id, feed.name, feed.city, feed.operator, feed.source, retrievedAt)
  for (const feature of snapshot.routes) {
    insertLine.run(feature.properties.lineId, feed.id, feature.properties.lineName ?? feature.properties.name, feature.properties.color, feed.opened, feed.source)
    insertShape.run(feature.properties.id, feature.properties.lineId, JSON.stringify(feature.geometry), feature.geometry.coordinates.length, 'gtfs', feed.source, retrievedAt, feed.snapshot ?? '')
  }
  for (const feature of snapshot.stations) insertStation.run(feature.properties.id, feed.id, feature.properties.name, feature.geometry.coordinates[1], feature.geometry.coordinates[0], feed.opened, feature.properties.lines, feature.properties.source, feature.properties.coordinateSource)
}

const insertedSystems = new Set(snapshots.map(({ feed }) => feed.id))
const insertedOsmLines = new Set()
insertSource.run('osm-metro-2026-10-11', 'OpenStreetMap metro track snapshot', 'https://www.openstreetmap.org/', 'osm-track', 'OpenStreetMap data is available under ODbL; attribute OpenStreetMap contributors.', osmMetro.hash, 'Mapped physical subway-track ways filtered to current metro-system focus boxes. Does not create connectors between station coordinates.', retrievedAt, osmMetro.snapshot)
for (const system of osmMetro.systems) {
  if (!insertedSystems.has(system.id)) {
    insertSystem.run(system.id, system.name, system.city, system.operator, system.source, retrievedAt)
    insertedSystems.add(system.id)
  }
}
for (const feature of osmMetro.features) {
  const p = feature.properties
  if (!insertedOsmLines.has(p.lineId)) {
    const system = osmMetro.systems.find((item) => item.id === p.system)
    insertLine.run(p.lineId, p.system, p.lineName, p.color, Number(p.opened), system.source)
    insertedOsmLines.add(p.lineId)
  }
  insertShape.run(p.id, p.lineId, JSON.stringify(feature.geometry), feature.geometry.coordinates.length, 'osm-track', p.source, retrievedAt, p.snapshot)
}
const routeRows = database.prepare('SELECT route_shapes.id, lines.system_id, lines.name, lines.color, lines.opened_year, route_shapes.geometry_geojson, route_shapes.source_type, route_shapes.source_url, route_shapes.retrieved_at, route_shapes.snapshot_date FROM route_shapes JOIN lines ON lines.id = route_shapes.line_id ORDER BY lines.system_id, lines.id, route_shapes.id').all()
const stationRows = database.prepare('SELECT id, system_id, name, longitude, latitude, opened_year, line_ids, source_url, coordinate_source FROM stations ORDER BY system_id, name').all()
const exportData = {
  schemaVersion: 2,
  generatedAt: retrievedAt,
  systems: [...new Map([...snapshots.map(({ feed }) => [feed.id, { id: feed.id, name: feed.name, source: feed.source }]), ...osmMetro.systems.map((system) => [system.id, { id: system.id, name: system.name, source: system.source }])]).values()],
  sources: [
    ...snapshots.map(({ feed }) => ({ id: `${feed.id}-gtfs`, name: `${feed.name} GTFS`, source: feed.source, type: 'gtfs', snapshot: feed.snapshot ?? null })),
    { id: 'osm-metro-2026-10-11', name: 'OpenStreetMap metro track ways', source: 'https://www.openstreetmap.org/', type: 'osm-track', snapshot: osmMetro.snapshot, license: 'ODbL' },
  ],
  features: routeRows.map((row) => ({ type: 'Feature', properties: { id: row.id, system: row.system_id, name: row.name, color: row.color, opened: row.opened_year, sourceType: row.source_type, source: row.source_url, snapshot: row.snapshot_date || null, retrievedAt: row.retrieved_at }, geometry: JSON.parse(row.geometry_geojson) })),
  stations: stationRows.map((row) => ({ type: 'Feature', properties: { id: row.id, system: row.system_id, name: row.name, opened: row.opened_year, lines: row.line_ids, source: row.source_url, coordinateSource: row.coordinate_source }, geometry: { type: 'Point', coordinates: [row.longitude, row.latitude] } })),
}
fs.writeFileSync(exportPath, `${JSON.stringify(exportData)}\n`)
database.close()
console.log(`Built ${databasePath} and ${exportPath}: ${exportData.features.length} verified route geometries, ${exportData.stations.length} GTFS stations, ${osmMetro.features.length} OSM track ways`)
