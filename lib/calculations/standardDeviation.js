/**
 * standardDeviation.js — Holy Calculator Standard Deviation Engine
 *
 * Core pure functions for:
 *  - Permissive Multi-Delimiter Data Set Parsing (commas, spaces, newlines)
 *  - Safety Cap Enforcement (1,000 values max)
 *  - Population SD (N divisor) & Sample SD (N-1 divisor, Bessel's correction)
 *  - Variance, Mean, Sum, Count
 *  - 95% Confidence Interval Margin of Error
 *  - URL State Encoding/Decoding
 */

/**
 * Parses raw text input into a clean numeric array.
 * Accepts commas, spaces, tabs, and newlines as delimiters.
 *
 * @param {string} rawText
 * @param {number} maxCap - Defaults to 1000
 */
export function parseDataSet(rawText, maxCap = 1000) {
  if (!rawText || typeof rawText !== "string") {
    return { numbers: [], invalidTokens: [], exceedsCap: false, rawCount: 0 };
  }

  // Split by commas, newlines, tabs, or whitespace
  const tokens = rawText
    .split(/[\s,\n\r\t]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const numbers = [];
  const invalidTokens = [];

  for (const token of tokens) {
    const num = Number(token);
    if (!isNaN(num) && isFinite(num)) {
      numbers.push(num);
    } else {
      invalidTokens.push(token);
    }
  }

  const exceedsCap = numbers.length > maxCap;
  const slicedNumbers = exceedsCap ? numbers.slice(0, maxCap) : numbers;

  return {
    numbers: slicedNumbers,
    invalidTokens,
    exceedsCap,
    totalCount: numbers.length,
  };
}

/**
 * Format numbers cleanly for display
 */
export function fmt(n, decimals = 6) {
  if (n === null || n === undefined || isNaN(n)) return "";
  const rounded = Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return rounded.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

/**
 * Calculates complete statistics for a given data set.
 *
 * @param {Object} params
 * @param {string} params.inputStr - Raw input string
 * @param {"sample"|"population"} [params.mode="sample"]
 */
export function calculateStandardDeviation(params) {
  const { inputStr = "", mode = "sample" } = params;

  const parsed = parseDataSet(inputStr, 1000);

  if (parsed.invalidTokens.length > 0) {
    return {
      isValid: false,
      errorType: "invalid_tokens",
      invalidTokens: parsed.invalidTokens,
      message: `Invalid non-numeric input detected: ${parsed.invalidTokens.slice(0, 3).join(", ")}${
        parsed.invalidTokens.length > 3 ? "..." : ""
      }`,
    };
  }

  if (parsed.exceedsCap) {
    return {
      isValid: false,
      errorType: "exceeds_cap",
      totalCount: parsed.totalCount,
      maxCap: 1000,
      message: `Data set contains ${parsed.totalCount.toLocaleString()} values, exceeding the maximum limit of 1,000 values.`,
    };
  }

  const nums = parsed.numbers;
  const N = nums.length;

  if (N === 0) {
    return {
      isValid: false,
      errorType: "empty",
      message: "Please enter a list of numbers.",
    };
  }

  if (mode === "sample" && N < 2) {
    return {
      isValid: false,
      errorType: "sample_n_less_than_2",
      N,
      message: "Sample Standard Deviation requires at least 2 numbers (N ≥ 2). Switch to Population mode for N = 1.",
    };
  }

  // 1. Sum & Mean
  const sum = nums.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / N;

  // 2. Sum of Squared Differences
  const sumSquaredDiffs = nums.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);

  // 3. Variance & Standard Deviation
  const divisor = mode === "sample" ? N - 1 : N;
  const variance = sumSquaredDiffs / divisor;
  const sd = Math.sqrt(variance);

  // 4. Margin of Error at 95% Confidence (Z = 1.95996)
  const zScore95 = 1.95996;
  const standardError = sd / Math.sqrt(N);
  const marginOfError95 = zScore95 * standardError;

  return {
    isValid: true,
    mode, // "sample" | "population"
    count: N,
    sum,
    sumFormatted: fmt(sum, 4),
    mean,
    meanFormatted: fmt(mean, 6),
    variance,
    varianceFormatted: fmt(variance, 6),
    sd,
    sdFormatted: fmt(sd, 6),
    standardError,
    standardErrorFormatted: fmt(standardError, 6),
    marginOfError95,
    marginOfError95Formatted: fmt(marginOfError95, 6),
    confidenceInterval95: {
      lower: mean - marginOfError95,
      upper: mean + marginOfError95,
      text: `${fmt(mean - marginOfError95, 4)} to ${fmt(mean + marginOfError95, 4)}`,
    },
    divisorUsed: divisor,
    formulaSymbol: mode === "sample" ? "s" : "σ",
    varianceSymbol: mode === "sample" ? "s²" : "σ²",
    meanSymbol: mode === "sample" ? "x̄" : "μ",
  };
}

// ---------------------------------------------------------------------------
// URL State Encoder / Decoder
// ---------------------------------------------------------------------------

export function encodeStandardDeviationState(state) {
  try {
    const params = new URLSearchParams();
    if (state.mode) params.set("m", state.mode);
    // Cap encoded input length in URL to 200 chars to avoid bloated URLs
    if (state.inputStr && state.inputStr.length <= 200) {
      params.set("d", state.inputStr);
    }
    return params.toString();
  } catch {
    return "";
  }
}

export function decodeStandardDeviationState(search) {
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.size === 0) return null;

    return {
      mode: params.get("m") || "sample",
      inputStr: params.get("d") || "",
    };
  } catch {
    return null;
  }
}
