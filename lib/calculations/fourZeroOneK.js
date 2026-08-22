/**
 * Pure calculation logic for 401(k) Retirement Calculator.
 * Models annual salary escalation, employee contributions (subject to IRS limits),
 * employer matching formulas, compound investment returns, and inflation adjustment.
 */

// 2026 standard IRS 401(k) limit ($23,500 baseline, $31,000 for age 50+)
const IRS_LIMIT_2026 = 23500;
const IRS_CATCHUP_LIMIT_2026 = 31000;

export function calculate401k({
  currentAge = 30,
  retirementAge = 65,
  currentSalary = 75000,
  currentBalance = 35000,
  contributionPct = 10,
  employerMatchPct = 50, // 50% match
  employerMatchLimitPct = 6, // up to 6% of salary
  annualSalaryIncreasePct = 3.0,
  investmentReturnPct = 7.0,
  inflationPct = 2.5,
  retirementYears = 25,
}) {
  const age = Math.max(18, Math.min(85, Number(currentAge) || 30));
  const retAge = Math.max(age + 1, Math.min(95, Number(retirementAge) || 65));
  const yearsToRetire = retAge - age;

  let balance = Math.max(0, Number(currentBalance) || 0);
  let salary = Math.max(0, Number(currentSalary) || 0);
  const employeePct = Math.max(0, Math.min(100, Number(contributionPct) || 0)) / 100;
  const matchRate = Math.max(0, Math.min(200, Number(employerMatchPct) || 0)) / 100;
  const matchMaxPct = Math.max(0, Math.min(100, Number(employerMatchLimitPct) || 0)) / 100;
  const salaryGrowthRate = (Number(annualSalaryIncreasePct) || 0) / 100;
  const returnRate = (Number(investmentReturnPct) || 0) / 100;
  const inflationRate = (Number(inflationPct) || 0) / 100;

  let totalEmployeeContrib = 0;
  let totalEmployerMatch = 0;
  const initialBalance = balance;
  const yearlySchedule = [];

  for (let year = 1; year <= yearsToRetire; year++) {
    const curAge = age + year;
    const irsLimit = curAge >= 50 ? IRS_CATCHUP_LIMIT_2026 : IRS_LIMIT_2026;

    // Annual contribution calculations
    let rawEmployeeContrib = salary * employeePct;
    let actualEmployeeContrib = Math.min(rawEmployeeContrib, irsLimit);

    // Employer match
    const eligibleSalaryForMatch = Math.min(employeePct, matchMaxPct);
    const employerContrib = salary * eligibleSalaryForMatch * matchRate;

    // Investment returns on beginning balance + mid-year contribution
    const totalAnnualContributions = actualEmployeeContrib + employerContrib;
    const growth = (balance + totalAnnualContributions / 2) * returnRate;

    balance += totalAnnualContributions + growth;
    totalEmployeeContrib += actualEmployeeContrib;
    totalEmployerMatch += employerContrib;

    const cumulativeInflationFactor = Math.pow(1 + inflationRate, year);
    const inflationAdjustedBalance = balance / cumulativeInflationFactor;

    yearlySchedule.push({
      year,
      age: curAge,
      salary,
      employeeContrib: actualEmployeeContrib,
      employerContrib,
      growth,
      endingBalance: balance,
      realEndingBalance: inflationAdjustedBalance,
    });

    // Escalate salary for next year
    salary *= 1 + salaryGrowthRate;
  }

  const finalBalance = balance;
  const totalGrowth = Math.max(0, finalBalance - initialBalance - totalEmployeeContrib - totalEmployerMatch);
  const inflationFactor = Math.pow(1 + inflationRate, yearsToRetire);
  const realBalanceTodayDollars = finalBalance / inflationFactor;

  // Safe withdrawal estimate in retirement (4% rule per year / 12)
  const monthlyRetirementIncomeNominal = (finalBalance * 0.04) / 12;
  const monthlyRetirementIncomeReal = (realBalanceTodayDollars * 0.04) / 12;

  return {
    currentAge: age,
    retirementAge: retAge,
    yearsToRetire,
    finalBalance,
    realBalanceTodayDollars,
    initialBalance,
    totalEmployeeContrib,
    totalEmployerMatch,
    totalGrowth,
    monthlyRetirementIncomeNominal,
    monthlyRetirementIncomeReal,
    yearlySchedule,
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

export function formatCurrencyCents(val) {
  if (isNaN(val) || !isFinite(val)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}
