"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculateStudentLoan, formatCurrency, formatCurrencyCents } from "@/lib/calculations/studentLoan";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./StudentLoanCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_studentloan_history";

export default function StudentLoanCalculatorIsland() {
  const [balance, setBalance] = useState(30000);
  const [termYears, setTermYears] = useState(10);
  const [interestRate, setInterestRate] = useState(6.8);
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [planType, setPlanType] = useState("standard"); // 'standard' | 'graduated'

  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL and LocalStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("balance")) setBalance(parseFloat(params.get("balance")) || 30000);
    if (params.has("years")) setTermYears(parseFloat(params.get("years")) || 10);
    if (params.has("rate")) setInterestRate(parseFloat(params.get("rate")) || 6.8);
    if (params.has("extra")) setExtraMonthly(parseFloat(params.get("extra")) || 0);
    if (params.has("plan")) setPlanType(params.get("plan"));

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        balance,
        years: termYears,
        rate: interestRate,
        extra: extraMonthly > 0 ? extraMonthly : undefined,
        plan: planType !== "standard" ? planType : undefined,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [balance, termYears, interestRate, extraMonthly, planType]);

  // Live calculation
  const result = useMemo(() => {
    return calculateStudentLoan({
      balance,
      termYears,
      interestRate,
      extraMonthly,
      planType,
    });
  }, [balance, termYears, interestRate, extraMonthly, planType]);

  // Save history
  useEffect(() => {
    if (!result || result.error || typeof window === "undefined" || balance <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      balance,
      rate: interestRate,
      years: termYears,
      monthly: Math.round(result.monthlyPayment),
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "balance");
    setHistory(updated);
  }, [result?.monthlyPayment, result?.totalPaid]);

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
          <h2 className={styles.cardHeader}>Student Loan Details</h2>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="studentBalance" className={styles.label}>
                Total Student Loan Balance
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="studentBalance"
                type="number"
                min="500"
                step="1000"
                value={balance}
                onChange={(e) => setBalance(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
            </div>
          </div>

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="termYears" className={styles.label}>
                  Repayment Term
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <select
                  id="termYears"
                  value={termYears}
                  onChange={(e) => setTermYears(parseInt(e.target.value, 10))}
                  className={styles.selectInput}
                >
                  <option value={10}>10 Years (Standard)</option>
                  <option value={15}>15 Years</option>
                  <option value={20}>20 Years (Extended)</option>
                  <option value={25}>25 Years (Consolidation)</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="studentRate" className={styles.label}>
                  Interest Rate (APR)
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="studentRate"
                  type="number"
                  step="0.05"
                  min="0"
                  max="25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="extraMonthly" className={styles.label}>
                Extra Monthly Principal Payment
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="extraMonthly"
                type="number"
                min="0"
                step="25"
                value={extraMonthly}
                onChange={(e) => setExtraMonthly(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
              <span className={styles.suffix}>/mo extra</span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Repayment Structure</label>
            </div>
            <div className={styles.tabContainer}>
              <button
                type="button"
                className={`${styles.tabBtn} ${planType === "standard" ? styles.activeTab : ""}`}
                onClick={() => setPlanType("standard")}
              >
                Fixed Standard
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${planType === "graduated" ? styles.activeTab : ""}`}
                onClick={() => setPlanType("graduated")}
              >
                Graduated (Steps Up)
              </button>
            </div>
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
              Share Calculation
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Repayment Summary</h2>

          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>
              {planType === "graduated" ? "Starting Monthly Payment" : "Monthly Payment"}
            </div>
            <div className={styles.heroValue}>{formatCurrencyCents(result.monthlyPayment)}</div>
            <div className={styles.heroSub}>
              {extraMonthly > 0
                ? `Payoff in ${result.payoffTimeFormatted} (${result.monthsSaved} months early)`
                : `Across ${result.totalMonths} total monthly installments`}
            </div>
          </div>

          {extraMonthly > 0 && result.interestSaved > 0 && (
            <div className={styles.savingsCallout}>
              <div className={styles.savingsTitle}>Extra Payment Impact</div>
              <div className={styles.savingsBody}>
                An extra ${extraMonthly}/month saves <strong>{formatCurrencyCents(result.interestSaved)}</strong> in interest and shortens repayment by{" "}
                <strong>{Math.floor(result.monthsSaved / 12)} years {result.monthsSaved % 12} months</strong>!
              </div>
            </div>
          )}

          {/* Breakdown progress bar */}
          <div className={styles.breakdownBar}>
            <div className={styles.barPrincipal} style={{ width: `${principalPercent}%` }} title={`Principal: ${principalPercent}%`} />
            <div className={styles.barInterest} style={{ width: `${interestPercent}%` }} title={`Interest: ${interestPercent}%`} />
          </div>

          <div className={styles.statList}>
            <div className={styles.statRow}>
              <span className={styles.statDotPrincipal}></span>
              <span className={styles.statLabel}>Original Loan Balance ({principalPercent}%)</span>
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

          <YmylDisclaimer type="financial" />
        </div>
      </div>

      {/* SCHEDULE TABLE */}
      {result.schedule.length > 0 && (
        <div className={styles.scheduleSection}>
          <div className={styles.scheduleHeader}>
            <div>
              <h3 className={styles.scheduleTitle}>Month-by-Month Student Loan Amortization</h3>
              <p className={styles.scheduleSubtitle}>
                Tracking principal amortization, interest allocation, and declining debt balances.
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
          <div className={styles.historyTitle}>Recent Student Loan Calculations</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  setBalance(item.balance);
                  setInterestRate(item.rate);
                  if (item.years) setTermYears(item.years);
                }}
              >
                <div className={styles.historyAmount}>{formatCurrency(item.balance)}</div>
                <div className={styles.historyMeta}>
                  {item.rate}% APR • {item.years} yrs • ${item.monthly}/mo
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
