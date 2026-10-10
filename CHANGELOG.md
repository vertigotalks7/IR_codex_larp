# Change log

Record each meaningful project change during the event, newest first. Update this file in the same commit as the change. Use a real timestamp with timezone, for example `YYYY-MM-DDTHH:MM:SS+05:30`.

## Event build log

## 2026-10-11T03:30:00+05:30 — Integrate national Indian Railways GIS track network and junction dataset

- Changed: Added national Indian Railways GIS track network mapping sourced from Humanitarian Data Exchange (HDX `hotosm_ind_railways`), OpenStreetMap, and CRIS RBS. Implemented 10 major trunk corridors spanning over 11,000 km across India (Delhi–Howrah, Mumbai Central–New Delhi, Grand Trunk Delhi–Chennai, Mumbai–Howrah via Nagpur, Mumbai–Chennai, Howrah–Chennai East Coast, Konkan Railway, Rayalaseema DMM–MTM, Southern Mainline MAS–TVC, and Northern Trunk Delhi–Amritsar) plus 33+ key junction hubs with CRIS station codes, platform counts, and railway divisions. Added interactive corridor filtering and fly-to navigation, national track gauge and electrification visualization, junction marker click popups, and comprehensive provenance documentation in `DATA_SOURCES.md`.
- Why: The user clarified that the Indian Railways mode should map actual GIS railway track data and network corridors across the map rather than only isolated train routes, referencing sources such as HDX, MAPOG GIS, DIVA-GIS, and CRIS RBS.
- Validation: `npm run build` passed (`tsc -b` and `vite build`, 49 modules transformed); all 10 national corridors and 33+ junctions rendered cleanly; `git diff --check` passed without whitespace errors.
- Limitations: Track alignments currently cover the 10 primary broad-gauge electrified trunk corridors; regional branch lines and secondary routes remain documented in references for future batch ingestion.

## 2026-10-11T03:05:00+05:30 — Map Indian Railways Train 17216 corridor and live radar tracker

- Changed: Added interactive Indian Railways corridor mapping for Train 17216 (Dharmavaram–Machilipatnam Express) modeled after RailRadar. Ingested all 22 official station stops (DMM, ATP, GYF, TU, KDP, MOO, YA, PRDT, JMDG, KLKA, BGNP, NDL, GID, MRK, VKN, NRT, GNT, BZA, GDV, GVL, PAV, MTM) with scheduled arrival/departure timings, halt durations, and distance metrics. Generated real corridor alignment coordinates spanning 694 km across Andhra Pradesh. Added live animated GPS train radar pulse marker on the map, journey scrubber slider, timetable station selection with fly-to zoom, and interactive stop popups.
- Why: The user requested mapping an Indian Railways route on our current transit map similar to RailRadar's Train 17216 live tracker. Indian Railways mode previously only displayed reference material; it now provides an interactive railway corridor and train tracking experience.
- Validation: `npm run build` passed with 48 modules transformed; all 22 stations and route line rendered cleanly; `git diff --check` passed.
- Limitations: Live train tracking position is driven by route progress simulation/scrubbing; integration with real-time NTES API sockets remains a future enhancement.

## 2026-10-11T02:45:00+05:30 — Modularize application architecture and fix map reactivity

- Changed: Modularized monolithic `src/App.tsx` into domain-focused subcomponents (`AtlasHeader`, `AtlasPanel`, `AtlasTimeSlider`, `AtlasLegend`, `AtlasMilestones`, `MapView`, and `LandingPage`), extracted network configuration to `src/config/`, and encapsulated transit caching and querying into `src/services/transitData.ts`. Resolved MapView route hydration thrashing during milestone playback by eliminating unnecessary 'loading' cycles on cached hits. Wired up interactive map detail checkboxes for toggling routes and station pins, and restored national camera reset when selecting All India.
- Why: `App.tsx` had grown into a single 22 KB file combining MapLibre lifecycle, network state, landing page, and sidebar UI. Playback mode triggered state recalculation loops every 900 ms causing UI flickering, map toggle inputs were disconnected, and clicking All India failed to fly back to national overview.
- Validation: `npm run build` passed with 46 modules transformed; `npm run data:build` verified SQLite and JSON pipeline; `git diff --check` passed.
- Limitations: Verified interactive GTFS geometry remains available for Hyderabad, Bengaluru, and Chennai; Delhi, Kochi, Mumbai, and Pune continue in reference status awaiting source snapshots.

## 2026-10-11T02:28:00+05:30 — Add in-map network switcher

- Changed: Added distinct Metro, Indian Railways, Suburban Rail, and NHSRCL modes in the atlas sidebar. Each updates the title, map scope, panel copy, and source link; switching away from Metro clears its routes and stations.
- Why: The atlas needs a coherent multi-network navigation model before those networks receive reviewed geometry imports.
- Validation: `npm run build` and `git diff --check` passed.
- Limitations: Indian Railways, Suburban Rail, and NHSRCL modes are source-reference views until local, reviewed line geometry is added.

## 2026-10-11T02:08:00+05:30 — Split map engine and add rail source shelf

- Changed: Deferred MapLibre loading until the metro atlas opens, reducing the initial JavaScript bundle from roughly 1.3 MB to 243 KB. Added a landing-page source shelf for the national Indian Railways map, suburban route-map archive, and NHSRCL project material.
- Why: National and high-speed geometry must be source-reviewed before it becomes an interactive layer; external map references remain useful now without delaying the landing page or loading a national OSM extract.
- Validation: `npm run build` passed; the production build emitted a separate MapLibre chunk.
- Limitations: The source shelf is reference material, not yet an interactive national/suburban/high-speed network layer.

## 2026-10-11T01:36:00+05:30 — Make route rendering local and reproducible

- Changed: Removed runtime Overpass route retrieval from the map. Only reviewed local route snapshots now render, and systems without a snapshot explicitly show an unavailable state.
- Why: A live third-party query can fail, drift over time, or return incomplete geometry. It cannot meet the atlas’s source-snapshot and historical-audit standard.
- Validation: `npm run build` and `git diff --check` passed.
- Limitations: Delhi, Kochi, Mumbai, and Pune require reviewed local source snapshots before their route lines can render.

## 2026-10-11T01:20:00+05:30 — Add atlas landing shell and national rail data architecture

- Changed: Added a landing-page-first product shell with honest Metro, Indian Railways, and High-Speed Rail entry states; documented the national source hierarchy and data contract; extended the SQLite schema for sources, infrastructure segments, historical events, projects, and services.
- Why: The existing current metro data is not broad or historical enough to support claims of a complete Indian rail atlas. The new shell and schema separate what is interactive today from verified expansion work.
- Validation: `npm run data:build`, `npm run build`, and `git diff --check` passed.
- Limitations: National rail, high-speed rail, and detailed historical segment data are not yet ingested. The current interactive atlas remains limited to verified metro snapshots.

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
