/**
 * Pure calculation logic for Amortization Calculator.
 * Computes standard fixed-rate loan amortization, monthly payments,
 * plus the impact of extra monthly, annual, or one-time principal payments.
 */

export function calculateAmortization({
  loanAmount = 200000,
  termYears = 15,
  termMonths = 0,
  interestRate = 6.0,
  extraMonthly = 0,
  extraAnnual = 0,
  extraOneTime = 0,
  startMonth = 1, // 1 - 12
  startYear = new Date().getFullYear(),
}) {
  const principal = Math.max(0, Number(loanAmount) || 0);
  const annualRate = Math.max(0, Number(interestRate) || 0);
  const monthlyRate = annualRate / 100 / 12;
  const totalOriginalMonths = Math.max(1, (Number(termYears) || 0) * 12 + (Number(termMonths) || 0));

  const exMonthly = Math.max(0, Number(extraMonthly) || 0);
  const exAnnual = Math.max(0, Number(extraAnnual) || 0);
  const exOneTime = Math.max(0, Number(extraOneTime) || 0);

  if (principal <= 0) {
    return {
      monthlyPayment: 0,
      totalPayments: 0,
      totalInterest: 0,
      originalTotalPayments: 0,
      originalTotalInterest: 0,
      interestSaved: 0,
      monthsSaved: 0,
      totalMonths: 0,
      originalMonths: totalOriginalMonths,
      payoffDateFormatted: "N/A",
      schedule: [],
      yearlySchedule: [],
      error: null,
    };
  }

  // Base monthly payment without extra payments
  let baseMonthlyPayment = 0;
  if (monthlyRate === 0) {
    baseMonthlyPayment = principal / totalOriginalMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalOriginalMonths);
    baseMonthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
  }

  const originalTotalPayments = baseMonthlyPayment * totalOriginalMonths;
  const originalTotalInterest = originalTotalPayments - principal;

  // Run schedule with extra payments
  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  const schedule = [];
  const yearlySchedule = [];

  let curM = startMonth;
  let curY = startYear;
  let yearPrincipal = 0;
  let yearInterest = 0;
  let yearExtra = 0;

  for (let m = 1; m <= totalOriginalMonths && balance > 0.001; m++) {
    const interest = balance * monthlyRate;
    let extra = exMonthly;

    // Apply annual extra payment every 12 months (e.g. December or month 12 of each year)
    if (m % 12 === 0) {
      extra += exAnnual;
    }
    // Apply one-time extra payment in first month
    if (m === 1) {
      extra += exOneTime;
    }

    let standardPayment = baseMonthlyPayment;
    let principalPaid = standardPayment - interest;
    let actualPayment = standardPayment + extra;

    if (balance + interest <= actualPayment) {
      actualPayment = balance + interest;
      principalPaid = balance;
      extra = Math.max(0, actualPayment - standardPayment);
      balance = 0;
    } else {
      principalPaid += extra;
      balance -= principalPaid;
    }

    totalInterest += interest;
    totalPaid += actualPayment;

    yearPrincipal += principalPaid;
    yearInterest += interest;
    yearExtra += extra;

    const monthName = new Date(curY, curM - 1, 1).toLocaleString("en-US", { month: "short" });

    schedule.push({
      monthIndex: m,
      monthLabel: `${monthName} ${curY}`,
      payment: actualPayment,
      principal: principalPaid,
      interest,
      extra,
      totalInterest,
      balance: Math.max(0, balance),
    });

    if (m % 12 === 0 || balance <= 0.001 || m === totalOriginalMonths) {
      yearlySchedule.push({
        year: yearlySchedule.length + 1,
        calendarYear: curY,
        principal: yearPrincipal,
        interest: yearInterest,
        extra: yearExtra,
        totalInterest,
        endingBalance: Math.max(0, balance),
      });
      yearPrincipal = 0;
      yearInterest = 0;
      yearExtra = 0;
    }

    curM++;
    if (curM > 12) {
      curM = 1;
      curY++;
    }
  }

  const finalMonths = schedule.length;
  const monthsSaved = Math.max(0, totalOriginalMonths - finalMonths);
  const interestSaved = Math.max(0, originalTotalInterest - totalInterest);

  const lastEntry = schedule[schedule.length - 1];
  const payoffDateFormatted = lastEntry ? lastEntry.monthLabel : "N/A";

  return {
    monthlyPayment: baseMonthlyPayment,
    totalPayments: totalPaid,
    totalInterest,
    originalTotalPayments,
    originalTotalInterest,
    interestSaved,
    monthsSaved,
    totalMonths: finalMonths,
    originalMonths: totalOriginalMonths,
    payoffDateFormatted,
    principal,
    schedule,
    yearlySchedule,
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
