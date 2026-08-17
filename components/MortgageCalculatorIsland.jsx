"use client";

import { useState, useMemo } from "react";
import {
  calculateMortgage,
  formatCurrency,
  formatCurrencyCents,
} from "@/lib/calculations/mortgage";
import styles from "./MortgageCalculatorIsland.module.css";

export default function MortgageCalculatorIsland() {
  // Main Inputs
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentValue, setDownPaymentValue] = useState(20);
  const [downPaymentType, setDownPaymentType] = useState("percent"); // 'percent' | 'amount'
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [startDate, setStartDate] = useState("2026-09");
  const [loanType, setLoanType] = useState("conventional"); // 'conventional' | 'fha' | 'va' | 'usda'

  // Collapsible Taxes & Fees
  const [propertyTaxValue, setPropertyTaxValue] = useState(1.2);
  const [propertyTaxType, setPropertyTaxType] = useState("percent"); // 'percent' | 'amount'
  const [homeInsurance, setHomeInsurance] = useState(1500);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [hoaFee, setHoaFee] = useState(0);
  const [otherCosts, setOtherCosts] = useState(0);

  // Collapsible Extra Payments
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [extraYearly, setExtraYearly] = useState(0);
  const [extraOneTimeAmount, setExtraOneTimeAmount] = useState(0);
  const [extraOneTimeMonth, setExtraOneTimeMonth] = useState(1);

  // Toggles & Collapse states
  const [showTaxesSection, setShowTaxesSection] = useState(true);
  const [showExtraSection, setShowExtraSection] = useState(false);
  const [showBiweekly, setShowBiweekly] = useState(false);
  const [isAmortizationExpanded, setIsAmortizationExpanded] = useState(false);
  const [scheduleView, setScheduleView] = useState("yearly"); // 'yearly' | 'monthly'

  const [toastMessage, setToastMessage] = useState(null);

  // Recalculate live
  const result = useMemo(() => {
    return calculateMortgage({
      homePrice,
      downPaymentValue,
      downPaymentType,
      loanTermYears,
      interestRate,
      startDate,
      loanType,
      propertyTaxValue,
      propertyTaxType,
      homeInsurance,
      pmiRate,
      hoaFee,
      otherCosts,
      extraMonthly,
      extraYearly,
      extraOneTimeAmount,
      extraOneTimeMonth,
    });
  }, [
    homePrice,
    downPaymentValue,
    downPaymentType,
    loanTermYears,
    interestRate,
    startDate,
    loanType,
    propertyTaxValue,
    propertyTaxType,
    homeInsurance,
    pmiRate,
    hoaFee,
    otherCosts,
    extraMonthly,
    extraYearly,
    extraOneTimeAmount,
    extraOneTimeMonth,
  ]);

  // Breakdown chart data with distinct line items for HOA and Other Costs
  const breakdownChartData = useMemo(() => {
    const items = [
      { label: "Principal & Interest", value: Math.round(result.monthlyPI), color: "#3B3564" },
      { label: "Property Tax", value: Math.round(result.monthlyTax), color: "#C9992F" },
      { label: "Home Insurance", value: Math.round(result.monthlyInsurance), color: "#4F7A5B" },
    ];

    if (result.initialMonthlyPMI > 0) {
      items.push({ label: "PMI / MIP", value: Math.round(result.initialMonthlyPMI), color: "#9C7420" });
    }
    if (result.monthlyHOA > 0) {
      items.push({ label: "HOA Fee", value: Math.round(result.monthlyHOA), color: "#5C5F6B" });
    }
    if (result.monthlyOther > 0) {
      items.push({ label: "Other Costs", value: Math.round(result.monthlyOther), color: "#8E7247" });
    }

    return items.filter((item) => item.value > 0);
  }, [result]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyShareLink = () => {
    const summaryText = `Mortgage Calculation Summary (Holy Calculator):
• Home Price: ${formatCurrency(result.homePrice)}
• Down Payment: ${formatCurrency(result.downPaymentAmount)} (${result.downPaymentPercent.toFixed(1)}%)
• Loan Amount: ${formatCurrency(result.loanAmount)}
• Interest Rate: ${result.interestRate}% (${result.loanTermYears} Years, ${result.loanType.toUpperCase()})
• Total Initial Monthly Payment: ${formatCurrency(result.totalInitialMonthlyOutofPocket)} / mo
  - Principal & Interest: ${formatCurrency(result.monthlyPI)}
  - Property Tax: ${formatCurrency(result.monthlyTax)}
  - Home Insurance: ${formatCurrency(result.monthlyInsurance)}
  ${result.initialMonthlyPMI > 0 ? `- PMI / MIP: ${formatCurrency(result.initialMonthlyPMI)}` : ""}
  ${result.monthlyHOA > 0 ? `- HOA Fee: ${formatCurrency(result.monthlyHOA)}` : ""}
  ${result.monthlyOther > 0 ? `- Other Costs: ${formatCurrency(result.monthlyOther)}` : ""}
• Total Interest Paid: ${formatCurrency(result.totalInterestPaid)}
• Estimated Payoff Date: ${result.payoffDate}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText)
        .then(() => showToast("✓ Mortgage calculation summary copied to clipboard!"))
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
      showToast("✓ Mortgage calculation summary copied to clipboard!");
    } catch (e) {
      showToast("Unable to copy summary automatically");
    }
  };

  // Compute SVG Donut Chart Paths & Arc Midpoint Text Coordinates for Percentage Labels
  const donutPaths = useMemo(() => {
    const data = breakdownChartData;
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    if (total <= 0) return [];

    let accumulatedAngle = 0;
    const radius = 60;
    const center = 80;

    return data.map((slice) => {
      const percentageVal = (slice.value / total) * 100;
      const angle = (slice.value / total) * 360;
      const startAngle = accumulatedAngle;
      const endAngle = accumulatedAngle + angle;
      const midAngle = startAngle + angle / 2;
      accumulatedAngle += angle;

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      const midRad = (midAngle - 90) * (Math.PI / 180);

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      // Coordinates for label inside arc segment
      const textX = center + radius * Math.cos(midRad);
      const textY = center + radius * Math.sin(midRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
      return {
        ...slice,
        pathData,
        percentageFormatted: `${Math.round(percentageVal)}%`,
        percentageVal,
        textX,
        textY,
      };
    });
  }, [breakdownChartData]);

  // Compute Top Loan Balance & Interest Over Time SVG Chart Paths
  const balanceChartData = useMemo(() => {
    const schedule = result.yearlySchedule;
    if (!schedule || schedule.length === 0) return null;

    const width = 500;
    const height = 130;
    const padding = { top: 15, right: 15, bottom: 25, left: 45 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const numYears = schedule.length;
    const maxVal = Math.max(result.loanAmount, result.totalInterestPaid, 1);

    // Initial year 0 point
    const points = [{ year: 0, balance: result.loanAmount, cumulativeInterest: 0 }];
    let cumInterest = 0;

    schedule.forEach((row) => {
      cumInterest += row.interestPaid;
      points.push({
        year: row.yearNumber,
        balance: row.endingBalance,
        cumulativeInterest: cumInterest,
      });
    });

    // Generate SVG path coordinates
    const balancePathPoints = points.map((pt) => {
      const x = padding.left + (pt.year / numYears) * chartW;
      const y = padding.top + chartH - (pt.balance / maxVal) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const interestPathPoints = points.map((pt) => {
      const x = padding.left + (pt.year / numYears) * chartW;
      const y = padding.top + chartH - (pt.cumulativeInterest / maxVal) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const balancePath = `M ${balancePathPoints.join(" L ")}`;
    const interestPath = `M ${interestPathPoints.join(" L ")}`;

    return {
      width,
      height,
      padding,
      chartW,
      chartH,
      numYears,
      maxVal,
      balancePath,
      interestPath,
    };
  }, [result.yearlySchedule, result.loanAmount, result.totalInterestPaid]);

  return (
    <div className={styles.calcMain}>
      {/* Toast Notification */}
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      {/* Main Interactive Calculator Card */}
      <div className={styles.calcCard}>
        {/* Card Header */}
        <div className={styles.calcCardHeader}>
          <div className={styles.calcCardTitle}>
            <div className={styles.calcBadgeIcon}>🏠</div>
            <h2>Mortgage Calculator</h2>
          </div>
          <span className={styles.categoryBadge}>Finance • PITI &amp; Amortization</span>
        </div>

        {/* 2-COLUMN DESKTOP GRID: Inputs Left, Results Right */}
        <div className={styles.calculatorTwoColGrid}>
          {/* LEFT COLUMN: Input Forms */}
          <div className={styles.inputsColumn}>
            {/* Dynamic Form Inputs */}
            <div className={styles.formSection}>
              <div className={styles.inputsGrid}>
                {/* Home Price */}
                <div className={styles.inputGroup}>
                  <label htmlFor="home-price-input" className={styles.inputLabel}>
                    Home Purchase Price ($)
                  </label>
                  <input
                    id="home-price-input"
                    type="number"
                    min="10000"
                    step="5000"
                    className={styles.currencyInput}
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                  />
                  <input
                    type="range"
                    min="50000"
                    max="2000000"
                    step="10000"
                    className={styles.rangeInput}
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                  />
                </div>

                {/* Down Payment */}
                <div className={styles.inputGroup}>
                  <div className={styles.inputLabelGroup}>
                    <label htmlFor="down-payment-input" className={styles.inputLabel}>
                      Down Payment
                    </label>
                    <div className={styles.togglePillGroup}>
                      <button
                        type="button"
                        className={`${styles.togglePill} ${downPaymentType === "percent" ? styles.activePill : ""}`}
                        onClick={() => setDownPaymentType("percent")}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        className={`${styles.togglePill} ${downPaymentType === "amount" ? styles.activePill : ""}`}
                        onClick={() => setDownPaymentType("amount")}
                      >
                        $
                      </button>
                    </div>
                  </div>
                  <input
                    id="down-payment-input"
                    type="number"
                    step={downPaymentType === "percent" ? "0.5" : "1000"}
                    className={styles.numberInput}
                    value={downPaymentValue}
                    onChange={(e) => setDownPaymentValue(Number(e.target.value))}
                  />
                  <span className={styles.inputSubtext}>
                    Equates to {formatCurrency(result.downPaymentAmount)} ({result.downPaymentPercent.toFixed(1)}% of price)
                  </span>
                </div>

                {/* Interest Rate */}
                <div className={styles.inputGroup}>
                  <label htmlFor="interest-rate-input" className={styles.inputLabel}>
                    Interest Rate (%)
                  </label>
                  <input
                    id="interest-rate-input"
                    type="number"
                    step="0.125"
                    min="0.1"
                    max="20"
                    className={styles.numberInput}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>

                {/* Loan Term presets */}
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Loan Term (Years)</label>
                  <div className={styles.presetButtons}>
                    {[30, 20, 15, 10].map((term) => (
                      <button
                        key={term}
                        type="button"
                        className={`${styles.presetBtn} ${loanTermYears === term ? styles.activePreset : ""}`}
                        onClick={() => setLoanTermYears(term)}
                      >
                        {term} yr
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loan Type */}
                <div className={styles.inputGroup}>
                  <label htmlFor="loan-type-select" className={styles.inputLabel}>
                    Loan Type
                  </label>
                  <select
                    id="loan-type-select"
                    className={styles.selectInput}
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                  >
                    <option value="conventional">Conventional (Standard PMI cancellation)</option>
                    <option value="fha">FHA (Federal Housing Administration)</option>
                    <option value="va">VA (Veterans Affairs — No Monthly PMI)</option>
                    <option value="usda">USDA (Rural Development)</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className={styles.inputGroup}>
                  <label htmlFor="start-date-input" className={styles.inputLabel}>
                    First Payment Date
                  </label>
                  <input
                    id="start-date-input"
                    type="month"
                    className={styles.dateInput}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Collapsible Taxes & Costs Section */}
            <div className={styles.accordionSection}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => setShowTaxesSection(!showTaxesSection)}
              >
                <span>Property Taxes, Home Insurance &amp; Fees</span>
                <span>{showTaxesSection ? "▲" : "▼"}</span>
              </button>

              {showTaxesSection && (
                <div className={styles.accordionBody}>
                  <div className={styles.inputsGrid}>
                    {/* Property Tax */}
                    <div className={styles.inputGroup}>
                      <div className={styles.inputLabelGroup}>
                        <label className={styles.inputLabel}>Property Tax</label>
                        <div className={styles.togglePillGroup}>
                          <button
                            type="button"
                            className={`${styles.togglePill} ${propertyTaxType === "percent" ? styles.activePill : ""}`}
                            onClick={() => setPropertyTaxType("percent")}
                          >
                            % / yr
                          </button>
                          <button
                            type="button"
                            className={`${styles.togglePill} ${propertyTaxType === "amount" ? styles.activePill : ""}`}
                            onClick={() => setPropertyTaxType("amount")}
                          >
                            $ / yr
                          </button>
                        </div>
                      </div>
                      <input
                        type="number"
                        step={propertyTaxType === "percent" ? "0.1" : "100"}
                        className={styles.numberInput}
                        value={propertyTaxValue}
                        onChange={(e) => setPropertyTaxValue(Number(e.target.value))}
                      />
                      <span className={styles.inputSubtext}>
                        = {formatCurrency(result.monthlyTax * 12)} / year ({formatCurrency(result.monthlyTax)} / mo)
                      </span>
                    </div>

                    {/* Homeowners Insurance */}
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Homeowners Insurance ($ / yr)</label>
                      <input
                        type="number"
                        step="50"
                        className={styles.numberInput}
                        value={homeInsurance}
                        onChange={(e) => setHomeInsurance(Number(e.target.value))}
                      />
                      <span className={styles.inputSubtext}>
                        = {formatCurrency(result.monthlyInsurance)} / month
                      </span>
                    </div>

                    {/* PMI / MIP Rate */}
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>
                        PMI / MIP Annual Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        disabled={loanType === "va"}
                        className={styles.numberInput}
                        value={pmiRate}
                        onChange={(e) => setPmiRate(Number(e.target.value))}
                      />
                      <span className={styles.inputSubtext}>
                        {loanType === "va"
                          ? "Waived on VA loans (No monthly PMI)"
                          : loanType === "conventional" && result.downPaymentPercent >= 20
                          ? "Waived (≥20% down payment)"
                          : `= ${formatCurrency(result.initialMonthlyPMI)} / month`}
                      </span>
                    </div>

                    {/* HOA Fee */}
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>HOA Fee ($ / mo)</label>
                      <input
                        type="number"
                        step="10"
                        className={styles.numberInput}
                        value={hoaFee}
                        onChange={(e) => setHoaFee(Number(e.target.value))}
                      />
                    </div>

                    {/* Other Costs */}
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Other Costs ($ / mo)</label>
                      <input
                        type="number"
                        step="10"
                        className={styles.numberInput}
                        value={otherCosts}
                        onChange={(e) => setOtherCosts(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Collapsible Extra Payments Section */}
            <div className={styles.accordionSection}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => setShowExtraSection(!showExtraSection)}
              >
                <span>Early Principal Payoff &amp; Extra Payments</span>
                <span>{showExtraSection ? "▲" : "▼"}</span>
              </button>

              {showExtraSection && (
                <div className={styles.accordionBody}>
                  <div className={styles.inputsGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Extra Monthly Principal ($)</label>
                      <input
                        type="number"
                        step="50"
                        className={styles.numberInput}
                        value={extraMonthly}
                        onChange={(e) => setExtraMonthly(Number(e.target.value))}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Extra Yearly Principal ($)</label>
                      <input
                        type="number"
                        step="500"
                        className={styles.numberInput}
                        value={extraYearly}
                        onChange={(e) => setExtraYearly(Number(e.target.value))}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>One-Time Extra Principal ($)</label>
                      <div className={styles.twoInputsRow}>
                        <input
                          type="number"
                          placeholder="Amount ($)"
                          className={styles.numberInput}
                          value={extraOneTimeAmount || ""}
                          onChange={(e) => setExtraOneTimeAmount(Number(e.target.value))}
                        />
                        <input
                          type="number"
                          min="1"
                          max={loanTermYears * 12}
                          placeholder="Month #"
                          className={styles.numberInput}
                          value={extraOneTimeMonth || ""}
                          onChange={(e) => setExtraOneTimeMonth(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Toggle: Biweekly Payment Comparison */}
            <div className={styles.toggleRow}>
              <label htmlFor="biweekly-toggle" className={styles.toggleLabel}>
                <input
                  id="biweekly-toggle"
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={showBiweekly}
                  onChange={(e) => setShowBiweekly(e.target.checked)}
                />
                <span>Show Biweekly Payment Savings Comparison</span>
              </label>
            </div>

            {/* Biweekly Comparison Card */}
            {showBiweekly && (
              <div className={styles.biweeklyCard}>
                <div className={styles.biweeklyHeader}>
                  <span className={styles.biweeklyTitle}>Biweekly Payment Plan Advantage</span>
                  <span className={styles.biweeklyBadge}>26 Half-Payments / Year</span>
                </div>

                <div className={styles.biweeklyGrid}>
                  <div className={styles.biweeklyStat}>
                    <span className={styles.statLabel}>Biweekly Payment Amount</span>
                    <span className={styles.statValue}>
                      {formatCurrencyCents(result.biweekly.biweeklyPayment)} / 2 wks
                    </span>
                    <span className={styles.statSub}>(= 1 extra full payment per year)</span>
                  </div>

                  <div className={styles.biweeklyStat}>
                    <span className={styles.statLabel}>Total Interest Saved</span>
                    <span className={styles.statHighlight}>
                      {formatCurrency(result.biweekly.interestSaved)}
                    </span>
                  </div>

                  <div className={styles.biweeklyStat}>
                    <span className={styles.statLabel}>Payoff Time Saved</span>
                    <span className={styles.statHighlight}>
                      {result.biweekly.yearsSaved} Years Shaved Off
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Live Results Display (Sticky Pinned on Desktop) */}
          <div className={styles.resultsColumn}>
            <div className={styles.stickyResultsCard}>
              {/* Primary Results Hero */}
              <div className={styles.resultsHero}>
                <span className={styles.heroEyebrow}>Total Monthly Out-of-Pocket Payment</span>
                <div className={styles.monthlyDisplay}>
                  {formatCurrency(result.totalInitialMonthlyOutofPocket)}
                  <span className={styles.perMonthText}>/ month</span>
                </div>

                {/* Surfaced Top Amortization Balance & Interest Over Time SVG Chart */}
                {balanceChartData && (
                  <div className={styles.topAmortizationChartCard}>
                    <div className={styles.chartHeaderRow}>
                      <span className={styles.chartHeaderTitle}>Loan Amortization Overview ({result.loanTermYears} Years)</span>
                      <div className={styles.chartLegendRow}>
                        <span className={styles.legendItem}>
                          <span className={styles.legendColorBox} style={{ background: "#3B3564" }} />
                          Balance
                        </span>
                        <span className={styles.legendItem}>
                          <span className={styles.legendColorBox} style={{ background: "#C9992F" }} />
                          Interest
                        </span>
                      </div>
                    </div>

                    <div className={styles.svgContainer}>
                      <svg viewBox="0 0 500 130" className={styles.amortizationSvg}>
                        {/* Grid Lines */}
                        <line x1="45" y1="15" x2="485" y2="15" stroke="var(--line)" strokeDasharray="3 3" />
                        <line x1="45" y1="60" x2="485" y2="60" stroke="var(--line)" strokeDasharray="3 3" />
                        <line x1="45" y1="105" x2="485" y2="105" stroke="var(--line)" />

                        {/* Y-Axis Labels */}
                        <text x="40" y="18" textAnchor="end" fontSize="9.5" fill="var(--ink-60)" fontFamily="var(--mono)">
                          {formatCurrency(balanceChartData.maxVal)}
                        </text>
                        <text x="40" y="63" textAnchor="end" fontSize="9.5" fill="var(--ink-60)" fontFamily="var(--mono)">
                          {formatCurrency(balanceChartData.maxVal / 2)}
                        </text>
                        <text x="40" y="108" textAnchor="end" fontSize="9.5" fill="var(--ink-60)" fontFamily="var(--mono)">
                          $0
                        </text>

                        {/* Remaining Balance Line Path */}
                        <path
                          d={balanceChartData.balancePath}
                          fill="none"
                          stroke="#3B3564"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />

                        {/* Cumulative Interest Paid Line Path */}
                        <path
                          d={balanceChartData.interestPath}
                          fill="none"
                          stroke="#C9992F"
                          strokeWidth="2.5"
                          strokeDasharray="5 3"
                          strokeLinecap="round"
                        />

                        {/* X-Axis Year Markers */}
                        <text x="45" y="122" textAnchor="start" fontSize="9.5" fill="var(--ink-60)" fontFamily="var(--mono)">
                          Yr 0
                        </text>
                        <text x="265" y="122" textAnchor="middle" fontSize="9.5" fill="var(--ink-60)" fontFamily="var(--mono)">
                          Yr {Math.round(result.loanTermYears / 2)}
                        </text>
                        <text x="485" y="122" textAnchor="end" fontSize="9.5" fill="var(--ink-60)" fontFamily="var(--mono)">
                          Yr {result.loanTermYears}
                        </text>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Payment Components Breakdown Pills */}
                <div className={styles.componentsPillsRow}>
                  <div className={styles.pillCard}>
                    <span className={styles.pillDot} style={{ background: "#3B3564" }} />
                    <span className={styles.pillLabel}>P&amp;I</span>
                    <span className={styles.pillValue}>{formatCurrency(result.monthlyPI)}</span>
                  </div>

                  {result.monthlyTax > 0 && (
                    <div className={styles.pillCard}>
                      <span className={styles.pillDot} style={{ background: "#C9992F" }} />
                      <span className={styles.pillLabel}>Property Tax</span>
                      <span className={styles.pillValue}>{formatCurrency(result.monthlyTax)}</span>
                    </div>
                  )}

                  {result.monthlyInsurance > 0 && (
                    <div className={styles.pillCard}>
                      <span className={styles.pillDot} style={{ background: "#4F7A5B" }} />
                      <span className={styles.pillLabel}>Insurance</span>
                      <span className={styles.pillValue}>{formatCurrency(result.monthlyInsurance)}</span>
                    </div>
                  )}

                  {result.initialMonthlyPMI > 0 && (
                    <div className={styles.pillCard}>
                      <span className={styles.pillDot} style={{ background: "#9C7420" }} />
                      <span className={styles.pillLabel}>PMI / MIP</span>
                      <span className={styles.pillValue}>{formatCurrency(result.initialMonthlyPMI)}</span>
                    </div>
                  )}

                  {result.monthlyHOA > 0 && (
                    <div className={styles.pillCard}>
                      <span className={styles.pillDot} style={{ background: "#5C5F6B" }} />
                      <span className={styles.pillLabel}>HOA Fee</span>
                      <span className={styles.pillValue}>{formatCurrency(result.monthlyHOA)}</span>
                    </div>
                  )}

                  {result.monthlyOther > 0 && (
                    <div className={styles.pillCard}>
                      <span className={styles.pillDot} style={{ background: "#8E7247" }} />
                      <span className={styles.pillLabel}>Other Costs</span>
                      <span className={styles.pillValue}>{formatCurrency(result.monthlyOther)}</span>
                    </div>
                  )}
                </div>

                {/* Donut Chart & Financial Metrics Summary */}
                <div className={styles.summaryGrid}>
                  {/* Inline SVG Donut Chart with Arc Segment Percentage Labels */}
                  <div className={styles.chartWrapper}>
                    <svg width="180" height="180" viewBox="0 0 160 160">
                      {donutPaths.map((slice, index) => (
                        <g key={index}>
                          <path
                            d={slice.pathData}
                            fill="none"
                            stroke={slice.color}
                            strokeWidth="24"
                          />
                          {slice.percentageVal >= 4 && (
                            <text
                              x={slice.textX}
                              y={slice.textY}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="#ffffff"
                              fontSize="9.5"
                              fontWeight="700"
                              fontFamily="var(--mono)"
                            >
                              {slice.percentageFormatted}
                            </text>
                          )}
                        </g>
                      ))}
                    </svg>
                    <div className={styles.chartCenterText}>
                      <span>Monthly</span>
                      <strong>{formatCurrency(result.totalInitialMonthlyOutofPocket)}</strong>
                    </div>
                  </div>

                  {/* Financial Overview Metrics */}
                  <div className={styles.metricsTable}>
                    <div className={styles.metricRow}>
                      <span>Loan Amount:</span>
                      <strong>{formatCurrency(result.loanAmount)}</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Down Payment:</span>
                      <strong>
                        {formatCurrency(result.downPaymentAmount)} ({result.downPaymentPercent.toFixed(1)}%)
                      </strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Property Tax:</span>
                      <strong>{formatCurrency(result.monthlyTax)} / mo</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Home Insurance:</span>
                      <strong>{formatCurrency(result.monthlyInsurance)} / mo</strong>
                    </div>

                    {result.initialMonthlyPMI > 0 && (
                      <div className={styles.metricRow}>
                        <span>PMI / MIP:</span>
                        <strong>{formatCurrency(result.initialMonthlyPMI)} / mo</strong>
                      </div>
                    )}

                    {result.monthlyHOA > 0 && (
                      <div className={styles.metricRow}>
                        <span>HOA Fee:</span>
                        <strong>{formatCurrency(result.monthlyHOA)} / mo</strong>
                      </div>
                    )}

                    {result.monthlyOther > 0 && (
                      <div className={styles.metricRow}>
                        <span>Other Costs:</span>
                        <strong>{formatCurrency(result.monthlyOther)} / mo</strong>
                      </div>
                    )}

                    <div className={styles.metricRow}>
                      <span>Total Interest Paid:</span>
                      <strong>{formatCurrency(result.totalInterestPaid)}</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Total Mortgage Payments:</span>
                      <strong>{formatCurrency(result.totalMortgagePayments)}</strong>
                    </div>

                    {result.pmiCancelDate && (
                      <div className={styles.metricRow}>
                        <span>PMI Auto-Cancellation (80% LTV):</span>
                        <strong className={styles.pmiHighlight}>{result.pmiCancelDate}</strong>
                      </div>
                    )}

                    <div className={styles.metricRow}>
                      <span>Estimated Payoff Date:</span>
                      <strong>{result.payoffDate} ({result.totalActualYears} yrs)</strong>
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className={styles.cardFooter}>
                  <button type="button" className={styles.shareBtn} onClick={handleCopyShareLink}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Share Calculation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH SECTION BELOW BOTH COLUMNS */}

        {/* Collapsible Amortization Schedule (CWV Protection) */}
        <div className={styles.amortizationSection}>
          <div className={styles.sectionHeadingRow}>
            <div className={styles.sectionHeading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3>Loan Amortization Schedule</h3>
            </div>

            <button
              type="button"
              className={styles.expandScheduleBtn}
              onClick={() => setIsAmortizationExpanded(!isAmortizationExpanded)}
            >
              {isAmortizationExpanded ? "Hide Full Schedule ▲" : "Expand Full Amortization Schedule ▼"}
            </button>
          </div>

          {isAmortizationExpanded && (
            <div className={styles.scheduleContainer}>
              <div className={styles.scheduleTabs}>
                <button
                  type="button"
                  className={`${styles.scheduleTab} ${scheduleView === "yearly" ? styles.activeScheduleTab : ""}`}
                  onClick={() => setScheduleView("yearly")}
                >
                  Annual Rollup Summary ({result.yearlySchedule.length} Years)
                </button>
                <button
                  type="button"
                  className={`${styles.scheduleTab} ${scheduleView === "monthly" ? styles.activeScheduleTab : ""}`}
                  onClick={() => setScheduleView("monthly")}
                >
                  Full Monthly Breakdown ({result.monthlySchedule.length} Months)
                </button>
              </div>

              <div className={styles.tableScrollWrapper}>
                {scheduleView === "yearly" ? (
                  <table className={styles.scheduleTable}>
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Period</th>
                        <th>Interest Paid</th>
                        <th>Principal Paid</th>
                        <th>PMI Paid</th>
                        <th>Total Out-of-Pocket</th>
                        <th>Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlySchedule.map((row) => (
                        <tr key={row.yearNumber}>
                          <td><strong>Year {row.yearNumber}</strong></td>
                          <td>{row.dateRange}</td>
                          <td>{formatCurrency(row.interestPaid)}</td>
                          <td>{formatCurrency(row.principalPaid)}</td>
                          <td>{formatCurrency(row.pmiPaid)}</td>
                          <td>{formatCurrency(row.totalPaid)}</td>
                          <td><strong>{formatCurrency(row.endingBalance)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className={styles.scheduleTable}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Interest</th>
                        <th>Principal</th>
                        <th>PMI</th>
                        <th>LTV %</th>
                        <th>Total Out-of-Pocket</th>
                        <th>Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.monthlySchedule.map((m) => (
                        <tr key={m.monthIndex}>
                          <td>{m.monthIndex}</td>
                          <td>{m.date}</td>
                          <td>{formatCurrencyCents(m.interestPaid)}</td>
                          <td>{formatCurrencyCents(m.principalPaid)}</td>
                          <td>{formatCurrencyCents(m.pmiPaid)}</td>
                          <td>{m.ltv.toFixed(1)}%</td>
                          <td>{formatCurrencyCents(m.totalPaid)}</td>
                          <td><strong>{formatCurrencyCents(m.endingBalance)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Financial Disclaimer Callout */}
        <div className={styles.disclaimerBox}>
          <div className={styles.disclaimerHeader}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <strong>Financial Disclaimer &amp; Notice</strong>
          </div>
          <p>
            Calculations provided by Holy Calculator are estimates for educational planning purposes only.
            Actual interest rates, closing costs, insurance premiums, taxes, and loan qualification criteria are set by
            lenders and local tax authorities. This tool does not constitute financial advice, credit approval, or a binding loan offer.
          </p>
        </div>
      </div>
    </div>
  );
}
