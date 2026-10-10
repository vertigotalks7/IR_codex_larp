# Change log

Record each meaningful project change during the event, newest first. Update this file in the same commit as the change. Use a real timestamp with timezone, for example `YYYY-MM-DDTHH:MM:SS+05:30`.

## Event build log

## 2026-10-11T00:58:00+05:30 — Fix route switching race condition

- Changed: Added versioned route hydration so a slow request from a previously selected metro cannot overwrite the currently selected map. Local route/station data is re-applied only for the active system/year selection.
- Why: Switching metro systems could leave the map with an empty or stale route layer while asynchronous OSM requests were still completing.
- Validation: `npm run build` passed; `git diff --check` passed.
- Limitations: Systems without a verified local snapshot still remain unavailable when their OSM request fails.

## 2026-10-11T00:42:00+05:30 — Fix data integrity and apply vintage atlas UI

- Changed: Committed the three GTFS source snapshots used by the local rebuild, linked stations to route IDs through `stop_times.txt`, added station line membership to SQLite/export records, updated station details, and restyled the map viewer with warm paper, oxblood, brass, serif, and sepia cartographic treatment.
- Why: The prior database had coordinates but incomplete provenance/linkage, the rebuild depended on deleted temporary files, and the dark neon chrome did not match the requested vintage atlas direction.
- Validation: `npm run data:build` produced 14 route shapes and 181 stations, with 179 station records carrying line membership; `npm run build` passed.
- Limitations: The committed source snapshots cover Hyderabad, Bengaluru, and Chennai. Delhi, Kochi, Mumbai, and Pune still need validated source snapshots.

## 2026-10-11T00:12:00+05:30 — Import Bengaluru and Chennai route/station catalogs

- Changed: Extended the local SQLite pipeline to ingest Hyderabad, Bengaluru, and Chennai GTFS feeds, including 14 route shapes and 181 station records. The frontend now reads local routes and stations for all three systems, replacing the two-station samples.
- Why: Only Hyderabad had real local geometry; the other visible metro systems still showed sparse samples or depended on Overpass.
- Validation: `npm run data:build` generated 14 route shapes and 181 stations; `npm run build` passed.
- Limitations: Delhi, Kochi, Mumbai, and Pune still require validated static feeds or snapshots.

## 2026-10-10T23:48:00+05:30 — Add local SQLite route-data pipeline

- Changed: Added a SQLite canonical route database, browser GeoJSON export, `npm run data:build`, and local frontend loading for Hyderabad’s verified HMRL shapes. The map no longer needs a live request to display the bundled Hyderabad geometry.
- Why: Runtime Overpass requests were unreliable and left the map dependent on external availability.
- Validation: `npm run data:build` produced three route features; production build run after the architecture change.
- Limitations: The database currently contains Hyderabad only; the remaining systems still need verified source snapshots added to the same schema.

## 2026-10-10T23:32:00+05:30 — Remove misleading fallback route lines

- Changed: Added bundled Hyderabad route geometry generated from the public HMRL GTFS feed, changed the map to start with an empty route layer, and removed silent rendering of manual connector paths when OSM geometry is unavailable. Added an explicit unavailable state and warning in the settings rail; added the reproducible GTFS conversion script in `scripts/build-route-geometry.mjs`.
- Why: The screenshots showed straight station-to-station connectors instead of actual alignments, making the map look like cached or fabricated route data.
- Validation: `npm run build` passed after bundling three Hyderabad GTFS route shapes.
- Limitations: Only Hyderabad is bundled as verified GTFS geometry in this milestone. Other systems need their own static GTFS/OSM geometry snapshots before they can show routes without runtime Overpass access.

## 2026-10-10T23:06:48+05:30 — Load real metro route geometry

- Changed: Added a cached Overpass/OSM route-relation loader for selected metro systems, replaced the default route layer with returned way geometries when available, added route-source status in the atlas chrome, and separated the compact fallback paths from the real route state. Moved the time slider above the milestone strip to remove the bottom overlap.
- Why: Stop presenting station-to-station connector lines as route maps and make route provenance visible in the interface.
- Validation: `npm run build` passed.
- Limitations: OSM is current-day geometry; Overpass requires runtime network access; historical extensions and complete GTFS shapes are not reconstructed yet.

## 2026-10-10T22:57:24+05:30 — Rehaul UI as a map-first atlas viewer

- Changed: Replaced the dashboard-like page layout with a full-viewport map viewer: gradient atlas badge, dark settings rail, system filter list, compact map legend, persistent historical strip, and responsive mobile controls in `src/App.tsx` and `src/styles.css`.
- Why: Match the requested cartographic atlas direction while keeping the product’s metro-system and time-slider interactions central.
- Validation: `npm run build` passed.
- Limitations: The basemap remains the current OSM raster layer; route-geometry accuracy limitations documented in `DATA_SOURCES.md` remain unchanged.

## 2026-10-10T22:41:51+05:30 — Rehaul atlas around Indian metro systems

- Changed: Reworked the single-map experience from a Delhi-only sample into an India-scale metro overview with seven system filters, multiple colored line families, India viewport, source-linked system metadata, updated milestones, and a 2002–2024 time slider.
- Why: Align the product with the broader goal of mapping Indian transit while deliberately scoping the current phase to metros before suburban, national rail, and live services.
- Validation: `npm run build` passed.
- Limitations: Cross-city lines are overview connectors and most systems have representative station samples; complete GTFS/OSM station and shape ingestion remains the next data milestone.

## 2026-10-10T22:16:42+05:30 — Replace demo station points with sourced coordinates

- Changed: Updated the seven displayed station points with coordinate values from the published Delhi Metro station dataset, updated the sampled Yellow Line connectors to use those points, added visible opening/coordinate source links to station details, and added `DATA_SOURCES.md` with source, license, refresh, and accuracy notes.
- Why: Make the visible sample traceable instead of presenting hand-entered coordinates as authoritative.
- Validation: Production build run after the data update.
- Limitations: The sample still does not contain complete centerline geometry or station-by-station opening evidence for the full Delhi network; limitations are documented in `DATA_SOURCES.md`.

## 2026-10-10T22:09:21+05:30 — Restore standard OSM basemap

- Changed: Restored the original OpenStreetMap raster tiles, opacity, and attribution in `src/App.tsx`.
- Why: The original map provided the clearest geographic context in the working demo.
- Validation: Production build run after the change.
- Limitations: This basemap is visually denser than the experimental light variants.

## 2026-10-10T22:03:43+05:30 — Restore landmark context

- Changed: Replaced the overly sparse CARTO Light basemap with CARTO Voyager and restored full tile opacity in `src/App.tsx`.
- Why: Preserve a clean transit-focused map while keeping streets, labels, and landmarks visible for geographic orientation.
- Validation: Production build run after the change.
- Limitations: Basemap detail varies with zoom and runtime tile availability.

## 2026-10-10T22:00:23+05:30 — Reduce basemap visual noise

- Changed: Switched the detailed standard OSM raster tiles to the lighter CARTO basemap, which uses OpenStreetMap data and keeps roads and labels subordinate to the historical transit layers.
- Why: Improve route readability and reduce unnecessary map detail.
- Validation: Production build run after the change.
- Limitations: The basemap still requires runtime network access and remains a contextual map, not a source for the historical rail geometries.

## 2026-10-10T21:54:52+05:30 — Simplify to single-map time travel

- Changed: Removed the dual-map and swipe-divider comparison UI. Added one map with an on-map year slider, play/pause time control, milestone fly-to, and single-year network snapshot stats in `src/App.tsx` and `src/styles.css`.
- Why: Keep the core historical interaction focused and easier to understand at a glance.
- Validation: Production build run after the change.
- Limitations: The dataset and live-tracking limitations from the prior milestone remain.

## 2026-10-10T21:50:13+05:30 — Build historical comparison foundation

- Changed: Added the Vite/React/TypeScript application, date-aware Delhi sample data, MapLibre map rendering, swipe and dual-map modes, year controls, synchronized camera wiring, change inspection, station/route popups, milestone playback, and responsive styling in `src/`, plus runnable package configuration.
- Why: Deliver the project’s identity feature first, before adding credentials or external live-data failure modes.
- Validation: `npm install` completed; `npm run build` passed (`tsc -b` and `vite build`). A local HTTP smoke request was attempted but was blocked by the managed environment’s socket policy.
- Limitations: The sample network is intentionally compact; live tracking and broader source coverage remain future milestones. Runtime map tiles require network access.

```text
## <actual timestamp> — <short change title>

- Changed: <feature or files changed>
- Why: <reason for the change>
- Validation: <commands or manual checks actually run, with results>
- Limitations: <known issues or "None identified in these checks">
```

## Template setup — 10 October 2026

- Changed: Added the event README, rules, agent guide, change log, AI usage record, submission checklist, Git ignore rules, and pull request checklist.
- Why: Give participants a consistent starting point for event rules, basic coding patterns, documented changes, and regular commits.
- Validation: Checked local Markdown links, event detail consistency, required documents, and diff whitespace before publishing.
- Limitations: Documentation scaffolding only; no participant project, application, or working demo is included. GitHub publication and template status are verified separately after creation.
