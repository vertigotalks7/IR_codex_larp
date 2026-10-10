let maplibrePromise: Promise<typeof import('maplibre-gl')> | null = null

export function loadMapLibre() {
  maplibrePromise ??= import('maplibre-gl')
  return maplibrePromise
}
