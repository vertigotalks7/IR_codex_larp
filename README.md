# Transit Time Machine · India's Historical Railway Atlas

An India rail atlas prototype with metro, national railway GIS, and city-area rail layers. The map is the interface: switch layers, inspect source-backed track geometry, and browse a separate source-linked history page.

**[Event and registration on Luma](https://luma.com/z10nz8gp)** · **[Event rules](RULES.md)** · **[Agent instructions](AGENTS.md)**

## Event details

| Detail | Information |
| --- | --- |
| Venue | JAIN University, Kochi |
| Location | [Open the venue map](https://maps.app.goo.gl/Eme7gR7NDXSNRANu5) |
| Rooms | 2008 and 2009 |
| Check-in | 10 October 2026, 6:00 PM IST |
| Kick-off | 10 October 2026, 6:30 PM IST |
| Wrap-up | 11 October 2026, by 10:00 AM IST |
| Participation | Solo or a team of up to 4 participants |
| Theme | Open — build anything you like |

Keep your approved Luma QR code ready for entry, and bring your laptop and charger. Eligible checked-in participants will receive Codex credits and OpenAI API credits.

## Project overview

1. Select **Use this template → Create a new repository** on GitHub. Create your own project repository and clone it.
2. Read [RULES.md](RULES.md) and [AGENTS.md](AGENTS.md) before building. Begin project implementation at the event.
3. Fill in the project overview below as you build. Use any suitable language or framework, keeping the implementation simple.
4. Record meaningful changes in [CHANGELOG.md](CHANGELOG.md) and your Codex usage in [AI_USAGE.md](AI_USAGE.md). Commit after completed milestones; aim for a meaningful checkpoint about every 30 minutes.
5. Complete [SUBMISSION.md](SUBMISSION.md) with your code repository, short project description, and working demo. Follow submission instructions announced by the organizers.

The implementation was built from scratch during the event. The event rules are in [RULES.md](RULES.md).

## Project overview — complete during the event

- **Project name:** Transit Time Machine
- **Short description:** A source-aware Indian rail atlas with ten metro map layers, a twenty-system source catalog, city-rail infrastructure, and a separate history explorer.
- **Working demo:** Run locally with the commands below.
- **Technology stack:** Vite, React, TypeScript, MapLibre GL JS, OpenStreetMap raster tiles.

### Run the project

1. Prerequisites: Node.js 20+ and npm.
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`
4. Open the printed local URL, switch network layers, inspect a mapped track, and open the History page from the atlas header or landing page.
5. Production check: `npm run build`

### Current status

- Working features: India-scale map-first atlas viewer, metro/rail/city-rail/NHSRCL layer switcher, a separate history page with train-family and region selectors, indexed railway-zone/division records, metro station details, layer toggles, and source links. The atlas map shows current bundled geometry and does not time-travel; historical route reconstruction is not implemented.
- Architecture: Modular component hierarchy (`src/components/` for Landing, Atlas, and Map), separated data and mapping services (`src/services/`), type definitions (`src/types/`), and configurations (`src/config/`).
- Metro coverage: The source catalog has 21 systems with operator/government map references; ten have route geometry bundled in the atlas. The current export contains 626 geometry features (620 OSM track ways and six GTFS shapes) across Delhi, Bengaluru, Chennai, Hyderabad, Kochi, Mumbai, Pune, Noida, Gurugram Rapid Metro, and Navi Mumbai. Kolkata, Jaipur, Ahmedabad–Gandhinagar, Nagpur, Lucknow, Kanpur, Agra, Bhopal, Indore, Meerut, and Patna are listed with their map/source status; geographic geometry not yet imported is visibly marked pending, never replaced by station connectors. Meerut Metro is cataloged separately from Namo Bharat because the services share physical infrastructure; the local bundle has no service-specific Metro route. The map also loads 181 GTFS station records and 121 HOTOSM/OSM station records for Kochi, Mumbai, and Pune. These marker totals are separate from operator station totals: Kochi has 25 named-stop markers (24 source points plus a Vyttila footprint centroid) while KMRL's homepage separately claims 26; Mumbai has 66 partial records with no deduplicated all-operator total; Pune has 30 records/29 names, including its newly added Mandai marker and two Civil Court corridor objects. OSM is contributor-mapped physical infrastructure, not operator-certified service geometry.
- Newly checked station figures: GMRC's FY2024–25 report records 46 operating Phase I/II corridor-station entries for Ahmedabad–Gandhinagar; the catalog labels this dated and non-deduplicated, rather than repeating a 53-entry figure that included unfinished stations. Patna's inferred count is removed because the current public sources do not establish a reconciled passenger total. NCRTC's June 2026 passenger stopping-pattern document supports 12 Meerut Metro stops; a separate span figure in its April folder is noted as a source-definition caveat. See [DATA_SOURCES.md](DATA_SOURCES.md) for links and definitions.
- History explorer: The separate History page now opens as a rolling-stock museum gallery with openly licensed Indian railway photographs and click-to-play Commons films; captions credit each creator and license, while WAP-7 and Vande Bharat technical figures link to RDSO documents. Its division case files contain 68 curated, source-linked dossiers for 69 rostered divisions; Bilaspur is explicitly marked as a research gap rather than filled with weak claims or guessed boundaries/founding dates. A division selection filters the timeline to that division's own dated dossier entries. Junction plots remain sample points, not division boundaries or full station lists. Suburban mode's counts are mapped physical railway features, not a commuter-service station roster. See [DATA_SOURCES.md](DATA_SOURCES.md) for media licenses, history references, and the live-data decision.
- Indian Railways coverage: The map loads 2,390 grouped track sections and junction features from `Railway_Network_.geojson`. The file’s upstream provider and capture date are not recorded in this repository, so this layer is not described as an official or current railway source.
- City rail coverage: Twelve city-focus filters load physical OSM rail tracks and station points clipped to their bounds from the HOTOSM India railways snapshot dated 10 May 2026. This is infrastructure context, not an operator-verified suburban service map; the Bengaluru Suburban Rail Project is not represented as an operating service. K-RIDE's 2026 Corridor 4 engineering KMZ was inspected but not imported because its thousands of unclassified drawing shapes do not isolate the corridor centerline.
- NHSRCL coverage: NHSRCL’s technical-details page lists an MAHSR alignment KMZ, but this project has not retrieved and verified the file. The selector remains available as a source reference and deliberately draws no guessed alignment.
- Live status: The map displays static GIS/GTFS network geometry, not live train locations. Atlas header links to official NTES for passenger train-running enquiry. CRIS documents NTES/COA/RTIS systems, but no public API/GTFS-Realtime contract or reuse terms were identified; the project does not scrape undocumented services or simulate live positions. An authorized API arrangement would be required before adding in-map tracking.
- Performance and limitations: MapLibre is loaded only after entering the atlas. City rail geometry is fetched on demand per selected city; selecting all twelve areas downloads each city bundle. Metro geometry is bundled locally, so it does not depend on a runtime GTFS or Overpass request. Museum photographs and video posters are fetched from Wikimedia Commons; video streams have `preload="none"` and only load when played. The national rail layer still loads a multi-megabyte GeoJSON bundle. OSM base tiles require runtime network access.
- Data pipeline: `npm run data:build` builds the metro SQLite cache and browser export from the included GTFS inputs and `data/source/openstreetmap/metro-ways-2026-10-11.json`; verified OSM metro station points are bundled in `public/data/metro-stations-osm.json` and the supplemental `public/data/metro-stations-extra.json`. `npm run data:build:suburban` rebuilds city-area OSM bundles and needs the HOTOSM snapshot at `data/source/hotosm/railways.geojson` plus its `README.txt`. `npm run data:build:rail` needs `Railway_Network_.geojson` at the repository root; that raw source is not committed and its provenance is unresolved. The browser reads generated GeoJSON; SQLite is a local build artifact, not a runtime server/database.
- Libraries and sources: [MapLibre GL JS](https://maplibre.org/), [OpenStreetMap tiles](https://www.openstreetmap.org/copyright), and the system-specific feeds documented in [DATA_SOURCES.md](DATA_SOURCES.md).

See [AI_USAGE.md](AI_USAGE.md) for AI assistance and [CHANGELOG.md](CHANGELOG.md) for the development record.
