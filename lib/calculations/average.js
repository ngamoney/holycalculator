/**
 * average.js — Holy Calculator Average & Statistical Metrics Engine
 *
 * Provides functions for:
 *  - Parsing raw string inputs (commas, spaces, newlines, semicolons)
 *  - Arithmetic Mean, Median, Mode, Range, Min, Max, Sum, Count
 *  - Geometric Mean (for positive numbers)
 *  - Harmonic Mean (for positive numbers)
 *  - Weighted Average calculation
 */

/**
 * Parses raw text input into an array of numbers.
 */
export function parseNumberList(rawInput) {
  if (!rawInput || typeof rawInput !== "string") return [];
  const tokens = rawInput.split(/[,\s;]+/);
  const nums = [];
  for (const token of tokens) {
    const trimmed = token.trim();
    if (trimmed === "") continue;
    const val = Number(trimmed);
    if (!isNaN(val)) {
      nums.push(val);
    }
  }
  return nums;
}

/**
 * Calculates Simple Average and Statistical Metrics.
 */
export function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return { isValid: false, error: "Please enter at least one valid number." };
  }

  const count = numbers.length;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / count;

  const sorted = [...numbers].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;

  // Median
  let median = 0;
  if (count % 2 === 1) {
    median = sorted[Math.floor(count / 2)];
  } else {
    const mid1 = sorted[count / 2 - 1];
    const mid2 = sorted[count / 2];
    median = (mid1 + mid2) / 2;
  }

  // Mode
  const freqMap = new Map();
  let maxFreq = 0;
  for (const num of numbers) {
    const freq = (freqMap.get(num) || 0) + 1;
    freqMap.set(num, freq);
    if (freq > maxFreq) maxFreq = freq;
  }

  let modes = [];
  if (maxFreq > 1 && freqMap.size < count) {
    const isAllSameFreq = Array.from(freqMap.values()).every((f) => f === maxFreq);
    if (!isAllSameFreq) {
      modes = Array.from(freqMap.entries())
        .filter(([, freq]) => freq === maxFreq)
        .map(([num]) => num)
        .sort((a, b) => a - b);
    }
  }

  // Geometric Mean (for all positive numbers > 0)
  let geometricMean = null;
  const allPositive = numbers.every((n) => n > 0);
  if (allPositive) {
    const sumLogs = numbers.reduce((acc, n) => acc + Math.log(n), 0);
    geometricMean = Math.exp(sumLogs / count);
  }

  // Harmonic Mean (for all positive numbers > 0)
  let harmonicMean = null;
  if (allPositive) {
    const sumReciprocals = numbers.reduce((acc, n) => acc + 1 / n, 0);
    harmonicMean = count / sumReciprocals;
  }

  return {
    isValid: true,
    calcType: "simple",
    count,
    sum,
    mean,
    median,
    modes,
    modeText: modes.length > 0 ? modes.join(", ") : "No mode",
    min,
    max,
    range,
    geometricMean,
    harmonicMean,
    sorted,
  };
}

/**
 * Calculates Weighted Average.
 * @param {Array<{value: number, weight: number}>} pairs
 */
export function calculateWeightedAverage(pairs) {
  if (!Array.isArray(pairs) || pairs.length === 0) {
    return { isValid: false, error: "Please enter at least one value and weight pair." };
  }

  let totalWeight = 0;
  let weightedSum = 0;
  let validCount = 0;

  for (const p of pairs) {
    const val = parseFloat(p.value);
    const w = parseFloat(p.weight);
    if (!isNaN(val) && !isNaN(w) && w >= 0) {
      weightedSum += val * w;
      totalWeight += w;
      validCount++;
    }
  }

  if (validCount === 0 || totalWeight === 0) {
    return { isValid: false, error: "Total weight must be greater than zero." };
  }

  const weightedMean = weightedSum / totalWeight;

  return {
    isValid: true,
    calcType: "weighted",
    validCount,
    totalWeight,
    weightedSum,
    weightedMean,
  };
}
