/**
 * Source-backed inventory for metro system cards and future data imports.
 *
 * This is deliberately not the map dataset. A system can have an official
 * schematic/route map while this project still has no verified polyline or
 * complete station-point import for it. Consumers must use the coverage
 * fields rather than assuming that an official station total is renderable.
 */

export type MetroMapCoverageStatus = 'bundled' | 'pending-import'
export type MetroStationPointCoverageStatus = 'bundled-gtfs' | 'bundled-osm' | 'sample-only' | 'not-imported'

export type MetroSource = {
  label: string
  url: string
  /** The date printed by the source, or the retrieval date when it is a live page. */
  asOf: string
}

export type OfficialStationCount = {
  /**
   * Unique passenger stations currently open to passengers, if the primary
   * source publishes a network total. `null` is intentional: do not replace it
   * with a count inferred from a schematic, line totals, or map samples.
   */
  operating: number | null
  /** Published figure whose definition is not a unique passenger-station count. */
  publishedCount?: number
  publishedCountLabel?: string
  /** A published whole-network total where it differs from operating stations. */
  totalIncludingNotOpen?: number
  definition: string
  source: MetroSource
}

export type MetroRouteGeometryCoverage = {
  status: MetroMapCoverageStatus
  /** `featureCount` is a count of stored GIS features, never a count of lines. */
  featureCount?: number
  geometryKind?: 'GTFS shapes' | 'OpenStreetMap track ways'
  /** Distinct labels found on stored features; not asserted as all operator lines. */
  groupLabels?: string[]
  source?: MetroSource
  note: string
}

export type MetroStationPointCoverage = {
  status: MetroStationPointCoverageStatus
  /** Point records in the project bundle, not the operator's station count. */
  pointCount: number
  /**
   * True when source-derived point records are available. The loader below
   * excludes legacy hand-curated samples in src/data.ts.
   */
  stationListAvailable: boolean
  source?: MetroSource
  note: string
}

export type MetroCorridorCount = {
  name: string
  operatingStations: number
  totalStations: number
  source: MetroSource
  note: string
}

export type MappedMetroStationPoint = {
  id: string
  systemId: string
  name: string
  coordinates: readonly [longitude: number, latitude: number]
  lineIds: readonly string[]
  provenance: MetroSource
}

export type MetroCatalogEntry = {
  id: string
  name: string
  cityRegion: string
  operator: string
  /** Operator or government route-map / passenger-information source. */
  officialMap: MetroSource
  stationCount: OfficialStationCount
  routeGeometry: MetroRouteGeometryCoverage
  stationPoints: MetroStationPointCoverage
  /** Corridor-level counts are used when no deduplicated network total exists. */
  corridors?: readonly MetroCorridorCount[]
}

type RouteBundleStation = {
  properties?: {
    id?: unknown
    system?: unknown
    name?: unknown
    lines?: unknown
    source?: unknown
    coordinateSource?: unknown
  }
  geometry?: { type?: unknown; coordinates?: unknown }
}

type RouteBundle = { stations?: unknown }
type OsmStationBundle = {
  features?: {
    properties?: {
      system?: unknown
      stationName?: unknown
      officialLines?: unknown
      officialSource?: unknown
      officialLine?: unknown
      officialSourceUrl?: unknown
      osmFeatureId?: unknown
      sourceFeatureId?: unknown
    }
    geometry?: { type?: unknown; coordinates?: unknown }
  }[]
}

const OSM_METRO_TRACK_SNAPSHOT: MetroSource = {
  label: 'OpenStreetMap metro-track snapshot',
  url: 'https://www.openstreetmap.org/',
  asOf: '2026-10-11',
}

const HOTOSM_STATION_SNAPSHOT: MetroSource = {
  label: 'HOTOSM India railways snapshot · OSM station points',
  url: 'https://data.humdata.org/dataset/hotosm_ind_railways',
  asOf: '2026-05-10',
}

const HMRL_GTFS: MetroSource = {
  label: 'Hyderabad Metro GTFS snapshot',
  url: 'https://data.opencity.in/dataset/hyderabad-metro-rail-gtfs',
  asOf: '2026-07-03',
}

const BMRCL_GTFS: MetroSource = {
  label: 'Namma Metro GTFS import',
  url: 'https://github.com/Vonter/bmrcl-gtfs',
  asOf: 'undated source snapshot; imported before 2026-10-11',
}

const CMRL_GTFS: MetroSource = {
  label: 'Chennai Metro GTFS import',
  url: 'https://github.com/ungalsoththu/ChennaiGTFS',
  asOf: 'undated source snapshot; imported before 2026-10-11',
}

/**
 * Load only coordinate-backed station markers from checked-in GTFS and OSM
 * bundles. This deliberately excludes legacy hand-curated samples in
 * src/data.ts. These marker counts are not official network station totals.
 */
export async function loadBundledMetroStationPoints(
  fetcher: typeof fetch = fetch,
): Promise<readonly MappedMetroStationPoint[]> {
  const [response, osmResponse, extraOsmResponse] = await Promise.all([
    fetcher('/data/routes.json'),
    fetcher('/data/metro-stations-osm.json').catch(() => null),
    fetcher('/data/metro-stations-extra.json').catch(() => null),
  ])
  if (!response.ok) throw new Error(`Unable to load bundled metro stations (${response.status})`)

  const [payload, osmPayload, extraOsmPayload] = await Promise.all([
    response.json() as Promise<RouteBundle>,
    osmResponse?.ok ? osmResponse.json() as Promise<OsmStationBundle> : Promise.resolve({ features: [] } as OsmStationBundle),
    extraOsmResponse?.ok ? extraOsmResponse.json() as Promise<OsmStationBundle> : Promise.resolve({ features: [] } as OsmStationBundle),
  ])

  const gtfsPoints = (Array.isArray(payload.stations) ? payload.stations : []).flatMap((candidate: RouteBundleStation) => {
    const { properties, geometry } = candidate
    const coordinates = geometry?.coordinates
    if (
      geometry?.type !== 'Point'
      || !properties
      || typeof properties.id !== 'string'
      || typeof properties.system !== 'string'
      || typeof properties.name !== 'string'
      || !Array.isArray(coordinates)
      || coordinates.length < 2
      || typeof coordinates[0] !== 'number'
      || typeof coordinates[1] !== 'number'
    ) return []

    const sourceUrl = typeof properties.coordinateSource === 'string'
      ? properties.coordinateSource
      : typeof properties.source === 'string'
        ? properties.source
        : ''
    if (!sourceUrl) return []

    let lineIds: string[] = []
    if (typeof properties.lines === 'string') {
      try {
        const parsed = JSON.parse(properties.lines)
        if (Array.isArray(parsed) && parsed.every((line) => typeof line === 'string')) lineIds = parsed
      } catch {
        // Some feeds have no route association for a station; keep the point.
      }
    }

    return [{
      id: properties.id,
      systemId: properties.system,
      name: properties.name,
      coordinates: [coordinates[0], coordinates[1]] as const,
      lineIds,
      provenance: {
        label: 'Bundled GTFS station point',
        url: sourceUrl,
        asOf: properties.system === 'hyderabad' ? '2026-07-03' : 'undated source snapshot; imported before 2026-10-11',
      },
    }]
  })
  const osmPoints = [...(osmPayload.features ?? []), ...(extraOsmPayload.features ?? [])].flatMap((candidate) => {
    const properties = candidate.properties
    const coordinates = candidate.geometry?.coordinates
    const osmFeatureId = typeof properties?.osmFeatureId === 'string'
      ? properties.osmFeatureId
      : typeof properties?.sourceFeatureId === 'string' ? properties.sourceFeatureId : null
    if (
      candidate.geometry?.type !== 'Point'
      || typeof properties?.system !== 'string'
      || typeof properties.stationName !== 'string'
      || !osmFeatureId
      || !Array.isArray(coordinates)
      || typeof coordinates[0] !== 'number'
      || typeof coordinates[1] !== 'number'
    ) return []
    return [{
      id: `${properties.system}-${osmFeatureId.replace('/', '-')}`,
      systemId: properties.system,
      name: properties.stationName,
      coordinates: [coordinates[0], coordinates[1]] as const,
      lineIds: Array.isArray(properties.officialLines)
        ? properties.officialLines.filter((line): line is string => typeof line === 'string')
        : typeof properties.officialLine === 'string' ? [properties.officialLine] : [],
      provenance: {
        label: 'HOTOSM/OSM station point',
        url: `https://www.openstreetmap.org/${osmFeatureId}`,
        asOf: HOTOSM_STATION_SNAPSHOT.asOf,
      },
    }]
  })
  return [...gtfsPoints, ...osmPoints]
}

/**
 * The catalog includes systems whose operators publish a map even when their
 * precise map geometry has not yet been imported. That makes the gap explicit
 * instead of rendering station-to-station straight lines as routes.
 */
export const metroCatalog: readonly MetroCatalogEntry[] = [
  {
    id: 'delhi',
    name: 'Delhi Metro',
    cityRegion: 'Delhi NCR',
    operator: 'Delhi Metro Rail Corporation',
    officialMap: {
      label: 'DMRC present network',
      url: 'https://delhimetrorail.com/pages/about-us/present-network',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: null,
      publishedCount: 303,
      publishedCountLabel: 'DMRC-reported Delhi NCR stations incl. Aqua and Rapid Metro',
      definition: 'DMRC reports 303 stations across the wider Delhi NCR network, including Noida–Greater Noida Aqua Line and Rapid Metro Gurugram. This regional figure is not a Delhi Metro-only count; the two systems have separate atlas entries.',
      source: {
        label: 'DMRC present network',
        url: 'https://delhimetrorail.com/pages/about-us/present-network',
        asOf: 'live page retrieved 2026-10-11',
      },
    },
    routeGeometry: {
      status: 'bundled',
      featureCount: 305,
      geometryKind: 'OpenStreetMap track ways',
      groupLabels: ['Airport Express', 'Blue', 'Green', 'Grey', 'Magenta', 'Pink', 'Red', 'Violet', 'Yellow'],
      source: OSM_METRO_TRACK_SNAPSHOT,
      note: 'Physical track ways in the project bundle; feature count is not a line count and is not a service map.',
    },
    stationPoints: {
      status: 'sample-only',
      pointCount: 6,
      stationListAvailable: false,
      note: 'Six legacy hand-curated points in src/data.ts. They are examples, not a station inventory.',
    },
  },
  {
    id: 'bengaluru',
    name: 'Namma Metro',
    cityRegion: 'Bengaluru',
    operator: 'Bangalore Metro Rail Corporation Limited',
    officialMap: {
      label: 'BMRCL official website',
      url: 'https://english.bmrc.co.in/',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: null,
      definition: 'No current operator-published network total was verified in this pass. The imported GTFS has 83 station points, but that is not an official count and must not be displayed as one.',
      source: {
        label: 'BMRCL official website',
        url: 'https://english.bmrc.co.in/',
        asOf: 'live page retrieved 2026-10-11',
      },
    },
    routeGeometry: {
      status: 'bundled',
      featureCount: 3,
      geometryKind: 'GTFS shapes',
      groupLabels: ['Madavara – Silk Institute', 'Whitefield – Challaghatta', 'RV Road – Bommasandra'],
      source: BMRCL_GTFS,
      note: 'Three GTFS shape records are bundled; they should be checked against the current operator map before expansion claims are made.',
    },
    stationPoints: {
      status: 'bundled-gtfs',
      pointCount: 83,
      stationListAvailable: true,
      source: BMRCL_GTFS,
      note: 'Imported GTFS station-point coverage. Completeness is relative to this undated feed, not a current BMRCL assertion.',
    },
  },
  {
    id: 'chennai',
    name: 'Chennai Metro',
    cityRegion: 'Chennai',
    operator: 'Chennai Metro Rail Limited',
    officialMap: {
      label: 'CMRL metro line map',
      url: 'https://chennaimetrorail.org/metro-line-map/',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 40,
      definition: 'CMRL states that Phase I and its extension have 40 stations across the two operating corridors. Phase II stations are excluded.',
      source: {
        label: 'CMRL Phase-I operating system reference',
        url: 'https://chennaimetrorail.org/technology/it-afc/',
        asOf: 'live page retrieved 2026-10-11',
      },
    },
    routeGeometry: {
      status: 'bundled',
      featureCount: 76,
      geometryKind: 'OpenStreetMap track ways',
      groupLabels: ['Blue', 'Green', 'Untagged Chennai Metro track'],
      source: OSM_METRO_TRACK_SNAPSHOT,
      note: 'Physical track ways in the project bundle; they are not a route-family count.',
    },
    stationPoints: {
      status: 'bundled-gtfs',
      pointCount: 41,
      stationListAvailable: true,
      source: CMRL_GTFS,
      note: 'Imported station points from an undated GTFS source; do not label as current official station count.',
    },
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad Metro',
    cityRegion: 'Hyderabad',
    operator: 'Hyderabad Metro Rail Limited',
    officialMap: {
      label: 'HMRL service corridors and stations',
      url: 'https://hmrl.co.in/services/',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 57,
      definition: 'The HMRL 2026 procurement notice states 57 metro rail stations. The passenger page separately lists 60 corridor-station entries across three corridors, including shared interchanges.',
      source: {
        label: 'HMRL 2026 PRTS bid notice',
        url: 'https://hmrl.co.in/wp-content/uploads/2026/02/1.-Bid-Notice-for-Personal-Rapid-Transit-System-PRTS-Date-24.02.2026-1.pdf',
        asOf: '2026-02-24',
      },
    },
    routeGeometry: {
      status: 'bundled',
      featureCount: 3,
      geometryKind: 'GTFS shapes',
      groupLabels: ['Miyapur – LB Nagar', 'JBS Parade Ground – MG Bus Station', 'Nagole – Raidurg'],
      source: HMRL_GTFS,
      note: 'Three route-shape records are bundled from the dated GTFS feed.',
    },
    stationPoints: {
      status: 'bundled-gtfs',
      pointCount: 57,
      stationListAvailable: true,
      source: HMRL_GTFS,
      note: 'All 57 project station points match the cited HMRL operating total.',
    },
  },
  {
    id: 'kochi',
    name: 'Kochi Metro',
    cityRegion: 'Kochi',
    operator: 'Kochi Metro Rail Limited',
    officialMap: {
      label: 'KMRL network and station explorer',
      url: 'https://corporate.kochimetro.org/',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 25,
      publishedCount: 26,
      publishedCountLabel: 'KMRL homepage-reported elevated stations (conflicts with named roster)',
      definition: 'KMRL’s current passenger station explorer and a 2026 operator notice identify 25 passenger stations. Its homepage separately claims 26 elevated stations; the discrepancy is unresolved, so the atlas uses the 25 named passenger stops and preserves the 26 figure as a conflicting published claim.',
      source: {
        label: 'KMRL station explorer / network page',
        url: 'https://corporate.kochimetro.org/',
        asOf: 'live page retrieved 2026-10-11',
      },
    },
    routeGeometry: {
      status: 'bundled',
      featureCount: 55,
      geometryKind: 'OpenStreetMap track ways',
      source: OSM_METRO_TRACK_SNAPSHOT,
      note: 'Physical metro track ways are bundled. They do not include Water Metro or unbuilt Phase II.',
    },
    stationPoints: {
      status: 'bundled-osm',
      pointCount: 25,
      stationListAvailable: true,
      source: HOTOSM_STATION_SNAPSHOT,
      note: 'All 25 named passenger stations have markers: 24 unchanged OSM points plus Vyttila represented by the centroid of its mapped station-footprint polygon. KMRL separately publishes a 26-station homepage claim; that conflict remains visible.',
    },
  },
  {
    id: 'mumbai',
    name: 'Mumbai Metro',
    cityRegion: 'Mumbai Metropolitan Region',
    operator: 'Multiple operators (MMRDA, MMRCL and Mumbai Metro One)',
    officialMap: {
      label: 'MMRDA metro programme / current-status pages',
      url: 'https://mmrda.maharashtra.gov.in/en/node/1229',
      asOf: '2026-08-31',
    },
    stationCount: {
      operating: null,
      definition: 'No single primary source in this catalog publishes a deduplicated, all-operator Mumbai Metro operating-station total. Corridor tables must not be added together because interchange stations and partial openings overlap.',
      source: {
        label: 'MMRDA current-status page',
        url: 'https://mmrda.maharashtra.gov.in/en/node/1229',
        asOf: '2026-08-31',
      },
    },
    routeGeometry: {
      status: 'bundled',
      featureCount: 90,
      geometryKind: 'OpenStreetMap track ways',
      groupLabels: ['Line 1', 'Line 2', 'Line 3', 'Line 7', 'Line 9'],
      source: OSM_METRO_TRACK_SNAPSHOT,
      note: 'Physical track ways are bundled, not a verified complete all-operator service-route inventory. Current partial openings are documented per corridor by MMRDA.',
    },
    stationPoints: {
      status: 'bundled-osm',
      pointCount: 66,
      stationListAvailable: true,
      source: HOTOSM_STATION_SNAPSHOT,
      note: '66 matched records: Line 1 12/12, Line 2A 15/17, Line 2B 5/6 currently open, Line 3 17/27, Line 7 13/13, Line 9 4/4 currently open. Ten Line 1 records are centroids of mapped station footprints; this is partial coverage, not a deduplicated all-network station count.',
    },
    corridors: [
      { name: 'Line 1', operatingStations: 12, totalStations: 12, source: { label: 'MMRDA Line 1 overview', url: 'https://www.mmrda.maharashtra.gov.in/en/projects/transport/metro-line-1/overview', asOf: 'live page retrieved 2026-10-11' }, note: 'Versova–Andheri–Ghatkopar' },
      { name: 'Line 2A', operatingStations: 17, totalStations: 17, source: { label: 'MMRDA Line 2A present status', url: 'https://www.mmrda.maharashtra.gov.in/en/transportmetroline2a/present-status', asOf: 'live page retrieved 2026-10-11' }, note: 'Dahisar East–Andheri West; 15 markers matched. Pahadi Eksar and Pahadi Goregaon are absent from the source snapshot.' },
      { name: 'Line 2B', operatingStations: 6, totalStations: 20, source: { label: 'MMRDA Line 2B current status', url: 'https://www.mmrda.maharashtra.gov.in/en/projects/transport/metro-line-2b/overview?page=3', asOf: '2026-08-31' }, note: 'Six stations open by 13 August 2026; five have matched station markers. BSNL Metro is absent from the source snapshot; the published corridor roster has 20 stations.' },
      { name: 'Line 3', operatingStations: 27, totalStations: 27, source: { label: 'Press Information Bureau · Line 3 full opening', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2176402&lang=2&reg=48', asOf: '2025-10-08' }, note: 'Aarey JVLR–Cuffe Parade; 26 underground and one at-grade station.' },
      { name: 'Line 7', operatingStations: 13, totalStations: 13, source: { label: 'MMRDA Line 7 overview', url: 'https://www.mmrda.maharashtra.gov.in/en/projects/transport/metro-line-7/overview?page=0', asOf: 'live page retrieved 2026-10-11' }, note: 'Andheri East–Dahisar East' },
      { name: 'Line 9', operatingStations: 4, totalStations: 10, source: { label: 'MMRDA Line 9 & 7A overview', url: 'https://www.mmrda.maharashtra.gov.in/en/projects/transport/metro-line-9/overview', asOf: '2026-08-31' }, note: 'Four-station Dahisar East–Kashigaon phase open from 7 April 2026; all four have matched station markers.' },
    ],
  },
  {
    id: 'pune',
    name: 'Pune Metro',
    cityRegion: 'Pune–Pimpri Chinchwad',
    operator: 'Maharashtra Metro Rail Corporation Limited (Maha Metro)',
    officialMap: {
      label: 'Pune Metro operational route map',
      url: 'https://www.punemetrorail.org/index.aspx',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 29,
      totalIncludingNotOpen: 30,
      definition: 'The Pune Metro passenger page reports 30 total stations and 29 operational stations on its two-line, 33.1 km network.',
      source: {
        label: 'Pune Metro passenger information',
        url: 'https://www.punemetrorail.org/index.aspx',
        asOf: 'live page retrieved 2026-10-11',
      },
    },
    routeGeometry: {
      status: 'bundled',
      featureCount: 38,
      geometryKind: 'OpenStreetMap track ways',
      groupLabels: ['Aqua', 'Purple'],
      source: OSM_METRO_TRACK_SNAPSHOT,
      note: 'Physical metro track ways are bundled; 38 features is not the official station or line count.',
    },
    stationPoints: {
      status: 'bundled-osm',
      pointCount: 30,
      stationListAvailable: true,
      source: HOTOSM_STATION_SNAPSHOT,
      note: '30 source records cover 29 distinct station names across the two operating corridors, matching the operator’s 29 operational-station figure. Two Civil/District Court platform objects are retained separately; the operator’s current page uses both Kasba Peth and Budhwar Peth labels, while the OSM object is named Kasba Peth.',
    },
  },
  {
    id: 'ahmedabad-gandhinagar',
    name: 'Ahmedabad–Gandhinagar Metro',
    cityRegion: 'Ahmedabad and Gandhinagar',
    operator: 'Gujarat Metro Rail Corporation Limited',
    officialMap: {
      label: 'GMRC project overview and alignment maps',
      url: 'https://www.gujaratmetrorail.com/project-overview2/',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: null,
      publishedCount: 46,
      publishedCountLabel: 'FY2024–25 operator-reported operating corridor entries',
      definition: 'GMRC’s FY2024–25 report records 31 Phase I and 15 Phase II station entries in operation. This dated corridor-entry sum is not a current deduplicated network-station total; the live project page also includes stations on unfinished extensions.',
      source: {
        label: 'GMRC Annual Report 2024–25 · operational performance',
        url: 'https://www.gujaratmetrorail.com/wp-content/uploads/2026/05/Annual-Report-for-FY-2024-2025.pdf',
        asOf: 'FY2024–25',
      },
    },
    routeGeometry: {
      status: 'pending-import',
      note: 'GMRC publishes alignment maps and an interactive map, but no verified project polyline or route-shape import is bundled yet.',
    },
    stationPoints: {
      status: 'not-imported',
      pointCount: 0,
      stationListAvailable: false,
      note: 'No Ahmedabad–Gandhinagar station-point dataset is bundled. Import must cite an authoritative or dated transit source.',
    },
  },
  {
    id: 'nagpur',
    name: 'Nagpur Metro',
    cityRegion: 'Nagpur',
    operator: 'Maharashtra Metro Rail Corporation Limited (Maha Metro)',
    officialMap: {
      label: 'Maha Metro Nagpur route map',
      url: 'https://mahametro.org/route_maps.html',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: null,
      publishedCount: 37,
      publishedCountLabel: 'last published operating-station count · FY2024–25',
      definition: 'Maha Metro’s 2024–25 annual report says 37 stations were operational as of 31 March 2025. Its current route-map page lists 38 station entries, but that is not confirmed as an operating total; no newer operating count was verified.',
      source: { label: 'Maha Metro Annual Report 2024–25', url: 'https://www.metrorailnagpur.com/pdf/MAHA%20METRO_ANNUAL%20REPORT%202024%2025_ENG.pdf', asOf: '2025-03-31' },
    },
    routeGeometry: {
      status: 'pending-import',
      note: 'Official schematic is available; verified GIS route geometry is not yet bundled.',
    },
    stationPoints: {
      status: 'not-imported',
      pointCount: 0,
      stationListAvailable: false,
      note: 'No station points are bundled.',
    },
  },
  {
    id: 'lucknow',
    name: 'Lucknow Metro',
    cityRegion: 'Lucknow',
    operator: 'Uttar Pradesh Metro Rail Corporation Limited',
    officialMap: {
      label: 'UPMRC official website',
      url: 'https://upmetrorail.com/',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 21,
      definition: 'UPMRC’s 2024–25 annual report records passenger operation across the full CCS Airport–Munshipulia corridor and identifies 21 stations.',
      source: { label: 'UPMRC Annual Report 2024–25 · Lucknow project', url: 'https://portal.upmetrorail.com/documents/374/UPMRC_Annual_Report_2024-25_English.pdf', asOf: '2025-03-31' },
    },
    routeGeometry: { status: 'pending-import', note: 'Operator route information exists; no verified project geometry is bundled.' },
    stationPoints: { status: 'not-imported', pointCount: 0, stationListAvailable: false, note: 'No station points are bundled.' },
  },
  {
    id: 'kanpur',
    name: 'Kanpur Metro',
    cityRegion: 'Kanpur',
    operator: 'Uttar Pradesh Metro Rail Corporation Limited',
    officialMap: {
      label: 'UPMRC official website',
      url: 'https://upmetrorail.com/',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 14,
      definition: 'UPMRC’s 2024–25 annual report says service operates on 14 stations from IIT Kanpur through Kanpur Central. Future/unopened corridors are excluded.',
      source: { label: 'UPMRC Annual Report 2024–25 · Kanpur project', url: 'https://portal.upmetrorail.com/documents/374/UPMRC_Annual_Report_2024-25_English.pdf', asOf: '2025-03-31' },
    },
    routeGeometry: { status: 'pending-import', note: 'Operator route information exists; no verified project geometry is bundled.' },
    stationPoints: { status: 'not-imported', pointCount: 0, stationListAvailable: false, note: 'No station points are bundled.' },
  },
  {
    id: 'agra',
    name: 'Agra Metro',
    cityRegion: 'Agra',
    operator: 'Uttar Pradesh Metro Rail Corporation Limited',
    officialMap: {
      label: 'UPMRC official website',
      url: 'https://upmetrorail.com/',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 6,
      definition: 'UPMRC’s 2024–25 annual report describes passenger service on the six-station Taj East Gate–Mankameshwar priority stretch. The rest of the project route is excluded.',
      source: { label: 'UPMRC Annual Report 2024–25 · Agra project', url: 'https://portal.upmetrorail.com/documents/374/UPMRC_Annual_Report_2024-25_English.pdf', asOf: '2025-03-31' },
    },
    routeGeometry: { status: 'pending-import', note: 'Operator route information exists; no verified project geometry is bundled.' },
    stationPoints: { status: 'not-imported', pointCount: 0, stationListAvailable: false, note: 'No station points are bundled.' },
  },
  {
    id: 'noida',
    name: 'Noida Metro',
    cityRegion: 'Noida–Greater Noida',
    operator: 'Noida Metro Rail Corporation',
    officialMap: {
      label: 'NMRC present network',
      url: 'https://www.nmrcnoida.com/Projects/Present-Network',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 21,
      definition: 'NMRC reports 21 stations on the operational 29.707 km Aqua Line.',
      source: { label: 'NMRC present network', url: 'https://www.nmrcnoida.com/Projects/Present-Network', asOf: 'live page retrieved 2026-10-11' },
    },
    routeGeometry: {
      status: 'bundled',
      geometryKind: 'OpenStreetMap track ways',
      featureCount: 31,
      groupLabels: ['Aqua Line'],
      source: OSM_METRO_TRACK_SNAPSHOT,
      note: 'Aqua Line physical track ways were separated from the Delhi NCR layer using their OSM names and NMRC bounds. This remains community-mapped infrastructure, not an operator-certified path.',
    },
    stationPoints: { status: 'not-imported', pointCount: 0, stationListAvailable: false, note: 'No station points are bundled.' },
  },
  {
    id: 'gurugram-rapid',
    name: 'Rapid Metro Gurugram',
    cityRegion: 'Gurugram',
    operator: 'Haryana Mass Rapid Transport Corporation / Delhi Metro Rail Corporation',
    officialMap: {
      label: 'Gurugram Metro Rail Limited · existing MRTS',
      url: 'https://gmrl.org.in/MillenniumCity.aspx',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 11,
      definition: 'GMRL describes the existing Rapid Metro as 11.70 km with 11 stations. Its separately sanctioned Millennium City Centre–Cyber City corridor is a future project and is not counted here.',
      source: { label: 'Gurugram Metro Rail Limited', url: 'https://gmrl.org.in/MillenniumCity.aspx', asOf: 'live page retrieved 2026-10-11' },
    },
    routeGeometry: {
      status: 'bundled',
      geometryKind: 'OpenStreetMap track ways',
      featureCount: 18,
      groupLabels: ['Rapid Metro'],
      source: OSM_METRO_TRACK_SNAPSHOT,
      note: 'Rapid Metro track ways are separated from the Delhi NCR layer by OSM naming and Gurugram bounds; geometry is community-mapped physical track.',
    },
    stationPoints: { status: 'not-imported', pointCount: 0, stationListAvailable: false, note: 'No station points are bundled.' },
  },
  {
    id: 'navi-mumbai',
    name: 'Navi Mumbai Metro',
    cityRegion: 'Navi Mumbai',
    operator: 'CIDCO / Maha Metro',
    officialMap: {
      label: 'CIDCO Navi Mumbai Metro Line 1',
      url: 'https://cidco.maharashtra.gov.in/Page?Token=76747ABE287',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 11,
      definition: 'CIDCO and Maha Metro identify the Belapur–Pendhar Line 1 as an 11-station operational corridor. Planned extensions are excluded.',
      source: { label: 'Maha Metro Line 1 alignment note', url: 'https://www.mahametro.org/pdf/newsletter/Newsletter_Mar_2021.pdf', asOf: '2021-03' },
    },
    routeGeometry: {
      status: 'bundled',
      geometryKind: 'OpenStreetMap track ways',
      featureCount: 7,
      groupLabels: ['Line 1'],
      source: OSM_METRO_TRACK_SNAPSHOT,
      note: 'Line 1 track ways are separated from Mumbai Metro by their OSM names and Navi Mumbai bounds; geometry is community-mapped physical track.',
    },
    stationPoints: { status: 'not-imported', pointCount: 0, stationListAvailable: false, note: 'No station points are bundled.' },
  },
  {
    id: 'kolkata',
    name: 'Kolkata Metro',
    cityRegion: 'Kolkata',
    operator: 'Metro Railway Kolkata · Indian Railways',
    officialMap: {
      label: 'Metro Railway Kolkata passenger network',
      url: 'https://mtp.indianrailways.gov.in/view_section.jsp?backgroundColor=LIGHTSTEELBLUE&fontColor=black&id=0%2C2%2C630%2C659&lang=0',
      asOf: 'five operator service groups; current Blue Line notice reviewed 2026-10-05',
    },
    stationCount: {
      operating: null,
      definition: 'The operator publishes five line/service groups but no deduplicated whole-network station total. A Blue Line notice reviewed 5 October 2026 says service between Shahid Khudiram and Kavi Subhash is suspended until further notice, so the network is not treated as uniformly operating.',
      source: { label: 'Metro Railway Kolkata passenger information', url: 'https://mtp.indianrailways.gov.in/view_section.jsp?backgroundColor=LIGHTSTEELBLUE&fontColor=black&id=0%2C2%2C630%2C659&lang=0', asOf: '2026-10-05' },
    },
    routeGeometry: { status: 'pending-import', note: 'Official passenger maps exist, but no reviewed Kolkata route geometry is in the local bundle yet.' },
    stationPoints: { status: 'not-imported', pointCount: 0, stationListAvailable: false, note: 'No metro-only station point set is bundled.' },
  },
  {
    id: 'jaipur',
    name: 'Jaipur Metro',
    cityRegion: 'Jaipur',
    operator: 'Jaipur Metro Rail Corporation',
    officialMap: {
      label: 'Jaipur Metro · Rajasthan Transport Department',
      url: 'https://transport.rajasthan.gov.in/jmrc/',
      asOf: 'live government page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 11,
      definition: 'JMRC passenger information enumerates 11 stations on the operating Mansarovar–Badi Chaupar corridor.',
      source: { label: 'JMRC passenger station list', url: 'https://transport.rajasthan.gov.in/content/transportportal/en/metro-portal/passanger-information/metro-station.html', asOf: 'live page retrieved 2026-10-11' },
    },
    routeGeometry: { status: 'pending-import', note: 'The operator publishes a route map, but reviewed geographic route geometry is not in the local bundle yet.' },
    stationPoints: { status: 'not-imported', pointCount: 0, stationListAvailable: false, note: 'No metro-only station point set is bundled.' },
  },
  {
    id: 'bhopal',
    name: 'Bhopal Metro',
    cityRegion: 'Bhopal',
    operator: 'Madhya Pradesh Metro Rail Corporation Limited',
    officialMap: {
      label: 'PIB · Bhopal Metro operational priority corridor',
      url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2207030&lang=1&reg=3',
      asOf: '2025-12-20',
    },
    stationCount: {
      operating: 8,
      definition: 'The Government of India announcement lists eight stations on the inaugurated Orange Line priority corridor; this is not the full planned network.',
      source: { label: 'Press Information Bureau · Bhopal Metro launch', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2207030&lang=1&reg=3', asOf: '2025-12-20' },
    },
    routeGeometry: { status: 'pending-import', note: 'The official launch notice documents the operating section, but reviewed geographic path geometry is not in this bundle.' },
    stationPoints: { status: 'not-imported', pointCount: 0, stationListAvailable: false, note: 'No Bhopal metro station point set is bundled.' },
  },
  {
    id: 'indore',
    name: 'Indore Metro',
    cityRegion: 'Indore',
    operator: 'Madhya Pradesh Metro Rail Corporation Limited',
    officialMap: {
      label: 'PIB · Indore Metro Priority Corridor–2',
      url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2307042&lang=2&reg=48',
      asOf: '2026-09-05',
    },
    stationCount: {
      operating: 16,
      definition: 'The Government of India states that Indore Metro had 16 operational stations over approximately 17 km after the 5 September 2026 inauguration.',
      source: { label: 'Press Information Bureau · Indore Priority Corridor–2', url: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2307042&lang=2&reg=48', asOf: '2026-09-05' },
    },
    routeGeometry: { status: 'pending-import', note: 'Current operating-station total is sourced, but reviewed geographic route geometry is not in this bundle.' },
    stationPoints: { status: 'not-imported', pointCount: 0, stationListAvailable: false, note: 'No Indore metro station point set is bundled.' },
  },
  {
    id: 'meerut',
    name: 'Meerut Metro',
    cityRegion: 'Meerut',
    operator: 'National Capital Region Transport Corporation',
    officialMap: {
      label: 'NCRTC interactive Namo Bharat / Meerut Metro map',
      url: 'https://ncrtc.in/interactive-map/',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: 12,
      definition: 'NCRTC’s June 2026 feeder-service document says Meerut Metro stops at all 12 stations between Meerut South and Modipuram. Four of those stations are shared with Namo Bharat. NCRTC’s April folder also uses a 13-node span figure, so this count specifically follows the later passenger stopping-pattern wording.',
      source: {
        label: 'NCRTC · June 2026 Meerut Metro feeder-service EOI',
        url: 'https://ncrtc.in/wp-content/uploads/2026/06/EOI3_Feeder_services_Rolling-Namo-Bharat-16.06.2026.pdf',
        asOf: '2026-06-16; service opened 2026-02-22',
      },
    },
    routeGeometry: {
      status: 'pending-import',
      source: {
        label: 'NCRTC interactive map',
        url: 'https://ncrtc.in/interactive-map/',
        asOf: 'live page retrieved 2026-10-11',
      },
      note: 'Meerut Metro began service on 22 February 2026 over shared Namo Bharat infrastructure. NCRTC distinguishes its 12-stop local service from the regional stopping pattern. The local bundle contains Delhi–Meerut RRTS-tagged track ways, but no service-specific Metro polyline, so it is intentionally not presented as a metro route.',
    },
    stationPoints: {
      status: 'not-imported',
      pointCount: 0,
      stationListAvailable: false,
      note: 'NCRTC publishes the 13-station local service map, but no independently reviewed Meerut Metro point layer is bundled yet.',
    },
  },
  {
    id: 'patna',
    name: 'Patna Metro',
    cityRegion: 'Patna',
    operator: 'Patna Metro Rail Corporation Limited',
    officialMap: {
      label: 'PMRC official route map',
      url: 'https://patnametro.bihar.gov.in/pages/route-map',
      asOf: 'live page retrieved 2026-10-11',
    },
    stationCount: {
      operating: null,
      definition: 'No current PMRC source was found that states a unique passenger-service station total. The operator’s corridor list mixes “working” and “constructed” priority stations, while Bihar’s July 2026 notice documents an extension but not a reconciled network total.',
      source: { label: 'Bihar CMO · Patna Metro extension update', url: 'https://cm.bihar.gov.in/users/hi/viewnews.aspx?id=4248', asOf: '2026-07-02' },
    },
    routeGeometry: { status: 'pending-import', note: 'Operator corridor maps exist, but reviewed geographic geometry for operational sections is not bundled.' },
    stationPoints: { status: 'not-imported', pointCount: 0, stationListAvailable: false, note: 'No Patna metro station point set is bundled.' },
  },
] as const

export const metroCatalogById = Object.fromEntries(
  metroCatalog.map((system) => [system.id, system]),
) as Record<string, MetroCatalogEntry>
