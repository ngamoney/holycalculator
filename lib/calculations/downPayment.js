/**
 * Pure calculation logic for Down Payment Calculator.
 * Calculates upfront cash requirements (Down payment + Closing costs),
 * resulting mortgage balance, monthly payment, and PMI status across down payment tiers.
 */

export function calculateDownPayment({
  homePrice = 450000,
  downPaymentPct = 20,
  closingCostsPct = 3.0,
  interestRate = 6.75,
  loanTermYears = 30,
}) {
  const price = Math.max(1000, Number(homePrice) || 0);
  const downPct = Math.min(100, Math.max(0, Number(downPaymentPct) || 0)) / 100;
  const closingPct = Math.max(0, Number(closingCostsPct) || 0) / 100;
  const annualRate = Math.max(0, Number(interestRate) || 0);
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = (Number(loanTermYears) || 30) * 12;

  const downPaymentAmount = price * downPct;
  const closingCostsAmount = price * closingPct;
  const totalUpfrontCash = downPaymentAmount + closingCostsAmount;
  const loanPrincipal = Math.max(0, price - downPaymentAmount);

  let monthlyPI = 0;
  if (monthlyRate === 0) {
    monthlyPI = loanPrincipal / totalMonths;
  } else if (loanPrincipal > 0) {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyPI = (loanPrincipal * monthlyRate * factor) / (factor - 1);
  }

  // Estimated annual PMI (~0.7% of loan amount if down payment < 20%)
  const hasPMI = downPct < 0.2 && loanPrincipal > 0;
  const monthlyPMI = hasPMI ? (loanPrincipal * 0.007) / 12 : 0;
  const totalMonthlyPayment = monthlyPI + monthlyPMI;

  // Comparison tiers: 3.5% (FHA), 5% (Min Conventional), 10%, 20% (No PMI)
  const tierPcts = [3.5, 5.0, 10.0, 20.0];
  const tiers = tierPcts.map((tPct) => {
    const tDown = (price * tPct) / 100;
    const tLoan = price - tDown;
    let tPI = 0;
    if (monthlyRate === 0) {
      tPI = tLoan / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      tPI = (tLoan * monthlyRate * factor) / (factor - 1);
    }
    const tPMI = tPct < 20 ? (tLoan * 0.007) / 12 : 0;
    return {
      percent: tPct,
      downPayment: tDown,
      totalUpfront: tDown + closingCostsAmount,
      loanAmount: tLoan,
      monthlyPI: tPI,
      monthlyPMI: tPMI,
      totalMonthly: tPI + tPMI,
      hasPMI: tPct < 20,
    };
  });

  return {
    homePrice: price,
    downPaymentAmount,
    downPaymentPct: Math.round(downPct * 1000) / 10,
    closingCostsAmount,
    totalUpfrontCash,
    loanPrincipal,
    monthlyPI,
    monthlyPMI,
    totalMonthlyPayment,
    hasPMI,
    tiers,
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
