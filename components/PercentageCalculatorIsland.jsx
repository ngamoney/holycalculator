"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./PercentageCalculatorIsland.module.css";
import {
  calcPercentOf,
  calcWhatPercentOf,
  calcIsPercentOfWhat,
  calcPercentDifference,
  calcPercentChange,
  encodePercentageState,
  decodePercentageState,
} from "@/lib/calculations/percentage";

const STORAGE_KEY = "holycalc_percentage_history";

export default function PercentageCalculatorIsland() {
  // Mini 1: What is P% of V1?
  const [p1, setP1] = useState("15");
  const [v1, setV1] = useState("200");
  const [res1, setRes1] = useState(null);

  // Mini 2: V1 is what % of V2?
  const [v2a, setV2a] = useState("30");
  const [v2b, setV2b] = useState("200");
  const [res2, setRes2] = useState(null);

  // Mini 3: V1 is P% of what?
  const [v3a, setV3a] = useState("30");
  const [p3, setP3] = useState("15");
  const [res3, setRes3] = useState(null);

  // Mini 4: Percentage Difference
  const [diff1, setDiff1] = useState("100");
  const [diff2, setDiff2] = useState("150");
  const [resDiff, setResDiff] = useState(null);

  // Mini 5: Percentage Change
  const [valChange, setValChange] = useState("100");
  const [pctChange, setPctChange] = useState("20");
  const [changeMode, setChangeMode] = useState("increase"); // "increase" | "decrease"
  const [resChange, setResChange] = useState(null);

  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Load URL state & localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlState = decodePercentageState(window.location.search);
    if (urlState) {
      if (urlState.p1) setP1(urlState.p1);
      if (urlState.v1) setV1(urlState.v1);
      if (urlState.diff1) setDiff1(urlState.diff1);
      if (urlState.diff2) setDiff2(urlState.diff2);
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Run Calculations
  const runCalculations = useCallback(() => {
    const r1 = calcPercentOf(p1, v1);
    setRes1(r1);

    const r2 = calcWhatPercentOf(v2a, v2b);
    setRes2(r2);

    const r3 = calcIsPercentOfWhat(v3a, p3);
    setRes3(r3);

    const rd = calcPercentDifference(diff1, diff2);
    setResDiff(rd);

    const rc = calcPercentChange(valChange, pctChange, changeMode);
    setResChange(rc);

    // Save history item if Card 1 computed
    if (r1 && typeof window !== "undefined") {
      const item = {
        id: Date.now(),
        date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        label: `${p1}% of ${v1}`,
        resultText: r1.resultFormatted,
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
  }, [p1, v1, v2a, v2b, v3a, p3, diff1, diff2, valChange, pctChange, changeMode]);

  // Debounce
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runCalculations();
    }, 200);
    return () => clearTimeout(timerRef.current);
  }, [runCalculations]);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const search = encodePercentageState({ p1, v1, diff1, diff2 });
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
    <div className={styles.islandWrapper}>
      {/* 1. What is X% of Y? */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>1. Basic Percentage</span>
          </div>
          <span className={styles.badge}>Formula: (P ÷ 100) × V</span>
        </div>
        <div className={styles.inlineSentence}>
          <span>What is</span>
          <input
            type="number"
            step="any"
            className={styles.inputMini}
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            aria-label="Percentage value"
          />
          <span>% of</span>
          <input
            type="number"
            step="any"
            className={styles.inputMini}
            value={v1}
            onChange={(e) => setV1(e.target.value)}
            aria-label="Base value"
          />
          <span>?</span>
        </div>
        {res1 && (
          <div className={styles.resultBadge}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", textTransform: "uppercase" }}>Answer</span>
              <div className={styles.resultText}>{res1.resultFormatted}</div>
            </div>
            <div className={styles.formulaSub}>{res1.formulaText}</div>
          </div>
        )}
      </div>

      {/* 2. X is what % of Y? */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>2. Find Percentage Share</span>
          </div>
          <span className={styles.badge}>Formula: (V1 ÷ V2) × 100</span>
        </div>
        <div className={styles.inlineSentence}>
          <input
            type="number"
            step="any"
            className={styles.inputMini}
            value={v2a}
            onChange={(e) => setV2a(e.target.value)}
            aria-label="First value"
          />
          <span>is what % of</span>
          <input
            type="number"
            step="any"
            className={styles.inputMini}
            value={v2b}
            onChange={(e) => setV2b(e.target.value)}
            aria-label="Second value"
          />
          <span>?</span>
        </div>
        {res2 && (
          <div className={styles.resultBadge}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", textTransform: "uppercase" }}>Percentage</span>
              <div className={styles.resultText}>{res2.resultFormatted}</div>
            </div>
            <div className={styles.formulaSub}>{res2.formulaText}</div>
          </div>
        )}
      </div>

      {/* 3. X is Y% of what? */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>3. Reverse Percentage (Find Base Total)</span>
          </div>
          <span className={styles.badge}>Formula: V ÷ (P ÷ 100)</span>
        </div>
        <div className={styles.inlineSentence}>
          <input
            type="number"
            step="any"
            className={styles.inputMini}
            value={v3a}
            onChange={(e) => setV3a(e.target.value)}
            aria-label="Part value"
          />
          <span>is</span>
          <input
            type="number"
            step="any"
            className={styles.inputMini}
            value={p3}
            onChange={(e) => setP3(e.target.value)}
            aria-label="Percentage"
          />
          <span>% of what total?</span>
        </div>
        {res3 && (
          <div className={styles.resultBadge}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", textTransform: "uppercase" }}>Base Total</span>
              <div className={styles.resultText}>{res3.resultFormatted}</div>
            </div>
            <div className={styles.formulaSub}>{res3.formulaText}</div>
          </div>
        )}
      </div>

      {/* 4. Percentage Difference */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>4. Percentage Difference</span>
          </div>
          <span className={styles.badge}>Formula: |V1 - V2| ÷ Average × 100</span>
        </div>
        <div className={styles.inlineSentence}>
          <span>Difference between</span>
          <input
            type="number"
            step="any"
            className={styles.inputMini}
            value={diff1}
            onChange={(e) => setDiff1(e.target.value)}
            aria-label="Value 1"
          />
          <span>and</span>
          <input
            type="number"
            step="any"
            className={styles.inputMini}
            value={diff2}
            onChange={(e) => setDiff2(e.target.value)}
            aria-label="Value 2"
          />
        </div>
        {resDiff && (
          <div className={styles.resultBadge}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", textTransform: "uppercase" }}>Relative Difference</span>
              <div className={styles.resultText}>{resDiff.resultFormatted}</div>
            </div>
            <div className={styles.formulaSub}>{resDiff.formulaText}</div>
          </div>
        )}
      </div>

      {/* 5. Percentage Increase / Decrease */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>5. Percentage Increase / Decrease</span>
          </div>
          <span className={styles.badge}>Formula: V × (1 ± P/100)</span>
        </div>
        <div className={styles.inlineSentence}>
          <input
            type="number"
            step="any"
            className={styles.inputMini}
            value={valChange}
            onChange={(e) => setValChange(e.target.value)}
            aria-label="Base value"
          />
          <select
            className={styles.inputMini}
            style={{ width: "140px" }}
            value={changeMode}
            onChange={(e) => setChangeMode(e.target.value)}
          >
            <option value="increase">Increased (+)</option>
            <option value="decrease">Decreased (−)</option>
          </select>
          <span>by</span>
          <input
            type="number"
            step="any"
            className={styles.inputMini}
            value={pctChange}
            onChange={(e) => setPctChange(e.target.value)}
            aria-label="Percentage change"
          />
          <span>%</span>
        </div>
        {resChange && (
          <div className={styles.resultBadge}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", textTransform: "uppercase" }}>
                Final Value (Delta: {resChange.deltaFormatted})
              </span>
              <div className={styles.resultText}>{resChange.resultFormatted}</div>
            </div>
            <div className={styles.formulaSub}>{resChange.formulaText}</div>
          </div>
        )}
      </div>

      {/* Actions Bar */}
      <div className={styles.actionsBar}>
        <button type="button" className={styles.shareBtn} onClick={handleShare}>
          🔗 {copied ? "Link Copied!" : "Share Results"}
        </button>
        <span style={{ fontSize: "12px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>
          Instant Algebraic Percentage Math
        </span>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className={styles.historyBox}>
          <div className={styles.historyTitle}>
            <span>Recent Percentage Lookups (localStorage)</span>
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
