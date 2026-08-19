/**
 * scientific.js — Holy Calculator Scientific Engine
 */

export function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

export function evaluateExpression(expr, isDegreeMode = true) {
  if (!expr || typeof expr !== "string" || expr.trim() === "") {
    return { isValid: false, result: 0, formattedResult: "0", error: null };
  }

  try {
    let clean = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/π/g, "Math.PI")
      .replace(/e\^\(/g, "Math.E**(")
      .replace(/(^|[^a-zA-Z0-9_])e($|[^a-zA-Z0-9_])/g, "$1Math.E$2")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/∛\(/g, "Math.cbrt(")
      .replace(/\^/g, "**")
      .replace(/%/g, "*0.01");

    // Degrees to Radians conversion factor for trig
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const sin = (x) => (isDegreeMode ? Math.sin(toRad(x)) : Math.sin(x));
    const cos = (x) => (isDegreeMode ? Math.cos(toRad(x)) : Math.cos(x));
    const tan = (x) => (isDegreeMode ? Math.tan(toRad(x)) : Math.tan(x));

    const asin = (x) => (isDegreeMode ? toDeg(Math.asin(x)) : Math.asin(x));
    const acos = (x) => (isDegreeMode ? toDeg(Math.acos(x)) : Math.acos(x));
    const atan = (x) => (isDegreeMode ? toDeg(Math.atan(x)) : Math.atan(x));

    const log = (x) => Math.log10(x);
    const ln = (x) => Math.log(x);
    const sqrt = (x) => Math.sqrt(x);
    const cbrt = (x) => Math.cbrt(x);
    const fact = (x) => factorial(x);

    // Evaluate in safe function sandbox
    const func = new Function(
      "sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "cbrt", "fact",
      `return (${clean});`
    );

    const val = func(sin, cos, tan, asin, acos, atan, log, ln, sqrt, cbrt, fact);

    if (typeof val !== "number" || isNaN(val) || !isFinite(val)) {
      return { isValid: false, result: NaN, formattedResult: "Error", error: "Invalid Math Result" };
    }

    // Rounding floating point inaccuracies e.g. 0.00000000000000006 -> 0
    let formatted = val;
    if (Math.abs(val) < 1e-12) formatted = 0;
    else if (Number.isInteger(val)) formatted = String(val);
    else formatted = String(parseFloat(val.toFixed(10)));

    return {
      isValid: true,
      result: val,
      formattedResult: formatted,
      error: null,
    };
  } catch (err) {
    return { isValid: false, result: NaN, formattedResult: "Error", error: "Syntax Error" };
  }
}
