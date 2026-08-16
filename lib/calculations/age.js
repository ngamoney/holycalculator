/**
 * Pure Calculation Logic for Age and Time Differences
 * Standard Gregorian Calendar with precise month-length borrowing and unit breakdowns
 */

/**
 * Parses YYYY-MM-DD string into year, month (1-12), and day (1-31)
 */
function parseDateParts(dateStr) {
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
 * Locale-agnostic number formatter with US-style comma separators.
 * Avoids toLocaleString() which produces different output on Node.js (Indian locale)
 * vs the browser, causing React hydration mismatches.
 */
function fmt(n) {
  const str = String(Math.round(n));
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Returns the number of days in a specific month of a given year.
 * @param {number} year e.g. 2024
 * @param {number} month 1 to 12
 */
export function getDaysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Computes exact chronological age and detailed breakdowns.
 * @param {string} birthDateStr "YYYY-MM-DD"
 * @param {string} targetDateStr "YYYY-MM-DD"
 */
export function calculateAgeDetails(birthDateStr, targetDateStr) {
  const p1 = parseDateParts(birthDateStr);
  const p2 = parseDateParts(targetDateStr);

  if (!p1 || !p2) {
    return {
      isValid: false,
      message: "Please enter valid dates for Date of Birth and Target Date."
    };
  }

  const birthUtc = Date.UTC(p1.y, p1.m - 1, p1.d);
  const targetUtc = Date.UTC(p2.y, p2.m - 1, p2.d);

  if (targetUtc < birthUtc) {
    return {
      isValid: false,
      message: "Date of birth cannot be later than the target date."
    };
  }

  // 1. Exact Years, Months, and Days using Calendar Borrowing
  let y1 = p1.y;
  let m1 = p1.m;
  let d1 = p1.d;

  let y2 = p2.y;
  let m2 = p2.m;
  let d2 = p2.d;

  if (d2 < d1) {
    // Borrow days from the previous month
    m2 -= 1;
    if (m2 === 0) {
      m2 = 12;
      y2 -= 1;
    }
    const daysInPrevMonth = getDaysInMonth(y2, m2);
    d2 += daysInPrevMonth;
  }

  if (m2 < m1) {
    // Borrow months from previous year
    y2 -= 1;
    m2 += 12;
  }

  const years = y2 - y1;
  const months = m2 - m1;
  const days = d2 - d1;

  // 2. Continuous Unit Conversions
  const msDiff = targetUtc - birthUtc;
  const totalDays = Math.round(msDiff / (1000 * 60 * 60 * 24));
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;

  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysAfterWeeks = totalDays % 7;

  const totalMonths = years * 12 + months;
  const remainingDaysAfterMonths = days;

  // 3. Day of week born
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const birthDayOfWeek = daysOfWeek[new Date(birthUtc).getUTCDay()];
  const targetDayOfWeek = daysOfWeek[new Date(targetUtc).getUTCDay()];

  // 4. Next Birthday Countdown
  let nextBdayYear = p2.y;
  let nextBdayMonth = p1.m;
  let nextBdayDay = p1.d;

  // Handle Feb 29 on non-leap years
  if (p1.m === 2 && p1.d === 29) {
    const isLeap = (nextBdayYear % 4 === 0 && nextBdayYear % 100 !== 0) || (nextBdayYear % 400 === 0);
    if (!isLeap) {
      nextBdayDay = 28;
    }
  }

  let nextBdayUtc = Date.UTC(nextBdayYear, nextBdayMonth - 1, nextBdayDay);
  if (nextBdayUtc < targetUtc) {
    nextBdayYear += 1;
    let bDay = p1.d;
    if (p1.m === 2 && p1.d === 29) {
      const isNextLeap = (nextBdayYear % 4 === 0 && nextBdayYear % 100 !== 0) || (nextBdayYear % 400 === 0);
      if (!isNextLeap) bDay = 28;
    }
    nextBdayUtc = Date.UTC(nextBdayYear, nextBdayMonth - 1, bDay);
  }

  const daysToNextBday = Math.round((nextBdayUtc - targetUtc) / (1000 * 60 * 60 * 24));
  const nextBdayDayOfWeek = daysOfWeek[new Date(nextBdayUtc).getUTCDay()];

  const yearStr = `${years} ${years === 1 ? "year" : "years"}`;
  const monthStr = `${months} ${months === 1 ? "month" : "months"}`;
  const dayStr = `${days} ${days === 1 ? "day" : "days"}`;

  const remainingDaysMonthStr = `${remainingDaysAfterMonths} ${remainingDaysAfterMonths === 1 ? "day" : "days"}`;
  const remainingDaysWeekStr = `${remainingDaysAfterWeeks} ${remainingDaysAfterWeeks === 1 ? "day" : "days"}`;

  return {
    isValid: true,
    birthDateStr,
    targetDateStr,
    primary: {
      years,
      months,
      days,
      formattedText: `${yearStr}, ${monthStr}, ${dayStr}`
    },
    breakdown: {
      months: {
        totalMonths,
        remainingDays: remainingDaysAfterMonths,
        formatted: `${fmt(totalMonths)} ${totalMonths === 1 ? "month" : "months"}, ${remainingDaysMonthStr}`
      },
      weeks: {
        totalWeeks,
        remainingDays: remainingDaysAfterWeeks,
        formatted: `${fmt(totalWeeks)} ${totalWeeks === 1 ? "week" : "weeks"}, ${remainingDaysWeekStr}`
      },
      days: {
        totalDays,
        formatted: `${fmt(totalDays)} ${totalDays === 1 ? "day" : "days"}`
      },
      hours: {
        totalHours,
        formatted: `${fmt(totalHours)} ${totalHours === 1 ? "hour" : "hours"}`
      },
      minutes: {
        totalMinutes,
        formatted: `${fmt(totalMinutes)} ${totalMinutes === 1 ? "minute" : "minutes"}`
      },
      seconds: {
        totalSeconds,
        formatted: `${fmt(totalSeconds)} ${totalSeconds === 1 ? "second" : "seconds"}`
      }
    },
    meta: {
      birthDayOfWeek,
      targetDayOfWeek,
      daysToNextBday,
      nextBdayDayOfWeek,
      nextBdayYear
    }
  };
}

/**
 * URL State Encoding/Decoding
 */
export function encodeAgeState(dob, at) {
  const params = new URLSearchParams();
  if (dob) params.set("dob", dob);
  if (at) params.set("at", at);
  return params.toString();
}

export function decodeAgeState(searchString) {
  if (!searchString || searchString.length <= 1) return null;
  try {
    const params = new URLSearchParams(searchString.startsWith("?") ? searchString.slice(1) : searchString);
    const dob = params.get("dob");
    const at = params.get("at");
    if (dob || at) {
      return { dob: dob || "", at: at || "" };
    }
    return null;
  } catch (e) {
    return null;
  }
}
