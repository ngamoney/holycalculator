"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./SalesTaxCalculatorIsland.module.css";
import {
  STATE_SALES_TAX_RATES,
  calculateSalesTax,
  formatCurrency,
} from "@/lib/calculations/salesTax";

const STORAGE_KEY = "holycalc_salestax_history";

export default function SalesTaxCalculatorIsland() {
  const [mode, setMode] = useState("afterTax"); // "afterTax" | "beforeTax" | "rate"
  const [selectedState, setSelectedState] = useState("");
  const [beforeTaxPrice, setBeforeTaxPrice] = useState("100");
  const [rate, setRate] = useState("7");
  const [afterTaxPrice, setAfterTaxPrice] = useState("107");

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Handle State Dropdown selection
  const handleStateChange = (code) => {
    setSelectedState(code);
    const stateObj = STATE_SALES_TAX_RATES.find((s) => s.code === code);
    if (stateObj) {
      setRate(stateObj.stateRate.toString());
    }
  };

  // URL state & localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const paramMode = params.get("mode");
    const paramState = params.get("state");
    const paramBefore = params.get("before");
    const paramRate = params.get("rate");
    const paramAfter = params.get("after");

    if (paramMode && ["afterTax", "beforeTax", "rate"].includes(paramMode)) {
      setMode(paramMode);
    }
    if (paramState) {
      setSelectedState(paramState);
    }
    if (paramBefore) setBeforeTaxPrice(paramBefore);
    if (paramRate) setRate(paramRate);
    if (paramAfter) setAfterTaxPrice(paramAfter);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save history helper
  const saveToHistory = useCallback((res) => {
    if (!res || !res.isValid) return;

    const stateObj = STATE_SALES_TAX_RATES.find((s) => s.code === selectedState);
    const item = {
      id: Date.now(),
      mode: res.mode,
      stateName: stateObj ? stateObj.name : null,
      beforeTax: formatCurrency(res.beforeTaxPrice),
      taxAmount: formatCurrency(res.taxAmount),
      rate: `${res.rate.toFixed(3).replace(/\.?0+$/, "")}%`,
      afterTax: formatCurrency(res.afterTaxPrice),
    };

    setHistory((prev) => {
      if (
        prev.length > 0 &&
        prev[0].beforeTax === item.beforeTax &&
        prev[0].afterTax === item.afterTax &&
        prev[0].rate === item.rate
      ) {
        return prev;
      }
      const updated = [item, ...prev.slice(0, 4)];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, [selectedState]);

  // Debounced calculation
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const res = calculateSalesTax({
        mode,
        beforeTaxPrice,
        rate,
        afterTaxPrice,
      });

      setResult(res);

      if (res.isValid) {
        if (mode === "afterTax") {
          setAfterTaxPrice(res.afterTaxPrice.toFixed(2));
        } else if (mode === "beforeTax") {
          setBeforeTaxPrice(res.beforeTaxPrice.toFixed(2));
        } else if (mode === "rate") {
          setRate(res.rate.toFixed(3).replace(/\.?0+$/, ""));
        }
        saveToHistory(res);
      }
    }, 150);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mode, beforeTaxPrice, rate, afterTaxPrice, saveToHistory]);

  // Share URL creation
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    if (selectedState) url.searchParams.set("state", selectedState);
    if (beforeTaxPrice) url.searchParams.set("before", beforeTaxPrice);
    if (rate) url.searchParams.set("rate", rate);
    if (afterTaxPrice) url.searchParams.set("after", afterTaxPrice);

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const loadHistoryItem = (item) => {
    if (item.mode) setMode(item.mode);
    setBeforeTaxPrice(item.beforeTax.replace(/[^0-9.]/g, ""));
    setAfterTaxPrice(item.afterTax.replace(/[^0-9.]/g, ""));
    setRate(item.rate.replace(/[^0-9.]/g, ""));
  };

  return (
    <div className={styles.islandContainer}>
      {/* Mode Tabs */}
      <div className={styles.modeTabs} role="tablist" aria-label="Calculation Mode">
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "afterTax" ? styles.modeBtnActive : ""}`}
          onClick={() => setMode("afterTax")}
        >
          Calculate Final Price (After Tax)
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "beforeTax" ? styles.modeBtnActive : ""}`}
          onClick={() => setMode("beforeTax")}
        >
          Calculate Original Price (Before Tax)
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "rate" ? styles.modeBtnActive : ""}`}
          onClick={() => setMode("rate")}
        >
          Find Tax Rate (%)
        </button>
      </div>

      <div className={styles.formGrid}>
        {/* Quick State Selector Dropdown */}
        <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
          <label className={styles.fieldLabel} htmlFor="sales-tax-state-select">
            <span>Pre-fill State/Territory Base Rate (Optional)</span>
            <span style={{ fontSize: "0.75rem", color: "var(--ink-60)" }}>50 States + DC + PR + Guam</span>
          </label>
          <select
            id="sales-tax-state-select"
            className={styles.selectField}
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            <option value="">-- Custom / Manual Entry --</option>
            {STATE_SALES_TAX_RATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.code}) — {s.stateRate.toFixed(2)}% Base Rate (Max Local {s.maxLocalRate.toFixed(2)}%)
              </option>
            ))}
          </select>
        </div>

        {/* Input: Before Tax Price */}
        {(mode === "afterTax" || mode === "rate") && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="before-tax-input">
              Price Before Tax ($)
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.prefixSymbol}>$</span>
              <input
                id="before-tax-input"
                type="number"
                step="any"
                min="0"
                className={`${styles.inputField} ${styles.hasPrefix}`}
                placeholder="100.00"
                value={beforeTaxPrice}
                onChange={(e) => setBeforeTaxPrice(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Input: Tax Rate */}
        {(mode === "afterTax" || mode === "beforeTax") && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="tax-rate-input">
              Sales Tax Rate (%)
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="tax-rate-input"
                type="number"
                step="any"
                min="0"
                className={`${styles.inputField} ${styles.hasSuffix}`}
                placeholder="7.0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <span className={styles.suffixSymbol}>%</span>
            </div>
          </div>
        )}

        {/* Input: After Tax Price */}
        {(mode === "beforeTax" || mode === "rate") && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="after-tax-input">
              Final Price After Tax ($)
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.prefixSymbol}>$</span>
              <input
                id="after-tax-input"
                type="number"
                step="any"
                min="0"
                className={`${styles.inputField} ${styles.hasPrefix}`}
                placeholder="107.00"
                value={afterTaxPrice}
                onChange={(e) => setAfterTaxPrice(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {result && !result.isValid && (
        <div className={styles.errorBanner}>{result.error}</div>
      )}

      {/* Results Card */}
      {result && result.isValid && (
        <div className={styles.resultCard}>
          <div className={styles.resultTitle}>
            {mode === "afterTax"
              ? "Calculated Total Price (After Tax)"
              : mode === "beforeTax"
              ? "Calculated Original Price (Before Tax)"
              : "Calculated Sales Tax Rate"}
          </div>

          <div className={styles.mainResultValue}>
            {mode === "rate"
              ? `${result.rate.toFixed(3).replace(/\.?0+$/, "")}%`
              : mode === "beforeTax"
              ? formatCurrency(result.beforeTaxPrice)
              : formatCurrency(result.afterTaxPrice)}
          </div>

          <div className={styles.breakdownGrid}>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Before-Tax Price</span>
              <span className={styles.breakdownValue}>{formatCurrency(result.beforeTaxPrice)}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Sales Tax Amount</span>
              <span className={styles.breakdownValue} style={{ color: "#03543F" }}>
                +{formatCurrency(result.taxAmount)}
              </span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Effective Tax Rate</span>
              <span className={styles.breakdownValue}>
                {result.rate.toFixed(3).replace(/\.?0+$/, "")}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* YMYL Notice Banner */}
      <div className={styles.disclaimerBox}>
        <span className={styles.disclaimerIcon}>ℹ️</span>
        <p className={styles.disclaimerText}>
          <strong>Reference Note:</strong> State tax rates shown are general base rates as of August 2026. Actual sales tax totals vary by county, city, transit district, and product exemptions (e.g., groceries, medical supplies). Verify current local rates with your state Department of Revenue.
        </p>
      </div>

      {/* Action Bar */}
      <div className={styles.actionRow}>
        <button type="button" className={styles.shareBtn} onClick={handleCopyLink}>
          {copied ? "✓ Link Copied!" : "🔗 Share Calculation URL"}
        </button>
      </div>

      {/* LocalStorage History */}
      {history.length > 0 && (
        <div className={styles.historyContainer}>
          <h4 className={styles.historyTitle}>Recent Calculations</h4>
          <ul className={styles.historyList}>
            {history.map((item) => (
              <li
                key={item.id}
                className={styles.historyItem}
                onClick={() => loadHistoryItem(item)}
              >
                <span>
                  {item.beforeTax} + Tax ({item.rate}) = <strong>{item.afterTax}</strong>
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-60)" }}>
                  Tax: {item.taxAmount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
