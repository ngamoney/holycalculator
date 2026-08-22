"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculateRefinance, formatCurrency, formatCurrencyCents } from "@/lib/calculations/refinance";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./RefinanceCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_refinance_history";

export default function RefinanceCalculatorIsland() {
  const [remainingBalance, setRemainingBalance] = useState(250000);
  const [currentTermRemainingYears, setCurrentTermRemainingYears] = useState(25);
  const [currentInterestRate, setCurrentInterestRate] = useState(7.0);

  const [newTermYears, setNewTermYears] = useState(20);
  const [newInterestRate, setNewInterestRate] = useState(5.75);
  const [points, setPoints] = useState(1.0);
  const [closingCosts, setClosingCosts] = useState(3000);
  const [cashOut, setCashOut] = useState(0);
  const [rollCostsIntoLoan, setRollCostsIntoLoan] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL & LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("balance")) setRemainingBalance(parseFloat(params.get("balance")) || 250000);
    if (params.has("curTerm")) setCurrentTermRemainingYears(parseFloat(params.get("curTerm")) || 25);
    if (params.has("curRate")) setCurrentInterestRate(parseFloat(params.get("curRate")) || 7.0);
    if (params.has("newTerm")) setNewTermYears(parseFloat(params.get("newTerm")) || 20);
    if (params.has("newRate")) setNewInterestRate(parseFloat(params.get("newRate")) || 5.75);
    if (params.has("costs")) setClosingCosts(parseFloat(params.get("costs")) || 3000);

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        balance: remainingBalance,
        curTerm: currentTermRemainingYears,
        curRate: currentInterestRate,
        newTerm: newTermYears,
        newRate: newInterestRate,
        costs: closingCosts,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [
    remainingBalance,
    currentTermRemainingYears,
    currentInterestRate,
    newTermYears,
    newInterestRate,
    closingCosts,
  ]);

  // Live calculation
  const result = useMemo(() => {
    return calculateRefinance({
      remainingBalance,
      currentTermRemainingYears,
      currentInterestRate,
      newTermYears,
      newInterestRate,
      points,
      closingCosts,
      cashOut,
      rollCostsIntoLoan,
    });
  }, [
    remainingBalance,
    currentTermRemainingYears,
    currentInterestRate,
    newTermYears,
    newInterestRate,
    points,
    closingCosts,
    cashOut,
    rollCostsIntoLoan,
  ]);

  // Save history
  useEffect(() => {
    if (!result || result.error || typeof window === "undefined" || remainingBalance <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      balance: remainingBalance,
      curRate: currentInterestRate,
      newRate: newInterestRate,
      savings: Math.round(result.monthlySavings),
      breakeven: result.breakevenYearsFormatted,
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "balance");
    setHistory(updated);
  }, [result?.monthlySavings, result?.newMonthlyPayment]);

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

  return (
    <div className={styles.islandContainer}>
      {toastMessage && <div className={styles.toastNotice}>{toastMessage}</div>}

      <div className={styles.calcGrid}>
        {/* INPUT CARD */}
        <div className={styles.inputCard}>
          <h2 className={styles.cardHeader}>Current vs. New Loan Terms</h2>

          <div className={styles.sectionDivider}>
            <span>1. Existing Mortgage</span>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="remainingBalance" className={styles.label}>
                Current Principal Balance
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="remainingBalance"
                type="number"
                min="10000"
                step="5000"
                value={remainingBalance}
                onChange={(e) => setRemainingBalance(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="currentTerm" className={styles.label}>
                  Years Remaining
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="currentTerm"
                  type="number"
                  min="1"
                  max="40"
                  value={currentTermRemainingYears}
                  onChange={(e) => setCurrentTermRemainingYears(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>yrs</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="currentRate" className={styles.label}>
                  Current Interest Rate
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="currentRate"
                  type="number"
                  step="0.05"
                  min="0"
                  max="20"
                  value={currentInterestRate}
                  onChange={(e) => setCurrentInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          </div>

          <div className={styles.sectionDivider}>
            <span>2. Refinanced New Loan</span>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="newTerm" className={styles.label}>
                  New Loan Term
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <select
                  id="newTerm"
                  value={newTermYears}
                  onChange={(e) => setNewTermYears(parseInt(e.target.value, 10))}
                  className={styles.selectInput}
                >
                  <option value={30}>30 Years</option>
                  <option value={25}>25 Years</option>
                  <option value={20}>20 Years</option>
                  <option value={15}>15 Years</option>
                  <option value={10}>10 Years</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="newRate" className={styles.label}>
                  New Interest Rate
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="newRate"
                  type="number"
                  step="0.05"
                  min="0"
                  max="20"
                  value={newInterestRate}
                  onChange={(e) => setNewInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="closingCosts" className={styles.label}>
                  Closing Costs &amp; Fees
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="closingCosts"
                  type="number"
                  min="0"
                  step="500"
                  value={closingCosts}
                  onChange={(e) => setClosingCosts(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="points" className={styles.label}>
                  Discount Points
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="points"
                  type="number"
                  step="0.25"
                  min="0"
                  max="5"
                  value={points}
                  onChange={(e) => setPoints(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>pts</span>
              </div>
            </div>
          </div>

          <div className={styles.checkboxWrap}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rollCostsIntoLoan}
                onChange={(e) => setRollCostsIntoLoan(e.target.checked)}
              />
              <span>Roll closing costs into new loan balance (No out-of-pocket cash)</span>
            </label>
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
              Share Refinance Comparison
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Refinance Analysis</h2>

          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>
              {result.monthlySavings >= 0 ? "Monthly Payment Savings" : "Monthly Payment Increase"}
            </div>
            <div
              className={styles.heroValue}
              style={{ color: result.monthlySavings >= 0 ? "#4f7a5b" : "#b02a37" }}
            >
              {result.monthlySavings >= 0
                ? `${formatCurrencyCents(result.monthlySavings)} / mo`
                : `+${formatCurrencyCents(Math.abs(result.monthlySavings))} / mo`}
            </div>
            <div className={styles.heroSub}>
              New payment: <strong>{formatCurrencyCents(result.newMonthlyPayment)}/mo</strong> vs. current{" "}
              {formatCurrencyCents(result.currentMonthlyPayment)}/mo
            </div>
          </div>

          {/* Breakeven Banner */}
          <div className={styles.breakevenCard}>
            <div className={styles.breakevenTitle}>Breakeven Point</div>
            <div className={styles.breakevenVal}>{result.breakevenYearsFormatted}</div>
            <div className={styles.breakevenSub}>
              Time needed for monthly savings to fully recoup {formatCurrency(result.totalClosingCosts)} in total closing fees.
            </div>
          </div>

          {/* Side-by-side comparison table */}
          <div className={styles.compBox}>
            <div className={styles.compRowHeader}>
              <span>Metric</span>
              <span>Current Loan</span>
              <span>Refinanced Loan</span>
            </div>
            <div className={styles.compRow}>
              <span>Monthly P&amp;I</span>
              <span>{formatCurrencyCents(result.currentMonthlyPayment)}</span>
              <strong>{formatCurrencyCents(result.newMonthlyPayment)}</strong>
            </div>
            <div className={styles.compRow}>
              <span>Interest Rate</span>
              <span>{currentInterestRate}%</span>
              <strong>{newInterestRate}%</strong>
            </div>
            <div className={styles.compRow}>
              <span>Total Remaining Interest</span>
              <span>{formatCurrency(result.currentRemainingTotalInterest)}</span>
              <strong>{formatCurrency(result.newTotalInterest)}</strong>
            </div>
            <div className={`${styles.compRow} ${styles.compTotalRow}`}>
              <span>Lifetime Net Savings</span>
              <span colSpan="2" style={{ color: result.lifetimeSavings >= 0 ? "#4f7a5b" : "#b02a37" }}>
                {result.lifetimeSavings >= 0 ? "+" : ""}
                {formatCurrency(result.lifetimeSavings)}
              </span>
            </div>
          </div>

          <YmylDisclaimer type="mortgage" />
        </div>
      </div>

      {/* RECENT CALCULATIONS */}
      {history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyTitle}>Recent Refinance Comparisons</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  setRemainingBalance(item.balance);
                  setCurrentInterestRate(item.curRate);
                  setNewInterestRate(item.newRate);
                }}
              >
                <div className={styles.historyAmount}>
                  {item.savings >= 0 ? `+$${item.savings}/mo` : `-$${Math.abs(item.savings)}/mo`}
                </div>
                <div className={styles.historyMeta}>
                  {item.curRate}% → {item.newRate}% • {item.breakeven}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
