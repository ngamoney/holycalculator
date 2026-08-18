/**
 * lifePath.js — Holy Calculator Life Path & Numerology Engine
 *
 * Core calculations for:
 *  - Pythagorean Numerology Month, Day, Year reduction
 *  - Master Number preservation (11, 22, 33)
 *  - Step-by-step mathematical breakdown strings
 *  - Archetype matching from lifePathData.js
 */

import { LIFE_PATH_ARCHETYPES } from "../data/lifePathData.js";

/**
 * Digit sum helper function
 */
function sumDigits(val) {
  return String(Math.abs(val))
    .split("")
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
}

/**
 * Reduces a number to a single digit (1-9) or Master Number (11, 22, 33).
 */
export function reduceNumber(num) {
  let val = Math.abs(num);
  while (val > 9 && val !== 11 && val !== 22 && val !== 33) {
    val = sumDigits(val);
  }
  return val;
}

/**
 * Calculates Life Path Number and mathematical step breakdown from Date of Birth.
 * @param {string|number} month (1-12)
 * @param {string|number} day (1-31)
 * @param {string|number} year (e.g. 1994)
 */
export function calculateLifePathNumber(month, day, year) {
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  const y = parseInt(year, 10);

  if (isNaN(m) || m < 1 || m > 12) {
    return { isValid: false, error: "Please select a valid month (1–12)." };
  }
  if (isNaN(d) || d < 1 || d > 31) {
    return { isValid: false, error: "Please enter a valid day of the month (1–31)." };
  }
  if (isNaN(y) || y < 1000 || y > 9999) {
    return { isValid: false, error: "Please enter a valid 4-digit birth year." };
  }

  // Validate days in specific month/leap year
  const daysInMonth = new Date(y, m, 0).getDate();
  if (d > daysInMonth) {
    return { isValid: false, error: `Invalid day for selected month (max ${daysInMonth} days).` };
  }

  // Step 1: Reduce Month
  const monthReduced = reduceNumber(m);
  const monthStep = m !== monthReduced ? `${m} → (${sumDigits(m)}) = ${monthReduced}` : `${m}`;

  // Step 2: Reduce Day
  const dayReduced = reduceNumber(d);
  const dayStep = d !== dayReduced ? `${d} → (${String(d).split("").join("+")}) = ${dayReduced}` : `${d}`;

  // Step 3: Reduce Year
  const yearSum1 = sumDigits(y);
  const yearReduced = reduceNumber(yearSum1);
  const yearStep = `${y} → (${String(y).split("").join("+")}) = ${yearSum1}` + (yearSum1 !== yearReduced ? ` → ${yearReduced}` : "");

  // Step 4: Sum Reduced Values
  const initialSum = monthReduced + dayReduced + yearReduced;

  // Step 5: Reduce Final Sum
  const finalLifePath = reduceNumber(initialSum);

  // Step-by-step mathematical summary text
  const stepText = `Month (${monthStep}) + Day (${dayStep}) + Year (${yearStep}) = ${initialSum}` +
    (initialSum !== finalLifePath ? ` → (${String(initialSum).split("").join("+")}) = ${finalLifePath}` : "");

  // Archetype profile lookup
  const archetype = LIFE_PATH_ARCHETYPES[finalLifePath] || LIFE_PATH_ARCHETYPES[1];

  // Formatted date string
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dobFormatted = `${monthNames[m - 1]} ${d}, ${y}`;

  return {
    isValid: true,
    dob: { month: m, day: d, year: y, formatted: dobFormatted },
    reductions: {
      month: monthReduced,
      day: dayReduced,
      year: yearReduced,
      sum: initialSum,
    },
    stepText,
    lifePathNumber: finalLifePath,
    isMasterNumber: [11, 22, 33].includes(finalLifePath),
    archetype,
  };
}
