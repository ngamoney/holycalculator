/**
 * Pure JavaScript calculation routines for Retirement Planning.
 * Supports 4 distinct calculation modes:
 * Mode A: Target Nest Egg & Gap Analysis ("How much do you need to retire?")
 * Mode B: Savings Contribution Plan ("How can you save for retirement?")
 * Mode C: Sustainable Monthly Withdrawal ("How much can you withdraw after retirement?")
 * Mode D: Drawdown Duration ("How long can your money last?")
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

/**
 * Mode A: "How much do you need to retire?"
 */
export function calculateRetirementNeeds(inputs) {
  const {
    currentAge = 30,
    retirementAge = 67,
    lifeExpectancy = 90,
    currentIncome = 80000,
    incomeIncreaseRate = 2.5,
    incomeNeededMode = "percent", // 'percent' | 'amount'
    incomeNeededValue = 80,
    returnWork = 7.0,
    returnRetire = 5.0,
    inflationRate = 2.6,
    otherRetirementIncomeMonthly = 0,
    currentSavings = 50000,
    futureSavingsMode = "percent", // 'percent' | 'amount'
    futureSavingsValue = 10,
  } = inputs;

  const ageNow = Math.max(18, Math.min(100, Number(currentAge) || 30));
  const ageRetire = Math.max(ageNow + 1, Math.min(105, Number(retirementAge) || 67));
  const ageLife = Math.max(ageRetire + 1, Math.min(115, Number(lifeExpectancy) || 90));

  const nWork = ageRetire - ageNow;
  const nRetire = ageLife - ageRetire;
  const mWork = nWork * 12;

  const inc = Math.max(0, Number(currentIncome) || 0);
  const incIncrease = Math.max(0, Number(incomeIncreaseRate) || 0) / 100;
  const inf = Math.max(0, Number(inflationRate) || 0) / 100;
  const rWork = Math.max(0, Number(returnWork) || 0) / 100;
  const rRetire = Math.max(0, Number(returnRetire) || 0) / 100;
  const rmWork = rWork / 12;

  // Projected Income at Retirement Age
  const incomeAtRetirement = inc * Math.pow(1 + incIncrease, nWork);

  // Annual Income Needed in Retirement (in future dollars at retirement age)
  let annualIncomeNeeded = 0;
  if (incomeNeededMode === "percent") {
    const pct = Math.max(0, Number(incomeNeededValue) || 80) / 100;
    annualIncomeNeeded = incomeAtRetirement * pct;
  } else {
    const amt = Math.max(0, Number(incomeNeededValue) || 0);
    annualIncomeNeeded = amt * Math.pow(1 + inf, nWork);
  }

  // Deduct Social Security / Pension / Other Income
  const otherIncomeMonthly = Math.max(0, Number(otherRetirementIncomeMonthly) || 0);
  const otherIncomeFutureAnnual = otherIncomeMonthly * 12 * Math.pow(1 + inf, nWork);
  const netAnnualNeededFromNestEgg = Math.max(0, annualIncomeNeeded - otherIncomeFutureAnnual);

  // Real investment return during retirement
  const realRetireReturn = (1 + rRetire) / (1 + inf) - 1;

  // Target Nest Egg Needed at Retirement Age
  let targetNestEgg = 0;
  if (realRetireReturn !== 0 && nRetire > 0) {
    targetNestEgg =
      netAnnualNeededFromNestEgg * ((1 - Math.pow(1 + realRetireReturn, -nRetire)) / realRetireReturn);
  } else {
    targetNestEgg = netAnnualNeededFromNestEgg * nRetire;
  }

  // Trajectory Nest Egg based on current savings and contributions
  const fvCurrentSavings = (Number(currentSavings) || 0) * Math.pow(1 + rWork, nWork);

  let monthlyContribution = 0;
  if (futureSavingsMode === "percent") {
    const pct = Math.max(0, Number(futureSavingsValue) || 10) / 100;
    monthlyContribution = (inc * pct) / 12;
  } else {
    monthlyContribution = Math.max(0, Number(futureSavingsValue) || 0);
  }

  let fvContributions = 0;
  if (rmWork > 0 && mWork > 0) {
    fvContributions = monthlyContribution * ((Math.pow(1 + rmWork, mWork) - 1) / rmWork);
  } else {
    fvContributions = monthlyContribution * mWork;
  }

  const trajectoryNestEgg = fvCurrentSavings + fvContributions;
  const gap = trajectoryNestEgg - targetNestEgg;
  const isOnTrack = gap >= 0;
  const onTrackPercent = targetNestEgg > 0 ? Math.min(100, Math.max(0, (trajectoryNestEgg / targetNestEgg) * 100)) : 100;

  // Required Additional Monthly Savings if Shortfall exists
  let requiredAdditionalMonthlySavings = 0;
  if (gap < 0 && rmWork > 0 && mWork > 0) {
    const shortfall = Math.abs(gap);
    requiredAdditionalMonthlySavings = (shortfall * rmWork) / (Math.pow(1 + rmWork, mWork) - 1);
  }

  // Year-by-Year Growth & Drawdown Schedule
  const yearlySchedule = [];
  let currentBalance = Number(currentSavings) || 0;
  let cumContributions = currentBalance;
  let cumInterest = 0;

  for (let age = ageNow; age <= ageLife; age++) {
    const isWorking = age < ageRetire;
    const yearIndex = age - ageNow;

    let yearStart = currentBalance;
    let yearContrib = 0;
    let yearInterest = 0;
    let yearWithdrawal = 0;

    if (isWorking) {
      // Contributions grow with income increase if percentage mode
      const currentYearIncome = inc * Math.pow(1 + incIncrease, yearIndex);
      let yearMonthlyContrib = monthlyContribution;
      if (futureSavingsMode === "percent") {
        yearMonthlyContrib = (currentYearIncome * (Number(futureSavingsValue) / 100)) / 12;
      }
      yearContrib = yearMonthlyContrib * 12;
      yearInterest = (yearStart + yearContrib / 2) * rWork;
      currentBalance = yearStart + yearContrib + yearInterest;
      cumContributions += yearContrib;
      cumInterest += yearInterest;
    } else {
      // Retirement Drawdown Phase
      const yearsInRetire = age - ageRetire;
      yearWithdrawal = netAnnualNeededFromNestEgg * Math.pow(1 + inf, yearsInRetire);
      yearInterest = (yearStart - yearWithdrawal / 2) * rRetire;
      currentBalance = Math.max(0, yearStart - yearWithdrawal + yearInterest);
      cumInterest += yearInterest;
    }

    yearlySchedule.push({
      age,
      year: yearIndex,
      isWorking,
      startBalance: yearStart,
      contributions: yearContrib,
      withdrawals: yearWithdrawal,
      interestEarned: yearInterest,
      endingBalance: currentBalance,
    });
  }

  return {
    mode: "needs",
    currentAge: ageNow,
    retirementAge: ageRetire,
    lifeExpectancy: ageLife,
    incomeAtRetirement,
    annualIncomeNeeded,
    otherIncomeFutureAnnual,
    netAnnualNeededFromNestEgg,
    targetNestEgg,
    trajectoryNestEgg,
    gap,
    isOnTrack,
    onTrackPercent: onTrackPercent.toFixed(1),
    monthlyContribution,
    requiredAdditionalMonthlySavings,
    totalMonthlySavingsTarget: monthlyContribution + requiredAdditionalMonthlySavings,
    yearlySchedule,
  };
}

/**
 * Mode B: "How can you save for retirement?"
 */
export function calculateSavingsPlan(inputs) {
  const {
    currentAge = 30,
    retirementAge = 67,
    targetNestEgg = 1000000,
    currentSavings = 50000,
    returnWork = 7.0,
  } = inputs;

  const ageNow = Math.max(18, Math.min(100, Number(currentAge) || 30));
  const ageRetire = Math.max(ageNow + 1, Math.min(105, Number(retirementAge) || 67));
  const target = Math.max(1000, Number(targetNestEgg) || 1000000);
  const curSavings = Math.max(0, Number(currentSavings) || 0);

  const nWork = ageRetire - ageNow;
  const mWork = nWork * 12;
  const rWork = Math.max(0, Number(returnWork) || 0) / 100;
  const rmWork = rWork / 12;

  const fvSavings = curSavings * Math.pow(1 + rWork, nWork);
  const remainingTarget = Math.max(0, target - fvSavings);

  let requiredMonthlyContribution = 0;
  if (remainingTarget > 0 && rmWork > 0 && mWork > 0) {
    requiredMonthlyContribution = (remainingTarget * rmWork) / (Math.pow(1 + rmWork, mWork) - 1);
  }

  const requiredAnnualContribution = requiredMonthlyContribution * 12;
  const totalOutofPocket = curSavings + requiredMonthlyContribution * mWork;
  const totalInterestEarned = Math.max(0, target - totalOutofPocket);

  return {
    mode: "savings_plan",
    currentAge: ageNow,
    retirementAge: ageRetire,
    nWork,
    targetNestEgg: target,
    currentSavings: curSavings,
    fvSavings,
    remainingTarget,
    requiredMonthlyContribution,
    requiredAnnualContribution,
    totalOutofPocket,
    totalInterestEarned,
  };
}

/**
 * Mode C: "How much can you withdraw after retirement?"
 */
export function calculateSustainableWithdrawal(inputs) {
  const {
    currentAge = 30,
    retirementAge = 67,
    lifeExpectancy = 90,
    currentSavings = 50000,
    monthlyContribution = 500,
    returnWork = 7.0,
    returnRetire = 5.0,
    inflationRate = 2.6,
  } = inputs;

  const ageNow = Math.max(18, Math.min(100, Number(currentAge) || 30));
  const ageRetire = Math.max(ageNow + 1, Math.min(105, Number(retirementAge) || 67));
  const ageLife = Math.max(ageRetire + 1, Math.min(115, Number(lifeExpectancy) || 90));

  const nWork = ageRetire - ageNow;
  const nRetire = ageLife - ageRetire;
  const mWork = nWork * 12;

  const curSavings = Math.max(0, Number(currentSavings) || 0);
  const mContrib = Math.max(0, Number(monthlyContribution) || 0);

  const rWork = Math.max(0, Number(returnWork) || 0) / 100;
  const rRetire = Math.max(0, Number(returnRetire) || 0) / 100;
  const inf = Math.max(0, Number(inflationRate) || 0) / 100;
  const rmWork = rWork / 12;

  const fvSavings = curSavings * Math.pow(1 + rWork, nWork);
  let fvContrib = 0;
  if (rmWork > 0 && mWork > 0) {
    fvContrib = mContrib * ((Math.pow(1 + rmWork, mWork) - 1) / rmWork);
  } else {
    fvContrib = mContrib * mWork;
  }

  const totalNestEggAtRetirement = fvSavings + fvContrib;

  // Real return during retirement
  const realRetireReturn = (1 + rRetire) / (1 + inf) - 1;

  let sustainableAnnualWithdrawal = 0;
  if (realRetireReturn !== 0 && nRetire > 0) {
    sustainableAnnualWithdrawal =
      totalNestEggAtRetirement * (realRetireReturn / (1 - Math.pow(1 + realRetireReturn, -nRetire)));
  } else {
    sustainableAnnualWithdrawal = totalNestEggAtRetirement / nRetire;
  }

  const sustainableMonthlyWithdrawal = sustainableAnnualWithdrawal / 12;

  return {
    mode: "withdrawal",
    currentAge: ageNow,
    retirementAge: ageRetire,
    lifeExpectancy: ageLife,
    nWork,
    nRetire,
    totalNestEggAtRetirement,
    sustainableAnnualWithdrawal,
    sustainableMonthlyWithdrawal,
    totalLifetimeWithdrawals: sustainableAnnualWithdrawal * nRetire,
  };
}

/**
 * Mode D: "How long can your money last?"
 */
export function calculateDrawdownDuration(inputs) {
  const {
    nestEgg = 500000,
    monthlyWithdrawal = 3000,
    returnRetire = 5.0,
    inflationRate = 2.6,
  } = inputs;

  const egg = Math.max(1000, Number(nestEgg) || 500000);
  const wMonthly = Math.max(1, Number(monthlyWithdrawal) || 3000);
  const rRetire = Math.max(0, Number(returnRetire) || 0) / 100;
  const inf = Math.max(0, Number(inflationRate) || 0) / 100;

  const realMonthlyReturn = ((1 + rRetire) / (1 + inf) - 1) / 12;

  let isIndefinite = false;
  let totalMonths = 0;

  if (realMonthlyReturn > 0 && wMonthly <= egg * realMonthlyReturn) {
    isIndefinite = true;
    totalMonths = 1200; // 100+ years
  } else {
    if (realMonthlyReturn > 0) {
      totalMonths = Math.log(1 / (1 - (egg * realMonthlyReturn) / wMonthly)) / Math.log(1 + realMonthlyReturn);
    } else {
      totalMonths = egg / wMonthly;
    }
  }

  const years = Math.floor(totalMonths / 12);
  const months = Math.round(totalMonths % 12);

  return {
    mode: "drawdown",
    nestEgg: egg,
    monthlyWithdrawal: wMonthly,
    totalMonths: Math.round(totalMonths),
    durationYears: years,
    durationMonths: months,
    isIndefinite,
    formattedDuration: isIndefinite
      ? "Indefinitely (30+ Years)"
      : `${years} ${years === 1 ? "Year" : "Years"}, ${months} ${months === 1 ? "Month" : "Months"}`,
  };
}
