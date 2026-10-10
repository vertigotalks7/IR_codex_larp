# AI usage record

Use Codex during the hackathon and briefly document its actual contribution here. Add a row after each meaningful task or milestone. Keep summaries concise and omit secrets, private data, and full chat transcripts.

## Event build log

Codex contributed the first implementation milestone. Human review of the visual interaction remains pending.

| Date and time with timezone | Tool / model, if known | Task | Assistance and affected files | Human review / corrections | Validation and result |
| --- | --- | --- | --- | --- | --- |
| 2026-10-10T21:50:13+05:30 | Codex | Historical comparison foundation | Created the Vite/React/TypeScript app, canonical dated sample data, MapLibre views, comparison controls, playback, inspection panels, and documentation updates. | Pending | `npm run build` passed; local HTTP smoke request was blocked by managed socket policy. |
| 2026-10-10T21:54:52+05:30 | Codex | Single-map time control refinement | Removed dual/swipe comparison and rewired the UI around one MapLibre map with an on-map historical slider, playback, milestone navigation, and updated docs. | Pending | Production build run after the change. |
| 2026-10-10T22:00:23+05:30 | Codex | Basemap readability refinement | Switched the detailed OSM raster basemap to a quieter CARTO light basemap and updated attribution documentation. | Pending | `npm run build` passed. |
| 2026-10-10T22:03:43+05:30 | Codex | Restore landmark context | Replaced the too-sparse CARTO Light tiles with CARTO Voyager and restored full tile opacity so streets and labels remain visible. | Pending | `npm run build` passed. |
| 2026-10-10T22:09:21+05:30 | Codex | Restore original basemap | Reverted the basemap to the original standard OpenStreetMap tiles and original opacity after the alternative styles remained too sparse or unreliable. | Pending | `npm run build` passed. |
| 2026-10-10T22:16:42+05:30 | Codex | Add source-backed station data | Replaced the visible station coordinates with values from a published Delhi Metro coordinate snapshot, updated sampled connectors, and added `DATA_SOURCES.md` documenting provenance and limitations. | Pending | `npm run build` passed. |
| 2026-10-10T22:41:51+05:30 | Codex | Rehaul for Indian metro systems | Reworked the UI and data model for seven Indian metro systems, multiple colored line families, India-scale navigation, system filters, and source-linked metadata. | Pending | `npm run build` passed. |
| 2026-10-10T22:57:24+05:30 | Codex | Map-first atlas UI overhaul | Reworked the page into a full-viewport map viewer with dark cartographic chrome, a right settings rail, compact legend, historical strip, gradient atlas badge, and responsive controls inspired by the supplied references. | Pending | `npm run build` passed. |
| 2026-10-10T23:06:48+05:30 | Codex | Replace connector paths with OSM route geometry | Added an Overpass loader and session cache for current metro subway relation geometry, visible source status, explicit fallback handling, and corrected the bottom-control overlap. | Pending | `npm run build` passed. |
| 2026-10-10T23:32:00+05:30 | Codex | Eliminate false fallback routes | Added a generated Hyderabad GTFS geometry bundle and changed unavailable OSM data to render no route layer instead of straight connectors; updated source and limitation documentation. | Pending human visual review of Hyderabad geometry and unavailable states. | `npm run build` passed; bundle contains three HMRL route features. |
| 2026-10-10T23:48:00+05:30 | Codex | Make route loading local and deterministic | Added the SQLite canonical store, generated browser export, data build command, and frontend loading from `public/data/routes.json`. | Pending human visual review; further systems still need source snapshots. | `npm run data:build` produced three route features; production build passed. |
| 2026-10-11T00:12:00+05:30 | Codex | Add Bengaluru and Chennai geometry/stations | Extended GTFS ingestion and the frontend local-data loader to include Bengaluru and Chennai route shapes plus station catalogs. | Pending human visual review; four systems remain to be sourced. | `npm run data:build` produced 14 route shapes and 181 stations; `npm run build` passed. |
| 2026-10-11T00:42:00+05:30 | Codex | Fix database integrity and vintage visual system | Committed the source snapshots, added stop-times-based station line membership, made data rebuilds self-contained, updated station details, and applied the vintage railway-atlas skin. | Pending human visual review of the new palette and interaction states. | `npm run data:build` produced 14 route shapes and 181 stations; `npm run build` passed. |
| 2026-10-11T00:58:00+05:30 | Codex | Fix route switching behavior | Added versioned async hydration so stale route requests cannot overwrite the selected metro’s map layer. | Pending human verification by switching systems rapidly. | `npm run build` and `git diff --check` passed. |

## Template preparation

On 10 October 2026, Codex prepared this documentation template from the organizer's supplied rules and checked the linked Luma page for the event name and dates. This covered `README.md`, `RULES.md`, `AGENTS.md`, `CHANGELOG.md`, `AI_USAGE.md`, `SUBMISSION.md`, `.gitignore`, and the pull request checklist. Agent validation covered local links, event consistency, required documents, and diff whitespace; organizer review is pending.

This preparation is separate from participant project implementation and participant AI usage during the event.
