import { systems } from '../../data'
import { networkModes } from '../../config/networks'
import type { MetroSystemId, NetworkMode, Station, RouteStatus, NetworkModeConfig } from '../../types'

interface AtlasPanelProps {
  network: NetworkMode
  system: MetroSystemId | 'all'
  selectedStation: Station | null
  selectedNetwork: NetworkModeConfig
  routeStatus: RouteStatus
  visibleStationsCount: number
  showStations: boolean
  showRoutes: boolean
  onNetworkChange: (mode: NetworkMode) => void
  onSystemChange: (system: MetroSystemId | 'all') => void
  onToggleStations: (show: boolean) => void
  onToggleRoutes: (show: boolean) => void
}

export function AtlasPanel({
  network,
  system,
  selectedStation,
  selectedNetwork,
  routeStatus,
  visibleStationsCount,
  showStations,
  showRoutes,
  onNetworkChange,
  onSystemChange,
  onToggleStations,
  onToggleRoutes,
}: AtlasPanelProps) {
  return (
    <aside className="atlas-panel">
      <div className="panel-close">
        NETWORK LAYER <span>⌃</span>
      </div>

      <div className="network-switch" role="tablist" aria-label="Choose network layer">
        {networkModes.map((item) => (
          <button
            key={item.id}
            className={network === item.id ? 'active' : ''}
            onClick={() => onNetworkChange(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="settings-divider" />

      {network === 'metro' ? (
        <>
          <div className="panel-close">
            METRO SYSTEMS <span>⌃</span>
          </div>
          <div className="system-filter atlas-systems" role="tablist" aria-label="Filter metro system">
            <button
              className={system === 'all' ? 'active' : ''}
              onClick={() => onSystemChange('all')}
            >
              <i style={{ background: '#8e4b38' }} />
              All India
            </button>
            {systems.map((item) => (
              <button
                key={item.id}
                className={system === item.id ? 'active' : ''}
                onClick={() => onSystemChange(item.id)}
              >
                <i style={{ background: item.color }} />
                {item.name}
                <small>{item.lines.length} lines</small>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="network-reference">
          <small>{selectedNetwork.description}</small>
          <p>
            The map keeps metro routes hidden in this mode. Browse the referenced source while a reviewed local geometry snapshot is prepared.
          </p>
          <a href={selectedNetwork.source} target="_blank" rel="noreferrer">
            Open {selectedNetwork.sourceLabel} ↗
          </a>
        </div>
      )}

      <div className="settings-divider" />

      <div className="panel-close">
        MAP DETAILS <span>⌃</span>
      </div>

      {network === 'metro' && (
        <>
          <label className="toggle-row">
            <span>Show line routes</span>
            <input
              type="checkbox"
              checked={showRoutes}
              onChange={(e) => onToggleRoutes(e.target.checked)}
            />
          </label>
          <label className="toggle-row">
            <span>Show station pins</span>
            <input
              type="checkbox"
              checked={showStations}
              onChange={(e) => onToggleStations(e.target.checked)}
            />
          </label>
        </>
      )}

      <div className="atlas-stats">
        <div>
          <strong>
            {network === 'metro'
              ? routeStatus === 'real'
                ? 'GTFS'
                : routeStatus === 'loading'
                  ? '…'
                  : '—'
              : 'REF'}
          </strong>
          <span>map source</span>
        </div>
        <div>
          <strong>{network === 'metro' ? visibleStationsCount : '—'}</strong>
          <span>{network === 'metro' ? 'stations in view' : 'local lines'}</span>
        </div>
        <div>
          <strong>{network === 'metro' ? systems.length : '1'}</strong>
          <span>{network === 'metro' ? 'systems mapped' : 'network mode'}</span>
        </div>
      </div>

      {network === 'metro' && routeStatus === 'unavailable' && (
        <p className="route-warning">
          No verified route geometry is bundled for this selection yet. Straight connector lines are intentionally hidden.
        </p>
      )}

      {selectedStation && (
        <div className="atlas-selection">
          <small>SELECTED STATION</small>
          <strong>{selectedStation.name}</strong>
          <span>
            {selectedStation.city} · Opened {selectedStation.opened}
            {selectedStation.lines.length
              ? ` · ${selectedStation.lines.length} line${selectedStation.lines.length === 1 ? '' : 's'}`
              : ''}
          </span>
          <a href={selectedStation.source} target="_blank" rel="noreferrer">
            Opening/source record ↗
          </a>
          <a href={selectedStation.coordinateSource} target="_blank" rel="noreferrer">
            Coordinate source ↗
          </a>
        </div>
      )}
    </aside>
  )
}
