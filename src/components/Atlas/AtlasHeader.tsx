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
        ? 'verified route geometry loaded'
        : routeStatus === 'loading'
          ? 'loading route geometry…'
          : 'route geometry unavailable'
      : 'reference mode · reviewed geometry pending'

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
