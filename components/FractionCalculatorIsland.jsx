"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./FractionCalculatorIsland.module.css";
import {
  calcBasicFraction,
  calcMixedNumbers,
  calcSimplifyFraction,
  calcDecimalToFraction,
  calcFractionToDecimal,
  calcBigNumberFraction,
  encodeFractionState,
  decodeFractionState,
} from "@/lib/calculations/fraction";

const STORAGE_KEY = "holycalc_fraction_history";

export default function FractionCalculatorIsland() {
  // Sub 1: Basic Fraction
  const [n1, setN1] = useState("1");
  const [d1, setD1] = useState("2");
  const [op1, setOp1] = useState("+");
  const [n2, setN2] = useState("1");
  const [d2, setD2] = useState("3");
  const [res1, setRes1] = useState(null);

  // Sub 2: Mixed Numbers
  const [w2_1, setW2_1] = useState("1");
  const [n2_1, setN2_1] = useState("1");
  const [d2_1, setD2_1] = useState("2");
  const [op2, setOp2] = useState("+");
  const [w2_2, setW2_2] = useState("2");
  const [n2_2, setN2_2] = useState("1");
  const [d2_2, setD2_2] = useState("3");
  const [res2, setRes2] = useState(null);

  // Sub 3: Simplify Fraction
  const [n3, setN3] = useState("24");
  const [d3, setD3] = useState("36");
  const [res3, setRes3] = useState(null);

  // Sub 4: Decimal to Fraction
  const [decimalInput, setDecimalInput] = useState("0.75");
  const [res4, setRes4] = useState(null);

  // Sub 5: Fraction to Decimal
  const [n5, setN5] = useState("3");
  const [d5, setD5] = useState("8");
  const [res5, setRes5] = useState(null);

  // Sub 6: Big Number Fraction (BigInt)
  const [bn1, setBn1] = useState("9007199254740992");
  const [bd1, setBd1] = useState("1");
  const [bOp, setBOp] = useState("+");
  const [bn2, setBn2] = useState("1");
  const [bd2, setBd2] = useState("1");
  const [res6, setRes6] = useState(null);

  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Load URL state & localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlState = decodeFractionState(window.location.search);
    if (urlState) {
      if (urlState.n1) setN1(urlState.n1);
      if (urlState.d1) setD1(urlState.d1);
      if (urlState.op) setOp1(urlState.op);
      if (urlState.n2) setN2(urlState.n2);
      if (urlState.d2) setD2(urlState.d2);
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
    const r1 = calcBasicFraction(n1, d1, op1, n2, d2);
    setRes1(r1);

    const r2 = calcMixedNumbers(w2_1, n2_1, d2_1, op2, w2_2, n2_2, d2_2);
    setRes2(r2);

    const r3 = calcSimplifyFraction(n3, d3);
    setRes3(r3);

    const r4 = calcDecimalToFraction(decimalInput);
    setRes4(r4);

    const r5 = calcFractionToDecimal(n5, d5);
    setRes5(r5);

    const r6 = calcBigNumberFraction(bn1, bd1, bOp, bn2, bd2);
    setRes6(r6);

    // Save history item if Sub 1 computed
    if (r1 && r1.isValid && typeof window !== "undefined") {
      const item = {
        id: Date.now(),
        date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        label: `${n1}/${d1} ${op1} ${n2}/${d2}`,
        resultText: `${r1.mixedText} (${r1.improperText})`,
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
  }, [
    n1, d1, op1, n2, d2,
    w2_1, n2_1, d2_1, op2, w2_2, n2_2, d2_2,
    n3, d3,
    decimalInput,
    n5, d5,
    bn1, bd1, bOp, bn2, bd2,
  ]);

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
    const search = encodeFractionState({ n1, d1, op: op1, n2, d2 });
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
      {/* 1. Basic Fraction Calculator */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>1. Basic Fraction Calculator</span>
          </div>
          <span className={styles.badge}>Four Operations (+ − × ÷)</span>
        </div>
        <div className={styles.fractionRow}>
          <div className={styles.fractionStack}>
            <input
              type="number"
              className={styles.inputNum}
              value={n1}
              onChange={(e) => setN1(e.target.value)}
              aria-label="Numerator 1"
            />
            <div className={styles.fractionBar} />
            <input
              type="number"
              className={styles.inputNum}
              value={d1}
              onChange={(e) => setD1(e.target.value)}
              aria-label="Denominator 1"
            />
          </div>

          <select
            className={styles.operatorSelect}
            value={op1}
            onChange={(e) => setOp1(e.target.value)}
          >
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>

          <div className={styles.fractionStack}>
            <input
              type="number"
              className={styles.inputNum}
              value={n2}
              onChange={(e) => setN2(e.target.value)}
              aria-label="Numerator 2"
            />
            <div className={styles.fractionBar} />
            <input
              type="number"
              className={styles.inputNum}
              value={d2}
              onChange={(e) => setD2(e.target.value)}
              aria-label="Denominator 2"
            />
          </div>

          <span>=</span>
        </div>

        {res1 && !res1.isValid && (
          <div className={styles.errorBanner}>⚠️ {res1.message}</div>
        )}

        {res1 && res1.isValid && (
          <div className={styles.resultBadge}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", textTransform: "uppercase" }}>Simplified Result</span>
              <div className={styles.resultText}>
                {res1.mixedText} <span style={{ fontSize: "16px", color: "var(--ink-60)", fontWeight: 500 }}>({res1.improperText})</span>
              </div>
            </div>
            <div className={styles.formulaSub}>{res1.formulaText}</div>
          </div>
        )}
      </div>

      {/* 2. Mixed Numbers Calculator */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>2. Mixed Numbers Calculator</span>
          </div>
          <span className={styles.badge}>Whole + Fraction</span>
        </div>
        <div className={styles.fractionRow}>
          <input
            type="number"
            placeholder="Whole"
            className={styles.inputWhole}
            value={w2_1}
            onChange={(e) => setW2_1(e.target.value)}
          />
          <div className={styles.fractionStack}>
            <input
              type="number"
              className={styles.inputNum}
              value={n2_1}
              onChange={(e) => setN2_1(e.target.value)}
            />
            <div className={styles.fractionBar} />
            <input
              type="number"
              className={styles.inputNum}
              value={d2_1}
              onChange={(e) => setD2_1(e.target.value)}
            />
          </div>

          <select
            className={styles.operatorSelect}
            value={op2}
            onChange={(e) => setOp2(e.target.value)}
          >
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>

          <input
            type="number"
            placeholder="Whole"
            className={styles.inputWhole}
            value={w2_2}
            onChange={(e) => setW2_2(e.target.value)}
          />
          <div className={styles.fractionStack}>
            <input
              type="number"
              className={styles.inputNum}
              value={n2_2}
              onChange={(e) => setN2_2(e.target.value)}
            />
            <div className={styles.fractionBar} />
            <input
              type="number"
              className={styles.inputNum}
              value={d2_2}
              onChange={(e) => setD2_2(e.target.value)}
            />
          </div>

          <span>=</span>
        </div>

        {res2 && !res2.isValid && (
          <div className={styles.errorBanner}>⚠️ {res2.message}</div>
        )}

        {res2 && res2.isValid && (
          <div className={styles.resultBadge}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", textTransform: "uppercase" }}>Result (Mixed &amp; Improper)</span>
              <div className={styles.resultText}>
                {res2.mixedText} <span style={{ fontSize: "16px", color: "var(--ink-60)", fontWeight: 500 }}>({res2.improperText})</span>
              </div>
            </div>
            <div className={styles.formulaSub}>{res2.formulaText}</div>
          </div>
        )}
      </div>

      {/* 3. Simplify Fraction Calculator */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>3. Simplify Fraction Calculator</span>
          </div>
          <span className={styles.badge}>GCD Reduction</span>
        </div>
        <div className={styles.fractionRow}>
          <span>Simplify:</span>
          <div className={styles.fractionStack}>
            <input
              type="number"
              className={styles.inputNum}
              value={n3}
              onChange={(e) => setN3(e.target.value)}
            />
            <div className={styles.fractionBar} />
            <input
              type="number"
              className={styles.inputNum}
              value={d3}
              onChange={(e) => setD3(e.target.value)}
            />
          </div>
          <span>=</span>
        </div>

        {res3 && !res3.isValid && (
          <div className={styles.errorBanner}>⚠️ {res3.message}</div>
        )}

        {res3 && res3.isValid && (
          <div className={styles.resultBadge}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", textTransform: "uppercase" }}>Simplified Fraction</span>
              <div className={styles.resultText}>
                {res3.improperText} {res3.mixedText !== res3.improperText ? `(${res3.mixedText})` : ""}
              </div>
            </div>
            <div className={styles.formulaSub}>{res3.formulaText}</div>
          </div>
        )}
      </div>

      {/* 4. Decimal to Fraction Converter */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>4. Decimal to Fraction Converter</span>
          </div>
          <span className={styles.badge}>Exact Ratio</span>
        </div>
        <div className={styles.fractionRow}>
          <span>Decimal:</span>
          <input
            type="text"
            className={styles.inputSingle}
            value={decimalInput}
            onChange={(e) => setDecimalInput(e.target.value)}
            placeholder="e.g. 0.75"
          />
          <span>=</span>
        </div>

        {res4 && !res4.isValid && (
          <div className={styles.errorBanner}>⚠️ {res4.message}</div>
        )}

        {res4 && res4.isValid && (
          <div className={styles.resultBadge}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", textTransform: "uppercase" }}>Fraction Result</span>
              <div className={styles.resultText}>
                {res4.improperText} <span style={{ fontSize: "16px", color: "var(--ink-60)", fontWeight: 500 }}>({res4.mixedText})</span>
              </div>
            </div>
            <div className={styles.formulaSub}>{res4.formulaText}</div>
          </div>
        )}
      </div>

      {/* 5. Fraction to Decimal Converter */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>5. Fraction to Decimal Converter</span>
          </div>
          <span className={styles.badge}>Numeric Division</span>
        </div>
        <div className={styles.fractionRow}>
          <div className={styles.fractionStack}>
            <input
              type="number"
              className={styles.inputNum}
              value={n5}
              onChange={(e) => setN5(e.target.value)}
            />
            <div className={styles.fractionBar} />
            <input
              type="number"
              className={styles.inputNum}
              value={d5}
              onChange={(e) => setD5(e.target.value)}
            />
          </div>
          <span>=</span>
        </div>

        {res5 && !res5.isValid && (
          <div className={styles.errorBanner}>⚠️ {res5.message}</div>
        )}

        {res5 && res5.isValid && (
          <div className={styles.resultBadge}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", textTransform: "uppercase" }}>Decimal Value</span>
              <div className={styles.resultText}>{res5.decimalFormatted}</div>
            </div>
            <div className={styles.formulaSub}>{res5.formulaText}</div>
          </div>
        )}
      </div>

      {/* 6. Big Number Fraction Calculator (BigInt) */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>6. Big Number Fraction Calculator (BigInt)</span>
          </div>
          <span className={styles.badge}>Arbitrary Precision (&gt; 2⁵³)</span>
        </div>
        <div className={styles.fractionRow}>
          <div className={styles.fractionStack} style={{ width: "130px" }}>
            <input
              type="text"
              className={styles.inputNum}
              value={bn1}
              onChange={(e) => setBn1(e.target.value)}
            />
            <div className={styles.fractionBar} />
            <input
              type="text"
              className={styles.inputNum}
              value={bd1}
              onChange={(e) => setBd1(e.target.value)}
            />
          </div>

          <select
            className={styles.operatorSelect}
            value={bOp}
            onChange={(e) => setBOp(e.target.value)}
          >
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>

          <div className={styles.fractionStack} style={{ width: "130px" }}>
            <input
              type="text"
              className={styles.inputNum}
              value={bn2}
              onChange={(e) => setBn2(e.target.value)}
            />
            <div className={styles.fractionBar} />
            <input
              type="text"
              className={styles.inputNum}
              value={bd2}
              onChange={(e) => setBd2(e.target.value)}
            />
          </div>

          <span>=</span>
        </div>

        {res6 && !res6.isValid && (
          <div className={styles.errorBanner}>⚠️ {res6.message}</div>
        )}

        {res6 && res6.isValid && (
          <div className={styles.resultBadge}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", textTransform: "uppercase" }}>Exact BigInt Result</span>
              <div className={styles.resultText} style={{ wordBreak: "break-all" }}>{res6.improperText}</div>
            </div>
            <div className={styles.formulaSub} style={{ wordBreak: "break-all" }}>{res6.formulaText}</div>
          </div>
        )}
      </div>

      {/* Actions Bar */}
      <div className={styles.actionsBar}>
        <button type="button" className={styles.shareBtn} onClick={handleShare}>
          🔗 {copied ? "Link Copied!" : "Share Results"}
        </button>
        <span style={{ fontSize: "12px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>
          Instant Euclidean GCD Fraction Math
        </span>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className={styles.historyBox}>
          <div className={styles.historyTitle}>
            <span>Recent Fraction Lookups (localStorage)</span>
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
