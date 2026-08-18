/**
 * bmrMath.js — Holy Calculator BMR Engine
 *
 * Core calculations for:
 *  - BMR Formulas: Mifflin-St Jeor, Revised Harris-Benedict, Katch-McArdle
 *  - Unit Conversions (US ↔ Metric)
 *  - 6 Activity Level Multipliers for Daily Calorie Needs
 *  - Output Unit Switching (Calories / Kilojoules)
 *  - URL State Encoding/Decoding for shareability
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
// Activity Level Bands
// ---------------------------------------------------------------------------
export const BMR_ACTIVITY_LEVELS = [
  {
    id: "sedentary",
    label: "Sedentary",
    description: "Little to no exercise, desk job",
    multiplier: 1.2,
  },
  {
    id: "light",
    label: "Lightly Active",
    description: "Light exercise 1–3 days/week",
    multiplier: 1.375,
  },
  {
    id: "moderate",
    label: "Moderately Active",
    description: "Moderate exercise 3–5 days/week",
    multiplier: 1.55,
  },
  {
    id: "active",
    label: "Very Active",
    description: "Hard exercise 6–7 days/week",
    multiplier: 1.725,
  },
  {
    id: "extra_active",
    label: "Extra Active",
    description: "Very hard exercise & physical job",
    multiplier: 1.9,
  },
  {
    id: "super_active",
    label: "Super Active",
    description: "Professional athlete or 2x daily training",
    multiplier: 2.0,
  },
];

// ---------------------------------------------------------------------------
// Clinical BMR Formulas
// ---------------------------------------------------------------------------

/**
 * Mifflin-St Jeor BMR (Consensus default for general population)
 * Source: Mifflin MD et al. Am J Clin Nutr. 1990.
 */
export function bmrMifflin(gender, weightKg, heightCm, ageYears) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return gender === "female" ? base - 161 : base + 5;
}

/**
 * Revised Harris-Benedict BMR
 * Source: Roza AM, Shizgal HM. Am J Clin Nutr. 1984.
 */
export function bmrHarrisBenedict(gender, weightKg, heightCm, ageYears) {
  if (gender === "female") {
    return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * ageYears;
  } else {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears;
  }
}

/**
 * Katch-McArdle BMR (Requires Body Fat % — ideal for lean/tracked individuals)
 * Source: Katch VL. Am J Clin Nutr. 1986.
 */
export function bmrKatchMcArdle(weightKg, bodyFatPercent) {
  const leanMassKg = weightKg * (1 - (parseFloat(bodyFatPercent) || 0) / 100);
  return 370 + 21.6 * leanMassKg;
}

// ---------------------------------------------------------------------------
// Main BMR Calculation Engine
// ---------------------------------------------------------------------------

/**
 * Calculate BMR and Activity maintenance levels
 *
 * @param {Object} params
 * @param {string} params.unit - "us" | "metric" | "other"
 * @param {number|string} params.age - 15 to 80
 * @param {"male"|"female"} params.gender
 * @param {number|string} [params.heightFt]
 * @param {number|string} [params.heightIn]
 * @param {number|string} [params.heightCm]
 * @param {number|string} [params.weightLbs]
 * @param {number|string} [params.weightKg]
 * @param {"mifflin"|"harris"|"katch"} [params.formula] - default "mifflin"
 * @param {number|string} [params.bodyFatPct] - required if formula === "katch"
 * @param {"cal"|"kj"} [params.resultUnit] - default "cal"
 *
 * @returns {null | Object}
 */
export function calculateBmr(params) {
  const {
    unit = "us",
    age,
    gender = "male",
    heightFt,
    heightIn,
    heightCm,
    weightLbs,
    weightKg,
    formula = "mifflin",
    bodyFatPct,
    resultUnit = "cal",
  } = params;

  const ageNum = parseFloat(age);
  if (isNaN(ageNum) || ageNum < 15 || ageNum > 80) return null;

  let heightCmVal = 0;
  let weightKgVal = 0;

  if (unit === "us") {
    const ft = parseFloat(heightFt) || 0;
    const inc = parseFloat(heightIn) || 0;
    const totalIn = ft * 12 + inc;
    if (totalIn <= 0) return null;
    heightCmVal = totalIn * 2.54;

    const lbs = parseFloat(weightLbs) || 0;
    if (lbs <= 0) return null;
    weightKgVal = lbToKg(lbs);
  } else if (unit === "metric") {
    heightCmVal = parseFloat(heightCm) || 0;
    weightKgVal = parseFloat(weightKg) || 0;
    if (heightCmVal <= 0 || weightKgVal <= 0) return null;
  } else {
    // Custom / Other units
    heightCmVal = parseFloat(heightCm) || 0;
    weightKgVal = parseFloat(weightKg) || 0;
    if (heightCmVal <= 0 || weightKgVal <= 0) return null;
  }

  // Calculate raw BMR in kcal/day
  let bmrKcal = 0;
  if (formula === "katch") {
    const bf = parseFloat(bodyFatPct);
    if (isNaN(bf) || bf < 1 || bf > 70) return null;
    bmrKcal = bmrKatchMcArdle(weightKgVal, bf);
  } else if (formula === "harris") {
    bmrKcal = bmrHarrisBenedict(gender, weightKgVal, heightCmVal, ageNum);
  } else {
    bmrKcal = bmrMifflin(gender, weightKgVal, heightCmVal, ageNum);
  }

  if (bmrKcal <= 0 || isNaN(bmrKcal)) return null;

  const roundedBmrKcal = Math.round(bmrKcal);
  const roundedBmrKj = Math.round(bmrKcal * 4.184);

  // Activity level breakdown
  const activityBreakdown = BMR_ACTIVITY_LEVELS.map((act) => {
    const kcal = Math.round(bmrKcal * act.multiplier);
    const kj = Math.round(kcal * 4.184);
    return {
      ...act,
      kcal,
      kj,
      displayValue: resultUnit === "kj" ? kj : kcal,
      displayUnit: resultUnit === "kj" ? "kJ/day" : "Calories/day",
    };
  });

  return {
    bmrKcal: roundedBmrKcal,
    bmrKj: roundedBmrKj,
    displayBmr: resultUnit === "kj" ? roundedBmrKj : roundedBmrKcal,
    displayUnit: resultUnit === "kj" ? "kJ/day" : "Calories/day",
    formula,
    formulaName:
      formula === "harris"
        ? "Revised Harris-Benedict"
        : formula === "katch"
        ? "Katch-McArdle"
        : "Mifflin-St Jeor",
    resultUnit,
    activityBreakdown,
    inputs: {
      unit,
      age: ageNum,
      gender,
      heightCm: Math.round(heightCmVal),
      weightKg: Math.round(weightKgVal * 10) / 10,
    },
  };
}

// ---------------------------------------------------------------------------
// URL State Encoder / Decoder
// ---------------------------------------------------------------------------

export function encodeBmrState(state) {
  try {
    const params = new URLSearchParams();
    if (state.unit) params.set("u", state.unit);
    if (state.gender) params.set("g", state.gender);
    if (state.age) params.set("a", state.age);
    if (state.formula && state.formula !== "mifflin") params.set("f", state.formula);
    if (state.formula === "katch" && state.bodyFatPct) params.set("bf", state.bodyFatPct);
    if (state.resultUnit && state.resultUnit !== "cal") params.set("ru", state.resultUnit);

    if (state.unit === "us") {
      if (state.heightFt) params.set("hft", state.heightFt);
      if (state.heightIn) params.set("hin", state.heightIn);
      if (state.weightLbs) params.set("w", state.weightLbs);
    } else {
      if (state.heightCm) params.set("hcm", state.heightCm);
      if (state.weightKg) params.set("wkg", state.weightKg);
    }

    return params.toString();
  } catch {
    return "";
  }
}

export function decodeBmrState(search) {
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.size === 0) return null;

    return {
      unit: params.get("u") || "us",
      gender: params.get("g") || "male",
      age: params.get("a") || "30",
      heightFt: params.get("hft") || "5",
      heightIn: params.get("hin") || "10",
      heightCm: params.get("hcm") || "178",
      weightLbs: params.get("w") || "160",
      weightKg: params.get("wkg") || "72",
      formula: params.get("f") || "mifflin",
      bodyFatPct: params.get("bf") || "",
      resultUnit: params.get("ru") || "cal",
    };
  } catch {
    return null;
  }
}
