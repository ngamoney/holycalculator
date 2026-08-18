"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./LifePathCalculatorIsland.module.css";
import { calculateLifePathNumber } from "@/lib/calculations/lifePath";

const STORAGE_KEY = "holycalc_lifepath_history";

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

export default function LifePathCalculatorIsland() {
  const [month, setMonth] = useState("10");
  const [day, setDay] = useState("28");
  const [year, setYear] = useState("1994");

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Sample date loaders
  const loadMaster11Sample = () => {
    setMonth("11");
    setDay("18");
    setYear("1980");
  };

  const loadMaster22Sample = () => {
    setMonth("11");
    setDay("20");
    setYear("1980");
  };

  const loadPath7Sample = () => {
    setMonth("10");
    setDay("28");
    setYear("1994");
  };

  // URL state & localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const paramDob = params.get("dob");
    const paramM = params.get("m");
    const paramD = params.get("d");
    const paramY = params.get("y");

    if (paramDob) {
      const parts = paramDob.split("-");
      if (parts.length === 3) {
        setYear(parts[0]);
        setMonth(parseInt(parts[1], 10).toString());
        setDay(parseInt(parts[2], 10).toString());
      }
    } else if (paramM && paramD && paramY) {
      setMonth(paramM);
      setDay(paramD);
      setYear(paramY);
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
    if (!res || !res.isValid) return;

    const item = {
      id: Date.now(),
      dobFormatted: res.dob.formatted,
      number: res.lifePathNumber,
      title: res.archetype.title,
      isMaster: res.isMasterNumber,
    };

    setHistory((prev) => {
      if (prev.length > 0 && prev[0].dobFormatted === item.dobFormatted) {
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
      const res = calculateLifePathNumber(month, day, year);
      setResult(res);
      if (res && res.isValid) {
        saveToHistory(res);
      }
    }, 150);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [month, day, year, saveToHistory]);

  // Share URL creation
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("m", month);
    url.searchParams.set("d", day);
    url.searchParams.set("y", year);

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className={styles.islandContainer}>
      {/* Sample Quick Buttons */}
      <div className={styles.presetBar}>
        <button type="button" className={styles.presetBtn} onClick={loadPath7Sample}>
          🔮 Life Path 7 Sample
        </button>
        <button type="button" className={styles.presetBtn} onClick={loadMaster11Sample}>
          ✨ Master 11 Sample
        </button>
        <button type="button" className={styles.presetBtn} onClick={loadMaster22Sample}>
          🌟 Master 22 Sample
        </button>
      </div>

      {/* Date of Birth Inputs */}
      <div className={styles.formGrid}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="lp-month-select">
            Birth Month
          </label>
          <select
            id="lp-month-select"
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
          <label className={styles.fieldLabel} htmlFor="lp-day-input">
            Birth Day
          </label>
          <input
            id="lp-day-input"
            type="number"
            min="1"
            max="31"
            className={styles.inputField}
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="lp-year-input">
            Birth Year
          </label>
          <input
            id="lp-year-input"
            type="number"
            min="1000"
            max="9999"
            className={styles.inputField}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </div>

      {/* Error Message */}
      {result && !result.isValid && (
        <div className={styles.errorBanner}>{result.error}</div>
      )}

      {/* Results Display */}
      {result && result.isValid && (
        <div className={styles.resultCard}>
          {/* Badge Header */}
          <div className={styles.badgeHeader}>
            <div className={`${styles.numberCircle} ${result.isMasterNumber ? styles.masterCircle : ""}`}>
              {result.lifePathNumber}
            </div>
            <div className={styles.titleMeta}>
              <h3 className={styles.archetypeTitle}>
                Life Path {result.lifePathNumber}: {result.archetype.title}
              </h3>
              <p className={styles.tagline}>{result.archetype.tagline}</p>
            </div>
          </div>

          {/* Mathematical Step Breakdown */}
          <div className={styles.stepBox}>
            <div className={styles.stepTitle}>Pythagorean Reduction Steps for {result.dob.formatted}:</div>
            <div className={styles.stepMath}>{result.stepText}</div>
          </div>

          {/* Archetype Description */}
          <div className={styles.profileDescription}>
            {result.archetype.description}
          </div>

          {/* Profile Breakdown Grid */}
          <div className={styles.profileGrid}>
            <div className={styles.profileBlock}>
              <div className={styles.blockTitle}>Core Strengths</div>
              <ul className={styles.traitList}>
                {result.archetype.strengths.map((str, idx) => (
                  <li key={idx} className={styles.traitItem}>{str}</li>
                ))}
              </ul>
            </div>

            <div className={styles.profileBlock}>
              <div className={styles.blockTitle}>Life Lessons &amp; Challenges</div>
              <ul className={styles.traitList}>
                {result.archetype.challenges.map((ch, idx) => (
                  <li key={idx} className={styles.traitItem}>{ch}</li>
                ))}
              </ul>
            </div>

            <div className={styles.profileBlock}>
              <div className={styles.blockTitle}>Ideal Career Paths</div>
              <ul className={styles.traitList}>
                {result.archetype.careers.map((car, idx) => (
                  <li key={idx} className={styles.traitItem}>{car}</li>
                ))}
              </ul>
            </div>

            <div className={styles.profileBlock}>
              <div className={styles.blockTitle}>Compatible Life Paths</div>
              <div className={styles.traitList} style={{ fontSize: "0.875rem", fontWeight: "600", color: "#3B3564" }}>
                Path {result.archetype.compatibleNumbers.join(", Path ")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className={styles.actionRow}>
        <button type="button" className={styles.shareBtn} onClick={handleCopyLink}>
          {copied ? "✓ Link Copied!" : "🔗 Share Life Path Chart URL"}
        </button>
      </div>

      {/* LocalStorage History */}
      {history.length > 0 && (
        <div className={styles.historyContainer}>
          <h4 className={styles.historyTitle}>Recent Numerology Readings</h4>
          <ul className={styles.historyList}>
            {history.map((item) => (
              <li key={item.id} className={styles.historyItem}>
                <span>
                  🔮 <strong>Path {item.number}</strong> ({item.title})
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-60)" }}>
                  {item.dobFormatted}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
