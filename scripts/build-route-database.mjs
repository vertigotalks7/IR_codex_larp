import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const root = process.cwd()
const geometrySource = fs.readFileSync(path.join(root, 'src', 'routeGeometry.ts'), 'utf8')
const geometryMatch = geometrySource.match(/export const bundledRouteGeometry = (.+) as const\s*$/s)
if (!geometryMatch) throw new Error('Could not read bundled route geometry')

const geometry = JSON.parse(geometryMatch[1])
const databaseDirectory = path.join(root, 'data')
const databasePath = path.join(databaseDirectory, 'routes.sqlite')
const exportDirectory = path.join(root, 'public', 'data')
const exportPath = path.join(exportDirectory, 'routes.json')
fs.mkdirSync(databaseDirectory, { recursive: true })
fs.mkdirSync(exportDirectory, { recursive: true })

const database = new DatabaseSync(databasePath)
database.exec(`
  PRAGMA foreign_keys = ON;
  DROP TABLE IF EXISTS route_shapes;
  DROP TABLE IF EXISTS lines;
  DROP TABLE IF EXISTS systems;
  CREATE TABLE systems (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    operator TEXT NOT NULL,
    source_url TEXT NOT NULL,
    retrieved_at TEXT NOT NULL
  );
  CREATE TABLE lines (
    id TEXT PRIMARY KEY,
    system_id TEXT NOT NULL REFERENCES systems(id),
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    opened_year INTEGER NOT NULL,
    source_url TEXT NOT NULL
  );
  CREATE TABLE route_shapes (
    id TEXT PRIMARY KEY,
    line_id TEXT NOT NULL REFERENCES lines(id),
    geometry_geojson TEXT NOT NULL,
    point_count INTEGER NOT NULL,
    source_type TEXT NOT NULL,
    source_url TEXT NOT NULL,
    retrieved_at TEXT NOT NULL
  );
`)

const retrievedAt = new Date().toISOString()
const insertSystem = database.prepare('INSERT INTO systems VALUES (?, ?, ?, ?, ?, ?)')
insertSystem.run('hyderabad', 'Hyderabad Metro', 'Hyderabad', 'Hyderabad Metro Rail', 'https://hmrl.co.in/open-data/', retrievedAt)

const insertLine = database.prepare('INSERT INTO lines VALUES (?, ?, ?, ?, ?, ?)')
const insertShape = database.prepare('INSERT INTO route_shapes VALUES (?, ?, ?, ?, ?, ?, ?)')
for (const feature of geometry.features) {
  const lineId = feature.properties.id
  const routeName = feature.properties.name
  const routeColor = feature.properties.color
  insertLine.run(lineId, 'hyderabad', routeName, routeColor, 2017, feature.properties.source)
  insertShape.run(lineId, lineId, JSON.stringify(feature.geometry), feature.geometry.coordinates.length, 'gtfs', feature.properties.source, retrievedAt)
}

const rows = database.prepare(`
  SELECT route_shapes.id, route_shapes.line_id, lines.system_id, lines.name, lines.color,
         lines.opened_year, route_shapes.geometry_geojson, route_shapes.source_type,
         route_shapes.source_url, route_shapes.retrieved_at
  FROM route_shapes JOIN lines ON lines.id = route_shapes.line_id
  ORDER BY lines.id
`).all()
const exportData = {
  schemaVersion: 1,
  generatedAt: retrievedAt,
  systems: [{ id: 'hyderabad', name: 'Hyderabad Metro', source: 'https://hmrl.co.in/open-data/' }],
  features: rows.map((row) => ({
    type: 'Feature',
    properties: {
      id: row.id,
      system: row.system_id,
      name: row.name,
      color: row.color,
      opened: row.opened_year,
      sourceType: row.source_type,
      source: row.source_url,
      retrievedAt: row.retrieved_at,
    },
    geometry: JSON.parse(row.geometry_geojson),
  })),
}
fs.writeFileSync(exportPath, `${JSON.stringify(exportData)}\n`)
database.close()
console.log(`Built ${databasePath} and ${exportPath} from ${exportData.features.length} verified route shapes`)
