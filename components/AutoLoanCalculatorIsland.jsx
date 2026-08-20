"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { calculateAutoLoan, formatCurrency, formatCurrencyCents } from "@/lib/calculations/autoLoan";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl } from "@/lib/calculations/retentionHelpers";
import styles from "./AutoLoanCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_autoloan_history";

export default function AutoLoanCalculatorIsland() {
  const [vehiclePrice, setVehiclePrice] = useState(35000);
  const [downPaymentValue, setDownPaymentValue] = useState(10);
  const [downPaymentType, setDownPaymentType] = useState("percent"); // 'percent' | 'amount'
  const [tradeInValue, setTradeInValue] = useState(5000);
  const [loanTermMonths, setLoanTermMonths] = useState(60);
  const [interestRate, setInterestRate] = useState(5.5);
  const [salesTaxRate, setSalesTaxRate] = useState(6.5);
  const [dealerFees, setDealerFees] = useState(500);
  const [titleRegFees, setTitleRegFees] = useState(300);
  const [includeTaxInLoan, setIncludeTaxInLoan] = useState(true);

  const [scheduleView, setScheduleView] = useState("yearly"); // 'yearly' | 'monthly'
  const [isAmortizationExpanded, setIsAmortizationExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  // Load from URL and LocalStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("price")) setVehiclePrice(parseFloat(params.get("price")) || 35000);
    if (params.has("down")) setDownPaymentValue(parseFloat(params.get("down")) || 10);
    if (params.has("downtype")) setDownPaymentType(params.get("downtype"));
    if (params.has("trade")) setTradeInValue(parseFloat(params.get("trade")) || 5000);
    if (params.has("term")) setLoanTermMonths(parseInt(params.get("term"), 10) || 60);
    if (params.has("rate")) setInterestRate(parseFloat(params.get("rate")) || 5.5);
    if (params.has("tax")) setSalesTaxRate(parseFloat(params.get("tax")) || 6.5);

    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  // Sync state to URL params (debounced ~300ms)
  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({
        price: vehiclePrice,
        down: downPaymentValue,
        downtype: downPaymentType,
        trade: tradeInValue,
        term: loanTermMonths,
        rate: interestRate,
        tax: salesTaxRate,
      });
    }, 300);
    return () => clearTimeout(syncTimerRef.current);
  }, [vehiclePrice, downPaymentValue, downPaymentType, tradeInValue, loanTermMonths, interestRate, salesTaxRate]);

  // Compute live auto loan output
  const result = useMemo(() => {
    return calculateAutoLoan({
      vehiclePrice,
      downPaymentValue,
      downPaymentType,
      tradeInValue,
      loanTermMonths,
      interestRate,
      salesTaxRate,
      dealerFees,
      titleRegFees,
      includeTaxInLoan,
    });
  }, [
    vehiclePrice,
    downPaymentValue,
    downPaymentType,
    tradeInValue,
    loanTermMonths,
    interestRate,
    salesTaxRate,
    dealerFees,
    titleRegFees,
    includeTaxInLoan,
  ]);

  // Save valid calculation runs to history
  useEffect(() => {
    if (!result || typeof window === "undefined") return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      price: vehiclePrice,
      down: downPaymentValue,
      rate: interestRate,
      term: loanTermMonths,
      monthly: Math.round(result.monthlyPayment),
    };
    const updated = saveHistoryToStorage(STORAGE_KEY, item, 5, "price");
    setHistory(updated);
  }, [vehiclePrice, downPaymentValue, interestRate, loanTermMonths, result]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleShare = () => {
    const text = `Auto Loan Summary (Holy Calculator):
• Vehicle Price: ${formatCurrency(result.vehiclePrice)}
• Down Payment: ${formatCurrency(result.downPaymentAmount)} (${result.downPaymentPercent.toFixed(1)}%)
• Trade-in Credit: ${formatCurrency(result.tradeInValue)}
• Financed Amount: ${formatCurrency(result.financedAmount)}
• Term & APR: ${result.loanTermMonths} Mo @ ${result.interestRate}% APR
• Estimated Monthly Payment: ${formatCurrencyCents(result.monthlyPayment)} / mo
• Total Interest Paid: ${formatCurrency(result.totalInterestPaid)}
• Total Out-of-Pocket: ${formatCurrency(result.totalOutofPocket)}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showToast("✓ Auto loan summary copied to clipboard!"))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    try {
      const temp = document.createElement("textarea");
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      showToast("✓ Auto loan summary copied to clipboard!");
    } catch {
      showToast("Unable to copy summary");
    }
  };

  return (
    <div className={styles.islandContainer}>
      {toastMessage && <div className={styles.toastNotice}>{toastMessage}</div>}

      {/* Main Two-Column Input & Results Layout */}
      <div className={styles.calcGrid}>
        {/* Input Column */}
        <div className={styles.inputCard}>
          <h3 className={styles.cardHeader}>Auto Loan Details</h3>

          {/* Vehicle Price */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Vehicle Purchase Price</label>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                type="number"
                className={styles.numInput}
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(parseFloat(e.target.value) || 0)}
                min="0"
                step="500"
              />
            </div>
          </div>

          {/* Down Payment ($ / % toggle) */}
          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Down Payment</label>
              <div className={styles.togglePill}>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${downPaymentType === "percent" ? styles.activePill : ""}`}
                  onClick={() => setDownPaymentType("percent")}
                >
                  %
                </button>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${downPaymentType === "amount" ? styles.activePill : ""}`}
                  onClick={() => setDownPaymentType("amount")}
                >
                  $
                </button>
              </div>
            </div>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>{downPaymentType === "amount" ? "$" : "%"}</span>
              <input
                type="number"
                className={styles.numInput}
                value={downPaymentValue}
                onChange={(e) => setDownPaymentValue(parseFloat(e.target.value) || 0)}
                min="0"
                step={downPaymentType === "percent" ? "1" : "500"}
              />
            </div>
            <span className={styles.subNote}>
              Equivalency: {formatCurrency(result.downPaymentAmount)} ({result.downPaymentPercent.toFixed(1)}%)
            </span>
          </div>

          {/* Trade-in Value */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Trade-in Allowance</label>
            <div className={styles.inputPrefixWrap}>
              <span className={styles.prefix}>$</span>
              <input
                type="number"
                className={styles.numInput}
                value={tradeInValue}
                onChange={(e) => setTradeInValue(parseFloat(e.target.value) || 0)}
                min="0"
                step="500"
              />
            </div>
          </div>

          {/* Term & APR */}
          <div className={styles.twoColRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Loan Term</label>
              <select
                className={styles.selectInput}
                value={loanTermMonths}
                onChange={(e) => setLoanTermMonths(parseInt(e.target.value, 10))}
              >
                <option value={24}>24 Months (2 yrs)</option>
                <option value={36}>36 Months (3 yrs)</option>
                <option value={48}>48 Months (4 yrs)</option>
                <option value={60}>60 Months (5 yrs)</option>
                <option value={72}>72 Months (6 yrs)</option>
                <option value={84}>84 Months (7 yrs)</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Interest Rate (APR)</label>
              <div className={styles.inputPrefixWrap}>
                <input
                  type="number"
                  className={styles.numInput}
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          </div>

          {/* Sales Tax & Fees */}
          <div className={styles.twoColRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>State Sales Tax</label>
              <div className={styles.inputPrefixWrap}>
                <input
                  type="number"
                  className={styles.numInput}
                  value={salesTaxRate}
                  onChange={(e) => setSalesTaxRate(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Dealer &amp; Title Fees</label>
              <div className={styles.inputPrefixWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  type="number"
                  className={styles.numInput}
                  value={dealerFees + titleRegFees}
                  onChange={(e) => setDealerFees(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="50"
                />
              </div>
            </div>
          </div>

          {/* Roll Tax & Fees into Loan Checkbox */}
          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              id="rollTax"
              checked={includeTaxInLoan}
              onChange={(e) => setIncludeTaxInLoan(e.target.checked)}
            />
            <label htmlFor="rollTax">Include sales tax &amp; fees in total loan balance</label>
          </div>
        </div>

        {/* Results Column */}
        <div className={styles.resultsCard}>
          <div className={styles.heroResultBox}>
            <span className={styles.heroLabel}>Estimated Monthly Payment</span>
            <span className={styles.heroAmount}>{formatCurrencyCents(result.monthlyPayment)}</span>
            <span className={styles.heroSub}>
              for {result.loanTermMonths} months @ {result.interestRate}% APR
            </span>
          </div>

          {/* Key Metrics Breakdown */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Total Principal</span>
              <strong className={styles.metricVal}>{formatCurrency(result.financedAmount)}</strong>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Total Interest</span>
              <strong className={styles.metricVal} style={{ color: "#3B3564" }}>
                {formatCurrency(result.totalInterestPaid)}
              </strong>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Sales Tax ({result.salesTaxRate}%)</span>
              <strong className={styles.metricVal}>{formatCurrency(result.totalSalesTax)}</strong>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Total Out-of-Pocket</span>
              <strong className={styles.metricVal}>{formatCurrency(result.totalOutofPocket)}</strong>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actionsRow}>
            <button type="button" className={styles.shareBtn} onClick={handleShare}>
              🔗 Copy Share Link
            </button>
          </div>
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="history-box">
          <div className="history-title">
            <span>Recent Auto Loan Calculations</span>
            <button
              type="button"
              className="history-clear-btn"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setHistory([]);
              }}
            >
              Clear History
            </button>
          </div>
          <ul className="history-list">
            {history.map((h) => (
              <li
                key={h.id}
                className="history-item"
                onClick={() => {
                  if (h.price) setVehiclePrice(h.price);
                  if (h.down) setDownPaymentValue(h.down);
                  if (h.rate) setInterestRate(h.rate);
                  if (h.term) setLoanTermMonths(h.term);
                }}
              >
                <span>
                  {formatCurrency(h.price)} Car — {h.down}% Down @ {h.rate}% ({h.term} mo)
                </span>
                <strong style={{ color: "var(--ink)" }}>{formatCurrency(h.monthly)}/mo</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Amortization Schedule Table Accordion */}
      <div className={styles.scheduleSection}>
        <div className={styles.scheduleHeader}>
          <h4>Amortization Schedule Breakdown</h4>
          <div className={styles.scheduleControls}>
            <div className={styles.togglePill}>
              <button
                type="button"
                className={`${styles.pillBtn} ${scheduleView === "yearly" ? styles.activePill : ""}`}
                onClick={() => setScheduleView("yearly")}
              >
                Yearly
              </button>
              <button
                type="button"
                className={`${styles.pillBtn} ${scheduleView === "monthly" ? styles.activePill : ""}`}
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
              {isAmortizationExpanded ? "Collapse Schedule ▲" : "Expand Full Schedule ▼"}
            </button>
          </div>
        </div>

        {isAmortizationExpanded && (
          <div className={styles.tableWrapper}>
            <table className={styles.schedTable}>
              <thead>
                <tr>
                  <th>{scheduleView === "yearly" ? "Year" : "Month"}</th>
                  <th>Total Payment</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Ending Balance</th>
                </tr>
              </thead>
              <tbody>
                {(scheduleView === "yearly" ? result.yearlySchedule : result.monthlySchedule).map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{scheduleView === "yearly" ? `Year ${row.year}` : `Month ${row.month}`}</strong></td>
                    <td>{formatCurrencyCents(row.totalPayment || row.payment)}</td>
                    <td style={{ color: "#4F7A5B" }}>{formatCurrencyCents(row.principalPaid || row.principal)}</td>
                    <td style={{ color: "#3B3564" }}>{formatCurrencyCents(row.interestPaid || row.interest)}</td>
                    <td>{formatCurrency(row.endingBalance !== undefined ? row.endingBalance : row.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
