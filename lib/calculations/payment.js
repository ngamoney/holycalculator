/**
 * Pure calculation logic for Payment Calculator.
 * Supports:
 * 1. Fixed Term: Solves for monthly payment given loan amount, term in years/months, and interest rate.
 * 2. Fixed Payment: Solves for payoff time (months & years) given loan amount, monthly payment, and interest rate.
 */

export function calculatePayment({
  mode = "fixed-term", // 'fixed-term' | 'fixed-payment'
  loanAmount = 200000,
  termYears = 15,
  termMonths = 0,
  monthlyPaymentInput = 2000,
  interestRate = 6.0,
}) {
  const principal = Math.max(0, Number(loanAmount) || 0);
  const annualRate = Math.max(0, Number(interestRate) || 0);
  const monthlyRate = annualRate / 100 / 12;

  if (principal <= 0) {
    return {
      mode,
      monthlyPayment: 0,
      totalPayments: 0,
      totalInterest: 0,
      totalMonths: 0,
      yearsFormatted: "0 yrs",
      principal,
      schedule: [],
      yearlySchedule: [],
      error: null,
    };
  }

  if (mode === "fixed-term") {
    const totalMonths = Math.max(1, (Number(termYears) || 0) * 12 + (Number(termMonths) || 0));
    let monthlyPayment = 0;

    if (monthlyRate === 0) {
      monthlyPayment = principal / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
    }

    const totalPayments = monthlyPayment * totalMonths;
    const totalInterest = totalPayments - principal;

    const { schedule, yearlySchedule } = generateAmortizationSchedule(
      principal,
      monthlyRate,
      monthlyPayment,
      totalMonths
    );

    return {
      mode,
      monthlyPayment,
      totalPayments,
      totalInterest,
      totalMonths,
      yearsFormatted: `${Math.floor(totalMonths / 12)} yrs ${totalMonths % 12 ? (totalMonths % 12) + " mos" : ""}`.trim(),
      principal,
      schedule,
      yearlySchedule,
      error: null,
    };
  } else {
    // Fixed Payment mode - solve for term n
    const fixedPayment = Math.max(0, Number(monthlyPaymentInput) || 0);
    const minInterestFirstMonth = principal * monthlyRate;

    if (fixedPayment <= minInterestFirstMonth && monthlyRate > 0) {
      return {
        mode,
        monthlyPayment: fixedPayment,
        totalPayments: 0,
        totalInterest: 0,
        totalMonths: Infinity,
        yearsFormatted: "Never (Payment too low)",
        principal,
        schedule: [],
        yearlySchedule: [],
        error: `Monthly payment must be greater than monthly interest ($${minInterestFirstMonth.toFixed(2)}) to pay down principal.`,
      };
    }

    let totalMonths = 0;
    if (monthlyRate === 0) {
      totalMonths = Math.ceil(principal / fixedPayment);
    } else {
      totalMonths = Math.ceil(
        -Math.log(1 - (principal * monthlyRate) / fixedPayment) / Math.log(1 + monthlyRate)
      );
    }

    const { schedule, yearlySchedule, totalPaid, totalInterestPaid } = generateAmortizationSchedule(
      principal,
      monthlyRate,
      fixedPayment,
      totalMonths
    );

    const yrs = Math.floor(totalMonths / 12);
    const mos = totalMonths % 12;
    const yearsFormatted = `${yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}` : ""} ${mos > 0 ? `${mos} mo${mos > 1 ? "s" : ""}` : ""}`.trim() || "0 mos";

    return {
      mode,
      monthlyPayment: fixedPayment,
      totalPayments: totalPaid,
      totalInterest: totalInterestPaid,
      totalMonths,
      yearsFormatted,
      principal,
      schedule,
      yearlySchedule,
      error: null,
    };
  }
}

function generateAmortizationSchedule(principal, monthlyRate, payment, maxMonths) {
  const schedule = [];
  const yearlySchedule = [];
  let balance = principal;
  let totalInterestPaid = 0;
  let totalPaid = 0;

  let currYear = 1;
  let yearPrincipal = 0;
  let yearInterest = 0;

  for (let month = 1; month <= maxMonths && balance > 0.001; month++) {
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

    totalInterestPaid += interest;
    totalPaid += actualPayment;
    yearPrincipal += principalPaid;
    yearInterest += interest;

    schedule.push({
      month,
      payment: actualPayment,
      principal: principalPaid,
      interest,
      totalInterest: totalInterestPaid,
      balance: Math.max(0, balance),
    });

    if (month % 12 === 0 || balance <= 0.001 || month === maxMonths) {
      yearlySchedule.push({
        year: currYear,
        principal: yearPrincipal,
        interest: yearInterest,
        totalInterest: totalInterestPaid,
        endingBalance: Math.max(0, balance),
      });
      currYear++;
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  return {
    schedule,
    yearlySchedule,
    totalPaid,
    totalInterestPaid,
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
