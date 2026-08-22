/**
 * Pure calculation logic for House Affordability Calculator.
 * Solves for maximum home purchase price based on borrower income, recurring debts,
 * down payment funds, interest rate, taxes, insurance, PMI, and underwriting DTI limits.
 */

export function calculateHouseAffordability({
  annualIncome = 120000,
  monthlyDebts = 500,
  downPayment = 60000,
  downPaymentType = "amount", // 'amount' | 'percent'
  interestRate = 6.75,
  loanTermYears = 30,
  propertyTaxRate = 1.2, // % / yr
  homeInsuranceAnnual = 1500,
  monthlyHoa = 0,
  underwritingRule = "conventional", // 'conservative' (25%) | 'conventional' (28/36) | 'fha' (31/43) | 'aggressive' (45%)
}) {
  const grossIncome = Math.max(0, Number(annualIncome) || 0);
  const monthlyGross = grossIncome / 12;
  const debts = Math.max(0, Number(monthlyDebts) || 0);
  const annualRate = Math.max(0, Number(interestRate) || 0);
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = (Number(loanTermYears) || 30) * 12;

  const propTaxRate = (Number(propertyTaxRate) || 0) / 100 / 12;
  const monthlyIns = (Number(homeInsuranceAnnual) || 0) / 12;
  const hoa = Math.max(0, Number(monthlyHoa) || 0);

  if (monthlyGross <= 0) {
    return {
      maxHomePrice: 0,
      maxLoanAmount: 0,
      actualDownPayment: 0,
      totalMonthlyPayment: 0,
      monthlyPI: 0,
      monthlyTax: 0,
      monthlyInsurance: 0,
      monthlyPmi: 0,
      monthlyHoa: hoa,
      frontEndDti: 0,
      backEndDti: 0,
      tiers: [],
      error: null,
    };
  }

  // Determine DTI limits based on rule
  let frontEndLimitPct = 0.28;
  let backEndLimitPct = 0.36;

  if (underwritingRule === "conservative") {
    frontEndLimitPct = 0.25;
    backEndLimitPct = 0.30;
  } else if (underwritingRule === "fha") {
    frontEndLimitPct = 0.31;
    backEndLimitPct = 0.43;
  } else if (underwritingRule === "aggressive") {
    frontEndLimitPct = 0.36;
    backEndLimitPct = 0.45;
  }

  // Max housing budget allowed by front-end vs back-end
  const maxHousingFrontEnd = monthlyGross * frontEndLimitPct;
  const maxHousingBackEnd = Math.max(0, monthlyGross * backEndLimitPct - debts);
  const allowableMonthlyHousing = Math.min(maxHousingFrontEnd, maxHousingBackEnd);

  // Solve for max home price iteratively
  const result = solvePriceForHousingBudget({
    targetHousingBudget: allowableMonthlyHousing,
    downPaymentInput: Number(downPayment) || 0,
    downPaymentType,
    monthlyRate,
    totalMonths,
    propTaxRate,
    monthlyIns,
    hoa,
  });

  // Calculate tiers (Conservative, Standard, Aggressive)
  const conservativeBudget = Math.min(monthlyGross * 0.25, Math.max(0, monthlyGross * 0.30 - debts));
  const conventionalBudget = Math.min(monthlyGross * 0.28, Math.max(0, monthlyGross * 0.36 - debts));
  const aggressiveBudget = Math.min(monthlyGross * 0.36, Math.max(0, monthlyGross * 0.45 - debts));

  const tiers = [
    {
      name: "Conservative (25/30)",
      rule: "conservative",
      maxPrice: solvePriceForHousingBudget({
        targetHousingBudget: conservativeBudget,
        downPaymentInput: Number(downPayment) || 0,
        downPaymentType,
        monthlyRate,
        totalMonths,
        propTaxRate,
        monthlyIns,
        hoa,
      }).maxHomePrice,
      monthlyHousing: conservativeBudget,
    },
    {
      name: "Standard Conventional (28/36)",
      rule: "conventional",
      maxPrice: solvePriceForHousingBudget({
        targetHousingBudget: conventionalBudget,
        downPaymentInput: Number(downPayment) || 0,
        downPaymentType,
        monthlyRate,
        totalMonths,
        propTaxRate,
        monthlyIns,
        hoa,
      }).maxHomePrice,
      monthlyHousing: conventionalBudget,
    },
    {
      name: "Aggressive / Max DTI (36/45)",
      rule: "aggressive",
      maxPrice: solvePriceForHousingBudget({
        targetHousingBudget: aggressiveBudget,
        downPaymentInput: Number(downPayment) || 0,
        downPaymentType,
        monthlyRate,
        totalMonths,
        propTaxRate,
        monthlyIns,
        hoa,
      }).maxHomePrice,
      monthlyHousing: aggressiveBudget,
    },
  ];

  return {
    maxHomePrice: result.maxHomePrice,
    maxLoanAmount: result.maxLoanAmount,
    actualDownPayment: result.actualDownPayment,
    downPaymentPct: result.downPaymentPct,
    totalMonthlyPayment: result.totalMonthlyPayment,
    monthlyPI: result.monthlyPI,
    monthlyTax: result.monthlyTax,
    monthlyInsurance: result.monthlyInsurance,
    monthlyPmi: result.monthlyPmi,
    monthlyHoa: hoa,
    frontEndDti: Math.round((result.totalMonthlyPayment / monthlyGross) * 1000) / 10,
    backEndDti: Math.round(((result.totalMonthlyPayment + debts) / monthlyGross) * 1000) / 10,
    allowableMonthlyHousing,
    monthlyGross,
    tiers,
    error: null,
  };
}

function solvePriceForHousingBudget({
  targetHousingBudget,
  downPaymentInput,
  downPaymentType,
  monthlyRate,
  totalMonths,
  propTaxRate,
  monthlyIns,
  hoa,
}) {
  let lowPrice = 10000;
  let highPrice = 3000000;
  let bestPrice = lowPrice;

  // Binary search for max home price that fits target housing budget
  for (let i = 0; i < 40; i++) {
    const midPrice = (lowPrice + highPrice) / 2;

    let dVal = 0;
    if (downPaymentType === "percent") {
      dVal = (midPrice * Math.min(100, Math.max(0, downPaymentInput))) / 100;
    } else {
      dVal = Math.min(midPrice * 0.95, downPaymentInput);
    }

    const loan = midPrice - dVal;
    let pi = 0;
    if (monthlyRate === 0) {
      pi = loan / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      pi = (loan * monthlyRate * factor) / (factor - 1);
    }

    const tax = midPrice * propTaxRate;
    // PMI if down payment < 20%
    const pmi = dVal / midPrice < 0.2 ? (loan * 0.007) / 12 : 0;
    const totalPITI = pi + tax + monthlyIns + hoa + pmi;

    if (totalPITI <= targetHousingBudget) {
      bestPrice = midPrice;
      lowPrice = midPrice;
    } else {
      highPrice = midPrice;
    }
  }

  const finalPrice = Math.round(bestPrice / 100) * 100;
  let finalDown = 0;
  if (downPaymentType === "percent") {
    finalDown = (finalPrice * Math.min(100, Math.max(0, downPaymentInput))) / 100;
  } else {
    finalDown = Math.min(finalPrice * 0.95, downPaymentInput);
  }

  const finalLoan = finalPrice - finalDown;
  let finalPI = 0;
  if (monthlyRate === 0) {
    finalPI = finalLoan / totalMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    finalPI = (finalLoan * monthlyRate * factor) / (factor - 1);
  }

  const finalTax = finalPrice * propTaxRate;
  const finalPmi = finalDown / finalPrice < 0.2 ? (finalLoan * 0.007) / 12 : 0;
  const finalTotal = finalPI + finalTax + monthlyIns + hoa + finalPmi;

  return {
    maxHomePrice: finalPrice,
    maxLoanAmount: Math.round(finalLoan),
    actualDownPayment: Math.round(finalDown),
    downPaymentPct: Math.round((finalDown / finalPrice) * 100),
    totalMonthlyPayment: finalTotal,
    monthlyPI: finalPI,
    monthlyTax: finalTax,
    monthlyInsurance: monthlyIns,
    monthlyPmi: finalPmi,
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
