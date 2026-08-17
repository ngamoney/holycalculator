/**
 * Clinical calculation routines for Pregnancy & Due Date Estimations
 * Based on ACOG (American College of Obstetricians and Gynecologists) standards.
 */

// Helper to add or subtract days from a Date object
export function addDays(date, days) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + days);
  return result;
}

// Helper to calculate difference in full calendar days between two dates
export function diffDays(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((a.getTime() - b.getTime()) / msPerDay);
}

// Format date into human readable string (e.g. "Saturday, October 24, 2026")
export function formatDateLong(date) {
  if (!date || isNaN(new Date(date).getTime())) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format date into short ISO format string YYYY-MM-DD for date inputs
export function formatDateISO(date) {
  if (!date || isNaN(new Date(date).getTime())) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 1. Last Menstrual Period (LMP)
 * Naegele's Rule adjusted for cycle length (range 22-44, default 28).
 */
export function calculateByLMP(lmpDateInput, cycleLengthInput = 28) {
  const lmpDate = new Date(lmpDateInput);
  if (isNaN(lmpDate.getTime())) return null;

  const cycleLength = Math.max(22, Math.min(44, Number(cycleLengthInput) || 28));
  // Ovulation offset from LMP: cycleLength - 14 days
  // Due date = LMP + (cycleLength - 14) + 266 days = LMP + 252 + cycleLength
  const dueDate = addDays(lmpDate, 252 + cycleLength);
  const estimatedConception = addDays(dueDate, -266);
  const estimatedLMP = lmpDate;

  return {
    method: "lmp",
    dueDate,
    estimatedConception,
    estimatedLMP,
    cycleLength,
  };
}

/**
 * 2. Conception Date
 * Due date = Conception Date + 266 days (38 weeks).
 */
export function calculateByConception(conceptionDateInput) {
  const conceptionDate = new Date(conceptionDateInput);
  if (isNaN(conceptionDate.getTime())) return null;

  const dueDate = addDays(conceptionDate, 266);
  const estimatedLMP = addDays(conceptionDate, -14);

  return {
    method: "conception",
    dueDate,
    estimatedConception: conceptionDate,
    estimatedLMP,
  };
}

/**
 * 3. IVF Transfer Date
 * Day 3: transferDate + 263 days
 * Day 5/6: transferDate + 261 days
 */
export function calculateByIVF(transferDateInput, embryoAgeInput = "day5") {
  const transferDate = new Date(transferDateInput);
  if (isNaN(transferDate.getTime())) return null;

  let daysToAdd = 261;
  let conceptionOffset = -5;
  if (embryoAgeInput === "day3") {
    daysToAdd = 263;
    conceptionOffset = -3;
  } else if (embryoAgeInput === "day6") {
    daysToAdd = 261;
    conceptionOffset = -6;
  }

  const dueDate = addDays(transferDate, daysToAdd);
  const estimatedConception = addDays(transferDate, conceptionOffset);
  const estimatedLMP = addDays(dueDate, -280);

  return {
    method: "ivf",
    dueDate,
    estimatedConception,
    estimatedLMP,
    embryoAge: embryoAgeInput,
  };
}

/**
 * 4. Ultrasound Scan Date
 * Total scan days = (weeks * 7) + days.
 * Due date = ultrasoundDate + (280 - total scan days).
 */
export function calculateByUltrasound(ultrasoundDateInput, weeksInput = 8, daysInput = 0) {
  const scanDate = new Date(ultrasoundDateInput);
  if (isNaN(scanDate.getTime())) return null;

  const weeks = Math.max(1, Math.min(42, Number(weeksInput) || 0));
  const days = Math.max(0, Math.min(6, Number(daysInput) || 0));
  const totalScanDays = weeks * 7 + days;

  const remainingDays = 280 - totalScanDays;
  const dueDate = addDays(scanDate, remainingDays);
  const estimatedLMP = addDays(scanDate, -totalScanDays);
  const estimatedConception = addDays(dueDate, -266);

  return {
    method: "ultrasound",
    dueDate,
    estimatedConception,
    estimatedLMP,
    scanGestationalAge: { weeks, days, totalScanDays },
  };
}

/**
 * 5. Known Due Date (Reverse Mode)
 */
export function calculateByKnownDueDate(dueDateInput) {
  const dueDate = new Date(dueDateInput);
  if (isNaN(dueDate.getTime())) return null;

  const estimatedLMP = addDays(dueDate, -280);
  const estimatedConception = addDays(dueDate, -266);

  return {
    method: "known_due_date",
    dueDate,
    estimatedConception,
    estimatedLMP,
  };
}

/**
 * Calculates current gestational status, trimester info, and milestones
 * given a calculated due date and target date (defaults to today).
 */
export function getGestationalStatus(dueDateInput, asOfDateInput = new Date()) {
  const dueDate = new Date(dueDateInput);
  const asOfDate = new Date(asOfDateInput);

  if (isNaN(dueDate.getTime()) || isNaN(asOfDate.getTime())) return null;

  dueDate.setHours(0, 0, 0, 0);
  asOfDate.setHours(0, 0, 0, 0);

  // Derived estimated LMP = dueDate - 280 days
  const estimatedLMP = addDays(dueDate, -280);
  const estimatedConception = addDays(dueDate, -266);

  // Total days elapsed since estimated LMP
  const totalElapsedDays = diffDays(asOfDate, estimatedLMP);
  const daysRemaining = diffDays(dueDate, asOfDate);

  // Weeks & days
  const weeks = Math.floor(totalElapsedDays / 7);
  const days = totalElapsedDays % 7;

  // Trimester boundaries
  // T1: Weeks 1-13 (Days 1 to 91)
  // T2: Weeks 14-27 (Days 92 to 189)
  // T3: Weeks 28-40+ (Days 190+)
  let trimesterNumber = 1;
  let trimesterName = "First Trimester";
  let trimesterRange = "Weeks 1–13";

  if (totalElapsedDays >= 190) {
    trimesterNumber = 3;
    trimesterName = "Third Trimester";
    trimesterRange = "Weeks 28–40+";
  } else if (totalElapsedDays >= 92) {
    trimesterNumber = 2;
    trimesterName = "Second Trimester";
    trimesterRange = "Weeks 14–27";
  }

  // Progress percentage (0 to 100)
  const progressPercent = Math.min(100, Math.max(0, Math.round((totalElapsedDays / 280) * 100)));

  // Key Milestones
  const milestones = [
    {
      key: "conception",
      title: "Estimated Conception",
      date: estimatedConception,
      formattedDate: formatDateLong(estimatedConception),
      description: "Approximate fertilization / conception window",
    },
    {
      key: "t1_end",
      title: "End of 1st Trimester",
      date: addDays(estimatedLMP, 91),
      formattedDate: formatDateLong(addDays(estimatedLMP, 91)),
      description: "Completion of 13 weeks",
    },
    {
      key: "t2_end",
      title: "End of 2nd Trimester",
      date: addDays(estimatedLMP, 189),
      formattedDate: formatDateLong(addDays(estimatedLMP, 189)),
      description: "Completion of 27 weeks",
    },
    {
      key: "full_term",
      title: "Early Full Term (37 Weeks)",
      date: addDays(estimatedLMP, 259),
      formattedDate: formatDateLong(addDays(estimatedLMP, 259)),
      description: "37 completed weeks of gestation",
    },
    {
      key: "due_date",
      title: "Estimated Due Date (40 Weeks)",
      date: dueDate,
      formattedDate: formatDateLong(dueDate),
      description: "40 completed weeks from LMP",
    },
  ];

  return {
    dueDate,
    formattedDueDate: formatDateLong(dueDate),
    estimatedConception,
    formattedConception: formatDateLong(estimatedConception),
    estimatedLMP,
    formattedLMP: formatDateLong(estimatedLMP),
    totalElapsedDays,
    daysRemaining,
    gestationalAge: {
      weeks,
      days,
      formatted: totalElapsedDays < 0
        ? "Not started yet"
        : `${weeks} ${weeks === 1 ? "week" : "weeks"}, ${days} ${days === 1 ? "day" : "days"}`,
    },
    trimester: {
      number: trimesterNumber,
      name: trimesterName,
      range: trimesterRange,
    },
    progressPercent,
    milestones,
  };
}
