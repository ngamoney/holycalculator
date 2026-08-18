/**
 * Time Zone Calculation Module for Holy Calculator
 * Fixed UTC-offset model — pure static arithmetic, zero browser/Intl dependencies.
 */

export const TIME_ZONE_OFFSETS = [
  { id: "utc-12", offsetMinutes: -720, code: "UTC-12:00", label: "(UTC-12:00) International Date Line West (Baker Island, Howland Island)" },
  { id: "utc-11", offsetMinutes: -660, code: "UTC-11:00", label: "(UTC-11:00) Niue, Samoa (Standard Time), Midway Island" },
  { id: "utc-10", offsetMinutes: -600, code: "UTC-10:00", label: "(UTC-10:00) Hawaii Standard Time, Cook Islands, Tahiti" },
  { id: "utc-09-30", offsetMinutes: -570, code: "UTC-09:30", label: "(UTC-09:30) Marquesas Islands" },
  { id: "utc-09", offsetMinutes: -540, code: "UTC-09:00", label: "(UTC-09:00) Alaska Standard Time, Gambier Islands" },
  { id: "utc-08", offsetMinutes: -480, code: "UTC-08:00", label: "(UTC-08:00) Pacific Standard Time (US & Canada), Tijuana" },
  { id: "utc-07", offsetMinutes: -420, code: "UTC-07:00", label: "(UTC-07:00) Mountain Standard Time (US & Canada), Arizona, Sonora" },
  { id: "utc-06", offsetMinutes: -360, code: "UTC-06:00", label: "(UTC-06:00) Central Standard Time (US & Canada), Mexico City, Guatemala" },
  { id: "utc-05", offsetMinutes: -300, code: "UTC-05:00", label: "(UTC-05:00) Eastern Standard Time (US & Canada), Colombia, Peru, Cuba" },
  { id: "utc-04", offsetMinutes: -240, code: "UTC-04:00", label: "(UTC-04:00) Atlantic Standard Time, Caracas, La Paz, Santiago" },
  { id: "utc-03-30", offsetMinutes: -210, code: "UTC-03:30", label: "(UTC-03:30) Newfoundland Standard Time" },
  { id: "utc-03", offsetMinutes: -180, code: "UTC-03:00", label: "(UTC-03:00) Brasilia, Buenos Aires, Montevideo, Greenland" },
  { id: "utc-02", offsetMinutes: -120, code: "UTC-02:00", label: "(UTC-02:00) Mid-Atlantic, South Georgia & Sandwich Islands" },
  { id: "utc-01", offsetMinutes: -60, code: "UTC-01:00", label: "(UTC-01:00) Azores, Cape Verde" },
  { id: "utc+00", offsetMinutes: 0, code: "UTC+00:00", label: "(UTC+00:00) Greenwich Mean Time (GMT/UTC), London, Lisbon, Accra" },
  { id: "utc+01", offsetMinutes: 60, code: "UTC+01:00", label: "(UTC+01:00) Central European Time (CET), Paris, Berlin, Rome, Lagos" },
  { id: "utc+02", offsetMinutes: 120, code: "UTC+02:00", label: "(UTC+02:00) Eastern European Time (EET), Cairo, Athens, Jerusalem, Johannesburg" },
  { id: "utc+03", offsetMinutes: 180, code: "UTC+03:00", label: "(UTC+03:00) Moscow Time, East Africa Time, Riyadh, Baghdad, Nairobi" },
  { id: "utc+03-30", offsetMinutes: 210, code: "UTC+03:30", label: "(UTC+03:30) Iran Standard Time (Tehran)" },
  { id: "utc+04", offsetMinutes: 240, code: "UTC+04:00", label: "(UTC+04:00) Gulf Standard Time, Dubai, Baku, Tbilisi, Yerevan" },
  { id: "utc+04-30", offsetMinutes: 270, code: "UTC+04:30", label: "(UTC+04:30) Afghanistan Time (Kabul)" },
  { id: "utc+05", offsetMinutes: 300, code: "UTC+05:00", label: "(UTC+05:00) Pakistan Standard Time, Tashkent, Karachi, Yekaterinburg" },
  { id: "utc+05-30", offsetMinutes: 330, code: "UTC+05:30", label: "(UTC+05:30) India Standard Time (IST), Sri Lanka" },
  { id: "utc+05-45", offsetMinutes: 345, code: "UTC+05:45", label: "(UTC+05:45) Nepal Time (Kathmandu)" },
  { id: "utc+06", offsetMinutes: 360, code: "UTC+06:00", label: "(UTC+06:00) Bangladesh Standard Time, Dhaka, Almaty, Astana" },
  { id: "utc+06-30", offsetMinutes: 390, code: "UTC+06:30", label: "(UTC+06:30) Myanmar Time (Yangon), Cocos Islands" },
  { id: "utc+07", offsetMinutes: 420, code: "UTC+07:00", label: "(UTC+07:00) Indochina Time, Bangkok, Jakarta, Hanoi, Krasnoyarsk" },
  { id: "utc+08", offsetMinutes: 480, code: "UTC+08:00", label: "(UTC+08:00) China Standard Time, Western Australia, Singapore, Hong Kong, Perth" },
  { id: "utc+08-45", offsetMinutes: 525, code: "UTC+08:45", label: "(UTC+08:45) Australian Western Central Time (Eucla)" },
  { id: "utc+09", offsetMinutes: 540, code: "UTC+09:00", label: "(UTC+09:00) Japan Standard Time, Korea Standard Time, Tokyo, Seoul" },
  { id: "utc+09-30", offsetMinutes: 570, code: "UTC+09:30", label: "(UTC+09:30) Australian Central Standard Time, Darwin, Adelaide" },
  { id: "utc+10", offsetMinutes: 600, code: "UTC+10:00", label: "(UTC+10:00) Australian Eastern Standard Time, Sydney, Melbourne, Brisbane, Guam" },
  { id: "utc+10-30", offsetMinutes: 630, code: "UTC+10:30", label: "(UTC+10:30) Lord Howe Standard Time" },
  { id: "utc+11", offsetMinutes: 660, code: "UTC+11:00", label: "(UTC+11:00) Solomon Islands, Vanuatu, New Caledonia, Magadan" },
  { id: "utc+12", offsetMinutes: 720, code: "UTC+12:00", label: "(UTC+12:00) New Zealand Standard Time, Fiji, Marshall Islands, Kamchatka" },
  { id: "utc+12-45", offsetMinutes: 765, code: "UTC+12:45", label: "(UTC+12:45) Chatham Islands Standard Time" },
  { id: "utc+13", offsetMinutes: 780, code: "UTC+13:00", label: "(UTC+13:00) Tonga, Samoa, Tokelau, Phoenix Islands" },
  { id: "utc+14", offsetMinutes: 840, code: "UTC+14:00", label: "(UTC+14:00) Line Islands (Kiribati - Kiritimati)" },
];

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Checks if a given year is a leap year.
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Gets total days in a given month.
 */
function getDaysInMonth(year, month) {
  const daysInMonths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonths[month - 1] || 31;
}

/**
 * Validates date and time string inputs.
 */
export function validateDateTimeInput(dateStr, timeStr) {
  if (!dateStr) return { isValid: false, error: "Please enter a date." };
  
  const dateParts = dateStr.split("-");
  if (dateParts.length !== 3) return { isValid: false, error: "Invalid date format. Use YYYY-MM-DD." };
  
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);
  
  if (isNaN(year) || year < 1000 || year > 9999) {
    return { isValid: false, error: "Year must be between 1000 and 9999." };
  }
  if (isNaN(month) || month < 1 || month > 12) {
    return { isValid: false, error: "Month must be between 01 and 12." };
  }
  const maxDays = getDaysInMonth(year, month);
  if (isNaN(day) || day < 1 || day > maxDays) {
    return { isValid: false, error: `Invalid day for ${MONTH_NAMES[month - 1]} ${year} (max ${maxDays} days).` };
  }

  if (!timeStr) return { isValid: false, error: "Please enter a time." };

  const timeParts = timeStr.split(":");
  if (timeParts.length < 2 || timeParts.length > 3) {
    return { isValid: false, error: "Invalid time format. Use HH:mm or HH:mm:ss." };
  }

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = timeParts.length === 3 ? parseInt(timeParts[2], 10) : 0;

  if (isNaN(hours) || hours < 0 || hours > 23) {
    return { isValid: false, error: "Hours must be between 00 and 23." };
  }
  if (isNaN(minutes) || minutes < 0 || minutes > 59) {
    return { isValid: false, error: "Minutes must be between 00 and 59." };
  }
  if (isNaN(seconds) || seconds < 0 || seconds > 59) {
    return { isValid: false, error: "Seconds must be between 00 and 59." };
  }

  return {
    isValid: true,
    year,
    month,
    day,
    hours,
    minutes,
    seconds
  };
}

/**
 * Format a number as 2-digit padded string.
 */
function pad(num) {
  return String(num).padStart(2, "0");
}

/**
 * Format minutes into relative hours/minutes text (e.g. "+14 hours 30 minutes ahead").
 */
export function formatOffsetDifference(diffMinutes) {
  if (diffMinutes === 0) {
    return "Same local time (0 hours difference)";
  }

  const absMins = Math.abs(diffMinutes);
  const hrs = Math.floor(absMins / 60);
  const mins = absMins % 60;

  const hrText = hrs === 1 ? "1 hour" : `${hrs} hours`;
  const minText = mins === 0 ? "" : mins === 1 ? " 1 minute" : ` ${mins} minutes`;

  const timeSpan = hrs > 0 && mins > 0 ? `${hrText} and${minText}` : hrs > 0 ? hrText : minText.trim();
  const direction = diffMinutes > 0 ? "ahead of" : "behind";

  return `${timeSpan} ${direction} From zone`;
}

/**
 * Converts a date and 24-hour time between two fixed UTC offsets.
 * Pure static arithmetic, handles day boundary rollover (+1 day, -1 day).
 */
export function convertTimeZone({ dateStr, timeStr, fromOffsetMinutes, toOffsetMinutes }) {
  const validation = validateDateTimeInput(dateStr, timeStr);
  if (!validation.isValid) {
    return { isValid: false, error: validation.error };
  }

  const { year, month, day, hours, minutes, seconds } = validation;

  // 1. Create naive UTC timestamp representing the input time as if it were UTC
  const inputUtcMs = Date.UTC(year, month - 1, day, hours, minutes, seconds);

  // 2. Adjust for offset difference between From and To in milliseconds
  // Target Time = Input Time - fromOffset + toOffset
  const offsetDiffMinutes = toOffsetMinutes - fromOffsetMinutes;
  const offsetDiffMs = offsetDiffMinutes * 60 * 1000;
  const targetUtcMs = inputUtcMs + offsetDiffMs;

  // 3. Extract target UTC date components
  const targetDateObj = new Date(targetUtcMs);
  const targetYear = targetDateObj.getUTCFullYear();
  const targetMonth = targetDateObj.getUTCMonth() + 1;
  const targetDay = targetDateObj.getUTCDate();
  const targetHours = targetDateObj.getUTCHours();
  const targetMinutes = targetDateObj.getUTCMinutes();
  const targetSeconds = targetDateObj.getUTCSeconds();
  const targetDayOfWeekIndex = targetDateObj.getUTCDay();

  // 4. Input date components for day rollover comparison
  const inputDateObj = new Date(inputUtcMs);
  const inputDayOfWeekIndex = inputDateObj.getUTCDay();

  // Day rollover calculation (difference in calendar days)
  const dateOnlyInputMs = Date.UTC(year, month - 1, day);
  const dateOnlyTargetMs = Date.UTC(targetYear, targetMonth - 1, targetDay);
  const dayShift = Math.round((dateOnlyTargetMs - dateOnlyInputMs) / (24 * 60 * 60 * 1000));

  let dayShiftLabel = "Same day";
  if (dayShift > 0) {
    dayShiftLabel = dayShift === 1 ? "+1 day (Next day)" : `+${dayShift} days`;
  } else if (dayShift < 0) {
    dayShiftLabel = dayShift === -1 ? "-1 day (Previous day)" : `${dayShift} days`;
  }

  // Formatting 24-hour time
  const time24 = `${pad(targetHours)}:${pad(targetMinutes)}:${pad(targetSeconds)}`;

  // Formatting 12-hour AM/PM time
  const ampm = targetHours >= 12 ? "PM" : "AM";
  const hours12 = targetHours % 12 === 0 ? 12 : targetHours % 12;
  const time12 = `${pad(hours12)}:${pad(targetMinutes)}:${pad(targetSeconds)} ${ampm}`;

  // Formatting dates
  const formattedTargetDateIso = `${targetYear}-${pad(targetMonth)}-${pad(targetDay)}`;
  const formattedTargetDateLong = `${DAYS_OF_WEEK[targetDayOfWeekIndex]}, ${MONTH_NAMES[targetMonth - 1]} ${targetDay}, ${targetYear}`;
  const formattedInputDateLong = `${DAYS_OF_WEEK[inputDayOfWeekIndex]}, ${MONTH_NAMES[month - 1]} ${day}, ${year}`;

  const fromZoneObj = TIME_ZONE_OFFSETS.find(z => z.offsetMinutes === fromOffsetMinutes) || { code: `UTC${fromOffsetMinutes >= 0 ? "+" : ""}${Math.floor(fromOffsetMinutes/60)}:${pad(Math.abs(fromOffsetMinutes)%60)}`, label: "Custom Offset" };
  const toZoneObj = TIME_ZONE_OFFSETS.find(z => z.offsetMinutes === toOffsetMinutes) || { code: `UTC${toOffsetMinutes >= 0 ? "+" : ""}${Math.floor(toOffsetMinutes/60)}:${pad(Math.abs(toOffsetMinutes)%60)}`, label: "Custom Offset" };

  return {
    isValid: true,
    input: {
      dateStr,
      timeStr,
      formattedDateLong: formattedInputDateLong,
      fromZone: fromZoneObj,
    },
    result: {
      dateIso: formattedTargetDateIso,
      dateLong: formattedTargetDateLong,
      time24,
      time12,
      toZone: toZoneObj,
      dayShift,
      dayShiftLabel,
      offsetDiffMinutes,
      offsetDiffText: formatOffsetDifference(offsetDiffMinutes),
    }
  };
}
