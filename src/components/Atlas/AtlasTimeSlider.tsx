import { train17216 } from '../../data/indianRailways'
import { findStopForProgress } from '../../services/railwayService'
import { nationalCorridors } from '../../data/nationalRailways'
import type { NetworkModeConfig, NetworkMode } from '../../types'

interface AtlasTimeSliderProps {
  network: NetworkMode
  year: number
  onYearChange: (year: number) => void
  selectedNetwork: NetworkModeConfig
  selectedCorridorId?: string
  trainProgress?: number
  onTrainProgressChange?: (progress: number) => void
  isTrainRunning?: boolean
  onToggleTrainRunning?: () => void
}

export function AtlasTimeSlider({
  network,
  year,
  onYearChange,
  selectedNetwork,
  selectedCorridorId = 'all',
  trainProgress = 0.58,
  onTrainProgressChange,
  isTrainRunning,
  onToggleTrainRunning,
}: AtlasTimeSliderProps) {
  if (network === 'rail') {
    const isRayalaseema = selectedCorridorId === 'all' || selectedCorridorId === 'rayalaseema-scr-dmm-mtm'

    if (isRayalaseema) {
      const currentKm = Math.round(trainProgress * train17216.distanceKm)
      const { previousStop, nextStop } = findStopForProgress(trainProgress)

      return (
        <div className="map-time-control atlas-time">
          <div className="time-control-heading">
            <span>17216 DMM MTM EXP · RADAR</span>
            <strong>{currentKm} km</strong>
          </div>
          <input
            aria-label="Train route progress"
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={trainProgress}
            onChange={(event) => onTrainProgressChange?.(Number(event.target.value))}
          />
          <div className="time-ticks">
            <span>DMM (0 km)</span>
            <span>
              {nextStop
                ? `Between ${previousStop.code} & ${nextStop.code}`
                : 'Arrived at MTM'}
            </span>
            <span>MTM (694 km)</span>
          </div>
          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '10px',
            }}
          >
            <button
              onClick={onToggleTrainRunning}
              style={{
                border: '1px solid #94836b',
                background: '#6d2f2b',
                color: '#fbfaf6',
                padding: '2px 8px',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              {isTrainRunning ? 'Ⅱ Pause' : '▶ Live Motion'}
            </button>
            <a
              href="https://data.humdata.org/dataset/hotosm_ind_railways"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#6d2f2b', textDecoration: 'none' }}
            >
              HDX / OSM Railway Data ↗
            </a>
          </div>
        </div>
      )
    }

    const corridor = nationalCorridors.find((c) => c.id === selectedCorridorId)
    return (
      <div className="map-time-control atlas-time reference-card">
        <span>GIS TRACK CORRIDOR</span>
        <strong>{corridor?.name ?? 'Indian Railways'}</strong>
        <p style={{ margin: '4px 0', fontSize: '11px', color: '#5a4938' }}>
          {corridor?.origin} → {corridor?.destination} · {corridor?.distanceKm} km
        </p>
        <a
          href="https://data.humdata.org/dataset/hotosm_ind_railways"
          target="_blank"
          rel="noreferrer"
        >
          HDX OpenStreetMap Railway Export ↗
        </a>
      </div>
    )
  }

  if (network !== 'metro') {
    return (
      <div className="map-time-control atlas-time reference-card">
        <span>REFERENCE MODE</span>
        <strong>{selectedNetwork.name}</strong>
        <a href={selectedNetwork.source} target="_blank" rel="noreferrer">
          {selectedNetwork.sourceLabel} ↗
        </a>
      </div>
    )
  }

  return (
    <div className="map-time-control atlas-time">
      <div className="time-control-heading">
        <span>Network growth</span>
        <strong>{year}</strong>
      </div>
      <input
        aria-label="Historical year"
        type="range"
        min="2002"
        max="2024"
        step="1"
        value={year}
        onChange={(event) => onYearChange(Number(event.target.value))}
      />
      <div className="time-ticks">
        <span>2002</span>
        <span>2010</span>
        <span>2017</span>
        <span>2024</span>
      </div>
    </div>
  )
}
