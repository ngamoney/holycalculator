"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./CountdownCalculatorIsland.module.css";
import { calculateCountdown, getPresetEvent } from "@/lib/calculations/countdown";

const STORAGE_KEY = "holycalc_countdown_history";

export default function CountdownCalculatorIsland() {
  const [eventName, setEventName] = useState("New Year's Day 2027");
  const [targetDate, setTargetDate] = useState("2027-01-01");
  const [targetTime, setTargetTime] = useState("00:00");
  const [now, setNow] = useState(new Date());

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Live ticking 1-second timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Preset Handlers
  const handlePresetSelect = (key) => {
    const preset = getPresetEvent(key, now);
    if (preset) {
      setEventName(preset.name);
      setTargetDate(preset.dateStr);
      setTargetTime(preset.timeStr);
    }
  };

  // URL state & localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const paramEvent = params.get("event");
    const paramDate = params.get("date");
    const paramTime = params.get("time");

    if (paramEvent) setEventName(paramEvent);
    if (paramDate) setTargetDate(paramDate);
    if (paramTime) setTargetTime(paramTime);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save history helper
  const saveToHistory = useCallback((res, title) => {
    if (!res || !res.isValid) return;

    const item = {
      id: Date.now(),
      title: title || "Countdown Event",
      targetFormatted: res.targetFormatted || `${targetDate} ${targetTime}`,
      summary: res.isPast ? "Event Arrived!" : `${res.days}d ${res.hours}h remaining`,
    };

    setHistory((prev) => {
      if (prev.length > 0 && prev[0].title === item.title && prev[0].targetFormatted === item.targetFormatted) {
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
  }, [targetDate, targetTime]);

  // Recalculate countdown on state or tick change
  useEffect(() => {
    const res = calculateCountdown(targetDate, targetTime, now);
    setResult(res);
    if (res && res.isValid) {
      saveToHistory(res, eventName);
    }
  }, [targetDate, targetTime, now, eventName, saveToHistory]);

  // Share URL creation
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("event", eventName);
    url.searchParams.set("date", targetDate);
    url.searchParams.set("time", targetTime);

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className={styles.islandContainer}>
      {/* Preset Quick Buttons */}
      <div className={styles.presetBar}>
        <button type="button" className={styles.presetBtn} onClick={() => handlePresetSelect("new_year")}>
          🎉 New Year&apos;s Day
        </button>
        <button type="button" className={styles.presetBtn} onClick={() => handlePresetSelect("christmas")}>
          🎄 Christmas
        </button>
        <button type="button" className={styles.presetBtn} onClick={() => handlePresetSelect("halloween")}>
          🎃 Halloween
        </button>
        <button type="button" className={styles.presetBtn} onClick={() => handlePresetSelect("summer_solstice")}>
          ☀️ Summer Solstice
        </button>
      </div>

      {/* Inputs Form */}
      <div className={styles.formGrid}>
        <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
          <label className={styles.fieldLabel} htmlFor="cd-event-name">
            Event Name / Title
          </label>
          <input
            id="cd-event-name"
            type="text"
            className={styles.inputField}
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. My Vacation, Wedding Day"
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="cd-target-date">
            Target Date
          </label>
          <input
            id="cd-target-date"
            type="date"
            className={styles.inputField}
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="cd-target-time">
            Target Time (24-hr)
          </label>
          <input
            id="cd-target-time"
            type="time"
            className={styles.inputField}
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
          />
        </div>
      </div>

      {/* Error Message */}
      {result && !result.isValid && (
        <div className={styles.errorBanner}>{result.error}</div>
      )}

      {/* Arrival Notification */}
      {result && result.isValid && result.isPast && (
        <div className={styles.arrivalBanner}>
          🎉 {eventName || "Target Event"} Has Arrived!
        </div>
      )}

      {/* Live Digital Clock Results Display */}
      {result && result.isValid && (
        <div className={styles.clockContainer}>
          <h3 className={styles.clockEventTitle}>{eventName || "Countdown Event"}</h3>
          <div className={styles.clockSubTitle}>
            Target: {result.targetFormatted || `${targetDate} ${targetTime}`}
          </div>

          <div className={styles.timerGrid}>
            <div className={styles.timerCard}>
              <div className={styles.timerValue}>{result.days}</div>
              <div className={styles.timerUnit}>Days</div>
            </div>
            <div className={styles.timerCard}>
              <div className={styles.timerValue}>{String(result.hours).padStart(2, "0")}</div>
              <div className={styles.timerUnit}>Hours</div>
            </div>
            <div className={styles.timerCard}>
              <div className={styles.timerValue}>{String(result.minutes).padStart(2, "0")}</div>
              <div className={styles.timerUnit}>Minutes</div>
            </div>
            <div className={styles.timerCard}>
              <div className={styles.timerValue}>{String(result.seconds).padStart(2, "0")}</div>
              <div className={styles.timerUnit}>Seconds</div>
            </div>
          </div>

          {/* Total Equivalent Units Grid */}
          <div className={styles.breakdownGrid}>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Total Hours</span>
              <span className={styles.breakdownValue}>{result.totalHours.toLocaleString()}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Total Minutes</span>
              <span className={styles.breakdownValue}>{result.totalMinutes.toLocaleString()}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Total Seconds</span>
              <span className={styles.breakdownValue}>{result.totalSeconds.toLocaleString()}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Total Weeks / Months</span>
              <span className={styles.breakdownValue}>
                {result.totalWeeks}w / {result.totalMonths}m
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className={styles.actionRow}>
        <button type="button" className={styles.shareBtn} onClick={handleCopyLink}>
          {copied ? "✓ Link Copied!" : "🔗 Share Live Countdown URL"}
        </button>
      </div>

      {/* LocalStorage History */}
      {history.length > 0 && (
        <div className={styles.historyContainer}>
          <h4 className={styles.historyTitle}>Recent Countdowns</h4>
          <ul className={styles.historyList}>
            {history.map((item) => (
              <li key={item.id} className={styles.historyItem}>
                <span>
                  ⏳ <strong>{item.title}</strong> ({item.targetFormatted})
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
