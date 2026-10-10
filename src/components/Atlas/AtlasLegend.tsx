import type { NetworkMode } from '../../types'

interface AtlasLegendProps {
  network: NetworkMode
}

export function AtlasLegend({ network }: AtlasLegendProps) {
  return (
    <div className="atlas-legend">
      <strong>LEGEND</strong>
      {network === 'metro' && (
        <>
          <span>
            <i className="legend-line metro" /> Metro lines
          </span>
          <span>
            <i className="legend-dot" /> Imported station
          </span>
          <small>© OpenStreetMap contributors · GTFS route geometry</small>
        </>
      )}

      {network === 'rail' && (
        <>
          <span>
            <i className="legend-line railway-corridor" /> Official IR GIS Track Network
          </span>
          <span>
            <i className="legend-dot" /> 2,033 Junction Stations
          </span>
          <small>Official Indian Railways GIS (Railway_Network_.geojson)</small>
        </>
      )}

      {network === 'suburban' && (
        <>
          <span>
            <i className="legend-line" style={{ background: '#0284c7' }} /> Suburban Rail Corridors
          </span>
          <span>
            <i className="legend-dot" style={{ background: '#0284c7', borderColor: '#0369a1' }} /> 572 Commuter Stations
          </span>
          <small>DataMeet Railways & Official IR GIS Alignment</small>
        </>
      )}

      {network !== 'metro' && network !== 'rail' && network !== 'suburban' && (
        <>
          <span>
            <i className="legend-line rail" /> Reference-map mode
          </span>
          <small>Interactive geometry is added only after source review.</small>
        </>
      )}
    </div>
  )
}
