# AGENTS.md — Hong Kong Live

Guidance for AI agents working on this project. Read this file before making any change.

## 1. Project structure

- `index.html` — the single-page dashboard and its HTML structure.
- `app.js` — JavaScript behaviour and data-fetching logic for the page.
- `SPEC.md` — the requirements and acceptance specification. Session 2 scope is the **Weather card**; Transport and Air Quality cards are placeholders for later sessions.
- `hello.html` — not part of the dashboard; leave it untouched unless the user says otherwise.

Page layout: one page titled "Hong Kong Live" with three cards (**Weather**, **Transport**, **Air Quality**) and a responsive layout that stacks into a single column on narrow screens (≤ 700px).

## 2. Rules

- Plain HTML, CSS, and vanilla JavaScript only.
- No React, Vue, Node.js, Express, npm packages, build tools, proxies, or server-side code.
- The project must not require a build step. It may be run by opening index.html directly or through a simple local server such as Python HTTP server or Live Server.
- Keep the existing page structure and English wording unless a change is required by `SPEC.md`.
- Read `SPEC.md` before making any change related to the Weather card, and follow its acceptance criteria.
- Match the Weather station by its exact name, **"Hong Kong Observatory"** — never by array position.
- Do not hardcode live values; read them from the API response.
- Do not change a data source URL or add a new data source without asking the user first.
- Only touch the files and scope the current task names; do not modify unrelated code.

## 3. Data sources

- Weather (the only live data source this session):
  `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`
  - Temperature and humidity come from the response lists, matched by station name **"Hong Kong Observatory"**.
  - Other fields used by the Weather card: UV index, rainfall in the past hour (mm), weather icon/condition, `warningMessage`, and `updateTime`.
  - Temperature is displayed in Celsius (°C).
- Transport and Air Quality cards: requirement-level placeholders only for Session 2. Do not wire them to live data unless `SPEC.md` or the user explicitly asks.

## 4. Error handling

- Wrap all weather data fetching in `try/catch`.
- If the request fails (network error, non-successful HTTP response, or unreadable data), show a clear message **inside the Weather card** (e.g., "Live weather could not be loaded right now.") instead of leaving it stuck on "Loading".
- If an individual value is missing from the response, show a placeholder ("—") for that value — do not fail the whole card.
- A failure in one card must never break or blank the other cards or the rest of the page.

## 5. When you are unsure

- If you are unsure about **changing a data source URL** — ask the user before doing it.
- If you are unsure about **making a major structural change** (layout, card set, page purpose) — ask the user before doing it.
- If you are unsure whether a change belongs to the Session 2 scope — read `SPEC.md` first; if it is still unclear, ask the user.
- If you hit a real-system blocker (file locks, permissions, missing files), explain the situation and wait for the user's instruction instead of forcing a workaround.
