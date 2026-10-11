import { systems } from '../../data'
import { networkModes } from '../../config/networks'
import { metroCatalog, metroCatalogById } from '../../data/metroCatalog'
import { nationalCorridors, type RailwayJunction } from '../../data/nationalRailways'
import { RAILWAY_ZONES } from '../../data/railwayZones'
import { SUBURBAN_DIVISIONS } from '../../data/suburbanDivisions'
import {
  getNationalRailwaysJunctionsGeoJson,
  getNationalRailwaysTrackGeoJson,
  getSuburbanStationsGeoJson,
  getSuburbanTracksGeoJson,
} from '../../services/railwayService'
import type { MetroSystemId, NetworkMode, Station, RouteStatus, NetworkModeConfig } from '../../types'
import './atlas-panel-catalog.css'

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
  const railTrackCount = routeStatus === 'real' ? getNationalRailwaysTrackGeoJson(selectedCorridorId).features.length : '—'
  const railJunctionCount = routeStatus === 'real' ? getNationalRailwaysJunctionsGeoJson(selectedCorridorId).features.length : '—'
  const cityTrackCount = routeStatus === 'real' ? getSuburbanTracksGeoJson(selectedSuburbanId).features.length : '—'
  const cityStationCount = routeStatus === 'real' ? getSuburbanStationsGeoJson(selectedSuburbanId).features.length : '—'
  const metroRouteFeatureCount = system === 'all'
    ? systems.reduce((total, item) => total + (metroCatalogById[item.id]?.routeGeometry.featureCount ?? 0), 0)
    : metroCatalogById[system]?.routeGeometry.featureCount ?? 0

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
            {systems.map((item) => {
              const count = metroCatalogById[item.id]?.stationCount
              const stationLabel = count?.operating !== null && count?.operating !== undefined
                ? `${count.operating} stations`
                : count?.publishedCount !== undefined
                  ? `${count.publishedCount} reported`
                  : 'station total n/a'
              return <button
                key={item.id}
                className={system === item.id ? 'active' : ''}
                onClick={() => onSystemChange(item.id)}
              >
                <i style={{ background: item.color }} />
                {item.name}
                <small>{stationLabel}</small>
              </button>
            })}
            <p className="route-warning">Other operator map catalogs · geometry not imported</p>
            {metroCatalog.filter((item) => !systems.some((systemItem) => systemItem.id === item.id)).map((item) => {
              const count = item.stationCount
              const stationLabel = count.operating !== null
                ? `${count.operating} stations`
                : count.publishedCount !== undefined ? `${count.publishedCount} reported` : 'station total n/a'
              return <button key={item.id} type="button" disabled title={`${item.name}: ${count.definition} Route geometry pending local review.`} aria-label={`${item.name}, ${stationLabel}, route geometry pending`}>
                <i style={{ background: '#9a8a72' }} />
                {item.name}
                <small>{stationLabel}</small>
              </button>
            })}
          </div>
          <div className="network-reference">
            <small>TRACK & STATION SOURCES</small>
            <p>
              Ten systems have bundled geometry: GTFS shapes for Bengaluru and Hyderabad; OSM subway-track ways for Delhi, Chennai, Kochi, Mumbai, Pune, Noida, Gurugram, and Navi Mumbai. OSM is physical mapped track, not an operator-certified service path; Mumbai's generic OSM Line 2 label does not distinguish Line 2A/2B. Station records are separate from operator totals: Kochi has 25 named-stop markers (24 source points plus one footprint centroid; homepage claim 26), Mumbai has 66 records/65 names with partial Line 2A/2B/3 coverage, and Pune has 30 records/29 names including Mandai and two Civil Court objects. No coordinate-connector routes are generated.
            </p>
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap / ODbL attribution ↗</a>
            <br />
            <a href="https://hmrl.co.in/open-data/" target="_blank" rel="noreferrer">HMRL GTFS terms and attribution ↗</a>
            <br />
            <a href="https://data.humdata.org/dataset/hotosm_ind_railways" target="_blank" rel="noreferrer">HOTOSM station snapshot · 10 May 2026 ↗</a>
          </div>
        </>
      )}

      {network === 'rail' && (
        <>
          <div className="panel-close">
            INDIAN RAILWAYS GIS ZONES <span>⌃</span>
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
                <small>{routeStatus === 'real' ? `${getNationalRailwaysTrackGeoJson(z.id).features.length} sections` : '—'}</small>
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
                        {railTrackCount} SECTIONS
                      </span>
                    </div>
                    <h3 style={{ fontSize: '14px' }}>{activeZone.name}</h3>
                    <div className="railway-live-metric" style={{ marginTop: '6px' }}>
                      <div>
                        <strong>{railTrackCount}</strong>
                        <span>TRACK SECTIONS</span>
                      </div>
                      <div>
                        <strong>{activeZone.code}</strong>
                        <span>ZONE</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '10px', color: '#786751', marginTop: '6px' }}>
                      Project railway GIS snapshot. Its upstream provider and capture date are not recorded in this repository.
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
            CITY RAIL TRACK CONTEXT <span>⌃</span>
          </div>
          <div className="system-filter atlas-systems" role="tablist" aria-label="Filter suburban division">
            <button
              className={selectedSuburbanId === 'all' ? 'active' : ''}
              onClick={() => onSuburbanDivisionChange?.('all')}
            >
              <i style={{ background: '#0284c7' }} />
              All focus areas
            </button>
            {SUBURBAN_DIVISIONS.map((d) => (
              <button
                key={d.id}
                className={selectedSuburbanId === d.id ? 'active' : ''}
                onClick={() => onSuburbanDivisionChange?.(d.id)}
              >
                <i style={{ background: d.color }} />
                {d.shortName}
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
                      OSM FOCUS AREA
                    </span>
                  </div>
                  <h3 style={{ fontSize: '14px' }}>{activeDivision.name}</h3>
                  <div className="railway-live-metric" style={{ marginTop: '6px' }}>
                    <div>
                      <strong>{cityTrackCount}</strong>
                      <span>TRACK FEATURES</span>
                    </div>
                    <div>
                      <strong>{cityStationCount}</strong>
                      <span>STATIONS</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '10px', color: '#786751', marginTop: '6px' }}>
                    Physical OpenStreetMap rail tracks clipped to this city focus area. Includes any mapped railway use; this is not a commuter-service-only route map.<br/>
                    Snapshot: <b>10 May 2026</b> · Source: HOTOSM / OpenStreetMap
                  </p>
                </div>
              )
            }
            return (
              <div className="railway-card" style={{ marginTop: '8px' }}>
                <div className="railway-header">
                  <span className="railway-badge" style={{ background: '#0284c7', color: '#fff' }}>CITY AREAS</span>
                  <span style={{ fontSize: '10px', color: '#6d2f2b', fontWeight: 600 }}>{SUBURBAN_DIVISIONS.length} FOCUS AREAS</span>
                </div>
                <h3 style={{ fontSize: '14px' }}>Urban rail infrastructure</h3>
                <div className="railway-live-metric" style={{ marginTop: '6px' }}>
                  <div>
                    <strong>{cityTrackCount}</strong>
                    <span>TRACK FEATURES</span>
                  </div>
                  <div>
                    <strong>{cityStationCount}</strong>
                    <span>STATIONS</span>
                  </div>
                </div>
                <p style={{ fontSize: '10px', color: '#786751', marginTop: '6px' }}>
                  Physical rail infrastructure in the selected city extents, not operator-defined commuter services. HOTOSM / OSM snapshot: 10 May 2026.
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
            NHSRCL’s technical-details page lists an MAHSR alignment KMZ, but this repository has not retrieved and verified that file. This mode intentionally draws no line until the source geometry is archived and checked.
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
              ? routeStatus === 'real' ? visibleStationsCount : '—'
              : network === 'rail'
                ? railJunctionCount
                : network === 'suburban'
                  ? cityStationCount
                  : '—'}
          </strong>
          <span>
            {network === 'metro'
              ? 'station markers in view'
              : network === 'rail'
                ? 'junctions in view'
                : network === 'suburban'
                  ? 'stations in focus area'
                  : 'stations'}
          </span>
        </div>
        <div>
          <strong>
            {network === 'metro'
              ? routeStatus === 'real' ? metroRouteFeatureCount : '—'
              : network === 'rail'
                ? railTrackCount
                : network === 'suburban'
                  ? cityTrackCount
                  : '1'}
          </strong>
          <span>
            {network === 'metro'
              ? 'route features bundled'
              : network === 'rail'
                ? 'track sections'
                : network === 'suburban'
                  ? 'track features'
                  : 'networks'}
          </span>
        </div>
      </div>

      {network === 'metro' && routeStatus === 'unavailable' && (
        <p className="route-warning">
          No verified route geometry is bundled for this selection yet. Straight connector lines are intentionally hidden.
        </p>
      )}

      {(network === 'rail' || network === 'suburban') && routeStatus === 'unavailable' && (
        <p className="route-warning">
          No route geometry loaded for this selection. The map does not draw connector-line fallbacks.
        </p>
      )}

      {network === 'nhsrcl' && (
        <p className="route-warning">
          The official MAHSR alignment KMZ is listed by NHSRCL but is not archived in this project snapshot; no guessed route is drawn.
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
