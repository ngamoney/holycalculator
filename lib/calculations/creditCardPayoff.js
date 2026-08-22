/**
 * Pure calculation logic for Multi-Credit Card Payoff Calculator.
 * Supports Avalanche (highest APR first) and Snowball (lowest balance first).
 * Simulates monthly payment roll-over as individual cards are eliminated.
 */

export function calculateCreditCardPayoff({
  monthlyBudget = 500,
  strategy = "avalanche", // 'avalanche' | 'snowball'
  cards = [
    { name: "Card 1", balance: 4600, minPayment: 100, interestRate: 18.99 },
    { name: "Card 2", balance: 3900, minPayment: 90, interestRate: 19.99 },
    { name: "Card 3", balance: 6000, minPayment: 120, interestRate: 15.99 },
  ],
}) {
  const validCards = cards
    .filter((c) => Number(c.balance) > 0)
    .map((c, idx) => ({
      id: idx + 1,
      name: c.name || `Card ${idx + 1}`,
      balance: Number(c.balance) || 0,
      minPayment: Number(c.minPayment) || 0,
      interestRate: Number(c.interestRate) || 0,
      monthlyRate: (Number(c.interestRate) || 0) / 100 / 12,
    }));

  const totalStartingBalance = validCards.reduce((acc, c) => acc + c.balance, 0);
  const totalMinPayment = validCards.reduce((acc, c) => acc + c.minPayment, 0);
  const budget = Math.max(totalMinPayment, Number(monthlyBudget) || totalMinPayment);

  if (validCards.length === 0 || totalStartingBalance <= 0) {
    return {
      strategy,
      totalStartingBalance: 0,
      totalPaid: 0,
      totalInterest: 0,
      totalMonths: 0,
      timeFormatted: "0 months",
      minPaymentOnlyInterest: 0,
      minPaymentOnlyMonths: 0,
      interestSaved: 0,
      monthsSaved: 0,
      cardPayoffDates: {},
      schedule: [],
      error: null,
    };
  }

  // Check if minimum payments cover first-month interest
  const totalFirstMonthInterest = validCards.reduce((acc, c) => acc + c.balance * c.monthlyRate, 0);
  if (budget <= totalFirstMonthInterest) {
    return {
      strategy,
      totalStartingBalance,
      totalPaid: 0,
      totalInterest: 0,
      totalMonths: Infinity,
      timeFormatted: "Never (Budget too low)",
      minPaymentOnlyInterest: 0,
      minPaymentOnlyMonths: 0,
      interestSaved: 0,
      monthsSaved: 0,
      cardPayoffDates: {},
      schedule: [],
      error: `Monthly budget ($${budget}) must exceed total monthly interest ($${totalFirstMonthInterest.toFixed(2)}) to reduce balances.`,
    };
  }

  // Minimum-payment only simulation for comparison
  const minOnlyResult = simulateMinPaymentsOnly(validCards);

  // Accelerated Strategy Simulation (Avalanche or Snowball)
  const { schedule, totalPaid, totalInterest, totalMonths, cardPayoffDates } = simulateStrategy(
    validCards,
    budget,
    strategy
  );

  const yrs = Math.floor(totalMonths / 12);
  const mos = totalMonths % 12;
  const timeFormatted = `${yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}` : ""} ${mos > 0 ? `${mos} mo${mos > 1 ? "s" : ""}` : ""}`.trim() || "0 mos";

  const interestSaved = Math.max(0, minOnlyResult.totalInterest - totalInterest);
  const monthsSaved = Math.max(0, minOnlyResult.totalMonths - totalMonths);

  return {
    strategy,
    totalStartingBalance,
    totalPaid,
    totalInterest,
    totalMonths,
    timeFormatted,
    minPaymentOnlyInterest: minOnlyResult.totalInterest,
    minPaymentOnlyMonths: minOnlyResult.totalMonths,
    minPaymentTimeFormatted: minOnlyResult.timeFormatted,
    interestSaved,
    monthsSaved,
    cardPayoffDates,
    schedule,
    error: null,
  };
}

function simulateStrategy(rawCards, monthlyBudget, strategy) {
  // Clone cards
  let activeCards = rawCards.map((c) => ({ ...c }));
  const cardPayoffDates = {};
  const schedule = [];
  let totalPaid = 0;
  let totalInterest = 0;
  let month = 0;
  const maxLimit = 600;

  while (activeCards.some((c) => c.balance > 0.001) && month < maxLimit) {
    month++;
    let monthTotalInterest = 0;
    let monthTotalPaid = 0;
    let availableBudget = monthlyBudget;

    // Step 1: Accrue interest and pay required minimums on each active card
    activeCards.forEach((card) => {
      if (card.balance > 0.001) {
        const interest = card.balance * card.monthlyRate;
        monthTotalInterest += interest;
        card.balance += interest;

        // Minimum payment allocation
        const payment = Math.min(card.balance, card.minPayment);
        card.balance -= payment;
        monthTotalPaid += payment;
        availableBudget -= payment;

        if (card.balance <= 0.001) {
          card.balance = 0;
          if (!cardPayoffDates[card.name]) {
            cardPayoffDates[card.name] = month;
          }
        }
      }
    });

    // Step 2: Allocate remaining extra budget according to selected strategy
    if (availableBudget > 0.001) {
      // Sort remaining active cards
      let sortedCards = activeCards.filter((c) => c.balance > 0.001);
      if (strategy === "avalanche") {
        sortedCards.sort((a, b) => b.interestRate - a.interestRate); // Highest rate first
      } else {
        sortedCards.sort((a, b) => a.balance - b.balance); // Lowest balance first
      }

      for (const card of sortedCards) {
        if (availableBudget <= 0.001) break;
        const extraPayment = Math.min(card.balance, availableBudget);
        card.balance -= extraPayment;
        monthTotalPaid += extraPayment;
        availableBudget -= extraPayment;

        if (card.balance <= 0.001) {
          card.balance = 0;
          if (!cardPayoffDates[card.name]) {
            cardPayoffDates[card.name] = month;
          }
        }
      }
    }

    totalPaid += monthTotalPaid;
    totalInterest += monthTotalInterest;
    const remainingTotalBalance = activeCards.reduce((acc, c) => acc + c.balance, 0);

    schedule.push({
      month,
      totalPayment: monthTotalPaid,
      totalInterest: monthTotalInterest,
      cumulativeInterest: totalInterest,
      remainingBalance: remainingTotalBalance,
      cardsState: activeCards.map((c) => ({ name: c.name, balance: c.balance })),
    });
  }

  return {
    schedule,
    totalPaid,
    totalInterest,
    totalMonths: month,
    cardPayoffDates,
  };
}

function simulateMinPaymentsOnly(rawCards) {
  let activeCards = rawCards.map((c) => ({ ...c }));
  let totalPaid = 0;
  let totalInterest = 0;
  let month = 0;
  const maxLimit = 600;

  while (activeCards.some((c) => c.balance > 0.001) && month < maxLimit) {
    month++;
    activeCards.forEach((card) => {
      if (card.balance > 0.001) {
        const interest = card.balance * card.monthlyRate;
        totalInterest += interest;
        card.balance += interest;

        // Dynamic standard minimum payment rule
        const minPmt = Math.max(interest + card.balance * 0.01, Math.min(25, card.balance));
        const payment = Math.min(card.balance, minPmt);
        card.balance -= payment;
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
