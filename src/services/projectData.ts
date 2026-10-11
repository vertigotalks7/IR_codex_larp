const jsonRequests = new Map<string, Promise<unknown>>()

async function requestProjectJson<T>(path: string): Promise<T> {
  const assetUrl = `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

  if (import.meta.env.PROD && typeof DecompressionStream !== 'undefined') {
    try {
      const compressed = await fetch(`${assetUrl}.gz`)
      if (compressed.ok && compressed.body) {
        if (compressed.headers.get('Content-Encoding')?.toLowerCase().includes('gzip')) {
          return await compressed.json() as T
        }
        const decompressed = compressed.body.pipeThrough(new DecompressionStream('gzip'))
        return await new Response(decompressed).json() as T
      }
    } catch {
      // Keep local/older deployments usable by falling back to the plain JSON.
    }
  }

  const response = await fetch(assetUrl)
  if (!response.ok) throw new Error(`Data bundle unavailable (${response.status}): ${path}`)
  return await response.json() as T
}

/** Base-path-aware JSON loading with in-memory request deduplication. */
export function fetchProjectJson<T>(path: string): Promise<T> {
  const key = `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
  const existing = jsonRequests.get(key)
  if (existing) return existing as Promise<T>

  const request = requestProjectJson<T>(path)
  jsonRequests.set(key, request)
  void request.catch(() => jsonRequests.delete(key))
  return request
}
