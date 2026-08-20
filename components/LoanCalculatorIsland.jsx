"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl } from "@/lib/calculations/retentionHelpers";
import {
  calculateAmortizedLoan,
  calculateDeferredLoan,
  calculateBondLoan,
  formatCurrency,
  formatCurrencyCents,
  COMPOUND_FREQUENCIES,
  PAYBACK_FREQUENCIES,
} from "@/lib/calculations/compoundInterest";
import styles from "./LoanCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_loan_history";

export default function LoanCalculatorIsland() {
  const [activeMode, setActiveMode] = useState("amortized"); // 'amortized' | 'deferred' | 'bond'

  // Mode A (Amortized Loan) State
  const [aAmount, setAAmount] = useState(20000);
  const [aTermVal, setATermVal] = useState(5);
  const [aTermUnit, setATermUnit] = useState("years"); // 'years' | 'months'
  const [aRate, setARate] = useState(6.0);
  const [aCompound, setACompound] = useState("monthly");
  const [aPayback, setAPayback] = useState("monthly");

  // Mode B (Deferred Payment Loan) State
  const [bAmount, setBAmount] = useState(10000);
  const [bTermVal, setBTermVal] = useState(3);
  const [bTermUnit, setBTermUnit] = useState("years");
  const [bRate, setBRate] = useState(5.0);
  const [bCompound, setBCompound] = useState("monthly");

  // Mode C (Bond / Present Value) State
  const [cFaceVal, setCFaceVal] = useState(10000);
  const [cTermVal, setCTermVal] = useState(5);
  const [cTermUnit, setCTermUnit] = useState("years");
  const [cRate, setCRate] = useState(6.0);
  const [cCompound, setCCompound] = useState("annually");

  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("amount")) setAAmount(parseFloat(params.get("amount")) || 20000);
    if (params.has("term")) setATermVal(parseInt(params.get("term"), 10) || 5);
    if (params.has("rate")) setARate(parseFloat(params.get("rate")) || 6.0);

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        amount: aAmount,
        term: aTermVal,
        rate: aRate,
      });
    }, 300);
    return () => clearTimeout(syncTimerRef.current);
  }, [aAmount, aTermVal, aRate]);

  const [toastMessage, setToastMessage] = useState(null);

  // Recalculate live for active mode
  const amortizedResult = useMemo(() => {
    if (activeMode !== "amortized") return null;
    return calculateAmortizedLoan({
      loanAmount: aAmount,
      loanTermValue: aTermVal,
      loanTermUnit: aTermUnit,
      interestRate: aRate,
      compoundFrequency: aCompound,
      paybackFrequency: aPayback,
    });
  }, [activeMode, aAmount, aTermVal, aTermUnit, aRate, aCompound, aPayback]);

  const deferredResult = useMemo(() => {
    if (activeMode !== "deferred") return null;
    return calculateDeferredLoan({
      loanAmount: bAmount,
      loanTermValue: bTermVal,
      loanTermUnit: bTermUnit,
      interestRate: bRate,
      compoundFrequency: bCompound,
    });
  }, [activeMode, bAmount, bTermVal, bTermUnit, bRate, bCompound]);

  const bondResult = useMemo(() => {
    if (activeMode !== "bond") return null;
    return calculateBondLoan({
      faceValue: cFaceVal,
      loanTermValue: cTermVal,
      loanTermUnit: cTermUnit,
      interestRate: cRate,
      compoundFrequency: cCompound,
    });
  }, [activeMode, cFaceVal, cTermVal, cTermUnit, cRate, cCompound]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyShareLink = () => {
    let summaryText = "";
    if (activeMode === "amortized" && amortizedResult) {
      summaryText = `Amortized Loan Summary (Holy Calculator):
• Loan Amount: ${formatCurrency(amortizedResult.principal)}
• Loan Term: ${amortizedResult.years} Years
• Interest Rate: ${amortizedResult.interestRate}% (${amortizedResult.compoundFrequency} compounding)
• Payment per Period: ${formatCurrencyCents(amortizedResult.paymentPerPeriod)} / ${amortizedResult.paybackFrequency}
• Total Payments: ${formatCurrency(amortizedResult.totalPaid)}
• Total Interest: ${formatCurrency(amortizedResult.totalInterest)}`;
    } else if (activeMode === "deferred" && deferredResult) {
      summaryText = `Deferred Loan Summary (Holy Calculator):
• Loan Amount: ${formatCurrency(deferredResult.principal)}
• Loan Term: ${deferredResult.years} Years @ ${deferredResult.interestRate}%
• Amount Due at Maturity: ${formatCurrency(deferredResult.amountDueAtMaturity)}
• Total Interest Accumulated: ${formatCurrency(deferredResult.totalInterest)}`;
    } else if (activeMode === "bond" && bondResult) {
      summaryText = `Bond Present Value Summary (Holy Calculator):
• Maturity Face Value: ${formatCurrency(bondResult.faceValue)}
• Loan Term: ${bondResult.years} Years @ ${bondResult.interestRate}%
• Amount Received When Loan Starts (PV): ${formatCurrency(bondResult.presentValueReceived)}
• Total Interest / Discount: ${formatCurrency(bondResult.totalDiscountInterest)}`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText)
        .then(() => showToast("✓ Loan summary copied to clipboard!"))
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
      showToast("✓ Loan summary copied to clipboard!");
    } catch (e) {
      showToast("Unable to copy summary automatically");
    }
  };

  // Compute SVG Donut Chart Paths & Arc Midpoint Text Coordinates
  const currentResult = amortizedResult || deferredResult || bondResult;

  const breakdownData = useMemo(() => {
    if (!currentResult) return [];
    if (activeMode === "amortized") {
      return [
        { label: "Principal", value: currentResult.principal, color: "#3B3564" },
        { label: "Total Interest", value: currentResult.totalInterest, color: "#C9992F" },
      ];
    } else if (activeMode === "deferred") {
      return [
        { label: "Principal", value: currentResult.principal, color: "#3B3564" },
        { label: "Total Interest", value: currentResult.totalInterest, color: "#C9992F" },
      ];
    } else {
      return [
        { label: "Present Value", value: currentResult.presentValueReceived, color: "#3B3564" },
        { label: "Interest Discount", value: currentResult.totalDiscountInterest, color: "#C9992F" },
      ];
    }
  }, [activeMode, currentResult]);

  const donutPaths = useMemo(() => {
    const data = breakdownData;
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
  }, [breakdownData]);

  return (
    <div className={styles.calcMain}>
      {/* Toast Notification */}
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      {/* Main Interactive Calculator Card */}
      <div className={styles.calcCard}>
        {/* Card Header */}
        <div className={styles.calcCardHeader}>
          <div className={styles.calcCardTitle}>
            <div className={styles.calcBadgeIcon}>💳</div>
            <h2>Loan Calculator</h2>
          </div>
          <span className={styles.categoryBadge}>Finance • 3 Calculation Modes</span>
        </div>

        {/* 3 Mode Selector Tabs */}
        <div className={styles.modeTabsWrapper}>
          <div className={styles.modeTabs}>
            <button
              type="button"
              className={`${styles.modeTabBtn} ${activeMode === "amortized" ? styles.activeModeTab : ""}`}
              onClick={() => setActiveMode("amortized")}
            >
              1. Amortized Loan
            </button>
            <button
              type="button"
              className={`${styles.modeTabBtn} ${activeMode === "deferred" ? styles.activeModeTab : ""}`}
              onClick={() => setActiveMode("deferred")}
            >
              2. Deferred Payment Loan
            </button>
            <button
              type="button"
              className={`${styles.modeTabBtn} ${activeMode === "bond" ? styles.activeModeTab : ""}`}
              onClick={() => setActiveMode("bond")}
            >
              3. Bond (Present Value)
            </button>
          </div>
        </div>

        {/* 2-COLUMN DESKTOP GRID: Inputs Left, Sticky Live Results Right */}
        <div className={styles.calculatorTwoColGrid}>
          {/* LEFT COLUMN: Inputs for Active Mode */}
          <div className={styles.inputsColumn}>
            {/* MODE A INPUTS */}
            {activeMode === "amortized" && (
              <div className={styles.formSection}>
                <div className={styles.inputsGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Loan Amount ($)</label>
                    <input
                      type="number"
                      step="1000"
                      className={styles.currencyInput}
                      value={aAmount}
                      onChange={(e) => setAAmount(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <div className={styles.inputLabelGroup}>
                      <label className={styles.inputLabel}>Loan Term</label>
                      <div className={styles.togglePillGroup}>
                        <button
                          type="button"
                          className={`${styles.togglePill} ${aTermUnit === "years" ? styles.activePill : ""}`}
                          onClick={() => setATermUnit("years")}
                        >
                          Years
                        </button>
                        <button
                          type="button"
                          className={`${styles.togglePill} ${aTermUnit === "months" ? styles.activePill : ""}`}
                          onClick={() => setATermUnit("months")}
                        >
                          Months
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="1"
                      className={styles.numberInput}
                      value={aTermVal}
                      onChange={(e) => setATermVal(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Nominal Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.125"
                      className={styles.numberInput}
                      value={aRate}
                      onChange={(e) => setARate(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Compound Frequency</label>
                    <select
                      className={styles.selectInput}
                      value={aCompound}
                      onChange={(e) => setACompound(e.target.value)}
                    >
                      {COMPOUND_FREQUENCIES.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Pay Back Frequency</label>
                    <select
                      className={styles.selectInput}
                      value={aPayback}
                      onChange={(e) => setAPayback(e.target.value)}
                    >
                      {PAYBACK_FREQUENCIES.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* MODE B INPUTS */}
            {activeMode === "deferred" && (
              <div className={styles.formSection}>
                <div className={styles.inputsGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Loan Amount ($)</label>
                    <input
                      type="number"
                      step="1000"
                      className={styles.currencyInput}
                      value={bAmount}
                      onChange={(e) => setBAmount(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <div className={styles.inputLabelGroup}>
                      <label className={styles.inputLabel}>Loan Term</label>
                      <div className={styles.togglePillGroup}>
                        <button
                          type="button"
                          className={`${styles.togglePill} ${bTermUnit === "years" ? styles.activePill : ""}`}
                          onClick={() => setBTermUnit("years")}
                        >
                          Years
                        </button>
                        <button
                          type="button"
                          className={`${styles.togglePill} ${bTermUnit === "months" ? styles.activePill : ""}`}
                          onClick={() => setBTermUnit("months")}
                        >
                          Months
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="1"
                      className={styles.numberInput}
                      value={bTermVal}
                      onChange={(e) => setBTermVal(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.125"
                      className={styles.numberInput}
                      value={bRate}
                      onChange={(e) => setBRate(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Compound Frequency</label>
                    <select
                      className={styles.selectInput}
                      value={bCompound}
                      onChange={(e) => setBCompound(e.target.value)}
                    >
                      {COMPOUND_FREQUENCIES.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* MODE C INPUTS */}
            {activeMode === "bond" && (
              <div className={styles.formSection}>
                <div className={styles.inputsGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Predetermined Due Amount / Face Value ($)</label>
                    <input
                      type="number"
                      step="1000"
                      className={styles.currencyInput}
                      value={cFaceVal}
                      onChange={(e) => setCFaceVal(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <div className={styles.inputLabelGroup}>
                      <label className={styles.inputLabel}>Loan Term</label>
                      <div className={styles.togglePillGroup}>
                        <button
                          type="button"
                          className={`${styles.togglePill} ${cTermUnit === "years" ? styles.activePill : ""}`}
                          onClick={() => setCTermUnit("years")}
                        >
                          Years
                        </button>
                        <button
                          type="button"
                          className={`${styles.togglePill} ${cTermUnit === "months" ? styles.activePill : ""}`}
                          onClick={() => setCTermUnit("months")}
                        >
                          Months
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="1"
                      className={styles.numberInput}
                      value={cTermVal}
                      onChange={(e) => setCTermVal(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.125"
                      className={styles.numberInput}
                      value={cRate}
                      onChange={(e) => setCRate(Number(e.target.value))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Compound Frequency</label>
                    <select
                      className={styles.selectInput}
                      value={cCompound}
                      onChange={(e) => setCCompound(e.target.value)}
                    >
                      {COMPOUND_FREQUENCIES.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Live Results Display (Sticky Pinned on Desktop) */}
          <div className={styles.resultsColumn}>
            <div className={styles.stickyResultsCard}>
              {/* MODE A RESULTS */}
              {activeMode === "amortized" && amortizedResult && (
                <div className={styles.resultsHero}>
                  <span className={styles.heroEyebrow}>Periodic Payment Amount</span>
                  <div className={styles.primaryDisplay}>
                    {formatCurrencyCents(amortizedResult.paymentPerPeriod)}
                    <span className={styles.subUnitText}>/ {amortizedResult.paybackFrequency}</span>
                  </div>

                  {/* SVG Donut Chart */}
                  <div className={styles.summaryGrid}>
                    <div className={styles.chartWrapper}>
                      <svg width="170" height="170" viewBox="0 0 160 160">
                        {donutPaths.map((slice, idx) => (
                          <g key={idx}>
                            <path d={slice.pathData} fill="none" stroke={slice.color} strokeWidth="24" />
                            {slice.percentageVal >= 5 && (
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
                    </div>

                    <div className={styles.metricsTable}>
                      <div className={styles.metricRow}>
                        <span>Loan Amount:</span>
                        <strong>{formatCurrency(amortizedResult.principal)}</strong>
                      </div>
                      <div className={styles.metricRow}>
                        <span>Total Payments ({amortizedResult.totalPeriods}):</span>
                        <strong>{formatCurrency(amortizedResult.totalPaid)}</strong>
                      </div>
                      <div className={styles.metricRow}>
                        <span>Total Interest Paid:</span>
                        <strong className={styles.highlightText}>{formatCurrency(amortizedResult.totalInterest)}</strong>
                      </div>
                      <div className={styles.metricRow}>
                        <span>Effective Annual Rate (EAR):</span>
                        <strong>{amortizedResult.earPercent}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE B RESULTS */}
              {activeMode === "deferred" && deferredResult && (
                <div className={styles.resultsHero}>
                  <span className={styles.heroEyebrow}>Amount Due at Loan Maturity</span>
                  <div className={styles.primaryDisplay}>
                    {formatCurrency(deferredResult.amountDueAtMaturity)}
                  </div>

                  {/* SVG Donut Chart */}
                  <div className={styles.summaryGrid}>
                    <div className={styles.chartWrapper}>
                      <svg width="170" height="170" viewBox="0 0 160 160">
                        {donutPaths.map((slice, idx) => (
                          <g key={idx}>
                            <path d={slice.pathData} fill="none" stroke={slice.color} strokeWidth="24" />
                            {slice.percentageVal >= 5 && (
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
                    </div>

                    <div className={styles.metricsTable}>
                      <div className={styles.metricRow}>
                        <span>Initial Loan Amount:</span>
                        <strong>{formatCurrency(deferredResult.principal)}</strong>
                      </div>
                      <div className={styles.metricRow}>
                        <span>Total Interest Accumulated:</span>
                        <strong className={styles.highlightText}>{formatCurrency(deferredResult.totalInterest)}</strong>
                      </div>
                      <div className={styles.metricRow}>
                        <span>Loan Term:</span>
                        <strong>{deferredResult.years} Years</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE C RESULTS */}
              {activeMode === "bond" && bondResult && (
                <div className={styles.resultsHero}>
                  <span className={styles.heroEyebrow}>Amount Received When Loan Starts (PV)</span>
                  <div className={styles.primaryDisplay}>
                    {formatCurrency(bondResult.presentValueReceived)}
                  </div>

                  {/* SVG Donut Chart */}
                  <div className={styles.summaryGrid}>
                    <div className={styles.chartWrapper}>
                      <svg width="170" height="170" viewBox="0 0 160 160">
                        {donutPaths.map((slice, idx) => (
                          <g key={idx}>
                            <path d={slice.pathData} fill="none" stroke={slice.color} strokeWidth="24" />
                            {slice.percentageVal >= 5 && (
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
                    </div>

                    <div className={styles.metricsTable}>
                      <div className={styles.metricRow}>
                        <span>Predetermined Maturity Value:</span>
                        <strong>{formatCurrency(bondResult.faceValue)}</strong>
                      </div>
                      <div className={styles.metricRow}>
                        <span>Total Interest / Discount:</span>
                        <strong className={styles.highlightText}>{formatCurrency(bondResult.totalDiscountInterest)}</strong>
                      </div>
                      <div className={styles.metricRow}>
                        <span>Loan Term:</span>
                        <strong>{bondResult.years} Years</strong>
                      </div>
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
                  <span>Share Loan Calculation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH SECTION BELOW BOTH COLUMNS */}

        {/* Collapsible Amortization / Payment Schedule */}
        <div className={styles.amortizationSection}>
          <div className={styles.sectionHeadingRow}>
            <div className={styles.sectionHeading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3>Loan Payment &amp; Amortization Schedule</h3>
            </div>

            <button
              type="button"
              className={styles.expandScheduleBtn}
              onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
            >
              {isScheduleExpanded ? "Hide Full Schedule ▲" : "Expand Full Schedule ▼"}
            </button>
          </div>

          {isScheduleExpanded && currentResult && currentResult.schedule && (
            <div className={styles.scheduleContainer}>
              <div className={styles.tableScrollWrapper}>
                <table className={styles.scheduleTable}>
                  <thead>
                    <tr>
                      <th>{activeMode === "amortized" ? "Period #" : "Year"}</th>
                      {activeMode === "amortized" && <th>Payment Amount</th>}
                      <th>Interest</th>
                      {activeMode === "amortized" && <th>Principal Paid</th>}
                      <th>Ending Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentResult.schedule.map((row, idx) => (
                      <tr key={idx}>
                        <td><strong>{activeMode === "amortized" ? row.period : `Year ${row.year}`}</strong></td>
                        {activeMode === "amortized" && <td>{formatCurrencyCents(row.payment)}</td>}
                        <td>{formatCurrencyCents(row.interestPaid || row.interestEarned)}</td>
                        {activeMode === "amortized" && <td>{formatCurrencyCents(row.principalPaid)}</td>}
                        <td><strong>{formatCurrencyCents(row.endingBalance)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            <strong>Financial Disclaimer &amp; Terms Notice</strong>
          </div>
          <p>
            Calculations provided by Holy Calculator are estimates for comparison and educational planning purposes only.
            Actual loan terms, annual percentage rates (APR), closing fees, and repayment obligations are established by financial institutions and depend on creditworthiness. This tool does not constitute a loan application or credit commitment.
          </p>
        </div>
      </div>
    </div>
  );
}
