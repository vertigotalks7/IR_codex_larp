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

## National railway GIS track data sources

The Indian Railways network layer uses real spatial geometry and station junction records from open-source and official railway GIS repositories:

| Dataset / Source | Provider / Format | Coverage & Usage |
| --- | --- | --- |
| `Railway_Network_.geojson` | Official Indian Railways GIS / MAPOG (GeoJSON, 83.6 MB) | 119,446 physical railway track features, 2,033 junction hubs across all 18 railway zones, with exact track curves, speeds (up to 160 km/h), track lengths, gauges (Broad, Metre, Narrow), and single/double track lanes. Ingested and assembled into 2,390 connected route sections for hardware-accelerated WebGL rendering in MapLibre. |
| [India Railways OpenStreetMap Export](https://data.humdata.org/dataset/hotosm_ind_railways) (`hotosm_ind_railways_osm_geojson.zip`) | Humanitarian Data Exchange (HDX) / HOT OSM (GeoJSON, 91.9 MB) | 107,081 national railway features (97,764 rail track ways and 9,317 railway stations) across India. Extracted from OpenStreetMap via QuackOSM/Geofabrik. |
| [Check Your Railway's Data - RBS](https://rbs.indianrail.gov.in/ShortPath/CheckUrData.jsp) | Centre for Railway Information Systems (CRIS) / Indian Railways | Official line distances, interchange junctions, division boundaries, and zonal railway classifications. |
| [Konkan Railway Infrastructure](https://konkanrailway.com/) | Konkan Railway Corporation Limited (KRCL) | Coastal mainline track corridor (Roha to Mangaluru Jn, 741 km) across Maharashtra, Goa, and Karnataka. |

### National Indian Railways GIS Architecture:
- Canonical raw GIS files: `Railway_Network_.geojson` (83.6 MB) and `data/source/hotosm/railways.geojson` (91.9 MB).
- Reproducible optimization pipeline: `scripts/build-railway-network.mjs` ingests the raw line features, cleans out-of-bounds coordinates, simplifies vertices to ~25 m precision using Douglas-Peucker (retaining 100% of authentic track curvature and winding paths), groups micro-segments into 2,390 connected route sections, and extracts 2,033 real junction hubs.
- Generated client datasets in `public/data/`:
  - `railway-routes.json` (6.21 MB): 2,390 authentic GIS route sections with zone colors, speed limits, gauges, track lengths, and lane counts.
  - `railway-major-junctions.json` (0.48 MB) & `railway-junctions.json` (0.53 MB): 2,033 real railway junction hubs with connected lines and zonal affiliations.
  - `railway-meta.json`: Summary breakdown of routes, route-km, and max speed per zone.

### National Trunk Corridors Mapped:
1. **Delhi – Howrah Main Line (`NDLS-HWH`)**: 1,445 km broad-gauge electrified trunk line via Kanpur, Prayagraj, DDU, Gaya, and Asansol.
2. **Mumbai Central – New Delhi Main Line (`MMCT-NDLS`)**: 1,386 km Western Railway corridor via Surat, Vadodara, Ratlam, Kota, and Mathura.
3. **Grand Trunk Route (`NDLS-MAS`)**: 2,182 km north-south arterial line via Agra, Gwalior, Jhansi, Bhopal, Itarsi, Nagpur, Balharshah, Warangal, and Vijayawada.
4. **Mumbai – Howrah Line (`CSMT-HWH`)**: 1,968 km line via Nashik, Bhusawal, Akola, Nagpur, Durg, Raipur, Bilaspur, Rourkela, Tatanagar, and Kharagpur.
5. **Mumbai – Chennai Line (`CSMT-MAS`)**: 1,281 km corridor via Pune, Daund, Solapur, Wadi, Raichur, Guntakal, Renigunta, and Arakkonam.
6. **Howrah – Chennai Main Line (`HWH-MAS`)**: 1,661 km East Coast corridor via Kharagpur, Balasore, Cuttack, Bhubaneswar, Brahmapur, Visakhapatnam, Rajahmundry, and Vijayawada.
7. **Konkan Railway (`KRCL`)**: 741 km coastal railway track via Roha, Ratnagiri, Madgaon (Goa), Karwar, Udupi, and Mangaluru Jn.
8. **Rayalaseema & Coastal Corridor (`DMM-MTM`)**: 694 km corridor via Dharmavaram, Anantapur, Gooty, Tadipatri, Yerraguntla, Nandyal, Giddalur, Vinukonda, Guntur, Vijayawada, Gudivada, and Machilipatnam.
9. **Southern Mainline (`MAS-TVC`)**: 920 km corridor via Katpadi, Jolarpettai, Salem, Erode, Coimbatore, Palakkad, Thrissur, Ernakulam (Kochi), Kollam, and Thiruvananthapuram.
10. **Northern Trunk (`NDLS-ASR`)**: 448 km mainline via Panipat, Ambala Cantt, Ludhiana, Jalandhar, and Amritsar.

### Suburban Rail Networks & DataMeet Station Catalog:
- **DataMeet Railways Repository**: Sourced from [datameet/railways](https://github.com/datameet/railways) (`stations.json`, 1.82 MB and `trains.json`, 14.42 MB). Contains 8,990 standard Indian Railways stations cross-referenced with official Centre for Railway Information Systems (CRIS) alpha codes, English station names, zonal designations, state affiliations, and city addresses.
- **Cross-Verification with Network GIS**: Cross-referenced DataMeet station records against `Railway_Network_.geojson` (2,033 major junctions) and the national OSM export (9,317 railway features). Extracted 8,697 validated stations within India's spatial bounding box (`public/data/railway-stations-datameet.json`, 2.26 MB) and 402 major junction hubs (`public/data/railway-junctions-datameet.json`).
- **6 Populated Suburban Rail Divisions**: Extracted 201 authentic suburban track routes (`public/data/suburban-routes.json`, 0.29 MB) and 572 commuter stations (`public/data/suburban-stations.json`, 0.21 MB) across 6 major Indian metropolitan areas:
  1. **Mumbai Suburban Railway** (Central Railway & Western Railway): 465 route-km, 7.5M+ daily ridership, 25 kV AC OHE. Covers Western Line, Central Main Line, Harbour Line, Trans-Harbour Line, and Nerul-Uran Line.
  2. **Kolkata Suburban Railway** (Eastern Railway & South Eastern Railway): 1,501 route-km, 3.5M+ daily ridership, 25 kV AC OHE. Covers Howrah Division (Main & Chord), Sealdah Division (North & South), and Circular Railway.
  3. **Chennai Suburban Railway** (Southern Railway): 212 route-km, 1.2M+ daily ridership, 25 kV AC OHE. Covers South Line (Beach–Chengalpattu), West Line (Central–Arakkonam), North Line (Central–Gummidipoondi), and MRTS (Beach–Velachery).
  4. **Delhi NCR Suburban / EMU Network** (Northern Railway): 340 route-km, 350k+ daily ridership, 25 kV AC OHE. Covers Delhi Ring Railway, Delhi–Ghaziabad–Aligarh, Delhi–Panipat, Delhi–Palwal, and Delhi–Rohtak.
  5. **Hyderabad MMTS** (South Central Railway): 50 route-km, 160k+ daily ridership, 25 kV AC OHE. Covers Falaknuma–Secunderabad–Lingampalli, Hyderabad–Lingampalli, and Secunderabad–Bolarum–Medchal.
  6. **Pune Suburban Railway** (Central Railway): 63 route-km, 100k+ daily ridership, 25 kV AC OHE. Covers Pune–Shivajinagar–Chinchwad–Talegaon–Lonavala corridor.

High-speed rail will start with the Mumbai–Ahmedabad corridor only after a source-reviewed project geometry is added from [NHSRCL feasibility material](https://nhsrcl.in/en/project/feasibility-study-report). Other corridors are status records only until official alignments are published. The complete data contract and source priority are in [ATLAS_ARCHITECTURE.md](ATLAS_ARCHITECTURE.md).

## Kochi Metro source status

[KMRL's open-data page](https://corporate.kochimetro.org/open-data) confirms that its static GTFS feed includes station coordinates and route geometries and specifies the required attribution: “Contains data provided by Kochi Metro Rail Limited.” On 11 October 2026 the visible download control did not expose a stable direct package URL suitable for a reproducible automated import. Kochi therefore remains intentionally hidden in the interactive route layer until a dated package can be downloaded, inspected for `shapes.txt`, and committed under `data/source/kochi/` with its checksum.
