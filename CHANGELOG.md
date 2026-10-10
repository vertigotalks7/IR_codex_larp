# Change log

Record each meaningful project change during the event, newest first. Update this file in the same commit as the change. Use a real timestamp with timezone, for example `YYYY-MM-DDTHH:MM:SS+05:30`.

## Event build log

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
