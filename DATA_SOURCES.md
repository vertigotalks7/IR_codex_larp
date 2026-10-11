# Transit Time Machine data sources

This ledger distinguishes geometry actually bundled by the app from source references and unverified project data. Reviewed on 11 October 2026.

## Metro

| System | Source | What the app currently has |
| --- | --- | --- |
| Hyderabad | [HMRL open data](https://hmrl.co.in/open-data/) · [OpenCity GTFS resource](https://data.opencity.in/dataset/hyderabad-metro-rail-gtfs) | Three GTFS route shapes and GTFS station records. `feed_info.txt` dates this feed to 3 July 2026. |
| Bengaluru | [BMRCL GTFS extraction](https://github.com/Vonter/bmrcl-gtfs) | Three GTFS route shapes and GTFS station records; the local feed has no recorded snapshot date. |
| Chennai | [OpenStreetMap contributors](https://www.openstreetmap.org/) · [CMRL Phase I map](https://chennaimetrorail.org/metro-line-map/) | OSM physical subway-track ways from the 11 October 2026 snapshot, with GTFS station records. The local Chennai GTFS route shapes are excluded because the source records used station-to-station interpolation rather than surveyed track geometry. |
| Delhi NCR | [DMRC present network](https://delhimetrorail.com/pages/about-us/present-network) · [DMRC March 2026 network map](https://delhimetrorail.com/static/media/DMRC-Network-Map_Jan2026_Hindi-English-13.03.2026.147097c4.pdf) · [OpenStreetMap contributors](https://www.openstreetmap.org/) | DMRC lists the Majlis Park–Maujpur-Babarpur Pink Line and Deepali Chowk–Majlis Park Magenta Line sections as operational from 8 March 2026. OSM mapped track ways captured 11 October 2026 supply the display geometry; they are not operator-issued shapes. |
| Kochi | [KMRL Phase I status](https://kochimetro.org/phase-1-status/) · [OpenStreetMap contributors](https://www.openstreetmap.org/) | OSM mapped track ways captured 11 October 2026. This is physical geometry, not an operator-issued GTFS feed. |
| Mumbai | [MMRDA present status](https://mmrda.maharashtra.gov.in/en/node/1229) · [OpenStreetMap contributors](https://www.openstreetmap.org/) | MMRDA's status updated 31 August 2026 lists operating sections of Line 2B from 7 April and 13 August 2026. OSM mapped track ways captured 11 October 2026 supply display geometry; the bundled line families are not operator-issued shapes. |
| Pune | [Maha Metro route maps](https://www.mahametro.org/route_maps.html) · [OpenStreetMap contributors](https://www.openstreetmap.org/) | OSM mapped track ways captured 11 October 2026. The route-map page identifies the two operational route families; the app uses OSM for physical geometry. |

The browser bundle (`public/data/routes.json`) contains 619 mapped geometry features across all seven metro selectors: 613 individual OSM track ways and six GTFS shapes. The OSM query base timestamp is 11 October 2026. The only dated GTFS source in the local inputs is Hyderabad (3 July 2026); the Bengaluru and Chennai station-feed snapshot dates are not recorded. HMRL asks for the attribution “Contains data provided by Hyderabad Metro Rail Ltd.” and reserves its rights in the data; see [HMRL open-data terms](https://hmrl.co.in/open-data/). Metro geometry is loaded from the local bundle and does not depend on a runtime Overpass request. The map click inspector links each OSM way or identifies a GTFS shape. These OSM ways are community-mapped physical infrastructure, not operator-certified complete service paths; explicit construction, depot, test, and out-of-scope features are filtered, but OSM tagging can be incomplete. Chennai ways without a line tag use a neutral color rather than being assigned to a named line. The old hand-authored station-connector route arrays have been removed. The history page is a source-linked event register; it does not animate or reconstruct historical track geometry.

Source files: `data/source/openstreetmap/metro-ways-2026-10-11.json` and its `README.txt`; GTFS inputs are under `data/source/{hyderabad,bengaluru,chennai}/`. The export build timestamp is not treated as an upstream data date.

## Indian Railways national track layer

- Generated route asset: `public/data/railway-routes.json` (2,390 grouped features); junction layers are in `public/data/railway-major-junctions.json` and `public/data/railway-junctions.json`.
- Local build input: `Railway_Network_.geojson` (about 83.6 MB). The raw input is excluded from Git. Its filename and properties do not establish an upstream provider or snapshot date, and this repository does not contain a source URL or a reliable chain of custody. Therefore the map and UI call it a project railway-GIS snapshot, not an official or current Indian Railways dataset.
- `scripts/build-railway-network.mjs` simplifies and groups input geometry and derives junction points. Its output features are physical track sections, not scheduled train paths. It must not be treated as proof of service, operational status, or current speed.
- Rebuild with `npm run data:build:rail` after obtaining the exact source file and recording its provider, license, publication date, and checksum. Without that provenance, keep the committed generated asset as-is and do not claim the pipeline is reproducible from this repository alone.

## City rail track context (shown under “Suburban Rail”)

- Source: [HOTOSM India Railways dataset on HDX](https://data.humdata.org/dataset/hotosm_ind_railways), extracted from OpenStreetMap; license reported in the snapshot README as ODbL.
- Snapshot date: 10 May 2026, as recorded in `data/source/hotosm/README.txt`.
- Geometry: physical `railway=rail` ways and `railway=station` points, clipped to twelve city-focus bounds: Mumbai, Kolkata, Chennai, Delhi NCR, Hyderabad, Pune, Bengaluru, Ahmedabad, Jaipur, Lucknow, Nagpur, and Bhopal. The builder preserves the source line paths and clips them at city boundaries; it does not infer routes between stations.
- Important limitation: these are mapped tracks in urban extents, not operator-verified suburban train services. The data does not distinguish passenger, commuter, or freight use and does not support the previous ridership or route-km figures. The interface labels this distinction.
- The raw 91.9 MB source is excluded from Git. To rebuild, place the matching `railways.geojson` and source `README.txt` under `data/source/hotosm/`, then run `npm run data:build:suburban`. The app fetches only the selected city's bundle; selecting all areas fetches all twelve.
- “Suburban Rail” remains a UI layer name for city rail context. These are not verified commuter-service routes, and a focus area does not imply that a dedicated suburban rail system operates there. K-RIDE's [project page](https://kride.in/sub-urban-rail-project/) and [current tender listings](https://kride.in/tender/) document the separate Bengaluru Suburban Rail Project (BSRP), which is still under construction. A 2026 Corridor 4 package KMZ was reviewed, but it contains thousands of unlabeled engineering drawing shapes rather than an identifiable corridor centerline; it is not used as service geometry. BSRP is not drawn as commissioned service.

## NHSRCL / high-speed rail

- Reference: [NHSRCL project overview](https://nhsrcl.in/index.php/en/project/project-overview) and [official technical details page](https://www.nhsrcl.in/en/project/technical_details). The technical-details page, last updated 27 May 2026, lists an MAHSR alignment KMZ download.
- Geometry status: the official KMZ is not archived in this repository. Retrieval of the linked asset could not be completed during this update, so the selector remains as a source reference but draws no line. The map will not infer an alignment from station coordinates.

## Map base and runtime behavior

- Basemap tiles: [OpenStreetMap](https://www.openstreetmap.org/copyright), fetched at runtime. Tile availability depends on network access and OSM tile usage policy.
- Route data is bundled as static GeoJSON. There is no application backend or live tracking API. `data/routes.sqlite` is a local build artifact; the browser reads the generated GeoJSON export.
- The map status reflects loaded data. Failed/missing geometry leaves the route layer empty; runtime connector fallbacks are not used.
