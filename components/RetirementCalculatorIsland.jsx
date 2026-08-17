"use client";

import { useState, useMemo } from "react";
import {
  calculateRetirementNeeds,
  calculateSavingsPlan,
  calculateSustainableWithdrawal,
  calculateDrawdownDuration,
  formatCurrency,
} from "@/lib/calculations/retirement";
import styles from "./RetirementCalculatorIsland.module.css";

export default function RetirementCalculatorIsland() {
  const [activeMode, setActiveMode] = useState("needs"); // 'needs' | 'savings_plan' | 'withdrawal' | 'drawdown'

  // MODE A State
  const [needsAge, setNeedsAge] = useState(30);
  const [needsRetireAge, setNeedsRetireAge] = useState(67);
  const [needsLifeAge, setNeedsLifeAge] = useState(90);
  const [needsIncome, setNeedsIncome] = useState(80000);
  const [needsIncomeIncrease, setNeedsIncomeIncrease] = useState(2.5);
  const [needsIncomeMode, setNeedsIncomeMode] = useState("percent"); // 'percent' | 'amount'
  const [needsIncomeVal, setNeedsIncomeVal] = useState(80);
  const [needsReturnWork, setNeedsReturnWork] = useState(7.0);
  const [needsReturnRetire, setNeedsReturnRetire] = useState(5.0);
  const [needsInflation, setNeedsInflation] = useState(2.6);
  const [needsOtherIncome, setNeedsOtherIncome] = useState(0);
  const [needsSavings, setNeedsSavings] = useState(50000);
  const [needsFutureSavingsMode, setNeedsFutureSavingsMode] = useState("percent"); // 'percent' | 'amount'
  const [needsFutureSavingsVal, setNeedsFutureSavingsVal] = useState(10);

  // MODE B State
  const [bAge, setBAge] = useState(30);
  const [bRetireAge, setBRetireAge] = useState(67);
  const [bTarget, setBTarget] = useState(1000000);
  const [bSavings, setBSavings] = useState(50000);
  const [bReturnWork, setBReturnWork] = useState(7.0);

  // MODE C State
  const [cAge, setCAge] = useState(30);
  const [cRetireAge, setCRetireAge] = useState(67);
  const [cLifeAge, setCLifeAge] = useState(90);
  const [cSavings, setCSavings] = useState(50000);
  const [cMonthlyContrib, setCMonthlyContrib] = useState(500);
  const [cReturnWork, setCReturnWork] = useState(7.0);
  const [cReturnRetire, setCReturnRetire] = useState(5.0);
  const [cInflation, setCInflation] = useState(2.6);

  // MODE D State
  const [dNestEgg, setDNestEgg] = useState(500000);
  const [dWithdrawal, setDWithdrawal] = useState(3000);
  const [dReturnRetire, setDReturnRetire] = useState(5.0);
  const [dInflation, setDInflation] = useState(2.6);

  const [toastMessage, setToastMessage] = useState(null);

  // Evaluate Active Mode Calculations
  const needsResult = useMemo(() => {
    if (activeMode !== "needs") return null;
    return calculateRetirementNeeds({
      currentAge: needsAge,
      retirementAge: needsRetireAge,
      lifeExpectancy: needsLifeAge,
      currentIncome: needsIncome,
      incomeIncreaseRate: needsIncomeIncrease,
      incomeNeededMode: needsIncomeMode,
      incomeNeededValue: needsIncomeVal,
      returnWork: needsReturnWork,
      returnRetire: needsReturnRetire,
      inflationRate: needsInflation,
      otherRetirementIncomeMonthly: needsOtherIncome,
      currentSavings: needsSavings,
      futureSavingsMode: needsFutureSavingsMode,
      futureSavingsValue: needsFutureSavingsVal,
    });
  }, [
    activeMode,
    needsAge,
    needsRetireAge,
    needsLifeAge,
    needsIncome,
    needsIncomeIncrease,
    needsIncomeMode,
    needsIncomeVal,
    needsReturnWork,
    needsReturnRetire,
    needsInflation,
    needsOtherIncome,
    needsSavings,
    needsFutureSavingsMode,
    needsFutureSavingsVal,
  ]);

  const planResult = useMemo(() => {
    if (activeMode !== "savings_plan") return null;
    return calculateSavingsPlan({
      currentAge: bAge,
      retirementAge: bRetireAge,
      targetNestEgg: bTarget,
      currentSavings: bSavings,
      returnWork: bReturnWork,
    });
  }, [activeMode, bAge, bRetireAge, bTarget, bSavings, bReturnWork]);

  const withdrawalResult = useMemo(() => {
    if (activeMode !== "withdrawal") return null;
    return calculateSustainableWithdrawal({
      currentAge: cAge,
      retirementAge: cRetireAge,
      lifeExpectancy: cLifeAge,
      currentSavings: cSavings,
      monthlyContribution: cMonthlyContrib,
      returnWork: cReturnWork,
      returnRetire: cReturnRetire,
      inflationRate: cInflation,
    });
  }, [activeMode, cAge, cRetireAge, cLifeAge, cSavings, cMonthlyContrib, cReturnWork, cReturnRetire, cInflation]);

  const drawdownResult = useMemo(() => {
    if (activeMode !== "drawdown") return null;
    return calculateDrawdownDuration({
      nestEgg: dNestEgg,
      monthlyWithdrawal: dWithdrawal,
      returnRetire: dReturnRetire,
      inflationRate: dInflation,
    });
  }, [activeMode, dNestEgg, dWithdrawal, dReturnRetire, dInflation]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyShareLink = () => {
    let summaryText = "";
    if (activeMode === "needs" && needsResult) {
      summaryText = `Retirement Planning Summary (Holy Calculator):
• Target Nest Egg Needed: ${formatCurrency(needsResult.targetNestEgg)}
• Projected Nest Egg on Trajectory: ${formatCurrency(needsResult.trajectoryNestEgg)}
• Status: ${needsResult.isOnTrack ? "On Track 🎉" : `Shortfall of ${formatCurrency(Math.abs(needsResult.gap))}`}
• Required Monthly Savings Target: ${formatCurrency(needsResult.totalMonthlySavingsTarget)} / mo`;
    } else if (activeMode === "savings_plan" && planResult) {
      summaryText = `Retirement Savings Plan Summary (Holy Calculator):
• Target Nest Egg: ${formatCurrency(planResult.targetNestEgg)}
• Required Monthly Contribution: ${formatCurrency(planResult.requiredMonthlyContribution)} / mo
• Required Annual Contribution: ${formatCurrency(planResult.requiredAnnualContribution)} / yr`;
    } else if (activeMode === "withdrawal" && withdrawalResult) {
      summaryText = `Sustainable Retirement Withdrawal Summary (Holy Calculator):
• Projected Nest Egg at Retirement: ${formatCurrency(withdrawalResult.totalNestEggAtRetirement)}
• Sustainable Monthly Withdrawal: ${formatCurrency(withdrawalResult.sustainableMonthlyWithdrawal)} / mo
• Total Lifetime Withdrawals: ${formatCurrency(withdrawalResult.totalLifetimeWithdrawals)}`;
    } else if (activeMode === "drawdown" && drawdownResult) {
      summaryText = `Retirement Drawdown Duration Summary (Holy Calculator):
• Nest Egg: ${formatCurrency(drawdownResult.nestEgg)}
• Monthly Withdrawal: ${formatCurrency(drawdownResult.monthlyWithdrawal)} / mo
• Savings Duration: ${drawdownResult.formattedDuration}`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText)
        .then(() => showToast("✓ Retirement summary copied to clipboard!"))
        .catch(() => fallbackCopy(summaryText));
    } else {
      fallbackCopy(summaryText);
    }
  };

  const fallbackCopy = (text) => {
    try {
      const tempInput = document.createElement("textarea");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      showToast("✓ Retirement summary copied to clipboard!");
    } catch (e) {
      showToast("Unable to copy summary automatically");
    }
  };

  // Compute SVG Growth / Drawdown Accumulation Chart for Mode A
  const needsChartData = useMemo(() => {
    if (!needsResult || !needsResult.yearlySchedule) return null;
    const schedule = needsResult.yearlySchedule;

    const width = 500;
    const height = 130;
    const padding = { top: 15, right: 15, bottom: 25, left: 45 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const totalYears = schedule.length;
    const maxVal = Math.max(...schedule.map((s) => s.endingBalance), needsResult.targetNestEgg, 1);

    const pathPoints = schedule.map((pt, idx) => {
      const x = padding.left + (idx / (totalYears - 1)) * chartW;
      const y = padding.top + chartH - (pt.endingBalance / maxVal) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const balancePath = `M ${pathPoints.join(" L ")}`;

    return {
      width,
      height,
      padding,
      chartW,
      chartH,
      maxVal,
      balancePath,
      retireIndex: schedule.findIndex((s) => !s.isWorking),
    };
  }, [needsResult]);

  return (
    <div className={styles.calcMain}>
      {/* Toast Notification */}
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      {/* Main Interactive Calculator Card */}
      <div className={styles.calcCard}>
        {/* Card Header */}
        <div className={styles.calcCardHeader}>
          <div className={styles.calcCardTitle}>
            <div className={styles.calcBadgeIcon}>🌴</div>
            <h2>Retirement Calculator</h2>
          </div>
          <span className={styles.categoryBadge}>Finance • 4 Calculation Modes</span>
        </div>

        {/* 4 Mode Selector Tabs */}
        <div className={styles.modeTabsWrapper}>
          <div className={styles.modeTabs}>
            <button
              type="button"
              className={`${styles.modeTabBtn} ${activeMode === "needs" ? styles.activeModeTab : ""}`}
              onClick={() => setActiveMode("needs")}
            >
              1. How Much Do You Need?
            </button>
            <button
              type="button"
              className={`${styles.modeTabBtn} ${activeMode === "savings_plan" ? styles.activeModeTab : ""}`}
              onClick={() => setActiveMode("savings_plan")}
            >
              2. Savings Plan Mode
            </button>
            <button
              type="button"
              className={`${styles.modeTabBtn} ${activeMode === "withdrawal" ? styles.activeModeTab : ""}`}
              onClick={() => setActiveMode("withdrawal")}
            >
              3. Withdrawal Mode
            </button>
            <button
              type="button"
              className={`${styles.modeTabBtn} ${activeMode === "drawdown" ? styles.activeModeTab : ""}`}
              onClick={() => setActiveMode("drawdown")}
            >
              4. Drawdown Duration
            </button>
          </div>
        </div>

        {/* 2-COLUMN DESKTOP GRID: Inputs Left, Sticky Live Results Right */}
        <div className={styles.calculatorTwoColGrid}>
          {/* LEFT COLUMN: Inputs for Active Mode */}
          <div className={styles.inputsColumn}>
            {/* MODE A INPUTS */}
            {activeMode === "needs" && (
              <div className={styles.formSection}>
                <div className={styles.inputsGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Current Age</label>
                    <input
                      type="number"
                      min="18"
                      max="90"
                      className={styles.numberInput}
                      value={needsAge}
                      onChange={(e) => setNeedsAge(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Planned Retirement Age</label>
                    <input
                      type="number"
                      min={needsAge + 1}
                      max="100"
                      className={styles.numberInput}
                      value={needsRetireAge}
                      onChange={(e) => setNeedsRetireAge(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Life Expectancy (Age)</label>
                    <input
                      type="number"
                      min={needsRetireAge + 1}
                      max="115"
                      className={styles.numberInput}
                      value={needsLifeAge}
                      onChange={(e) => setNeedsLifeAge(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Current Pre-Tax Income ($ / yr)</label>
                    <input
                      type="number"
                      step="2500"
                      className={styles.currencyInput}
                      value={needsIncome}
                      onChange={(e) => setNeedsIncome(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Income Growth Rate (% / yr)</label>
                    <input
                      type="number"
                      step="0.25"
                      className={styles.numberInput}
                      value={needsIncomeIncrease}
                      onChange={(e) => setNeedsIncomeIncrease(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <div className={styles.inputLabelGroup}>
                      <label className={styles.inputLabel}>Income Needed After Retirement</label>
                      <div className={styles.togglePillGroup}>
                        <button
                          type="button"
                          className={`${styles.togglePill} ${needsIncomeMode === "percent" ? styles.activePill : ""}`}
                          onClick={() => setNeedsIncomeMode("percent")}
                        >
                          %
                        </button>
                        <button
                          type="button"
                          className={`${styles.togglePill} ${needsIncomeMode === "amount" ? styles.activePill : ""}`}
                          onClick={() => setNeedsIncomeMode("amount")}
                        >
                          $ / yr
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      step={needsIncomeMode === "percent" ? "5" : "2500"}
                      className={styles.numberInput}
                      value={needsIncomeVal}
                      onChange={(e) => setNeedsIncomeVal(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Investment Return Before Retirement (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      className={styles.numberInput}
                      value={needsReturnWork}
                      onChange={(e) => setNeedsReturnWork(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Investment Return During Retirement (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      className={styles.numberInput}
                      value={needsReturnRetire}
                      onChange={(e) => setNeedsReturnRetire(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Inflation Rate (% / yr)</label>
                    <input
                      type="number"
                      step="0.1"
                      className={styles.numberInput}
                      value={needsInflation}
                      onChange={(e) => setNeedsInflation(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Current Retirement Savings ($)</label>
                    <input
                      type="number"
                      step="5000"
                      className={styles.currencyInput}
                      value={needsSavings}
                      onChange={(e) => setNeedsSavings(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <div className={styles.inputLabelGroup}>
                      <label className={styles.inputLabel}>Future Retirement Savings</label>
                      <div className={styles.togglePillGroup}>
                        <button
                          type="button"
                          className={`${styles.togglePill} ${needsFutureSavingsMode === "percent" ? styles.activePill : ""}`}
                          onClick={() => setNeedsFutureSavingsMode("percent")}
                        >
                          % Inc
                        </button>
                        <button
                          type="button"
                          className={`${styles.togglePill} ${needsFutureSavingsMode === "amount" ? styles.activePill : ""}`}
                          onClick={() => setNeedsFutureSavingsMode("amount")}
                        >
                          $ / mo
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      step={needsFutureSavingsMode === "percent" ? "1" : "100"}
                      className={styles.numberInput}
                      value={needsFutureSavingsVal}
                      onChange={(e) => setNeedsFutureSavingsVal(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Other Income (Social Security/Pension $ / mo)</label>
                    <input
                      type="number"
                      step="100"
                      className={styles.currencyInput}
                      value={needsOtherIncome}
                      onChange={(e) => setNeedsOtherIncome(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODE B INPUTS */}
            {activeMode === "savings_plan" && (
              <div className={styles.formSection}>
                <div className={styles.inputsGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Current Age</label>
                    <input
                      type="number"
                      min="18"
                      className={styles.numberInput}
                      value={bAge}
                      onChange={(e) => setBAge(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Planned Retirement Age</label>
                    <input
                      type="number"
                      min={bAge + 1}
                      className={styles.numberInput}
                      value={bRetireAge}
                      onChange={(e) => setBRetireAge(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Target Amount Needed at Retirement ($)</label>
                    <input
                      type="number"
                      step="50000"
                      className={styles.currencyInput}
                      value={bTarget}
                      onChange={(e) => setBTarget(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Current Retirement Savings ($)</label>
                    <input
                      type="number"
                      step="5000"
                      className={styles.currencyInput}
                      value={bSavings}
                      onChange={(e) => setBSavings(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Average Investment Return (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      className={styles.numberInput}
                      value={bReturnWork}
                      onChange={(e) => setBReturnWork(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODE C INPUTS */}
            {activeMode === "withdrawal" && (
              <div className={styles.formSection}>
                <div className={styles.inputsGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Current Age</label>
                    <input
                      type="number"
                      className={styles.numberInput}
                      value={cAge}
                      onChange={(e) => setCAge(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Planned Retirement Age</label>
                    <input
                      type="number"
                      className={styles.numberInput}
                      value={cRetireAge}
                      onChange={(e) => setCRetireAge(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Life Expectancy (Age)</label>
                    <input
                      type="number"
                      className={styles.numberInput}
                      value={cLifeAge}
                      onChange={(e) => setCLifeAge(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Current Retirement Savings ($)</label>
                    <input
                      type="number"
                      step="5000"
                      className={styles.currencyInput}
                      value={cSavings}
                      onChange={(e) => setCSavings(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Monthly Contribution ($ / mo)</label>
                    <input
                      type="number"
                      step="100"
                      className={styles.currencyInput}
                      value={cMonthlyContrib}
                      onChange={(e) => setCMonthlyContrib(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Return Before Retirement (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      className={styles.numberInput}
                      value={cReturnWork}
                      onChange={(e) => setCReturnWork(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Return During Retirement (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      className={styles.numberInput}
                      value={cReturnRetire}
                      onChange={(e) => setCReturnRetire(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Inflation Rate (% / yr)</label>
                    <input
                      type="number"
                      step="0.1"
                      className={styles.numberInput}
                      value={cInflation}
                      onChange={(e) => setCInflation(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODE D INPUTS */}
            {activeMode === "drawdown" && (
              <div className={styles.formSection}>
                <div className={styles.inputsGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Nest Egg Amount at Retirement ($)</label>
                    <input
                      type="number"
                      step="25000"
                      className={styles.currencyInput}
                      value={dNestEgg}
                      onChange={(e) => setDNestEgg(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Planned Monthly Withdrawal ($ / mo)</label>
                    <input
                      type="number"
                      step="250"
                      className={styles.currencyInput}
                      value={dWithdrawal}
                      onChange={(e) => setDWithdrawal(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Return During Retirement (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      className={styles.numberInput}
                      value={dReturnRetire}
                      onChange={(e) => setDReturnRetire(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Inflation Rate (% / yr)</label>
                    <input
                      type="number"
                      step="0.1"
                      className={styles.numberInput}
                      value={dInflation}
                      onChange={(e) => setDInflation(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Results Display (Sticky Pinned on Desktop) */}
          <div className={styles.resultsColumn}>
            <div className={styles.stickyResultsCard}>
              {/* MODE A RESULTS */}
              {activeMode === "needs" && needsResult && (
                <div className={styles.resultsHero}>
                  <span className={styles.heroEyebrow}>Projected Nest Egg Needed</span>
                  <div className={styles.primaryDisplay}>
                    {formatCurrency(needsResult.targetNestEgg)}
                  </div>

                  {/* On-Track Status Badge */}
                  <div className={styles.statusBadgeRow}>
                    <span className={`${styles.statusBadge} ${needsResult.isOnTrack ? styles.onTrackBadge : styles.shortfallBadge}`}>
                      {needsResult.isOnTrack ? "✓ On Track for Retirement" : `⚠️ Shortfall of ${formatCurrency(Math.abs(needsResult.gap))}`}
                    </span>
                  </div>

                  {/* Top Accumulation SVG Chart */}
                  {needsChartData && (
                    <div className={styles.chartCard}>
                      <div className={styles.chartHeader}>
                        <span>Nest Egg Trajectory ({needsResult.currentAge} → {needsResult.lifeExpectancy} Yrs)</span>
                      </div>
                      <div className={styles.svgContainer}>
                        <svg viewBox="0 0 500 130" className={styles.chartSvg}>
                          <path d={needsChartData.balancePath} fill="none" stroke="#3B3564" strokeWidth="3" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Financial Metrics */}
                  <div className={styles.metricsTable}>
                    <div className={styles.metricRow}>
                      <span>Projected Trajectory Nest Egg:</span>
                      <strong>{formatCurrency(needsResult.trajectoryNestEgg)}</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Progress On Track:</span>
                      <strong>{needsResult.onTrackPercent}%</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Future Income at Retirement:</span>
                      <strong>{formatCurrency(needsResult.incomeAtRetirement)} / yr</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Current Monthly Savings:</span>
                      <strong>{formatCurrency(needsResult.monthlyContribution)} / mo</strong>
                    </div>

                    {!needsResult.isOnTrack && (
                      <div className={styles.metricRow}>
                        <span>Required Additional Savings:</span>
                        <strong className={styles.highlightText}>
                          +{formatCurrency(needsResult.requiredAdditionalMonthlySavings)} / mo
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MODE B RESULTS */}
              {activeMode === "savings_plan" && planResult && (
                <div className={styles.resultsHero}>
                  <span className={styles.heroEyebrow}>Required Monthly Contribution</span>
                  <div className={styles.primaryDisplay}>
                    {formatCurrency(planResult.requiredMonthlyContribution)}
                    <span className={styles.subUnitText}>/ month</span>
                  </div>

                  <div className={styles.metricsTable}>
                    <div className={styles.metricRow}>
                      <span>Required Annual Contribution:</span>
                      <strong>{formatCurrency(planResult.requiredAnnualContribution)} / yr</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Target Nest Egg:</span>
                      <strong>{formatCurrency(planResult.targetNestEgg)}</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Total Out-of-Pocket Savings:</span>
                      <strong>{formatCurrency(planResult.totalOutofPocket)}</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Compound Interest Earned:</span>
                      <strong className={styles.highlightText}>
                        {formatCurrency(planResult.totalInterestEarned)}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE C RESULTS */}
              {activeMode === "withdrawal" && withdrawalResult && (
                <div className={styles.resultsHero}>
                  <span className={styles.heroEyebrow}>Sustainable Monthly Withdrawal</span>
                  <div className={styles.primaryDisplay}>
                    {formatCurrency(withdrawalResult.sustainableMonthlyWithdrawal)}
                    <span className={styles.subUnitText}>/ month</span>
                  </div>

                  <div className={styles.metricsTable}>
                    <div className={styles.metricRow}>
                      <span>Sustainable Annual Withdrawal:</span>
                      <strong>{formatCurrency(withdrawalResult.sustainableAnnualWithdrawal)} / yr</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Projected Nest Egg at Retirement:</span>
                      <strong>{formatCurrency(withdrawalResult.totalNestEggAtRetirement)}</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Total Lifetime Withdrawals:</span>
                      <strong className={styles.highlightText}>
                        {formatCurrency(withdrawalResult.totalLifetimeWithdrawals)}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE D RESULTS */}
              {activeMode === "drawdown" && drawdownResult && (
                <div className={styles.resultsHero}>
                  <span className={styles.heroEyebrow}>Estimated Savings Duration</span>
                  <div className={styles.primaryDisplay}>
                    {drawdownResult.formattedDuration}
                  </div>

                  <div className={styles.metricsTable}>
                    <div className={styles.metricRow}>
                      <span>Starting Nest Egg:</span>
                      <strong>{formatCurrency(drawdownResult.nestEgg)}</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Planned Monthly Withdrawal:</span>
                      <strong>{formatCurrency(drawdownResult.monthlyWithdrawal)} / mo</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Status:</span>
                      <strong>
                        {drawdownResult.isIndefinite
                          ? "Indefinite (Interest covers withdrawals)"
                          : `Depletes in ~${drawdownResult.durationYears} yrs`}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Action Bar */}
              <div className={styles.cardFooter}>
                <button type="button" className={styles.shareBtn} onClick={handleCopyShareLink}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Share Retirement Summary</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Disclaimer Callout */}
        <div className={styles.disclaimerBox}>
          <div className={styles.disclaimerHeader}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <strong>Financial Disclaimer &amp; Projections Notice</strong>
          </div>
          <p>
            Retirement projections provided by Holy Calculator are estimates based on assumed rates of return and historical inflation benchmarks.
            Actual investment returns are non-linear and not guaranteed. This tool does not constitute individualized financial advice or actuarial planning.
            Consult a licensed financial advisor or fiduciary for personalized retirement planning.
          </p>
        </div>
      </div>
    </div>
  );
}
