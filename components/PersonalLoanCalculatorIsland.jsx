"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calculatePersonalLoan, formatCurrency, formatCurrencyCents } from "@/lib/calculations/personalLoan";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl, copyToClipboard } from "@/lib/calculations/retentionHelpers";
import YmylDisclaimer from "@/components/YmylDisclaimer";
import styles from "./PersonalLoanCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_personalloan_history";

export default function PersonalLoanCalculatorIsland() {
  const [loanAmount, setLoanAmount] = useState(20000);
  const [termYears, setTermYears] = useState(5);
  const [termMonths, setTermMonths] = useState(0);
  const [interestRate, setInterestRate] = useState(10.0);

  // Fees
  const [showFees, setShowFees] = useState(false);
  const [originationFeeValue, setOriginationFeeValue] = useState(3.0);
  const [originationFeeType, setOriginationFeeType] = useState("percent"); // 'percent' | 'amount'
  const [originationPaidBy, setOriginationPaidBy] = useState("deducted"); // 'deducted' | 'upfront'
  const [monthlyFee, setMonthlyFee] = useState(0);

  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL & LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("amount")) setLoanAmount(parseFloat(params.get("amount")) || 20000);
    if (params.has("years")) setTermYears(parseFloat(params.get("years")) || 5);
    if (params.has("months")) setTermMonths(parseFloat(params.get("months")) || 0);
    if (params.has("rate")) setInterestRate(parseFloat(params.get("rate")) || 10.0);
    if (params.has("orig")) {
      setOriginationFeeValue(parseFloat(params.get("orig")) || 3.0);
      setShowFees(true);
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
        orig: showFees && originationFeeValue > 0 ? originationFeeValue : undefined,
      });
    }, 250);
    return () => clearTimeout(syncTimerRef.current);
  }, [loanAmount, termYears, termMonths, interestRate, showFees, originationFeeValue]);

  // Live calculation
  const result = useMemo(() => {
    return calculatePersonalLoan({
      loanAmount,
      termYears,
      termMonths,
      interestRate,
      originationFeeValue: showFees ? originationFeeValue : 0,
      originationFeeType,
      originationPaidBy,
      monthlyFee: showFees ? monthlyFee : 0,
    });
  }, [
    loanAmount,
    termYears,
    termMonths,
    interestRate,
    showFees,
    originationFeeValue,
    originationFeeType,
    originationPaidBy,
    monthlyFee,
  ]);

  // Save history
  useEffect(() => {
    if (!result || result.error || typeof window === "undefined" || loanAmount <= 0) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      amount: loanAmount,
      rate: interestRate,
      years: termYears,
      monthly: Math.round(result.monthlyPayment),
      apr: result.effectiveApr,
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "amount");
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

  const totalPaid = result.totalPaid || 1;
  const principalPct = Math.round((loanAmount / totalPaid) * 100);
  const interestPct = Math.round((result.totalInterest / totalPaid) * 100);
  const feesPct = Math.max(0, 100 - principalPct - interestPct);

  return (
    <div className={styles.islandContainer}>
      {toastMessage && <div className={styles.toastNotice}>{toastMessage}</div>}

      <div className={styles.calcGrid}>
        {/* INPUT CARD */}
        <div className={styles.inputCard}>
          <h2 className={styles.cardHeader}>Personal Loan Terms</h2>

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

          <div className={styles.dualInputs}>
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Loan Term</label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="termYears"
                  type="number"
                  min="0"
                  max="15"
                  value={termYears}
                  onChange={(e) => setTermYears(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>years</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="interestRate" className={styles.label}>
                  Interest Rate
                </label>
              </div>
              <div className={styles.inputPrefixWrap}>
                <input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="40"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.numInput}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          </div>

          {/* Origination & Fees Toggle */}
          <div className={styles.toggleSection}>
            <button
              type="button"
              className={styles.extraToggleBtn}
              onClick={() => setShowFees(!showFees)}
            >
              <span>{showFees ? "− Hide Fees & Insurance" : "+ Add Origination Fee & Insurance"}</span>
            </button>

            {showFees && (
              <div className={styles.extraInputsWrap}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <label htmlFor="originationFee" className={styles.label}>
                      Origination Fee
                    </label>
                  </div>
                  <div className={styles.dualInputs}>
                    <div className={styles.inputPrefixWrap}>
                      <input
                        id="originationFee"
                        type="number"
                        min="0"
                        step="0.5"
                        value={originationFeeValue}
                        onChange={(e) => setOriginationFeeValue(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={styles.numInput}
                      />
                      <span className={styles.suffix}>
                        {originationFeeType === "percent" ? "%" : "$"}
                      </span>
                    </div>
                    <select
                      value={originationFeeType}
                      onChange={(e) => setOriginationFeeType(e.target.value)}
                      className={styles.selectInputInline}
                    >
                      <option value="percent">% of Loan</option>
                      <option value="amount">Dollar ($)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="origPaid"
                      value="deducted"
                      checked={originationPaidBy === "deducted"}
                      onChange={(e) => setOriginationPaidBy(e.target.value)}
                    />
                    <span>Deduct from loan payout (standard)</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="origPaid"
                      value="upfront"
                      checked={originationPaidBy === "upfront"}
                      onChange={(e) => setOriginationPaidBy(e.target.value)}
                    />
                    <span>Paid out-of-pocket upfront</span>
                  </label>
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
              Share Personal Loan Quote
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className={styles.resultsCard}>
          <h2 className={styles.cardHeader}>Monthly Payment &amp; Cost</h2>

          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>Estimated Monthly Payment</div>
            <div className={styles.heroValue}>{formatCurrencyCents(result.monthlyPayment)}</div>
            <div className={styles.heroSub}>
              {showFees && result.effectiveApr !== interestRate
                ? `Effective All-in APR: ${result.effectiveApr}%`
                : `At ${interestRate}% APR over ${termYears} years`}
            </div>
          </div>

          {showFees && result.originationFeeAmount > 0 && (
            <div className={styles.netPayoutBanner}>
              <div className={styles.netPayoutRow}>
                <span>Cash Deposited to Account:</span>
                <strong>{formatCurrency(result.netLoanReceived)}</strong>
              </div>
              <div className={styles.netPayoutRow}>
                <span>Origination Fee Deducted:</span>
                <span>{formatCurrency(result.originationFeeAmount)}</span>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className={styles.breakdownBar}>
            <div className={styles.barPrincipal} style={{ width: `${principalPct}%` }} title={`Principal: ${principalPct}%`} />
            <div className={styles.barInterest} style={{ width: `${interestPct}%` }} title={`Interest: ${interestPct}%`} />
            {feesPct > 0 && <div className={styles.barFees} style={{ width: `${feesPct}%` }} title={`Fees: ${feesPct}%`} />}
          </div>

          <div className={styles.statList}>
            <div className={styles.statRow}>
              <span className={styles.statDotPrincipal}></span>
              <span className={styles.statLabel}>Principal Borrowed ({principalPct}%)</span>
              <span className={styles.statVal}>{formatCurrency(loanAmount)}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statDotInterest}></span>
              <span className={styles.statLabel}>Total Interest Paid ({interestPct}%)</span>
              <span className={styles.statVal}>{formatCurrencyCents(result.totalInterest)}</span>
            </div>
            {result.totalFees > 0 && (
              <div className={styles.statRow}>
                <span className={styles.statDotFees}></span>
                <span className={styles.statLabel}>Financing Fees &amp; Origination</span>
                <span className={styles.statVal}>{formatCurrency(result.totalFees)}</span>
              </div>
            )}
            <div className={`${styles.statRow} ${styles.statTotal}`}>
              <span>Total Cost to Repay</span>
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
              <h3 className={styles.scheduleTitle}>Personal Loan Amortization Schedule</h3>
              <p className={styles.scheduleSubtitle}>
                Month-by-month principal payoff tracking and declining interest charges.
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
          <div className={styles.historyTitle}>Recent Personal Loan Calculations</div>
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
