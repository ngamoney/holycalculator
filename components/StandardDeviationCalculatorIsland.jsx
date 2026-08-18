"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./StandardDeviationCalculatorIsland.module.css";
import {
  calculateStandardDeviation,
  encodeStandardDeviationState,
  decodeStandardDeviationState,
} from "@/lib/calculations/standardDeviation";

const STORAGE_KEY = "holycalc_stddev_history";

export default function StandardDeviationCalculatorIsland() {
  const [mode, setMode] = useState("sample"); // "sample" | "population"
  const [inputStr, setInputStr] = useState("10, 12, 23, 23, 16, 23, 21, 16");
  const [showTooltip, setShowTooltip] = useState(false);

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Parse URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlState = decodeStandardDeviationState(window.location.search);
    if (urlState) {
      if (urlState.mode) setMode(urlState.mode);
      if (urlState.inputStr) setInputStr(urlState.inputStr);
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Calculation
  const runCalculation = useCallback(() => {
    const res = calculateStandardDeviation({ inputStr, mode });
    setResult(res);

    if (res && res.isValid && typeof window !== "undefined") {
      const item = {
        id: Date.now(),
        date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        label: `N=${res.count} (${mode === "sample" ? "Sample s" : "Pop σ"})`,
        sdVal: `${res.formulaSymbol} = ${res.sdFormatted}`,
      };
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.label !== item.label || h.sdVal !== item.sdVal);
        const updated = [item, ...filtered].slice(0, 5);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }
  }, [inputStr, mode]);

  // Debounce (300ms for string inputs)
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runCalculation();
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [runCalculation]);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const search = encodeStandardDeviationState({ mode, inputStr });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${search}`;
    window.history.replaceState(null, "", `?${search}`);

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

  return (
    <div className={styles.islandCard}>
      {/* Mode Toggle Header */}
      <div className={styles.modeHeader}>
        <div className={styles.modeToggleGroup} role="tablist" aria-label="Standard Deviation Calculation Type">
          <button
            role="tab"
            aria-selected={mode === "sample"}
            className={`${styles.modeBtn} ${mode === "sample" ? styles.modeBtnActive : ""}`}
            onClick={() => setMode("sample")}
          >
            Sample (s, N−1)
          </button>
          <button
            role="tab"
            aria-selected={mode === "population"}
            className={`${styles.modeBtn} ${mode === "population" ? styles.modeBtnActive : ""}`}
            onClick={() => setMode("population")}
          >
            Population (σ, N)
          </button>
        </div>

        <button
          type="button"
          className={styles.helpBtn}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          ❓ Sample vs. Population difference?
        </button>
      </div>

      {/* Mode Tooltip Notice */}
      {showTooltip && (
        <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", color: "var(--ink-60)", marginBottom: "20px", lineHeight: "1.5" }}>
          <strong>Sample SD (s):</strong> Used when your dataset represents a sample taken from a larger population (uses N−1 divisor to correct bias).<br />
          <strong>Population SD (σ):</strong> Used when your dataset contains every single item of the entire population (uses N divisor).
        </div>
      )}

      {/* Input Data Set Textarea */}
      <div className={styles.fieldGroup}>
        <label htmlFor="sd-textarea" className={styles.fieldLabel}>
          <span>Data Set</span>
          <span className={styles.subText}>Separate numbers with commas, spaces, or newlines (Max 1,000 values)</span>
        </label>
        <textarea
          id="sd-textarea"
          className={styles.textareaControl}
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          placeholder="e.g. 10, 12, 23, 23, 16, 23, 21, 16"
          rows={4}
        />
      </div>

      {/* Error Banners */}
      {result && !result.isValid && (
        <div className={styles.errorNotice}>
          ⚠️ {result.message}
        </div>
      )}

      {/* Result Display */}
      {result && result.isValid && (
        <div className={styles.resultBox}>
          <div className={styles.headlineRow}>
            <div>
              <div style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--ink-60)", textTransform: "uppercase" }}>
                {mode === "sample" ? "Sample Standard Deviation (s)" : "Population Standard Deviation (σ)"}
              </div>
              <div className={styles.resultValue}>
                {result.formulaSymbol} = {result.sdFormatted}
              </div>
            </div>
            <div className={styles.badge}>
              N = {result.count.toLocaleString()} Values
            </div>
          </div>

          {/* Metrics Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricTitle}>Variance ({result.varianceSymbol})</span>
              <span className={styles.metricVal}>{result.varianceFormatted}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricTitle}>Mean ({result.meanSymbol})</span>
              <span className={styles.metricVal}>{result.meanFormatted}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricTitle}>Sum (Σx)</span>
              <span className={styles.metricVal}>{result.sumFormatted}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricTitle}>Count (N)</span>
              <span className={styles.metricVal}>{result.count.toLocaleString()}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricTitle}>Standard Error (SE)</span>
              <span className={styles.metricVal}>{result.standardErrorFormatted}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricTitle}>95% Margin of Error</span>
              <span className={styles.metricVal}>±{result.marginOfError95Formatted}</span>
            </div>
          </div>

          <div style={{ fontSize: "13px", color: "var(--ink-60)", background: "var(--paper-raised)", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--line)" }}>
            ℹ️ <strong>95% Confidence Interval for Mean:</strong> {result.confidenceInterval95.text} (using divisor N={result.divisorUsed})
          </div>

          {/* Actions Bar */}
          <div className={styles.actionsBar}>
            <button type="button" className={styles.shareBtn} onClick={handleShare}>
              🔗 {copied ? "Link Copied!" : "Share Results"}
            </button>
            <span style={{ fontSize: "12px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>
              Instant Statistical Computation
            </span>
          </div>
        </div>
      )}

      {/* History Log */}
      {history.length > 0 && (
        <div className={styles.historyBox}>
          <div className={styles.historyTitle}>
            <span>Recent Data Sets (localStorage)</span>
            <button type="button" className={styles.clearBtn} onClick={clearHistory}>
              Clear History
            </button>
          </div>
          <ul className={styles.historyList}>
            {history.map((h) => (
              <li key={h.id} className={styles.historyItem}>
                <span>{h.date} — {h.label}: <strong>{h.sdVal}</strong></span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
