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
