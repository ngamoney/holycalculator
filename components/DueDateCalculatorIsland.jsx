"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { loadHistoryFromStorage, saveHistoryToStorage, syncParamsToUrl } from "@/lib/calculations/retentionHelpers";
import {
  calculateByLMP,
  calculateByConception,
  calculateByIVF,
  calculateByUltrasound,
  calculateByKnownDueDate,
  getGestationalStatus,
  formatDateISO,
  addDays,
} from "@/lib/calculations/pregnancy";
import styles from "./DueDateCalculatorIsland.module.css";

const STORAGE_KEY = "holycalc_duedate_history";

// Helper to get today's date formatted as YYYY-MM-DD
function getTodayString() {
  const now = new Date();
  return formatDateISO(now);
}

// Helper to get default past date (e.g., 60 days ago) for realistic demo
function getDefaultPastDate(daysAgo = 60) {
  const now = new Date();
  const past = addDays(now, -daysAgo);
  return formatDateISO(past);
}

export default function DueDateCalculatorIsland() {
  const [method, setMethod] = useState("lmp"); // lmp, conception, ivf, ultrasound, known_due_date

  // Method-specific input states
  const [lmpDate, setLmpDate] = useState(() => getDefaultPastDate(60));
  const [cycleLength, setCycleLength] = useState(28);

  const [conceptionDate, setConceptionDate] = useState(() => getDefaultPastDate(46));

  const [transferDate, setTransferDate] = useState(() => getDefaultPastDate(41));
  const [embryoAge, setEmbryoAge] = useState("day5");

  const [ultrasoundDate, setUltrasoundDate] = useState(() => getDefaultPastDate(14));
  const [scanWeeks, setScanWeeks] = useState(8);
  const [scanDays, setScanDays] = useState(4);

  const [knownDueDate, setKnownDueDate] = useState(() => {
    const future = addDays(new Date(), 220);
    return formatDateISO(future);
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const syncTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("method")) setMethod(params.get("method"));
    if (params.has("lmp")) setLmpDate(params.get("lmp"));
    if (params.has("cycle")) setCycleLength(parseInt(params.get("cycle"), 10) || 28);
    setHistory(loadHistoryFromStorage(STORAGE_KEY));
  }, []);

  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncParamsToUrl({ method, lmp: lmpDate, cycle: cycleLength });
    }, 300);
    return () => clearTimeout(syncTimerRef.current);
  }, [method, lmpDate, cycleLength]);

  // Compute calculated due date based on selected method
  const calculationResult = useMemo(() => {
    switch (method) {
      case "lmp":
        return calculateByLMP(lmpDate, cycleLength);
      case "conception":
        return calculateByConception(conceptionDate);
      case "ivf":
        return calculateByIVF(transferDate, embryoAge);
      case "ultrasound":
        return calculateByUltrasound(ultrasoundDate, scanWeeks, scanDays);
      case "known_due_date":
        return calculateByKnownDueDate(knownDueDate);
      default:
        return null;
    }
  }, [method, lmpDate, cycleLength, conceptionDate, transferDate, embryoAge, ultrasoundDate, scanWeeks, scanDays, knownDueDate]);

  // Compute current gestational status based on the calculated due date
  const status = useMemo(() => {
    if (!calculationResult || !calculationResult.dueDate) return null;
    return getGestationalStatus(calculationResult.dueDate);
  }, [calculationResult]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopySummary = () => {
    if (!status) return;
    const summaryText = `Pregnancy Due Date Summary (Holy Calculator):
• Estimated Due Date: ${status.formattedDueDate}
• Current Gestational Age: ${status.gestationalAge.formatted}
• Current Trimester: ${status.trimester.name} (${status.trimester.range})
• Estimated Conception: ${status.formattedConception}

Calculated using clinical ${method.toUpperCase()} method.
Note: Estimates are for educational purposes. Consult a healthcare provider for medical care.`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText)
        .then(() => showToast("✓ Due date summary copied to clipboard!"))
        .catch(() => fallbackCopy(summaryText));
    } else {
      fallbackCopy(summaryText);
    }
  };

  const fallbackCopy = (text) => {
    try {
      const tempInput = document.createElement("textarea");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      showToast("✓ Due date summary copied to clipboard!");
    } catch (e) {
      showToast("Unable to copy summary automatically");
    }
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
            <div className={styles.calcBadgeIcon}>🗓️</div>
            <h2>Pregnancy &amp; Due Date Calculator</h2>
          </div>
          <span className={styles.clinicalBadge}>Clinical Formula (ACOG Aligned)</span>
        </div>

        {/* Method Selector Tabs */}
        <div className={styles.methodTabsWrapper}>
          <label className={styles.methodTabsLabel}>Calculation Method:</label>
          <div className={styles.methodTabs}>
            <button
              type="button"
              className={`${styles.tabBtn} ${method === "lmp" ? styles.activeTab : ""}`}
              onClick={() => setMethod("lmp")}
            >
              Last Period (LMP)
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${method === "conception" ? styles.activeTab : ""}`}
              onClick={() => setMethod("conception")}
            >
              Conception Date
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${method === "ivf" ? styles.activeTab : ""}`}
              onClick={() => setMethod("ivf")}
            >
              IVF Transfer
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${method === "ultrasound" ? styles.activeTab : ""}`}
              onClick={() => setMethod("ultrasound")}
            >
              Ultrasound
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${method === "known_due_date" ? styles.activeTab : ""}`}
              onClick={() => setMethod("known_due_date")}
            >
              Known Due Date
            </button>
          </div>
        </div>

        {/* Dynamic Input Forms */}
        <div className={styles.formSection}>
          {method === "lmp" && (
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="lmp-date-input" className={styles.inputLabel}>
                  First Day of Last Menstrual Period (LMP)
                </label>
                <input
                  id="lmp-date-input"
                  type="date"
                  className={styles.dateInput}
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputLabelGroup}>
                  <label htmlFor="cycle-length-input" className={styles.inputLabel}>
                    Average Cycle Length (Days)
                  </label>
                  <span className={styles.inputSubtext}>Default 28 days (Range 22–44)</span>
                </div>
                <div className={styles.rangeNumberRow}>
                  <input
                    id="cycle-length-input"
                    type="number"
                    min="22"
                    max="44"
                    className={styles.numberInput}
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                  />
                  <input
                    type="range"
                    min="22"
                    max="44"
                    className={styles.rangeInput}
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {method === "conception" && (
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="conception-date-input" className={styles.inputLabel}>
                  Estimated Conception / Fertilization Date
                </label>
                <input
                  id="conception-date-input"
                  type="date"
                  className={styles.dateInput}
                  value={conceptionDate}
                  onChange={(e) => setConceptionDate(e.target.value)}
                />
                <span className={styles.fieldNote}>
                  Assumes standard 266-day (38-week) post-conception gestation.
                </span>
              </div>
            </div>
          )}

          {method === "ivf" && (
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="transfer-date-input" className={styles.inputLabel}>
                  IVF Transfer Date
                </label>
                <input
                  id="transfer-date-input"
                  type="date"
                  className={styles.dateInput}
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="embryo-age-select" className={styles.inputLabel}>
                  Embryo Age at Transfer
                </label>
                <select
                  id="embryo-age-select"
                  className={styles.selectInput}
                  value={embryoAge}
                  onChange={(e) => setEmbryoAge(e.target.value)}
                >
                  <option value="day3">Day 3 Embryo (+263 days)</option>
                  <option value="day5">Day 5 Embryo (+261 days)</option>
                  <option value="day6">Day 6 Embryo (+261 days)</option>
                </select>
              </div>
            </div>
          )}

          {method === "ultrasound" && (
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="scan-date-input" className={styles.inputLabel}>
                  Ultrasound Scan Date
                </label>
                <input
                  id="scan-date-input"
                  type="date"
                  className={styles.dateInput}
                  value={ultrasoundDate}
                  onChange={(e) => setUltrasoundDate(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Gestational Age at Time of Ultrasound
                </label>
                <div className={styles.twoInputsRow}>
                  <div>
                    <span className={styles.inlineFieldLabel}>Weeks:</span>
                    <input
                      type="number"
                      min="1"
                      max="42"
                      className={styles.numberInput}
                      value={scanWeeks}
                      onChange={(e) => setScanWeeks(e.target.value)}
                    />
                  </div>
                  <div>
                    <span className={styles.inlineFieldLabel}>Days:</span>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      className={styles.numberInput}
                      value={scanDays}
                      onChange={(e) => setScanDays(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {method === "known_due_date" && (
            <div className={styles.inputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="known-due-date-input" className={styles.inputLabel}>
                  Confirmed Estimated Due Date
                </label>
                <input
                  id="known-due-date-input"
                  type="date"
                  className={styles.dateInput}
                  value={knownDueDate}
                  onChange={(e) => setKnownDueDate(e.target.value)}
                />
                <span className={styles.fieldNote}>
                  Reverse calculates derived gestational age and conception timeline.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Primary Results Display */}
        {status ? (
          <>
            <div className={styles.resultsHero}>
              <span className={styles.heroEyebrow}>Estimated Due Date</span>
              <div className={styles.dueDateDisplay}>
                {status.formattedDueDate}
              </div>

              {/* Status Badges */}
              <div className={styles.statusBadgesRow}>
                <div className={styles.statusBadgeCard}>
                  <span className={styles.badgeLabel}>Current Gestational Age</span>
                  <span className={styles.badgeValue}>{status.gestationalAge.formatted}</span>
                </div>

                <div className={styles.statusBadgeCard}>
                  <span className={styles.badgeLabel}>Current Stage</span>
                  <span className={styles.badgeValue}>
                    {status.trimester.name}
                  </span>
                  <span className={styles.badgeSubtext}>{status.trimester.range}</span>
                </div>

                <div className={styles.statusBadgeCard}>
                  <span className={styles.badgeLabel}>Estimated Conception</span>
                  <span className={styles.badgeValue}>{status.formattedConception}</span>
                </div>
              </div>

              {/* Visual Gestational Timeline Progress */}
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span>Pregnancy Timeline Progress (40 Weeks Total)</span>
                  <span className={styles.progressPercent}>{status.progressPercent}%</span>
                </div>
                <div className={styles.progressBarTrack}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${status.progressPercent}%` }}
                  />
                  {/* Trimester Marker Lines */}
                  <div className={styles.markerT1} title="End of Trimester 1 (Week 13)" />
                  <div className={styles.markerT2} title="End of Trimester 2 (Week 27)" />
                  <div className={styles.markerFullTerm} title="Full Term (Week 37)" />
                </div>
                <div className={styles.progressLabels}>
                  <span>LMP (Wk 0)</span>
                  <span>T1 (Wk 13)</span>
                  <span>T2 (Wk 27)</span>
                  <span>Term (Wk 37)</span>
                  <span>Due (Wk 40)</span>
                </div>
              </div>
            </div>

            {/* Key Milestone Timeline Breakdown */}
            <div className={styles.milestonesSection}>
              <div className={styles.sectionHeading}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <h3>Estimated Pregnancy Milestones</h3>
              </div>

              <div className={styles.milestoneGrid}>
                {status.milestones.map((m) => (
                  <div key={m.key} className={styles.milestoneCard}>
                    <div className={styles.milestoneHeader}>
                      <span className={styles.milestoneTitle}>{m.title}</span>
                      <span className={styles.milestoneDate}>{m.formattedDate}</span>
                    </div>
                    <p className={styles.milestoneDesc}>{m.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prominent Clinical Disclaimer */}
            <div className={styles.disclaimerBox}>
              <div className={styles.disclaimerHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <strong>Clinical &amp; Medical Disclaimer</strong>
              </div>
              <p>
                This calculator provides an estimated due date based on standard clinical algorithms
                (including Naegele’s rule and ACOG guidelines). Approximately 5% of infants are born on their
                exact estimated due date, with normal full-term deliveries ranging between 37 and 42 weeks.
                This tool is for educational estimation only and is not a medical diagnosis. Always consult a
                licensed healthcare provider or OB-GYN for formal prenatal care, ultrasound verification, and medical advice.
              </p>
            </div>

            {/* Action Bar */}
            <div className={styles.cardFooter}>
              <button type="button" className={styles.copyBtn} onClick={handleCopySummary}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy Results Summary</span>
              </button>
            </div>
          </>
        ) : (
          <div className={styles.invalidNotice}>
            Please select valid dates and parameters to display due date calculations.
          </div>
        )}
      </div>
    </div>
  );
}
