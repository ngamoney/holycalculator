"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./ScientificCalculatorIsland.module.css";
import { evaluateExpression } from "@/lib/calculations/scientific";

const STORAGE_KEY = "holycalc_scientific_history";

export default function ScientificCalculatorIsland() {
  const [expression, setExpression] = useState("");
  const [historyLine, setHistoryLine] = useState("");
  const [isDegreeMode, setIsDegreeMode] = useState(true);
  const [isShiftActive, setIsShiftActive] = useState(false);

  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Load saved history on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save history helper
  const addHistory = useCallback((expr, resStr) => {
    const item = { id: Date.now(), expr, result: resStr };
    setHistory((prev) => {
      const updated = [item, ...prev.slice(0, 4)];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Evaluate Expression
  const handleEvaluate = useCallback(() => {
    if (!expression) return;
    const res = evaluateExpression(expression, isDegreeMode);
    setHistoryLine(`${expression} =`);
    if (res.isValid) {
      setExpression(res.formattedResult);
      addHistory(expression, res.formattedResult);
    } else {
      setExpression("Error");
    }
  }, [expression, isDegreeMode, addHistory]);

  // Input Append Helper
  const handleAppend = (token) => {
    if (expression === "Error" || expression === "0") {
      setExpression(token);
    } else {
      setExpression((prev) => prev + token);
    }
  };

  // Clear & Delete
  const handleClear = () => {
    setExpression("");
    setHistoryLine("");
  };

  const handleDelete = () => {
    if (expression === "Error") {
      setExpression("");
    } else {
      setExpression((prev) => prev.slice(0, -1));
    }
  };

  // Memory Actions
  const handleMemoryStore = () => {
    const res = evaluateExpression(expression, isDegreeMode);
    if (res.isValid) setMemory(res.result);
  };
  const handleMemoryRecall = () => handleAppend(String(memory));
  const handleMemoryClear = () => setMemory(0);
  const handleMemoryAdd = () => {
    const res = evaluateExpression(expression, isDegreeMode);
    if (res.isValid) setMemory((prev) => prev + res.result);
  };
  const handleMemorySub = () => {
    const res = evaluateExpression(expression, isDegreeMode);
    if (res.isValid) setMemory((prev) => prev - res.result);
  };

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key >= "0" && e.key <= "9") handleAppend(e.key);
      else if (e.key === ".") handleAppend(".");
      else if (e.key === "+") handleAppend("+");
      else if (e.key === "-") handleAppend("-");
      else if (e.key === "*") handleAppend("×");
      else if (e.key === "/") handleAppend("÷");
      else if (e.key === "(") handleAppend("(");
      else if (e.key === ")") handleAppend(")");
      else if (e.key === "^") handleAppend("^");
      else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEvaluate();
      } else if (e.key === "Backspace") {
        handleDelete();
      } else if (e.key === "Escape") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expression, handleEvaluate]);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className={styles.islandContainer}>
      {/* Display Screen */}
      <div className={styles.displayScreen}>
        <div className={styles.historyLine}>{historyLine}</div>
        <div className={styles.mainLine}>{expression || "0"}</div>
      </div>

      {/* Mode Bar */}
      <div className={styles.modeBar}>
        <div className={styles.toggleGroup}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${isDegreeMode ? styles.toggleBtnActive : ""}`}
            onClick={() => setIsDegreeMode(true)}
          >
            DEG
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${!isDegreeMode ? styles.toggleBtnActive : ""}`}
            onClick={() => setIsDegreeMode(false)}
          >
            RAD
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${isShiftActive ? styles.toggleBtnActive : ""}`}
            onClick={() => setIsShiftActive(!isShiftActive)}
          >
            2nd
          </button>
        </div>
        {memory !== 0 && <span className={styles.memIndicator}>M = {memory}</span>}
      </div>

      {/* Keypad Grid */}
      <div className={styles.keypadGrid}>
        {/* Memory Row */}
        <button type="button" className={`${styles.keyBtn} ${styles.funcKey}`} onClick={handleMemoryClear}>MC</button>
        <button type="button" className={`${styles.keyBtn} ${styles.funcKey}`} onClick={handleMemoryRecall}>MR</button>
        <button type="button" className={`${styles.keyBtn} ${styles.funcKey}`} onClick={handleMemoryStore}>MS</button>
        <button type="button" className={`${styles.keyBtn} ${styles.funcKey}`} onClick={handleMemoryAdd}>M+</button>
        <button type="button" className={`${styles.keyBtn} ${styles.funcKey}`} onClick={handleMemorySub}>M-</button>

        {/* Scientific Row 1 */}
        <button
          type="button"
          className={`${styles.keyBtn} ${styles.funcKey}`}
          onClick={() => handleAppend(isShiftActive ? "asin(" : "sin(")}
        >
          {isShiftActive ? "sin⁻¹" : "sin"}
        </button>
        <button
          type="button"
          className={`${styles.keyBtn} ${styles.funcKey}`}
          onClick={() => handleAppend(isShiftActive ? "acos(" : "cos(")}
        >
          {isShiftActive ? "cos⁻¹" : "cos"}
        </button>
        <button
          type="button"
          className={`${styles.keyBtn} ${styles.funcKey}`}
          onClick={() => handleAppend(isShiftActive ? "atan(" : "tan(")}
        >
          {isShiftActive ? "tan⁻¹" : "tan"}
        </button>
        <button type="button" className={`${styles.keyBtn} ${styles.funcKey}`} onClick={() => handleAppend("π")}>π</button>
        <button type="button" className={`${styles.keyBtn} ${styles.funcKey}`} onClick={() => handleAppend("e")}>e</button>

        {/* Scientific Row 2 */}
        <button
          type="button"
          className={`${styles.keyBtn} ${styles.funcKey}`}
          onClick={() => handleAppend(isShiftActive ? "10^(" : "log(")}
        >
          {isShiftActive ? "10ˣ" : "log"}
        </button>
        <button
          type="button"
          className={`${styles.keyBtn} ${styles.funcKey}`}
          onClick={() => handleAppend(isShiftActive ? "e^(" : "ln(")}
        >
          {isShiftActive ? "eˣ" : "ln"}
        </button>
        <button
          type="button"
          className={`${styles.keyBtn} ${styles.funcKey}`}
          onClick={() => handleAppend(isShiftActive ? "^2" : "√(")}
        >
          {isShiftActive ? "x²" : "√"}
        </button>
        <button type="button" className={`${styles.keyBtn} ${styles.funcKey}`} onClick={() => handleAppend("^")}>xʸ</button>
        <button type="button" className={`${styles.keyBtn} ${styles.funcKey}`} onClick={() => handleAppend("fact(")}>n!</button>

        {/* Standard Numeric & Operators Row 1 */}
        <button type="button" className={`${styles.keyBtn} ${styles.funcKey}`} onClick={() => handleAppend("(")}>(</button>
        <button type="button" className={`${styles.keyBtn} ${styles.funcKey}`} onClick={() => handleAppend(")")}>)</button>
        <button type="button" className={`${styles.keyBtn} ${styles.clearKey}`} onClick={handleClear}>AC</button>
        <button type="button" className={`${styles.keyBtn} ${styles.clearKey}`} onClick={handleDelete}>DEL</button>
        <button type="button" className={`${styles.keyBtn} ${styles.opKey}`} onClick={() => handleAppend("÷")}>÷</button>

        {/* Numeric Row 2 */}
        <button type="button" className={styles.keyBtn} onClick={() => handleAppend("7")}>7</button>
        <button type="button" className={styles.keyBtn} onClick={() => handleAppend("8")}>8</button>
        <button type="button" className={styles.keyBtn} onClick={() => handleAppend("9")}>9</button>
        <button type="button" className={`${styles.keyBtn} ${styles.opKey}`} onClick={() => handleAppend("×")}>×</button>
        <button type="button" className={`${styles.keyBtn} ${styles.opKey}`} onClick={() => handleAppend("-")}>-</button>

        {/* Numeric Row 3 */}
        <button type="button" className={styles.keyBtn} onClick={() => handleAppend("4")}>4</button>
        <button type="button" className={styles.keyBtn} onClick={() => handleAppend("5")}>5</button>
        <button type="button" className={styles.keyBtn} onClick={() => handleAppend("6")}>6</button>
        <button type="button" className={`${styles.keyBtn} ${styles.opKey}`} onClick={() => handleAppend("+")}>+</button>
        <button type="button" className={`${styles.keyBtn} ${styles.equalsKey}`} onClick={handleEvaluate}>=</button>

        {/* Numeric Row 4 */}
        <button type="button" className={styles.keyBtn} onClick={() => handleAppend("1")}>1</button>
        <button type="button" className={styles.keyBtn} onClick={() => handleAppend("2")}>2</button>
        <button type="button" className={styles.keyBtn} onClick={() => handleAppend("3")}>3</button>
        <button type="button" className={styles.keyBtn} onClick={() => handleAppend("0")}>0</button>
        <button type="button" className={styles.keyBtn} onClick={() => handleAppend(".")}>.</button>
      </div>

      {/* History List */}
      {history.length > 0 && (
        <div className={styles.historyContainer}>
          <h4 className={styles.historyTitle}>Calculation History</h4>
          <ul className={styles.historyList}>
            {history.map((item) => (
              <li
                key={item.id}
                className={styles.historyItem}
                onClick={() => {
                  setExpression(item.result);
                  setHistoryLine(`${item.expr} =`);
                }}
              >
                <span>{item.expr}</span>
                <strong>= {item.result}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
