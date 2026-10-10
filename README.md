# Transit Time Machine · India's Historical Railway Atlas

An interactive, source-backed atlas of India's metro systems. The map is the interface: filter cities, compare colored line families, move the compact time slider, inspect stations, or play the historical milestones.

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
- **Short description:** A source-aware historical atlas for India’s metros today, expanding to conventional rail and high-speed project layers as their records are verified.
- **Working demo:** Run locally with the commands below.
- **Technology stack:** Vite, React, TypeScript, MapLibre GL JS, OpenStreetMap raster tiles.

### Run the project

1. Prerequisites: Node.js 20+ and npm.
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`
4. Open the printed local URL, then drag the center handle, change years, click a station, and try Playback mode.
5. Production check: `npm run build`

### Current status

- Working features: India-scale map-first atlas viewer, dark settings rail, seven metro-system filters, multiple colored line families, compact historical time slider, station details, milestone playback, interactive map layer toggles, and source links.
- Architecture: Modular component hierarchy (`src/components/` for Landing, Atlas, and Map), separated data and mapping services (`src/services/`), type definitions (`src/types/`), and configurations (`src/config/`).
- Product direction: a vintage landing page now introduces the atlas, with separate Metro, Indian Railways, and High-Speed Rail paths. Only the Metro path is currently interactive; broader coverage is tracked in [ATLAS_ARCHITECTURE.md](ATLAS_ARCHITECTURE.md).
- Performance: MapLibre is loaded only after opening the metro atlas. The landing page also links to the clearly labelled official/source maps for Indian Railways, suburban networks, and NHSRCL while their interactive geometry is prepared.
- Network switcher: The atlas sidebar switches among Metro, Indian Railways, Suburban Rail, and NHSRCL modes. In Indian Railways mode, the map features authentic national GIS track network data across 16 railway zones (Southern, Northern, Western, Central, South Central, Eastern, Konkan, etc.) with 2,390 route sections and 2,033 real junction stations, sourced from official Indian Railways GIS data (`Railway_Network_.geojson`, 83.6 MB) and HDX OSM exports. Users can filter by individual zonal networks or view the entire country's physical rail tracks with interactive speed limits, gauges, track lengths, and junction details. It also includes interactive tracking for Train 17216 (Dharmavaram–Machilipatnam Express) with 22 station stops, timetables, and live GPS radar tracker simulation inspired by RailRadar. Suburban Rail and NHSRCL modes remain reference modes while their geometry imports are verified.
- Known limitations: Hyderabad, Bengaluru, and Chennai load verified GTFS route shapes and station catalogs from the local SQLite/GeoJSON data bundle. National Indian Railways corridors and Train 17216 provide verified GIS track and junction station data. Delhi, Kochi, Mumbai, and Pune metro systems await reviewed local source snapshots. Real-time train tracking is driven by route progress simulation/scrubbing; national live NTES sockets are planned for future phases. OSM base tiles require network access at runtime.
- Data pipeline: Run `npm run data:build` to rebuild `data/routes.sqlite` and the browser export at `public/data/routes.json` from the committed GTFS source snapshots in `data/source/`. SQLite is the canonical local store; the frontend reads the generated export for fast browser loading.
- Libraries and sources: [MapLibre GL JS](https://maplibre.org/), [OpenStreetMap tiles](https://www.openstreetmap.org/copyright), and the system-specific feeds documented in [DATA_SOURCES.md](DATA_SOURCES.md).

See [AI_USAGE.md](AI_USAGE.md) for AI assistance and [CHANGELOG.md](CHANGELOG.md) for the development record.
