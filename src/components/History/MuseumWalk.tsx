import { museumFilms, museumPhotos } from '../../data/museumCollection'

function Credit({ creator, sourceUrl, license, licenseUrl }: {
  creator: string
  sourceUrl: string
  license: string
  licenseUrl: string
}) {
  return <small className="museum-credit">
    Photo/video: <a href={sourceUrl} target="_blank" rel="noreferrer">{creator} · Wikimedia Commons</a>
    {' · '}<a href={licenseUrl} target="_blank" rel="noreferrer">{license}</a>
  </small>
}

export function MuseumWalk() {
  const featured = museumPhotos[2]

  return <section className="museum-walk" aria-labelledby="museum-title">
    <div className="museum-frontispiece">
      <div className="museum-frontispiece-copy">
        <p className="history-eyebrow">The rolling-stock gallery · 1853 to now</p>
        <h2 id="museum-title">A railway is more than a line on a map.</h2>
        <p>Walk from narrow-gauge steam to distributed-power trainsets. Every exhibit links to its source record; technical notes are separated from the photograph’s own description.</p>
        <a className="museum-index-link" href="#history-controls">Choose a railway collection <span aria-hidden="true">↓</span></a>
      </div>
      <figure className="museum-frontispiece-image">
        <img src={featured.image} alt={featured.alt} loading="eager" decoding="async" />
        <figcaption>
          <span>{featured.gallery}</span>
          <strong>{featured.title}</strong>
          <Credit creator={featured.creator} sourceUrl={featured.sourceUrl} license={featured.license} licenseUrl={featured.licenseUrl} />
        </figcaption>
      </figure>
      <div className="museum-number-stamp" aria-hidden="true">TTM<br />01</div>
    </div>

    <div className="museum-collection" id="museum-collection">
      <div className="museum-section-heading">
        <div><p className="history-eyebrow">The collection · open media</p><h3>Machines, mechanisms, and motion</h3></div>
        <span>Tap play to load each Commons film</span>
      </div>

      <div className="museum-photo-grid">
        {museumPhotos.map((photo) => <figure className="museum-object" key={photo.title}>
          <div className="museum-image-frame"><img src={photo.image} alt={photo.alt} loading="lazy" decoding="async" /></div>
          <figcaption>
            <span className="museum-object-index">{photo.gallery}</span>
            <h4>{photo.title}</h4>
            <p>{photo.caption} <a href={photo.sourceUrl} target="_blank" rel="noreferrer">Source record ↗</a></p>
            {photo.technicalNote && <p className="museum-technical-note">TECHNICAL NOTE · {photo.technicalNote}{photo.technicalSourceUrl && <> <a href={photo.technicalSourceUrl} target="_blank" rel="noreferrer">{photo.technicalSourceLabel} ↗</a></>}</p>}
            <Credit creator={photo.creator} sourceUrl={photo.sourceUrl} license={photo.license} licenseUrl={photo.licenseUrl} />
          </figcaption>
        </figure>)}
      </div>

      <div className="museum-film-grid">
        {museumFilms.map((film) => <figure className="museum-film" key={film.title}>
          <div className="museum-film-frame">
            <video controls preload="none" playsInline poster={film.poster} aria-label={film.title}>
              <source src={film.video} type="video/webm" />
              Your browser does not support embedded WebM video. <a href={film.sourceUrl}>Open this film on Wikimedia Commons.</a>
            </video>
          </div>
          <figcaption>
            <span className="museum-object-index">{film.gallery}</span>
            <h4>{film.title}</h4>
            <p>{film.caption} <a href={film.sourceUrl} target="_blank" rel="noreferrer">Source record ↗</a></p>
            <Credit creator={film.creator} sourceUrl={film.sourceUrl} license={film.license} licenseUrl={film.licenseUrl} />
          </figcaption>
        </figure>)}
      </div>
      <p className="museum-collection-note">Open-licensed media is served by Wikimedia Commons. Each file’s Commons page is the attribution record; confirm its license before reuse or redistribution.</p>
    </div>
  </section>
}
