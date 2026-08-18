/**
 * fraction.js — Holy Calculator Fraction Engine
 *
 * Core pure functions for:
 *  - GCD & LCM core utilities
 *  - Sub 1: Basic Fraction Calculator (+, −, ×, ÷)
 *  - Sub 2: Mixed Numbers Calculator (+, −, ×, ÷)
 *  - Sub 3: Simplify Fraction Calculator
 *  - Sub 4: Decimal to Fraction Converter (string-parsed precision)
 *  - Sub 5: Fraction to Decimal Converter
 *  - Sub 6: Big Number Fraction Calculator (BigInt-based)
 *  - URL State Encoding/Decoding
 */

/**
 * Greatest Common Divisor (Euclidean Algorithm) for regular Numbers
 */
export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/**
 * Least Common Multiple for regular Numbers
 */
export function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Greatest Common Divisor for BigInt
 */
export function gcdBigInt(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x === 0n ? 1n : x;
}

/**
 * Reduces a fraction to lowest terms.
 */
export function simplifyFraction(num, den) {
  if (den === 0) return null;
  const common = gcd(num, den);
  let n = num / common;
  let d = den / common;
  if (d < 0) {
    n = -n;
    d = -d;
  }
  return { num: n, den: d };
}

/**
 * Formats a fraction into improper and mixed number string formats.
 */
export function toMixedNumber(num, den) {
  if (den === 0) return null;
  const isNegative = (num < 0 && den > 0) || (num > 0 && den < 0);
  const absN = Math.abs(num);
  const absD = Math.abs(den);

  const whole = Math.floor(absN / absD);
  const remNum = absN % absD;

  const improperText = `${num}/${den}`;
  let mixedText = "";

  if (remNum === 0) {
    mixedText = `${isNegative ? "-" : ""}${whole}`;
  } else if (whole === 0) {
    mixedText = `${isNegative ? "-" : ""}${remNum}/${absD}`;
  } else {
    mixedText = `${isNegative ? "-" : ""}${whole} ${remNum}/${absD}`;
  }

  return {
    whole: isNegative ? -whole : whole,
    remNum,
    remDen: absD,
    improperText,
    mixedText,
    isImproper: absN >= absD,
  };
}

// ---------------------------------------------------------------------------
// Sub-Calculator 1: Basic Fraction Calculator
// ---------------------------------------------------------------------------

export function calcBasicFraction(n1Str, d1Str, op, n2Str, d2Str) {
  const n1 = parseInt(n1Str, 10);
  const d1 = parseInt(d1Str, 10);
  const n2 = parseInt(n2Str, 10);
  const d2 = parseInt(d2Str, 10);

  if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
    return { isValid: false, message: "Please enter valid integer numbers for all fields." };
  }

  if (d1 === 0 || d2 === 0) {
    return { isValid: false, message: "Denominator cannot be zero (0)." };
  }

  if (op === "÷" && n2 === 0) {
    return { isValid: false, message: "Cannot divide by zero (numerator of second fraction is 0)." };
  }

  let resNum = 0;
  let resDen = 1;

  if (op === "+") {
    resNum = n1 * d2 + n2 * d1;
    resDen = d1 * d2;
  } else if (op === "-") {
    resNum = n1 * d2 - n2 * d1;
    resDen = d1 * d2;
  } else if (op === "×") {
    resNum = n1 * n2;
    resDen = d1 * d2;
  } else if (op === "÷") {
    resNum = n1 * d2;
    resDen = d1 * n2;
  }

  const simplified = simplifyFraction(resNum, resDen);
  const mixed = toMixedNumber(simplified.num, simplified.den);

  return {
    isValid: true,
    num: simplified.num,
    den: simplified.den,
    improperText: mixed.improperText,
    mixedText: mixed.mixedText,
    formulaText: `${n1}/${d1} ${op} ${n2}/${d2} = ${mixed.mixedText} (${mixed.improperText})`,
  };
}

// ---------------------------------------------------------------------------
// Sub-Calculator 2: Mixed Numbers Calculator
// ---------------------------------------------------------------------------

export function calcMixedNumbers(w1Str, n1Str, d1Str, op, w2Str, n2Str, d2Str) {
  const w1 = parseInt(w1Str, 10) || 0;
  const n1 = parseInt(n1Str, 10) || 0;
  const d1 = parseInt(d1Str, 10) || 1;

  const w2 = parseInt(w2Str, 10) || 0;
  const n2 = parseInt(n2Str, 10) || 0;
  const d2 = parseInt(d2Str, 10) || 1;

  if (d1 === 0 || d2 === 0) {
    return { isValid: false, message: "Denominator cannot be zero (0)." };
  }

  // Convert mixed numbers to improper fractions
  const sign1 = w1 < 0 ? -1 : 1;
  const impN1 = sign1 * (Math.abs(w1) * d1 + n1);

  const sign2 = w2 < 0 ? -1 : 1;
  const impN2 = sign2 * (Math.abs(w2) * d2 + n2);

  return calcBasicFraction(impN1.toString(), d1.toString(), op, impN2.toString(), d2.toString());
}

// ---------------------------------------------------------------------------
// Sub-Calculator 3: Simplify Fraction Calculator
// ---------------------------------------------------------------------------

export function calcSimplifyFraction(nStr, dStr) {
  const n = parseInt(nStr, 10);
  const d = parseInt(dStr, 10);

  if (isNaN(n) || isNaN(d)) {
    return { isValid: false, message: "Please enter valid integers." };
  }

  if (d === 0) {
    return { isValid: false, message: "Denominator cannot be zero (0)." };
  }

  const simplified = simplifyFraction(n, d);
  const mixed = toMixedNumber(simplified.num, simplified.den);

  return {
    isValid: true,
    num: simplified.num,
    den: simplified.den,
    improperText: mixed.improperText,
    mixedText: mixed.mixedText,
    gcdValue: gcd(n, d),
    formulaText: `${n}/${d} reduced by GCD (${gcd(n, d)}) = ${mixed.improperText} = ${mixed.mixedText}`,
  };
}

// ---------------------------------------------------------------------------
// Sub-Calculator 4: Decimal to Fraction Converter
// ---------------------------------------------------------------------------

export function calcDecimalToFraction(decimalStr) {
  if (!decimalStr || typeof decimalStr !== "string") {
    return { isValid: false, message: "Please enter a valid decimal number." };
  }

  const clean = decimalStr.trim();
  const numVal = parseFloat(clean);
  if (isNaN(numVal)) {
    return { isValid: false, message: "Invalid decimal number format." };
  }

  const parts = clean.split(".");
  let den = 1;
  let num = 0;

  if (parts.length === 1) {
    num = parseInt(parts[0], 10);
  } else {
    const decimalsCount = parts[1].length;
    den = Math.pow(10, decimalsCount);
    num = Math.round(numVal * den);
  }

  const simplified = simplifyFraction(num, den);
  const mixed = toMixedNumber(simplified.num, simplified.den);

  return {
    isValid: true,
    decimalStr: clean,
    num: simplified.num,
    den: simplified.den,
    improperText: mixed.improperText,
    mixedText: mixed.mixedText,
    formulaText: `${clean} = ${mixed.improperText} = ${mixed.mixedText}`,
  };
}

// ---------------------------------------------------------------------------
// Sub-Calculator 5: Fraction to Decimal Converter
// ---------------------------------------------------------------------------

export function calcFractionToDecimal(nStr, dStr) {
  const n = parseInt(nStr, 10);
  const d = parseInt(dStr, 10);

  if (isNaN(n) || isNaN(d)) {
    return { isValid: false, message: "Please enter valid integers." };
  }

  if (d === 0) {
    return { isValid: false, message: "Denominator cannot be zero (0)." };
  }

  const decimalVal = n / d;
  const roundedText = (Math.round(decimalVal * 1000000) / 1000000).toString();

  return {
    isValid: true,
    n,
    d,
    decimalVal,
    decimalFormatted: roundedText,
    formulaText: `${n} ÷ ${d} = ${roundedText}`,
  };
}

// ---------------------------------------------------------------------------
// Sub-Calculator 6: Big Number Fraction Calculator (BigInt)
// ---------------------------------------------------------------------------

export function calcBigNumberFraction(n1Str, d1Str, op, n2Str, d2Str) {
  try {
    const n1 = BigInt(n1Str.trim());
    const d1 = BigInt(d1Str.trim());
    const n2 = BigInt(n2Str.trim());
    const d2 = BigInt(d2Str.trim());

    if (d1 === 0n || d2 === 0n) {
      return { isValid: false, message: "BigInt Denominator cannot be zero (0)." };
    }

    if (op === "÷" && n2 === 0n) {
      return { isValid: false, message: "Cannot divide by zero BigInt numerator." };
    }

    let resNum = 0n;
    let resDen = 1n;

    if (op === "+") {
      resNum = n1 * d2 + n2 * d1;
      resDen = d1 * d2;
    } else if (op === "-") {
      resNum = n1 * d2 - n2 * d1;
      resDen = d1 * d2;
    } else if (op === "×") {
      resNum = n1 * n2;
      resDen = d1 * d2;
    } else if (op === "÷") {
      resNum = n1 * d2;
      resDen = d1 * n2;
    }

    const common = gcdBigInt(resNum, resDen);
    let finalN = resNum / common;
    let finalD = resDen / common;
    if (finalD < 0n) {
      finalN = -finalN;
      finalD = -finalD;
    }

    return {
      isValid: true,
      isBigInt: true,
      improperText: `${finalN.toString()}/${finalD.toString()}`,
      formulaText: `${n1.toString()}/${d1.toString()} ${op} ${n2.toString()}/${d2.toString()} = ${finalN.toString()}/${finalD.toString()}`,
    };
  } catch (e) {
    return { isValid: false, message: "Please enter valid BigInt integers (e.g. 9007199254740992)." };
  }
}

// ---------------------------------------------------------------------------
// URL State Encoder / Decoder
// ---------------------------------------------------------------------------

export function encodeFractionState(state) {
  try {
    const params = new URLSearchParams();
    if (state.n1) params.set("n1", state.n1);
    if (state.d1) params.set("d1", state.d1);
    if (state.op) params.set("op", state.op);
    if (state.n2) params.set("n2", state.n2);
    if (state.d2) params.set("d2", state.d2);
    return params.toString();
  } catch {
    return "";
  }
}

export function decodeFractionState(search) {
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.size === 0) return null;

    return {
      n1: params.get("n1") || "1",
      d1: params.get("d1") || "2",
      op: params.get("op") || "+",
      n2: params.get("n2") || "1",
      d2: params.get("d2") || "3",
    };
  } catch {
    return null;
  }
}
