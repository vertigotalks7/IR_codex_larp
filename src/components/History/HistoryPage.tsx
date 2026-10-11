import { useEffect, useMemo, useState } from 'react'
import { systems } from '../../data'
import { historyEvents } from '../../data/history'
import { loadBundledMetroStationPoints, metroCatalog } from '../../data/metroCatalog'
import type { MappedMetroStationPoint } from '../../data/metroCatalog'
import { nationalCorridors, nationalJunctions } from '../../data/nationalRailways'
import type { RailwayJunction } from '../../data/nationalRailways'
import { RAILWAY_ADMIN_SOURCE, RAILWAY_BASE_ROSTER_SOURCE, RAILWAY_DIVISION_REORGANIZATION_SOURCE, RAILWAY_HISTORY_ZONES, RAILWAY_OPERATING_DIVISION_COUNT, RAILWAY_OPERATING_ZONE_COUNT, SOUTH_COAST_EFFECTIVE_SOURCE } from '../../data/railwayDivisions'
import { findDivisionDossier, railwayDivisionDossiers } from '../../data/railwayDivisionStories'
import { SUBURBAN_DIVISIONS } from '../../data/suburbanDivisions'
import { preloadSuburbanData } from '../../services/railwayService'
import { MuseumWalk } from './MuseumWalk'
import './history.css'
import './history-enhancements.css'

interface HistoryPageProps { onOpenAtlas: () => void; onGoLanding: () => void }
type Mode = 'metro' | 'suburban' | 'rail' | 'highSpeed'
type Card = { value: string; label: string; note: string }
const labels: Record<Mode, string> = { metro: 'Metro', suburban: 'Suburban rail', rail: 'Indian Railways', highSpeed: 'High-speed rail' }

function CardView({ card }: { card: Card }) {
  return <article className="history-detail-card"><strong>{card.value}</strong><span>{card.label}</span><small>{card.note}</small></article>
}

function DivisionSamplePlot({ points }: { points: readonly RailwayJunction[] }) {
  if (!points.length) return <p className="history-detail-note">No geolocated junction samples are indexed for this selection.</p>
  const width = 620
  const height = 220
  const padding = { x: 38, y: 22 }
  const longitudes = points.map((point) => point.coordinates[0])
  const latitudes = points.map((point) => point.coordinates[1])
  const minLon = Math.min(...longitudes)
  const maxLon = Math.max(...longitudes)
  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const x = (lon: number) => padding.x + ((lon - minLon) / (maxLon - minLon || 1)) * (width - padding.x * 2)
  const y = (lat: number) => height - padding.y - ((lat - minLat) / (maxLat - minLat || 1)) * (height - padding.y * 2)
  const namedPoints = points.slice(0, 8)
  return <div className="division-plot-wrap">
    <svg className="division-sample-plot" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Longitude and latitude plot of ${points.length} railway junction sample points`}>
      {[0, 1, 2, 3].map((tick) => {
        const py = padding.y + tick * ((height - padding.y * 2) / 3)
        const px = padding.x + tick * ((width - padding.x * 2) / 3)
        return <g key={tick}>
          <line x1={padding.x} y1={py} x2={width - padding.x} y2={py} />
          <line x1={px} y1={padding.y} x2={px} y2={height - padding.y} />
        </g>
      })}
      <text x={padding.x} y={height - 3}>{minLon.toFixed(2)}° E</text>
      <text x={width - padding.x} y={height - 3} textAnchor="end">{maxLon.toFixed(2)}° E</text>
      <text x={4} y={padding.y + 4}>{maxLat.toFixed(2)}° N</text>
      <text x={4} y={height - padding.y}>{minLat.toFixed(2)}° N</text>
      {points.map((point) => <circle key={point.code} cx={x(point.coordinates[0])} cy={y(point.coordinates[1])} r="4">
        <title>{point.name} · {point.state}</title>
      </circle>)}
      {namedPoints.map((point, index) => <text key={point.code} className="division-plot-label" x={x(point.coordinates[0]) + (index % 2 ? 7 : -7)} y={y(point.coordinates[1]) - 7} textAnchor={index % 2 ? 'start' : 'end'}>{point.name}</text>)}
    </svg>
    <p>Longitude/latitude positions from the project’s local junction sample—not an official division boundary, station inventory, or train route. <a href="https://github.com/vertigotalks7/IR_codex_larp/blob/master/DATA_SOURCES.md#indian-railways-national-track-layer" target="_blank" rel="noreferrer">GIS provenance and limitations ↗</a></p>
  </div>
}

function DivisionArchive({ zoneCode, division, junctions }: { zoneCode: string; division: string; junctions: readonly RailwayJunction[] }) {
  const dossier = findDivisionDossier(zoneCode, division)
  if (!dossier) return <section className="division-archive division-archive-pending">
    <div className="division-archive-head"><span>DIVISION CASE FILE · RESEARCH STATUS</span><strong>{division} Division</strong></div>
    <p>This division is present in the official roster and local junction sample, but this project does not yet have a division-specific historical narrative with a reviewed primary source. No formation year, boundary, or operating statistics are inferred here.</p>
    <a href={RAILWAY_BASE_ROSTER_SOURCE.url} target="_blank" rel="noreferrer">Railway Board zone/division roster ↗</a>
    <DivisionSamplePlot points={junctions} />
  </section>

  return <section className="division-archive">
    <div className="division-archive-head"><span>DIVISION CASE FILE · {dossier.zoneCode}</span><strong>{dossier.division} Division</strong></div>
    <p className="division-archive-thesis">{dossier.thesis}</p>
    <div className="division-archive-location"><span>GEOGRAPHIC LENS</span><strong>{dossier.location}</strong><a href={dossier.references[0]?.url} target="_blank" rel="noreferrer">Open official location/history source ↗</a></div>
    <div className="division-story-grid">{dossier.milestones.map((milestone, index) => <article key={`${milestone.year ?? 'map'}-${milestone.title}`}>
      <span>{milestone.year ?? `MAP NOTE ${String(index + 1).padStart(2, '0')}`}</span>
      <h4>{milestone.title}</h4>
      <p>{milestone.detail}</p>
      <a href={milestone.sourceUrl} target="_blank" rel="noreferrer">{milestone.sourceLabel} ↗</a>
    </article>)}</div>
    <DivisionSamplePlot points={junctions} />
    <p className="division-source-caveat">{dossier.sourceNote}</p>
    <div className="division-source-shelf">{dossier.references.map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer">{reference.label} ↗</a>)}</div>
  </section>
}

const metroSearchTerms: Record<string, string[]> = {
  delhi: ['delhi'], bengaluru: ['bengaluru', 'namma'], chennai: ['chennai'], hyderabad: ['hyderabad'],
  kochi: ['kochi'], mumbai: ['mumbai'], pune: ['pune'], noida: ['noida', 'aqua line'],
  'gurugram-rapid': ['gurugram', 'rapid metro'], 'navi-mumbai': ['navi mumbai'], meerut: ['meerut'],
  'ahmedabad-gandhinagar': ['ahmedabad', 'gandhinagar'], nagpur: ['nagpur'], lucknow: ['lucknow'],
  kanpur: ['kanpur'], agra: ['agra'], kolkata: ['kolkata'], jaipur: ['jaipur'], bhopal: ['bhopal'],
  indore: ['indore'], patna: ['patna'],
}

function metroEventsFor(systemId: string) {
  const terms = metroSearchTerms[systemId] ?? []
  return historyEvents.filter((event) => terms.some((term) => `${event.title} ${event.detail}`.toLowerCase().includes(term)))
}

function MetroDashboard({ systemId }: { systemId: string }) {
  const catalog = metroCatalog.find((item) => item.id === systemId) ?? metroCatalog[0]
  const system = systems.find((item) => item.id === systemId)
  const events = metroEventsFor(systemId)
  const [mappedPoints, setMappedPoints] = useState<readonly MappedMetroStationPoint[]>([])
  const [pointsError, setPointsError] = useState(false)
  useEffect(() => {
    let active = true
    setMappedPoints([])
    setPointsError(false)
    loadBundledMetroStationPoints().then((points) => {
      if (active) setMappedPoints(points.filter((point) => point.systemId === systemId))
    }).catch(() => { if (active) setPointsError(true) })
    return () => { active = false }
  }, [systemId])
  const stationCount = catalog.stationCount.operating === null
    ? catalog.stationCount.publishedCount === undefined ? 'Not published' : String(catalog.stationCount.publishedCount)
    : String(catalog.stationCount.operating)
  const stationLabel = catalog.stationCount.operating === null
    ? catalog.stationCount.publishedCountLabel ?? 'unique operating total'
    : 'operator-reported operating stations'
  const pointCoverage = catalog.stationPoints
  const routeCoverage = catalog.routeGeometry
  const distinctMappedNames = new Set(mappedPoints.map((point) => point.name)).size
  const cards: Card[] = [
    { value: stationCount, label: stationLabel, note: catalog.stationCount.definition },
    { value: routeCoverage.featureCount === undefined ? 'Pending' : String(routeCoverage.featureCount), label: 'stored route features', note: routeCoverage.note },
    { value: `${distinctMappedNames || '—'} / ${pointCoverage.pointCount}`, label: 'distinct mapped names / source points', note: pointCoverage.note },
    { value: String(events.length), label: 'indexed history events', note: 'Source-linked milestones currently in this project' },
  ]
  const pointGroups = new Map<string, MappedMetroStationPoint[]>()
  for (const point of mappedPoints) {
    const label = point.lineIds.length ? point.lineIds.join(' · ') : 'Line not tagged in source'
    pointGroups.set(label, [...(pointGroups.get(label) ?? []), point])
  }
  return <>
    <div className="history-detail-heading"><span className="history-mode-chip">{routeCoverage.status === 'bundled' ? 'Route bundle available' : 'Official map · geometry pending'}</span><h2>{catalog.name}</h2><p>{catalog.cityRegion} · {catalog.operator}. This is a current-data/source dashboard, not a reconstruction of past alignments.</p></div>
    <div className="history-detail-cards">{cards.map((card) => <CardView card={card} key={card.label} />)}</div>
    <div className="history-detail-columns">
      <section><h3>{routeCoverage.status === 'bundled' ? 'Map groups in bundle' : 'Map import status'}</h3>
        {routeCoverage.groupLabels?.length
          ? <ul className="history-chip-list">{routeCoverage.groupLabels.map((line) => <li key={line}>{line}</li>)}</ul>
          : <p>No reviewed geographic route features are bundled yet. The official map link remains available below; no station-to-station fallback is drawn.</p>}
        <p className="history-detail-note">Labels come from mapped geometry or the imported feed. They are not a complete official service-line inventory.</p>
      </section>
      <section><h3>Source ledger</h3><a href={catalog.officialMap.url} target="_blank" rel="noreferrer">{catalog.officialMap.label} ↗</a>
        {routeCoverage.source && <a href={routeCoverage.source.url} target="_blank" rel="noreferrer">{routeCoverage.source.label} · {routeCoverage.source.asOf} ↗</a>}
        {pointCoverage.source && <a href={pointCoverage.source.url} target="_blank" rel="noreferrer">{pointCoverage.source.label} · {pointCoverage.source.asOf} ↗</a>}
        <p className="history-detail-note">{system ? `${system.opened} first opening is the system’s indexed start year.` : 'No local map layer is enabled for this system yet.'} Station-point records and operator station totals are separate measures.</p>
      </section>
    </div>
    {catalog.corridors?.length ? <section className="history-corridor-ledger"><div className="history-records-heading"><h3>Corridor station counts</h3><span>Do not sum: interchange names may overlap</span></div><div className="history-corridor-grid">{catalog.corridors.map((corridor) => {
      const linePoints = mappedPoints.filter((point) => point.lineIds.includes(corridor.name)).length
      return <article key={corridor.name}><span>{corridor.name}</span><strong>{corridor.operatingStations}<small> / {corridor.totalStations}</small></strong><p>{corridor.note}</p><small>{linePoints} matched map-point records in this bundle</small><a href={corridor.source.url} target="_blank" rel="noreferrer">{corridor.source.label} · {corridor.source.asOf} ↗</a></article>
    })}</div></section> : null}
    <details className="history-station-register"><summary>Open station-point ledger <span>{pointsError ? 'source unavailable' : `${mappedPoints.length} imported points`}</span></summary>
      {mappedPoints.length ? [...pointGroups.entries()].map(([line, points]) => <section key={line}><h3>{line} <small>{points.length} source records</small></h3><ul>{points.map((point) => <li key={point.id}><a href={point.provenance.url} target="_blank" rel="noreferrer">{point.name} ↗</a></li>)}</ul></section>) : <p>{pointsError ? 'Station point data could not be loaded.' : 'No source-backed station point roster is bundled for this system yet.'}</p>}
    </details>
  </>
}

function RailDashboard({ zoneId, divisionId }: { zoneId: string; divisionId: string }) {
  const zone = RAILWAY_HISTORY_ZONES.find((item) => item.id === zoneId)
  const selectedDivision = divisionId === 'all'
    ? null
    : RAILWAY_HISTORY_ZONES.flatMap((item) => item.divisions.map((name) => ({ zone: item, name, id: `${item.code}:${name}` })))
      .find((item) => item.id === divisionId) ?? null
  const dossier = selectedDivision
    ? findDivisionDossier(selectedDivision.zone.code, selectedDivision.name)
    : null
  const localDivisionAliases: Record<string, string[]> = {
    Mumbai: ['Mumbai CR', 'Mumbai WR'],
    Ferozpur: ['Firozpur'],
    Prayagraj: ['Allahabad'],
    Bengaluru: ['Bangalore'],
    Hubballi: ['Hubli'],
    Mysuru: ['Mysore'],
    Tiruchchirappalli: ['Tiruchirappalli', 'Trichy'],
    Thiruvananthapuram: ['Thiruvananthpuram', 'Trivandrum'],
    'Pt. Deen Dayal Upadhyaya': ['Deen Dayal Upadhyaya'],
    Visakhapatnam: ['Waltair'],
  }
  const localNameMatches = (officialName: string | undefined, localName: string) => {
    if (!officialName) return true
    return officialName === localName || (localDivisionAliases[officialName] ?? []).includes(localName)
  }
  const junctions = nationalJunctions.filter((item) => {
    const zoneCodes = item.zone.split('/').map((code) => code.trim())
    const zoneMatches = selectedDivision
      ? zoneCodes.includes(selectedDivision.zone.code)
      : zoneId === 'all' || zoneCodes.includes(zoneId)
    return zoneMatches && localNameMatches(selectedDivision?.name, item.division)
  })
  const corridorIds = [...new Set(junctions.flatMap((item) => item.corridors))]
  const states = [...new Set(junctions.map((item) => item.state))]
  const divisionCount = zone?.divisions.length ?? RAILWAY_OPERATING_DIVISION_COUNT
  const rosterSource = (selectedDivision?.zone.id ?? zone?.id) === 'SCoR'
    ? SOUTH_COAST_EFFECTIVE_SOURCE
    : RAILWAY_BASE_ROSTER_SOURCE
  const cards: Card[] = [
    { value: String(selectedDivision ? 1 : divisionCount), label: selectedDivision ? 'selected division' : 'official operating divisions', note: selectedDivision ? `${selectedDivision.zone.name} administrative division` : `${zone?.name ?? 'All railway zones'} · ${zone ? 'current roster' : `${RAILWAY_OPERATING_DIVISION_COUNT} divisions across ${RAILWAY_OPERATING_ZONE_COUNT} operating zones`}` },
    { value: String(junctions.length), label: 'indexed junction records', note: 'Local sample only; not all division stations' },
    { value: String(corridorIds.length), label: 'linked corridor references', note: 'Project records connected to the matched junction sample' },
    { value: String(states.length), label: 'states represented', note: states.length ? states.join(', ') : 'No matching local junction record' },
  ]
  const listedDivisions = zone ? zone.divisions : RAILWAY_HISTORY_ZONES.flatMap((item) => item.divisions)
  return <>
    <div className="history-detail-heading"><span className="history-mode-chip">{selectedDivision ? `Division case file · ${dossier ? 'sourced' : 'research pending'}` : 'Zone overview'}</span><h2>{selectedDivision ? `${selectedDivision.name} Division` : zone?.name ?? 'Indian Railways'}</h2><p>{selectedDivision ? `${selectedDivision.zone.name} · ${dossier ? 'a source-linked local history follows' : 'this division has no reviewed local history dossier yet'}.` : 'Choose a division to inspect its local junction references and coverage.'} The administrative roster is official; local route and junction samples are incomplete and are not division-wide operating statistics.</p></div>
    <div className="history-detail-cards">{cards.map((card) => <CardView card={card} key={card.label} />)}</div>
    <section className="history-division-summary"><div><span>ADMINISTRATIVE ROSTER</span><strong>{selectedDivision?.zone.name ?? zone?.name ?? `${RAILWAY_HISTORY_ZONES.length} railway organizations`}</strong><small>{selectedDivision?.zone.headquarters ?? zone?.headquarters ?? 'Includes Metro Railway, Kolkata'}</small></div><div><span>ZONE CREATED</span><strong>{selectedDivision?.zone.formedYear ?? zone?.formedYear ?? 'Roster varies'}</strong><small>{selectedDivision ? <>Parent-zone date only · not this division’s founding date · <a href={rosterSource.url} target="_blank" rel="noreferrer">roster source ↗</a></> : zone ? <>Railway Board roster date · <a href={rosterSource.url} target="_blank" rel="noreferrer">source ↗</a></> : 'Not a single formation date for all railways'}</small></div><div><span>DIVISION HISTORY FILES</span><strong>{selectedDivision ? dossier ? `${dossier.milestones.length} records` : 'Not researched' : `${railwayDivisionDossiers.length} / ${RAILWAY_OPERATING_DIVISION_COUNT}`}</strong><small>{selectedDivision ? dossier ? 'Dated milestones and map notes; each is cited' : 'No date or story inferred from the zone roster' : 'Curated primary-source dossiers; remaining divisions are explicitly unresearched'}</small></div></section>
    {selectedDivision && <DivisionArchive zoneCode={selectedDivision.zone.code} division={selectedDivision.name} junctions={junctions} />}
    <div className="history-division-records"><div className="history-records-heading"><h3>Division junction ledger</h3><span>{junctions.length} local records</span></div>
      {junctions.length ? <div className="history-junction-grid">{junctions.map((junction) => {
        const linked = junction.corridors.map((id) => nationalCorridors.find((corridor) => corridor.id === id)?.shortName ?? id)
        return <article key={junction.code}><span>{junction.code} · {junction.state}</span><strong>{junction.name}</strong><small>{junction.platforms} platforms in local reference record</small><p>{linked.length ? linked.join(' · ') : 'No corridor link recorded'}</p></article>
      })}</div> : <p className="history-detail-note">No junction/division records are currently indexed for this zone in the project.</p>}
    </div>
    {!selectedDivision && <section className="history-division-directory"><h3>{zone ? `${zone.name} divisions` : 'All operating divisions'}</h3><div>{listedDivisions.map((name) => {
      const owner = zone ?? RAILWAY_HISTORY_ZONES.find((candidate) => candidate.divisions.includes(name))
      const value = `${owner?.code ?? 'IR'}:${name}`
      return <span key={value}>{name}</span>
    })}</div></section>}
    <div className="history-detail-columns"><section><h3>Read the numbers carefully</h3><p>Official zone/division names and zone creation years start from the Railway Board roster, with the South Coast/East Coast/South Central changes applied from the 2025–26 Ministry records. Junction, platform and corridor cards describe only this project's local sample; they are not total division stations, routes, track-kilometres, or services.</p></section><section><h3>Reference sources</h3><a href={RAILWAY_ADMIN_SOURCE.url} target="_blank" rel="noreferrer">{RAILWAY_ADMIN_SOURCE.label} · {RAILWAY_ADMIN_SOURCE.asOf} ↗</a><a href={RAILWAY_BASE_ROSTER_SOURCE.url} target="_blank" rel="noreferrer">{RAILWAY_BASE_ROSTER_SOURCE.label} · {RAILWAY_BASE_ROSTER_SOURCE.asOf} ↗</a><a href={SOUTH_COAST_EFFECTIVE_SOURCE.url} target="_blank" rel="noreferrer">{SOUTH_COAST_EFFECTIVE_SOURCE.label} · {SOUTH_COAST_EFFECTIVE_SOURCE.asOf} ↗</a><a href={RAILWAY_DIVISION_REORGANIZATION_SOURCE.url} target="_blank" rel="noreferrer">{RAILWAY_DIVISION_REORGANIZATION_SOURCE.label} · {RAILWAY_DIVISION_REORGANIZATION_SOURCE.asOf} ↗</a><p className="history-detail-note">The separate national GIS route bundle has unresolved upstream provenance and is not used to claim official division statistics.</p></section></div>
  </>
}

function SuburbanDashboard({ areaId }: { areaId: string }) {
  const area = SUBURBAN_DIVISIONS.find((item) => item.id === areaId) ?? SUBURBAN_DIVISIONS[0]
  const [result, setResult] = useState<{ tracks: number; stations: number } | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let active = true
    setResult(null)
    setError(false)
    preloadSuburbanData(area.id).then((data) => {
      if (active) setResult({ tracks: data.routes.features.length, stations: data.stations.features.length })
    }).catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [area.id])
  const dimensions = `${(area.bounds.maxLon - area.bounds.minLon).toFixed(2)}° × ${(area.bounds.maxLat - area.bounds.minLat).toFixed(2)}°`
  const cards: Card[] = [
    { value: result ? result.tracks.toLocaleString() : error ? 'Unavailable' : 'Loading…', label: 'OSM track features', note: 'Features clipped to the selected city focus window' },
    { value: result ? result.stations.toLocaleString() : error ? 'Unavailable' : 'Loading…', label: 'OSM station points', note: 'Includes mapped railway infrastructure; not a commuter station roster' },
    { value: dimensions, label: 'focus window', note: 'Longitude × latitude extent, not an operator boundary' },
    { value: '10 May 2026', label: 'source snapshot', note: 'HOTOSM India railways / OpenStreetMap' },
  ]
  return <>
    <div className="history-detail-heading"><span className="history-mode-chip">City track focus</span><h2>{area.shortName} urban rail</h2><p>{area.name}. The selector shows physical railway infrastructure clipped to a city area, not an official suburban-service boundary or operator route map.</p></div>
    <div className="history-detail-cards">{cards.map((card) => <CardView card={card} key={card.label} />)}</div>
    <div className="history-detail-columns"><section><h3>What is represented</h3><p>Mapped track and point features in a fixed geographic window. It can include suburban, intercity, freight, metro-adjacent, and other railway infrastructure where present in the source snapshot.</p></section><section><h3>Source and limitation</h3><a href="https://data.humdata.org/dataset/hotosm_ind_railways" target="_blank" rel="noreferrer">HOTOSM India railways dataset ↗</a><p className="history-detail-note">These counts describe the imported GIS bundle, not current trains, service frequency, station totals, or system ridership.</p></section></div>
  </>
}

function HighSpeedDashboard() {
  return <>
    <div className="history-detail-heading"><span className="history-mode-chip">High-speed project</span><h2>Mumbai–Ahmedabad High Speed Rail</h2><p>The official project record is linked below. A locally verified alignment and dated opening dataset have not been added to this atlas.</p></div>
    <div className="history-detail-cards"><CardView card={{ value: 'MAHSR', label: 'project reference', note: 'Mumbai–Ahmedabad High Speed Rail' }} /><CardView card={{ value: 'KMZ', label: 'official alignment format', note: 'Listed by NHSRCL, not locally imported' }} /><CardView card={{ value: '—', label: 'map geometry', note: 'No guessed alignment is drawn' }} /><CardView card={{ value: '—', label: 'service history', note: 'No opening record; project is not treated as operating' }} /></div>
    <div className="history-detail-columns"><section><h3>Provenance first</h3><p>Until the official alignment file is retrieved, reviewed and versioned locally, high-speed rail remains separate from the drawn layers.</p></section><section><h3>Official reference</h3><a href="https://www.nhsrcl.in/en/project/technical_details" target="_blank" rel="noreferrer">NHSRCL technical details ↗</a></section></div>
  </>
}

function matchesEvent(mode: Mode, region: string, title: string, detail: string) {
  if (mode !== 'metro') return false
  const terms = metroSearchTerms[region] ?? []
  const copy = `${title} ${detail}`.toLowerCase()
  return terms.some((term) => copy.includes(term))
}

export function HistoryPage({ onOpenAtlas, onGoLanding }: HistoryPageProps) {
  const [mode, setMode] = useState<Mode>('metro')
  const [region, setRegion] = useState('delhi')
  const [division, setDivision] = useState('all')
  const [year, setYear] = useState(2026)
  const regions = useMemo(() => {
    if (mode === 'metro') return metroCatalog.map((item) => ({ value: item.id, label: `${item.name} · ${item.cityRegion}${item.routeGeometry.status === 'pending-import' ? ' · map pending' : ''}` }))
    if (mode === 'rail') return [{ value: 'all', label: 'All Indian Railways' }, ...RAILWAY_HISTORY_ZONES.map((item) => ({ value: item.id, label: item.name }))]
    if (mode === 'suburban') return SUBURBAN_DIVISIONS.map((item) => ({ value: item.id, label: item.name }))
    return [{ value: 'mahsr', label: 'Mumbai–Ahmedabad High Speed Rail' }]
  }, [mode])
  const availableDivisions = useMemo(() => {
    const zones = region === 'all'
      ? RAILWAY_HISTORY_ZONES
      : RAILWAY_HISTORY_ZONES.filter((item) => item.id === region)
    return zones.flatMap((zone) => zone.divisions.map((name) => ({
      value: `${zone.code}:${name}`,
      label: `${name} Division · ${zone.name}`,
    })))
  }, [region])
  const events = useMemo(() => {
    if (mode === 'metro') {
      return historyEvents.filter((event) => (event.mode === undefined || event.mode === 'metro')
        && event.year <= year && matchesEvent(mode, region, event.title, event.detail))
    }
    if (mode === 'rail') {
      const nationalEvents = historyEvents.filter((event) => event.mode === 'rail'
        && (region === 'all' || event.region === 'all' || event.region === region))
      if (division !== 'all') {
        const selected = RAILWAY_HISTORY_ZONES.flatMap((item) => item.divisions.map((name) => ({ zone: item, name, id: `${item.code}:${name}` })))
          .find((item) => item.id === division)
        const dossier = selected ? findDivisionDossier(selected.zone.code, selected.name) : undefined
        return (dossier?.milestones ?? []).flatMap((milestone) => milestone.year === undefined || milestone.year > year ? [] : [{
          year: milestone.year,
          title: milestone.title,
          detail: milestone.detail,
          source: milestone.sourceUrl,
          sourceLabel: milestone.sourceLabel,
        }]).sort((a, b) => a.year - b.year || a.title.localeCompare(b.title))
      }
      const zoneEvents = RAILWAY_HISTORY_ZONES.filter((zone) => region === 'all' || zone.id === region).map((zone) => ({
        year: zone.formedYear,
        title: `${zone.name} is established`,
        detail: `Railway Board lists ${zone.headquarters} as headquarters and ${zone.divisions.length} operating divisions in its roster. This is an administrative milestone, not a measure of service growth.`,
        source: zone.id === 'SCoR' ? SOUTH_COAST_EFFECTIVE_SOURCE.url : RAILWAY_BASE_ROSTER_SOURCE.url,
        sourceLabel: zone.id === 'SCoR'
          ? `${SOUTH_COAST_EFFECTIVE_SOURCE.label} · ${SOUTH_COAST_EFFECTIVE_SOURCE.asOf}`
          : `${RAILWAY_BASE_ROSTER_SOURCE.label} · ${RAILWAY_BASE_ROSTER_SOURCE.asOf}`,
      }))
      return [...nationalEvents, ...zoneEvents].filter((event) => event.year <= year).sort((a, b) => a.year - b.year || a.title.localeCompare(b.title))
    }
    const eventMode = mode === 'highSpeed' ? 'highSpeed' : 'suburban'
    return historyEvents.filter((event) => event.mode === eventMode
      && (event.region === region || event.region === 'all') && event.year <= year)
  }, [mode, region, division, year])
  const setNetworkMode = (next: Mode) => {
    setMode(next)
    setDivision('all')
    setRegion(next === 'metro' ? 'delhi' : next === 'rail' ? 'all' : next === 'suburban' ? 'mumbai' : 'mahsr')
  }
  const railDivisionId = mode === 'rail' && division !== 'all' ? division : 'all'

  return <main className="history-explorer">
    <header className="history-topbar"><button className="history-brand" onClick={onGoLanding}><span aria-hidden="true">↔</span><strong>Transit Time Machine</strong></button><nav aria-label="History navigation"><button onClick={onGoLanding}>Home</button><button className="history-open-atlas" onClick={onOpenAtlas}>Open atlas <span aria-hidden="true">→</span></button></nav></header>
    <section className="history-intro-grid"><div><p className="history-eyebrow">The Indian Railway Museum · source-led collection</p><h1>Enter the <em>railway archive.</em></h1><p>Move from locomotives and trainsets to regional railway histories. Technical facts and historical claims link back to their records; gaps are labelled rather than filled with guesses.</p></div><aside className="history-signal-card"><span>THE VISITOR’S ROUTE</span><strong>Look · listen · investigate</strong><p>Explore open railway films, then choose a rail family, railway zone and division case file.</p></aside></section>
    <MuseumWalk />
    <section className="history-controls" id="history-controls" aria-label="History data selection"><fieldset><legend>Rail family</legend><div className="history-mode-tabs">{(Object.keys(labels) as Mode[]).map((item, index) => <button key={item} type="button" className={mode === item ? 'active' : ''} onClick={() => setNetworkMode(item)}><span>0{index + 1}</span>{labels[item]}</button>)}</div></fieldset><label className="history-region-select"><span>{mode === 'metro' ? 'Metro system' : mode === 'rail' ? 'Railway zone' : mode === 'suburban' ? 'City focus area' : 'Project'}</span><select value={region} onChange={(event) => { setRegion(event.target.value); setDivision('all') }}>{regions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      {mode === 'rail' && <label className="history-region-select history-division-select"><span>Division · official roster</span><select value={division} onChange={(event) => setDivision(event.target.value)}><option value="all">All divisions in this region</option>{availableDivisions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>}
    </section>
    <section className="history-dashboard" aria-live="polite">{mode === 'metro' ? <MetroDashboard systemId={region} /> : mode === 'rail' ? <RailDashboard zoneId={region} divisionId={railDivisionId} /> : mode === 'suburban' ? <SuburbanDashboard areaId={region} /> : <HighSpeedDashboard />}</section>
    <section className="history-chronicle" aria-labelledby="history-chronicle-title"><div className="history-chronicle-head"><div><p className="history-eyebrow">Documented moments</p><h2 id="history-chronicle-title">Timeline through {year}</h2></div><label className="history-year-control"><span><b>{year}</b><small>1853 — 2026</small></span><input aria-label="Show history through year" type="range" min="1853" max="2026" step="1" value={year} onChange={(event) => setYear(Number(event.target.value))} /></label></div><p className="history-scope-note">Timeline records are source-linked milestones, not a complete construction or operating history. The map remains present-day geometry rather than a historical reconstruction.</p>{events.length ? <ol className="history-events">{events.map((event, index) => <li key={`${event.year}-${event.title}`}><span className="history-event-index">{String(index + 1).padStart(2, '0')}</span><time>{event.year}</time><div><h3>{event.title}</h3><p>{event.detail}</p><a href={event.source} target="_blank" rel="noreferrer">{event.sourceLabel} ↗</a></div></li>)}</ol> : <div className="history-empty-state"><strong>No matching source-linked event is indexed yet.</strong><p>This is an archive gap, not evidence that the selected network has no history.</p></div>}</section>
    <footer className="history-footer"><span>Transit Time Machine · source status stays visible</span><button onClick={onOpenAtlas}>Explore the atlas →</button></footer>
  </main>
}
