"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./TimeZoneCalculatorIsland.module.css";
import {
  TIME_ZONE_OFFSETS,
  convertTimeZone,
} from "@/lib/calculations/timezone";

const STORAGE_KEY = "holycalc_timezone_history";

export default function TimeZoneCalculatorIsland() {
  // Initial default state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00:00");
  const [fromOffset, setFromOffset] = useState(-300); // UTC-05:00 Eastern
  const [toOffset, setToOffset] = useState(540); // UTC+09:00 Japan
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Set default date on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const defaultDate = `${yyyy}-${mm}-${dd}`;

    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const defaultTime = `${hh}:${min}:${ss}`;

    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const paramDate = params.get("date");
    const paramTime = params.get("time");
    const paramFrom = params.get("from");
    const paramTo = params.get("to");

    setDate(paramDate || defaultDate);
    setTime(paramTime || defaultTime);
    if (paramFrom !== null && !isNaN(parseInt(paramFrom, 10))) {
      setFromOffset(parseInt(paramFrom, 10));
    }
    if (paramTo !== null && !isNaN(parseInt(paramTo, 10))) {
      setToOffset(parseInt(paramTo, 10));
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  // Save to history helper
  const saveToHistory = useCallback((res) => {
    if (!res || !res.isValid) return;
    const historyItem = {
      id: Date.now(),
      dateStr: res.input.dateStr,
      timeStr: res.input.timeStr,
      fromCode: res.input.fromZone.code,
      fromOffset: res.input.fromZone.offsetMinutes,
      toCode: res.result.toZone.code,
      toOffset: res.result.toZone.offsetMinutes,
      resultTime12: res.result.time12,
      resultDateIso: res.result.dateIso,
      dayShiftLabel: res.result.dayShiftLabel,
    };

    setHistory((prev) => {
      // Avoid duplicate consecutive entries
      if (
        prev.length > 0 &&
        prev[0].fromOffset === historyItem.fromOffset &&
        prev[0].toOffset === historyItem.toOffset &&
        prev[0].dateStr === historyItem.dateStr &&
        prev[0].timeStr === historyItem.timeStr
      ) {
        return prev;
      }
      const updated = [historyItem, ...prev.slice(0, 4)];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Debounced execution
  const timerRef = useRef(null);
  useEffect(() => {
    if (!date || !time) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const res = convertTimeZone({
        dateStr: date,
        timeStr: time,
        fromOffsetMinutes: fromOffset,
        toOffsetMinutes: toOffset,
      });
      setResult(res);
      if (res.isValid) {
        saveToHistory(res);
      }
    }, 200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [date, time, fromOffset, toOffset, saveToHistory]);

  // Quick fill handlers
  const setToday = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);
  };

  const setNow = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    setTime(`${hh}:${min}:${ss}`);
  };

  // Swap From and To
  const handleSwap = () => {
    setFromOffset(toOffset);
    setToOffset(fromOffset);
  };

  // Share URL creation
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("date", date);
    url.searchParams.set("time", time);
    url.searchParams.set("from", fromOffset);
    url.searchParams.set("to", toOffset);

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Load from history item
  const loadHistoryItem = (item) => {
    setDate(item.dateStr);
    setTime(item.timeStr);
    setFromOffset(item.fromOffset);
    setToOffset(item.toOffset);
  };

  return (
    <div className={styles.islandContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Time Zone Converter</h2>
        <p className={styles.sectionSubtitle}>
          Select date, 24-hour time, and target UTC offsets to convert instantly.
        </p>
      </div>

      <div className={styles.formGrid}>
        {/* Date Input */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="tz-date-input">
            <span>Date (YYYY-MM-DD)</span>
            <button type="button" className={styles.quickBtn} onClick={setToday}>
              Today
            </button>
          </label>
          <input
            id="tz-date-input"
            type="date"
            className={styles.inputField}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Time Input */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="tz-time-input">
            <span>Time (24-Hour Format)</span>
            <button type="button" className={styles.quickBtn} onClick={setNow}>
              Now
            </button>
          </label>
          <input
            id="tz-time-input"
            type="text"
            className={styles.inputField}
            placeholder="15:00:00 or 15:00"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        {/* Zone Selectors Row */}
        <div className={styles.zoneSelectorRow}>
          <div className={`${styles.fieldGroup} ${styles.zoneField}`}>
            <label className={styles.fieldLabel} htmlFor="tz-from-select">
              From Time Zone (Standard Offset)
            </label>
            <select
              id="tz-from-select"
              className={styles.selectField}
              value={fromOffset}
              onChange={(e) => setFromOffset(parseInt(e.target.value, 10))}
            >
              {TIME_ZONE_OFFSETS.map((z) => (
                <option key={`from-${z.id}`} value={z.offsetMinutes}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className={styles.swapButton}
            onClick={handleSwap}
            title="Swap From and To Time Zones"
            aria-label="Swap From and To Time Zones"
          >
            ⇄
          </button>

          <div className={`${styles.fieldGroup} ${styles.zoneField}`}>
            <label className={styles.fieldLabel} htmlFor="tz-to-select">
              To Time Zone (Standard Offset)
            </label>
            <select
              id="tz-to-select"
              className={styles.selectField}
              value={toOffset}
              onChange={(e) => setToOffset(parseInt(e.target.value, 10))}
            >
              {TIME_ZONE_OFFSETS.map((z) => (
                <option key={`to-${z.id}`} value={z.offsetMinutes}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Validation Error Message */}
      {result && !result.isValid && (
        <div className={styles.errorBanner}>{result.error}</div>
      )}

      {/* Results Card */}
      {result && result.isValid && (
        <div className={styles.resultCard}>
          <div className={styles.resultTitle}>Converted Result ({result.result.toZone.code})</div>

          <div className={styles.mainResultTime}>{result.result.time12}</div>
          <div className={styles.secondaryResultTime}>
            24-hour format: <strong>{result.result.time24}</strong>
          </div>

          <div className={styles.resultDateRow}>
            <span className={styles.resultDateText}>{result.result.dateLong}</span>
            <span
              className={
                result.result.dayShift > 0
                  ? styles.dayBadgeNext
                  : result.result.dayShift < 0
                  ? styles.dayBadgePrev
                  : styles.dayBadgeSame
              }
            >
              {result.result.dayShiftLabel}
            </span>
          </div>

          <div className={styles.diffHighlight}>
            ⚡ Time Difference: <strong>{result.result.offsetDiffText}</strong>
          </div>

          <p className={styles.conversionSummary}>
            Original: {result.input.formattedDateLong} at {result.input.timeStr} ({result.input.fromZone.code})
          </p>
        </div>
      )}

      {/* Prominent DST Disclaimer Box */}
      <div className={styles.dstDisclaimerBox}>
        <span className={styles.dstIcon}>⚠️</span>
        <p className={styles.dstText}>
          <strong>Fixed UTC-Offset Model Notice:</strong> This calculator uses static standard UTC offsets and does not automatically adjust for Daylight Saving Time (DST). If your target location is currently observing DST (summer time), select the corresponding active offset (e.g. UTC-04:00 for Eastern Daylight Time instead of UTC-05:00 for Eastern Standard Time).
        </p>
      </div>

      {/* Action Bar */}
      <div className={styles.actionRow}>
        <button type="button" className={styles.shareBtn} onClick={handleCopyLink}>
          {copied ? "✓ Link Copied!" : "🔗 Share Conversion URL"}
        </button>
      </div>

      {/* LocalStorage Recent Conversions */}
      {history.length > 0 && (
        <div className={styles.historyContainer}>
          <h4 className={styles.historyTitle}>Recent Conversions</h4>
          <ul className={styles.historyList}>
            {history.map((item) => (
              <li
                key={item.id}
                className={styles.historyItem}
                onClick={() => loadHistoryItem(item)}
              >
                <span>
                  {item.timeStr} ({item.fromCode}) → {item.resultTime12} ({item.toCode})
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-60)" }}>
                  {item.dateStr}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
