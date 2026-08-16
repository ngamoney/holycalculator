/**
 * calorie.js — Holy Calculator Calorie Calculator engine
 *
 * Contains:
 *  - BMR formulas: Mifflin-St Jeor, Revised Harris-Benedict, Katch-McArdle
 *  - TDEE calculation with 6-level activity multiplier
 *  - Deficit/surplus tiers with content-safety floors
 *  - Unit conversions (US ↔ metric, cal ↔ kJ ↔ J)
 *  - URL encode/decode for shareability
 *
 * Sources:
 *  - Mifflin MD, St Jeor ST, et al. Am J Clin Nutr. 1990;51(2):241-247.
 *  - Roza AM, Shizgal HM. Am J Clin Nutr. 1984;40(1):168-182. (Revised Harris-Benedict)
 *  - Katch VL. Am J Clin Nutr. 1986;44(4):520-525. (Katch-McArdle)
 */

// ---------------------------------------------------------------------------
// Unit Conversion Utilities
// ---------------------------------------------------------------------------

/** Convert feet + inches to centimeters */
export function ftInToCm(feet, inches) {
  const totalIn = (parseFloat(feet) || 0) * 12 + (parseFloat(inches) || 0);
  return totalIn * 2.54;
}

/** Convert centimeters to { feet, inches } */
export function cmToFtIn(cm) {
  const totalIn = (parseFloat(cm) || 0) / 2.54;
  const feet = Math.floor(totalIn / 12);
  const inches = Math.round((totalIn % 12) * 10) / 10;
  return { feet, inches };
}

/** Convert pounds to kilograms */
export function lbToKg(lb) {
  return (parseFloat(lb) || 0) * 0.453592;
}

/** Convert kilograms to pounds */
export function kgToLb(kg) {
  return (parseFloat(kg) || 0) / 0.453592;
}

// ---------------------------------------------------------------------------
// Energy Unit Conversions (for the Food Energy Converter utility)
// ---------------------------------------------------------------------------
// 1 kcal = 1 Calorie (food calorie) = 4.184 kJ = 4184 J
export const ENERGY_CONVERSIONS = {
  cal_to_kcal: 1,           // 1 Cal = 1 kcal by definition
  cal_to_kj: 4.184,
  cal_to_j: 4184,
  kcal_to_cal: 1,
  kcal_to_kj: 4.184,
  kcal_to_j: 4184,
  kj_to_cal: 1 / 4.184,
  kj_to_kcal: 1 / 4.184,
  kj_to_j: 1000,
  j_to_cal: 1 / 4184,
  j_to_kcal: 1 / 4184,
  j_to_kj: 0.001,
};

/**
 * Convert an energy value from one unit to all others.
 * @param {number} value - The numeric value to convert
 * @param {"cal"|"kcal"|"kj"|"j"} fromUnit - Source unit
 * @returns {{ cal: number, kcal: number, kj: number, j: number }}
 */
export function convertEnergy(value, fromUnit) {
  const v = parseFloat(value);
  if (isNaN(v)) return { cal: "", kcal: "", kj: "", j: "" };

  let cal;
  switch (fromUnit) {
    case "cal":
    case "kcal":
      cal = v;
      break;
    case "kj":
      cal = v / 4.184;
      break;
    case "j":
      cal = v / 4184;
      break;
    default:
      cal = v;
  }

  return {
    cal: Math.round(cal * 10000) / 10000,
    kcal: Math.round(cal * 10000) / 10000,
    kj: Math.round(cal * 4.184 * 10000) / 10000,
    j: Math.round(cal * 4184 * 10000) / 10000,
  };
}

// ---------------------------------------------------------------------------
// Activity Level Definitions
// ---------------------------------------------------------------------------
export const ACTIVITY_LEVELS = [
  {
    id: "sedentary",
    label: "Sedentary",
    description: "Little or no exercise",
    multiplier: 1.2,
  },
  {
    id: "light",
    label: "Light",
    description: "Light exercise 1–3 days/week",
    multiplier: 1.375,
  },
  {
    id: "moderate",
    label: "Moderate",
    description: "Moderate exercise 3–5 days/week",
    multiplier: 1.55,
  },
  {
    id: "active",
    label: "Active",
    description: "Hard exercise 6–7 days/week",
    multiplier: 1.725,
  },
  {
    id: "very_active",
    label: "Very Active",
    description: "Very hard exercise and a physical job",
    multiplier: 1.9,
  },
  {
    id: "extra_active",
    label: "Extra Active",
    description: "Professional athlete or twice-daily training",
    multiplier: 2.0,
  },
];

// ---------------------------------------------------------------------------
// BMR Formulas
// ---------------------------------------------------------------------------

/**
 * Mifflin-St Jeor BMR (most widely recommended for general populations)
 * Source: Mifflin MD et al. Am J Clin Nutr. 1990.
 * @param {"male"|"female"} gender
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} ageYears
 * @returns {number} BMR in kcal/day
 */
export function bmrMifflin(gender, weightKg, heightCm, ageYears) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return gender === "male" ? base + 5 : base - 161;
}

/**
 * Revised Harris-Benedict BMR
 * Source: Roza AM, Shizgal HM. Am J Clin Nutr. 1984.
 * @param {"male"|"female"} gender
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} ageYears
 * @returns {number} BMR in kcal/day
 */
export function bmrHarrisBenedict(gender, weightKg, heightCm, ageYears) {
  if (gender === "male") {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears;
  } else {
    return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * ageYears;
  }
}

/**
 * Katch-McArdle BMR (requires body fat percentage — most accurate when BF% is known)
 * Source: Katch VL. Am J Clin Nutr. 1986.
 * @param {number} weightKg
 * @param {number} bodyFatPercent - 0–100
 * @returns {number} BMR in kcal/day
 */
export function bmrKatchMcArdle(weightKg, bodyFatPercent) {
  const leanMassKg = weightKg * (1 - bodyFatPercent / 100);
  return 370 + 21.6 * leanMassKg;
}

// ---------------------------------------------------------------------------
// Safety Floors
// ---------------------------------------------------------------------------
// Based on general clinical guidelines; these are population-level minimums.
// Lower thresholds require medical supervision.
const SAFETY_FLOOR_FEMALE = 1200; // kcal/day
const SAFETY_FLOOR_MALE = 1500;   // kcal/day

function getSafetyFloor(gender) {
  return gender === "male" ? SAFETY_FLOOR_MALE : SAFETY_FLOOR_FEMALE;
}

// ---------------------------------------------------------------------------
// Result Tier Definitions
// ---------------------------------------------------------------------------
export const RESULT_TIERS = [
  { id: "mild_loss",   delta: -250,  label: "Mild Weight Loss",   rate: "~0.5 lb / week",   type: "loss" },
  { id: "loss",        delta: -500,  label: "Weight Loss",         rate: "~1 lb / week",     type: "loss" },
  { id: "extreme",     delta: -1000, label: "Extreme Weight Loss", rate: "~2 lb / week",     type: "loss" },
  { id: "maintenance", delta: 0,     label: "Maintain Weight",     rate: "",                 type: "maintain" },
  { id: "mild_gain",   delta: +250,  label: "Mild Weight Gain",   rate: "~0.5 lb / week",   type: "gain" },
  { id: "gain",        delta: +500,  label: "Weight Gain",         rate: "~1 lb / week",     type: "gain" },
  { id: "fast_gain",   delta: +1000, label: "Fast Weight Gain",   rate: "~2 lb / week",     type: "gain" },
];

// ---------------------------------------------------------------------------
// Main Calculation
// ---------------------------------------------------------------------------

/**
 * Calculate all calorie results from user inputs.
 * Returns null if any required input is invalid/missing.
 *
 * @param {Object} params
 * @param {"male"|"female"} params.gender
 * @param {number|string} params.age
 * @param {number|string} params.weightKg
 * @param {number|string} params.heightCm
 * @param {string} params.activityId - one of ACTIVITY_LEVELS[].id
 * @param {"mifflin"|"harris"|"katch"} params.formula
 * @param {number|string} [params.bodyFatPct] - required for katch formula
 * @param {"cal"|"kj"} [params.resultUnit] - output unit
 *
 * @returns {null | {
 *   bmr: number,
 *   tdee: number,
 *   tiers: Array<{ id, label, rate, type, calories, kj, belowFloor, warningText }>,
 *   formula: string,
 *   resultUnit: string,
 * }}
 */
export function calculateCalories(params) {
  const {
    gender,
    age,
    weightKg,
    heightCm,
    activityId,
    formula,
    bodyFatPct,
    resultUnit = "cal",
  } = params;

  // Validate required inputs
  const ageN = parseFloat(age);
  const weightN = parseFloat(weightKg);
  const heightN = parseFloat(heightCm);

  if (
    !gender ||
    isNaN(ageN) || ageN < 1 || ageN > 120 ||
    isNaN(weightN) || weightN <= 0 ||
    isNaN(heightN) || heightN <= 0
  ) {
    return null;
  }

  const activityLevel = ACTIVITY_LEVELS.find((a) => a.id === activityId);
  if (!activityLevel) return null;

  // Calculate BMR
  let bmr;
  if (formula === "katch") {
    const bfN = parseFloat(bodyFatPct);
    if (isNaN(bfN) || bfN < 1 || bfN > 70) return null;
    bmr = bmrKatchMcArdle(weightN, bfN);
  } else if (formula === "harris") {
    bmr = bmrHarrisBenedict(gender, weightN, heightN, ageN);
  } else {
    // Default: mifflin
    bmr = bmrMifflin(gender, weightN, heightN, ageN);
  }

  // TDEE
  const tdee = bmr * activityLevel.multiplier;
  const floor = getSafetyFloor(gender);

  // Build tier results
  const tiers = RESULT_TIERS.map((tier) => {
    const calories = Math.round(tdee + tier.delta);
    const belowFloor = calories < floor;
    const kj = Math.round(calories * 4.184);

    return {
      ...tier,
      calories,
      kj,
      belowFloor,
      warningText: belowFloor
        ? `This deficit would put your daily intake below a generally safe minimum (${floor} kcal for ${gender === "male" ? "men" : "women"}). Consider a smaller deficit or consult a registered dietitian.`
        : null,
      displayValue: resultUnit === "kj" ? kj : calories,
      displayUnit: resultUnit === "kj" ? "kJ" : "kcal",
    };
  });

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    tiers,
    formula,
    activityMultiplier: activityLevel.multiplier,
    resultUnit,
  };
}

// ---------------------------------------------------------------------------
// URL Encode / Decode (compact query string for shareability)
// ---------------------------------------------------------------------------

/**
 * Encode calculator state to URL search string.
 * Returns empty string if no meaningful state.
 */
export function encodeCalorieState(state) {
  try {
    const {
      unit, gender, age, heightFt, heightIn, heightCm, weight,
      activityId, formula, bodyFatPct, resultUnit,
    } = state;

    const params = new URLSearchParams();
    if (unit) params.set("u", unit === "metric" ? "m" : "us");
    if (gender) params.set("g", gender === "male" ? "m" : "f");
    if (age) params.set("a", age);
    if (unit === "metric") {
      if (heightCm) params.set("hcm", heightCm);
    } else {
      if (heightFt) params.set("hft", heightFt);
      if (heightIn) params.set("hin", heightIn);
    }
    if (weight) params.set("w", weight);
    if (activityId) params.set("act", activityId);
    if (formula && formula !== "mifflin") params.set("f", formula);
    if (formula === "katch" && bodyFatPct) params.set("bf", bodyFatPct);
    if (resultUnit && resultUnit !== "cal") params.set("ru", resultUnit);

    return params.toString();
  } catch {
    return "";
  }
}

/**
 * Decode URL search string back to state object.
 * Returns null if nothing meaningful found.
 */
export function decodeCalorieState(search) {
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.size === 0) return null;

    const unit = params.get("u") === "m" ? "metric" : "us";
    const gender = params.get("g") === "f" ? "female" : params.get("g") === "m" ? "male" : null;
    const age = params.get("a") || "";
    const heightFt = params.get("hft") || "";
    const heightIn = params.get("hin") || "";
    const heightCm = params.get("hcm") || "";
    const weight = params.get("w") || "";
    const activityId = params.get("act") || "sedentary";
    const formula = params.get("f") || "mifflin";
    const bodyFatPct = params.get("bf") || "";
    const resultUnit = params.get("ru") || "cal";

    if (!gender && !age && !weight) return null;

    return { unit, gender, age, heightFt, heightIn, heightCm, weight, activityId, formula, bodyFatPct, resultUnit };
  } catch {
    return null;
  }
}
