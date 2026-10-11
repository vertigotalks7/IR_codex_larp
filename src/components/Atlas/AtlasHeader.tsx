import type { NetworkModeConfig, RouteStatus, NetworkMode } from '../../types'

interface AtlasHeaderProps {
  onGoLanding: () => void
  selectedNetwork: NetworkModeConfig
  network: NetworkMode
  routeStatus: RouteStatus
}

export function AtlasHeader({ onGoLanding, selectedNetwork, network, routeStatus }: AtlasHeaderProps) {
  const statusText =
    network === 'metro'
      ? routeStatus === 'real'
        ? 'bundled metro route geometry loaded'
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
          : 'NHSRCL alignment geometry not bundled · no line drawn'

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
        <button title="Search map" aria-label="Search">
          ⌕
        </button>
        <button title="Settings" aria-label="Settings">
          ⚙
        </button>
      </div>
    </header>
  )
}
