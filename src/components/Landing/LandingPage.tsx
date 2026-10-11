interface LandingPageProps {
  onEnterAtlas: () => void
  onOpenHistory: () => void
}

export function LandingPage({ onEnterAtlas, onOpenHistory }: LandingPageProps) {
  return (
    <main className="landing-shell">
      <header className="landing-header">
        <button className="landing-mark" onClick={onEnterAtlas}>
          <span>↔</span>
          <strong>Transit Time Machine</strong>
        </button>
        <p>India’s railway atlas · built from verifiable public records</p>
      </header>

      <section className="landing-hero">
        <p className="landing-kicker">A living cartography of movement</p>
        <h1>
          Travel through India’s <em>railway history.</em>
        </h1>
        <p className="landing-intro">
          Explore metro growth today, then follow the expanding story of conventional rail and high-speed corridors as their source archives are verified and added.
        </p>
        <div className="landing-actions">
          <button className="landing-primary" onClick={onEnterAtlas}>
            Enter metro atlas <span>→</span>
          </button>
          <button className="landing-history-link" onClick={onOpenHistory}>Read the timeline ↗</button>
          <a href="#data-ledger">View data ledger ↓</a>
        </div>
      </section>

      <section className="landing-modes" aria-label="Atlas modes">
        <article>
          <span className="mode-number">01</span>
          <h2>City metros</h2>
          <p>Mapped track geometry for seven metro systems, combining GTFS route shapes and OpenStreetMap track ways.</p>
            <button onClick={onEnterAtlas}>Open atlas →</button>
        </article>
        <article>
          <span className="mode-number">02</span>
          <h2>Indian Railways</h2>
          <p>National physical-track GIS sections. The imported file’s provider and date are not recorded.</p>
          <small>Source provenance unresolved</small>
        </article>
        <article>
          <span className="mode-number">03</span>
          <h2>High-speed rail</h2>
          <p>NHSRCL lists an official MAHSR alignment KMZ, but the file has not been retrieved and verified locally.</p>
          <small>No guessed alignment is drawn</small>
        </article>
      </section>

      <section className="landing-ledger" id="data-ledger">
        <div>
          <p className="landing-kicker">Data ledger</p>
          <h2>Every layer shows its provenance.</h2>
        </div>
        <div className="ledger-grid">
          <p>
            <strong>7</strong>
            <span>metro systems with mapped route geometry</span>
          </p>
          <p>
            <strong>181</strong>
            <span>GTFS station records across three metro systems</span>
          </p>
          <p>
            <strong>12</strong>
            <span>city rail track focus areas in the atlas</span>
          </p>
        </div>
      </section>

      <section className="landing-map-shelf" aria-labelledby="source-maps-title">
        <div>
          <p className="landing-kicker">Source map shelf</p>
          <h2 id="source-maps-title">Rail references, kept separate from live layers.</h2>
          <p>References are linked separately from local geometry; missing lines are never reconstructed from station dots.</p>
        </div>
        <nav>
          <a href="https://surveyofindia.gov.in/pages/railway-map-of-india" target="_blank" rel="noreferrer">
            <span>01</span>
            <strong>Indian Railways</strong>
            <small>Survey of India national map ↗</small>
          </a>
          <a href="https://data.humdata.org/dataset/hotosm_ind_railways" target="_blank" rel="noreferrer">
            <span>02</span>
            <strong>Suburban rail</strong>
            <small>OSM physical tracks · snapshot 10 May 2026 ↗</small>
          </a>
          <a href="https://www.nhsrcl.in/en/project/technical_details" target="_blank" rel="noreferrer">
            <span>03</span>
            <strong>NHSRCL</strong>
            <small>Official MAHSR alignment KMZ page ↗</small>
          </a>
        </nav>
      </section>

      <footer className="landing-footer">
        <span>Transit Time Machine · India rail research project</span>
        <div>
          <button onClick={onOpenHistory}>History</button>
          <button onClick={onEnterAtlas}>Metro atlas</button>
        </div>
      </footer>
    </main>
  )
}
