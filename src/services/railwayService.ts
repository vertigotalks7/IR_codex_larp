import { train17216, type RailwayStationStop, type TrainService } from '../data/indianRailways'

export function getTrain17216RouteGeoJson(train: TrainService = train17216) {
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: {
          id: `train-${train.number}`,
          name: `${train.number} · ${train.name}`,
          operator: train.operator,
          color: '#d97706', // Gold / Amber railway track color
          system: 'rail',
          kind: 'railway',
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: train.coordinates,
        },
      },
    ],
  }
}

export function getTrain17216StationsGeoJson(train: TrainService = train17216) {
  return {
    type: 'FeatureCollection' as const,
    features: train.stops.map((stop) => ({
      type: 'Feature' as const,
      properties: {
        id: `ir-${stop.code}`,
        name: stop.name,
        code: stop.code,
        arrival: stop.arrival,
        departure: stop.departure,
        day: stop.day,
        distanceKm: stop.distanceKm,
        haltMinutes: stop.haltMinutes,
        kind: 'railway',
      },
      geometry: {
        type: 'Point' as const,
        coordinates: stop.coordinates,
      },
    })),
  }
}

// Calculate position along coordinate path for progress in [0, 1]
export function getTrainPositionAtProgress(
  progress: number,
  coordinates: [number, number][] = train17216.coordinates,
): { position: [number, number]; bearing: number; segmentIndex: number } {
  if (coordinates.length === 0) {
    return { position: [77.7152, 14.4261], bearing: 0, segmentIndex: 0 }
  }
  const clamped = Math.max(0, Math.min(1, progress))
  const totalSegments = coordinates.length - 1
  const scaled = clamped * totalSegments
  const index = Math.min(Math.floor(scaled), totalSegments - 1)
  const segmentFraction = scaled - index

  const p1 = coordinates[index]
  const p2 = coordinates[index + 1]

  const lng = p1[0] + (p2[0] - p1[0]) * segmentFraction
  const lat = p1[1] + (p2[1] - p1[1]) * segmentFraction

  // Calculate approximate bearing in degrees
  const dLng = (p2[0] - p1[0]) * Math.cos((((p1[1] + p2[1]) / 2) * Math.PI) / 180)
  const dLat = p2[1] - p1[1]
  const angle = (Math.atan2(dLng, dLat) * 180) / Math.PI
  const bearing = (angle + 360) % 360

  return { position: [lng, lat], bearing, segmentIndex: index }
}

export function getTrainMarkerGeoJson(position: [number, number], bearing: number) {
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: {
          id: 'live-train-17216',
          name: '17216 DMM MTM EXP',
          bearing,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: position,
        },
      },
    ],
  }
}

export function findStopForProgress(
  progress: number,
  stops: RailwayStationStop[] = train17216.stops,
): { previousStop: RailwayStationStop; nextStop: RailwayStationStop | null } {
  const currentKm = progress * train17216.distanceKm
  let previous = stops[0]
  let next: RailwayStationStop | null = stops[1] ?? null

  for (let i = 0; i < stops.length; i++) {
    if (stops[i].distanceKm <= currentKm) {
      previous = stops[i]
      next = stops[i + 1] ?? null
    } else {
      break
    }
  }

  return { previousStop: previous, nextStop: next }
}
