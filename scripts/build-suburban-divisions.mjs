import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sourceDir = path.join(root, 'data', 'source', 'hotosm')
const sourcePath = path.join(sourceDir, 'railways.geojson')
const sourceReadmePath = path.join(sourceDir, 'README.txt')
const outputDir = path.join(root, 'public', 'data')

const DIVISIONS = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    color: '#0284c7',
    bounds: { minLon: 72.75, maxLon: 73.4, minLat: 18.88, maxLat: 20 },
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    color: '#059669',
    bounds: { minLon: 88, maxLon: 88.75, minLat: 22.25, maxLat: 23.15 },
  },
  {
    id: 'chennai',
    name: 'Chennai',
    color: '#ea580c',
    bounds: { minLon: 79.6, maxLon: 80.35, minLat: 12.65, maxLat: 13.45 },
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    color: '#dc2626',
    bounds: { minLon: 76.8, maxLon: 77.55, minLat: 28.3, maxLat: 29.05 },
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    color: '#7c3aed',
    bounds: { minLon: 78.25, maxLon: 78.6, minLat: 17.3, maxLat: 17.58 },
  },
  {
    id: 'pune',
    name: 'Pune',
    color: '#d97706',
    bounds: { minLon: 73.35, maxLon: 73.95, minLat: 18.5, maxLat: 18.8 },
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    color: '#7c3aed',
    bounds: { minLon: 77.35, maxLon: 77.95, minLat: 12.72, maxLat: 13.2 },
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    color: '#0891b2',
    bounds: { minLon: 72.4, maxLon: 72.8, minLat: 22.9, maxLat: 23.2 },
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    color: '#db2777',
    bounds: { minLon: 75.6, maxLon: 76.0, minLat: 26.7, maxLat: 27.0 },
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    color: '#16a34a',
    bounds: { minLon: 80.7, maxLon: 81.1, minLat: 26.7, maxLat: 27.0 },
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    color: '#ca8a04',
    bounds: { minLon: 79.0, maxLon: 79.35, minLat: 20.95, maxLat: 21.25 },
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    color: '#ea580c',
    bounds: { minLon: 77.2, maxLon: 77.55, minLat: 23.1, maxLat: 23.4 },
  },
]

function clipSegment(start, end, bounds) {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  let t0 = 0
  let t1 = 1
  const edges = [
    [-dx, start[0] - bounds.minLon],
    [dx, bounds.maxLon - start[0]],
    [-dy, start[1] - bounds.minLat],
    [dy, bounds.maxLat - start[1]],
  ]

  for (const [p, q] of edges) {
    if (p === 0) {
      if (q < 0) return null
      continue
    }

    const t = q / p
    if (p < 0) {
      if (t > t1) return null
      t0 = Math.max(t0, t)
    } else {
      if (t < t0) return null
      t1 = Math.min(t1, t)
    }
  }

  return [
    [start[0] + t0 * dx, start[1] + t0 * dy],
    [start[0] + t1 * dx, start[1] + t1 * dy],
  ]
}

function sameCoordinate(a, b) {
  return Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9
}

function clipLineString(coordinates, bounds) {
  const parts = []
  let current = []

  for (let i = 1; i < coordinates.length; i += 1) {
    const clipped = clipSegment(coordinates[i - 1], coordinates[i], bounds)
    if (!clipped) {
      if (current.length > 1) parts.push(current)
      current = []
      continue
    }

    const [start, end] = clipped
    if (current.length && sameCoordinate(current[current.length - 1], start)) {
      if (!sameCoordinate(current[current.length - 1], end)) current.push(end)
    } else {
      if (current.length > 1) parts.push(current)
      current = [start, end]
    }
  }

  if (current.length > 1) parts.push(current)
  return parts
}

function lineParts(geometry) {
  if (geometry?.type === 'LineString') return [geometry.coordinates]
  if (geometry?.type === 'MultiLineString') return geometry.coordinates
  return []
}

function stationName(properties) {
  return properties.name_en || properties.name || properties.name_latin || properties.name_hi || ''
}

if (!fs.existsSync(sourcePath)) {
  throw new Error(`Missing OSM source snapshot: ${sourcePath}. See DATA_SOURCES.md to download it.`)
}

const sourceNotes = fs.readFileSync(sourceReadmePath, 'utf8')
const snapshot = sourceNotes.match(/^Snapshot:\s*(\d{4}-\d{2}-\d{2})\s*$/m)?.[1]
if (!snapshot) throw new Error(`Could not read the OSM snapshot date from ${sourceReadmePath}`)

const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
const trackFeatures = []
const stationFeatures = []
const counts = Object.fromEntries(DIVISIONS.map((division) => [division.id, { tracks: 0, stations: 0 }]))

for (const feature of source.features ?? []) {
  const properties = feature.properties ?? {}
  const railway = properties.railway

  for (const division of DIVISIONS) {
    const bounds = division.bounds

    if (railway === 'rail' && (feature.geometry?.type === 'LineString' || feature.geometry?.type === 'MultiLineString')) {
      const clippedParts = lineParts(feature.geometry).flatMap((line) => clipLineString(line, bounds))
      if (!clippedParts.length) continue

      const sourceId = String(properties.id ?? 'unknown').replaceAll('/', '-')
      trackFeatures.push({
        type: 'Feature',
        properties: {
          id: `osm-${division.id}-${sourceId}`,
          osmId: properties.id ?? '',
          name: stationName(properties) || `${division.name} rail track`,
          divisionId: division.id,
          divisionName: division.name,
          color: division.color,
          system: 'suburban',
          kind: 'physical-rail-track',
          source: 'OpenStreetMap / HOTOSM India railways',
          snapshot,
        },
        geometry: { type: 'MultiLineString', coordinates: clippedParts },
      })
      counts[division.id].tracks += 1
      continue
    }

    if (railway === 'station' && feature.geometry?.type === 'Point') {
      const [longitude, latitude] = feature.geometry.coordinates
      if (
        longitude < bounds.minLon || longitude > bounds.maxLon ||
        latitude < bounds.minLat || latitude > bounds.maxLat
      ) continue

      const sourceId = String(properties.id ?? 'unknown').replaceAll('/', '-')
      stationFeatures.push({
        type: 'Feature',
        properties: {
          id: `osm-${division.id}-${sourceId}`,
          osmId: properties.id ?? '',
          name: stationName(properties) || 'Unnamed railway station',
          divisionId: division.id,
          divisionName: division.name,
          divisionCity: division.name,
          color: division.color,
          kind: 'suburban-station',
          source: 'OpenStreetMap / HOTOSM India railways',
          snapshot,
        },
        geometry: feature.geometry,
      })
      counts[division.id].stations += 1
    }
  }
}

fs.mkdirSync(outputDir, { recursive: true })
const divisionOutputDir = path.join(outputDir, 'suburban')
fs.mkdirSync(divisionOutputDir, { recursive: true })
const metadata = {
  source: 'https://data.humdata.org/dataset/hotosm_ind_railways',
  upstream: 'https://www.openstreetmap.org/',
  license: 'ODbL',
  snapshot,
  geometryMeaning: 'Physical railway track ways and railway station features clipped to city focus bounds; not a list of commuter train services.',
  divisions: DIVISIONS.map((division) => ({ ...division, ...counts[division.id] })),
  totalTrackFeatures: trackFeatures.length,
  totalStations: stationFeatures.length,
}

for (const division of metadata.divisions) {
  const tracks = trackFeatures.filter((feature) => feature.properties.divisionId === division.id)
  const stations = stationFeatures.filter((feature) => feature.properties.divisionId === division.id)
  const file = path.join(divisionOutputDir, `${division.id}.json`)
  const payload = {
    routes: {
      type: 'FeatureCollection',
      name: `OSM_${division.id}_physical_rail_tracks`,
      features: tracks,
    },
    stations: {
      type: 'FeatureCollection',
      name: `OSM_${division.id}_railway_stations`,
      features: stations,
    },
  }
  fs.writeFileSync(file, JSON.stringify(payload))
  console.log(`Wrote ${path.relative(root, file)} (${(fs.statSync(file).size / 1024).toFixed(1)} KB)`)
  console.log(`${division.name}: ${division.tracks} clipped track features, ${division.stations} stations`)
}

const metaFile = path.join(outputDir, 'suburban-meta.json')
fs.writeFileSync(metaFile, JSON.stringify(metadata, null, 2))
console.log(`Wrote ${path.relative(root, metaFile)}`)
