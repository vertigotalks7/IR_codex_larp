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
            <i className="legend-line railway-corridor" /> National Rail Track Corridors
          </span>
          <span>
            <i className="legend-dot" /> Railway Junctions / Stations
          </span>
          <span>
            <i className="legend-dot train-dot" /> Live Train GPS Marker
          </span>
          <small>HDX hotosm_ind_railways · CRIS RBS network</small>
        </>
      )}

      {network !== 'metro' && network !== 'rail' && (
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
