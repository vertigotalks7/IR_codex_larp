# Change log

Record each meaningful project change during the event, newest first. Update this file in the same commit as the change. Use a real timestamp with timezone, for example `YYYY-MM-DDTHH:MM:SS+05:30`.

## Event build log

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
