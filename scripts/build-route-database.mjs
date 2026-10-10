import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'

const root = process.cwd()
const sourceFeeds = [
  { id: 'hyderabad', name: 'Hyderabad Metro', city: 'Hyderabad', operator: 'Hyderabad Metro Rail', opened: 2017, source: 'https://hmrl.co.in/open-data/', directory: path.join(root, 'data', 'source', 'hyderabad') },
  { id: 'bengaluru', name: 'Namma Metro', city: 'Bengaluru', operator: 'Bangalore Metro Rail Corporation', opened: 2011, source: 'https://github.com/Vonter/bmrcl-gtfs', directory: path.join(root, 'data', 'source', 'bengaluru') },
  { id: 'chennai', name: 'Chennai Metro', city: 'Chennai', operator: 'Chennai Metro Rail', opened: 2015, source: 'https://github.com/ungalsoththu/ChennaiGTFS', directory: path.join(root, 'data', 'source', 'chennai') },
]

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

function readFeed(feed) {
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
  const routeFeatures = [...longestByRoute].map(([routeId, points]) => {
    const route = routeById.get(routeId)
    const color = route.route_color && /^[0-9A-Fa-f]{6}$/.test(route.route_color) ? `#${route.route_color}` : '#9b6cff'
    return { type: 'Feature', properties: { id: `${feed.id}-${routeId}`, name: route.route_long_name || route.route_short_name || routeId, color, system: feed.id, opened: String(feed.opened), source: feed.source }, geometry: { type: 'LineString', coordinates: points.map((point) => point.coordinate) } }
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

const loadedFeeds = sourceFeeds.filter((feed) => fs.existsSync(path.join(feed.directory, 'routes.txt')))
if (!loadedFeeds.length) throw new Error('No GTFS feed directories found under data/source')
const snapshots = loadedFeeds.map(readFeed)
const databasePath = path.join(root, 'data', 'routes.sqlite')
const exportPath = path.join(root, 'public', 'data', 'routes.json')
fs.mkdirSync(path.dirname(databasePath), { recursive: true }); fs.mkdirSync(path.dirname(exportPath), { recursive: true })
const database = new DatabaseSync(databasePath)
database.exec(`
  PRAGMA foreign_keys = ON;
  DROP TABLE IF EXISTS services; DROP TABLE IF EXISTS projects; DROP TABLE IF EXISTS historical_events; DROP TABLE IF EXISTS infrastructure_segments; DROP TABLE IF EXISTS sources; DROP TABLE IF EXISTS stations; DROP TABLE IF EXISTS route_shapes; DROP TABLE IF EXISTS lines; DROP TABLE IF EXISTS systems;
  CREATE TABLE sources (id TEXT PRIMARY KEY, name TEXT NOT NULL, source_url TEXT NOT NULL, source_type TEXT NOT NULL, licence_note TEXT NOT NULL, snapshot_hash TEXT NOT NULL, coverage_note TEXT NOT NULL, retrieved_at TEXT NOT NULL);
  CREATE TABLE systems (id TEXT PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL, operator TEXT NOT NULL, source_url TEXT NOT NULL, retrieved_at TEXT NOT NULL);
  CREATE TABLE lines (id TEXT PRIMARY KEY, system_id TEXT NOT NULL REFERENCES systems(id), name TEXT NOT NULL, color TEXT NOT NULL, opened_year INTEGER NOT NULL, source_url TEXT NOT NULL);
  CREATE TABLE route_shapes (id TEXT PRIMARY KEY, line_id TEXT NOT NULL REFERENCES lines(id), geometry_geojson TEXT NOT NULL, point_count INTEGER NOT NULL, source_type TEXT NOT NULL, source_url TEXT NOT NULL, retrieved_at TEXT NOT NULL);
  CREATE TABLE stations (id TEXT PRIMARY KEY, system_id TEXT NOT NULL REFERENCES systems(id), name TEXT NOT NULL, latitude REAL NOT NULL, longitude REAL NOT NULL, opened_year INTEGER NOT NULL, line_ids TEXT NOT NULL, source_url TEXT NOT NULL, coordinate_source TEXT NOT NULL);
  CREATE TABLE infrastructure_segments (id TEXT PRIMARY KEY, system_id TEXT, line_id TEXT, geometry_geojson TEXT NOT NULL, status TEXT NOT NULL, geometry_snapshot_date TEXT NOT NULL, source_id TEXT NOT NULL REFERENCES sources(id));
  CREATE TABLE historical_events (id TEXT PRIMARY KEY, system_id TEXT, line_id TEXT, segment_id TEXT, station_id TEXT, event_type TEXT NOT NULL, effective_date TEXT, confidence TEXT NOT NULL, source_id TEXT NOT NULL REFERENCES sources(id), note TEXT);
  CREATE TABLE projects (id TEXT PRIMARY KEY, name TEXT NOT NULL, mode TEXT NOT NULL, status TEXT NOT NULL, geometry_geojson TEXT, source_id TEXT NOT NULL REFERENCES sources(id), last_verified_at TEXT NOT NULL);
  CREATE TABLE services (id TEXT PRIMARY KEY, system_id TEXT, line_id TEXT, service_number TEXT, name TEXT, validity_start TEXT, validity_end TEXT, source_id TEXT NOT NULL REFERENCES sources(id));
`)
const retrievedAt = new Date().toISOString()
const insertSource = database.prepare('INSERT INTO sources VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
const insertSystem = database.prepare('INSERT INTO systems VALUES (?, ?, ?, ?, ?, ?)')
const insertLine = database.prepare('INSERT INTO lines VALUES (?, ?, ?, ?, ?, ?)')
const insertShape = database.prepare('INSERT INTO route_shapes VALUES (?, ?, ?, ?, ?, ?, ?)')
const insertStation = database.prepare('INSERT INTO stations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
for (const snapshot of snapshots) {
  const { feed } = snapshot
  const snapshotHash = createHash('sha256').update(JSON.stringify({ routes: snapshot.routes, stations: snapshot.stations })).digest('hex')
  insertSource.run(`${feed.id}-gtfs`, `${feed.name} GTFS snapshot`, feed.source, 'gtfs', 'See DATA_SOURCES.md for source-specific attribution and terms.', snapshotHash, `Route shapes and station catalog for ${feed.city}.`, retrievedAt)
  insertSystem.run(feed.id, feed.name, feed.city, feed.operator, feed.source, retrievedAt)
  for (const feature of snapshot.routes) {
    insertLine.run(feature.properties.id, feed.id, feature.properties.name, feature.properties.color, feed.opened, feed.source)
    insertShape.run(feature.properties.id, feature.properties.id, JSON.stringify(feature.geometry), feature.geometry.coordinates.length, 'gtfs', feed.source, retrievedAt)
  }
  for (const feature of snapshot.stations) insertStation.run(feature.properties.id, feed.id, feature.properties.name, feature.geometry.coordinates[1], feature.geometry.coordinates[0], feed.opened, feature.properties.lines, feature.properties.source, feature.properties.coordinateSource)
}
const routeRows = database.prepare('SELECT route_shapes.id, lines.system_id, lines.name, lines.color, lines.opened_year, route_shapes.geometry_geojson, route_shapes.source_type, route_shapes.source_url, route_shapes.retrieved_at FROM route_shapes JOIN lines ON lines.id = route_shapes.line_id ORDER BY lines.system_id, lines.id').all()
const stationRows = database.prepare('SELECT id, system_id, name, longitude, latitude, opened_year, line_ids, source_url, coordinate_source FROM stations ORDER BY system_id, name').all()
const exportData = {
  schemaVersion: 2,
  generatedAt: retrievedAt,
  systems: snapshots.map(({ feed }) => ({ id: feed.id, name: feed.name, source: feed.source })),
  features: routeRows.map((row) => ({ type: 'Feature', properties: { id: row.id, system: row.system_id, name: row.name, color: row.color, opened: row.opened_year, sourceType: row.source_type, source: row.source_url, retrievedAt: row.retrieved_at }, geometry: JSON.parse(row.geometry_geojson) })),
  stations: stationRows.map((row) => ({ type: 'Feature', properties: { id: row.id, system: row.system_id, name: row.name, opened: row.opened_year, lines: row.line_ids, source: row.source_url, coordinateSource: row.coordinate_source }, geometry: { type: 'Point', coordinates: [row.longitude, row.latitude] } })),
}
fs.writeFileSync(exportPath, `${JSON.stringify(exportData)}\n`)
database.close()
console.log(`Built ${databasePath} and ${exportPath}: ${exportData.features.length} route shapes, ${exportData.stations.length} stations from ${snapshots.length} feeds`)
