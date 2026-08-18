"use client";

import { useState, useMemo } from "react";
import {
  calculateCompoundGrowth,
  convertInterestRate,
  formatCurrency,
  COMPOUND_FREQUENCIES,
} from "@/lib/calculations/compoundInterest";
import styles from "./CompoundInterestCalculatorIsland.module.css";

export default function CompoundInterestCalculatorIsland() {
  // Primary Growth Calculator State
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [interestRate, setInterestRate] = useState(7.0);
  const [compoundFrequency, setCompoundFrequency] = useState("monthly");
  const [investmentYears, setInvestmentYears] = useState(10);
  const [investmentMonths, setInvestmentMonths] = useState(0);
  const [additionalContribution, setAdditionalContribution] = useState(100);
  const [contributionFrequency, setContributionFrequency] = useState("monthly");
  const [contributionTiming, setContributionTiming] = useState("end"); // 'start' | 'end'

  // Secondary Rate Converter State (Collapsible)
  const [showRateConverter, setShowRateConverter] = useState(false);
  const [converterRate, setConverterRate] = useState(6.0);
  const [converterFromFreq, setConverterFromFreq] = useState("monthly");
  const [converterToFreq, setConverterToFreq] = useState("annually");

  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Recalculate Primary Growth
  const growthResult = useMemo(() => {
    return calculateCompoundGrowth({
      initialInvestment,
      interestRate,
      compoundFrequency,
      investmentYears,
      investmentMonths,
      additionalContribution,
      contributionFrequency,
      contributionTiming,
    });
  }, [
    initialInvestment,
    interestRate,
    compoundFrequency,
    investmentYears,
    investmentMonths,
    additionalContribution,
    contributionFrequency,
    contributionTiming,
  ]);

  // Recalculate Rate Conversion
  const converterResult = useMemo(() => {
    return convertInterestRate(converterRate, converterFromFreq, converterToFreq);
  }, [converterRate, converterFromFreq, converterToFreq]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopySummary = () => {
    const summaryText = `Compound Interest Summary (Holy Calculator):
• Initial Investment: ${formatCurrency(growthResult.initialInvestment)}
• Investment Horizon: ${growthResult.totalYears.toFixed(1)} Years @ ${interestRate}% (${compoundFrequency} compounding)
• Total Out-of-Pocket Deposits: ${formatCurrency(growthResult.totalDeposits)}
• Total Interest Earned: ${formatCurrency(growthResult.totalInterestEarned)}
• Future Value: ${formatCurrency(growthResult.futureValue)}
• Rule of 72 Doubling Time: ~${growthResult.ruleOf72Years} Years`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText)
        .then(() => showToast("✓ Compound interest summary copied to clipboard!"))
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
      showToast("✓ Compound interest summary copied to clipboard!");
    } catch (e) {
      showToast("Unable to copy summary automatically");
    }
  };

  // Compute SVG Donut Chart Slices
  const breakdownData = useMemo(() => {
    const items = [
      { label: "Initial Investment", value: growthResult.initialInvestment, color: "#3B3564" },
    ];
    if (growthResult.totalContributions > 0) {
      items.push({ label: "Contributions", value: growthResult.totalContributions, color: "#4F7A5B" });
    }
    items.push({ label: "Total Interest", value: growthResult.totalInterestEarned, color: "#C9992F" });
    return items.filter((item) => item.value > 0);
  }, [growthResult]);

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

  // Compute SVG Growth Trajectory Line Chart
  const growthChartData = useMemo(() => {
    const schedule = growthResult.yearlySchedule;
    if (!schedule || schedule.length === 0) return null;

    const width = 500;
    const height = 130;
    const padding = { top: 15, right: 15, bottom: 25, left: 45 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const numYears = schedule.length;
    const maxVal = Math.max(growthResult.futureValue, 1);

    const balancePoints = schedule.map((pt, idx) => {
      const x = padding.left + (idx / (numYears - 1)) * chartW;
      const y = padding.top + chartH - (pt.endingBalance / maxVal) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const depositsPoints = schedule.map((pt, idx) => {
      const x = padding.left + (idx / (numYears - 1)) * chartW;
      const y = padding.top + chartH - (pt.totalDepositsToDate / maxVal) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return {
      maxVal,
      balancePath: `M ${balancePoints.join(" L ")}`,
      depositsPath: `M ${depositsPoints.join(" L ")}`,
    };
  }, [growthResult]);

  return (
    <div className={styles.calcMain}>
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      <div className={styles.calcCard}>
        {/* Card Header */}
        <div className={styles.calcCardHeader}>
          <div className={styles.calcCardTitle}>
            <div className={styles.calcBadgeIcon}>📈</div>
            <h2>Compound Interest Calculator</h2>
          </div>
          <span className={styles.categoryBadge}>Finance • Exponential Growth</span>
        </div>

        {/* 2-COLUMN DESKTOP GRID: Inputs Left, Sticky Live Results Right */}
        <div className={styles.calculatorTwoColGrid}>
          {/* LEFT COLUMN: Inputs */}
          <div className={styles.inputsColumn}>
            {/* 1. Primary Growth Inputs */}
            <div className={styles.formSection}>
              <div className={styles.inputsGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="initial-investment-input" className={styles.inputLabel}>
                    Initial Investment ($)
                  </label>
                  <input
                    id="initial-investment-input"
                    type="number"
                    step="1000"
                    className={styles.currencyInput}
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  />
                  <input
                    type="range"
                    min="0"
                    max="250000"
                    step="2500"
                    className={styles.rangeInput}
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="interest-rate-input" className={styles.inputLabel}>
                    Interest Rate (% / yr)
                  </label>
                  <input
                    id="interest-rate-input"
                    type="number"
                    step="0.25"
                    min="0.1"
                    max="30"
                    className={styles.numberInput}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="compound-freq-select" className={styles.inputLabel}>
                    Compound Frequency
                  </label>
                  <select
                    id="compound-freq-select"
                    className={styles.selectInput}
                    value={compoundFrequency}
                    onChange={(e) => setCompoundFrequency(e.target.value)}
                  >
                    {COMPOUND_FREQUENCIES.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Investment Horizon</label>
                  <div className={styles.twoInputsRow}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Years"
                      className={styles.numberInput}
                      value={investmentYears}
                      onChange={(e) => setInvestmentYears(Number(e.target.value))}
                    />
                    <input
                      type="number"
                      min="0"
                      max="11"
                      placeholder="Months"
                      className={styles.numberInput}
                      value={investmentMonths}
                      onChange={(e) => setInvestmentMonths(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Additional Contributions */}
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Additional Contribution ($)</label>
                  <input
                    type="number"
                    step="25"
                    className={styles.currencyInput}
                    value={additionalContribution}
                    onChange={(e) => setAdditionalContribution(Number(e.target.value))}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Contribution Frequency</label>
                  <select
                    className={styles.selectInput}
                    value={contributionFrequency}
                    onChange={(e) => setContributionFrequency(e.target.value)}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Contribution Timing</label>
                  <div className={styles.togglePillGroup}>
                    <button
                      type="button"
                      className={`${styles.togglePill} ${contributionTiming === "end" ? styles.activePill : ""}`}
                      onClick={() => setContributionTiming("end")}
                    >
                      End of Period
                    </button>
                    <button
                      type="button"
                      className={`${styles.togglePill} ${contributionTiming === "start" ? styles.activePill : ""}`}
                      onClick={() => setContributionTiming("start")}
                    >
                      Start of Period
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Secondary Utility: Collapsible Interest Rate Converter */}
            <div className={styles.accordionSection}>
              <button
                type="button"
                className={styles.accordionHeader}
                onClick={() => setShowRateConverter(!showRateConverter)}
              >
                <div className={styles.accordionHeaderTitle}>
                  <span>🔄 Interest Rate Converter (Secondary Utility)</span>
                </div>
                <span>{showRateConverter ? "▲" : "▼"}</span>
              </button>

              {showRateConverter && (
                <div className={styles.accordionBody}>
                  <p className={styles.converterSubtext}>
                    Convert a nominal interest rate under one compounding frequency to its mathematical equivalent under another compounding frequency.
                  </p>

                  <div className={styles.inputsGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Input Nominal Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className={styles.numberInput}
                        value={converterRate}
                        onChange={(e) => setConverterRate(Number(e.target.value))}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>From Compounding</label>
                      <select
                        className={styles.selectInput}
                        value={converterFromFreq}
                        onChange={(e) => setConverterFromFreq(e.target.value)}
                      >
                        {COMPOUND_FREQUENCIES.map((f) => (
                          <option key={f.key} value={f.key}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>To Compounding</label>
                      <select
                        className={styles.selectInput}
                        value={converterToFreq}
                        onChange={(e) => setConverterToFreq(e.target.value)}
                      >
                        {COMPOUND_FREQUENCIES.map((f) => (
                          <option key={f.key} value={f.key}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.converterResultCard}>
                    <div className={styles.converterRow}>
                      <span>Equivalent Nominal Rate:</span>
                      <strong>{converterResult.equivalentRatePercent}% / yr</strong>
                    </div>
                    <div className={styles.converterRow}>
                      <span>Effective Annual Rate (APY):</span>
                      <strong>{converterResult.earPercent}% APY</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Live Results Display (Sticky Pinned on Desktop) */}
          <div className={styles.resultsColumn}>
            <div className={styles.stickyResultsCard}>
              <div className={styles.resultsHero}>
                <span className={styles.heroEyebrow}>Future Value</span>
                <div className={styles.primaryDisplay}>
                  {formatCurrency(growthResult.futureValue)}
                </div>

                {/* Growth Trajectory SVG Line Chart */}
                {growthChartData && (
                  <div className={styles.topChartCard}>
                    <div className={styles.chartHeaderRow}>
                      <span className={styles.chartHeaderTitle}>Growth Trajectory ({growthResult.totalYears.toFixed(1)} Years)</span>
                      <div className={styles.chartLegendRow}>
                        <span className={styles.legendItem}>
                          <span className={styles.legendColorBox} style={{ background: "#C9992F" }} />
                          Future Balance
                        </span>
                        <span className={styles.legendItem}>
                          <span className={styles.legendColorBox} style={{ background: "#3B3564" }} />
                          Total Deposits
                        </span>
                      </div>
                    </div>

                    <div className={styles.svgContainer}>
                      <svg viewBox="0 0 500 130" className={styles.growthSvg}>
                        <line x1="45" y1="15" x2="485" y2="15" stroke="var(--line)" strokeDasharray="3 3" />
                        <line x1="45" y1="65" x2="485" y2="65" stroke="var(--line)" strokeDasharray="3 3" />
                        <line x1="45" y1="105" x2="485" y2="105" stroke="var(--line)" />

                        <text x="40" y="18" textAnchor="end" fontSize="9.5" fill="var(--ink-60)" fontFamily="var(--mono)">
                          {formatCurrency(growthChartData.maxVal)}
                        </text>
                        <text x="40" y="68" textAnchor="end" fontSize="9.5" fill="var(--ink-60)" fontFamily="var(--mono)">
                          {formatCurrency(growthChartData.maxVal / 2)}
                        </text>
                        <text x="40" y="108" textAnchor="end" fontSize="9.5" fill="var(--ink-60)" fontFamily="var(--mono)">
                          $0
                        </text>

                        <path d={growthChartData.balancePath} fill="none" stroke="#C9992F" strokeWidth="3" strokeLinecap="round" />
                        <path d={growthChartData.depositsPath} fill="none" stroke="#3B3564" strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Donut Chart & Metrics Table */}
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
                      <span>Initial Investment:</span>
                      <strong>{formatCurrency(growthResult.initialInvestment)}</strong>
                    </div>

                    {growthResult.totalContributions > 0 && (
                      <div className={styles.metricRow}>
                        <span>Total Additional Deposits:</span>
                        <strong>{formatCurrency(growthResult.totalContributions)}</strong>
                      </div>
                    )}

                    <div className={styles.metricRow}>
                      <span>Total Out-of-Pocket Deposits:</span>
                      <strong>{formatCurrency(growthResult.totalDeposits)}</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Total Interest Earned:</span>
                      <strong className={styles.highlightText}>{formatCurrency(growthResult.totalInterestEarned)}</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Effective Annual Rate (APY):</span>
                      <strong>{growthResult.earPercent}% APY</strong>
                    </div>

                    <div className={styles.metricRow}>
                      <span>Rule of 72 Doubling Time:</span>
                      <strong>~{growthResult.ruleOf72Years} Years</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <button type="button" className={styles.shareBtn} onClick={handleCopySummary}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Share Growth Summary</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH YEARLY ACCUMULATION SCHEDULE */}
        <div className={styles.amortizationSection}>
          <div className={styles.sectionHeadingRow}>
            <div className={styles.sectionHeading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3>Yearly Accumulation Schedule</h3>
            </div>

            <button
              type="button"
              className={styles.expandScheduleBtn}
              onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
            >
              {isScheduleExpanded ? "Hide Full Schedule ▲" : "Expand Full Schedule ▼"}
            </button>
          </div>

          {isScheduleExpanded && growthResult.yearlySchedule && (
            <div className={styles.scheduleContainer}>
              <div className={styles.tableScrollWrapper}>
                <table className={styles.scheduleTable}>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Starting Balance</th>
                      <th>Yearly Contributions</th>
                      <th>Total Deposits</th>
                      <th>Total Interest Earned</th>
                      <th>Ending Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {growthResult.yearlySchedule.map((row) => (
                      <tr key={row.year}>
                        <td><strong>Year {row.year}</strong></td>
                        <td>{formatCurrency(row.startBalance)}</td>
                        <td>{formatCurrency(row.yearContribTotal)}</td>
                        <td>{formatCurrency(row.totalDepositsToDate)}</td>
                        <td>{formatCurrency(row.totalInterestToDate)}</td>
                        <td><strong>{formatCurrency(row.endingBalance)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Financial Disclaimer */}
        <div className={styles.disclaimerBox}>
          <div className={styles.disclaimerHeader}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <strong>Mathematical Projection Notice</strong>
          </div>
          <p>
            Calculations provided by Holy Calculator are mathematical projections based on constant assumed interest rates for educational planning purposes only.
            Actual investment returns fluctuate over time, are subject to market risks, and are not guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
}
