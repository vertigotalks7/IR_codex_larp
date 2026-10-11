import { useMemo, useState } from 'react'
import { historyEvents } from '../../data/history'

interface HistoryPageProps {
  onOpenAtlas: () => void
  onGoLanding: () => void
}

export function HistoryPage({ onOpenAtlas, onGoLanding }: HistoryPageProps) {
  const [year, setYear] = useState(2026)
  const visibleEvents = useMemo(() => historyEvents.filter((event) => event.year <= year), [year])

  return (
    <main className="history-shell">
      <header className="landing-header">
        <button className="landing-mark" onClick={onGoLanding}>
          <span>↔</span>
          <strong>Transit Time Machine</strong>
        </button>
        <nav className="history-nav" aria-label="History navigation">
          <button onClick={onGoLanding}>Project home</button>
          <button className="history-nav-primary" onClick={onOpenAtlas}>Open atlas →</button>
        </nav>
      </header>

      <section className="history-hero">
        <p className="landing-kicker">Source-linked chronology</p>
        <h1>Railways change over <em>time.</em></h1>
        <p>
          A compact register of documented metro openings and recent network changes. Use the year slider to read the timeline as it stood by that year.
        </p>
        <label className="history-year-control">
          <span><b>Through {year}</b><small>2002 — 2026</small></span>
          <input
            aria-label="Show history through year"
            type="range"
            min="2002"
            max="2026"
            step="1"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
          />
        </label>
      </section>

      <p className="history-limit-note">
        This is an event timeline, not a historical route reconstruction. The atlas map shows the bundled present-day geometry; it does not redraw lines as they existed in each year.
      </p>

      <ol className="history-events">
        {visibleEvents.map((event, index) => (
          <li key={`${event.year}-${event.title}`}>
            <span className="history-event-index">{String(index + 1).padStart(2, '0')}</span>
            <time>{event.year}</time>
            <div>
              <h2>{event.title}</h2>
              <p>{event.detail}</p>
              <a href={event.source} target="_blank" rel="noreferrer">{event.sourceLabel} ↗</a>
            </div>
          </li>
        ))}
      </ol>

      {visibleEvents.length === 0 && (
        <p className="history-empty">No documented events are listed before {year} in this project yet.</p>
      )}

      <footer className="landing-footer history-footer">
        <span>Transit Time Machine · historical source register</span>
        <button onClick={onOpenAtlas}>Return to atlas</button>
      </footer>
    </main>
  )
}
