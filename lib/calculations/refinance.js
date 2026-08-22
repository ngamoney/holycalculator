/**
 * Pure calculation logic for Mortgage & Loan Refinance Calculator.
 * Calculates side-by-side comparison, monthly savings, breakeven period (months),
 * total closing costs, and lifetime interest differential.
 */

export function calculateRefinance({
  remainingBalance = 250000,
  currentTermRemainingYears = 25,
  currentInterestRate = 7.0,
  newTermYears = 20,
  newInterestRate = 5.75,
  points = 1.0, // % of loan
  closingCosts = 3000,
  cashOut = 0,
  rollCostsIntoLoan = false,
}) {
  const currentBal = Math.max(0, Number(remainingBalance) || 0);
  const currentYears = Math.max(1, Number(currentTermRemainingYears) || 1);
  const currentMonths = currentYears * 12;
  const currentRate = Math.max(0, Number(currentInterestRate) || 0);
  const currentMonthlyRate = currentRate / 100 / 12;

  const newYears = Math.max(1, Number(newTermYears) || 1);
  const newMonths = newYears * 12;
  const newRate = Math.max(0, Number(newInterestRate) || 0);
  const newMonthlyRate = newRate / 100 / 12;

  const pts = Math.max(0, Number(points) || 0) / 100;
  const fixedClosing = Math.max(0, Number(closingCosts) || 0);
  const cashOutAmount = Math.max(0, Number(cashOut) || 0);

  if (currentBal <= 0) {
    return {
      currentMonthlyPayment: 0,
      newMonthlyPayment: 0,
      monthlySavings: 0,
      totalClosingCosts: 0,
      breakevenMonths: 0,
      breakevenYearsFormatted: "0 mos",
      currentRemainingTotalPaid: 0,
      currentRemainingTotalInterest: 0,
      newTotalPaid: 0,
      newTotalInterest: 0,
      lifetimeSavings: 0,
      error: null,
    };
  }

  // Current loan remaining payment & interest
  let currentMonthlyPayment = 0;
  if (currentMonthlyRate === 0) {
    currentMonthlyPayment = currentBal / currentMonths;
  } else {
    const factor = Math.pow(1 + currentMonthlyRate, currentMonths);
    currentMonthlyPayment = (currentBal * currentMonthlyRate * factor) / (factor - 1);
  }
  const currentRemainingTotalPaid = currentMonthlyPayment * currentMonths;
  const currentRemainingTotalInterest = currentRemainingTotalPaid - currentBal;

  // New loan balance calculation
  let baseNewPrincipal = currentBal + cashOutAmount;
  const pointsCost = baseNewPrincipal * pts;
  const totalClosingCosts = fixedClosing + pointsCost;

  let newLoanPrincipal = baseNewPrincipal;
  if (rollCostsIntoLoan) {
    newLoanPrincipal += totalClosingCosts;
  }

  let newMonthlyPayment = 0;
  if (newMonthlyRate === 0) {
    newMonthlyPayment = newLoanPrincipal / newMonths;
  } else {
    const factor = Math.pow(1 + newMonthlyRate, newMonths);
    newMonthlyPayment = (newLoanPrincipal * newMonthlyRate * factor) / (factor - 1);
  }

  const newTotalPaid = newMonthlyPayment * newMonths + (rollCostsIntoLoan ? 0 : totalClosingCosts);
  const newTotalInterest = newMonthlyPayment * newMonths - newLoanPrincipal;

  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  const lifetimeSavings = (currentRemainingTotalPaid + cashOutAmount) - newTotalPaid;

  // Calculate Breakeven
  let breakevenMonths = 0;
  if (monthlySavings > 0) {
    breakevenMonths = Math.ceil(totalClosingCosts / monthlySavings);
  } else {
    breakevenMonths = Infinity;
  }

  const bYrs = Math.floor(breakevenMonths / 12);
  const bMos = breakevenMonths % 12;
  const breakevenYearsFormatted =
    breakevenMonths === Infinity
      ? "No Breakeven (Monthly Payment Increases)"
      : `${bYrs > 0 ? `${bYrs} yr${bYrs > 1 ? "s" : ""}` : ""} ${bMos > 0 ? `${bMos} mo${bMos > 1 ? "s" : ""}` : ""}`.trim() || "0 mos";

  return {
    currentMonthlyPayment,
    newMonthlyPayment,
    monthlySavings,
    totalClosingCosts,
    pointsCost,
    newLoanPrincipal,
    breakevenMonths,
    breakevenYearsFormatted,
    currentRemainingTotalPaid,
    currentRemainingTotalInterest,
    newTotalPaid,
    newTotalInterest,
    lifetimeSavings,
    error: null,
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
