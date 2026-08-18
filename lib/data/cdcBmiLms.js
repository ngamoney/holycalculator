/**
 * cdcBmiLms.js — CDC Growth Chart LMS Reference Data & Percentile Calculations
 *
 * Source: CDC 2000 Growth Charts for the United States (BMI-for-age, 2 to 20 years)
 * LMS Parameters:
 *  - L: Box-Cox transformation power (skewness)
 *  - M: Median BMI
 *  - S: Generalized coefficient of variation
 *
 * Reference: Kuczmarski RJ, et al. 2000 CDC Growth Charts for the United States.
 * Vital Health Stat 11. 2002;(246):1-190.
 */

// CDC LMS tables for Boys and Girls (Agemonth from 24 to 240 months)
// Format: { [agemonth]: [L, M, S] }

export const CDC_LMS_BOYS = {
  24: [-1.4395, 16.575, 0.0805],
  30: [-1.6441, 16.275, 0.0818],
  36: [-1.7915, 16.027, 0.0831],
  42: [-1.8974, 15.828, 0.0844],
  48: [-1.9688, 15.679, 0.0858],
  54: [-2.0125, 15.574, 0.0872],
  60: [-2.0343, 15.513, 0.0886],
  66: [-2.0378, 15.491, 0.0901],
  72: [-2.0255, 15.505, 0.0917],
  78: [-1.9998, 15.553, 0.0934],
  84: [-1.9625, 15.632, 0.0952],
  90: [-1.9152, 15.741, 0.0971],
  96: [-1.8596, 15.876, 0.0991],
  102: [-1.7967, 16.034, 0.1011],
  108: [-1.7280, 16.213, 0.1032],
  114: [-1.6548, 16.411, 0.1054],
  120: [-1.5781, 16.626, 0.1075],
  126: [-1.4988, 16.857, 0.1097],
  132: [-1.4179, 17.100, 0.1119],
  138: [-1.3364, 17.355, 0.1141],
  144: [-1.2547, 17.620, 0.1162],
  150: [-1.1737, 17.893, 0.1183],
  156: [-1.0940, 18.172, 0.1203],
  162: [-1.0162, 18.455, 0.1223],
  168: [-0.9408, 18.740, 0.1241],
  174: [-0.8682, 19.027, 0.1258],
  180: [-0.7989, 19.313, 0.1274],
  186: [-0.7330, 19.597, 0.1289],
  192: [-0.6708, 19.877, 0.1302],
  198: [-0.6124, 20.151, 0.1314],
  204: [-0.5579, 20.418, 0.1325],
  210: [-0.5074, 20.678, 0.1334],
  216: [-0.4608, 20.929, 0.1342],
  222: [-0.4181, 21.170, 0.1349],
  228: [-0.3792, 21.401, 0.1354],
  234: [-0.3440, 21.621, 0.1359],
  240: [-0.3124, 21.830, 0.1362],
};

export const CDC_LMS_GIRLS = {
  24: [-1.3060, 16.417, 0.0838],
  30: [-1.4883, 16.030, 0.0858],
  36: [-1.6256, 15.719, 0.0877],
  42: [-1.7225, 15.479, 0.0896],
  48: [-1.7828, 15.304, 0.0914],
  54: [-1.8105, 15.191, 0.0933],
  60: [-1.8093, 15.138, 0.0952],
  66: [-1.7830, 15.140, 0.0972],
  72: [-1.7348, 15.195, 0.0994],
  78: [-1.6676, 15.300, 0.1017],
  84: [-1.5841, 15.452, 0.1042],
  90: [-1.4870, 15.648, 0.1069],
  96: [-1.3787, 15.884, 0.1097],
  102: [-1.2612, 16.157, 0.1126],
  108: [-1.1366, 16.463, 0.1157],
  114: [-1.0064, 16.800, 0.1189],
  120: [-0.8722, 17.163, 0.1221],
  126: [-0.7356, 17.549, 0.1252],
  132: [-0.5979, 17.954, 0.1283],
  138: [-0.4605, 18.374, 0.1313],
  144: [-0.3246, 18.805, 0.1340],
  150: [-0.1913, 19.242, 0.1365],
  156: [-0.0614, 19.680, 0.1387],
  162: [0.0642, 20.115, 0.1406],
  168: [0.1851, 20.540, 0.1421],
  174: [0.3006, 20.952, 0.1432],
  180: [0.4099, 21.347, 0.1439],
  186: [0.5126, 21.720, 0.1442],
  192: [0.6080, 22.069, 0.1441],
  198: [0.6957, 22.390, 0.1437],
  204: [0.7753, 22.682, 0.1430],
  210: [0.8464, 22.943, 0.1420],
  216: [0.9088, 23.173, 0.1407],
  222: [0.9624, 23.371, 0.1393],
  228: [1.0070, 23.538, 0.1378],
  234: [1.0426, 23.676, 0.1362],
  240: [1.0695, 23.787, 0.1346],
};

/**
 * Standard error function approximation (Abramowitz & Stegun formula 7.1.26)
 */
function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  const a = Math.abs(x);

  const p = 0.3275911;
  const t = 1.0 / (1.0 + p * a);
  const y =
    1.0 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-a * a);

  return sign * y;
}

/**
 * Cumulative standard normal distribution function (CDF)
 */
function normalCdf(z) {
  return 0.5 * (1.0 + erf(z / Math.SQRT2));
}

/**
 * Interpolate LMS parameters for a specific age in months
 */
function getLmsForAge(agemonth, gender) {
  const table = gender === "male" ? CDC_LMS_BOYS : CDC_LMS_GIRLS;
  const months = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b);

  const target = Math.max(months[0], Math.min(months[months.length - 1], agemonth));

  if (table[target]) {
    return table[target];
  }

  // Find surrounding months for linear interpolation
  let lower = months[0];
  let upper = months[months.length - 1];

  for (let i = 0; i < months.length - 1; i++) {
    if (target >= months[i] && target <= months[i + 1]) {
      lower = months[i];
      upper = months[i + 1];
      break;
    }
  }

  const fraction = (target - lower) / (upper - lower);
  const [l1, m1, s1] = table[lower];
  const [l2, m2, s2] = table[upper];

  const L = l1 + fraction * (l2 - l1);
  const M = m1 + fraction * (m2 - m1);
  const S = s1 + fraction * (s2 - s1);

  return [L, M, S];
}

/**
 * Calculate CDC BMI Percentile and Z-Score for children/teens (age 2 to 19)
 * @param {number} ageYears - Age in years (e.g. 10.5)
 * @param {"male"|"female"} gender - Biological sex
 * @param {number} bmi - Calculated BMI value
 * @returns {{ zScore: number, percentile: number, category: string, label: string }}
 */
export function getBmiPercentileForChild(ageYears, gender, bmi) {
  const agemonth = Math.round(ageYears * 12);
  const [L, M, S] = getLmsForAge(agemonth, gender);

  let zScore;
  if (Math.abs(L) < 0.001) {
    zScore = Math.log(bmi / M) / S;
  } else {
    zScore = (Math.pow(bmi / M, L) - 1.0) / (L * S);
  }

  const percentile = Math.min(99.9, Math.max(0.1, normalCdf(zScore) * 100));
  const roundedPct = Math.round(percentile * 10) / 10;

  let category = "normal";
  let label = "Healthy Weight";

  if (roundedPct < 5) {
    category = "underweight";
    label = "Underweight";
  } else if (roundedPct < 85) {
    category = "normal";
    label = "Healthy Weight";
  } else if (roundedPct < 95) {
    category = "overweight";
    label = "At Risk of Overweight";
  } else {
    category = "obese";
    label = "Overweight / Obese";
  }

  return {
    zScore: Math.round(zScore * 100) / 100,
    percentile: roundedPct,
    category,
    label,
    lms: { L, M, S },
  };
}
