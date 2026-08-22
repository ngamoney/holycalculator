"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculateCreditCard, formatCurrency, formatCurrencyCents } from "@/lib/calculations/creditCard";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./CreditCardCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_creditcard_history";

export default function CreditCardCalculatorIsland() {
  const [mode, setMode] = useState("fixed-payment"); // 'fixed-payment' | 'fixed-time'
  const [balance, setBalance] = useState(8000);
  const [interestRate, setInterestRate] = useState(18.0);
  const [monthlyPayment, setMonthlyPayment] = useState(250);
  const [targetYears, setTargetYears] = useState(2);
  const [targetMonths, setTargetMonths] = useState(0);

  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL and LocalStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("mode")) setMode(params.get("mode"));
    if (params.has("balance")) setBalance(parseFloat(params.get("balance")) || 8000);
    if (params.has("rate")) setInterestRate(parseFloat(params.get("rate")) || 18.0);
    if (params.has("payment")) setMonthlyPayment(parseFloat(params.get("payment")) || 250);
    if (params.has("years")) setTargetYears(parseFloat(params.get("years")) || 2);
    if (params.has("months")) setTargetMonths(parseFloat(params.get("months")) || 0);

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        mode,
        balance,
        rate: interestRate,
        payment: mode === "fixed-payment" ? monthlyPayment : undefined,
        years: mode === "fixed-time" ? targetYears : undefined,
        months: mode === "fixed-time" && targetMonths > 0 ? targetMonths : undefined,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [mode, balance, interestRate, monthlyPayment, targetYears, targetMonths]);

  // Live calculation
  const result = useMemo(() => {
    return calculateCreditCard({
      mode,
      balance,
      interestRate,
      monthlyPayment,
      targetYears,
      targetMonths,
    });
  }, [mode, balance, interestRate, monthlyPayment, targetYears, targetMonths]);

  // Save history
  useEffect(() => {
    if (!result || result.error || typeof window === "undefined" || balance <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      balance,
      rate: interestRate,
      monthly: Math.round(result.monthlyPayment),
      time: result.timeFormatted,
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "balance");
    setHistory(updated);
  }, [result?.monthlyPayment, result?.totalMonths]);

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

  const principalPercent = result.totalPaid > 0 ? Math.round((result.principal / result.totalPaid) * 100) : 0;
  const interestPercent = result.totalPaid > 0 ? 100 - principalPercent : 0;

  return (
    <div className={styles.islandContainer}>
      {toastMessage && <div className={styles.toastNotice}>{toastMessage}</div>}

      <div className={styles.calcGrid}>
        {/* INPUT CARD */}
        <div className={styles.inputCard}>
          <div className={styles.tabContainer}>
            <button
              type="button"
              className={`${styles.tabBtn} ${mode === "fixed-payment" ? styles.activeTab : ""}`}
              onClick={() => setMode("fixed-payment")}
            >
              Fixed Monthly Payment
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${mode === "fixed-time" ? styles.activeTab : ""}`}
              onClick={() => setMode("fixed-time")}
            >
              Target Payoff Timeline
            </button>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="cardBalance" className={styles.label}>
                Current Credit Card Balance
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="cardBalance"
                type="number"
                min="100"
                step="500"
                value={balance}
                onChange={(e) => setBalance(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="cardRate" className={styles.label}>
                Interest Rate (Annual APR)
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <input
                id="cardRate"
                type="number"
                step="0.1"
                min="0"
                max="45"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
              <span className={styles.suffix}>%</span>
            </div>
          </div>

          {mode === "fixed-payment" ? (
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="monthlyPayment" className={styles.label}>
                  Monthly Payment Budget
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="monthlyPayment"
                  type="number"
                  min="20"
                  step="25"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>/mo</span>
              </div>
            </div>
          ) : (
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Target Payoff Timeframe</label>
              </div>
              <div className={styles.dualInputs}>
                <div className={styles.inputPrefixWrap}>
                  <input
                    id="targetYears"
                    type="number"
                    min="0"
                    max="20"
                    value={targetYears}
                    onChange={(e) => setTargetYears(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className={styles.numInput}
                  />
                  <span className={styles.suffix}>years</span>
                </div>
                <div className={styles.inputPrefixWrap}>
                  <input
                    id="targetMonths"
                    type="number"
                    min="0"
                    max="11"
                    value={targetMonths}
                    onChange={(e) => setTargetMonths(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className={styles.numInput}
                  />
                  <span className={styles.suffix}>months</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.actionRow}>
            <button type="button" className={styles.shareBtn} onClick={handleShare}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share Strategy
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Payoff Summary</h2>

          {result.error ? (
            <div className={styles.errorAlert}>{result.error}</div>
          ) : (
            <>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>
                  {mode === "fixed-payment" ? "Estimated Time to Debt-Free" : "Required Monthly Payment"}
                </div>
                <div className={styles.heroValue}>
                  {mode === "fixed-payment" ? result.timeFormatted : formatCurrencyCents(result.monthlyPayment)}
                </div>
                <div className={styles.heroSub}>
                  {mode === "fixed-payment"
                    ? `Paying ${formatCurrencyCents(result.monthlyPayment)} / month across ${result.totalMonths} total payments`
                    : `To be completely debt-free in ${result.timeFormatted} (${result.totalMonths} payments)`}
                </div>
              </div>

              {/* Minimum Payment Comparison Alert */}
              {result.minPaymentComparison && result.minPaymentComparison.totalInterest > result.totalInterest && (
                <div className={styles.trapComparisonCard}>
                  <div className={styles.trapHeader}>VS Minimum Payment Trap</div>
                  <div className={styles.trapBody}>
                    Paying only minimums would take <strong>{result.minPaymentComparison.timeFormatted}</strong> and cost{" "}
                    <strong>{formatCurrencyCents(result.minPaymentComparison.totalInterest)}</strong> in interest!
                    <br />
                    <span className={styles.savingsHighlight}>
                      Your plan saves {formatCurrencyCents(result.minPaymentComparison.totalInterest - result.totalInterest)} in interest!
                    </span>
                  </div>
                </div>
              )}

              {/* Progress bar breakdown */}
              <div className={styles.breakdownBar}>
                <div
                  className={styles.barPrincipal}
                  style={{ width: `${principalPercent}%` }}
                  title={`Principal: ${principalPercent}%`}
                />
                <div
                  className={styles.barInterest}
                  style={{ width: `${interestPercent}%` }}
                  title={`Interest: ${interestPercent}%`}
                />
              </div>

              <div className={styles.statList}>
                <div className={styles.statRow}>
                  <span className={styles.statDotPrincipal}></span>
                  <span className={styles.statLabel}>Original Debt ({principalPercent}%)</span>
                  <span className={styles.statVal}>{formatCurrency(result.principal)}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statDotInterest}></span>
                  <span className={styles.statLabel}>Total Interest Paid ({interestPercent}%)</span>
                  <span className={styles.statVal}>{formatCurrencyCents(result.totalInterest)}</span>
                </div>
                <div className={`${styles.statRow} ${styles.statTotal}`}>
                  <span>Total Amount Repaid</span>
                  <span>{formatCurrencyCents(result.totalPaid)}</span>
                </div>
              </div>

              <YmylDisclaimer type="debt" />
            </>
          )}
        </div>
      </div>

      {/* SCHEDULE TABLE */}
      {!result.error && result.schedule.length > 0 && (
        <div className={styles.scheduleSection}>
          <div className={styles.scheduleHeader}>
            <div>
              <h3 className={styles.scheduleTitle}>Monthly Debt Paydown Schedule</h3>
              <p className={styles.scheduleSubtitle}>
                Month-by-month breakdown tracking interest accrual and principal balance reduction.
              </p>
            </div>
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
            >
              {isScheduleExpanded ? "Collapse Schedule" : "View Full Schedule"}
            </button>
          </div>

          <div className={`${styles.tableWrapper} ${isScheduleExpanded ? styles.expanded : ""}`}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Payment</th>
                  <th>Principal Paid</th>
                  <th>Interest Paid</th>
                  <th>Total Interest</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month}>
                    <td>Month {row.month}</td>
                    <td>{formatCurrencyCents(row.payment)}</td>
                    <td>{formatCurrencyCents(row.principal)}</td>
                    <td>{formatCurrencyCents(row.interest)}</td>
                    <td>{formatCurrencyCents(row.totalInterest)}</td>
                    <td className={styles.balanceCell}>{formatCurrencyCents(row.balance)}</td>
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
          <div className={styles.historyTitle}>Recent Credit Card Calculations</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  setBalance(item.balance);
                  setInterestRate(item.rate);
                  if (item.monthly) setMonthlyPayment(item.monthly);
                }}
              >
                <div className={styles.historyAmount}>{formatCurrency(item.balance)}</div>
                <div className={styles.historyMeta}>
                  {item.rate}% APR • ${item.monthly}/mo • {item.time}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
