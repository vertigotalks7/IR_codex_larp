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
            <i className="legend-line railway-corridor" /> 17216 Express Route
          </span>
          <span>
            <i className="legend-dot" /> Railway Station (22 Stops)
          </span>
          <span>
            <i className="legend-dot train-dot" /> Train Radar Marker
          </span>
          <small>South Central Railway · RailRadar corridor</small>
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
