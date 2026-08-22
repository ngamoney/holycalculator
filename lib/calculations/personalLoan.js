/**
 * Pure calculation logic for Personal Loan Calculator.
 * Computes monthly payment, total interest, and solves for Effective APR
 * considering upfront or deducted origination fees and ongoing insurance/fees.
 */

export function calculatePersonalLoan({
  loanAmount = 20000,
  termYears = 5,
  termMonths = 0,
  interestRate = 10.0,
  originationFeeValue = 3.0,
  originationFeeType = "percent", // 'percent' | 'amount'
  originationPaidBy = "deducted", // 'deducted' | 'upfront'
  monthlyFee = 0,
}) {
  const principal = Math.max(0, Number(loanAmount) || 0);
  const nominalRate = Math.max(0, Number(interestRate) || 0);
  const monthlyRate = nominalRate / 100 / 12;
  const totalMonths = Math.max(1, (Number(termYears) || 0) * 12 + (Number(termMonths) || 0));
  const feePerMonth = Math.max(0, Number(monthlyFee) || 0);

  if (principal <= 0) {
    return {
      monthlyPayment: 0,
      baseMonthlyPayment: 0,
      totalPaid: 0,
      totalInterest: 0,
      totalFees: 0,
      netLoanReceived: 0,
      originationFeeAmount: 0,
      effectiveApr: 0,
      schedule: [],
      error: null,
    };
  }

  // Calculate origination fee
  const origVal = Math.max(0, Number(originationFeeValue) || 0);
  const originationFeeAmount =
    originationFeeType === "percent" ? (principal * origVal) / 100 : origVal;

  const netLoanReceived =
    originationPaidBy === "deducted" ? Math.max(0, principal - originationFeeAmount) : principal;

  // Base monthly payment (Principal & Interest)
  let baseMonthlyPayment = 0;
  if (monthlyRate === 0) {
    baseMonthlyPayment = principal / totalMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    baseMonthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalMonthlyPayment = baseMonthlyPayment + feePerMonth;
  const totalInterest = baseMonthlyPayment * totalMonths - principal;
  const totalFees = originationFeeAmount + feePerMonth * totalMonths;
  const totalPaid = principal + totalInterest + totalFees;

  // Solve for true Effective APR (Internal Rate of Return / Newton-Raphson method)
  const effectiveApr = solveEffectiveApr(netLoanReceived, totalMonthlyPayment, totalMonths, nominalRate);

  // Generate Amortization Schedule
  const schedule = [];
  let balance = principal;
  let cumInterest = 0;

  for (let m = 1; m <= totalMonths && balance > 0.001; m++) {
    const interest = balance * monthlyRate;
    let principalPaid = baseMonthlyPayment - interest;

    if (balance + interest <= baseMonthlyPayment) {
      principalPaid = balance;
      balance = 0;
    } else {
      balance -= principalPaid;
    }

    cumInterest += interest;

    schedule.push({
      month: m,
      payment: totalMonthlyPayment,
      principal: principalPaid,
      interest,
      fees: feePerMonth,
      totalInterest: cumInterest,
      balance: Math.max(0, balance),
    });
  }

  return {
    monthlyPayment: totalMonthlyPayment,
    baseMonthlyPayment,
    totalPaid,
    totalInterest,
    totalFees,
    netLoanReceived,
    originationFeeAmount,
    effectiveApr: Math.round(effectiveApr * 100) / 100,
    schedule,
    error: null,
  };
}

function solveEffectiveApr(netProceeds, monthlyPayment, months, initialGuessApr) {
  if (netProceeds <= 0 || monthlyPayment <= 0 || months <= 0) return initialGuessApr;

  // If no fees deducted and no monthly fee, APR equals nominal rate
  if (Math.abs(netProceeds * (initialGuessApr / 100 / 12) - monthlyPayment) < 0.0001) {
    return initialGuessApr;
  }

  let rate = Math.max(0.001, initialGuessApr / 100 / 12);
  const maxIterations = 50;
  const tolerance = 1e-7;

  for (let i = 0; i < maxIterations; i++) {
    const factor = Math.pow(1 + rate, months);
    // f(rate) = Present Value of Annuity - Net Proceeds
    // PV = monthlyPayment * (1 - (1+rate)^-months) / rate
    const pv = (monthlyPayment * (1 - Math.pow(1 + rate, -months))) / rate;
    const diff = pv - netProceeds;

    if (Math.abs(diff) < tolerance) {
      return rate * 12 * 100;
    }

    // Derivative f'(rate)
    const dPv =
      (monthlyPayment *
        (months * rate * Math.pow(1 + rate, -months - 1) - (1 - Math.pow(1 + rate, -months)))) /
      (rate * rate);

    if (Math.abs(dPv) < 1e-12) break;
    rate = rate - diff / dPv;
    if (rate <= 0) rate = 0.0001;
  }

  return rate * 12 * 100;
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
