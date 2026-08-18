"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./DateCalculatorIsland.module.css";
import {
  calculateDateDiff,
  calculateAddSubtractDate,
  US_STANDARD_HOLIDAYS,
  formatDateIso,
  encodeDateState,
  decodeDateState,
} from "@/lib/calculations/date";

const STORAGE_KEY = "holycalc_date_history";

export default function DateCalculatorIsland() {
  const [mode, setMode] = useState("diff"); // "diff" | "add_sub"

  // Dates (Default: Today & +1 Month)
  const todayIso = formatDateIso(new Date());
  const nextMonthIso = formatDateIso(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  const [startDate, setStartDate] = useState(todayIso);
  const [endDate, setEndDate] = useState(nextMonthIso);
  const [includeEndDay, setIncludeEndDay] = useState(false);

  // Add/Subtract inputs
  const [operation, setOperation] = useState("add"); // "add" | "subtract"
  const [addYears, setAddYears] = useState("0");
  const [addMonths, setAddMonths] = useState("1");
  const [addWeeks, setAddWeeks] = useState("0");
  const [addDays, setAddDays] = useState("0");
  const [businessDaysOnly, setBusinessDaysOnly] = useState(false);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [selectedHolidays, setSelectedHolidays] = useState(
    US_STANDARD_HOLIDAYS.map((h) => h.id)
  );
  const [customHolidays, setCustomHolidays] = useState([]);
  const [customName, setCustomName] = useState("");
  const [customMonth, setCustomMonth] = useState("1");
  const [customDay, setCustomDay] = useState("1");

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Parse URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlState = decodeDateState(window.location.search);
    if (urlState) {
      if (urlState.mode) setMode(urlState.mode);
      if (urlState.startDate) setStartDate(urlState.startDate);
      if (urlState.endDate) setEndDate(urlState.endDate);
      if (urlState.includeEndDay) setIncludeEndDay(true);
      if (urlState.operation) setOperation(urlState.operation);
      if (urlState.addYears) setAddYears(urlState.addYears);
      if (urlState.addMonths) setAddMonths(urlState.addMonths);
      if (urlState.addWeeks) setAddWeeks(urlState.addWeeks);
      if (urlState.addDays) setAddDays(urlState.addDays);
      if (urlState.businessDaysOnly) setBusinessDaysOnly(true);
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Calculation
  const runCalculation = useCallback(() => {
    if (mode === "diff") {
      const res = calculateDateDiff(startDate, endDate, includeEndDay);
      setResult(res);

      if (res && res.isValid && typeof window !== "undefined") {
        const item = {
          id: Date.now(),
          date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          label: `${startDate} to ${endDate}`,
          resultText: `${res.breakdown.totalDays} Days (${res.primaryText})`,
        };
        saveHistory(item);
      }
    } else {
      const res = calculateAddSubtractDate({
        startDateStr: startDate,
        operation,
        years: addYears,
        months: addMonths,
        weeks: addWeeks,
        days: addDays,
        businessDaysOnly,
        selectedHolidays,
        customHolidays,
      });
      setResult(res);

      if (res && res.isValid && typeof window !== "undefined") {
        const item = {
          id: Date.now(),
          date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          label: `${startDate} ${operation === "add" ? "+" : "-"} ${addMonths}m ${addDays}d`,
          resultText: res.resultingDateHuman,
        };
        saveHistory(item);
      }
    }
  }, [
    mode,
    startDate,
    endDate,
    includeEndDay,
    operation,
    addYears,
    addMonths,
    addWeeks,
    addDays,
    businessDaysOnly,
    selectedHolidays,
    customHolidays,
  ]);

  const saveHistory = (item) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.label !== item.label || h.resultText !== item.resultText);
      const updated = [item, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Debounce
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runCalculation();
    }, 200);
    return () => clearTimeout(timerRef.current);
  }, [runCalculation]);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const search = encodeDateState({
      mode,
      startDate,
      endDate,
      includeEndDay,
      operation,
      addYears,
      addMonths,
      addWeeks,
      addDays,
      businessDaysOnly,
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${search}`;
    window.history.replaceState(null, "", `?${search}`);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const toggleHoliday = (id) => {
    setSelectedHolidays((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const addCustomHoliday = () => {
    if (!customName.trim()) return;
    const newHol = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      month: parseInt(customMonth, 10),
      day: parseInt(customDay, 10),
    };
    setCustomHolidays((prev) => [...prev, newHol]);
    setCustomName("");
  };

  const removeCustomHoliday = (id) => {
    setCustomHolidays((prev) => prev.filter((c) => c.id !== id));
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
      {/* Dual Mode Tabs */}
      <div className={styles.tabGroup} role="tablist" aria-label="Date Calculation Modes">
        <button
          role="tab"
          aria-selected={mode === "diff"}
          className={`${styles.tabBtn} ${mode === "diff" ? styles.tabBtnActive : ""}`}
          onClick={() => setMode("diff")}
        >
          Days Between Dates
        </button>
        <button
          role="tab"
          aria-selected={mode === "add_sub"}
          className={`${styles.tabBtn} ${mode === "add_sub" ? styles.tabBtnActive : ""}`}
          onClick={() => setMode("add_sub")}
        >
          Add or Subtract Time
        </button>
      </div>

      {/* Mode A Inputs */}
      {mode === "diff" && (
        <div className={styles.formGrid}>
          <div className={styles.fieldGroup}>
            <label htmlFor="date-start-input" className={styles.fieldLabel}>Start Date</label>
            <input
              id="date-start-input"
              type="date"
              className={styles.inputControl}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="date-end-input" className={styles.fieldLabel}>End Date</label>
            <input
              id="date-end-input"
              type="date"
              className={styles.inputControl}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup} style={{ gridColumn: "1 / -1" }}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={includeEndDay}
                onChange={(e) => setIncludeEndDay(e.target.checked)}
              />
              Include end day in calculation (+1 day)
            </label>
          </div>
        </div>
      )}

      {/* Mode B Inputs */}
      {mode === "add_sub" && (
        <div className={styles.formGrid}>
          <div className={styles.fieldGroup}>
            <label htmlFor="date-add-start" className={styles.fieldLabel}>Start Date</label>
            <input
              id="date-add-start"
              type="date"
              className={styles.inputControl}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Action</label>
            <select
              className={styles.inputControl}
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="add">+ Add Time</option>
              <option value="subtract">− Subtract Time</option>
            </select>
          </div>

          <div className={styles.fieldGroup} style={{ gridColumn: "1 / -1" }}>
            <label className={styles.fieldLabel}>Amount of Time</label>
            <div className={styles.fourInputs}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>Years</span>
                <input
                  type="number"
                  min="0"
                  className={styles.inputControl}
                  value={addYears}
                  onChange={(e) => setAddYears(e.target.value)}
                />
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>Months</span>
                <input
                  type="number"
                  min="0"
                  className={styles.inputControl}
                  value={addMonths}
                  onChange={(e) => setAddMonths(e.target.value)}
                />
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>Weeks</span>
                <input
                  type="number"
                  min="0"
                  className={styles.inputControl}
                  value={addWeeks}
                  onChange={(e) => setAddWeeks(e.target.value)}
                />
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>Days</span>
                <input
                  type="number"
                  min="0"
                  className={styles.inputControl}
                  value={addDays}
                  onChange={(e) => setAddDays(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup} style={{ gridColumn: "1 / -1" }}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={businessDaysOnly}
                onChange={(e) => {
                  setBusinessDaysOnly(e.target.checked);
                  if (e.target.checked) setShowSettings(true);
                }}
              />
              Calculate using Business Days Only (skip weekends &amp; holidays)
            </label>
          </div>
        </div>
      )}

      {/* Collapsible "+ Holiday & Business Day Settings" Panel */}
      <button
        type="button"
        className={styles.settingsToggle}
        onClick={() => setShowSettings(!showSettings)}
      >
        <span>⚙️ US Federal &amp; Custom Holiday Settings ({selectedHolidays.length} US Holidays active)</span>
        <span>{showSettings ? "▲ Hide" : "▼ + Settings"}</span>
      </button>

      {showSettings && (
        <div className={styles.settingsPanel}>
          <div style={{ fontFamily: "var(--head)", fontWeight: 700, fontSize: "14px", color: "var(--ink)" }}>
            Select US Observed Holidays to Skip:
          </div>
          <div className={styles.holidayListGrid}>
            {US_STANDARD_HOLIDAYS.map((h) => (
              <label key={h.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedHolidays.includes(h.id)}
                  onChange={() => toggleHoliday(h.id)}
                />
                <span style={{ fontSize: "12.5px" }}>{h.name}</span>
              </label>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", marginTop: "8px" }}>
            <div style={{ fontFamily: "var(--head)", fontWeight: 700, fontSize: "13.5px", color: "var(--ink)", marginBottom: "8px" }}>
              Add Custom Recurring Holiday (Month + Day):
            </div>
            <div className={styles.customAddRow}>
              <input
                type="text"
                placeholder="Holiday Name (e.g. Company Retreat)"
                className={styles.inputControl}
                style={{ flex: 2, minWidth: "160px" }}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <select
                className={styles.inputControl}
                style={{ flex: 1, minWidth: "90px" }}
                value={customMonth}
                onChange={(e) => setCustomMonth(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Month {i + 1}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                max="31"
                placeholder="Day"
                className={styles.inputControl}
                style={{ flex: 1, minWidth: "70px" }}
                value={customDay}
                onChange={(e) => setCustomDay(e.target.value)}
              />
              <button type="button" className={styles.addBtn} onClick={addCustomHoliday}>
                + Add
              </button>
            </div>

            {customHolidays.length > 0 && (
              <div style={{ marginTop: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {customHolidays.map((c) => (
                  <span
                    key={c.id}
                    style={{
                      background: "var(--paper-raised)",
                      border: "1px solid var(--line)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {c.name} ({c.month}/{c.day})
                    <button
                      type="button"
                      onClick={() => removeCustomHoliday(c.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-60)" }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && result.isValid && (
        <div className={styles.resultBox}>
          {mode === "diff" ? (
            <>
              <div className={styles.headlineRow}>
                <div>
                  <div style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--ink-60)", textTransform: "uppercase" }}>
                    Difference Between Dates
                  </div>
                  <div className={styles.resultValue}>
                    {result.primaryText}
                  </div>
                </div>
                <div className={styles.badge}>
                  {result.breakdown.totalDays.toLocaleString()} Total Days
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricTitle}>Total Days</span>
                  <span className={styles.metricVal}>{result.breakdown.totalDays.toLocaleString()}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricTitle}>Total Weeks</span>
                  <span className={styles.metricVal}>{result.breakdown.totalWeeks.toLocaleString()}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricTitle}>Total Hours</span>
                  <span className={styles.metricVal}>{result.breakdown.totalHours.toLocaleString()}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricTitle}>Total Minutes</span>
                  <span className={styles.metricVal}>{result.breakdown.totalMinutes.toLocaleString()}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricTitle}>Total Seconds</span>
                  <span className={styles.metricVal}>{result.breakdown.totalSeconds.toLocaleString()}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.headlineRow}>
                <div>
                  <div style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--ink-60)", textTransform: "uppercase" }}>
                    Resulting Target Date
                  </div>
                  <div className={styles.resultValue}>
                    {result.resultingDateHuman}
                  </div>
                </div>
                <div className={styles.badge}>
                  ISO: {result.resultingDateIso}
                </div>
              </div>

              {result.businessDaysOnly && (
                <div style={{ fontSize: "13px", color: "var(--ink-60)", background: "var(--paper-raised)", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--line)" }}>
                  ℹ️ <strong>Business Days Mode:</strong> Skipped <strong>{result.skippedWeekends} weekend days</strong> and <strong>{result.skippedHolidays} observed holidays</strong>.
                </div>
              )}
            </>
          )}

          {/* Actions Bar */}
          <div className={styles.actionsBar}>
            <button type="button" className={styles.shareBtn} onClick={handleShare}>
              🔗 {copied ? "Link Copied!" : "Share Results"}
            </button>
            <span style={{ fontSize: "12px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>
              Instant Gregorian Date Math
            </span>
          </div>
        </div>
      )}

      {/* History Log */}
      {history.length > 0 && (
        <div className={styles.historyBox}>
          <div className={styles.historyTitle}>
            <span>Recent Date Calculations (localStorage)</span>
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
