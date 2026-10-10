import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const root = process.cwd()
const sourceFeeds = [
  { id: 'hyderabad', name: 'Hyderabad Metro', city: 'Hyderabad', operator: 'Hyderabad Metro Rail', opened: 2017, source: 'https://hmrl.co.in/open-data/', directory: path.join(root, '.tmp', 'feeds', 'hmrl', 'hmrl-gtfs-main') },
  { id: 'bengaluru', name: 'Namma Metro', city: 'Bengaluru', operator: 'Bangalore Metro Rail Corporation', opened: 2011, source: 'https://github.com/Vonter/bmrcl-gtfs', directory: path.join(root, '.tmp', 'feeds', 'bmrcl') },
  { id: 'chennai', name: 'Chennai Metro', city: 'Chennai', operator: 'Chennai Metro Rail', opened: 2015, source: 'https://github.com/ungalsoththu/ChennaiGTFS', directory: path.join(root, '.tmp', 'feeds', 'cmrl') },
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
  const routeById = new Map(routes.map((route) => [route.route_id, route]))
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
  const stationFeatures = [...stationRows.values()].map((stop) => ({ type: 'Feature', properties: { id: `${feed.id}-${stop.stop_id}`, name: stop.stop_name, system: feed.id, opened: String(feed.opened), city: feed.city, source: feed.source, coordinateSource: feed.source }, geometry: { type: 'Point', coordinates: [Number(stop.stop_lon), Number(stop.stop_lat)] } }))
  return { feed, routes: routeFeatures, stations: stationFeatures }
}

const loadedFeeds = sourceFeeds.filter((feed) => fs.existsSync(path.join(feed.directory, 'routes.txt')))
if (!loadedFeeds.length) throw new Error('No GTFS feed directories found under .tmp/feeds')
const snapshots = loadedFeeds.map(readFeed)
const databasePath = path.join(root, 'data', 'routes.sqlite')
const exportPath = path.join(root, 'public', 'data', 'routes.json')
fs.mkdirSync(path.dirname(databasePath), { recursive: true }); fs.mkdirSync(path.dirname(exportPath), { recursive: true })
const database = new DatabaseSync(databasePath)
database.exec(`
  PRAGMA foreign_keys = ON;
  DROP TABLE IF EXISTS stations; DROP TABLE IF EXISTS route_shapes; DROP TABLE IF EXISTS lines; DROP TABLE IF EXISTS systems;
  CREATE TABLE systems (id TEXT PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL, operator TEXT NOT NULL, source_url TEXT NOT NULL, retrieved_at TEXT NOT NULL);
  CREATE TABLE lines (id TEXT PRIMARY KEY, system_id TEXT NOT NULL REFERENCES systems(id), name TEXT NOT NULL, color TEXT NOT NULL, opened_year INTEGER NOT NULL, source_url TEXT NOT NULL);
  CREATE TABLE route_shapes (id TEXT PRIMARY KEY, line_id TEXT NOT NULL REFERENCES lines(id), geometry_geojson TEXT NOT NULL, point_count INTEGER NOT NULL, source_type TEXT NOT NULL, source_url TEXT NOT NULL, retrieved_at TEXT NOT NULL);
  CREATE TABLE stations (id TEXT PRIMARY KEY, system_id TEXT NOT NULL REFERENCES systems(id), name TEXT NOT NULL, latitude REAL NOT NULL, longitude REAL NOT NULL, opened_year INTEGER NOT NULL, source_url TEXT NOT NULL, coordinate_source TEXT NOT NULL);
`)
const retrievedAt = new Date().toISOString()
const insertSystem = database.prepare('INSERT INTO systems VALUES (?, ?, ?, ?, ?, ?)')
const insertLine = database.prepare('INSERT INTO lines VALUES (?, ?, ?, ?, ?, ?)')
const insertShape = database.prepare('INSERT INTO route_shapes VALUES (?, ?, ?, ?, ?, ?, ?)')
const insertStation = database.prepare('INSERT INTO stations VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
for (const snapshot of snapshots) {
  const { feed } = snapshot
  insertSystem.run(feed.id, feed.name, feed.city, feed.operator, feed.source, retrievedAt)
  for (const feature of snapshot.routes) {
    insertLine.run(feature.properties.id, feed.id, feature.properties.name, feature.properties.color, feed.opened, feed.source)
    insertShape.run(feature.properties.id, feature.properties.id, JSON.stringify(feature.geometry), feature.geometry.coordinates.length, 'gtfs', feed.source, retrievedAt)
  }
  for (const feature of snapshot.stations) insertStation.run(feature.properties.id, feed.id, feature.properties.name, feature.geometry.coordinates[1], feature.geometry.coordinates[0], feed.opened, feature.properties.source, feature.properties.coordinateSource)
}
const routeRows = database.prepare('SELECT route_shapes.id, lines.system_id, lines.name, lines.color, lines.opened_year, route_shapes.geometry_geojson, route_shapes.source_type, route_shapes.source_url, route_shapes.retrieved_at FROM route_shapes JOIN lines ON lines.id = route_shapes.line_id ORDER BY lines.system_id, lines.id').all()
const stationRows = database.prepare('SELECT id, system_id, name, longitude, latitude, opened_year, source_url, coordinate_source FROM stations ORDER BY system_id, name').all()
const exportData = {
  schemaVersion: 2,
  generatedAt: retrievedAt,
  systems: snapshots.map(({ feed }) => ({ id: feed.id, name: feed.name, source: feed.source })),
  features: routeRows.map((row) => ({ type: 'Feature', properties: { id: row.id, system: row.system_id, name: row.name, color: row.color, opened: row.opened_year, sourceType: row.source_type, source: row.source_url, retrievedAt: row.retrieved_at }, geometry: JSON.parse(row.geometry_geojson) })),
  stations: stationRows.map((row) => ({ type: 'Feature', properties: { id: row.id, system: row.system_id, name: row.name, opened: row.opened_year, source: row.source_url, coordinateSource: row.coordinate_source }, geometry: { type: 'Point', coordinates: [row.longitude, row.latitude] } })),
}
fs.writeFileSync(exportPath, `${JSON.stringify(exportData)}\n`)
database.close()
console.log(`Built ${databasePath} and ${exportPath}: ${exportData.features.length} route shapes, ${exportData.stations.length} stations from ${snapshots.length} feeds`)
