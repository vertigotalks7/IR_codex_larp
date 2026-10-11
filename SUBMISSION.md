# Project submission

Complete this file during the hackathon and use it to prepare your submission through the method announced by the organizers. Do not submit your project to the template repository.

## Project

- **Project name:** Transit Time Machine
- **Short description:** A source-aware interactive Indian rail atlas with ten mapped metro systems, a 21-system source catalog, city-rail infrastructure, and a separate history explorer.
- **Code repository URL:** TODO
- **Final submitted implementation commit SHA:** TODO
- **Working demo URL or local demo steps:** `npm install` then `npm run dev`, and open the local URL.
- **Demo access requirements:** Node.js 20+; runtime network access for OpenStreetMap tiles. No credentials required for the historical demo.

## Participants

Participate solo or in a team of up to 4. Remove unused rows.

| Participant name | GitHub handle | Contribution |
| --- | --- | --- |
| TODO | TODO | TODO |

## Run and demonstrate

- **Prerequisites and versions:** Node.js 20+ and npm.
- **Install command:** `npm install`
- **Required environment variable names:** None for the historical demo.
- **Start command:** `npm run dev`
- **Demo walkthrough:** Open the atlas, switch among the ten metro map layers, inspect a route feature and a station point, then open History. Switch rail family and region; select a railway zone and one of its locally indexed divisions, or inspect city-rail track/station feature counts.
- **Checks performed and results:** `npm run data:build` passed and regenerated 626 metro geometry features and 181 GTFS station records; `npx tsc -b --pretty false` passed; `npm run build` passed outside the restricted sandbox after the sandboxed Vite run failed with `EPERM` resolving `index.html`; `git diff --check` passed. A station-point audit found 121 unique HOTOSM/OSM object IDs: Kochi 25 records/25 names, Mumbai 66/65, Pune 30/29. The production build reports a 1,053 kB MapLibre chunk warning. Browser visual QA was not completed.
- **Known limitations or incomplete features:** Ten metro systems have bundled geography; eleven catalog entries are source-linked but awaiting reviewed geometry. OSM metro ways are community-mapped physical track, not operator-certified service shapes. Mumbai's station points remain partial on Lines 2A, 2B, and 3; Kochi's operator homepage claims 26 stations while its passenger roster and notice support 25; Pune's OSM point for Kasba Peth differs from the latest duplicated operator corridor label Budhwar Peth. Meerut Metro is listed, but its service-specific geometry is not separated from shared Namo Bharat infrastructure. The railway division dashboard only reports its small local junction/corridor reference sample; city-rail focus areas are not commuter-service maps. High-speed/NHSRCL geometry and historical track reconstruction are not implemented.
- **Libraries, APIs, and public datasets used:** MapLibre GL JS, OpenStreetMap raster tiles and track data, HOTOSM India railways snapshot, local GTFS sources, and operator/government sources listed in `DATA_SOURCES.md` and `src/data/metroCatalog.ts`.
- **AI usage record:** [AI_USAGE.md](AI_USAGE.md)
- **Development change log:** [CHANGELOG.md](CHANGELOG.md)

## Submission checklist

- [ ] The project implementation started from scratch at the event.
- [ ] I participated solo or with no more than 4 team members in total.
- [ ] Codex was used during development and its usage is documented.
- [ ] The code repository URL, short description, and working demo are provided.
- [ ] README setup and demo instructions match the submitted code.
- [ ] Actual checks and known limitations are documented.
- [ ] Meaningful changes are documented and committed throughout development.
- [ ] The final implementation is committed and pushed, and its SHA is recorded above.
- [ ] No credentials or private data are included in the repository or demo instructions.
- [ ] The organizers' announced submission method and timing have been followed.

Event reference: [DevDay Exchange Community: Kochi on Luma](https://luma.com/z10nz8gp). The event wraps up by **10:00 AM IST on 11 October 2026**.
