/**
 * Pure JavaScript calculation engine for Personal Budgeting.
 * Calculates Gross Income, Taxes, Net Income, Category Subtotals,
 * Net Surplus/Deficit, Debt-to-Income (DTI) ratio, and benchmark rules of thumb.
 */

import { INCOME_CONFIG, EXPENSE_CATEGORIES_CONFIG } from "@/lib/data/budgetConfig";

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

export function toMonthly(amount, period) {
  const amt = Math.max(0, Number(amount) || 0);
  return period === "year" ? amt / 12 : amt;
}

export function toAnnual(amount, period) {
  const amt = Math.max(0, Number(amount) || 0);
  return period === "year" ? amt : amt * 12;
}

export function calculateBudget(incomeState = {}, taxRatePct = 20, expenseState = {}) {
  const taxRate = Math.max(0, Math.min(100, Number(taxRatePct) || 0)) / 100;

  // 1. Income Calculations
  let grossAnnualIncome = 0;
  let grossMonthlyIncome = 0;

  INCOME_CONFIG.forEach((item) => {
    const entry = incomeState[item.id] || { amount: 0, period: "month" };
    const m = toMonthly(entry.amount, entry.period);
    const a = toAnnual(entry.amount, entry.period);
    grossMonthlyIncome += m;
    grossAnnualIncome += a;
  });

  const annualTaxAmount = grossAnnualIncome * taxRate;
  const monthlyTaxAmount = grossMonthlyIncome * taxRate;

  const netAnnualIncome = Math.max(0, grossAnnualIncome - annualTaxAmount);
  const netMonthlyIncome = Math.max(0, grossMonthlyIncome - monthlyTaxAmount);

  // 2. Expense Category Subtotals & Debt Tracking
  let totalMonthlyExpenses = 0;
  let totalAnnualExpenses = 0;
  let totalMonthlyDebtPayments = 0;

  const categorySubtotals = {};
  const categoryChartData = [];

  // Individual benchmark item tracking
  let housingMonthlyTotal = 0;
  let transMonthlyTotal = 0;
  let foodMonthlyTotal = 0;
  let savingsMonthlyTotal = 0;

  EXPENSE_CATEGORIES_CONFIG.forEach((cat) => {
    let catMonthly = 0;
    let catAnnual = 0;

    cat.items.forEach((item) => {
      const entry = expenseState[item.id] || { amount: 0, period: "month" };
      const m = toMonthly(entry.amount, entry.period);
      const a = toAnnual(entry.amount, entry.period);

      catMonthly += m;
      catAnnual += a;

      if (item.isDebtItem) {
        totalMonthlyDebtPayments += m;
      }

      if (cat.id === "housing") housingMonthlyTotal += m;
      if (cat.id === "transportation") transMonthlyTotal += m;
      if (item.id === "food" || item.id === "mealsOut") foodMonthlyTotal += m;
      if (cat.id === "savings") savingsMonthlyTotal += m;
    });

    categorySubtotals[cat.id] = {
      monthly: catMonthly,
      annual: catAnnual,
    };

    totalMonthlyExpenses += catMonthly;
    totalAnnualExpenses += catAnnual;

    if (catMonthly > 0) {
      categoryChartData.push({
        id: cat.id,
        label: cat.title,
        icon: cat.icon,
        value: catMonthly,
      });
    }
  });

  // 3. Net Surplus / Deficit
  const netMonthlySurplus = netMonthlyIncome - totalMonthlyExpenses;
  const netAnnualSurplus = netAnnualIncome - totalAnnualExpenses;

  // 4. Debt-to-Income (DTI) Ratio
  const dtiRatioPercent = grossMonthlyIncome > 0 ? (totalMonthlyDebtPayments / grossMonthlyIncome) * 100 : 0;

  // 5. Benchmark Rule Comparison Percentages (Relative to Gross Income)
  const housingRatioPercent = grossMonthlyIncome > 0 ? (housingMonthlyTotal / grossMonthlyIncome) * 100 : 0;
  const transRatioPercent = grossMonthlyIncome > 0 ? (transMonthlyTotal / grossMonthlyIncome) * 100 : 0;
  const foodRatioPercent = grossMonthlyIncome > 0 ? (foodMonthlyTotal / grossMonthlyIncome) * 100 : 0;
  const savingsRatioPercent = grossMonthlyIncome > 0 ? (savingsMonthlyTotal / grossMonthlyIncome) * 100 : 0;

  return {
    grossAnnualIncome,
    grossMonthlyIncome,
    annualTaxAmount,
    monthlyTaxAmount,
    netAnnualIncome,
    netMonthlyIncome,
    totalMonthlyExpenses,
    totalAnnualExpenses,
    netMonthlySurplus,
    netAnnualSurplus,
    isSurplus: netMonthlySurplus >= 0,
    totalMonthlyDebtPayments,
    dtiRatioPercent: dtiRatioPercent.toFixed(1),
    categorySubtotals,
    categoryChartData,
    benchmarks: {
      housing: { actualPct: housingRatioPercent.toFixed(1), targetPct: 30, isWithin: housingRatioPercent <= 30 },
      transportation: { actualPct: transRatioPercent.toFixed(1), targetPct: 15, isWithin: transRatioPercent <= 15 },
      food: { actualPct: foodRatioPercent.toFixed(1), targetPct: 15, isWithin: foodRatioPercent <= 15 },
      savings: { actualPct: savingsRatioPercent.toFixed(1), targetPct: 15, isWithin: savingsRatioPercent >= 15 },
    },
  };
}
