/**
 * Pure calculation logic for Debt-to-Income (DTI) Ratio Calculator.
 * Calculates:
 * - Front-End DTI (Housing Ratio): Housing Costs ÷ Gross Monthly Income
 * - Back-End DTI (Total Debt Ratio): Total Monthly Debt ÷ Gross Monthly Income
 * - Mortgage qualification status across Conventional (28/36), FHA (31/43), and VA guidelines.
 */

export function calculateDebtRatio({
  annualSalary = 80000,
  otherMonthlyIncome = 0,
  housingCost = 1800, // Rent or Mortgage P&I + Tax + Ins + HOA
  autoLoan = 400,
  studentLoan = 250,
  creditCardMin = 150,
  personalLoan = 0,
  otherDebt = 0,
}) {
  const salaryAnnual = Math.max(0, Number(annualSalary) || 0);
  const otherIncome = Math.max(0, Number(otherMonthlyIncome) || 0);
  const grossMonthlyIncome = salaryAnnual / 12 + otherIncome;

  const housing = Math.max(0, Number(housingCost) || 0);
  const nonHousingDebt =
    Math.max(0, Number(autoLoan) || 0) +
    Math.max(0, Number(studentLoan) || 0) +
    Math.max(0, Number(creditCardMin) || 0) +
    Math.max(0, Number(personalLoan) || 0) +
    Math.max(0, Number(otherDebt) || 0);

  const totalMonthlyDebt = housing + nonHousingDebt;

  if (grossMonthlyIncome <= 0) {
    return {
      grossMonthlyIncome: 0,
      housingCost: housing,
      nonHousingDebt,
      totalMonthlyDebt,
      frontEndDti: 0,
      backEndDti: 0,
      status: "N/A",
      statusColor: "gray",
      maxHousing28: 0,
      maxTotalDebt36: 0,
      maxTotalDebt43: 0,
    };
  }

  const frontEndDti = (housing / grossMonthlyIncome) * 100;
  const backEndDti = (totalMonthlyDebt / grossMonthlyIncome) * 100;

  // Maximum recommended payments based on standard 28/36 rule
  const maxHousing28 = grossMonthlyIncome * 0.28;
  const maxTotalDebt36 = grossMonthlyIncome * 0.36;
  const maxTotalDebt43 = grossMonthlyIncome * 0.43; // Standard Qualified Mortgage limit

  let status = "Excellent (Prime Qualified)";
  let statusColor = "#4f7a5b"; // Green
  let feedback = "Your debt ratio is in the ideal range for the best mortgage rates and conventional loan approvals.";

  if (backEndDti > 50) {
    status = "Very High Risk (Unfavorable)";
    statusColor = "#b02a37"; // Red
    feedback = "Most lenders will not approve new mortgages or personal loans with a DTI above 50%. Focus on paying down high-interest debt.";
  } else if (backEndDti > 43) {
    status = "Elevated (FHA / Non-Conforming)";
    statusColor = "#c9992f"; // Gold
    feedback = "Your DTI exceeds standard conventional limits (36%–43%). You may need an FHA loan with compensating factors (high credit or cash reserves).";
  } else if (backEndDti > 36) {
    status = "Moderate (Acceptable)";
    statusColor = "#9c7420"; // Gold-deep
    feedback = "Acceptable for most lenders, but near the upper boundary for prime conventional loans. Lenders may scrutinize your credit score.";
  }

  return {
    grossMonthlyIncome,
    housingCost: housing,
    nonHousingDebt,
    totalMonthlyDebt,
    frontEndDti: Math.round(frontEndDti * 10) / 10,
    backEndDti: Math.round(backEndDti * 10) / 10,
    status,
    statusColor,
    feedback,
    maxHousing28,
    maxTotalDebt36,
    maxTotalDebt43,
  };
}

export function formatCurrency(val) {
  if (isNaN(val) || !isFinite(val)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}
