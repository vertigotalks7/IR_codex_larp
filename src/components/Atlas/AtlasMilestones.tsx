import { milestones } from '../../data'
import type { MetroSystemId } from '../../types'

interface AtlasMilestonesProps {
  year: number
  playing: boolean
  system: MetroSystemId | 'all'
  onSelectMilestone: (year: number, coordinates: [number, number]) => void
  onTogglePlay: () => void
}

export function AtlasMilestones({
  year,
  playing,
  onSelectMilestone,
  onTogglePlay,
}: AtlasMilestonesProps) {
  return (
    <div className="atlas-milestones">
      <div className="milestone-strip-head">
        <span>HISTORICAL THREAD</span>
        <button onClick={onTogglePlay}>
          {playing ? 'Ⅱ Pause' : '▶ Play'}
        </button>
      </div>
      <div className="milestone-strip">
        {milestones.map((milestone) => (
          <button
            key={milestone.year}
            className={year === milestone.year ? 'active' : ''}
            onClick={() => onSelectMilestone(milestone.year, milestone.coordinates)}
          >
            <b>{milestone.year}</b>
            <span>{milestone.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
