"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./AngelNumberCalculatorIsland.module.css";
import {
  calculateAngelNumberByDob,
  calculateAngelNumberByName,
  lookupAngelNumber,
} from "@/lib/calculations/angelNumber";

const STORAGE_KEY = "holycalc_angelnumber_history";

const QUICK_CHIPS = ["111", "222", "333", "444", "555", "777", "888", "999", "1111", "1212"];

const MONTHS = [
  { value: "1", label: "January (01)" },
  { value: "2", label: "February (02)" },
  { value: "3", label: "March (03)" },
  { value: "4", label: "April (04)" },
  { value: "5", label: "May (05)" },
  { value: "6", label: "June (06)" },
  { value: "7", label: "July (07)" },
  { value: "8", label: "August (08)" },
  { value: "9", label: "September (09)" },
  { value: "10", label: "October (10)" },
  { value: "11", label: "November (11)" },
  { value: "12", label: "December (12)" },
];

export default function AngelNumberCalculatorIsland() {
  const [mode, setMode] = useState("lookup"); // "lookup" | "dob" | "name"
  const [lookupNum, setLookupNum] = useState("1111");

  // DOB inputs
  const [month, setMonth] = useState("10");
  const [day, setDay] = useState("28");
  const [year, setYear] = useState("1994");

  // Name input
  const [fullName, setFullName] = useState("Grace Kelly");

  // Sub-tab detail view state ("spiritual" | "love" | "career")
  const [detailTab, setDetailTab] = useState("spiritual");

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // URL state & localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const paramNum = params.get("num");
    const paramMode = params.get("mode");
    const paramM = params.get("m");
    const paramD = params.get("d");
    const paramY = params.get("y");
    const paramName = params.get("name");

    if (paramNum) {
      setMode("lookup");
      setLookupNum(paramNum);
    } else if (paramMode && ["lookup", "dob", "name"].includes(paramMode)) {
      setMode(paramMode);
      if (paramM) setMonth(paramM);
      if (paramD) setDay(paramD);
      if (paramY) setYear(paramY);
      if (paramName) setFullName(paramName);
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save history helper
  const saveToHistory = useCallback((res) => {
    if (!res || !res.isValid || !res.data) return;

    const item = {
      id: Date.now(),
      sequence: res.sequence,
      title: res.data.title,
      mode: res.mode,
    };

    setHistory((prev) => {
      if (prev.length > 0 && prev[0].sequence === item.sequence) {
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
      let res = null;
      if (mode === "lookup") {
        res = lookupAngelNumber(lookupNum);
      } else if (mode === "dob") {
        res = calculateAngelNumberByDob(month, day, year);
      } else if (mode === "name") {
        res = calculateAngelNumberByName(fullName);
      }

      setResult(res);
      if (res && res.isValid) {
        saveToHistory(res);
      }
    }, 150);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mode, lookupNum, month, day, year, fullName, saveToHistory]);

  // Mode Tab Switcher
  const handleModeChange = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setResult(null);
  };

  // Quick chip selector
  const handleChipClick = (seq) => {
    setMode("lookup");
    setLookupNum(seq);
  };

  // Share URL creation
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    if (mode === "lookup") {
      url.searchParams.set("num", lookupNum);
    } else if (mode === "dob") {
      url.searchParams.set("m", month);
      url.searchParams.set("d", day);
      url.searchParams.set("y", year);
    } else if (mode === "name") {
      url.searchParams.set("name", fullName);
    }

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className={styles.islandContainer}>
      {/* Mode Tabs */}
      <div className={styles.modeTabs} role="tablist" aria-label="Angel Number Mode">
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "lookup" ? styles.modeBtnActive : ""}`}
          onClick={() => handleModeChange("lookup")}
        >
          Lookup Sequence
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "dob" ? styles.modeBtnActive : ""}`}
          onClick={() => handleModeChange("dob")}
        >
          Calculate by Birthday
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "name" ? styles.modeBtnActive : ""}`}
          onClick={() => handleModeChange("name")}
        >
          Calculate by Name
        </button>
      </div>

      {/* Quick Sequence Chips */}
      <div className={styles.chipGrid}>
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            className={`${styles.chipBtn} ${mode === "lookup" && lookupNum === chip ? styles.chipBtnActive : ""}`}
            onClick={() => handleChipClick(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Lookup Mode Form */}
      {mode === "lookup" && (
        <div className={styles.fieldGroup} style={{ marginBottom: "20px" }}>
          <label className={styles.fieldLabel} htmlFor="an-lookup-input">
            Enter Angel Number (e.g. 111, 444, 777, 1111)
          </label>
          <input
            id="an-lookup-input"
            type="text"
            className={styles.inputField}
            value={lookupNum}
            onChange={(e) => setLookupNum(e.target.value)}
            placeholder="e.g. 1111"
          />
        </div>
      )}

      {/* Birthday Mode Form */}
      {mode === "dob" && (
        <div className={styles.formGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="an-month-select">
              Birth Month
            </label>
            <select
              id="an-month-select"
              className={styles.inputField}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="an-day-input">
              Birth Day
            </label>
            <input
              id="an-day-input"
              type="number"
              min="1"
              max="31"
              className={styles.inputField}
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="an-year-input">
              Birth Year
            </label>
            <input
              id="an-year-input"
              type="number"
              min="1000"
              max="9999"
              className={styles.inputField}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Name Mode Form */}
      {mode === "name" && (
        <div className={styles.fieldGroup} style={{ marginBottom: "20px" }}>
          <label className={styles.fieldLabel} htmlFor="an-name-input">
            Full Birth Name
          </label>
          <input
            id="an-name-input"
            type="text"
            className={styles.inputField}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Grace Kelly"
          />
        </div>
      )}

      {/* Error Message */}
      {result && !result.isValid && (
        <div className={styles.errorBanner}>{result.error}</div>
      )}

      {/* Results Card */}
      {result && result.isValid && result.data && (
        <div className={styles.resultCard}>
          {/* Celestial Halo Badge Header */}
          <div className={styles.haloHeader}>
            <div className={styles.celestialBadge}>
              {result.sequence}
            </div>
            <div className={styles.titleMeta}>
              <h3 className={styles.angelTitle}>
                Angel Number {result.sequence}: {result.data.title}
              </h3>
              <p className={styles.tagline}>{result.data.tagline}</p>
            </div>
          </div>

          {/* Mathematical Step Text if DOB or Name mode */}
          {result.calculationText && (
            <div className={styles.calcStepText}>
              ✨ {result.calculationText}
            </div>
          )}

          {/* Detail Interpretation Sub-Tabs */}
          <div className={styles.detailTabs}>
            <button
              type="button"
              className={`${styles.detailBtn} ${detailTab === "spiritual" ? styles.detailBtnActive : ""}`}
              onClick={() => setDetailTab("spiritual")}
            >
              Spiritual Meaning
            </button>
            <button
              type="button"
              className={`${styles.detailBtn} ${detailTab === "love" ? styles.detailBtnActive : ""}`}
              onClick={() => setDetailTab("love")}
            >
              Love &amp; Twin Flame
            </button>
            <button
              type="button"
              className={`${styles.detailBtn} ${detailTab === "career" ? styles.detailBtnActive : ""}`}
              onClick={() => setDetailTab("career")}
            >
              Money &amp; Career
            </button>
          </div>

          {/* Detail Interpretation Content */}
          <div className={styles.detailBody}>
            {detailTab === "spiritual" && <p>{result.data.spiritualMeaning}</p>}
            {detailTab === "love" && <p>{result.data.loveMeaning}</p>}
            {detailTab === "career" && <p>{result.data.careerMeaning}</p>}
          </div>

          {/* Actionable Guidance Callout */}
          <div className={styles.actionAdviceCallout}>
            <strong>Action Step:</strong> {result.data.actionAdvice}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className={styles.actionRow}>
        <button type="button" className={styles.shareBtn} onClick={handleCopyLink}>
          {copied ? "✓ Link Copied!" : "🔗 Share Angel Number Reading URL"}
        </button>
      </div>

      {/* LocalStorage History */}
      {history.length > 0 && (
        <div className={styles.historyContainer}>
          <h4 className={styles.historyTitle}>Recent Angel Readings</h4>
          <ul className={styles.historyList}>
            {history.map((item) => (
              <li key={item.id} className={styles.historyItem}>
                <span>
                  👼 <strong>Angel Number {item.sequence}</strong> ({item.title})
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-60)" }}>
                  Mode: {item.mode}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
