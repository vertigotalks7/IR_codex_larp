import fs from 'node:fs'
import path from 'node:path'

const sourceRoot = process.argv[2]
const outputFile = process.argv[3]

if (!sourceRoot || !outputFile) {
  throw new Error('Usage: node scripts/build-route-geometry.mjs <gtfs-directory> <output-file>')
}

function readCsv(fileName) {
  const [headerLine, ...lines] = fs.readFileSync(path.join(sourceRoot, fileName), 'utf8').trim().split(/\r?\n/)
  const headers = headerLine.split(',')
  return lines.filter(Boolean).map((line) => {
    const values = line.split(',')
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
  })
}

const routes = readCsv('routes.txt')
const trips = readCsv('trips.txt')
const shapeRows = readCsv('shapes.txt')
const routeById = new Map(routes.map((route) => [route.route_id, route]))
const shapeToRoute = new Map(trips.map((trip) => [trip.shape_id, trip.route_id]))
const grouped = new Map()

for (const row of shapeRows) {
  const routeId = shapeToRoute.get(row.shape_id)
  if (!routeId || !routeById.has(routeId)) continue
  const key = `${routeId}:${row.shape_id}`
  const points = grouped.get(key) ?? []
  points.push({ sequence: Number(row.shape_pt_sequence), coordinate: [Number(row.shape_pt_lon), Number(row.shape_pt_lat)] })
  grouped.set(key, points)
}

const longestByRoute = new Map()
for (const [key, points] of grouped) {
  const [routeId] = key.split(':')
  points.sort((a, b) => a.sequence - b.sequence)
  const current = longestByRoute.get(routeId)
  if (!current || points.length > current.length) longestByRoute.set(routeId, points)
}

const features = [...longestByRoute].map(([routeId, points]) => {
  const route = routeById.get(routeId)
  return {
    type: 'Feature',
    properties: {
      id: `hyderabad-${routeId.toLowerCase()}`,
      name: route.route_long_name,
      color: `#${route.route_color}`,
      system: 'hyderabad',
      source: 'https://hmrl.co.in/open-data/',
    },
    geometry: { type: 'LineString', coordinates: points.map((point) => point.coordinate) },
  }
})

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, `export const bundledRouteGeometry = ${JSON.stringify({ type: 'FeatureCollection', features })} as const\n`)
console.log(`Wrote ${features.length} route features to ${outputFile}`)
