    const WEATHER_URL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en";
    const AIR_QUALITY_URL = "https://dashboard.data.gov.hk/api/aqhi-individual?format=json";
    const TRANSPORT_URL = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=ISL&sta=HKU";
    const TRANSPORT_KEY = "ISL-HKU";
    async function loadWeather() {
      const status = document.getElementById("weather-status");
      const content = document.getElementById("weather-content");

      try {
        const response = await fetch(WEATHER_URL, { cache: "no-store" });
        if (!response.ok) throw new Error("Weather request failed");
        const data = await response.json();

        const temp = reading(data.temperature && data.temperature.data, "Hong Kong Observatory");
        const humidity = reading(data.humidity && data.humidity.data, "Hong Kong Observatory");
        // UV index is reported for King's Park, the Observatory's UV monitoring site.
        const uv = reading(data.uvindex && data.uvindex.data, "King's Park");
        const icon = data.icon && data.icon[0];
        // Rainfall is reported per district; Yau Tsim Mong contains the Hong Kong Observatory.
        const rain = reading(data.rainfall && data.rainfall.data, "Yau Tsim Mong");

        document.getElementById("weather-temp").textContent = formatTemp(temp);
        document.getElementById("weather-condition").textContent = iconLabel(icon, "Hong Kong Observatory");
        document.getElementById("weather-humidity").textContent = formatHumidity(humidity);
        document.getElementById("weather-uv").textContent = formatUv(uv);
        document.getElementById("weather-rain").textContent = formatRain(rain);

        const iconEl = document.getElementById("weather-icon");
        if (icon) {
          iconEl.src = "https://www.hko.gov.hk/images/HKOWxIconOutline/pic" + icon + ".png";
          iconEl.alt = iconLabel(icon, "Weather icon");
        }

        const rawWarning = data.warningMessage;
        const warning = Array.isArray(rawWarning)
          ? rawWarning.filter(Boolean).join(" · ")
          : rawWarning;
        const warningEl = document.getElementById("weather-warning");
        warningEl.textContent = warning || "";
        warningEl.hidden = !warning;

        document.getElementById("weather-updated").textContent =
          "Updated " + formatTime(data.updateTime) + " · Hong Kong Observatory";

        status.hidden = true;
        content.hidden = false;
      } catch (error) {
        status.textContent = "Live weather could not be loaded right now.";
      }
    }

    async function loadAirQuality() {
      const status = document.getElementById("air-status");
      const content = document.getElementById("air-content");

      try {
        const response = await fetch(AIR_QUALITY_URL, { cache: "no-store" });
        if (!response.ok) throw new Error("Air quality request failed");
        const data = await response.json();

        // Match the station by its exact name — never by array position.
        const station = Array.isArray(data)
          ? data.find((item) => item.station === "Central/Western")
          : null;

        document.getElementById("air-station").textContent = station ? station.station : "—";
        document.getElementById("air-aqhi").textContent = formatAqhi(station && station.aqhi);
        document.getElementById("air-risk").textContent = formatHealthRisk(station && station.health_risk);

        status.hidden = true;
        content.hidden = false;
      } catch (error) {
        status.textContent = "Live air quality could not be loaded right now.";
      }
    }

    async function loadTransport() {
      const status = document.getElementById("transport-status");
      const content = document.getElementById("transport-content");

      try {
        const response = await fetch(TRANSPORT_URL, { cache: "no-store" });
        if (!response.ok) throw new Error("Transport request failed");
        const payload = await response.json();

        // Top-level "status" is a number, not a string: strict numeric comparison only.
        if (payload.status !== 1) throw new Error("MTR API reported status " + payload.status);

        const trains =
          payload.data &&
          payload.data[TRANSPORT_KEY] &&
          payload.data[TRANSPORT_KEY].UP;
        const next = nextTrain(trains);

        document.getElementById("transport-line").textContent = lineCode(TRANSPORT_KEY);
        document.getElementById("transport-dest").textContent = next && next.dest ? next.dest : "—";
        document.getElementById("transport-next").textContent = formatNextTime(next);

        status.hidden = true;
        content.hidden = false;
      } catch (error) {
        status.textContent = "Live train times could not be loaded right now.";
      }
    }

    const REFRESH_MS = 30000;
    const RING_LENGTH = 2 * Math.PI * 15.5;
    const refreshCount = document.getElementById("refresh-count");
    const refreshRing = document.getElementById("refresh-ring");
    const refreshTimer = document.getElementById("refresh-timer");
    let refreshStarted = Date.now();
    let refreshing = false;

    function paintCountdown() {
      const remaining = Math.max(0, REFRESH_MS - (Date.now() - refreshStarted));
      const secondsLeft = remaining === 0 ? 30 : Math.ceil(remaining / 1000);
      refreshCount.textContent = String(secondsLeft);
      refreshTimer.setAttribute("aria-label", "Next refresh in " + secondsLeft + " seconds");
      refreshRing.style.strokeDasharray = String(RING_LENGTH);
      refreshRing.style.strokeDashoffset = String(RING_LENGTH * (1 - remaining / REFRESH_MS));
    }

    async function refreshAll() {
      if (refreshing) return;
      refreshing = true;
      refreshStarted = Date.now();
      paintCountdown();
      try {
        await Promise.all([loadWeather(), loadAirQuality(), loadTransport()]);
      } finally {
        refreshing = false;
      }
    }

    paintCountdown();
    refreshAll();
    setInterval(() => {
      if (Date.now() - refreshStarted >= REFRESH_MS) refreshAll();
      else paintCountdown();
    }, 200);
