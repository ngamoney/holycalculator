/**
 * Pure JavaScript calculation routines for Mortgage & Home Loan Amortization.
 * Supports Conventional, FHA, VA, and USDA loan types, PMI LTV cancellation tracking,
 * extra payments, biweekly comparison, and annual/monthly amortization schedules.
 */

// Helper to format currency for displays
export function formatCurrency(num) {
  if (num === null || num === undefined || isNaN(num)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

// Helper to format currency with cents if needed
export function formatCurrencyCents(num) {
  if (num === null || num === undefined || isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// Helper to add months to a YYYY-MM date string
export function addMonthsToDate(startDateStr, monthOffset) {
  let date = new Date();
  if (startDateStr && startDateStr.includes("-")) {
    const parts = startDateStr.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    date = new Date(year, month, 1);
  } else {
    date.setDate(1);
  }

  date.setMonth(date.getMonth() + monthOffset);

  const y = date.getFullYear();
  const m = date.toLocaleDateString("en-US", { month: "short" });
  return {
    formattedMonthYear: `${m} ${y}`,
    year: y,
    monthNum: date.getMonth() + 1,
  };
}

/**
 * Main Mortgage Calculation Routine
 */
export function calculateMortgage(inputs) {
  const {
    homePrice = 400000,
    downPaymentValue = 20,
    downPaymentType = "percent", // 'percent' | 'amount'
    loanTermYears = 30,
    interestRate = 6.5,
    startDate = "2026-09",
    loanType = "conventional", // 'conventional' | 'fha' | 'va' | 'usda'
    propertyTaxValue = 1.2,
    propertyTaxType = "percent", // 'percent' | 'amount'
    homeInsurance = 1500, // annual $
    pmiRate = 0.5, // annual %
    hoaFee = 0, // monthly $
    otherCosts = 0, // monthly $
    extraMonthly = 0,
    extraYearly = 0,
    extraOneTimeAmount = 0,
    extraOneTimeMonth = 1,
  } = inputs;

  const price = Math.max(1, Number(homePrice) || 0);

  // Down Payment
  let downPaymentAmount = 0;
  let downPaymentPercent = 0;
  if (downPaymentType === "percent") {
    downPaymentPercent = Math.max(0, Math.min(100, Number(downPaymentValue) || 0));
    downPaymentAmount = price * (downPaymentPercent / 100);
  } else {
    downPaymentAmount = Math.max(0, Math.min(price, Number(downPaymentValue) || 0));
    downPaymentPercent = (downPaymentAmount / price) * 100;
  }

  const loanAmount = Math.max(0, price - downPaymentAmount);
  const termYears = Math.max(1, Math.min(50, Number(loanTermYears) || 30));
  const numPayments = termYears * 12;
  const annualRate = Math.max(0, Number(interestRate) || 0);
  const monthlyRate = annualRate / 100 / 12;

  // Monthly Principal & Interest (P&I)
  let monthlyPI = 0;
  if (loanAmount > 0) {
    if (monthlyRate > 0) {
      monthlyPI =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPI = loanAmount / numPayments;
    }
  }

  // Monthly Property Tax
  let monthlyTax = 0;
  const taxVal = Number(propertyTaxValue) || 0;
  if (propertyTaxType === "percent") {
    monthlyTax = (price * (taxVal / 100)) / 12;
  } else {
    monthlyTax = taxVal / 12;
  }

  // Monthly Home Insurance
  const monthlyInsurance = (Number(homeInsurance) || 0) / 12;

  // Initial Monthly PMI / MIP
  let initialMonthlyPMI = 0;
  const pmiAnnualRate = Number(pmiRate) || 0.5;

  if (loanType === "va") {
    // VA loans do not require monthly PMI
    initialMonthlyPMI = 0;
  } else if (loanType === "conventional") {
    // Conventional PMI required if down payment < 20%
    if (downPaymentPercent < 20 && loanAmount > 0) {
      initialMonthlyPMI = (loanAmount * (pmiAnnualRate / 100)) / 12;
    } else {
      initialMonthlyPMI = 0;
    }
  } else if (loanType === "fha") {
    // FHA annual MIP (~0.55% - 0.85%)
    initialMonthlyPMI = (loanAmount * (pmiAnnualRate / 100)) / 12;
  } else if (loanType === "usda") {
    // USDA annual guarantee fee (~0.35%)
    initialMonthlyPMI = (loanAmount * (pmiAnnualRate / 100)) / 12;
  }

  const monthlyHOA = Number(hoaFee) || 0;
  const monthlyOther = Number(otherCosts) || 0;

  const totalInitialMonthlyOutofPocket =
    monthlyPI + monthlyTax + monthlyInsurance + initialMonthlyPMI + monthlyHOA + monthlyOther;

  // Amortization Schedule Generation
  const scheduleData = generateAmortizationSchedule({
    price,
    loanAmount,
    monthlyRate,
    monthlyPI,
    numPayments,
    startDate,
    loanType,
    downPaymentPercent,
    pmiAnnualRate,
    monthlyTax,
    monthlyInsurance,
    monthlyHOA,
    monthlyOther,
    extraMonthly: Number(extraMonthly) || 0,
    extraYearly: Number(extraYearly) || 0,
    extraOneTimeAmount: Number(extraOneTimeAmount) || 0,
    extraOneTimeMonth: Number(extraOneTimeMonth) || 1,
  });

  // Biweekly Payment Comparison
  const biweeklyData = calculateBiweeklyComparison({
    loanAmount,
    monthlyRate,
    monthlyPI,
    numPayments,
  });

  const endMonthInfo = addMonthsToDate(startDate, scheduleData.totalActualMonths - 1);

  return {
    homePrice: price,
    downPaymentAmount,
    downPaymentPercent,
    loanAmount,
    loanTermYears: termYears,
    interestRate: annualRate,
    startDate,
    loanType,
    monthlyPI,
    monthlyTax,
    monthlyInsurance,
    initialMonthlyPMI,
    monthlyHOA,
    monthlyOther,
    totalInitialMonthlyOutofPocket,
    totalMortgagePayments: scheduleData.totalMortgagePayments,
    totalInterestPaid: scheduleData.totalInterestPaid,
    totalPmiPaid: scheduleData.totalPmiPaid,
    totalOutofPocketPaid: scheduleData.totalOutofPocketPaid,
    pmiCancelMonth: scheduleData.pmiCancelMonth,
    pmiCancelDate: scheduleData.pmiCancelDate,
    payoffDate: endMonthInfo.formattedMonthYear,
    totalActualMonths: scheduleData.totalActualMonths,
    totalActualYears: (scheduleData.totalActualMonths / 12).toFixed(1),
    monthlySchedule: scheduleData.monthlySchedule,
    yearlySchedule: scheduleData.yearlySchedule,
    biweekly: biweeklyData,
    breakdownChartData: [
      { label: "Principal & Interest", value: Math.round(monthlyPI), color: "#3B3564" },
      { label: "Property Tax", value: Math.round(monthlyTax), color: "#C9992F" },
      { label: "Home Insurance", value: Math.round(monthlyInsurance), color: "#4F7A5B" },
      { label: "PMI / MIP", value: Math.round(initialMonthlyPMI), color: "#9C7420" },
      { label: "HOA & Other", value: Math.round(monthlyHOA + monthlyOther), color: "#5C5F6B" },
    ].filter((item) => item.value > 0),
  };
}

/**
 * Generates Month-by-Month Amortization Schedule & Annual Summaries
 */
function generateAmortizationSchedule(params) {
  const {
    price,
    loanAmount,
    monthlyRate,
    monthlyPI,
    numPayments,
    startDate,
    loanType,
    downPaymentPercent,
    pmiAnnualRate,
    monthlyTax,
    monthlyInsurance,
    monthlyHOA,
    monthlyOther,
    extraMonthly,
    extraYearly,
    extraOneTimeAmount,
    extraOneTimeMonth,
  } = params;

  const monthlySchedule = [];
  const yearlySchedule = [];

  let balance = loanAmount;
  let totalInterestPaid = 0;
  let totalPmiPaid = 0;
  let totalMortgagePayments = 0;
  let totalOutofPocketPaid = 0;
  let pmiCancelMonth = null;
  let pmiCancelDate = null;

  let currentYearInterest = 0;
  let currentYearPrincipal = 0;
  let currentYearPmi = 0;
  let currentYearOutofPocket = 0;
  let currentYearStartMonth = 1;

  let month = 1;
  const maxMonths = numPayments * 2; // safety cap

  while (balance > 0.01 && month <= maxMonths) {
    const startBalance = balance;
    const dateInfo = addMonthsToDate(startDate, month - 1);

    // Interest & Scheduled Principal
    const interestPayment = monthlyRate > 0 ? startBalance * monthlyRate : 0;
    let scheduledPrincipal = Math.min(startBalance, monthlyPI - interestPayment);
    if (scheduledPrincipal < 0) scheduledPrincipal = 0;

    // Extra Principal Calculations
    let extraPrincipal = 0;
    if (extraMonthly > 0) {
      extraPrincipal += extraMonthly;
    }
    if (extraYearly > 0 && month % 12 === 0) {
      extraPrincipal += extraYearly;
    }
    if (extraOneTimeAmount > 0 && month === extraOneTimeMonth) {
      extraPrincipal += extraOneTimeAmount;
    }

    // Limit extra principal so balance doesn't go below 0
    let totalPrincipalPayment = Math.min(startBalance, scheduledPrincipal + extraPrincipal);
    if (totalPrincipalPayment < 0) totalPrincipalPayment = 0;

    const endingBalance = Math.max(0, startBalance - totalPrincipalPayment);

    // PMI LTV Cancellation Tracking
    // LTV threshold for Conventional loans is 80% (or balance <= 0.80 * homePrice)
    let pmiThisMonth = 0;
    const currentLTV = (endingBalance / price) * 100;

    if (loanType === "va") {
      pmiThisMonth = 0;
    } else if (loanType === "conventional") {
      if (downPaymentPercent < 20) {
        if (currentLTV > 80) {
          pmiThisMonth = (loanAmount * (pmiAnnualRate / 100)) / 12;
        } else {
          pmiThisMonth = 0;
          if (!pmiCancelMonth) {
            pmiCancelMonth = month;
            pmiCancelDate = dateInfo.formattedMonthYear;
          }
        }
      } else {
        pmiThisMonth = 0;
      }
    } else if (loanType === "fha" || loanType === "usda") {
      // Simplified MIP rule: charged throughout or for at least 11 years
      pmiThisMonth = (loanAmount * (pmiAnnualRate / 100)) / 12;
    }

    const outofPocketThisMonth =
      totalPrincipalPayment +
      interestPayment +
      monthlyTax +
      monthlyInsurance +
      pmiThisMonth +
      monthlyHOA +
      monthlyOther;

    totalInterestPaid += interestPayment;
    totalPmiPaid += pmiThisMonth;
    totalMortgagePayments += totalPrincipalPayment + interestPayment;
    totalOutofPocketPaid += outofPocketThisMonth;

    // Accumulate for yearly rollup
    currentYearInterest += interestPayment;
    currentYearPrincipal += totalPrincipalPayment;
    currentYearPmi += pmiThisMonth;
    currentYearOutofPocket += outofPocketThisMonth;

    monthlySchedule.push({
      monthIndex: month,
      date: dateInfo.formattedMonthYear,
      year: dateInfo.year,
      startBalance,
      interestPaid: interestPayment,
      principalPaid: totalPrincipalPayment,
      pmiPaid: pmiThisMonth,
      totalPaid: outofPocketThisMonth,
      endingBalance,
      ltv: currentLTV,
    });

    // Check if end of calendar year or end of loan
    if (month % 12 === 0 || endingBalance <= 0.01) {
      const yearNumber = Math.ceil(month / 12);
      const startInfo = addMonthsToDate(startDate, currentYearStartMonth - 1);
      const endInfo = dateInfo;

      yearlySchedule.push({
        yearNumber,
        dateRange: `${startInfo.formattedMonthYear} – ${endInfo.formattedMonthYear}`,
        interestPaid: currentYearInterest,
        principalPaid: currentYearPrincipal,
        pmiPaid: currentYearPmi,
        totalPaid: currentYearOutofPocket,
        endingBalance,
      });

      // Reset yearly accumulators
      currentYearInterest = 0;
      currentYearPrincipal = 0;
      currentYearPmi = 0;
      currentYearOutofPocket = 0;
      currentYearStartMonth = month + 1;
    }

    balance = endingBalance;
    month++;
  }

  return {
    totalActualMonths: monthlySchedule.length,
    totalInterestPaid,
    totalPmiPaid,
    totalMortgagePayments,
    totalOutofPocketPaid,
    pmiCancelMonth,
    pmiCancelDate,
    monthlySchedule,
    yearlySchedule,
  };
}

/**
 * Calculates Biweekly Payment Comparison Savings
 */
function calculateBiweeklyComparison(params) {
  const { loanAmount, monthlyRate, monthlyPI, numPayments } = params;

  if (loanAmount <= 0 || monthlyPI <= 0) {
    return {
      biweeklyPayment: 0,
      totalInterestBiweekly: 0,
      interestSaved: 0,
      monthsSaved: 0,
      yearsSaved: "0.0",
    };
  }

  const biweeklyPayment = monthlyPI / 2; // 26 payments/yr = 13 full monthly payments/yr
  const biweeklyRate = (monthlyRate * 12) / 26; // Biweekly interest rate

  let balance = loanAmount;
  let totalInterestBiweekly = 0;
  let biweeklyCount = 0;
  const maxBiweeklies = numPayments * 4;

  while (balance > 0.01 && biweeklyCount <= maxBiweeklies) {
    const interest = biweeklyRate > 0 ? balance * biweeklyRate : 0;
    const principal = Math.min(balance, biweeklyPayment - interest);
    totalInterestBiweekly += interest;
    balance = Math.max(0, balance - principal);
    biweeklyCount++;
  }

  const equivalentMonths = Math.ceil(biweeklyCount / 2.16667); // ~2.1667 biweeklies per month
  const standardInterest = (monthlyPI * numPayments) - loanAmount;
  const interestSaved = Math.max(0, standardInterest - totalInterestBiweekly);
  const monthsSaved = Math.max(0, numPayments - equivalentMonths);
  const yearsSaved = (monthsSaved / 12).toFixed(1);

  return {
    biweeklyPayment,
    totalInterestBiweekly,
    interestSaved,
    monthsSaved,
    yearsSaved,
  };
}
