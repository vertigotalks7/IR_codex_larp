# Transit Time Machine data sources

The current app is a deliberately small Delhi sample. This file records exactly where the data comes from and where the current implementation is still approximate.

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

The station points in the current sample are source-backed. The Yellow Line sample is a connector through the sourced station points; it is not yet a full OSM centerline or a complete 37-station Yellow Line geometry. The Blue, Magenta, and Indian Railways lines remain contextual sample connectors. They must be replaced with complete source geometries before presenting the app as a survey-accurate national atlas.

## Reproduction notes

The source snapshot was inspected on 10 October 2026. To refresh the coordinates, download the raw JSON, filter records whose `details.line` contains `Yellow Line`, and preserve the source version/date in this file. Do not silently mix current OSM geometry with historical opening dates: OSM represents present-day physical features, while the time slider needs dated infrastructure records.
