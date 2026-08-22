"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculatePayment, formatCurrency, formatCurrencyCents } from "@/lib/calculations/payment";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./PaymentCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_payment_history";

export default function PaymentCalculatorIsland() {
  const [mode, setMode] = useState("fixed-term"); // 'fixed-term' | 'fixed-payment'
  const [loanAmount, setLoanAmount] = useState(200000);
  const [termYears, setTermYears] = useState(15);
  const [termMonths, setTermMonths] = useState(0);
  const [monthlyPaymentInput, setMonthlyPaymentInput] = useState(2000);
  const [interestRate, setInterestRate] = useState(6.0);

  const [scheduleView, setScheduleView] = useState("yearly"); // 'yearly' | 'monthly'
  const [isAmortizationExpanded, setIsAmortizationExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL and LocalStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("mode")) setMode(params.get("mode"));
    if (params.has("amount")) setLoanAmount(parseFloat(params.get("amount")) || 200000);
    if (params.has("years")) setTermYears(parseFloat(params.get("years")) || 15);
    if (params.has("months")) setTermMonths(parseFloat(params.get("months")) || 0);
    if (params.has("payment")) setMonthlyPaymentInput(parseFloat(params.get("payment")) || 2000);
    if (params.has("rate")) setInterestRate(parseFloat(params.get("rate")) || 6.0);

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        mode,
        amount: loanAmount,
        years: mode === "fixed-term" ? termYears : undefined,
        months: mode === "fixed-term" && termMonths > 0 ? termMonths : undefined,
        payment: mode === "fixed-payment" ? monthlyPaymentInput : undefined,
        rate: interestRate,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [mode, loanAmount, termYears, termMonths, monthlyPaymentInput, interestRate]);

  // Live calculation
  const result = useMemo(() => {
    return calculatePayment({
      mode,
      loanAmount,
      termYears,
      termMonths,
      monthlyPaymentInput,
      interestRate,
    });
  }, [mode, loanAmount, termYears, termMonths, monthlyPaymentInput, interestRate]);

  // Save valid calculation to history
  useEffect(() => {
    if (!result || result.error || typeof window === "undefined" || loanAmount <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mode,
      amount: loanAmount,
      rate: interestRate,
      monthly: Math.round(result.monthlyPayment),
      term: result.yearsFormatted,
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "amount");
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

  const principalPercent = result.totalPayments > 0 ? Math.round((result.principal / result.totalPayments) * 100) : 0;
  const interestPercent = result.totalPayments > 0 ? 100 - principalPercent : 0;

  return (
    <div className={styles.islandContainer}>
      {toastMessage && <div className={styles.toastNotice}>{toastMessage}</div>}

      <div className={styles.calcGrid}>
        {/* INPUT CARD */}
        <div className={styles.inputCard}>
          <div className={styles.tabContainer}>
            <button
              type="button"
              className={`${styles.tabBtn} ${mode === "fixed-term" ? styles.activeTab : ""}`}
              onClick={() => setMode("fixed-term")}
            >
              Fixed Term
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${mode === "fixed-payment" ? styles.activeTab : ""}`}
              onClick={() => setMode("fixed-payment")}
            >
              Fixed Payments
            </button>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="loanAmount" className={styles.label}>
                Loan Amount
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                id="loanAmount"
                type="number"
                min="100"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
            </div>
          </div>

          {mode === "fixed-term" ? (
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Loan Term</label>
              </div>
              <div className={styles.dualInputs}>
                <div className={styles.inputPrefixWrap}>
                  <input
                    id="termYears"
                    type="number"
                    min="0"
                    max="50"
                    value={termYears}
                    onChange={(e) => setTermYears(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className={styles.numInput}
                  />
                  <span className={styles.suffix}>years</span>
                </div>
                <div className={styles.inputPrefixWrap}>
                  <input
                    id="termMonths"
                    type="number"
                    min="0"
                    max="11"
                    value={termMonths}
                    onChange={(e) => setTermMonths(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className={styles.numInput}
                  />
                  <span className={styles.suffix}>months</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="monthlyPaymentInput" className={styles.label}>
                  Monthly Payment Target
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="monthlyPaymentInput"
                  type="number"
                  min="10"
                  step="50"
                  value={monthlyPaymentInput}
                  onChange={(e) => setMonthlyPaymentInput(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
              </div>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="interestRate" className={styles.label}>
                Interest Rate (Annual APR)
              </label>
            </div>
            <div className={styles.inputPrefixWrap}>
              <input
                id="interestRate"
                type="number"
                step="0.05"
                min="0"
                max="40"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
              <span className={styles.suffix}>%</span>
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
          <h2 className={styles.cardHeader}>Calculation Summary</h2>

          {result.error ? (
            <div className={styles.errorAlert}>{result.error}</div>
          ) : (
            <>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>
                  {mode === "fixed-term" ? "Estimated Monthly Payment" : "Time to Debt-Free"}
                </div>
                <div className={styles.heroValue}>
                  {mode === "fixed-term"
                    ? formatCurrencyCents(result.monthlyPayment)
                    : result.yearsFormatted}
                </div>
                <div className={styles.heroSub}>
                  {mode === "fixed-term"
                    ? `For ${result.yearsFormatted} across ${result.totalMonths} total payments`
                    : `Paying ${formatCurrencyCents(result.monthlyPayment)} / month across ${result.totalMonths} payments`}
                </div>
              </div>

              {/* Progress split bar */}
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
                  <span className={styles.statLabel}>Total Principal ({principalPercent}%)</span>
                  <span className={styles.statVal}>{formatCurrency(result.principal)}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statDotInterest}></span>
                  <span className={styles.statLabel}>Total Interest ({interestPercent}%)</span>
                  <span className={styles.statVal}>{formatCurrencyCents(result.totalInterest)}</span>
                </div>
                <div className={`${styles.statRow} ${styles.statTotal}`}>
                  <span>Total Payments</span>
                  <span>{formatCurrencyCents(result.totalPayments)}</span>
                </div>
              </div>

              <YmylDisclaimer type="financial" />
            </>
          )}
        </div>
      </div>

      {/* AMORTIZATION SCHEDULE */}
      {!result.error && result.schedule.length > 0 && (
        <div className={styles.amortizationSection}>
          <div className={styles.scheduleHeader}>
            <div>
              <h3 className={styles.scheduleTitle}>Amortization Schedule</h3>
              <p className={styles.scheduleSubtitle}>
                Detailed breakdown of principal balance reduction and total interest paid over time.
              </p>
            </div>
            <div className={styles.scheduleControls}>
              <div className={styles.viewToggle}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${scheduleView === "yearly" ? styles.toggleActive : ""}`}
                  onClick={() => setScheduleView("yearly")}
                >
                  Annual
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${scheduleView === "monthly" ? styles.toggleActive : ""}`}
                  onClick={() => setScheduleView("monthly")}
                >
                  Monthly
                </button>
              </div>
              <button
                type="button"
                className={styles.expandBtn}
                onClick={() => setIsAmortizationExpanded(!isAmortizationExpanded)}
              >
                {isAmortizationExpanded ? "Collapse Table" : "View Full Table"}
              </button>
            </div>
          </div>

          <div className={`${styles.tableWrapper} ${isAmortizationExpanded ? styles.expanded : ""}`}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>{scheduleView === "yearly" ? "Year" : "Month"}</th>
                  <th>Principal Paid</th>
                  <th>Interest Paid</th>
                  <th>Total Interest</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {scheduleView === "yearly"
                  ? result.yearlySchedule.map((row) => (
                      <tr key={row.year}>
                        <td>Year {row.year}</td>
                        <td>{formatCurrency(row.principal)}</td>
                        <td>{formatCurrency(row.interest)}</td>
                        <td>{formatCurrency(row.totalInterest)}</td>
                        <td className={styles.balanceCell}>{formatCurrency(row.endingBalance)}</td>
                      </tr>
                    ))
                  : result.schedule.map((row) => (
                      <tr key={row.month}>
                        <td>Month {row.month}</td>
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

      {/* RECENTS STORAGE */}
      {history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyTitle}>Recent Calculations</div>
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.historyCard}
                onClick={() => {
                  setLoanAmount(item.amount);
                  setInterestRate(item.rate);
                  if (item.mode) setMode(item.mode);
                }}
              >
                <div className={styles.historyAmount}>{formatCurrency(item.amount)}</div>
                <div className={styles.historyMeta}>
                  {item.rate}% APR • {item.term || "Fixed"} • ${item.monthly}/mo
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
