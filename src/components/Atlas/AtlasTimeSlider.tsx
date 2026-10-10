import type { NetworkModeConfig, NetworkMode } from '../../types'

interface AtlasTimeSliderProps {
  network: NetworkMode
  year: number
  onYearChange: (year: number) => void
  selectedNetwork: NetworkModeConfig
}

export function AtlasTimeSlider({
  network,
  year,
  onYearChange,
  selectedNetwork,
}: AtlasTimeSliderProps) {
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
