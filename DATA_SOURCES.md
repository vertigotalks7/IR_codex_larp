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

The Delhi station points in the current sample are source-backed. The cross-city colored lines are system-level overview connectors so the India map can establish the product shape without pretending that a handful of points are complete rail alignments. They must be replaced with complete GTFS `shapes.txt` or OSM route geometries, and the station samples expanded, before presenting the map as a survey-accurate national atlas.

## Reproduction notes

The source snapshot was inspected on 10 October 2026. To refresh the coordinates, download the raw JSON, filter records whose `details.line` contains `Yellow Line`, and preserve the source version/date in this file. Do not silently mix current OSM geometry with historical opening dates: OSM represents present-day physical features, while the time slider needs dated infrastructure records.
