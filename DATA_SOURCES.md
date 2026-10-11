# Transit Time Machine data sources

This ledger distinguishes geometry actually bundled by the app from source references and unverified project data. Reviewed on 11 October 2026.

## Metro

| System | Source | What the app currently has |
| --- | --- | --- |
| Hyderabad | [HMRL open data](https://hmrl.co.in/open-data/) | Bundled route shapes and station records imported from GTFS. |
| Bengaluru | [BMRCL GTFS extraction](https://github.com/Vonter/bmrcl-gtfs) | Bundled route shapes and station records imported from GTFS. |
| Chennai | [ChennaiGTFS](https://github.com/ungalsoththu/ChennaiGTFS) | Bundled route shapes and station records imported from GTFS. |
| Delhi | [DMRC network](https://delhimetrorail.com/pages/about-us/present-network) · [DMRC static GTFS](https://otd.delhi.gov.in/data/staticDMRC/) | System metadata and sample station records only; no verified route geometry bundle. |
| Kochi | [KMRL open data](https://corporate.kochimetro.org/open-data) | No verified route geometry bundle. The local project has not captured a reproducible GTFS download. |
| Mumbai | [MMRDA](https://www.mmrda.maharashtra.gov.in/) | System metadata and sample station records only; no verified route geometry bundle. |
| Pune | [Maha Metro](https://www.punemetrorail.org/) | System metadata and sample station records only; no verified route geometry bundle. |

The interactive route bundle contains three metro systems. Missing systems render no line instead of a straight station-to-station fallback. Current geometry is not a historical reconstruction: the year slider uses broad opening milestones and does not model every phased extension. A generated timestamp in `public/data/routes.json` is the export build time, not proof of the upstream feed's update date.

## Indian Railways national track layer

- Generated route asset: `public/data/railway-routes.json` (2,390 grouped features); junction layers are in `public/data/railway-major-junctions.json` and `public/data/railway-junctions.json`.
- Local build input: `Railway_Network_.geojson` (about 83.6 MB). The raw input is excluded from Git. Its filename and properties do not establish an upstream provider or snapshot date, and this repository does not contain a source URL or a reliable chain of custody. Therefore the map and UI call it a project railway-GIS snapshot, not an official or current Indian Railways dataset.
- `scripts/build-railway-network.mjs` simplifies and groups input geometry and derives junction points. Its output features are physical track sections, not scheduled train paths. It must not be treated as proof of service, operational status, or current speed.
- Rebuild with `npm run data:build:rail` after obtaining the exact source file and recording its provider, license, publication date, and checksum. Without that provenance, keep the committed generated asset as-is and do not claim the pipeline is reproducible from this repository alone.

## City rail track context (shown under “Suburban Rail”)

- Source: [HOTOSM India Railways dataset on HDX](https://data.humdata.org/dataset/hotosm_ind_railways), extracted from OpenStreetMap; license reported in the snapshot README as ODbL.
- Snapshot date: 10 May 2026, as recorded in `data/source/hotosm/README.txt`.
- Geometry: physical `railway=rail` ways and `railway=station` points, clipped to six city-focus bounding boxes (Mumbai, Kolkata, Chennai, Delhi NCR, Hyderabad, Pune). The builder preserves the source line paths and clips them at city boundaries; it does not infer routes between stations.
- Important limitation: these are mapped tracks in urban extents, not operator-verified suburban train services. The data does not distinguish passenger, commuter, or freight use and does not support the previous ridership or route-km figures. The interface labels this distinction.
- The raw 91.9 MB source is excluded from Git. To rebuild, place the matching `railways.geojson` and source `README.txt` under `data/source/hotosm/`, then run `npm run data:build:suburban`. The app fetches only the selected city's bundle; selecting all areas fetches all six.

## NHSRCL / high-speed rail

- Reference: [NHSRCL project overview](https://nhsrcl.in/index.php/en/project/project-overview), which describes the Mumbai–Ahmedabad project and its current station plan.
- Geometry status: no NHSRCL alignment geometry is bundled. The NHSRCL site has referenced an MAHSR KMZ download, but a downloadable asset was not retrievable from the official page during this update. The map intentionally draws no line until that file can be obtained, dated, licensed/attributed, and converted into a local asset.
- No line is interpolated from station coordinates. The official page is a reference, not a geometry source in the current app.

## Map base and runtime behavior

- Basemap tiles: [OpenStreetMap](https://www.openstreetmap.org/copyright), fetched at runtime. Tile availability depends on network access and OSM tile usage policy.
- Route data is bundled as static GeoJSON. There is no application backend or live tracking API. `data/routes.sqlite` is a local build artifact; the browser reads the generated GeoJSON export.
- The map status reflects loaded data. Failed/missing railway bundles leave the route layer empty; runtime railway connector fallbacks are not used.
