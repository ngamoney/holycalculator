/**
 * angelNumber.js — Holy Calculator Angel Number Engine
 *
 * Core calculations for:
 *  - Date of Birth Personal Angel Number reduction & mapping
 *  - Pythagorean Gematria Name Angel Number reduction & mapping
 *  - Direct Repeating Sequence Lookup (111, 222, 333, 444, 555, 666, 777, 888, 999, 000, 1111, 1212)
 */

import { ANGEL_NUMBER_DICTIONARY } from "../data/angelNumberData.js";

const GEMATRIA_MAP = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const TRIPLE_MAP = {
  1: "111",
  2: "222",
  3: "333",
  4: "444",
  5: "555",
  6: "666",
  7: "777",
  8: "888",
  9: "999",
  11: "1111",
  22: "222",
  33: "333",
};

/**
 * Digit sum helper
 */
function sumDigits(val) {
  return String(Math.abs(val))
    .split("")
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
}

/**
 * Reduce number to single digit (1-9) or Master Number (11, 22, 33).
 */
function reduceNum(num) {
  let val = Math.abs(num);
  while (val > 9 && val !== 11 && val !== 22 && val !== 33) {
    val = sumDigits(val);
  }
  return val;
}

/**
 * Calculate Personal Angel Number by Date of Birth
 */
export function calculateAngelNumberByDob(month, day, year) {
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);
  const y = parseInt(year, 10);

  if (isNaN(m) || m < 1 || m > 12) {
    return { isValid: false, error: "Please select a valid month." };
  }
  if (isNaN(d) || d < 1 || d > 31) {
    return { isValid: false, error: "Please enter a valid day." };
  }
  if (isNaN(y) || y < 1000 || y > 9999) {
    return { isValid: false, error: "Please enter a valid 4-digit year." };
  }

  const mRed = reduceNum(m);
  const dRed = reduceNum(d);
  const yRed = reduceNum(sumDigits(y));

  const totalSum = mRed + dRed + yRed;
  const finalSingle = reduceNum(totalSum);

  const seqKey = TRIPLE_MAP[finalSingle] || "111";
  const data = ANGEL_NUMBER_DICTIONARY[seqKey] || ANGEL_NUMBER_DICTIONARY["111"];

  const calculationText = `Birth Date Reduction: Month (${mRed}) + Day (${dRed}) + Year (${yRed}) = ${totalSum} → Base ${finalSingle} → Angel Sequence ${seqKey}`;

  return {
    isValid: true,
    mode: "dob",
    sequence: seqKey,
    baseNumber: finalSingle,
    calculationText,
    data,
  };
}

/**
 * Calculate Angel Number by Full Name Gematria
 */
export function calculateAngelNumberByName(fullName) {
  if (!fullName || typeof fullName !== "string" || fullName.trim() === "") {
    return { isValid: false, error: "Please enter your full name." };
  }

  const cleanName = fullName.toLowerCase().replace(/[^a-z]/g, "");
  if (cleanName.length === 0) {
    return { isValid: false, error: "Please enter a valid name containing letters." };
  }

  let letterSum = 0;
  for (const char of cleanName) {
    letterSum += GEMATRIA_MAP[char] || 0;
  }

  const finalSingle = reduceNum(letterSum);
  const seqKey = TRIPLE_MAP[finalSingle] || "333";
  const data = ANGEL_NUMBER_DICTIONARY[seqKey] || ANGEL_NUMBER_DICTIONARY["333"];

  const calculationText = `Pythagorean Name Value: "${fullName.trim()}" sum = ${letterSum} → Base ${finalSingle} → Angel Sequence ${seqKey}`;

  return {
    isValid: true,
    mode: "name",
    name: fullName.trim(),
    sequence: seqKey,
    baseNumber: finalSingle,
    calculationText,
    data,
  };
}

/**
 * Direct Lookup Any Angel Number Sequence (e.g. "111", "444", "1111", "1212")
 */
export function lookupAngelNumber(sequenceInput) {
  if (!sequenceInput) {
    return { isValid: false, error: "Please select or type an Angel Number sequence." };
  }

  const clean = String(sequenceInput).trim();
  if (ANGEL_NUMBER_DICTIONARY[clean]) {
    return {
      isValid: true,
      mode: "lookup",
      sequence: clean,
      data: ANGEL_NUMBER_DICTIONARY[clean],
    };
  }

  // Fallback matching for repeating numbers (e.g. "77" -> "777", "9999" -> "999")
  const digits = clean.replace(/[^0-9]/g, "");
  if (digits.length > 0) {
    const firstDigit = digits[0];
    const candidate = `${firstDigit}${firstDigit}${firstDigit}`;
    if (ANGEL_NUMBER_DICTIONARY[candidate]) {
      return {
        isValid: true,
        mode: "lookup",
        sequence: candidate,
        data: ANGEL_NUMBER_DICTIONARY[candidate],
      };
    }
  }

  // General fallback to 1111
  return {
    isValid: true,
    mode: "lookup",
    sequence: "1111",
    data: ANGEL_NUMBER_DICTIONARY["1111"],
  };
}
