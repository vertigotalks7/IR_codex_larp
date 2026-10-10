# Transit Time Machine — Atlas architecture

## Product boundary

The product is becoming an India rail atlas with three distinct layers:

1. Metro systems — current verified geometry and station data, followed by dated city-level extension history.
2. Indian Railways — a versioned physical-network layer, then services and historical infrastructure events.
3. High-speed rail and major projects — operational, under-construction, sanctioned, and proposed corridors with their evidence kept distinct.

The map must never draw a route just because a station list exists. A route is shown only when its alignment and source are stored in the atlas database.

## Data model

```text
Source → System → Line → Segment → Station
                     └──────────→ Historical event
                     └──────────→ Project / service
```

Each source record requires its URL, retrieval timestamp, licence/attribution, hash, and coverage notes. Infrastructure geometry has a source snapshot date separate from the date an event became effective. This prevents present-day geometry from being misrepresented as historical alignment.

## Source hierarchy

| Layer | Primary geometry source | Validation and history source | Publish state |
| --- | --- | --- | --- |
| Current national rail | [Geofabrik India OSM extract](https://download.geofabrik.de/asia/india.html) | [Indian Railways National Rail Plan](https://indianrailways.gov.in/ExeSummary-24122020.pdf), zonal maps, and Railway Board records | Planned ingestion |
| Delhi Metro | [Delhi Transport Stack DMRC static data](https://delhi.transportstack.in/data-services/datadetails/2) | [DMRC network map](https://delhimetrorail.com/static/media/DMRC-Network-Map-Jan2026-Hindi-%26-English-20.02.26.70b6cd03.pdf) | Validate GTFS shapes before import |
| Kochi Metro | [KMRL Open Data](https://corporate.kochimetro.org/open-data) | Operator notices and package validity dates | Priority import |
| Mumbai / Pune Metro | Versioned OSM route snapshot | Official station lists and alignment maps | Validate before import |
| Mumbai–Ahmedabad HSR | Curated alignment based on [NHSRCL feasibility material](https://nhsrcl.in/en/project/feasibility-study-report) | NHSRCL / Ministry of Railways status updates | Planned project layer |
| Other HSR corridors | Official project status only | [Ministry of Railways releases](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2226302&lang=1&reg=3) | Do not map alignments until published |

## Dynamic history rules

Every change is an event, not a UI-only year filter:

- `opened`, `extended`, `closed`, `renamed`
- `gauge_converted`, `electrified`, `doubled`
- `construction_started`, `commissioned`, `proposed`

An event carries an effective date/year, its affected segment/station, a source URL, retrieval date, and confidence status. The slider can then toggle real segments and stations by date.

## Delivery order

1. Complete current verified metro snapshots: Kochi, Delhi, Pune, Mumbai.
2. Add event-level history for two well-documented metro systems.
3. Ingest and validate the current OSM/Geofabrik national track network.
4. Add high-speed and freight-corridor project layers.
5. Add historical mainline rail records incrementally with visible confidence labels.

## Trust states

- Verified — official GTFS/operator geometry.
- Validated — public geometry checked against official station/alignment records.
- Historical approximation — evidence-backed but not surveyed geometry.
- Unavailable — hidden from the map; never replaced by straight connectors.
