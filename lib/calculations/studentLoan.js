/**
 * Pure calculation logic for Student Loan Calculator.
 * Supports:
 * - Standard fixed repayment plans (10, 15, 20, 25 years)
 * - Extra monthly payment acceleration and interest savings
 * - Graduated repayment estimation (payments step up every 24 months)
 */

export function calculateStudentLoan({
  balance = 30000,
  termYears = 10,
  interestRate = 6.8,
  extraMonthly = 0,
  planType = "standard", // 'standard' | 'graduated'
}) {
  const principal = Math.max(0, Number(balance) || 0);
  const annualRate = Math.max(0, Number(interestRate) || 0);
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = Math.max(1, (Number(termYears) || 10) * 12);
  const extra = Math.max(0, Number(extraMonthly) || 0);

  if (principal <= 0) {
    return {
      monthlyPayment: 0,
      totalPaid: 0,
      totalInterest: 0,
      originalTotalPaid: 0,
      originalTotalInterest: 0,
      interestSaved: 0,
      monthsSaved: 0,
      payoffTimeFormatted: "0 months",
      principal: 0,
      schedule: [],
      error: null,
    };
  }

  // Standard fixed payment formula
  let basePayment = 0;
  if (monthlyRate === 0) {
    basePayment = principal / totalMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    basePayment = (principal * monthlyRate * factor) / (factor - 1);
  }

  const originalTotalPaid = basePayment * totalMonths;
  const originalTotalInterest = originalTotalPaid - principal;

  // Run repayment schedule with extra payments
  const schedule = [];
  let currentBalance = principal;
  let totalPaid = 0;
  let totalInterest = 0;
  let month = 0;
  const maxLimit = 600;

  // For graduated plans: payments start at ~60% of standard and increase every 24 months
  let graduatedStepMultiplier = 0.6;

  while (currentBalance > 0.001 && month < maxLimit) {
    month++;
    const interest = currentBalance * monthlyRate;

    let targetBase = basePayment;
    if (planType === "graduated") {
      // Step up every 2 years
      const stepIndex = Math.floor((month - 1) / 24);
      graduatedStepMultiplier = Math.min(1.4, 0.6 + stepIndex * 0.18);
      targetBase = basePayment * graduatedStepMultiplier;
    }

    let actualPayment = targetBase + extra;
    let principalPaid = actualPayment - interest;

    if (currentBalance + interest <= actualPayment) {
      actualPayment = currentBalance + interest;
      principalPaid = currentBalance;
      currentBalance = 0;
    } else {
      currentBalance -= principalPaid;
    }

    totalInterest += interest;
    totalPaid += actualPayment;

    schedule.push({
      month,
      payment: actualPayment,
      principal: principalPaid,
      interest,
      totalInterest,
      balance: Math.max(0, currentBalance),
    });
  }

  const finalMonths = schedule.length;
  const monthsSaved = Math.max(0, totalMonths - finalMonths);
  const interestSaved = Math.max(0, originalTotalInterest - totalInterest);

  const yrs = Math.floor(finalMonths / 12);
  const mos = finalMonths % 12;
  const payoffTimeFormatted = `${yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}` : ""} ${mos > 0 ? `${mos} mo${mos > 1 ? "s" : ""}` : ""}`.trim() || "0 mos";

  return {
    monthlyPayment: planType === "graduated" ? schedule[0]?.payment || basePayment : basePayment,
    totalPaid,
    totalInterest,
    originalTotalPaid,
    originalTotalInterest,
    interestSaved,
    monthsSaved,
    totalMonths: finalMonths,
    originalMonths: totalMonths,
    payoffTimeFormatted,
    principal,
    schedule,
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
