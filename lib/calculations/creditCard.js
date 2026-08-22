/**
 * Pure calculation logic for Credit Card Calculator.
 * Supports:
 * 1. Fixed Payment mode: Solves payoff timeline and interest given monthly payment.
 * 2. Fixed Timeframe mode: Solves required monthly payment given target months.
 * 3. Minimum Payment comparison: Simulates standard card issuer minimum payment rules (max(Interest + 1% balance, $25)).
 */

export function calculateCreditCard({
  mode = "fixed-payment", // 'fixed-payment' | 'fixed-time'
  balance = 8000,
  interestRate = 18.0,
  monthlyPayment = 200,
  targetYears = 2,
  targetMonths = 0,
}) {
  const currentBalance = Math.max(0, Number(balance) || 0);
  const apr = Math.max(0, Number(interestRate) || 0);
  const monthlyRate = apr / 100 / 12;

  if (currentBalance <= 0) {
    return {
      monthlyPayment: 0,
      totalPaid: 0,
      totalInterest: 0,
      totalMonths: 0,
      timeFormatted: "0 months",
      principal: 0,
      minPaymentComparison: null,
      schedule: [],
      error: null,
    };
  }

  // Minimum payment simulation for comparison
  const minPaymentSim = simulateMinimumPayment(currentBalance, monthlyRate);

  if (mode === "fixed-payment") {
    const pmt = Math.max(0, Number(monthlyPayment) || 0);
    const minInterestFirstMonth = currentBalance * monthlyRate;

    if (pmt <= minInterestFirstMonth && monthlyRate > 0) {
      return {
        monthlyPayment: pmt,
        totalPaid: 0,
        totalInterest: 0,
        totalMonths: Infinity,
        timeFormatted: "Never (Payment too low)",
        principal: currentBalance,
        minPaymentComparison: minPaymentSim,
        schedule: [],
        error: `Monthly payment must exceed monthly interest ($${minInterestFirstMonth.toFixed(2)}) to reduce balance.`,
      };
    }

    const { schedule, totalPaid, totalInterest, totalMonths } = simulateFixedPayment(
      currentBalance,
      monthlyRate,
      pmt
    );

    const yrs = Math.floor(totalMonths / 12);
    const mos = totalMonths % 12;
    const timeFormatted = `${yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}` : ""} ${mos > 0 ? `${mos} mo${mos > 1 ? "s" : ""}` : ""}`.trim() || "0 mos";

    return {
      mode,
      monthlyPayment: pmt,
      totalPaid,
      totalInterest,
      totalMonths,
      timeFormatted,
      principal: currentBalance,
      minPaymentComparison: minPaymentSim,
      schedule,
      error: null,
    };
  } else {
    // Fixed Timeframe mode
    const totalTargetMonths = Math.max(1, (Number(targetYears) || 0) * 12 + (Number(targetMonths) || 0));
    let requiredMonthly = 0;

    if (monthlyRate === 0) {
      requiredMonthly = currentBalance / totalTargetMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalTargetMonths);
      requiredMonthly = (currentBalance * monthlyRate * factor) / (factor - 1);
    }

    const { schedule, totalPaid, totalInterest } = simulateFixedPayment(
      currentBalance,
      monthlyRate,
      requiredMonthly
    );

    const yrs = Math.floor(totalTargetMonths / 12);
    const mos = totalTargetMonths % 12;
    const timeFormatted = `${yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}` : ""} ${mos > 0 ? `${mos} mo${mos > 1 ? "s" : ""}` : ""}`.trim() || "0 mos";

    return {
      mode,
      monthlyPayment: requiredMonthly,
      totalPaid,
      totalInterest,
      totalMonths: totalTargetMonths,
      timeFormatted,
      principal: currentBalance,
      minPaymentComparison: minPaymentSim,
      schedule,
      error: null,
    };
  }
}

function simulateFixedPayment(initialBalance, monthlyRate, payment) {
  const schedule = [];
  let balance = initialBalance;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  const maxLimit = 600; // 50 years safeguard

  while (balance > 0.001 && month < maxLimit) {
    month++;
    const interest = balance * monthlyRate;
    let actualPayment = payment;
    let principalPaid = actualPayment - interest;

    if (balance + interest <= actualPayment) {
      actualPayment = balance + interest;
      principalPaid = balance;
      balance = 0;
    } else {
      balance -= principalPaid;
    }

    totalInterest += interest;
    totalPaid += actualPayment;

    schedule.push({
      month,
      payment: actualPayment,
      principal: principalPaid,
      interest,
      totalInterest,
      balance: Math.max(0, balance),
    });
  }

  return {
    schedule,
    totalPaid,
    totalInterest,
    totalMonths: month,
  };
}

function simulateMinimumPayment(initialBalance, monthlyRate) {
  let balance = initialBalance;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  const maxLimit = 600;

  while (balance > 0.001 && month < maxLimit) {
    month++;
    const interest = balance * monthlyRate;
    // Standard credit card rule: max(interest + 1% balance, $25 minimum)
    let minPayment = Math.max(interest + balance * 0.01, 25);

    let actualPayment = minPayment;
    let principalPaid = actualPayment - interest;

    if (balance + interest <= actualPayment) {
      actualPayment = balance + interest;
      principalPaid = balance;
      balance = 0;
    } else {
      balance -= principalPaid;
    }

    totalInterest += interest;
    totalPaid += actualPayment;
  }

  const yrs = Math.floor(month / 12);
  const mos = month % 12;

  return {
    totalMonths: month,
    timeFormatted: `${yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}` : ""} ${mos > 0 ? `${mos} mo${mos > 1 ? "s" : ""}` : ""}`.trim(),
    totalInterest,
    totalPaid,
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
