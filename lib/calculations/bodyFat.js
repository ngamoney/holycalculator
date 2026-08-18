/**
 * bodyFat.js — Holy Calculator Body Fat Engine
 *
 * Core calculation logic for:
 *  - U.S. Navy Circumference Method (Logarithmic formula, male & female)
 *  - BMI-based Body Fat Estimation Method (reusing bmiMath.js)
 *  - ACE Body Fat Category classification
 *  - Jackson & Pollock Age-Based Reference Dataset
 *  - Log10 boundary condition & measurement validation
 */

import { calculateBmi, ftInToCm, cmToFtIn, lbToKg, kgToLb } from "./bmiMath.js";

export { ftInToCm, cmToFtIn, lbToKg, kgToLb };

export const ACE_BODY_FAT_CATEGORIES = {
  male: [
    { label: "Essential Fat", min: 2, max: 5.9, color: "#3B82F6" },
    { label: "Athletes", min: 6, max: 13.9, color: "#10B981" },
    { label: "Fitness", min: 14, max: 17.9, color: "#059669" },
    { label: "Average", min: 18, max: 24.9, color: "#C9992F" },
    { label: "Above Average", min: 25, max: 100, color: "#E65100" },
  ],
  female: [
    { label: "Essential Fat", min: 10, max: 13.9, color: "#3B82F6" },
    { label: "Athletes", min: 14, max: 20.9, color: "#10B981" },
    { label: "Fitness", min: 21, max: 24.9, color: "#059669" },
    { label: "Average", min: 25, max: 31.9, color: "#C9992F" },
    { label: "Above Average", min: 32, max: 100, color: "#E65100" },
  ],
};

export const JACKSON_POLLOCK_REFERENCE_DATA = [
  { ageGroup: "20 – 24", male: "8.5% – 10.5%", female: "17.5% – 19.5%" },
  { ageGroup: "25 – 29", male: "10.5% – 12.5%", female: "18.5% – 20.5%" },
  { ageGroup: "30 – 34", male: "12.5% – 14.5%", female: "19.5% – 21.5%" },
  { ageGroup: "35 – 39", male: "14.5% – 16.5%", female: "20.5% – 22.5%" },
  { ageGroup: "40 – 44", male: "16.5% – 18.5%", female: "21.5% – 23.5%" },
  { ageGroup: "45 – 49", male: "18.5% – 20.5%", female: "22.5% – 24.5%" },
  { ageGroup: "50 – 54", male: "20.5% – 22.5%", female: "23.5% – 25.5%" },
  { ageGroup: "55+", male: "22.5% – 24.5%", female: "24.5% – 26.5%" },
];

/**
 * Get ACE category for body fat percentage
 */
export function getAceCategory(bfp, gender = "male") {
  const categories = ACE_BODY_FAT_CATEGORIES[gender] || ACE_BODY_FAT_CATEGORIES.male;
  const found = categories.find((cat) => bfp >= cat.min && bfp <= cat.max);
  if (found) return found;
  if (bfp < categories[0].min) return categories[0];
  return categories[categories.length - 1];
}

/**
 * Calculates Body Fat Percentage using U.S. Navy Method and BMI Method
 */
export function calculateBodyFat(params) {
  const {
    unit = "us",
    gender = "male",
    age,
    weight,
    heightFt,
    heightIn,
    heightCm,
    neck,
    waist,
    hip,
  } = params;

  const ageNum = parseFloat(age);
  if (isNaN(ageNum) || ageNum < 2 || ageNum > 120) {
    return { isValid: false, error: "Please enter a valid age between 2 and 120." };
  }

  // Parse height and weight
  let heightInVal = 0;
  let heightCmVal = 0;
  let weightLbsVal = 0;
  let weightKgVal = 0;

  if (unit === "us") {
    const ft = parseFloat(heightFt) || 0;
    const inc = parseFloat(heightIn) || 0;
    heightInVal = ft * 12 + inc;
    heightCmVal = heightInVal * 2.54;
    weightLbsVal = parseFloat(weight) || 0;
    weightKgVal = lbToKg(weightLbsVal);
  } else {
    heightCmVal = parseFloat(heightCm) || 0;
    heightInVal = heightCmVal / 2.54;
    weightKgVal = parseFloat(weight) || 0;
    weightLbsVal = kgToLb(weightKgVal);
  }

  if (heightInVal <= 0 || weightKgVal <= 0) {
    return { isValid: false, error: "Please enter valid height and weight values." };
  }

  // Parse circumferences
  let neckInVal = 0;
  let waistInVal = 0;
  let hipInVal = 0;

  if (unit === "us") {
    neckInVal = parseFloat(neck) || 0;
    waistInVal = parseFloat(waist) || 0;
    hipInVal = parseFloat(hip) || 0;
  } else {
    neckInVal = (parseFloat(neck) || 0) / 2.54;
    waistInVal = (parseFloat(waist) || 0) / 2.54;
    hipInVal = (parseFloat(hip) || 0) / 2.54;
  }

  if (neckInVal <= 0 || waistInVal <= 0 || (gender === "female" && hipInVal <= 0)) {
    return { isValid: false, error: "Please enter valid positive body circumference measurements." };
  }

  // U.S. Navy Method Log10 Boundary Validation
  if (gender === "male") {
    const diff = waistInVal - neckInVal;
    if (diff <= 0) {
      return {
        isValid: false,
        error: "Check measurements: Waist circumference must be greater than neck circumference.",
      };
    }
  } else {
    const diff = waistInVal + hipInVal - neckInVal;
    if (diff <= 0) {
      return {
        isValid: false,
        error: "Check measurements: (Waist + Hip) circumference must be greater than neck circumference.",
      };
    }
  }

  // U.S. Navy Method BFP Math
  let navyBfp = 0;
  if (gender === "male") {
    navyBfp = 86.010 * Math.log10(waistInVal - neckInVal) - 70.041 * Math.log10(heightInVal) + 36.76;
  } else {
    navyBfp = 163.205 * Math.log10(waistInVal + hipInVal - neckInVal) - 97.684 * Math.log10(heightInVal) - 78.387;
  }

  // Bound BFP between 2% and 60%
  navyBfp = Math.max(2.0, Math.min(60.0, navyBfp));

  // Compute Fat Mass & Lean Mass
  const fatMassKg = weightKgVal * (navyBfp / 100);
  const leanMassKg = weightKgVal - fatMassKg;
  const fatMassLbs = kgToLb(fatMassKg);
  const leanMassLbs = kgToLb(leanMassKg);

  // ACE category
  const aceCategory = getAceCategory(navyBfp, gender);

  // Secondary Method: BMI Method BFP Math
  const bmiResult = calculateBmi({
    unit: unit === "us" ? "us" : "metric",
    age: ageNum,
    gender,
    heightFt,
    heightIn,
    heightCm,
    weightLbs: weightLbsVal,
    weightKg: weightKgVal,
  });

  let bmiBfp = null;
  let bmiVal = null;
  if (bmiResult && bmiResult.bmi) {
    bmiVal = bmiResult.bmi;
    if (ageNum >= 20) {
      bmiBfp = gender === "male"
        ? 1.20 * bmiVal + 0.23 * ageNum - 16.2
        : 1.20 * bmiVal + 0.23 * ageNum - 5.4;
    } else {
      bmiBfp = gender === "male"
        ? 1.51 * bmiVal - 0.70 * ageNum - 2.2
        : 1.51 * bmiVal - 0.70 * ageNum + 1.4;
    }
    bmiBfp = Math.max(2.0, Math.min(60.0, bmiBfp));
  }

  return {
    isValid: true,
    unit,
    gender,
    age: ageNum,
    weightKg: Math.round(weightKgVal * 10) / 10,
    weightLbs: Math.round(weightLbsVal * 10) / 10,
    navy: {
      bfp: Math.round(navyBfp * 10) / 10,
      bfpFormatted: `${(Math.round(navyBfp * 10) / 10).toFixed(1)}%`,
      fatMassKg: Math.round(fatMassKg * 10) / 10,
      fatMassLbs: Math.round(fatMassLbs * 10) / 10,
      leanMassKg: Math.round(leanMassKg * 10) / 10,
      leanMassLbs: Math.round(leanMassLbs * 10) / 10,
      category: aceCategory,
    },
    bmiMethod: bmiBfp !== null ? {
      bmi: bmiVal,
      bfp: Math.round(bmiBfp * 10) / 10,
      bfpFormatted: `${(Math.round(bmiBfp * 10) / 10).toFixed(1)}%`,
    } : null,
  };
}
