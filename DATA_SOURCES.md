# Transit Time Machine data sources

The current app is an India-wide metro overview with seven systems. This file records exactly where the metadata comes from and where the current implementation is still approximate.

## India metro system sources

The system selector and line families in `src/data.ts` are linked to these operator or public-feed sources:

| System | Operator / source | Data status in this build |
| --- | --- | --- |
| Delhi Metro | [DMRC network](https://delhimetrorail.com/pages/about-us/present-network) · [DMRC static GTFS](https://otd.delhi.gov.in/data/staticDMRC/) | Source-backed sample stations and line metadata |
| Namma Metro | [BMRCL](https://english.bmrc.co.in/) · [BMRCL GTFS extraction](https://github.com/Vonter/bmrcl-gtfs) | System and line overview; station sample |
| Chennai Metro | [CMRL](https://chennaimetrorail.org/) · [Chennai GTFS](https://github.com/ungalsoththu/ChennaiGTFS) | System and line overview; station sample |
| Hyderabad Metro | [HMRL](https://hmrl.co.in/) · [Mobility Database official feed record](https://mobilitydatabase.org/feeds/gtfs/mdb-2457) | System and line overview; station sample |
| Kochi Metro | [KMRL](https://kochimetro.org/) · [KMRL GTFS reference](https://www.urbanmobilityindia.in/Upload/Conference/e1180c5c-edea-4c77-9efb-59c56f8d8aa3.pdf) | System and line overview; station sample |
| Mumbai Metro | [MMRDA](https://www.mmrda.maharashtra.gov.in/) · [Metro2Go source notes](https://www.metro2go.in/data-sources) | System and line overview; station sample |
| Pune Metro | [Maha Metro](https://www.punemetrorail.org/) | System and line overview; station sample |

## Station coordinates and line membership

- Source snapshot: [dhirajt/delhi-metro-stations `metro.json`](https://github.com/dhirajt/delhi-metro-stations/blob/master/metro.json)
- Raw data: [raw `metro.json`](https://raw.githubusercontent.com/dhirajt/delhi-metro-stations/master/metro.json)
- License reported by the repository: BSD-3-Clause.
- Used fields: station name, line membership, longitude, and latitude.
- Current use: the seven stations shown in `src/data.ts` use the published coordinate values from this snapshot. The app keeps the source URL on each station record.

## Opening dates and operator context

- [Delhi Metro Rail Corporation — present network and line opening details](https://delhimetrorail.com/pages/about-us/present-network)
- [OpenStreetMap Delhi Metro relations and line metadata](https://wiki.openstreetmap.org/wiki/Delhi_Metro)
- [NCRTC project overview](https://ncrtc.in/overview-project/)

The year values in the current sample are network milestone years intended for the historical slider. Before claiming station-by-station opening precision, each station should be checked against DMRC’s official opening notices or a dated official project document.

## Geometry status

Hyderabad, Bengaluru, and Chennai now ship with route geometry generated from each feed’s `shapes.txt`, joined to `routes.txt` through `trips.txt`. The representative geometry is the longest published shape for each feed route. Their station catalogs are imported from `stops.txt`, deduplicated to station-level records, and linked to lines through `stop_times.txt`. The required source snapshots are committed in `data/source/`; `scripts/build-route-database.mjs` stores these shapes and stations in `data/routes.sqlite` and exports `public/data/routes.json`. HMRL’s source repository documents the required attribution: “Contains data provided by Hyderabad Metro Rail Ltd.” BMRCL’s repository is marked ODbL and documents that its spatial data is built from OpenStreetMap; ChennaiGTFS documents its CMRL source and licensing caveats.

For the remaining systems, the app requests current metro route geometry from OpenStreetMap route relations through the [Overpass API](https://overpass-api.de/). For each selected metro system it queries subway relations within a 30 km radius of the system center and renders the returned way geometries. The query template is:

```text
[out:json][timeout:30];
relation["route"="subway"](around:30000,<lat>,<lon>);
out body geom;
```

The browser caches successful OSM results for the session. If Overpass is unavailable, the UI reports `route geometry unavailable` and intentionally renders no route line; the old compact station-to-station connectors are not used as a fallback. OSM and bundled GTFS geometry represent current/published alignments, so the historical slider gates systems by opening year but does not reconstruct every historical extension yet.

The Delhi station points in the current sample are source-backed. The station samples for other systems are representative endpoints linked to their public operator/feed sources. Complete station-by-station GTFS shapes and dated extensions remain the next data milestone before presenting the map as a survey-accurate national atlas.

## Reproduction notes

The source snapshot was inspected on 10 October 2026. To refresh the coordinates, download the raw JSON, filter records whose `details.line` contains `Yellow Line`, and preserve the source version/date in this file. Do not silently mix current OSM geometry with historical opening dates: OSM represents present-day physical features, while the time slider needs dated infrastructure records.

## National rail and high-speed research queue

There is no open, official nationwide Indian Railways GIS layer ready to embed in a web atlas. The planned physical-network base is the [Geofabrik India OpenStreetMap extract](https://download.geofabrik.de/asia/india.html), kept as a versioned local snapshot under ODbL attribution. Official Railway Board maps, the [National Rail Plan](https://indianrailways.gov.in/ExeSummary-24122020.pdf), Pink Books, and zonal construction lists are validation and historical-event sources rather than substitute geometry.

High-speed rail will start with the Mumbai–Ahmedabad corridor only after a source-reviewed project geometry is added from [NHSRCL feasibility material](https://nhsrcl.in/en/project/feasibility-study-report). Other corridors are status records only until official alignments are published. The complete data contract and source priority are in [ATLAS_ARCHITECTURE.md](ATLAS_ARCHITECTURE.md).
