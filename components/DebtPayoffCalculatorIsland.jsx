"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculateDebtPayoff, formatCurrency, formatCurrencyCents } from "@/lib/calculations/debtPayoff";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./DebtPayoffCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_debtpayoff_history";

export default function DebtPayoffCalculatorIsland() {
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(300);
  const [strategy, setStrategy] = useState("avalanche"); // 'avalanche' | 'snowball'
  const [debts, setDebts] = useState([
    { id: 1, name: "Credit Card 1", category: "Credit Card", balance: 6000, minPayment: 150, interestRate: 19.99 },
    { id: 2, name: "Credit Card 2", category: "Credit Card", balance: 3000, minPayment: 75, interestRate: 16.99 },
    { id: 3, name: "Auto Loan", category: "Auto Loan", balance: 18000, minPayment: 380, interestRate: 5.5 },
    { id: 4, name: "Student Loan", category: "Student Loan", balance: 24000, minPayment: 260, interestRate: 4.8 },
  ]);

  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL and LocalStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("extra")) setExtraMonthlyPayment(parseFloat(params.get("extra")) || 300);
    if (params.has("strat")) setStrategy(params.get("strat"));
    if (params.has("debts")) {
      try {
        const parsed = JSON.parse(decodeURIComponent(params.get("debts")));
        if (Array.isArray(parsed) && parsed.length > 0) setDebts(parsed);
      } catch {
        // Use default debts
      }
    }

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        extra: extraMonthlyPayment,
        strat: strategy,
        debts: encodeURIComponent(JSON.stringify(debts)),
      });
    }, 300);
    return () => clearTimeout(syncTimerRef.current);
  }, [extraMonthlyPayment, strategy, debts]);

  const handleDebtChange = (id, field, value) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleAddDebt = () => {
    if (debts.length >= 10) return;
    const nextId = debts.length > 0 ? Math.max(...debts.map((d) => d.id)) + 1 : 1;
    setDebts((prev) => [
      ...prev,
      { id: nextId, name: `Debt ${nextId}`, category: "Personal Loan", balance: 5000, minPayment: 120, interestRate: 11.5 },
    ]);
  };

  const handleRemoveDebt = (id) => {
    if (debts.length <= 1) return;
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  // Live calculation
  const result = useMemo(() => {
    return calculateDebtPayoff({
      extraMonthlyPayment,
      strategy,
      debts,
    });
  }, [extraMonthlyPayment, strategy, debts]);

  // Save history
  useEffect(() => {
    if (!result || result.error || typeof window === "undefined" || result.totalStartingBalance <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      extra: extraMonthlyPayment,
      strategy,
      totalDebt: Math.round(result.totalStartingBalance),
      time: result.timeFormatted,
      saved: Math.round(result.interestSaved),
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "totalDebt");
    setHistory(updated);
  }, [result?.totalStartingBalance, result?.totalMonths]);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    copyToClipboard(
      window.location.href,
      () => {
        setToastMessage("Link copied to clipboard!");
        setTimeout(() => setToastMessage(null), 3000);
      },
      () => {
        setToastMessage("Could not copy link");
        setTimeout(() => setToastMessage(null), 3000);
      }
    );
  };

  const totalPaid = result.totalPaid || 1;
  const principalPct = Math.round((result.totalStartingBalance / totalPaid) * 100);
  const interestPct = Math.max(0, 100 - principalPct);

  return (
    <div className={styles.islandContainer}>
      {toastMessage && <div className={styles.toastNotice}>{toastMessage}</div>}

      <div className={styles.calcGrid}>
        {/* INPUT CARD */}
        <div className={styles.inputCard}>
          <h2 className={styles.cardHeader}>Debts &amp; Payoff Strategy</h2>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="extraMonthlyPayment" className={styles.label}>
                Extra Monthly Payment Added
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="extraMonthlyPayment"
                type="number"
                min="0"
                step="50"
                value={extraMonthlyPayment}
                onChange={(e) => setExtraMonthlyPayment(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
              <span className={styles.suffix}>/mo extra</span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Payoff Priority Order</label>
            </div>
            <div className={styles.tabContainer}>
              <button
                type="button"
                className={`${styles.tabBtn} ${strategy === "avalanche" ? styles.activeTab : ""}`}
                onClick={() => setStrategy("avalanche")}
              >
                Avalanche (Highest APR)
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${strategy === "snowball" ? styles.activeTab : ""}`}
                onClick={() => setStrategy("snowball")}
              >
                Snowball (Lowest Balance)
              </button>
            </div>
          </div>

          {/* DEBTS TABLE */}
          <div className={styles.debtsTableWrap}>
            <div className={styles.debtsTableHeader}>
              <span>Debt Name</span>
              <span>Balance</span>
              <span>Min Pay</span>
              <span>APR %</span>
              <span></span>
            </div>

            <div className={styles.debtsList}>
              {debts.map((debt) => (
                <div key={debt.id} className={styles.debtRow}>
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(e) => handleDebtChange(debt.id, "name", e.target.value)}
                    className={styles.debtNameInput}
                    placeholder="Debt Name"
                  />
                  <div className={styles.miniInputWrap}>
                    <span className={styles.miniPrefix}>$</span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={debt.balance}
                      onChange={(e) => handleDebtChange(debt.id, "balance", parseFloat(e.target.value) || 0)}
                      className={styles.miniInput}
                    />
                  </div>
                  <div className={styles.miniInputWrap}>
                    <span className={styles.miniPrefix}>$</span>
                    <input
                      type="number"
                      min="0"
                      step="25"
                      value={debt.minPayment}
                      onChange={(e) => handleDebtChange(debt.id, "minPayment", parseFloat(e.target.value) || 0)}
                      className={styles.miniInput}
                    />
                  </div>
                  <div className={styles.miniInputWrap}>
                    <input
                      type="number"
                      min="0"
                      max="45"
                      step="0.1"
                      value={debt.interestRate}
                      onChange={(e) => handleDebtChange(debt.id, "interestRate", parseFloat(e.target.value) || 0)}
                      className={styles.miniInput}
                    />
                    <span className={styles.miniSuffix}>%</span>
                  </div>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleRemoveDebt(debt.id)}
                    title="Remove Debt"
                    disabled={debts.length <= 1}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {debts.length < 10 && (
              <button type="button" className={styles.addDebtBtn} onClick={handleAddDebt}>
                + Add Another Debt Account
              </button>
            )}
          </div>

          <div className={styles.actionRow}>
            <button type="button" className={styles.shareBtn} onClick={handleShare}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share Debt Plan
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Debt-Free Timeline</h2>

          {result.error ? (
            <div className={styles.errorAlert}>{result.error}</div>
          ) : (
            <>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>Total Time Until Debt-Free</div>
                <div className={styles.heroValue}>{result.timeFormatted}</div>
                <div className={styles.heroSub}>
                  Total Monthly Payment: <strong>{formatCurrency(result.totalMonthlyBudget)}/mo</strong> (incl. ${extraMonthlyPayment} extra)
                </div>
              </div>

              {/* Savings callout */}
              {result.interestSaved > 0 && (
                <div className={styles.savingsCallout}>
                  <div className={styles.savingsCalloutTitle}>Your Acceleration Savings</div>
                  <div className={styles.savingsCalloutBody}>
                    You save <strong>{formatCurrencyCents(result.interestSaved)}</strong> in interest fees and become debt-free{" "}
                    <strong>{Math.floor(result.monthsSaved / 12)} years {result.monthsSaved % 12} months earlier</strong> than paying only minimums!
                  </div>
                </div>
              )}

              {/* Individual Debt Completion Milestones */}
              {Object.keys(result.debtPayoffDates).length > 0 && (
                <div className={styles.milestoneSection}>
                  <div className={styles.milestoneTitle}>Debt Elimination Milestones</div>
                  <div className={styles.milestoneList}>
                    {Object.entries(result.debtPayoffDates).map(([debtName, month]) => (
                      <div key={debtName} className={styles.milestoneItem}>
                        <span>{debtName} Paid Off:</span>
                        <strong>Month {month} (~{(month / 12).toFixed(1)} yrs)</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Breakdown Bar */}
              <div className={styles.breakdownBar}>
                <div className={styles.barPrincipal} style={{ width: `${principalPct}%` }} title={`Principal: ${principalPct}%`} />
                <div className={styles.barInterest} style={{ width: `${interestPct}%` }} title={`Interest: ${interestPct}%`} />
              </div>

              <div className={styles.statList}>
                <div className={styles.statRow}>
                  <span className={styles.statDotPrincipal}></span>
                  <span className={styles.statLabel}>Total Debt Balance</span>
                  <span className={styles.statVal}>{formatCurrency(result.totalStartingBalance)}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statDotInterest}></span>
                  <span className={styles.statLabel}>Total Interest Paid</span>
                  <span className={styles.statVal}>{formatCurrencyCents(result.totalInterest)}</span>
                </div>
                <div className={`${styles.statRow} ${styles.statTotal}`}>
                  <span>Total Cost to Become Debt-Free</span>
                  <span>{formatCurrencyCents(result.totalPaid)}</span>
                </div>
              </div>

              <YmylDisclaimer type="debt" />
            </>
          )}
        </div>
      </div>

      {/* DETAILED SCHEDULE */}
      {!result.error && result.schedule.length > 0 && (
        <div className={styles.scheduleSection}>
          <div className={styles.scheduleHeader}>
            <div>
              <h3 className={styles.scheduleTitle}>Month-by-Month Payoff Progress</h3>
              <p className={styles.scheduleSubtitle}>
                Detailed tracking of rollover payments applied as individual debts are wiped out.
              </p>
            </div>
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
            >
              {isScheduleExpanded ? "Collapse Timeline" : "View Full Timeline"}
            </button>
          </div>

          <div className={`${styles.tableWrapper} ${isScheduleExpanded ? styles.expanded : ""}`}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Monthly Payment</th>
                  <th>Interest Charge</th>
                  {debts.map((d) => (
                    <th key={d.id}>{d.name}</th>
                  ))}
                  <th>Total Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month}>
                    <td>Month {row.month}</td>
                    <td>{formatCurrencyCents(row.totalPayment)}</td>
                    <td>{formatCurrencyCents(row.totalInterest)}</td>
                    {row.debtsState.map((debtSt, i) => (
                      <td key={i}>
                        {debtSt.balance <= 0 ? (
                          <span className={styles.paidOffTag}>PAID OFF</span>
                        ) : (
                          formatCurrency(debtSt.balance)
                        )}
                      </td>
                    ))}
                    <td className={styles.balanceCell}>{formatCurrency(row.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECENT CALCULATIONS */}
      {history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyTitle}>Recent Payoff Plans</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  if (item.extra !== undefined) setExtraMonthlyPayment(item.extra);
                  if (item.strategy) setStrategy(item.strategy);
                }}
              >
                <div className={styles.historyAmount}>{formatCurrency(item.totalDebt)}</div>
                <div className={styles.historyMeta}>
                  +${item.extra}/mo • {item.strategy === "avalanche" ? "Avalanche" : "Snowball"} • {item.time}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
