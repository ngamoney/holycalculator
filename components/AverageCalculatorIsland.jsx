"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./AverageCalculatorIsland.module.css";
import {
  parseNumberList,
  calculateAverage,
  calculateWeightedAverage,
} from "@/lib/calculations/average";

const STORAGE_KEY = "holycalc_average_history";

export default function AverageCalculatorIsland() {
  const [mode, setMode] = useState("simple"); // "simple" | "weighted"
  const [rawInput, setRawInput] = useState("10, 20, 30, 40, 50");

  // Weighted Average rows state
  const [weightedRows, setWeightedRows] = useState([
    { id: 1, value: "80", weight: "40" },
    { id: 2, value: "90", weight: "60" },
  ]);

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // URL state & localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const paramMode = params.get("mode");
    const paramData = params.get("data");
    const paramValues = params.get("values");
    const paramWeights = params.get("weights");

    if (paramMode && ["simple", "weighted"].includes(paramMode)) {
      setMode(paramMode);
    }
    if (paramData) {
      setRawInput(paramData);
    }
    if (paramValues && paramWeights) {
      const vals = paramValues.split(",");
      const wts = paramWeights.split(",");
      const rows = vals.map((v, i) => ({
        id: i + 1,
        value: v || "",
        weight: wts[i] || "",
      }));
      if (rows.length > 0) setWeightedRows(rows);
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save history helper
  const saveToHistory = useCallback((res, currentMode) => {
    if (!res || !res.isValid) return;

    let item = null;
    if (currentMode === "simple" && typeof res.mean === "number") {
      item = {
        id: Date.now(),
        mode: "simple",
        label: `Mean: ${res.mean.toFixed(2)} (Count: ${res.count})`,
        summary: `Median: ${res.median}, Range: ${res.range}`,
      };
    } else if (currentMode === "weighted" && typeof res.weightedMean === "number") {
      item = {
        id: Date.now(),
        mode: "weighted",
        label: `Weighted Mean: ${res.weightedMean.toFixed(2)}`,
        summary: `Total Weight: ${res.totalWeight}`,
      };
    }

    if (!item) return;

    setHistory((prev) => {
      if (prev.length > 0 && prev[0].label === item.label) {
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
  }, []);

  // Debounced calculation
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (mode === "simple") {
        const nums = parseNumberList(rawInput);
        const res = calculateAverage(nums);
        setResult(res);
        if (res.isValid) saveToHistory(res, "simple");
      } else {
        const res = calculateWeightedAverage(weightedRows);
        setResult(res);
        if (res.isValid) saveToHistory(res, "weighted");
      }
    }, 150);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mode, rawInput, weightedRows, saveToHistory]);

  // Mode Tab Switcher with result reset
  const handleModeChange = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setResult(null); // prevent flash of mis-matched result object
  };

  // Sample data loaders
  const loadGradesSample = () => {
    setMode("simple");
    setRawInput("85, 92, 78, 90, 88, 95, 82, 100");
  };

  const loadSalesSample = () => {
    setMode("simple");
    setRawInput("1250, 1400, 980, 2100, 1750, 1400, 1900");
  };

  // Weighted Row Handlers
  const handleAddRow = () => {
    setWeightedRows((prev) => [
      ...prev,
      { id: Date.now(), value: "", weight: "" },
    ]);
  };

  const handleRemoveRow = (id) => {
    setWeightedRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRowChange = (id, field, val) => {
    setWeightedRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  // Share URL creation
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    if (mode === "simple") {
      url.searchParams.set("data", rawInput);
      url.searchParams.delete("values");
      url.searchParams.delete("weights");
    } else {
      url.searchParams.delete("data");
      const vals = weightedRows.map((r) => r.value).join(",");
      const wts = weightedRows.map((r) => r.weight).join(",");
      url.searchParams.set("values", vals);
      url.searchParams.set("weights", wts);
    }

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Safe result value check
  const isSimpleResultValid =
    result &&
    result.isValid &&
    result.calcType === "simple" &&
    typeof result.mean === "number";

  const isWeightedResultValid =
    result &&
    result.isValid &&
    result.calcType === "weighted" &&
    typeof result.weightedMean === "number";

  return (
    <div className={styles.islandContainer}>
      {/* Mode Tabs */}
      <div className={styles.modeTabs} role="tablist" aria-label="Average Mode">
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "simple" ? styles.modeBtnActive : ""}`}
          onClick={() => handleModeChange("simple")}
        >
          Simple Average &amp; Statistics
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "weighted" ? styles.modeBtnActive : ""}`}
          onClick={() => handleModeChange("weighted")}
        >
          Weighted Average
        </button>
      </div>

      {/* Simple Average Form */}
      {mode === "simple" && (
        <div className={styles.fieldGroup}>
          <div className={styles.fieldHeaderRow}>
            <label className={styles.fieldLabel} htmlFor="avg-raw-input">
              Enter Data Values (separated by commas, spaces, or newlines)
            </label>
            <div className={styles.sampleButtons}>
              <button type="button" className={styles.sampleBtn} onClick={loadGradesSample}>
                Sample Grades
              </button>
              <button type="button" className={styles.sampleBtn} onClick={loadSalesSample}>
                Sample Sales
              </button>
              <button type="button" className={styles.sampleBtn} onClick={() => setRawInput("")}>
                Clear
              </button>
            </div>
          </div>
          <textarea
            id="avg-raw-input"
            className={styles.textAreaInput}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="e.g. 10, 20, 30, 40, 50"
          />
        </div>
      )}

      {/* Weighted Average Form */}
      {mode === "weighted" && (
        <div>
          <table className={styles.weightedTable}>
            <thead>
              <tr>
                <th>Data Value ($x_i$)</th>
                <th>Weight ($w_i$)</th>
                <th style={{ width: "40px" }}></th>
              </tr>
            </thead>
            <tbody>
              {weightedRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="number"
                      step="any"
                      className={styles.inputField}
                      placeholder="e.g. 85"
                      value={row.value}
                      onChange={(e) => handleRowChange(row.id, "value", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      className={styles.inputField}
                      placeholder="e.g. 40"
                      value={row.weight}
                      onChange={(e) => handleRowChange(row.id, "weight", e.target.value)}
                    />
                  </td>
                  <td>
                    {weightedRows.length > 1 && (
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleRemoveRow(row.id)}
                        title="Remove Row"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className={styles.addRowBtn} onClick={handleAddRow}>
            + Add Row
          </button>
        </div>
      )}

      {/* Error Banner */}
      {result && !result.isValid && (
        <div className={styles.errorBanner}>{result.error}</div>
      )}

      {/* Simple Results Card */}
      {mode === "simple" && isSimpleResultValid && (
        <div className={styles.resultCard}>
          <div className={styles.resultTitle}>Calculated Arithmetic Mean (Average)</div>

          <div className={styles.mainResultValue}>
            {result.mean.toFixed(4).replace(/\.?0+$/, "")}
          </div>

          <div className={styles.breakdownGrid}>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Median</span>
              <span className={styles.breakdownValue}>{result.median}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Mode</span>
              <span className={styles.breakdownValue}>{result.modeText}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Range</span>
              <span className={styles.breakdownValue}>{result.range}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Count (N)</span>
              <span className={styles.breakdownValue}>{result.count}</span>
            </div>

            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Geometric Mean</span>
              <span className={styles.breakdownValue}>
                {result.geometricMean !== null ? result.geometricMean.toFixed(3) : "N/A"}
              </span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Harmonic Mean</span>
              <span className={styles.breakdownValue}>
                {result.harmonicMean !== null ? result.harmonicMean.toFixed(3) : "N/A"}
              </span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Sum (Σx)</span>
              <span className={styles.breakdownValue}>{result.sum}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Min / Max</span>
              <span className={styles.breakdownValue}>
                {result.min} / {result.max}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Weighted Results Card */}
      {mode === "weighted" && isWeightedResultValid && (
        <div className={styles.resultCard}>
          <div className={styles.resultTitle}>Calculated Weighted Average</div>

          <div className={styles.mainResultValue}>
            {result.weightedMean.toFixed(4).replace(/\.?0+$/, "")}
          </div>

          <div className={styles.breakdownGrid}>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Weighted Sum (Σ xw)</span>
              <span className={styles.breakdownValue}>{result.weightedSum.toFixed(2)}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Total Weight (Σ w)</span>
              <span className={styles.breakdownValue}>{result.totalWeight.toFixed(2)}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Valid Entries</span>
              <span className={styles.breakdownValue}>{result.validCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className={styles.actionRow}>
        <button type="button" className={styles.shareBtn} onClick={handleCopyLink}>
          {copied ? "✓ Link Copied!" : "🔗 Share Average Calculation URL"}
        </button>
      </div>

      {/* LocalStorage History */}
      {history.length > 0 && (
        <div className={styles.historyContainer}>
          <h4 className={styles.historyTitle}>Recent Calculations</h4>
          <ul className={styles.historyList}>
            {history.map((item) => (
              <li key={item.id} className={styles.historyItem}>
                <span>
                  <strong>{item.label}</strong>
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-60)" }}>
                  {item.summary}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
