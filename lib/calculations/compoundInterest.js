/**
 * Shared Compound Interest & Loan Math Utilities.
 * Handles Effective Annual Rate (EAR) conversion across 9 compounding frequencies
 * and period rate calculation across 7 payback frequencies.
 * Supports 3 Loan Calculation Modes:
 * Mode A: Amortized Loan (Fixed Periodic Payments)
 * Mode B: Deferred Payment Loan (Single Lump Sum at Maturity)
 * Mode C: Bond (Present Value from Predetermined Maturity Face Value)
 */

export const COMPOUND_FREQUENCIES = [
  { key: "monthly", label: "Monthly (12/yr)", periods: 12 },
  { key: "annually", label: "Annually (1/yr)", periods: 1 },
  { key: "semi-annually", label: "Semi-Annually (2/yr)", periods: 2 },
  { key: "quarterly", label: "Quarterly (4/yr)", periods: 4 },
  { key: "semi-monthly", label: "Semi-Monthly (24/yr)", periods: 24 },
  { key: "biweekly", label: "Biweekly (26/yr)", periods: 26 },
  { key: "weekly", label: "Weekly (52/yr)", periods: 52 },
  { key: "daily", label: "Daily (365/yr)", periods: 365 },
  { key: "continuously", label: "Continuously", periods: "continuously" },
];

export const PAYBACK_FREQUENCIES = [
  { key: "monthly", label: "Every Month (12/yr)", periods: 12 },
  { key: "biweekly", label: "Every 2 Weeks / Biweekly (26/yr)", periods: 26 },
  { key: "weekly", label: "Every Week (52/yr)", periods: 52 },
  { key: "daily", label: "Every Day (365/yr)", periods: 365 },
  { key: "semi-monthly", label: "Half Month (24/yr)", periods: 24 },
  { key: "quarterly", label: "Every Quarter (4/yr)", periods: 4 },
  { key: "annually", label: "Every Year (1/yr)", periods: 1 },
];

export function getPeriodsPerYear(freqKey, fallback = 12) {
  const match = COMPOUND_FREQUENCIES.find((f) => f.key === freqKey) || PAYBACK_FREQUENCIES.find((f) => f.key === freqKey);
  return match ? match.periods : fallback;
}

export function formatCurrency(num) {
  if (num === null || num === undefined || isNaN(num)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatCurrencyCents(num) {
  if (num === null || num === undefined || isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Calculates Effective Annual Rate (EAR) from nominal annual rate.
 */
export function calculateEffectiveAnnualRate(nominalRatePct, compoundFreqKey) {
  const r = Math.max(0, Number(nominalRatePct) || 0) / 100;
  if (compoundFreqKey === "continuously") {
    return Math.exp(r) - 1;
  }
  const n = getPeriodsPerYear(compoundFreqKey, 12);
  if (n <= 0) return r;
  return Math.pow(1 + r / n, n) - 1;
}

/**
 * Calculates effective interest rate per payback period.
 */
export function calculatePeriodRate(ear, paybackFreqKey) {
  const nPay = getPeriodsPerYear(paybackFreqKey, 12);
  if (nPay <= 0) return ear;
  return Math.pow(1 + ear, 1 / nPay) - 1;
}

/**
 * Mode A: Amortized Loan (Fixed Periodic Payments)
 */
export function calculateAmortizedLoan(inputs) {
  const {
    loanAmount = 20000,
    loanTermValue = 5,
    loanTermUnit = "years", // 'years' | 'months'
    interestRate = 6.0,
    compoundFrequency = "monthly",
    paybackFrequency = "monthly",
  } = inputs;

  const principal = Math.max(100, Number(loanAmount) || 20000);
  const termNum = Math.max(1, Number(loanTermValue) || 1);
  const years = loanTermUnit === "months" ? termNum / 12 : termNum;
  const nPay = getPeriodsPerYear(paybackFrequency, 12);
  const totalPeriods = Math.max(1, Math.round(years * nPay));

  const ear = calculateEffectiveAnnualRate(interestRate, compoundFrequency);
  const rPeriod = calculatePeriodRate(ear, paybackFrequency);

  let pmt = 0;
  if (rPeriod > 0) {
    pmt = (principal * (rPeriod * Math.pow(1 + rPeriod, totalPeriods))) / (Math.pow(1 + rPeriod, totalPeriods) - 1);
  } else {
    pmt = principal / totalPeriods;
  }

  const totalPaid = pmt * totalPeriods;
  const totalInterest = Math.max(0, totalPaid - principal);

  // Amortization Schedule (Period-by-period)
  const schedule = [];
  let balance = principal;
  let cumInterest = 0;

  for (let p = 1; p <= totalPeriods; p++) {
    const interestForPeriod = balance * rPeriod;
    const principalForPeriod = Math.min(balance, pmt - interestForPeriod);
    balance = Math.max(0, balance - principalForPeriod);
    cumInterest += interestForPeriod;

    schedule.push({
      period: p,
      payment: pmt,
      interestPaid: interestForPeriod,
      principalPaid: principalForPeriod,
      cumInterest,
      endingBalance: balance,
    });
  }

  return {
    mode: "amortized",
    principal,
    years,
    totalPeriods,
    interestRate,
    compoundFrequency,
    paybackFrequency,
    earPercent: (ear * 100).toFixed(2),
    paymentPerPeriod: pmt,
    totalPaid,
    totalInterest,
    principalPercent: Math.round((principal / totalPaid) * 100),
    interestPercent: Math.round((totalInterest / totalPaid) * 100),
    schedule,
  };
}

/**
 * Mode B: Deferred Payment Loan (Single Lump Sum at Maturity)
 */
export function calculateDeferredLoan(inputs) {
  const {
    loanAmount = 10000,
    loanTermValue = 3,
    loanTermUnit = "years",
    interestRate = 5.0,
    compoundFrequency = "monthly",
  } = inputs;

  const principal = Math.max(100, Number(loanAmount) || 10000);
  const termNum = Math.max(1, Number(loanTermValue) || 1);
  const years = loanTermUnit === "months" ? termNum / 12 : termNum;

  const r = Math.max(0, Number(interestRate) || 0) / 100;
  let amountDueAtMaturity = 0;

  if (compoundFrequency === "continuously") {
    amountDueAtMaturity = principal * Math.exp(r * years);
  } else {
    const nComp = getPeriodsPerYear(compoundFrequency, 12);
    amountDueAtMaturity = principal * Math.pow(1 + r / nComp, nComp * years);
  }

  const totalInterest = Math.max(0, amountDueAtMaturity - principal);

  // Annual Growth Schedule
  const numYears = Math.ceil(years);
  const schedule = [];
  let curBal = principal;

  for (let y = 1; y <= numYears; y++) {
    const periodYear = Math.min(y, years);
    let yearEndBal = 0;
    if (compoundFrequency === "continuously") {
      yearEndBal = principal * Math.exp(r * periodYear);
    } else {
      const nComp = getPeriodsPerYear(compoundFrequency, 12);
      yearEndBal = principal * Math.pow(1 + r / nComp, nComp * periodYear);
    }
    const yearInterest = yearEndBal - curBal;
    curBal = yearEndBal;

    schedule.push({
      year: y,
      startBalance: yearEndBal - yearInterest,
      interestEarned: yearInterest,
      endingBalance: yearEndBal,
    });
  }

  return {
    mode: "deferred",
    principal,
    years,
    interestRate,
    compoundFrequency,
    amountDueAtMaturity,
    totalInterest,
    principalPercent: Math.round((principal / amountDueAtMaturity) * 100),
    interestPercent: Math.round((totalInterest / amountDueAtMaturity) * 100),
    schedule,
  };
}

/**
 * Mode C: Bond (Predetermined Lump Sum Paid at Maturity -> Present Value)
 */
export function calculateBondLoan(inputs) {
  const {
    faceValue = 10000,
    loanTermValue = 5,
    loanTermUnit = "years",
    interestRate = 6.0,
    compoundFrequency = "annually",
  } = inputs;

  const fv = Math.max(100, Number(faceValue) || 10000);
  const termNum = Math.max(1, Number(loanTermValue) || 1);
  const years = loanTermUnit === "months" ? termNum / 12 : termNum;

  const r = Math.max(0, Number(interestRate) || 0) / 100;
  let presentValue = 0;

  if (compoundFrequency === "continuously") {
    presentValue = fv / Math.exp(r * years);
  } else {
    const nComp = getPeriodsPerYear(compoundFrequency, 12);
    presentValue = fv / Math.pow(1 + r / nComp, nComp * years);
  }

  const totalDiscountInterest = Math.max(0, fv - presentValue);

  // Annual Growth Schedule from Present Value to Face Value
  const numYears = Math.ceil(years);
  const schedule = [];
  let curBal = presentValue;

  for (let y = 1; y <= numYears; y++) {
    const periodYear = Math.min(y, years);
    let yearEndBal = 0;
    if (compoundFrequency === "continuously") {
      yearEndBal = presentValue * Math.exp(r * periodYear);
    } else {
      const nComp = getPeriodsPerYear(compoundFrequency, 12);
      yearEndBal = presentValue * Math.pow(1 + r / nComp, nComp * periodYear);
    }
    const yearInterest = yearEndBal - curBal;
    curBal = yearEndBal;

    schedule.push({
      year: y,
      startBalance: yearEndBal - yearInterest,
      interestEarned: yearInterest,
      endingBalance: yearEndBal,
    });
  }

  return {
    mode: "bond",
    faceValue: fv,
    years,
    interestRate,
    compoundFrequency,
    presentValueReceived: presentValue,
    totalDiscountInterest,
    presentValuePercent: Math.round((presentValue / fv) * 100),
    discountPercent: Math.round((totalDiscountInterest / fv) * 100),
    schedule,
  };
}

/**
 * Utility: Converts a nominal interest rate under one compounding frequency
 * to an equivalent nominal rate under another compounding frequency.
 */
export function convertInterestRate(nominalRatePct, fromFreqKey = "monthly", toFreqKey = "annually") {
  const rNom = Math.max(0, Number(nominalRatePct) || 0);
  const ear = calculateEffectiveAnnualRate(rNom, fromFreqKey);

  let targetNominalRate = 0;
  if (toFreqKey === "continuously") {
    targetNominalRate = Math.log(1 + ear);
  } else {
    const nTo = getPeriodsPerYear(toFreqKey, 12);
    if (nTo <= 0) {
      targetNominalRate = ear;
    } else {
      targetNominalRate = nTo * (Math.pow(1 + ear, 1 / nTo) - 1);
    }
  }

  return {
    fromRatePercent: rNom,
    fromFreqKey,
    toFreqKey,
    earPercent: (ear * 100).toFixed(3),
    equivalentRatePercent: (targetNominalRate * 100).toFixed(3),
  };
}

/**
 * Rule of 72 Doubling Time estimate.
 */
export function calculateRuleOf72(ratePercent) {
  const r = Number(ratePercent) || 0;
  if (r <= 0) return "N/A";
  return (72 / r).toFixed(1);
}

/**
 * Primary Growth Calculator: Initial principal compounding + periodic contributions.
 */
export function calculateCompoundGrowth(inputs) {
  const {
    initialInvestment = 10000,
    interestRate = 7.0,
    compoundFrequency = "monthly",
    investmentYears = 10,
    investmentMonths = 0,
    additionalContribution = 100,
    contributionFrequency = "monthly", // 'monthly' | 'annually'
    contributionTiming = "end", // 'start' | 'end'
  } = inputs;

  const principal = Math.max(0, Number(initialInvestment) || 0);
  const rNom = Math.max(0, Number(interestRate) || 0);
  const years = Math.max(0, Number(investmentYears) || 0);
  const months = Math.max(0, Number(investmentMonths) || 0);
  const totalMonths = Math.max(1, Math.round(years * 12 + months));
  const totalYears = totalMonths / 12;

  const baseContrib = Math.max(0, Number(additionalContribution) || 0);
  const contribIntervalMonths = contributionFrequency === "annually" ? 12 : 1;

  const ear = calculateEffectiveAnnualRate(rNom, compoundFrequency);
  const rMonthly = Math.pow(1 + ear, 1 / 12) - 1;

  let balance = principal;
  let cumContrib = 0;

  const yearlySchedule = [];
  let yearStartBal = balance;
  let yearContribTotal = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const isContribMonth = (m - 1) % contribIntervalMonths === 0;

    // Start of period contribution
    if (isContribMonth && contributionTiming === "start") {
      balance += baseContrib;
      cumContrib += baseContrib;
      yearContribTotal += baseContrib;
    }

    // Apply monthly compound interest
    const monthInterest = balance * rMonthly;
    balance += monthInterest;

    // End of period contribution
    if (isContribMonth && contributionTiming === "end") {
      balance += baseContrib;
      cumContrib += baseContrib;
      yearContribTotal += baseContrib;
    }

    // Yearly schedule rollup
    if (m % 12 === 0 || m === totalMonths) {
      const yearNum = Math.ceil(m / 12);
      const totalDepositsToDate = principal + cumContrib;
      const totalInterestToDate = Math.max(0, balance - totalDepositsToDate);

      yearlySchedule.push({
        year: yearNum,
        startBalance: yearStartBal,
        yearContribTotal,
        totalDepositsToDate,
        totalInterestToDate,
        endingBalance: balance,
      });

      yearStartBal = balance;
      yearContribTotal = 0;
    }
  }

  const totalDeposits = principal + cumContrib;
  const totalInterestEarned = Math.max(0, balance - totalDeposits);

  return {
    initialInvestment: principal,
    totalContributions: cumContrib,
    totalDeposits,
    totalInterestEarned,
    futureValue: balance,
    totalYears,
    earPercent: (ear * 100).toFixed(2),
    ruleOf72Years: calculateRuleOf72(interestRate),
    principalPercent: totalDeposits > 0 ? Math.round((principal / balance) * 100) : 0,
    contribPercent: totalDeposits > 0 ? Math.round((cumContrib / balance) * 100) : 0,
    interestPercent: Math.max(0, 100 - Math.round((totalDeposits / balance) * 100)),
    yearlySchedule,
  };
}

