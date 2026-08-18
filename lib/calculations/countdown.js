/**
 * countdown.js — Holy Calculator Countdown Engine
 *
 * Core calculations for:
 *  - Time remaining breakdown (Days, Hours, Minutes, Seconds)
 *  - Total unit equivalents (Total Hours, Total Minutes, Total Seconds, Total Weeks, Total Months)
 *  - Preset holiday/event generators (New Year's, Christmas, Halloween, Summer Solstice)
 *  - Past event detection & countdown timer validation
 */

/**
 * Calculates countdown time remaining metrics between current time and target date/time.
 */
export function calculateCountdown(targetDateStr, targetTimeStr = "00:00", now = new Date()) {
  if (!targetDateStr) {
    return { isValid: false, error: "Please select a target event date." };
  }

  const timePart = targetTimeStr || "00:00";
  const targetDate = new Date(`${targetDateStr}T${timePart}:00`);

  if (isNaN(targetDate.getTime())) {
    return { isValid: false, error: "Please enter a valid target date and time format." };
  }

  const nowMs = now.getTime();
  const targetMs = targetDate.getTime();
  const diffMs = targetMs - nowMs;

  if (diffMs <= 0) {
    return {
      isValid: true,
      isPast: true,
      diffMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
      totalHours: 0,
      totalMinutes: 0,
      totalSeconds: 0,
      totalWeeks: 0,
      totalMonths: 0,
      message: "Target date and time has arrived!",
    };
  }

  const SECOND_MS = 1000;
  const MINUTE_MS = SECOND_MS * 60;
  const HOUR_MS = MINUTE_MS * 60;
  const DAY_MS = HOUR_MS * 24;

  const days = Math.floor(diffMs / DAY_MS);
  const hours = Math.floor((diffMs % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((diffMs % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((diffMs % MINUTE_MS) / SECOND_MS);

  const totalDays = Math.floor(diffMs / DAY_MS);
  const totalHours = Math.floor(diffMs / HOUR_MS);
  const totalMinutes = Math.floor(diffMs / MINUTE_MS);
  const totalSeconds = Math.floor(diffMs / SECOND_MS);
  const totalWeeks = (diffMs / (DAY_MS * 7)).toFixed(1);
  const totalMonths = (diffMs / (DAY_MS * 30.4375)).toFixed(1);

  return {
    isValid: true,
    isPast: false,
    diffMs,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    totalWeeks,
    totalMonths,
    targetFormatted: targetDate.toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    }),
  };
}

/**
 * Returns preset event date & time.
 */
export function getPresetEvent(presetKey, now = new Date()) {
  const currentYear = now.getFullYear();

  switch (presetKey) {
    case "new_year": {
      const nextYear = currentYear + 1;
      return {
        name: `New Year's Day ${nextYear}`,
        dateStr: `${nextYear}-01-01`,
        timeStr: "00:00",
      };
    }
    case "christmas": {
      let targetYear = currentYear;
      const xmasThisYear = new Date(`${currentYear}-12-25T00:00:00`);
      if (now.getTime() > xmasThisYear.getTime()) {
        targetYear++;
      }
      return {
        name: `Christmas Day ${targetYear}`,
        dateStr: `${targetYear}-12-25`,
        timeStr: "00:00",
      };
    }
    case "halloween": {
      let targetYear = currentYear;
      const halloweenThisYear = new Date(`${currentYear}-10-31T00:00:00`);
      if (now.getTime() > halloweenThisYear.getTime()) {
        targetYear++;
      }
      return {
        name: `Halloween ${targetYear}`,
        dateStr: `${targetYear}-10-31`,
        timeStr: "00:00",
      };
    }
    case "summer_solstice": {
      let targetYear = currentYear;
      const solsticeThisYear = new Date(`${currentYear}-06-21T00:00:00`);
      if (now.getTime() > solsticeThisYear.getTime()) {
        targetYear++;
      }
      return {
        name: `Summer Solstice ${targetYear}`,
        dateStr: `${targetYear}-06-21`,
        timeStr: "00:00",
      };
    }
    default:
      return null;
  }
}
