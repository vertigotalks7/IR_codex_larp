import type { NetworkModeConfig, RouteStatus, NetworkMode } from '../../types'

interface AtlasHeaderProps {
  onGoLanding: () => void
  onGoHistory: () => void
  selectedNetwork: NetworkModeConfig
  network: NetworkMode
  routeStatus: RouteStatus
}

export function AtlasHeader({ onGoLanding, onGoHistory, selectedNetwork, network, routeStatus }: AtlasHeaderProps) {
  const statusText =
    network === 'metro'
      ? routeStatus === 'real'
        ? 'bundled GTFS + mapped track geometry loaded · source dates in ledger'
        : routeStatus === 'loading'
          ? 'loading route geometry…'
          : 'route geometry unavailable'
      : network === 'rail'
        ? routeStatus === 'real'
          ? 'rail GIS track geometry loaded · source date not recorded'
          : routeStatus === 'loading'
            ? 'loading rail GIS geometry…'
            : 'rail GIS geometry unavailable · no connector fallback'
        : network === 'suburban'
          ? routeStatus === 'real'
            ? 'OSM physical rail tracks · snapshot 10 May 2026 · not service-only'
            : routeStatus === 'loading'
              ? 'loading city rail track geometry…'
              : 'city rail geometry unavailable · no connector fallback'
      : 'official alignment KMZ listed · geometry not archived locally'

  return (
    <header className="atlas-topbar">
      <button className="atlas-logo" onClick={onGoLanding}>
        <span>↔</span>
        <strong>
          Transit<span>Atlas</span>
        </strong>
      </button>

      <div className="atlas-status">
        <i /> India · {selectedNetwork.name}
        <small>{statusText}</small>
      </div>

      <div className="atlas-top-actions">
        <button title="Open historical register" aria-label="Open history" onClick={onGoHistory}>
          History ↗
        </button>
      </div>
    </header>
  )
}
