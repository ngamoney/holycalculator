/**
 * Pure calculation logic for General Debt Payoff Planner.
 * Supports multi-account types (Credit cards, Auto, Student, Personal, Mortgage).
 * Compares Debt Avalanche (highest APR first) vs Debt Snowball (lowest balance first) vs Baseline Minimums.
 */

export function calculateDebtPayoff({
  extraMonthlyPayment = 300,
  strategy = "avalanche", // 'avalanche' | 'snowball'
  debts = [
    { name: "Credit Card 1", category: "Credit Card", balance: 6000, minPayment: 150, interestRate: 19.99 },
    { name: "Credit Card 2", category: "Credit Card", balance: 3000, minPayment: 75, interestRate: 16.99 },
    { name: "Auto Loan", category: "Auto Loan", balance: 18000, minPayment: 380, interestRate: 5.5 },
    { name: "Student Loan", category: "Student Loan", balance: 24000, minPayment: 260, interestRate: 4.8 },
  ],
}) {
  const validDebts = debts
    .filter((d) => Number(d.balance) > 0)
    .map((d, idx) => ({
      id: idx + 1,
      name: d.name || `Debt ${idx + 1}`,
      category: d.category || "General Debt",
      balance: Number(d.balance) || 0,
      minPayment: Number(d.minPayment) || 0,
      interestRate: Number(d.interestRate) || 0,
      monthlyRate: (Number(d.interestRate) || 0) / 100 / 12,
    }));

  const totalStartingBalance = validDebts.reduce((acc, d) => acc + d.balance, 0);
  const totalMinPayment = validDebts.reduce((acc, d) => acc + d.minPayment, 0);
  const extraPmt = Math.max(0, Number(extraMonthlyPayment) || 0);
  const totalMonthlyBudget = totalMinPayment + extraPmt;

  if (validDebts.length === 0 || totalStartingBalance <= 0) {
    return {
      strategy,
      totalStartingBalance: 0,
      totalPaid: 0,
      totalInterest: 0,
      totalMonths: 0,
      timeFormatted: "0 months",
      baselineInterest: 0,
      baselineMonths: 0,
      baselineTimeFormatted: "0 months",
      interestSaved: 0,
      monthsSaved: 0,
      debtPayoffDates: {},
      schedule: [],
      error: null,
    };
  }

  // Baseline run (paying only minimums with no extra payment & no rollover)
  const baselineResult = simulateBaselineNoRollover(validDebts);

  // Strategy run (with extra payment + rollover)
  const strategyResult = simulateStrategyRun(validDebts, totalMonthlyBudget, strategy);

  const yrs = Math.floor(strategyResult.totalMonths / 12);
  const mos = strategyResult.totalMonths % 12;
  const timeFormatted = `${yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}` : ""} ${mos > 0 ? `${mos} mo${mos > 1 ? "s" : ""}` : ""}`.trim() || "0 mos";

  const interestSaved = Math.max(0, baselineResult.totalInterest - strategyResult.totalInterest);
  const monthsSaved = Math.max(0, baselineResult.totalMonths - strategyResult.totalMonths);

  return {
    strategy,
    totalStartingBalance,
    totalMinPayment,
    totalMonthlyBudget,
    totalPaid: strategyResult.totalPaid,
    totalInterest: strategyResult.totalInterest,
    totalMonths: strategyResult.totalMonths,
    timeFormatted,
    baselineInterest: baselineResult.totalInterest,
    baselineMonths: baselineResult.totalMonths,
    baselineTimeFormatted: baselineResult.timeFormatted,
    interestSaved,
    monthsSaved,
    debtPayoffDates: strategyResult.debtPayoffDates,
    schedule: strategyResult.schedule,
    error: null,
  };
}

function simulateStrategyRun(rawDebts, monthlyBudget, strategy) {
  let activeDebts = rawDebts.map((d) => ({ ...d }));
  const debtPayoffDates = {};
  const schedule = [];
  let totalPaid = 0;
  let totalInterest = 0;
  let month = 0;
  const maxLimit = 600;

  while (activeDebts.some((d) => d.balance > 0.001) && month < maxLimit) {
    month++;
    let monthTotalInterest = 0;
    let monthTotalPaid = 0;
    let availableBudget = monthlyBudget;

    // Accrue interest and pay minimums
    activeDebts.forEach((debt) => {
      if (debt.balance > 0.001) {
        const interest = debt.balance * debt.monthlyRate;
        monthTotalInterest += interest;
        debt.balance += interest;

        const payment = Math.min(debt.balance, debt.minPayment);
        debt.balance -= payment;
        monthTotalPaid += payment;
        availableBudget -= payment;

        if (debt.balance <= 0.001) {
          debt.balance = 0;
          if (!debtPayoffDates[debt.name]) {
            debtPayoffDates[debt.name] = month;
          }
        }
      }
    });

    // Allocate extra budget according to selected strategy
    if (availableBudget > 0.001) {
      let sortedDebts = activeDebts.filter((d) => d.balance > 0.001);
      if (strategy === "avalanche") {
        sortedDebts.sort((a, b) => b.interestRate - a.interestRate); // Highest APR first
      } else {
        sortedDebts.sort((a, b) => a.balance - b.balance); // Lowest balance first
      }

      for (const debt of sortedDebts) {
        if (availableBudget <= 0.001) break;
        const extraPayment = Math.min(debt.balance, availableBudget);
        debt.balance -= extraPayment;
        monthTotalPaid += extraPayment;
        availableBudget -= extraPayment;

        if (debt.balance <= 0.001) {
          debt.balance = 0;
          if (!debtPayoffDates[debt.name]) {
            debtPayoffDates[debt.name] = month;
          }
        }
      }
    }

    totalPaid += monthTotalPaid;
    totalInterest += monthTotalInterest;
    const remainingTotalBalance = activeDebts.reduce((acc, d) => acc + d.balance, 0);

    schedule.push({
      month,
      totalPayment: monthTotalPaid,
      totalInterest: monthTotalInterest,
      cumulativeInterest: totalInterest,
      remainingBalance: remainingTotalBalance,
      debtsState: activeDebts.map((d) => ({ name: d.name, balance: d.balance })),
    });
  }

  return {
    schedule,
    totalPaid,
    totalInterest,
    totalMonths: month,
    debtPayoffDates,
  };
}

function simulateBaselineNoRollover(rawDebts) {
  let activeDebts = rawDebts.map((d) => ({ ...d }));
  let totalPaid = 0;
  let totalInterest = 0;
  let month = 0;
  const maxLimit = 600;

  while (activeDebts.some((d) => d.balance > 0.001) && month < maxLimit) {
    month++;
    activeDebts.forEach((debt) => {
      if (debt.balance > 0.001) {
        const interest = debt.balance * debt.monthlyRate;
        totalInterest += interest;
        debt.balance += interest;

        const payment = Math.min(debt.balance, debt.minPayment);
        debt.balance -= payment;
        totalPaid += payment;
      }
    });
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
