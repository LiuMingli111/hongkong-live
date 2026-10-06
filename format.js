/* format.js — pure, testable formatting & calculation helpers.
 *
 * This file intentionally contains NO fetch, NO DOM access and NO browser
 * objects. Every function here is deterministic: the same input always
 * produces the same output. app.js calls these helpers for all display
 * formatting and next-train calculation; keeping them separate lets each
 * one be unit-tested in isolation.
 *
 * Loaded as a plain classic script BEFORE app.js (no ES module system,
 * so the dashboard still opens directly via file://).
 */

// HKO weather icon codes -> short English descriptions.
const ICON_LABELS = {
  50: "Sunny",
  51: "Sunny periods",
  52: "Sunny intervals",
  53: "Sunny periods with a few showers",
  54: "Sunny intervals with showers",
  60: "Cloudy",
  61: "Overcast",
  62: "Light rain",
  63: "Rain",
  64: "Heavy rain",
  65: "Thunderstorms",
  70: "Fine",
  71: "Fine",
  72: "Fine",
  73: "Fine",
  74: "Fine",
  75: "Fine",
  76: "Mainly cloudy",
  77: "Mainly cloudy",
  80: "Windy",
  81: "Dry",
  82: "Humid",
  83: "Fog",
  84: "Mist",
  85: "Haze",
  90: "Hot",
  91: "Warm",
  92: "Cool",
  93: "Cold"
};

// Find the reading for a station by its EXACT name — never by array position.
function reading(list, place) {
  if (!list) return null;
  return list.find((item) => item.place === place) || null;
}

// Icon code -> description, with a caller-provided fallback for unknown codes.
function iconLabel(icon, fallback) {
  return ICON_LABELS[icon] || fallback;
}

// ISO timestamp -> compact display string, e.g. "22 Sept, 4:16 pm".
function formatTime(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleString("en-HK", {
    hour: "numeric",
    minute: "2-digit",
    day: "numeric",
    month: "short"
  });
}

// Reading entry -> "29°C", or "—" when the reading (or its value/unit) is missing.
// A real 0 stays visible; only missing fields count as unavailable.
function formatTemp(entry) {
  return entry && entry.value != null && entry.unit != null
    ? entry.value + "°" + entry.unit
    : "—";
}

// Reading entry -> "76%", or "—" when the reading (or its value) is missing.
// A real 0 stays visible; only a missing value counts as unavailable.
function formatHumidity(entry) {
  return entry && entry.value != null ? entry.value + "%" : "—";
}

// Reading entry -> "2 (low)", "2", or "—" when the reading (or its value) is missing.
// A real 0 stays visible; only a missing value counts as unavailable.
function formatUv(entry) {
  return entry && entry.value != null
    ? entry.value + (entry.desc ? " (" + entry.desc + ")" : "")
    : "—";
}

// Reading entry -> "0 mm", or "—" when missing / reported as "-".
// A real 0 stays visible; only a missing or "-" value counts as unavailable.
function formatRain(entry) {
  return entry && entry.max != null && entry.max !== "-"
    ? entry.max + " " + (entry.unit || "mm")
    : "—";
}

// AQHI value -> "4", or "—" when missing. A real 0 stays visible.
function formatAqhi(value) {
  return value != null && value !== "" ? String(value) : "—";
}

// Health risk text -> the text itself, or "—" when missing.
function formatHealthRisk(value) {
  return value ? value : "—";
}

// Pick the first valid train from an MTR "UP"/"DOWN" array, or null.
// "ttnt" arrives as a string (e.g. "3"); entries whose ttnt cannot be
// converted to a finite number are skipped so the caller never sees NaN.
function nextTrain(trains) {
  if (!Array.isArray(trains)) return null;
  return (
    trains.find(
      (train) =>
        train.ttnt != null &&
        train.ttnt !== "" &&
        Number.isFinite(Number(train.ttnt))
    ) || null
  );
}

// Next-train object -> "3 min", or "—" when there is no valid train.
function formatNextTime(next) {
  return next ? Number(next.ttnt) + " min" : "—";
}

// MTR data key "ISL-HKU" -> line code "ISL".
function lineCode(key) {
  return key.split("-")[0];
}

// Node.js (CommonJS) export guard — browsers skip this because `module` is
// undefined in a classic script, so the functions stay global for the page.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ICON_LABELS,
    reading,
    iconLabel,
    formatTime,
    formatTemp,
    formatHumidity,
    formatUv,
    formatRain,
    formatAqhi,
    formatHealthRisk,
    nextTrain,
    formatNextTime,
    lineCode
  };
}
