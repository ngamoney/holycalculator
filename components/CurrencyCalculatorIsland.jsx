"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./CurrencyCalculatorIsland.module.css";
import {
  POPULAR_CURRENCIES,
  ALL_CURRENCIES,
  convertCurrency,
  convertCustomRate,
} from "@/lib/calculations/currency";

const STORAGE_KEY = "holycalc_currency_history";
const CACHE_KEY = "holycalc_currency_rates_cache";

export default function CurrencyCalculatorIsland() {
  const [amountStr, setAmountStr] = useState("100");
  const [fromCode, setFromCode] = useState("USD");
  const [toCode, setToCode] = useState("EUR");
  const [popularOnly, setPopularOnly] = useState(true);

  // Custom rate inputs
  const [customAmount, setCustomAmount] = useState("100");
  const [customRate, setCustomRate] = useState("1.10");

  // Rates State
  const [rates, setRates] = useState(null);
  const [rateDate, setRateDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Fetch Exchange Rates on mount
  useEffect(() => {
    async function loadRates() {
      setLoading(true);
      setErrorMsg("");

      // 1. Try session cache
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.rates) {
            setRates(parsed.rates);
            setRateDate(parsed.date || "Today");
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignore
      }

      // 2. Fetch from live API
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!res.ok) throw new Error("Failed to fetch live rates.");
        const data = await res.json();

        if (data && data.rates) {
          setRates(data.rates);
          const dateStr = data.time_last_update_utc
            ? new Date(data.time_last_update_utc).toLocaleDateString()
            : "Today";
          setRateDate(dateStr);

          // Save cache
          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ rates: data.rates, date: dateStr })
            );
          } catch {
            // ignore
          }
        } else {
          throw new Error("Invalid rate response format.");
        }
      } catch (err) {
        setErrorMsg("Unable to load live exchange rates. Using manual custom rate converter below.");
      } finally {
        setLoading(false);
      }
    }

    loadRates();

    // Load history
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const handleSwap = () => {
    const tmp = fromCode;
    setFromCode(toCode);
    setToCode(tmp);
  };

  // Convert live
  const result = convertCurrency(amountStr, fromCode, toCode, rates);
  const customResult = convertCustomRate(customAmount, customRate);

  // Save history
  const runHistorySave = useCallback(() => {
    if (result !== null && typeof window !== "undefined") {
      const item = {
        id: Date.now(),
        date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        label: `${amountStr} ${fromCode} → ${toCode}`,
        resultText: `${result.toLocaleString()} ${toCode}`,
      };

      setHistory((prev) => {
        const filtered = prev.filter((h) => h.label !== item.label);
        const updated = [item, ...filtered].slice(0, 5);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }
  }, [amountStr, fromCode, toCode, result]);

  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runHistorySave();
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [runHistorySave]);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams({ amt: amountStr, from: fromCode, to: toCode });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", `?${params.toString()}`);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const currencyList = popularOnly ? POPULAR_CURRENCIES : ALL_CURRENCIES;

  return (
    <div className={styles.islandCard}>
      {/* Top Meta Bar */}
      <div className={styles.topMeta}>
        <div className={styles.timestampTag}>
          {loading ? "⌛ Fetching live rates..." : rateDate ? `🟢 Live Rates as of ${rateDate}` : "⚠️ Manual Mode"}
        </div>
        <label className={styles.popularToggle}>
          <input
            type="checkbox"
            checked={popularOnly}
            onChange={(e) => setPopularOnly(e.target.checked)}
          />
          <span>Popular Currencies Only</span>
        </label>
      </div>

      {errorMsg && (
        <div style={{ background: "rgba(220,53,69,0.08)", border: "1px solid rgba(220,53,69,0.25)", color: "#c02b3a", padding: "10px 14px", borderRadius: "8px", fontSize: "13px" }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Section A: Live Converter Grid */}
      <div className={styles.currencyGrid}>
        <div className={styles.unitBox}>
          <span className={styles.boxLabel}>Amount &amp; From Currency</span>
          <input
            type="number"
            step="any"
            className={styles.inputControl}
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="Amount"
          />
          <select
            className={styles.selectControl}
            value={fromCode}
            onChange={(e) => setFromCode(e.target.value)}
          >
            {currencyList.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={styles.swapBtn}
          onClick={handleSwap}
          title="Swap Currencies"
          aria-label="Swap Currencies"
        >
          ↕
        </button>

        <div className={styles.unitBox}>
          <span className={styles.boxLabel}>To Currency</span>
          <select
            className={styles.selectControl}
            value={toCode}
            onChange={(e) => setToCode(e.target.value)}
          >
            {currencyList.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          <div className={styles.inputControl} style={{ background: "var(--paper)", display: "flex", alignItems: "center" }}>
            {result !== null ? `${result.toLocaleString()} ${toCode}` : "—"}
          </div>
        </div>
      </div>

      {/* Result Display */}
      {result !== null && (
        <div className={styles.resultBox}>
          <div style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--ink-60)", textTransform: "uppercase" }}>
            Converted Live Result ({fromCode} → {toCode})
          </div>
          <div className={styles.resultText}>
            {amountStr} {fromCode} = <strong>{result.toLocaleString()} {toCode}</strong>
          </div>
        </div>
      )}

      {/* Section B: Custom/Manual Rate Converter */}
      <div className={styles.customSection}>
        <div className={styles.customSectionTitle}>
          🛠️ Custom / Bank Rate Converter (Manual Override)
        </div>
        <div className={styles.customRow}>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-60)" }}>Amount</span>
            <input
              type="number"
              step="any"
              className={styles.inputControl}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
          </div>
          <div>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-60)" }}>Custom Rate (1 : X)</span>
            <input
              type="number"
              step="any"
              className={styles.inputControl}
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
            />
          </div>
        </div>
        {customResult !== null && (
          <div style={{ fontSize: "14px", fontFamily: "var(--mono)", color: "var(--ink)", fontWeight: 700 }}>
            Custom Calculation: {customAmount} × {customRate} = {customResult.toLocaleString()}
          </div>
        )}
      </div>

      {/* Section C: Popular Market Rates Reference Table */}
      {rates && (
        <div className={styles.ratesTableContainer}>
          <table className={styles.ratesTable}>
            <thead>
              <tr>
                <th>Major Currency Pair</th>
                <th>Mid-Market Exchange Rate</th>
              </tr>
            </thead>
            <tbody>
              {["EUR", "GBP", "JPY", "CAD", "AUD", "INR"].map((code) => (
                <tr key={code}>
                  <td>1 USD to {code}</td>
                  <td>{rates[code] ? rates[code].toFixed(4) : "—"} {code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* YMYL Financial Disclaimer */}
      <div className={styles.disclaimerNotice}>
        <strong>Financial &amp; Exchange Disclaimer:</strong> Displayed exchange rates represent wholesale interbank mid-market rates for informational and planning purposes only. Commercial banks, credit cards, and exchange kiosks apply bid-ask spreads and transaction fees. Always verify exact exchange rates with your bank or financial service provider before executing real-world transactions.
      </div>

      {/* Actions Bar */}
      <div className={styles.actionsBar}>
        <button type="button" className={styles.shareBtn} onClick={handleShare}>
          🔗 {copied ? "Link Copied!" : "Share Results"}
        </button>
        <span style={{ fontSize: "12px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>
          Live Central Bank Feeds
        </span>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className={styles.historyBox}>
          <div className={styles.historyTitle}>
            <span>Recent Lookups (localStorage)</span>
            <button type="button" className={styles.clearBtn} onClick={clearHistory}>
              Clear History
            </button>
          </div>
          <ul className={styles.historyList}>
            {history.map((h) => (
              <li key={h.id} className={styles.historyItem}>
                <span>{h.date} — {h.label}: <strong>{h.resultText}</strong></span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
