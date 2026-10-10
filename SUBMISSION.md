# Project submission

Complete this file during the hackathon and use it to prepare your submission through the method announced by the organizers. Do not submit your project to the template repository.

## Project

- **Project name:** Transit Time Machine
- **Short description:** A source-backed interactive atlas that lets people compare Delhi’s rail and metro network across time, inspect what was added, and follow expansion milestones.
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
- **Demo walkthrough:** Move the small time slider over the map; use Play time; click a station; select a historical milestone; use Fly to milestone.
- **Checks performed and results:** `npm run build` passed. Local server HTTP verification was attempted but blocked by the managed socket policy.
- **Known limitations or incomplete features:** Small Delhi sample only; live train adapter and national coverage are not yet implemented; source-backed geometry is intentionally scoped for the demo.
- **Libraries, APIs, and public datasets used:** MapLibre GL JS, OpenStreetMap raster tiles, DMRC, NCRTC, and the New Delhi station reference. Links and attribution are in `README.md` and the app footer.
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
