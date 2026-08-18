/**
 * date.js — Holy Calculator Date & Time Engine
 *
 * Core logic for:
 *  - Mode A: Days Between Two Dates (years, months, weeks, days breakdown)
 *  - Mode B: Add or Subtract Time (years, months, weeks, days, business days)
 *  - Floating & Fixed US Federal & Observed Holidays Algorithm
 *  - Business Day Skipping (Weekends & Custom/Standard Holidays)
 *  - Leap Year & Month Boundary Rollover Math
 *  - URL State Encoding/Decoding
 */

import { getDaysInMonth } from "./age.js";

export { getDaysInMonth };

/**
 * Parses "YYYY-MM-DD" string into { y, m, d }
 */
export function parseDateParts(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return { y, m, d };
}

/**
 * Format Date object into "YYYY-MM-DD"
 */
export function formatDateIso(dt) {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Format Date object into human-readable string (e.g. "Monday, October 12, 2026")
 */
export function formatDateHuman(dt) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthsOfYear = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayName = daysOfWeek[dt.getUTCDay()];
  const monthName = monthsOfYear[dt.getUTCMonth()];
  const day = dt.getUTCDate();
  const year = dt.getUTCFullYear();
  return `${dayName}, ${monthName} ${day}, ${year}`;
}

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// ---------------------------------------------------------------------------
// Floating & Fixed US Holidays Algorithm
// ---------------------------------------------------------------------------

/**
 * Returns the day of month for the Nth day-of-week in a given month.
 * @param {number} year - e.g. 2026
 * @param {number} month - 1 to 12
 * @param {number} dayOfWeek - 0 (Sun) to 6 (Sat)
 * @param {number} n - 1 (1st), 2 (2nd), 3 (3rd), 4 (4th), -1 (last)
 */
export function getNthDayOfWeekInMonth(year, month, dayOfWeek, n) {
  if (n > 0) {
    const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
    const firstDayOfWeek = firstOfMonth.getUTCDay();
    let offset = dayOfWeek - firstDayOfWeek;
    if (offset < 0) offset += 7;
    return 1 + offset + (n - 1) * 7;
  } else {
    // Last occurrence in month
    const totalDays = getDaysInMonth(year, month);
    const lastOfMonth = new Date(Date.UTC(year, month - 1, totalDays));
    const lastDayOfWeek = lastOfMonth.getUTCDay();
    let offset = lastDayOfWeek - dayOfWeek;
    if (offset < 0) offset += 7;
    return totalDays - offset;
  }
}

export const US_STANDARD_HOLIDAYS = [
  { id: "new_years", name: "New Year's Day", type: "fixed", month: 1, day: 1 },
  { id: "mlk", name: "Martin Luther King Jr. Day", type: "floating", month: 1, dayOfWeek: 1, n: 3 },
  { id: "presidents", name: "Presidents' Day", type: "floating", month: 2, dayOfWeek: 1, n: 3 },
  { id: "memorial", name: "Memorial Day", type: "floating", month: 5, dayOfWeek: 1, n: -1 },
  { id: "juneteenth", name: "Juneteenth", type: "fixed", month: 6, day: 19 },
  { id: "independence", name: "Independence Day", type: "fixed", month: 7, day: 4 },
  { id: "labor", name: "Labor Day", type: "floating", month: 9, dayOfWeek: 1, n: 1 },
  { id: "columbus", name: "Columbus Day / Indigenous Peoples' Day", type: "floating", month: 10, dayOfWeek: 1, n: 2 },
  { id: "veterans", name: "Veterans Day", type: "fixed", month: 11, day: 11 },
  { id: "thanksgiving", name: "Thanksgiving Day", type: "floating", month: 11, dayOfWeek: 4, n: 4 },
  { id: "black_friday", name: "Black Friday (Day after Thanksgiving)", type: "floating", month: 11, dayOfWeek: 5, n: 4 },
  { id: "christmas_eve", name: "Christmas Eve", type: "fixed", month: 12, day: 24 },
  { id: "christmas", name: "Christmas Day", type: "fixed", month: 12, day: 25 },
  { id: "new_years_eve", name: "New Year's Eve", type: "fixed", month: 12, day: 31 },
];

/**
 * Returns exact holiday dates for a specific year.
 * @param {number} year
 * @returns {Array<{ id, name, month, day, dateStr }>}
 */
export function getHolidaysForYear(year) {
  return US_STANDARD_HOLIDAYS.map((h) => {
    let day = h.day;
    if (h.type === "floating") {
      day = getNthDayOfWeekInMonth(year, h.month, h.dayOfWeek, h.n);
    }
    const mStr = String(h.month).padStart(2, "0");
    const dStr = String(day).padStart(2, "0");
    return {
      ...h,
      year,
      day,
      dateStr: `${year}-${mStr}-${dStr}`,
    };
  });
}

/**
 * Check if a specific UTC date string ("YYYY-MM-DD") is an active holiday
 */
export function isHoliday(dateStr, selectedHolidayIds = [], customHolidays = []) {
  const parts = parseDateParts(dateStr);
  if (!parts) return false;
  const { y, m, d } = parts;

  // 1. Check selected standard US holidays for the year
  if (selectedHolidayIds.length > 0) {
    const yearHolidays = getHolidaysForYear(y);
    const match = yearHolidays.find(
      (h) => selectedHolidayIds.includes(h.id) && h.month === m && h.day === d
    );
    if (match) return true;
  }

  // 2. Check custom recurring holidays
  if (customHolidays.length > 0) {
    const matchCustom = customHolidays.find(
      (ch) => parseInt(ch.month, 10) === m && parseInt(ch.day, 10) === d
    );
    if (matchCustom) return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Mode A: Days Between Two Dates
// ---------------------------------------------------------------------------

export function calculateDateDiff(startDateStr, endDateStr, includeEndDay = false) {
  const p1 = parseDateParts(startDateStr);
  const p2 = parseDateParts(endDateStr);

  if (!p1 || !p2) {
    return { isValid: false, message: "Please enter valid start and end dates." };
  }

  let startUtc = Date.UTC(p1.y, p1.m - 1, p1.d);
  let endUtc = Date.UTC(p2.y, p2.m - 1, p2.d);

  const isReversed = endUtc < startUtc;
  if (isReversed) {
    // Swap for calculation
    const tmp = startUtc;
    startUtc = endUtc;
    endUtc = tmp;
  }

  // Raw difference in milliseconds
  let msDiff = endUtc - startUtc;
  if (includeEndDay) {
    msDiff += 1000 * 60 * 60 * 24;
  }

  const totalDays = Math.round(msDiff / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysWeeks = totalDays % 7;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;

  // Calendar borrowing for Years, Months, Days breakdown
  let y1 = isReversed ? p2.y : p1.y;
  let m1 = isReversed ? p2.m : p1.m;
  let d1 = isReversed ? p2.d : p1.d;

  let y2 = isReversed ? p1.y : p2.y;
  let m2 = isReversed ? p1.m : p2.m;
  let d2 = isReversed ? p1.d : p2.d;

  if (includeEndDay) {
    d2 += 1;
    const daysInM2 = getDaysInMonth(y2, m2);
    if (d2 > daysInM2) {
      d2 = 1;
      m2 += 1;
      if (m2 > 12) {
        m2 = 1;
        y2 += 1;
      }
    }
  }

  if (d2 < d1) {
    m2 -= 1;
    if (m2 === 0) {
      m2 = 12;
      y2 -= 1;
    }
    const daysInPrev = getDaysInMonth(y2, m2);
    d2 += daysInPrev;
  }

  if (m2 < m1) {
    y2 -= 1;
    m2 += 12;
  }

  const years = y2 - y1;
  const months = m2 - m1;
  const days = d2 - d1;

  const yearStr = `${years} ${years === 1 ? "year" : "years"}`;
  const monthStr = `${months} ${months === 1 ? "month" : "months"}`;
  const dayStr = `${days} ${days === 1 ? "day" : "days"}`;

  return {
    isValid: true,
    isReversed,
    startDateStr,
    endDateStr,
    includeEndDay,
    primaryText: `${yearStr}, ${monthStr}, ${dayStr}`,
    years,
    months,
    days,
    breakdown: {
      totalDays,
      totalWeeks,
      remainingDaysWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
    },
  };
}

// ---------------------------------------------------------------------------
// Mode B: Add or Subtract Time
// ---------------------------------------------------------------------------

export function calculateAddSubtractDate(params) {
  const {
    startDateStr,
    operation = "add", // "add" | "subtract"
    years = 0,
    months = 0,
    weeks = 0,
    days = 0,
    businessDaysOnly = false,
    selectedHolidays = [],
    customHolidays = [],
  } = params;

  const p = parseDateParts(startDateStr);
  if (!p) {
    return { isValid: false, message: "Please enter a valid start date." };
  }

  const mult = operation === "subtract" ? -1 : 1;

  // Handle Business Days Addition / Subtraction
  if (businessDaysOnly) {
    const totalBusinessDaysToAdd = (parseInt(days, 10) || 0) * mult;
    let curr = new Date(Date.UTC(p.y, p.m - 1, p.d));
    let added = 0;
    const targetCount = Math.abs(totalBusinessDaysToAdd);
    const step = totalBusinessDaysToAdd >= 0 ? 1 : -1;

    let skippedWeekends = 0;
    let skippedHolidays = 0;

    while (added < targetCount) {
      curr.setUTCDate(curr.getUTCDate() + step);
      const iso = formatDateIso(curr);
      const dayOfWeek = curr.getUTCDay();

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHol = isHoliday(iso, selectedHolidays, customHolidays);

      if (isWeekend) {
        skippedWeekends++;
      } else if (isHol) {
        skippedHolidays++;
      } else {
        added++;
      }
    }

    return {
      isValid: true,
      startDateStr,
      resultingDateIso: formatDateIso(curr),
      resultingDateHuman: formatDateHuman(curr),
      businessDaysOnly: true,
      skippedWeekends,
      skippedHolidays,
    };
  }

  // Standard Addition / Subtraction of Years, Months, Weeks, Days
  let y = p.y + (parseInt(years, 10) || 0) * mult;
  let m = p.m + (parseInt(months, 10) || 0) * mult;

  // Handle month boundary rollover/borrowing
  while (m > 12) {
    m -= 12;
    y += 1;
  }
  while (m < 1) {
    m += 12;
    y -= 1;
  }

  // Handle month day overflow (e.g. Jan 31 + 1 month -> Feb 28/29)
  let d = p.d;
  const maxDaysInTargetMonth = getDaysInMonth(y, m);
  if (d > maxDaysInTargetMonth) {
    d = maxDaysInTargetMonth;
  }

  // Now create Date object and add total days + weeks
  const dt = new Date(Date.UTC(y, m - 1, d));

  const additionalDays =
    ((parseInt(weeks, 10) || 0) * 7 + (parseInt(days, 10) || 0)) * mult;
  dt.setUTCDate(dt.getUTCDate() + additionalDays);

  return {
    isValid: true,
    startDateStr,
    resultingDateIso: formatDateIso(dt),
    resultingDateHuman: formatDateHuman(dt),
    businessDaysOnly: false,
  };
}

// ---------------------------------------------------------------------------
// URL State Encoder / Decoder
// ---------------------------------------------------------------------------

export function encodeDateState(state) {
  try {
    const params = new URLSearchParams();
    if (state.mode) params.set("m", state.mode);
    if (state.startDate) params.set("sd", state.startDate);
    if (state.mode === "diff") {
      if (state.endDate) params.set("ed", state.endDate);
      if (state.includeEndDay) params.set("inc", "1");
    } else {
      if (state.operation) params.set("op", state.operation);
      if (state.addYears) params.set("y", state.addYears);
      if (state.addMonths) params.set("mo", state.addMonths);
      if (state.addWeeks) params.set("w", state.addWeeks);
      if (state.addDays) params.set("d", state.addDays);
      if (state.businessDaysOnly) params.set("biz", "1");
    }
    return params.toString();
  } catch {
    return "";
  }
}

export function decodeDateState(search) {
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.size === 0) return null;

    return {
      mode: params.get("m") || "diff",
      startDate: params.get("sd") || "",
      endDate: params.get("ed") || "",
      includeEndDay: params.get("inc") === "1",
      operation: params.get("op") || "add",
      addYears: params.get("y") || "0",
      addMonths: params.get("mo") || "0",
      addWeeks: params.get("w") || "0",
      addDays: params.get("d") || "0",
      businessDaysOnly: params.get("biz") === "1",
    };
  } catch {
    return null;
  }
}
