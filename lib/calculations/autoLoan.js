/**
 * Pure JavaScript calculation routines for Auto & Vehicle Loan Amortization.
 * Supports down payment ($ or %), trade-in value, state sales tax, documentation/title fees,
 * and monthly & yearly amortization schedules.
 */

// Helper to format currency
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
 * Calculates complete Auto Loan breakdown and schedule
 */
export function calculateAutoLoan(inputs) {
  const {
    vehiclePrice = 35000,
    downPaymentValue = 10,
    downPaymentType = "percent", // 'percent' | 'amount'
    tradeInValue = 5000,
    loanTermMonths = 60,
    interestRate = 5.5, // APR %
    salesTaxRate = 6.5, // %
    dealerFees = 500,
    titleRegFees = 300,
    includeTaxInLoan = true,
  } = inputs;

  const price = Math.max(0, parseFloat(vehiclePrice) || 0);
  const tradeIn = Math.max(0, parseFloat(tradeInValue) || 0);
  const termMonths = Math.max(1, parseInt(loanTermMonths, 10) || 60);
  const rateAnnual = Math.max(0, parseFloat(interestRate) || 0);
  const taxRate = Math.max(0, parseFloat(salesTaxRate) || 0);
  const dFees = Math.max(0, parseFloat(dealerFees) || 0);
  const tFees = Math.max(0, parseFloat(titleRegFees) || 0);

  // Compute Down Payment
  let downAmount = 0;
  let downPercent = 0;

  if (downPaymentType === "amount") {
    downAmount = Math.max(0, parseFloat(downPaymentValue) || 0);
    downPercent = price > 0 ? (downAmount / price) * 100 : 0;
  } else {
    downPercent = Math.max(0, parseFloat(downPaymentValue) || 0);
    downAmount = price * (downPercent / 100);
  }

  // Most US states apply sales tax on (Vehicle Price - Trade-in Value)
  const taxableAmount = Math.max(0, price - tradeIn);
  const totalSalesTax = taxableAmount * (taxRate / 100);
  const totalFees = dFees + tFees;

  // Determine Net Financed Amount
  // Financed = Price - Down - TradeIn + Fees + SalesTax (if rolled into loan)
  let netFinanced = price - downAmount - tradeIn;
  if (includeTaxInLoan) {
    netFinanced += totalSalesTax + totalFees;
  }
  netFinanced = Math.max(0, netFinanced);

  // Monthly Interest Rate
  const monthlyRate = rateAnnual / 100 / 12;

  // Monthly Payment Calculation
  let monthlyPayment = 0;
  if (netFinanced > 0) {
    if (monthlyRate > 0) {
      const compoundFactor = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = (netFinanced * (monthlyRate * compoundFactor)) / (compoundFactor - 1);
    } else {
      monthlyPayment = netFinanced / termMonths;
    }
  }

  // Build Monthly & Yearly Amortization Schedules
  const monthlySchedule = [];
  const yearlySchedule = [];

  let balance = netFinanced;
  let totalInterestPaid = 0;

  let currentYearNumber = 1;
  let yearInterestAcc = 0;
  let yearPrincipalAcc = 0;
  let yearStartBalance = balance;

  for (let m = 1; m <= termMonths; m++) {
    if (balance <= 0) break;

    const interestForMonth = balance * monthlyRate;
    let principalForMonth = monthlyPayment - interestForMonth;

    if (principalForMonth > balance) {
      principalForMonth = balance;
    }

    balance -= principalForMonth;
    totalInterestPaid += interestForMonth;

    yearInterestAcc += interestForMonth;
    yearPrincipalAcc += principalForMonth;

    monthlySchedule.push({
      month: m,
      payment: monthlyPayment,
      principal: principalForMonth,
      interest: interestForMonth,
      totalInterest: totalInterestPaid,
      remainingBalance: Math.max(0, balance),
    });

    // Check if end of year or end of loan
    if (m % 12 === 0 || m === termMonths) {
      yearlySchedule.push({
        year: currentYearNumber,
        startBalance: yearStartBalance,
        totalPayment: yearPrincipalAcc + yearInterestAcc,
        principalPaid: yearPrincipalAcc,
        interestPaid: yearInterestAcc,
        endingBalance: Math.max(0, balance),
      });

      currentYearNumber++;
      yearInterestAcc = 0;
      yearPrincipalAcc = 0;
      yearStartBalance = balance;
    }
  }

  const totalLoanCost = netFinanced + totalInterestPaid;
  const totalOutofPocket = downAmount + (includeTaxInLoan ? totalLoanCost : totalLoanCost + totalSalesTax + totalFees);

  return {
    vehiclePrice: price,
    downPaymentAmount: downAmount,
    downPaymentPercent: downPercent,
    downPaymentType,
    tradeInValue: tradeIn,
    taxableAmount,
    salesTaxRate: taxRate,
    totalSalesTax,
    dealerFees: dFees,
    titleRegFees: tFees,
    totalFees,
    includeTaxInLoan,
    financedAmount: netFinanced,
    loanTermMonths: termMonths,
    interestRate: rateAnnual,
    monthlyPayment,
    totalInterestPaid,
    totalLoanCost,
    totalOutofPocket,
    monthlySchedule,
    yearlySchedule,
  };
}
