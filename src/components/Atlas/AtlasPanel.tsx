import { systems } from '../../data'
import { networkModes } from '../../config/networks'
import { nationalCorridors, type RailwayJunction } from '../../data/nationalRailways'
import { RAILWAY_ZONES } from '../../data/railwayZones'
import { train17216, type RailwayStationStop } from '../../data/indianRailways'
import { findStopForProgress } from '../../services/railwayService'
import type { MetroSystemId, NetworkMode, Station, RouteStatus, NetworkModeConfig } from '../../types'

interface AtlasPanelProps {
  network: NetworkMode
  system: MetroSystemId | 'all'
  selectedStation: Station | null
  selectedRailwayStop: RailwayStationStop | null
  selectedRailwayJunction: RailwayJunction | null
  selectedCorridorId: string
  selectedNetwork: NetworkModeConfig
  routeStatus: RouteStatus
  visibleStationsCount: number
  showStations: boolean
  showRoutes: boolean
  trainProgress: number
  isTrainRunning: boolean
  onToggleTrainRunning: () => void
  onTrainProgressChange: (progress: number) => void
  onNetworkChange: (mode: NetworkMode) => void
  onSystemChange: (system: MetroSystemId | 'all') => void
  onCorridorChange: (corridorId: string) => void
  onSelectRailwayStop: (stop: RailwayStationStop) => void
  onSelectRailwayJunction: (junction: RailwayJunction) => void
  onToggleStations: (show: boolean) => void
  onToggleRoutes: (show: boolean) => void
}

export function AtlasPanel({
  network,
  system,
  selectedStation,
  selectedRailwayStop,
  selectedRailwayJunction,
  selectedCorridorId,
  selectedNetwork,
  routeStatus,
  visibleStationsCount,
  showStations,
  showRoutes,
  trainProgress,
  isTrainRunning,
  onToggleTrainRunning,
  onTrainProgressChange,
  onNetworkChange,
  onSystemChange,
  onCorridorChange,
  onSelectRailwayStop,
  onToggleStations,
  onToggleRoutes,
}: AtlasPanelProps) {
  const currentProgressSegment = findStopForProgress(trainProgress)
  const currentKm = Math.round(trainProgress * train17216.distanceKm)
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

          {/* RailRadar Train 17216 Card */}
          {(selectedCorridorId === 'all' || selectedCorridorId === 'rayalaseema-scr-dmm-mtm') && (
            <>
              <div className="settings-divider" />
              <div className="panel-close">
                LIVE TRAIN RADAR (TRAIN 17216) <span>⌃</span>
              </div>
              <div className="railway-card">
                <div className="railway-header">
                  <span className="railway-badge">{train17216.number} EXP</span>
                  <span className="railway-status-pill">
                    <i /> ON TIME
                  </span>
                </div>
                <h3>{train17216.name}</h3>
                <p>
                  {train17216.origin} → {train17216.destination}
                </p>

                <div className="railway-live-metric">
                  <div>
                    <strong>{currentKm} km</strong>
                    <span>COVERED</span>
                  </div>
                  <div>
                    <strong>~74 km/h</strong>
                    <span>SPEED</span>
                  </div>
                  <div>
                    <strong>{train17216.stops.length}</strong>
                    <span>HALTS</span>
                  </div>
                </div>

                <div className="rail-radar-ctrl">
                  <div className="rail-radar-actions">
                    <span>
                      Next:{' '}
                      <b>
                        {currentProgressSegment.nextStop
                          ? `${currentProgressSegment.nextStop.name} (${currentProgressSegment.nextStop.code})`
                          : 'Arrived at MTM'}
                      </b>
                    </span>
                    <button onClick={onToggleTrainRunning}>
                      {isTrainRunning ? 'Ⅱ Pause' : '▶ Track Live'}
                    </button>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.005"
                    value={trainProgress}
                    onChange={(e) => onTrainProgressChange(Number(e.target.value))}
                    aria-label="Train journey progress"
                  />
                </div>
              </div>

              <div className="panel-close" style={{ marginTop: '10px' }}>
                STATION TIMETABLE (22 STOPS) <span>⌃</span>
              </div>
              <div className="railway-stop-list" role="list">
                {train17216.stops.map((stop) => {
                  const isSelected = selectedRailwayStop?.code === stop.code
                  const isPassed = stop.distanceKm <= currentKm
                  return (
                    <button
                      key={stop.code}
                      className={`railway-stop-item ${isSelected ? 'active' : ''}`}
                      onClick={() => onSelectRailwayStop(stop)}
                      title={`${stop.name} (${stop.code}) - ${stop.arrival} / ${stop.departure}`}
                    >
                      <span className="railway-stop-code">
                        {isPassed ? '✓ ' : ''}
                        {stop.code}
                      </span>
                      <span className="railway-stop-name">{stop.name}</span>
                      <span className="railway-stop-time">
                        {stop.arrival === 'Start' ? stop.departure : stop.arrival}
                      </span>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}

      {network !== 'metro' && network !== 'rail' && (
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
              ? routeStatus === 'real'
                ? 'GTFS'
                : routeStatus === 'loading'
                  ? '…'
                  : '—'
              : network === 'rail'
                ? 'GIS/HDX'
                : 'REF'}
          </strong>
          <span>map source</span>
        </div>
        <div>
          <strong>
            {network === 'metro'
              ? visibleStationsCount
              : network === 'rail'
                ? selectedCorridorId === 'all'
                  ? '33+ junc'
                  : currentCorridor?.majorJunctions.length ?? '—'
                : '—'}
          </strong>
          <span>{network === 'metro' ? 'stations in view' : 'junctions'}</span>
        </div>
        <div>
          <strong>
            {network === 'metro'
              ? systems.length
              : network === 'rail'
                ? selectedCorridorId === 'all'
                  ? '10 lines'
                  : '1 corridor'
                : '1'}
          </strong>
          <span>{network === 'metro' ? 'systems' : 'rail corridor'}</span>
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

      {network === 'rail' && selectedRailwayStop && !selectedRailwayJunction && (
        <div className="atlas-selection">
          <small>SELECTED RAILWAY STATION</small>
          <strong>
            {selectedRailwayStop.name} ({selectedRailwayStop.code})
          </strong>
          <span>
            Arr: <b>{selectedRailwayStop.arrival}</b> · Dep: <b>{selectedRailwayStop.departure}</b> (Day {selectedRailwayStop.day})
          </span>
          <span>
            Distance: {selectedRailwayStop.distanceKm} km from Dharmavaram · Halt:{' '}
            {selectedRailwayStop.haltMinutes} min
          </span>
          <a
            href={`https://railradar.in/railradar?train=17216&date=${train17216.date}`}
            target="_blank"
            rel="noreferrer"
          >
            RailRadar live status ↗
          </a>
        </div>
      )}
    </aside>
  )
}
