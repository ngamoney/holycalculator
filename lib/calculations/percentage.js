/**
 * percentage.js — Holy Calculator Percentage Engine
 *
 * Core pure functions for:
 *  - Group A: Basic Percentage Phrasings
 *    1. What is X% of Y? (solve for output)
 *    2. X is what % of Y? (solve for percentage)
 *    3. X is Y% of what? (solve for base value)
 *  - Group B: Percentage Difference
 *  - Group C: Percentage Change (Increase & Decrease)
 *  - URL State Encoding/Decoding
 */

/**
 * Clean numeric formatting (removes floating point noise e.g. 15.000000000000002)
 */
export function formatNum(n, decimals = 4) {
  if (n === null || n === undefined || isNaN(n)) return "";
  const rounded = Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return rounded.toString();
}

/**
 * Group A1: "What is P% of V1?"
 * Formula: V2 = (P / 100) * V1
 */
export function calcPercentOf(pStr, v1Str) {
  const p = parseFloat(pStr);
  const v1 = parseFloat(v1Str);
  if (isNaN(p) || isNaN(v1)) return null;
  const result = (p / 100) * v1;
  return {
    p,
    v1,
    result,
    resultFormatted: formatNum(result),
    formulaText: `${p}% × ${v1} = ${formatNum(result)}`,
  };
}

/**
 * Group A2: "V1 is what % of V2?"
 * Formula: P = (V1 / V2) * 100
 */
export function calcWhatPercentOf(v1Str, v2Str) {
  const v1 = parseFloat(v1Str);
  const v2 = parseFloat(v2Str);
  if (isNaN(v1) || isNaN(v2) || v2 === 0) return null;
  const result = (v1 / v2) * 100;
  return {
    v1,
    v2,
    result,
    resultFormatted: `${formatNum(result)}%`,
    formulaText: `(${v1} ÷ ${v2}) × 100 = ${formatNum(result)}%`,
  };
}

/**
 * Group A3: "V1 is P% of what?"
 * Formula: V2 = V1 / (P / 100)
 */
export function calcIsPercentOfWhat(v1Str, pStr) {
  const v1 = parseFloat(v1Str);
  const p = parseFloat(pStr);
  if (isNaN(v1) || isNaN(p) || p === 0) return null;
  const result = v1 / (p / 100);
  return {
    v1,
    p,
    result,
    resultFormatted: formatNum(result),
    formulaText: `${v1} ÷ (${p} ÷ 100) = ${formatNum(result)}`,
  };
}

/**
 * Group B: Percentage Difference between V1 and V2
 * Formula: |V1 - V2| / ((V1 + V2) / 2) * 100
 */
export function calcPercentDifference(v1Str, v2Str) {
  const v1 = parseFloat(v1Str);
  const v2 = parseFloat(v2Str);
  if (isNaN(v1) || isNaN(v2)) return null;

  const avg = (v1 + v2) / 2;
  if (avg === 0) {
    return {
      v1,
      v2,
      result: 0,
      resultFormatted: "0%",
      diffAbs: 0,
      average: 0,
      formulaText: "|V1 - V2| / average = 0%",
    };
  }

  const diffAbs = Math.abs(v1 - v2);
  const result = (diffAbs / Math.abs(avg)) * 100;

  return {
    v1,
    v2,
    diffAbs,
    average: avg,
    result,
    resultFormatted: `${formatNum(result)}%`,
    formulaText: `|${v1} - ${v2}| ÷ ((${v1} + ${v2}) ÷ 2) × 100 = ${formatNum(result)}%`,
  };
}

/**
 * Group C: Percentage Change (Increase / Decrease)
 * Formula Increase: V * (1 + P / 100)
 * Formula Decrease: V * (1 - P / 100)
 */
export function calcPercentChange(valStr, percentStr, mode = "increase") {
  const v = parseFloat(valStr);
  const p = parseFloat(percentStr);
  if (isNaN(v) || isNaN(p)) return null;

  const isIncrease = mode === "increase";
  const delta = isIncrease ? v * (p / 100) : -v * (p / 100);
  const result = v + delta;

  return {
    v,
    p,
    mode,
    delta,
    deltaFormatted: isIncrease ? `+${formatNum(delta)}` : formatNum(delta),
    result,
    resultFormatted: formatNum(result),
    formulaText: isIncrease
      ? `${v} × (1 + ${p}%) = ${formatNum(result)}`
      : `${v} × (1 - ${p}%) = ${formatNum(result)}`,
  };
}

// ---------------------------------------------------------------------------
// URL State Encoder / Decoder
// ---------------------------------------------------------------------------

export function encodePercentageState(state) {
  try {
    const params = new URLSearchParams();
    if (state.p1) params.set("p1", state.p1);
    if (state.v1) params.set("v1", state.v1);
    if (state.diff1) params.set("d1", state.diff1);
    if (state.diff2) params.set("d2", state.diff2);
    return params.toString();
  } catch {
    return "";
  }
}

export function decodePercentageState(search) {
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.size === 0) return null;

    return {
      p1: params.get("p1") || "",
      v1: params.get("v1") || "",
      diff1: params.get("d1") || "",
      diff2: params.get("d2") || "",
    };
  } catch {
    return null;
  }
}
