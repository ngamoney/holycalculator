"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculateAmortization, formatCurrency, formatCurrencyCents } from "@/lib/calculations/amortization";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./AmortizationCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_amortization_history";

export default function AmortizationCalculatorIsland() {
  const [loanAmount, setLoanAmount] = useState(200000);
  const [termYears, setTermYears] = useState(15);
  const [termMonths, setTermMonths] = useState(0);
  const [interestRate, setInterestRate] = useState(6.0);

  // Extra payments
  const [showExtra, setShowExtra] = useState(false);
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [extraAnnual, setExtraAnnual] = useState(0);
  const [extraOneTime, setExtraOneTime] = useState(0);

  const [scheduleView, setScheduleView] = useState("yearly"); // 'yearly' | 'monthly'
  const [isAmortizationExpanded, setIsAmortizationExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL and LocalStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("amount")) setLoanAmount(parseFloat(params.get("amount")) || 200000);
    if (params.has("years")) setTermYears(parseFloat(params.get("years")) || 15);
    if (params.has("months")) setTermMonths(parseFloat(params.get("months")) || 0);
    if (params.has("rate")) setInterestRate(parseFloat(params.get("rate")) || 6.0);
    if (params.has("exMonthly")) {
      setExtraMonthly(parseFloat(params.get("exMonthly")) || 0);
      setShowExtra(true);
    }
    if (params.has("exAnnual")) {
      setExtraAnnual(parseFloat(params.get("exAnnual")) || 0);
      setShowExtra(true);
    }
    if (params.has("exOneTime")) {
      setExtraOneTime(parseFloat(params.get("exOneTime")) || 0);
      setShowExtra(true);
    }

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Debounced URL sync
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        amount: loanAmount,
        years: termYears,
        months: termMonths > 0 ? termMonths : undefined,
        rate: interestRate,
        exMonthly: extraMonthly > 0 ? extraMonthly : undefined,
        exAnnual: extraAnnual > 0 ? extraAnnual : undefined,
        exOneTime: extraOneTime > 0 ? extraOneTime : undefined,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [loanAmount, termYears, termMonths, interestRate, extraMonthly, extraAnnual, extraOneTime]);

  // Calculation
  const result = useMemo(() => {
    return calculateAmortization({
      loanAmount,
      termYears,
      termMonths,
      interestRate,
      extraMonthly: showExtra ? extraMonthly : 0,
      extraAnnual: showExtra ? extraAnnual : 0,
      extraOneTime: showExtra ? extraOneTime : 0,
    });
  }, [loanAmount, termYears, termMonths, interestRate, showExtra, extraMonthly, extraAnnual, extraOneTime]);

  // History save
  useEffect(() => {
    if (!result || result.error || typeof window === "undefined" || loanAmount <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      amount: loanAmount,
      rate: interestRate,
      years: termYears,
      monthly: Math.round(result.monthlyPayment),
      interest: Math.round(result.totalInterest),
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "amount");
    setHistory(updated);
  }, [result?.monthlyPayment, result?.totalInterest]);

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
          <h2 className={styles.cardHeader}>Loan Terms</h2>

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
                min="500"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className={styles.numInput}
              />
            </div>
          </div>

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

          {/* Extra Payments Toggle */}
          <div className={styles.toggleSection}>
            <button
              type="button"
              className={styles.extraToggleBtn}
              onClick={() => setShowExtra(!showExtra)}
            >
              <span>{showExtra ? "− Hide Extra Payments" : "+ Add Extra Principal Payments"}</span>
            </button>

            {showExtra && (
              <div className={styles.extraInputsWrap}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <label htmlFor="extraMonthly" className={styles.label}>
                      Extra Monthly Principal
                    </label>
                  </div>
                  <div className={styles.inputPrefixWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="extraMonthly"
                      type="number"
                      min="0"
                      step="50"
                      value={extraMonthly}
                      onChange={(e) => setExtraMonthly(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={styles.numInput}
                    />
                    <span className={styles.suffix}>/mo</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <label htmlFor="extraAnnual" className={styles.label}>
                      Extra Annual Principal
                    </label>
                  </div>
                  <div className={styles.inputPrefixWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="extraAnnual"
                      type="number"
                      min="0"
                      step="100"
                      value={extraAnnual}
                      onChange={(e) => setExtraAnnual(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={styles.numInput}
                    />
                    <span className={styles.suffix}>/yr</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <label htmlFor="extraOneTime" className={styles.label}>
                      One-Time Lump Sum Payment
                    </label>
                  </div>
                  <div className={styles.inputPrefixWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="extraOneTime"
                      type="number"
                      min="0"
                      step="500"
                      value={extraOneTime}
                      onChange={(e) => setExtraOneTime(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={styles.numInput}
                    />
                  </div>
                </div>
              </div>
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
              Share Calculation
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Amortization Summary</h2>

          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>Base Monthly Payment</div>
            <div className={styles.heroValue}>{formatCurrencyCents(result.monthlyPayment)}</div>
            <div className={styles.heroSub}>
              {showExtra && (extraMonthly > 0 || extraAnnual > 0 || extraOneTime > 0)
                ? `Payoff Date: ${result.payoffDateFormatted} (${result.monthsSaved} months early)`
                : `Across ${result.totalMonths} total monthly installments`}
            </div>
          </div>

          {showExtra && result.interestSaved > 0 && (
            <div className={styles.savingsBanner}>
              <div className={styles.savingsTitle}>Extra Payment Impact</div>
              <div className={styles.savingsRow}>
                <span>Interest Saved:</span>
                <strong>{formatCurrencyCents(result.interestSaved)}</strong>
              </div>
              <div className={styles.savingsRow}>
                <span>Time Saved:</span>
                <strong>
                  {Math.floor(result.monthsSaved / 12)} yrs {result.monthsSaved % 12} mos
                </strong>
              </div>
            </div>
          )}

          {/* Breakdown progress bar */}
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
              <span className={styles.statLabel}>Original Principal ({principalPercent}%)</span>
              <span className={styles.statVal}>{formatCurrency(result.principal)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statDotInterest}></span>
              <span className={styles.statLabel}>Total Interest Paid ({interestPercent}%)</span>
              <span className={styles.statVal}>{formatCurrencyCents(result.totalInterest)}</span>
            </div>
            <div className={`${styles.statRow} ${styles.statTotal}`}>
              <span>Total Payments</span>
              <span>{formatCurrencyCents(result.totalPayments)}</span>
            </div>
          </div>

          <YmylDisclaimer type="financial" />
        </div>
      </div>

      {/* SCHEDULE TABLE */}
      {result.schedule.length > 0 && (
        <div className={styles.amortizationSection}>
          <div className={styles.scheduleHeader}>
            <div>
              <h3 className={styles.scheduleTitle}>Complete Amortization Schedule</h3>
              <p className={styles.scheduleSubtitle}>
                Yearly and monthly schedule showing payment allocation, interest compounding, and balance reduction.
              </p>
            </div>
            <div className={styles.scheduleControls}>
              <div className={styles.viewToggle}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${scheduleView === "yearly" ? styles.toggleActive : ""}`}
                  onClick={() => setScheduleView("yearly")}
                >
                  Annual View
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${scheduleView === "monthly" ? styles.toggleActive : ""}`}
                  onClick={() => setScheduleView("monthly")}
                >
                  Monthly View
                </button>
              </div>
              <button
                type="button"
                className={styles.expandBtn}
                onClick={() => setIsAmortizationExpanded(!isAmortizationExpanded)}
              >
                {isAmortizationExpanded ? "Collapse Table" : "View Full Schedule"}
              </button>
            </div>
          </div>

          <div className={`${styles.tableWrapper} ${isAmortizationExpanded ? styles.expanded : ""}`}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>{scheduleView === "yearly" ? "Year" : "Period"}</th>
                  <th>Principal Paid</th>
                  <th>Interest Paid</th>
                  {showExtra && <th>Extra Paid</th>}
                  <th>Total Interest</th>
                  <th>Ending Balance</th>
                </tr>
              </thead>
              <tbody>
                {scheduleView === "yearly"
                  ? result.yearlySchedule.map((row) => (
                      <tr key={row.year}>
                        <td>
                          <strong>Year {row.year}</strong>{" "}
                          <span className={styles.calendarSub}>({row.calendarYear})</span>
                        </td>
                        <td>{formatCurrency(row.principal)}</td>
                        <td>{formatCurrency(row.interest)}</td>
                        {showExtra && <td>{formatCurrency(row.extra)}</td>}
                        <td>{formatCurrency(row.totalInterest)}</td>
                        <td className={styles.balanceCell}>{formatCurrency(row.endingBalance)}</td>
                      </tr>
                    ))
                  : result.schedule.map((row) => (
                      <tr key={row.monthIndex}>
                        <td>{row.monthLabel}</td>
                        <td>{formatCurrencyCents(row.principal)}</td>
                        <td>{formatCurrencyCents(row.interest)}</td>
                        {showExtra && <td>{formatCurrencyCents(row.extra)}</td>}
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
                  if (item.years) setTermYears(item.years);
                }}
              >
                <div className={styles.historyAmount}>{formatCurrency(item.amount)}</div>
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
