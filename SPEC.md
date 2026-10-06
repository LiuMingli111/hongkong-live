# Hong Kong Live — Weather Card Specification (Session 2)

> Scope: Session 2 of the course worksheet — implementing the **Weather card** of the Hong Kong Live dashboard.
> This is a requirements and acceptance specification. It does not describe implementation architecture in detail.
> Transport and Air Quality cards are described at requirement level only; they will be implemented in later sessions.

## 1. Who it is for

- The page is a personal Hong Kong live-information dashboard for Mingli Liu (MSc in Electronic and Electrical Engineering).
- Anyone who opens the page (from `index.html`) can see the current Hong Kong weather without signing in or configuring anything.
- The Weather card is the working deliverable of this session; Transport and Air Quality cards are placeholders that will be completed in later sessions.

## 2. What it should do

### Page level
- A single-page dashboard titled "Hong Kong Live", with the owner's identity line and a short introduction.
- Three dashboard cards: **Weather**, **Transport**, **Air Quality**.
- The layout adapts to narrow screens (cards stack in a single column on mobile).

### Weather card (this session)
- On load, the card requests live weather data from the Hong Kong Observatory open-data API:
  `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`
- While the data is loading, the card shows a loading message.
- Once loaded, the card displays, for the station **"Hong Kong Observatory"**:
  - temperature in **Celsius (°C)**;
  - weather condition (an icon and a text label);
  - humidity (%), UV index (value and description), and rainfall in the past hour (mm);
  - any weather warning issued by the Observatory;
  - the time the data was last updated by the Observatory.
- If an individual value is missing from the response, the card shows a placeholder ("—") for that value instead of failing.

### Transport and Air Quality cards (later sessions)
- **Transport**: will show live Hong Kong transport information (requirement-level placeholder for this session).
- **Air Quality**: will show live Hong Kong air quality information (requirement-level placeholder for this session).
- These cards keep their titles and placeholder state; no live data is required in this session.

## 3. How we know it is correct (Acceptance criteria)

Check each item by opening the page and, where a value is stated, comparing it with the live API response
(`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`) or the Hong Kong Observatory website.

1. Opening the page shows the three cards, and the Weather card first shows a loading message.
2. Shortly afterwards, the Weather card shows live data instead of the loading message.
3. The temperature shown matches the value for station **"Hong Kong Observatory"** in the API response, displayed in Celsius with a °C unit.
4. The weather condition label matches the current condition for the station, and the icon matches the current weather icon.
5. Humidity is shown as a percentage, the UV index as a value with its description, and rainfall as mm for the past hour.
6. The update time shown matches the API's `updateTime`, formatted as day + month + time.
7. If the API includes a weather warning, the warning text is displayed in the card.
8. If the network or API is unavailable, the card shows a clear failure message and the rest of the page still works.
9. Any missing individual value is displayed as "—" rather than an error.
10. On a narrow screen (≤ 700px), the three cards stack in a single column.

## 4. What happens when it fails

- If the weather API request fails (network error, non-successful HTTP response, or unreadable data), the Weather card shows a clear message such as "Live weather could not be loaded right now." and stops trying to render data.
- Missing individual values are rendered as "—".
- A failure in the Weather card must not break or blank the other cards or the rest of the page.

## 5. Constraints

- Plain HTML, CSS, and JavaScript only. No frameworks (e.g., React, Vue), no Node.js/Express, no build step, no server-side code, no proxies, and no deployment configuration (e.g., Vercel).
- Implementation may be split between `index.html` and `app.js`, as the course worksheet allows.
- All page text remains in English, consistent with the current page.

## 6. Out of scope (this session)

- Live data for the Transport and Air Quality cards.
- Station selectors, auto-refresh scheduling, caching/offline support, multiple languages, or a visual redesign beyond what the Weather card requires.
