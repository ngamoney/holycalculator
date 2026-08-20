"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl } from "@/lib/calculations/retentionHelpers";
import { INCOME_CONFIG, EXPENSE_CATEGORIES_CONFIG } from "@/lib/data/budgetConfig";
import { calculateBudget, formatCurrency, formatCurrencyCents } from "@/lib/calculations/budgetMath";
import styles from "./BudgetCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_budget_history";

export default function BudgetCalculatorIsland() {
  // Income State
  const [incomeState, setIncomeState] = useState({
    salary: { amount: 80000, period: "year" },
    pension: { amount: 0, period: "month" },
    investments: { amount: 0, period: "month" },
    otherIncome: { amount: 0, period: "month" },
  });

  const [taxRate, setTaxRate] = useState(20);

  // Expense State (Default pre-filled common items)
  const [expenseState, setExpenseState] = useState({
    mortgage: { amount: 2000, period: "month" },
    propertyTax: { amount: 300, period: "month" },
    homeInsurance: { amount: 100, period: "month" },
    utilities: { amount: 250, period: "month" },
    autoLoan: { amount: 450, period: "month" },
    autoInsurance: { amount: 120, period: "month" },
    gasoline: { amount: 150, period: "month" },
    food: { amount: 500, period: "month" },
    mealsOut: { amount: 200, period: "month" },
    retirementSavings: { amount: 500, period: "month" },
  });

  // Category Collapse State (Default: all collapsed except housing)
  const [collapsedCategories, setCollapsedCategories] = useState({
    housing: false,
    transportation: true,
    debt: true,
    living: true,
    healthcare: true,
    children: true,
    savings: true,
    miscellaneous: true,
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("tax")) setTaxRate(parseFloat(params.get("tax")) || 20);
    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({ tax: taxRate });
    }, 300);
    return () => clearTimeout(syncTimerRef.current);
  }, [taxRate]);

  // Live Calculation Results
  const result = useMemo(() => {
    return calculateBudget(incomeState, taxRate, expenseState);
  }, [incomeState, taxRate, expenseState]);

  // Handlers for Income Updates
  const handleIncomeAmountChange = (id, val) => {
    setIncomeState((prev) => ({
      ...prev,
      [id]: { ...prev[id], amount: Number(val) },
    }));
  };

  const handleIncomePeriodChange = (id, period) => {
    setIncomeState((prev) => ({
      ...prev,
      [id]: { ...prev[id], period },
    }));
  };

  // Handlers for Expense Updates
  const handleExpenseAmountChange = (id, val) => {
    setExpenseState((prev) => ({
      ...prev,
      [id]: { amount: Number(val), period: prev[id]?.period || "month" },
    }));
  };

  const handleExpensePeriodChange = (id, period) => {
    setExpenseState((prev) => ({
      ...prev,
      [id]: { amount: prev[id]?.amount || 0, period },
    }));
  };

  const toggleCategoryCollapse = (catId) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopySummary = () => {
    const summaryText = `Personal Budget Summary (Holy Calculator):
• Gross Income: ${formatCurrency(result.grossMonthlyIncome)} / mo (${formatCurrency(result.grossAnnualIncome)} / yr)
• Estimated Taxes (${taxRate}%): -${formatCurrency(result.monthlyTaxAmount)} / mo
• Net Income After Tax: ${formatCurrency(result.netMonthlyIncome)} / mo
• Total Expenses: ${formatCurrency(result.totalMonthlyExpenses)} / mo
• Net Monthly Surplus/Deficit: ${result.isSurplus ? "+" : ""}${formatCurrency(result.netMonthlySurplus)} / mo
• Debt-to-Income (DTI) Ratio: ${result.dtiRatioPercent}%
• Benchmarks: Housing ${result.benchmarks.housing.actualPct}% (Target ≤30%), Transportation ${result.benchmarks.transportation.actualPct}% (Target ≤15%), Savings ${result.benchmarks.savings.actualPct}% (Target ≥15%)`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText)
        .then(() => showToast("✓ Budget summary copied to clipboard!"))
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
      showToast("✓ Budget summary copied to clipboard!");
    } catch (e) {
      showToast("Unable to copy summary automatically");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Compute SVG Donut Chart Paths for Expense Categories
  const donutPaths = useMemo(() => {
    const data = result.categoryChartData;
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    if (total <= 0) return [];

    let accumulatedAngle = 0;
    const radius = 60;
    const center = 80;

    const colors = ["#3B3564", "#C9992F", "#4F7A5B", "#9C7420", "#5C5F6B", "#8E7247", "#3B5C44", "#8A6416"];

    return data.map((slice, idx) => {
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
        color: colors[idx % colors.length],
        pathData,
        percentageFormatted: `${Math.round(percentageVal)}%`,
        percentageVal,
        textX,
        textY,
      };
    });
  }, [result.categoryChartData]);

  return (
    <div className={styles.calcMain}>
      {/* Toast Notification */}
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      {/* Main Interactive Calculator Card */}
      <div className={styles.calcCard}>
        {/* Card Header */}
        <div className={styles.calcCardHeader}>
          <div className={styles.calcCardTitle}>
            <div className={styles.calcBadgeIcon}>📊</div>
            <h2>Budget Calculator</h2>
          </div>
          <span className={styles.categoryBadge}>Finance • 9 Categories &amp; DTI</span>
        </div>

        {/* 2-COLUMN DESKTOP GRID: Inputs Left, Sticky Live Results Right */}
        <div className={styles.calculatorTwoColGrid}>
          {/* LEFT COLUMN: Income & Expense Category Forms */}
          <div className={styles.inputsColumn}>
            {/* 1. INCOME SECTION */}
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <div className={styles.formCardTitle}>
                  <span>💵</span>
                  <h3>Income &amp; Earnings</h3>
                </div>
                <span className={styles.subtotalBadge}>
                  {formatCurrency(result.grossMonthlyIncome)} / mo
                </span>
              </div>

              <div className={styles.inputsGrid}>
                {INCOME_CONFIG.map((item) => {
                  const entry = incomeState[item.id] || { amount: 0, period: "month" };
                  return (
                    <div key={item.id} className={styles.inputGroup}>
                      <div className={styles.inputLabelGroup}>
                        <label className={styles.inputLabel}>{item.label}</label>
                        <div className={styles.togglePillGroup}>
                          <button
                            type="button"
                            className={`${styles.togglePill} ${entry.period === "month" ? styles.activePill : ""}`}
                            onClick={() => handleIncomePeriodChange(item.id, "month")}
                          >
                            / mo
                          </button>
                          <button
                            type="button"
                            className={`${styles.togglePill} ${entry.period === "year" ? styles.activePill : ""}`}
                            onClick={() => handleIncomePeriodChange(item.id, "year")}
                          >
                            / yr
                          </button>
                        </div>
                      </div>
                      <input
                        type="number"
                        step="100"
                        className={styles.currencyInput}
                        value={entry.amount || ""}
                        onChange={(e) => handleIncomeAmountChange(item.id, e.target.value)}
                      />
                      {item.hint && <span className={styles.inputSubtext}>{item.hint}</span>}
                    </div>
                  );
                })}

                {/* Tax Rate Input */}
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Combined Tax Rate (% Fed + State + Local)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="60"
                    className={styles.numberInput}
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                  <span className={styles.inputSubtext}>
                    = {formatCurrency(result.monthlyTaxAmount)} / mo estimated tax
                  </span>
                </div>
              </div>
            </div>

            {/* 2. EXPENSE CATEGORIES (9 Collapsible Cards) */}
            <div className={styles.expenseSectionTitle}>
              <h3>Expense Categories</h3>
              <span>Fill in your monthly or annual line items</span>
            </div>

            {EXPENSE_CATEGORIES_CONFIG.map((cat) => {
              const isCollapsed = collapsedCategories[cat.id];
              const subtotal = result.categorySubtotals[cat.id] || { monthly: 0, annual: 0 };

              return (
                <div key={cat.id} className={styles.categoryCard}>
                  <button
                    type="button"
                    className={styles.categoryHeaderBtn}
                    onClick={() => toggleCategoryCollapse(cat.id)}
                  >
                    <div className={styles.catTitleLeft}>
                      <span className={styles.catIcon}>{cat.icon}</span>
                      <span className={styles.catTitleText}>{cat.title}</span>
                    </div>

                    <div className={styles.catHeaderRight}>
                      <span className={styles.catHeaderSubtotal}>
                        {formatCurrency(subtotal.monthly)} / mo
                      </span>
                      <span className={styles.arrowIcon}>{isCollapsed ? "▼" : "▲"}</span>
                    </div>
                  </button>

                  {!isCollapsed && (
                    <div className={styles.categoryBody}>
                      <div className={styles.inputsGrid}>
                        {cat.items.map((item) => {
                          const entry = expenseState[item.id] || { amount: 0, period: "month" };
                          return (
                            <div key={item.id} className={styles.inputGroup}>
                              <div className={styles.inputLabelGroup}>
                                <label className={styles.inputLabel}>{item.label}</label>
                                <div className={styles.togglePillGroup}>
                                  <button
                                    type="button"
                                    className={`${styles.togglePill} ${entry.period === "month" ? styles.activePill : ""}`}
                                    onClick={() => handleExpensePeriodChange(item.id, "month")}
                                  >
                                    / mo
                                  </button>
                                  <button
                                    type="button"
                                    className={`${styles.togglePill} ${entry.period === "year" ? styles.activePill : ""}`}
                                    onClick={() => handleExpensePeriodChange(item.id, "year")}
                                  >
                                    / yr
                                  </button>
                                </div>
                              </div>
                              <input
                                type="number"
                                step="25"
                                className={styles.currencyInput}
                                value={entry.amount || ""}
                                onChange={(e) => handleExpenseAmountChange(item.id, e.target.value)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Live Results Display (Sticky Pinned on Desktop) */}
          <div className={styles.resultsColumn}>
            <div className={styles.stickyResultsCard}>
              <div className={styles.resultsHero}>
                <span className={styles.heroEyebrow}>Net Monthly Surplus / Deficit</span>
                <div className={`${styles.primaryDisplay} ${result.isSurplus ? styles.surplusText : styles.deficitText}`}>
                  {result.isSurplus ? "+" : ""}{formatCurrency(result.netMonthlySurplus)}
                  <span className={styles.subUnitText}>/ month</span>
                </div>

                {/* DTI Status Badge */}
                <div className={styles.dtiBadgeRow}>
                  <span className={`${styles.dtiBadge} ${Number(result.dtiRatioPercent) <= 36 ? styles.goodDti : styles.highDti}`}>
                    DTI Ratio: {result.dtiRatioPercent}% ({Number(result.dtiRatioPercent) <= 36 ? "Healthy Debt Level" : "High Debt Level"})
                  </span>
                </div>

                {/* Expense Category Donut Chart */}
                {donutPaths.length > 0 && (
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

                    {/* Rule of Thumb Benchmark Cards */}
                    <div className={styles.benchmarksGrid}>
                      <div className={styles.benchmarkCard}>
                        <div className={styles.benchmarkHeader}>
                          <span>Housing Ratio</span>
                          <strong>{result.benchmarks.housing.actualPct}%</strong>
                        </div>
                        <span className={styles.benchmarkSub}>Target: &le;30% of income</span>
                      </div>

                      <div className={styles.benchmarkCard}>
                        <div className={styles.benchmarkHeader}>
                          <span>Transportation</span>
                          <strong>{result.benchmarks.transportation.actualPct}%</strong>
                        </div>
                        <span className={styles.benchmarkSub}>Target: &le;15% of income</span>
                      </div>

                      <div className={styles.benchmarkCard}>
                        <div className={styles.benchmarkHeader}>
                          <span>Food &amp; Dining</span>
                          <strong>{result.benchmarks.food.actualPct}%</strong>
                        </div>
                        <span className={styles.benchmarkSub}>Target: &le;15% of income</span>
                      </div>

                      <div className={styles.benchmarkCard}>
                        <div className={styles.benchmarkHeader}>
                          <span>Savings Rate</span>
                          <strong>{result.benchmarks.savings.actualPct}%</strong>
                        </div>
                        <span className={styles.benchmarkSub}>Target: &ge;15% of income</span>
                      </div>
                    </div>

                    {/* Detailed Metrics Table */}
                    <div className={styles.metricsTable}>
                      <div className={styles.metricRow}>
                        <span>Gross Income:</span>
                        <strong>{formatCurrency(result.grossMonthlyIncome)} / mo</strong>
                      </div>

                      <div className={styles.metricRow}>
                        <span>Estimated Taxes ({taxRate}%):</span>
                        <strong>-{formatCurrency(result.monthlyTaxAmount)} / mo</strong>
                      </div>

                      <div className={styles.metricRow}>
                        <span>Net After-Tax Income:</span>
                        <strong>{formatCurrency(result.netMonthlyIncome)} / mo</strong>
                      </div>

                      <div className={styles.metricRow}>
                        <span>Total Monthly Expenses:</span>
                        <strong>{formatCurrency(result.totalMonthlyExpenses)} / mo</strong>
                      </div>

                      <div className={styles.metricRow}>
                        <span>Monthly Debt Payments:</span>
                        <strong>{formatCurrency(result.totalMonthlyDebtPayments)} / mo</strong>
                      </div>

                      <div className={styles.metricRow}>
                        <span>Annual Net Surplus/Deficit:</span>
                        <strong className={styles.highlightText}>
                          {result.isSurplus ? "+" : ""}{formatCurrency(result.netAnnualSurplus)} / yr
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Action Bar */}
                <div className={styles.cardFooter}>
                  <button type="button" className={styles.shareBtn} onClick={handlePrint}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                    <span>Print Budget</span>
                  </button>

                  <button type="button" className={styles.shareBtn} onClick={handleCopySummary}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy Summary</span>
                  </button>
                </div>
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
            <strong>Financial Disclaimer &amp; Notice</strong>
          </div>
          <p>
            Calculations provided by Holy Calculator are estimates based on user-entered values for personal planning purposes only.
            Accuracy depends entirely on the completeness of your inputs. Avoid double-dipping expenses across categories. This tool does not constitute tax, credit, or financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
