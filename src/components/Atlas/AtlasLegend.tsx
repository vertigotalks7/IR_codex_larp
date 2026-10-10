import type { NetworkMode } from '../../types'

interface AtlasLegendProps {
  network: NetworkMode
}

export function AtlasLegend({ network }: AtlasLegendProps) {
  return (
    <div className="atlas-legend">
      <strong>LEGEND</strong>
      {network === 'metro' ? (
        <>
          <span>
            <i className="legend-line metro" /> Metro lines
          </span>
          <span>
            <i className="legend-dot" /> Imported station
          </span>
          <small>© OpenStreetMap contributors · GTFS route geometry</small>
        </>
      ) : (
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
