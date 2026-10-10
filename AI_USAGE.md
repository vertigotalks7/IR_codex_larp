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

## Template preparation

On 10 October 2026, Codex prepared this documentation template from the organizer's supplied rules and checked the linked Luma page for the event name and dates. This covered `README.md`, `RULES.md`, `AGENTS.md`, `CHANGELOG.md`, `AI_USAGE.md`, `SUBMISSION.md`, `.gitignore`, and the pull request checklist. Agent validation covered local links, event consistency, required documents, and diff whitespace; organizer review is pending.

This preparation is separate from participant project implementation and participant AI usage during the event.
