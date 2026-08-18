"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./ConversionCalculatorIsland.module.css";
import {
  CONVERSION_CATEGORIES,
  CONVERSION_UNITS,
  convertUnit,
} from "@/lib/data/conversionFactors";

const STORAGE_KEY = "holycalc_conversion_history";

export default function ConversionCalculatorIsland() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("in");
  const [toUnit, setToUnit] = useState("cm");
  const [valueStr, setValueStr] = useState("1");
  const [result, setResult] = useState(null);

  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Update units when category changes
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const units = CONVERSION_UNITS[newCat];
    if (units && units.length >= 2) {
      setFromUnit(units[0].id);
      setToUnit(units[1].id);
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("cat", newCat);
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    }
  };

  // Swap units
  const handleSwap = () => {
    const tmp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tmp);
  };

  // Convert
  const runConversion = useCallback(() => {
    const res = convertUnit(category, fromUnit, toUnit, valueStr);
    setResult(res);

    if (res !== null && typeof window !== "undefined") {
      const units = CONVERSION_UNITS[category];
      const fromObj = units?.find((u) => u.id === fromUnit);
      const toObj = units?.find((u) => u.id === toUnit);

      const item = {
        id: Date.now(),
        date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        label: `${valueStr} ${fromObj?.name || fromUnit} → ${toObj?.name || toUnit}`,
        resultText: `${res.toLocaleString()} ${toObj?.id || toUnit}`,
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
  }, [category, fromUnit, toUnit, valueStr]);

  // Debounce
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runConversion();
    }, 150);
    return () => clearTimeout(timerRef.current);
  }, [runConversion]);

  // Load history & URL state on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const catParam = params.get("cat") || params.get("category");
    const fromParam = params.get("from");
    const toParam = params.get("to");
    const vParam = params.get("v");

    if (catParam && CONVERSION_CATEGORIES.some((c) => c.id === catParam)) {
      setCategory(catParam);
      const units = CONVERSION_UNITS[catParam] || [];
      if (fromParam && units.some((u) => u.id === fromParam)) {
        setFromUnit(fromParam);
      } else if (units.length >= 1) {
        setFromUnit(units[0].id);
      }

      if (toParam && units.some((u) => u.id === toParam)) {
        setToUnit(toParam);
      } else if (units.length >= 2) {
        setToUnit(units[1].id);
      }
    }

    if (vParam) {
      setValueStr(vParam);
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams({ cat: category, from: fromUnit, to: toUnit, v: valueStr });
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

  const activeUnits = CONVERSION_UNITS[category] || [];
  const fromObj = activeUnits.find((u) => u.id === fromUnit);
  const toObj = activeUnits.find((u) => u.id === toUnit);

  return (
    <div className={styles.islandCard}>
      {/* Category Tabs */}
      <div className={styles.categoryTabs} role="tablist" aria-label="Conversion Categories">
        {CONVERSION_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={category === cat.id}
            className={`${styles.catBtn} ${category === cat.id ? styles.catBtnActive : ""}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Conversion Grid */}
      <div className={styles.conversionGrid}>
        {/* From Box */}
        <div className={styles.unitBox}>
          <span className={styles.boxLabel}>From</span>
          <select
            className={styles.selectControl}
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            {activeUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="any"
            className={styles.inputControl}
            value={valueStr}
            onChange={(e) => setValueStr(e.target.value)}
            placeholder="Enter value"
          />
        </div>

        {/* Swap Button */}
        <button
          type="button"
          className={styles.swapBtn}
          onClick={handleSwap}
          title="Swap From and To units"
          aria-label="Swap units"
        >
          ↕
        </button>

        {/* To Box */}
        <div className={styles.unitBox}>
          <span className={styles.boxLabel}>To</span>
          <select
            className={styles.selectControl}
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
          >
            {activeUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <div className={styles.inputControl} style={{ background: "var(--paper)", display: "flex", alignItems: "center" }}>
            {result !== null ? result.toLocaleString() : "—"}
          </div>
        </div>
      </div>

      {/* Result Display */}
      {result !== null && (
        <div className={styles.resultBox}>
          <div style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--ink-60)", textTransform: "uppercase" }}>
            Converted Value ({fromObj?.name} → {toObj?.name})
          </div>
          <div className={styles.resultText}>
            {valueStr} {fromObj?.name.split(" ")[0]} = <strong>{result.toLocaleString()}</strong> {toObj?.name.split(" ")[0]}
          </div>

          {/* Actions Bar */}
          <div className={styles.actionsBar}>
            <button type="button" className={styles.shareBtn} onClick={handleShare}>
              🔗 {copied ? "Link Copied!" : "Share Results"}
            </button>
            <span style={{ fontSize: "12px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>
              Instant Static Conversion Math
            </span>
          </div>
        </div>
      )}

      {/* History Log */}
      {history.length > 0 && (
        <div className={styles.historyBox}>
          <div className={styles.historyTitle}>
            <span>Recent Conversions (localStorage)</span>
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
