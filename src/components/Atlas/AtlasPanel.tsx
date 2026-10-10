import { systems } from '../../data'
import { networkModes } from '../../config/networks'
import { nationalCorridors, type RailwayJunction } from '../../data/nationalRailways'
import { RAILWAY_ZONES } from '../../data/railwayZones'
import { SUBURBAN_DIVISIONS } from '../../data/suburbanDivisions'
import type { MetroSystemId, NetworkMode, Station, RouteStatus, NetworkModeConfig } from '../../types'

interface AtlasPanelProps {
  network: NetworkMode
  system: MetroSystemId | 'all'
  selectedStation: Station | null
  selectedRailwayJunction: RailwayJunction | null
  selectedCorridorId: string
  selectedSuburbanId?: string
  selectedNetwork: NetworkModeConfig
  routeStatus: RouteStatus
  visibleStationsCount: number
  showStations: boolean
  showRoutes: boolean
  onNetworkChange: (mode: NetworkMode) => void
  onSystemChange: (system: MetroSystemId | 'all') => void
  onCorridorChange: (corridorId: string) => void
  onSuburbanDivisionChange?: (divisionId: string) => void
  onSelectRailwayJunction: (junction: RailwayJunction) => void
  onToggleStations: (show: boolean) => void
  onToggleRoutes: (show: boolean) => void
}

export function AtlasPanel({
  network,
  system,
  selectedStation,
  selectedRailwayJunction,
  selectedCorridorId,
  selectedSuburbanId = 'mumbai',
  selectedNetwork,
  routeStatus,
  visibleStationsCount,
  showStations,
  showRoutes,
  onNetworkChange,
  onSystemChange,
  onCorridorChange,
  onSuburbanDivisionChange,
  onToggleStations,
  onToggleRoutes,
}: AtlasPanelProps) {
  const currentCorridor = nationalCorridors.find((c) => c.id === selectedCorridorId)

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

      {network === 'metro' && (
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
      )}

      {network === 'rail' && (
        <>
          <div className="panel-close">
            INDIAN RAILWAYS GIS ZONES (OFFICIAL NETWORK) <span>⌃</span>
          </div>
          <div className="system-filter atlas-systems" role="tablist" aria-label="Filter railway zone">
            {RAILWAY_ZONES.map((z) => (
              <button
                key={z.id}
                className={selectedCorridorId === z.id ? 'active' : ''}
                onClick={() => onCorridorChange(z.id)}
              >
                <i style={{ background: z.color }} />
                {z.short}
                <small>{z.routes} routes</small>
              </button>
            ))}
          </div>

          {selectedCorridorId !== 'all' && (
            (() => {
              const activeZone = RAILWAY_ZONES.find((z) => z.id === selectedCorridorId)
              const activeCorridor = nationalCorridors.find((c) => c.id === selectedCorridorId)
              if (activeZone && activeZone.id !== 'all') {
                return (
                  <div className="railway-card" style={{ marginTop: '8px' }}>
                    <div className="railway-header">
                      <span className="railway-badge">{activeZone.code}</span>
                      <span style={{ fontSize: '10px', color: '#6d2f2b', fontWeight: 600 }}>
                        {activeZone.totalKm} KM
                      </span>
                    </div>
                    <h3 style={{ fontSize: '14px' }}>{activeZone.name}</h3>
                    <div className="railway-live-metric" style={{ marginTop: '6px' }}>
                      <div>
                        <strong>{activeZone.routes}</strong>
                        <span>SECTIONS</span>
                      </div>
                      <div>
                        <strong>{activeZone.totalKm} km</strong>
                        <span>NETWORK</span>
                      </div>
                      <div>
                        <strong>130 km/h</strong>
                        <span>MAX SPEED</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '10px', color: '#786751', marginTop: '6px' }}>
                      Official Indian Railways GIS Dataset · Broad, Metre & Narrow Gauge
                    </p>
                  </div>
                )
              }
              if (activeCorridor) {
                return (
                  <div className="railway-card" style={{ marginTop: '8px' }}>
                    <div className="railway-header">
                      <span className="railway-badge">{activeCorridor.code}</span>
                      <span style={{ fontSize: '10px', color: '#6d2f2b', fontWeight: 600 }}>
                        {activeCorridor.distanceKm} KM
                      </span>
                    </div>
                    <h3 style={{ fontSize: '14px' }}>{activeCorridor.name}</h3>
                    <p>
                      <b>Route:</b> {activeCorridor.origin} → {activeCorridor.destination}
                    </p>
                    <div className="railway-live-metric" style={{ marginTop: '6px' }}>
                      <div>
                        <strong>{activeCorridor.distanceKm} km</strong>
                        <span>DISTANCE</span>
                      </div>
                      <div>
                        <strong>{activeCorridor.zone.split('/')[0]}</strong>
                        <span>ZONE</span>
                      </div>
                      <div>
                        <strong>{activeCorridor.majorJunctions.length}</strong>
                        <span>JUNCTIONS</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            })()
          )}
        </>
      )}

      {network === 'suburban' && (
        <>
          <div className="panel-close">
            SUBURBAN DIVISIONS (COMMUTER NETWORKS) <span>⌃</span>
          </div>
          <div className="system-filter atlas-systems" role="tablist" aria-label="Filter suburban division">
            <button
              className={selectedSuburbanId === 'all' ? 'active' : ''}
              onClick={() => onSuburbanDivisionChange?.('all')}
            >
              <i style={{ background: '#0284c7' }} />
              All Divisions
              <small>6 networks</small>
            </button>
            {SUBURBAN_DIVISIONS.map((d) => (
              <button
                key={d.id}
                className={selectedSuburbanId === d.id ? 'active' : ''}
                onClick={() => onSuburbanDivisionChange?.(d.id)}
              >
                <i style={{ background: d.color }} />
                {d.shortName}
                <small>{d.dailyRidership}</small>
              </button>
            ))}
          </div>

          {(() => {
            const activeDivision = SUBURBAN_DIVISIONS.find((d) => d.id === selectedSuburbanId)
            if (activeDivision) {
              return (
                <div className="railway-card" style={{ marginTop: '8px' }}>
                  <div className="railway-header">
                    <span className="railway-badge" style={{ background: activeDivision.color, color: '#fff' }}>
                      {activeDivision.city.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '10px', color: '#6d2f2b', fontWeight: 600 }}>
                      {activeDivision.routeKm} KM ROUTE
                    </span>
                  </div>
                  <h3 style={{ fontSize: '14px' }}>{activeDivision.name}</h3>
                  <p style={{ fontSize: '11px', color: '#453a2f', margin: '4px 0' }}>
                    <b>Operator:</b> {activeDivision.operator}
                  </p>
                  <div className="railway-live-metric" style={{ marginTop: '6px' }}>
                    <div>
                      <strong>{activeDivision.dailyRidership}</strong>
                      <span>DAILY RIDERS</span>
                    </div>
                    <div>
                      <strong>{activeDivision.routeKm} km</strong>
                      <span>ROUTE-KM</span>
                    </div>
                    <div>
                      <strong>{activeDivision.lines.length}</strong>
                      <span>MAIN LINES</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '10px', color: '#594d3f' }}>
                    <b>Key Lines:</b> {activeDivision.lines.join(' · ')}
                  </div>
                  <p style={{ fontSize: '10px', color: '#786751', marginTop: '6px' }}>
                    Traction: <b>{activeDivision.electrification}</b> · Gauge: <b>{activeDivision.gauge}</b><br/>
                    Source: DataMeet Railways & CRIS Station Directory
                  </p>
                </div>
              )
            }
            return (
              <div className="railway-card" style={{ marginTop: '8px' }}>
                <div className="railway-header">
                  <span className="railway-badge" style={{ background: '#0284c7', color: '#fff' }}>ALL INDIA</span>
                  <span style={{ fontSize: '10px', color: '#6d2f2b', fontWeight: 600 }}>6 DIVISIONS</span>
                </div>
                <h3 style={{ fontSize: '14px' }}>National Suburban Commuter Networks</h3>
                <div className="railway-live-metric" style={{ marginTop: '6px' }}>
                  <div>
                    <strong>12.8M+</strong>
                    <span>DAILY RIDERS</span>
                  </div>
                  <div>
                    <strong>2,631 km</strong>
                    <span>TOTAL ROUTE</span>
                  </div>
                  <div>
                    <strong>572</strong>
                    <span>STATIONS</span>
                  </div>
                </div>
                <p style={{ fontSize: '10px', color: '#786751', marginTop: '6px' }}>
                  Mumbai (CR/WR), Kolkata (ER/SER), Chennai (SR), Delhi NCR (NR), Hyderabad MMTS (SCR), and Pune (CR).
                </p>
              </div>
            )
          })()}
        </>
      )}

      {network !== 'metro' && network !== 'rail' && network !== 'suburban' && (
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

      <label className="toggle-row">
        <span>Show track lines</span>
        <input
          type="checkbox"
          checked={showRoutes}
          onChange={(e) => onToggleRoutes(e.target.checked)}
        />
      </label>
      <label className="toggle-row">
        <span>Show stations / junctions</span>
        <input
          type="checkbox"
          checked={showStations}
          onChange={(e) => onToggleStations(e.target.checked)}
        />
      </label>

      <div className="atlas-stats">
        <div>
          <strong>
            {network === 'metro'
              ? visibleStationsCount
              : network === 'rail'
                ? selectedCorridorId === 'all'
                  ? '2,033'
                  : 'Junctions'
                : network === 'suburban'
                  ? '572'
                  : '—'}
          </strong>
          <span>
            {network === 'metro'
              ? 'stations in view'
              : network === 'rail'
                ? 'junctions'
                : network === 'suburban'
                  ? 'commuter stations'
                  : 'stations'}
          </span>
        </div>
        <div>
          <strong>
            {network === 'metro'
              ? systems.length
              : network === 'rail'
                ? selectedCorridorId === 'all'
                  ? '2,390'
                  : '1 zone'
                : network === 'suburban'
                  ? selectedSuburbanId === 'all'
                    ? '201'
                    : '1 division'
                  : '1'}
          </strong>
          <span>
            {network === 'metro'
              ? 'systems'
              : network === 'rail'
                ? 'rail routes'
                : network === 'suburban'
                  ? 'suburban routes'
                  : 'networks'}
          </span>
        </div>
      </div>

      {network === 'metro' && routeStatus === 'unavailable' && (
        <p className="route-warning">
          No verified route geometry is bundled for this selection yet. Straight connector lines are intentionally hidden.
        </p>
      )}

      {network === 'metro' && selectedStation && (
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

      {network === 'rail' && selectedRailwayJunction && (
        <div className="atlas-selection">
          <small>SELECTED RAILWAY JUNCTION</small>
          <strong>
            {selectedRailwayJunction.name} ({selectedRailwayJunction.code})
          </strong>
          <span>
            Zone: <b>{selectedRailwayJunction.zone}</b> · Division: <b>{selectedRailwayJunction.division}</b>
          </span>
          <span>
            State: {selectedRailwayJunction.state} · Platforms: {selectedRailwayJunction.platforms}
          </span>
          <span>
            Corridors: {selectedRailwayJunction.corridors.length} main trunk line(s)
          </span>
          <a
            href="https://rbs.indianrail.gov.in/ShortPath/CheckUrData.jsp"
            target="_blank"
            rel="noreferrer"
          >
            CRIS / RBS Railway Record ↗
          </a>
        </div>
      )}
    </aside>
  )
}
