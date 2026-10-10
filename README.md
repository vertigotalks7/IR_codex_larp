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
- **Short description:** Explore India's metro systems, colored line families, and dated network expansion on one map.
- **Working demo:** Run locally with the commands below.
- **Technology stack:** Vite, React, TypeScript, MapLibre GL JS, OpenStreetMap raster tiles.

### Run the project

1. Prerequisites: Node.js 20+ and npm.
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`
4. Open the printed local URL, then drag the center handle, change years, click a station, and try Playback mode.
5. Production check: `npm run build`

### Current status

- Working features: India-scale map-first atlas viewer, dark settings rail, seven metro-system filters, multiple colored line families, compact historical time slider, station details, milestone playback, and source links.
- Known limitations: Hyderabad currently uses bundled HMRL GTFS route shapes; other systems use OSM subway relations when Overpass is reachable and otherwise show no route layer rather than misleading straight connectors. Complete station-by-station GTFS geometry and dated extensions are still being added city by city. Live train tracking and non-metro rail modes are not implemented yet. OSM tiles and some route data require network access at runtime.
- Libraries and sources: [MapLibre GL JS](https://maplibre.org/), [OpenStreetMap tiles](https://www.openstreetmap.org/copyright), and the system-specific feeds documented in [DATA_SOURCES.md](DATA_SOURCES.md).

See [AI_USAGE.md](AI_USAGE.md) for AI assistance and [CHANGELOG.md](CHANGELOG.md) for the development record.
