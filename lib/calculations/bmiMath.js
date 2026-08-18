/**
 * bmiMath.js — Holy Calculator BMI Engine
 *
 * Core calculations for:
 *  - Metric & Imperial BMI (kg/m² and 703 × lbs/in²)
 *  - BMI Prime (BMI / 25)
 *  - Ponderal Index (kg/m³)
 *  - WHO Adult Classification (Headline 4-tier + Full Subclasses)
 *  - CDC Child/Teen Percentiles (ages 2–19)
 *  - Healthy Weight Range
 *  - URL State Encoding/Decoding for shareability
 */

import { ftInToCm, cmToFtIn, lbToKg, kgToLb } from "./calorie.js";
import { getBmiPercentileForChild } from "../data/cdcBmiLms.js";

export { ftInToCm, cmToFtIn, lbToKg, kgToLb };

/**
 * Adult WHO BMI Subclass Categorization (Age >= 20)
 */
export function getAdultWhoCategory(bmi) {
  if (bmi < 16.0) {
    return {
      category: "underweight",
      headlineLabel: "Underweight",
      subclassLabel: "Severe Thinness",
      color: "#3B82F6", // blue
    };
  } else if (bmi < 17.0) {
    return {
      category: "underweight",
      headlineLabel: "Underweight",
      subclassLabel: "Moderate Thinness",
      color: "#3B82F6",
    };
  } else if (bmi < 18.5) {
    return {
      category: "underweight",
      headlineLabel: "Underweight",
      subclassLabel: "Mild Thinness",
      color: "#60A5FA",
    };
  } else if (bmi < 25.0) {
    return {
      category: "normal",
      headlineLabel: "Healthy Weight",
      subclassLabel: "Normal Weight",
      color: "#4F7A5B", // green
    };
  } else if (bmi < 30.0) {
    return {
      category: "overweight",
      headlineLabel: "Overweight",
      subclassLabel: "Pre-Obese (Overweight)",
      color: "#C9992F", // gold/yellow
    };
  } else if (bmi < 35.0) {
    return {
      category: "obese",
      headlineLabel: "Obesity",
      subclassLabel: "Obese Class I",
      color: "#E65100", // orange
    };
  } else if (bmi < 40.0) {
    return {
      category: "obese",
      headlineLabel: "Obesity",
      subclassLabel: "Obese Class II",
      color: "#D32F2F", // red
    };
  } else {
    return {
      category: "obese",
      headlineLabel: "Obesity",
      subclassLabel: "Obese Class III (Severe)",
      color: "#B71C1C", // dark red
    };
  }
}

/**
 * Calculate healthy weight range for a given height in meters
 */
export function getHealthyWeightRange(heightM, unit = "us") {
  const minKg = 18.5 * Math.pow(heightM, 2);
  const maxKg = 24.9 * Math.pow(heightM, 2);

  if (unit === "metric") {
    return {
      min: Math.round(minKg * 10) / 10,
      max: Math.round(maxKg * 10) / 10,
      unitLabel: "kg",
      text: `${(Math.round(minKg * 10) / 10).toFixed(1)} kg – ${(Math.round(maxKg * 10) / 10).toFixed(1)} kg`,
    };
  } else {
    const minLbs = kgToLb(minKg);
    const maxLbs = kgToLb(maxKg);
    return {
      min: Math.round(minLbs * 10) / 10,
      max: Math.round(maxLbs * 10) / 10,
      unitLabel: "lbs",
      text: `${(Math.round(minLbs * 10) / 10).toFixed(1)} lbs – ${(Math.round(maxLbs * 10) / 10).toFixed(1)} lbs`,
    };
  }
}

/**
 * Main calculation function for BMI
 *
 * @param {Object} params
 * @param {string} params.unit - "us" | "metric" | "other"
 * @param {number|string} params.age - 2 to 120
 * @param {"male"|"female"} params.gender - "male" | "female"
 * @param {number|string} [params.heightFt]
 * @param {number|string} [params.heightIn]
 * @param {number|string} [params.heightCm]
 * @param {number|string} [params.weightLbs]
 * @param {number|string} [params.weightKg]
 *
 * @returns {null | Object} BMI Calculation Result
 */
export function calculateBmi(params) {
  const { unit, age, gender, heightFt, heightIn, heightCm, weightLbs, weightKg } = params;

  const ageNum = parseFloat(age);
  if (isNaN(ageNum) || ageNum < 2 || ageNum > 120) return null;

  let heightM = 0;
  let weightKgVal = 0;
  let weightLbsVal = 0;
  let heightInVal = 0;

  if (unit === "us") {
    const ft = parseFloat(heightFt) || 0;
    const inc = parseFloat(heightIn) || 0;
    heightInVal = ft * 12 + inc;
    if (heightInVal <= 0) return null;

    heightM = (heightInVal * 2.54) / 100;
    weightLbsVal = parseFloat(weightLbs) || 0;
    if (weightLbsVal <= 0) return null;
    weightKgVal = lbToKg(weightLbsVal);
  } else if (unit === "metric") {
    const cm = parseFloat(heightCm) || 0;
    if (cm <= 0) return null;
    heightM = cm / 100;
    heightInVal = cm / 2.54;

    weightKgVal = parseFloat(weightKg) || 0;
    if (weightKgVal <= 0) return null;
    weightLbsVal = kgToLb(weightKgVal);
  } else {
    // "other" or custom unit tab
    const cm = parseFloat(heightCm) || 0;
    const kg = parseFloat(weightKg) || 0;
    if (cm <= 0 || kg <= 0) return null;

    heightM = cm / 100;
    heightInVal = cm / 2.54;
    weightKgVal = kg;
    weightLbsVal = kgToLb(kg);
  }

  if (heightM <= 0 || weightKgVal <= 0) return null;

  // BMI = weight(kg) / height(m)²
  const bmi = weightKgVal / Math.pow(heightM, 2);
  const roundedBmi = Math.round(bmi * 10) / 10;

  // BMI Prime = BMI / 25
  const bmiPrime = bmi / 25;
  const roundedBmiPrime = Math.round(bmiPrime * 100) / 100;

  // Ponderal Index = mass(kg) / height(m)³
  const ponderalIndex = weightKgVal / Math.pow(heightM, 3);
  const roundedPonderalIndex = Math.round(ponderalIndex * 10) / 10;

  // Age routing: Adult (>=20) vs Child/Teen (2–19)
  const isPediatric = ageNum < 20;

  let categoryInfo;
  if (isPediatric) {
    const childResult = getBmiPercentileForChild(ageNum, gender || "male", bmi);
    categoryInfo = {
      isPediatric: true,
      category: childResult.category,
      headlineLabel: childResult.label,
      subclassLabel: `Percentile: ${childResult.percentile}% (CDC Growth Chart)`,
      percentile: childResult.percentile,
      zScore: childResult.zScore,
      color:
        childResult.category === "underweight"
          ? "#3B82F6"
          : childResult.category === "normal"
          ? "#4F7A5B"
          : childResult.category === "overweight"
          ? "#C9992F"
          : "#D32F2F",
    };
  } else {
    categoryInfo = {
      isPediatric: false,
      ...getAdultWhoCategory(bmi),
    };
  }

  const healthyWeight = getHealthyWeightRange(heightM, unit === "metric" ? "metric" : "us");

  return {
    bmi: roundedBmi,
    exactBmi: bmi,
    bmiPrime: roundedBmiPrime,
    ponderalIndex: roundedPonderalIndex,
    categoryInfo,
    healthyWeight,
    inputs: {
      unit,
      age: ageNum,
      gender,
      heightM,
      heightCm: Math.round(heightM * 100),
      heightIn: Math.round(heightInVal * 10) / 10,
      weightKg: Math.round(weightKgVal * 10) / 10,
      weightLbs: Math.round(weightLbsVal * 10) / 10,
    },
  };
}

/**
 * Compact state URL encoder
 */
export function encodeBmiState(state) {
  try {
    const params = new URLSearchParams();
    if (state.unit) params.set("u", state.unit);
    if (state.gender) params.set("g", state.gender);
    if (state.age) params.set("a", state.age);
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

/**
 * URL query search parameter decoder
 */
export function decodeBmiState(search) {
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.size === 0) return null;

    const unit = params.get("u") || "us";
    const gender = params.get("g") || "male";
    const age = params.get("a") || "30";
    const heightFt = params.get("hft") || "5";
    const heightIn = params.get("hin") || "10";
    const heightCm = params.get("hcm") || "178";
    const weightLbs = params.get("w") || "160";
    const weightKg = params.get("wkg") || "72";

    return {
      unit,
      gender,
      age,
      heightFt,
      heightIn,
      heightCm,
      weightLbs,
      weightKg,
    };
  } catch {
    return null;
  }
}
