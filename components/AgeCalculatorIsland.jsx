"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  calculateAgeDetails,
  encodeAgeState,
  decodeAgeState
} from "@/lib/calculations/age";
import styles from "./AgeCalculatorIsland.module.css";

function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function AgeCalculatorIsland() {
  const [birthDate, setBirthDate] = useState("2000-01-01");
  const [targetDate, setTargetDate] = useState(getTodayString());
  const [toastMessage, setToastMessage] = useState(null);
  const urlSyncTimerRef = useRef(null);

  // Load from URL query params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const decoded = decodeAgeState(window.location.search);
    if (decoded) {
      if (decoded.dob) setBirthDate(decoded.dob);
      if (decoded.at) setTargetDate(decoded.at);
    }
  }, []);

  // Compute exact age details reactively
  const ageResult = useMemo(() => {
    return calculateAgeDetails(birthDate, targetDate);
  }, [birthDate, targetDate]);

  // Sync to compact URL query string (debounced ~400ms)
  const syncToUrl = useCallback((dob, at) => {
    if (typeof window === "undefined") return;
    if (urlSyncTimerRef.current) clearTimeout(urlSyncTimerRef.current);

    urlSyncTimerRef.current = setTimeout(() => {
      try {
        const query = encodeAgeState(dob, at);
        const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
        window.history.replaceState(null, "", newUrl);
      } catch (e) {
        // ignore
      }
    }, 400);
  }, []);

  useEffect(() => {
    syncToUrl(birthDate, targetDate);
  }, [birthDate, targetDate, syncToUrl]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => showToast("✓ Shareable age calculation link copied!"))
        .catch(() => {
          fallbackCopy(url);
        });
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (text) => {
    try {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      showToast("✓ Shareable age calculation link copied!");
    } catch (e) {
      showToast("✓ Calculation link: " + text);
    }
  };

  const setTargetToToday = () => {
    const today = getTodayString();
    setTargetDate(today);
    showToast("Target date set to today");
  };

  return (
    <div className={styles.calcMain}>
      {/* Toast Notification */}
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      {/* Main Interactive Calculator Card */}
      <div className={styles.calcCard}>
        {/* Header */}
        <div className={styles.calcCardHeader}>
          <div className={styles.calcCardTitle}>
            <div className={styles.calcBadgeIcon}>◷</div>
            <h2>Age Calculator</h2>
          </div>
          <span style={{ fontFamily: "var(--mono)", fontSize: "11.5px", color: "var(--ink-60)" }}>
            Instant Chronological Calculation
          </span>
        </div>

        {/* Date Inputs Form */}
        <div className={styles.formSection}>
          <div className={styles.inputsGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="dob-input" className={styles.inputLabel}>
                Date of Birth
              </label>
              <input
                id="dob-input"
                type="date"
                className={styles.dateInput}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputLabelGroup}>
                <label htmlFor="target-date-input" className={styles.inputLabel}>
                  Age at the Date of
                </label>
                <button
                  type="button"
                  className={styles.todayBtn}
                  onClick={setTargetToToday}
                  title="Reset to today's date"
                >
                  Today
                </button>
              </div>
              <input
                id="target-date-input"
                type="date"
                className={styles.dateInput}
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>

          {/* Validation Error Notice if dob > target */}
          {!ageResult.isValid && (
            <div className={styles.errorAlert}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{ageResult.message}</span>
            </div>
          )}
        </div>

        {/* Primary Result Hero Display */}
        {ageResult.isValid && (
          <>
            <div className={styles.primaryResultHero}>
              <span className={styles.resultEyebrow}>Exact Age Result</span>
              <div className={styles.primaryAgeBig}>
                {ageResult.primary.formattedText}
              </div>

              <div className={styles.metaPillsRow}>
                <div className={styles.metaPill}>
                  <span>Born on a</span>
                  <span className={styles.metaPillHighlight}>{ageResult.meta.birthDayOfWeek}</span>
                </div>
                <div className={styles.metaPill}>
                  <span>Next Birthday:</span>
                  <span className={styles.metaPillHighlight}>
                    {ageResult.meta.daysToNextBday === 0
                      ? "Happy Birthday Today! 🎉"
                      : `in ${ageResult.meta.daysToNextBday} days (${ageResult.meta.nextBdayDayOfWeek})`}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Unit Breakdown Grid */}
            <div className={styles.breakdownSection}>
              <div className={styles.breakdownTitle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Equivalent Age in All Units</span>
              </div>

              <div className={styles.breakdownGrid}>
                <div className={styles.breakdownCard}>
                  <span className={styles.breakdownUnit}>In Months</span>
                  <span className={styles.breakdownValue}>{ageResult.breakdown.months.formatted}</span>
                </div>

                <div className={styles.breakdownCard}>
                  <span className={styles.breakdownUnit}>In Weeks</span>
                  <span className={styles.breakdownValue}>{ageResult.breakdown.weeks.formatted}</span>
                </div>

                <div className={styles.breakdownCard}>
                  <span className={styles.breakdownUnit}>In Days</span>
                  <span className={styles.breakdownValue}>{ageResult.breakdown.days.formatted}</span>
                </div>

                <div className={styles.breakdownCard}>
                  <span className={styles.breakdownUnit}>In Hours</span>
                  <span className={styles.breakdownValue}>{ageResult.breakdown.hours.formatted}</span>
                </div>

                <div className={styles.breakdownCard}>
                  <span className={styles.breakdownUnit}>In Minutes</span>
                  <span className={styles.breakdownValue}>{ageResult.breakdown.minutes.formatted}</span>
                </div>

                <div className={styles.breakdownCard}>
                  <span className={styles.breakdownUnit}>In Seconds</span>
                  <span className={styles.breakdownValue}>{ageResult.breakdown.seconds.formatted}</span>
                </div>
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className={styles.cardFooter}>
              <button type="button" className={styles.shareBtn} onClick={handleCopyLink}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                <span>Share Age Link</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
