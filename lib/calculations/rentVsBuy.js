/**
 * Pure calculation logic for Rent vs. Buy Calculator.
 * Models:
 * 1. Buying Scenario: Down payment, closing costs, mortgage P&I, property taxes,
 *    home insurance, maintenance, property appreciation, and selling costs.
 * 2. Renting Scenario: Monthly rent, annual rent inflation, renter's insurance,
 *    and investing the initial down payment + monthly cash flow differences in the market.
 * Solves for the Breakeven year and net wealth/cost comparison across a 30-year horizon.
 */

export function calculateRentVsBuy({
  homePrice = 500000,
  downPaymentPercent = 20,
  mortgageRate = 6.75,
  loanTermYears = 30,
  propertyTaxRate = 1.2, // % of home value / year
  homeInsuranceAnnual = 1800,
  maintenanceRate = 1.0, // % of home value / year
  homeAppreciationRate = 3.5, // % per year
  buyingClosingCostsPct = 2.0,
  sellingClosingCostsPct = 6.0,
  monthlyRent = 2500,
  rentIncreaseRate = 3.0, // % per year
  rentersInsuranceMonthly = 20,
  investmentReturnRate = 6.0, // % per year
  stayDurationYears = 7,
}) {
  const price = Math.max(10000, Number(homePrice) || 0);
  const downPct = Math.max(0, Number(downPaymentPercent) || 0) / 100;
  const downPayment = price * downPct;
  const loanPrincipal = price - downPayment;
  const rateMonthly = (Number(mortgageRate) || 0) / 100 / 12;
  const totalMonths = (Number(loanTermYears) || 30) * 12;

  // Initial out-of-pocket for buyer
  const buyingClosing = price * ((Number(buyingClosingCostsPct) || 0) / 100);
  const initialBuyerCash = downPayment + buyingClosing;

  // Monthly mortgage payment
  let monthlyPI = 0;
  if (rateMonthly === 0) {
    monthlyPI = loanPrincipal / totalMonths;
  } else {
    const factor = Math.pow(1 + rateMonthly, totalMonths);
    monthlyPI = (loanPrincipal * rateMonthly * factor) / (factor - 1);
  }

  const annualAppreciation = (Number(homeAppreciationRate) || 0) / 100;
  const annualRentGrowth = (Number(rentIncreaseRate) || 0) / 100;
  const annualInvestReturn = (Number(investmentReturnRate) || 0) / 100;
  const monthlyInvestReturn = annualInvestReturn / 12;

  const propTaxAnnualPct = (Number(propertyTaxRate) || 0) / 100;
  const maintAnnualPct = (Number(maintenanceRate) || 0) / 100;
  const sellCostPct = (Number(sellingClosingCostsPct) || 0) / 100;

  // Simulation over 30 years
  let currentHomeValue = price;
  let remainingMortgageBalance = loanPrincipal;
  let currentMonthlyRent = Number(monthlyRent) || 0;
  let renterInvestPortfolio = initialBuyerCash; // Renter invests the down payment + closing costs

  let cumBuyingCost = buyingClosing;
  let cumRentingCost = 0;

  const yearlyData = [];
  let breakevenYear = null;

  for (let yr = 1; yr <= 30; yr++) {
    let yearBuyingExpense = 0;
    let yearRentingExpense = 0;

    for (let m = 1; m <= 12; m++) {
      // Buying costs this month
      let interest = remainingMortgageBalance * rateMonthly;
      let principalPaid = monthlyPI - interest;
      if (remainingMortgageBalance <= 0) {
        interest = 0;
        principalPaid = 0;
      } else {
        remainingMortgageBalance = Math.max(0, remainingMortgageBalance - principalPaid);
      }

      const monthlyTax = (currentHomeValue * propTaxAnnualPct) / 12;
      const monthlyMaint = (currentHomeValue * maintAnnualPct) / 12;
      const monthlyIns = (Number(homeInsuranceAnnual) || 0) / 12;

      const totalMonthlyBuyCost = (remainingMortgageBalance > 0 ? monthlyPI : 0) + monthlyTax + monthlyMaint + monthlyIns;
      yearBuyingExpense += totalMonthlyBuyCost;

      // Renting costs this month
      const totalMonthlyRentCost = currentMonthlyRent + (Number(rentersInsuranceMonthly) || 0);
      yearRentingExpense += totalMonthlyRentCost;

      // Opportunity cost / portfolio update
      // Grow renter portfolio
      renterInvestPortfolio *= (1 + monthlyInvestReturn);
      // Difference in monthly cash flow: if buying costs more than renting, renter invests the diff; if renting costs more, renter withdraws
      const cashFlowDiff = totalMonthlyBuyCost - totalMonthlyRentCost;
      renterInvestPortfolio += cashFlowDiff;
    }

    // Appreciate home value and rent at end of year
    currentHomeValue *= (1 + annualAppreciation);
    currentMonthlyRent *= (1 + annualRentGrowth);

    cumBuyingCost += yearBuyingExpense;
    cumRentingCost += yearRentingExpense;

    // Equity if sold today (Home value - selling closing costs - remaining loan)
    const netHomeProceeds = currentHomeValue * (1 - sellCostPct) - remainingMortgageBalance;
    const netBuyingNetWorth = netHomeProceeds;
    const netRentingNetWorth = renterInvestPortfolio;

    // Net financial advantage of buying vs renting
    const buyingAdvantage = netBuyingNetWorth - netRentingNetWorth;

    if (breakevenYear === null && buyingAdvantage > 0) {
      breakevenYear = yr;
    }

    yearlyData.push({
      year: yr,
      homeValue: currentHomeValue,
      mortgageBalance: remainingMortgageBalance,
      homeEquity: netHomeProceeds,
      renterPortfolio: renterInvestPortfolio,
      cumBuyingCost,
      cumRentingCost,
      buyingAdvantage,
    });
  }

  const selectedDuration = Math.min(30, Math.max(1, Number(stayDurationYears) || 7));
  const selectedYearData = yearlyData[selectedDuration - 1];

  const isBuyBetter = selectedYearData.buyingAdvantage >= 0;
  const initialMonthlyBuy = monthlyPI + (price * propTaxAnnualPct) / 12 + (price * maintAnnualPct) / 12 + (Number(homeInsuranceAnnual) || 0) / 12;
  const initialMonthlyRent = Number(monthlyRent) + Number(rentersInsuranceMonthly);

  return {
    initialMonthlyBuy,
    initialMonthlyRent,
    downPayment,
    buyingClosing,
    loanPrincipal,
    breakevenYear,
    selectedDuration,
    homeEquityAtDuration: selectedYearData.homeEquity,
    renterPortfolioAtDuration: selectedYearData.renterPortfolio,
    buyingAdvantage: Math.abs(selectedYearData.buyingAdvantage),
    isBuyBetter,
    yearlyData,
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
