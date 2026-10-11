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
          <span><i className="legend-line railway-corridor" /> Indian Railways track geometry</span>
          <span><i className="legend-dot" /> Junction points</span>
          <small>Project GIS snapshot; original provider and capture date are not recorded.</small>
        </>
      )}

      {network === 'suburban' && (
        <>
          <span><i className="legend-line" style={{ background: '#0284c7' }} /> Physical rail tracks</span>
          <span><i className="legend-dot" style={{ background: '#0284c7', borderColor: '#0369a1' }} /> Railway stations</span>
          <small>OSM / HOTOSM snapshot (10 May 2026); not commuter-service-only.</small>
        </>
      )}

      {network !== 'metro' && network !== 'rail' && network !== 'suburban' && (
        <>
          <span><i className="legend-line rail" /> No NHSRCL line loaded</span>
          <small>Official alignment geometry is not bundled; no guessed line is drawn.</small>
        </>
      )}
    </div>
  )
}
