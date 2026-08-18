/**
 * idealWeight.js — Holy Calculator Ideal Weight Engine
 *
 * Core calculations for:
 *  - Devine (1974) IBW
 *  - Robinson (1983) IBW
 *  - Miller (1983) IBW
 *  - Hamwi (1964) IBW
 *  - Healthy BMI Weight Range (reused from bmiMath.js)
 *  - Pediatric CDC Percentile Routing (ages 2–17)
 *  - URL State Encoding/Decoding for shareability
 */

import { getHealthyWeightRange, kgToLb, ftInToCm } from "./bmiMath.js";
import { getBmiPercentileForChild } from "../data/cdcBmiLms.js";

/**
 * Format weight value based on active unit ("us" -> lbs, "metric" -> kg)
 */
function formatWeight(kgVal, unit = "us") {
  if (unit === "metric") {
    const kg = Math.round(kgVal * 10) / 10;
    return `${kg.toFixed(1)} kg`;
  } else {
    const lbs = Math.round(kgToLb(kgVal) * 10) / 10;
    return `${lbs.toFixed(1)} lbs`;
  }
}

/**
 * Calculate Ideal Weight comparison values
 *
 * @param {Object} params
 * @param {string} params.unit - "us" | "metric" | "other"
 * @param {number|string} params.age - 2 to 80
 * @param {"male"|"female"} params.gender
 * @param {number|string} [params.heightFt]
 * @param {number|string} [params.heightIn]
 * @param {number|string} [params.heightCm]
 *
 * @returns {null | Object}
 */
export function calculateIdealWeight(params) {
  const { unit = "us", age, gender = "male", heightFt, heightIn, heightCm } = params;

  const ageNum = parseFloat(age);
  if (isNaN(ageNum) || ageNum < 2 || ageNum > 80) return null;

  let totalInches = 0;
  let heightM = 0;

  if (unit === "us") {
    const ft = parseFloat(heightFt) || 0;
    const inc = parseFloat(heightIn) || 0;
    totalInches = ft * 12 + inc;
    if (totalInches <= 0) return null;
    heightM = (totalInches * 2.54) / 100;
  } else {
    const cm = parseFloat(heightCm) || 0;
    if (cm <= 0) return null;
    heightM = cm / 100;
    totalInches = cm / 2.54;
  }

  if (heightM <= 0 || totalInches <= 0) return null;

  const isPediatric = ageNum < 18;

  if (isPediatric) {
    // For children & teens (age 2–17), route to CDC growth chart percentiles
    // Using a sample healthy median BMI (~18) for illustration
    const childData = getBmiPercentileForChild(ageNum, gender, 18.0);

    return {
      isPediatric: true,
      age: ageNum,
      gender,
      heightM,
      heightInches: Math.round(totalInches * 10) / 10,
      heightCm: Math.round(heightM * 100),
      childData,
      healthyBmiRange: getHealthyWeightRange(heightM, unit === "metric" ? "metric" : "us"),
    };
  }

  // Adult IBW Calculations (Ages 18+)
  // Inches over 5 feet (60 inches)
  const inchesOver5Ft = totalInches - 60;

  const isMale = gender === "male";

  // 1. Devine (1974) Formula
  const devineKg = isMale ? 50.0 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;

  // 2. Robinson (1983) Formula
  const robinsonKg = isMale ? 52.0 + 1.9 * inchesOver5Ft : 49.0 + 1.7 * inchesOver5Ft;

  // 3. Miller (1983) Formula
  const millerKg = isMale ? 56.2 + 1.41 * inchesOver5Ft : 53.1 + 1.36 * inchesOver5Ft;

  // 4. Hamwi (1964) Formula
  const hamwiKg = isMale ? 48.0 + 2.7 * inchesOver5Ft : 45.5 + 2.2 * inchesOver5Ft;

  // 5. Healthy WHO BMI Weight Range (reused from bmiMath.js)
  const healthyBmiRange = getHealthyWeightRange(heightM, unit === "metric" ? "metric" : "us");

  const displayUnit = unit === "metric" ? "metric" : "us";

  const formulaRows = [
    {
      id: "devine",
      name: "Devine Formula (1974)",
      note: "Most widely used in clinical pharmacy & drug dosing",
      kg: devineKg,
      valueText: formatWeight(devineKg, displayUnit),
    },
    {
      id: "robinson",
      name: "Robinson Formula (1983)",
      note: "Modification of Devine formula for lower height variance",
      kg: robinsonKg,
      valueText: formatWeight(robinsonKg, displayUnit),
    },
    {
      id: "miller",
      name: "Miller Formula (1983)",
      note: "Modification based on revised actuarial mortality tables",
      kg: millerKg,
      valueText: formatWeight(millerKg, displayUnit),
    },
    {
      id: "hamwi",
      name: "Hamwi Formula (1964)",
      note: "Originally designed for prescribing medication dosages",
      kg: hamwiKg,
      valueText: formatWeight(hamwiKg, displayUnit),
    },
    {
      id: "bmi_range",
      name: "Healthy BMI Weight Range",
      note: "WHO standard healthy weight range (BMI 18.5 – 24.9)",
      isRange: true,
      valueText: healthyBmiRange.text,
    },
  ];

  return {
    isPediatric: false,
    age: ageNum,
    gender,
    heightM,
    heightInches: Math.round(totalInches * 10) / 10,
    heightCm: Math.round(heightM * 100),
    formulaRows,
    healthyBmiRange,
    inputs: {
      unit,
      age: ageNum,
      gender,
    },
  };
}

// ---------------------------------------------------------------------------
// URL State Encoder / Decoder
// ---------------------------------------------------------------------------

export function encodeIdealWeightState(state) {
  try {
    const params = new URLSearchParams();
    if (state.unit) params.set("u", state.unit);
    if (state.gender) params.set("g", state.gender);
    if (state.age) params.set("a", state.age);

    if (state.unit === "us") {
      if (state.heightFt) params.set("hft", state.heightFt);
      if (state.heightIn) params.set("hin", state.heightIn);
    } else {
      if (state.heightCm) params.set("hcm", state.heightCm);
    }

    return params.toString();
  } catch {
    return "";
  }
}

export function decodeIdealWeightState(search) {
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
    };
  } catch {
    return null;
  }
}
