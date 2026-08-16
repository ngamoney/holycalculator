"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  LETTER_GRADES,
  calculateWeightedGrade,
  calculateFinalGradeNeeded,
  encodeCompactGradeState,
  decodeCompactGradeState
} from "@/lib/calculations/grade";
import styles from "./GradeCalculatorIsland.module.css";

const DEFAULT_ROWS = [
  { id: "1", name: "Homework 1", type: "percentage", grade: "95", pointsEarned: "95", pointsTotal: "100", letter: "A", weight: "20" },
  { id: "2", name: "Quizzes", type: "percentage", grade: "88", pointsEarned: "44", pointsTotal: "50", letter: "B+", weight: "10" },
  { id: "3", name: "Midterm exam", type: "percentage", grade: "84", pointsEarned: "84", pointsTotal: "100", letter: "B", weight: "15" },
  { id: "4", name: "", type: "percentage", grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
  { id: "5", name: "", type: "percentage", grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
  { id: "6", name: "", type: "percentage", grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
  { id: "7", name: "", type: "percentage", grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" }
];

const LOCAL_STORAGE_KEY = "holy_grade_calc_history_v1";

export default function GradeCalculatorIsland() {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [globalMode, setGlobalMode] = useState("percentage"); // percentage | points | letter
  const [weightMode, setWeightMode] = useState("percent"); // percent | points
  const [finalGradeGoal, setFinalGradeGoal] = useState("90");
  const [remainingWeight, setRemainingWeight] = useState("55");
  const [isRemainingWeightCustom, setIsRemainingWeightCustom] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(true);
  const [showGoalHelp, setShowGoalHelp] = useState(false);
  const [recentSessions, setRecentSessions] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [isCustomSaveOpen, setIsCustomSaveOpen] = useState(false);
  const [customSaveLabel, setCustomSaveLabel] = useState("");
  const urlSyncTimerRef = useRef(null);
  const plannerResultRef = useRef(null);

  // Compute live weighted grade from current table rows
  const weightedResult = useMemo(() => {
    return calculateWeightedGrade(rows);
  }, [rows]);

  // Automatically update remaining weight when total weight changes (unless user typed a custom value)
  useEffect(() => {
    if (!isRemainingWeightCustom) {
      const remaining = Math.max(0, 100 - weightedResult.totalWeight);
      setRemainingWeight(remaining.toString());
    }
  }, [weightedResult.totalWeight, isRemainingWeightCustom]);

  // Compute live final exam planner output using current standing average
  const currentStandingGrade = weightedResult.averagePercentage !== null ? weightedResult.averagePercentage : 0;
  const finalResult = useMemo(() => {
    return calculateFinalGradeNeeded(
      currentStandingGrade.toString(),
      finalGradeGoal,
      remainingWeight
    );
  }, [currentStandingGrade, finalGradeGoal, remainingWeight]);

  // Load state from URL params or LocalStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Try reading URL query params
    const decoded = decodeCompactGradeState(window.location.search);
    if (decoded && decoded.rows && decoded.rows.length > 0) {
      const restored = [...decoded.rows];
      // Always guarantee at least 4 empty rows ready for input
      const emptyNeeded = Math.max(4, 7 - restored.length);
      for (let i = 0; i < emptyNeeded; i++) {
        restored.push({
          id: (restored.length + 1).toString(),
          name: "",
          type: decoded.mode || "percentage",
          grade: "",
          pointsEarned: "",
          pointsTotal: "",
          letter: "A",
          weight: ""
        });
      }
      setRows(restored);
      if (decoded.mode) setGlobalMode(decoded.mode);
      if (decoded.goal) setFinalGradeGoal(decoded.goal);
      if (decoded.remainingWeight) {
        setRemainingWeight(decoded.remainingWeight);
        setIsRemainingWeightCustom(true);
      }
    } else {
      // Clean query string if no valid params
      if (window.location.search) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }

    // 2. Load recent calculations from localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSessions(parsed.slice(0, 5));
        }
      }
    } catch (e) {
      console.warn("LocalStorage access failed", e);
    }
  }, []);

  // Sync to compact URL query param via replaceState (debounced ~500ms)
  const syncToUrl = useCallback((currentRows, mode, goal, rWeight) => {
    if (typeof window === "undefined") return;
    if (urlSyncTimerRef.current) clearTimeout(urlSyncTimerRef.current);

    urlSyncTimerRef.current = setTimeout(() => {
      try {
        const queryStr = encodeCompactGradeState(currentRows, goal, rWeight, mode);
        const newUrl = queryStr ? `${window.location.pathname}?${queryStr}` : window.location.pathname;
        window.history.replaceState(null, "", newUrl);
      } catch (e) {
        // ignore serialization issues
      }
    }, 500);
  }, []);

  // Update URL whenever inputs change
  useEffect(() => {
    syncToUrl(rows, globalMode, finalGradeGoal, remainingWeight);
  }, [rows, globalMode, finalGradeGoal, remainingWeight, syncToUrl]);

  // Show temporary toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Row update handlers
  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, [field]: value };
        // sync grade field if points or letter changed
        if (field === "pointsEarned" || field === "pointsTotal") {
          const earned = parseFloat(field === "pointsEarned" ? value : r.pointsEarned);
          const total = parseFloat(field === "pointsTotal" ? value : r.pointsTotal);
          if (!isNaN(earned) && !isNaN(total) && total > 0) {
            updated.grade = ((earned / total) * 100).toFixed(1);
          }
        } else if (field === "letter") {
          const match = LETTER_GRADES.find((g) => g.letter === value);
          if (match) updated.grade = match.defaultVal.toString();
        }
        return updated;
      })
    );
  };

  const addRow = () => {
    const newId = (Date.now() + Math.floor(Math.random() * 1000)).toString();
    setRows((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        type: globalMode,
        grade: "",
        pointsEarned: "",
        pointsTotal: "",
        letter: "A",
        weight: ""
      }
    ]);
  };

  const removeRow = (id) => {
    if (rows.length <= 1) {
      triggerToast("Minimum one assignment row required.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const resetRows = () => {
    setRows(DEFAULT_ROWS);
    setGlobalMode("percentage");
    setWeightMode("percent");
    setFinalGradeGoal("90");
    setRemainingWeight("55");
    setIsRemainingWeightCustom(false);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
    triggerToast("Reset to default (3 filled + 4 empty rows).");
  };

  const clearAllRows = () => {
    setRows([
      { id: "1", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
      { id: "2", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
      { id: "3", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
      { id: "4", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
      { id: "5", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
      { id: "6", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
      { id: "7", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" }
    ]);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
    triggerToast("Cleared all inputs (7 clean rows).");
  };

  const switchGlobalMode = (mode) => {
    setGlobalMode(mode);
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        type: mode
      }))
    );
  };

  // Copy compact shareable link
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const queryStr = encodeCompactGradeState(rows, finalGradeGoal, remainingWeight, globalMode);
    const shareUrl = `${window.location.origin}${window.location.pathname}${queryStr ? `?${queryStr}` : ""}`;
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        triggerToast("✓ Short shareable link copied to clipboard!");
      },
      () => {
        triggerToast("Failed to copy link.");
      }
    );
  };

  // Save current calculation to localStorage
  const handleSaveSession = (customLabel = null) => {
    if (typeof window === "undefined") return;
    try {
      const avgStr = weightedResult.averagePercentage !== null ? `${weightedResult.averagePercentage}% (${weightedResult.letterGrade})` : "In progress";
      const defaultLabel = customLabel || `Grade: ${avgStr}`;
      const newSession = {
        id: Date.now().toString(),
        label: defaultLabel,
        date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        rows,
        globalMode,
        weightMode,
        finalGoal: finalGradeGoal,
        remainingWeight,
        scoreText: avgStr
      };

      const updated = [newSession, ...recentSessions.filter((s) => s.label !== defaultLabel)].slice(0, 5);
      setRecentSessions(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setIsCustomSaveOpen(false);
      setCustomSaveLabel("");
      triggerToast("✓ Calculation saved to history!");
    } catch (e) {
      console.error(e);
      triggerToast("Failed to save calculation.");
    }
  };

  // Restore saved session from chip
  const restoreSession = (session) => {
    if (session.rows) {
      const restored = [...session.rows];
      const emptyNeeded = Math.max(4, 7 - restored.length);
      for (let i = 0; i < emptyNeeded; i++) {
        restored.push({
          id: (restored.length + 1).toString(),
          name: "",
          type: session.globalMode || "percentage",
          grade: "",
          pointsEarned: "",
          pointsTotal: "",
          letter: "A",
          weight: ""
        });
      }
      setRows(restored);
    }
    if (session.globalMode) setGlobalMode(session.globalMode);
    if (session.weightMode) setWeightMode(session.weightMode);
    if (session.finalGoal) setFinalGradeGoal(session.finalGoal);
    if (session.remainingWeight) {
      setRemainingWeight(session.remainingWeight);
      setIsRemainingWeightCustom(true);
    }
    triggerToast(`Restored calculation: "${session.label}"`);
  };

  const handleCalculatePlannerClick = () => {
    if (plannerResultRef.current) {
      plannerResultRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    triggerToast("Calculated score needed on remaining tasks!");
  };

  const handleClearPlanner = () => {
    setFinalGradeGoal("");
    setRemainingWeight(Math.max(0, 100 - weightedResult.totalWeight).toString());
    setIsRemainingWeightCustom(false);
    triggerToast("Cleared final grade planner fields.");
  };

  // Helper for letter badge color
  const getBadgeColorClass = (color) => {
    if (color === "green") return styles.green;
    if (color === "green-light") return styles.greenLight;
    if (color === "amber") return styles.amber;
    if (color === "red") return styles.red;
    if (color === "red-dark") return styles.redDark;
    return styles.default;
  };

  const getPlannerBadgeColorClass = (color) => {
    if (color === "green") return styles.green;
    if (color === "amber") return styles.amber;
    if (color === "red") return styles.red;
    return "";
  };

  return (
    <div className={styles.calcMain}>
      {/* Toast Notification */}
      {toastMessage && <div className={styles.shareToast}>{toastMessage}</div>}

      {/* Recent Calculations Chip Bar (Appears on repeat visits) */}
      {recentSessions.length > 0 && (
        <div className={styles.recentChipsBar}>
          <span className={styles.recentChipsLabel}>Recent Saved:</span>
          {recentSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => restoreSession(session)}
              className={styles.recentChip}
              title={`Saved on ${session.date}`}
            >
              <span>{session.label}</span>
              <span className={styles.recentChipScore}>{session.scoreText}</span>
            </button>
          ))}
        </div>
      )}

      {/* 1. PRIMARY WEIGHTED GRADE CALCULATOR TABLE */}
      <div className={styles.calcCard} id="weighted-grade-calculator">
        {/* Card Header & Controls */}
        <div className={styles.calcCardHeader}>
          <div className={styles.calcCardTitle}>
            <span className={styles.calcBadgeIcon}>%</span>
            <div>
              <h2>Weighted Grade Calculator</h2>
            </div>
          </div>

          <div className={styles.calcControls}>
            {/* Grade Input Format Toggle */}
            <div className={styles.pillToggleGroup} aria-label="Grade Format Toggle">
              <button
                type="button"
                className={`${styles.pillBtn} ${globalMode === "percentage" ? styles.active : ""}`}
                onClick={() => switchGlobalMode("percentage")}
              >
                <span className={styles.headerLabelFull}>Percentage (%)</span>
                <span className={styles.headerLabelShort}>Percent (%)</span>
              </button>
              <button
                type="button"
                className={`${styles.pillBtn} ${globalMode === "points" ? styles.active : ""}`}
                onClick={() => switchGlobalMode("points")}
              >
                <span className={styles.headerLabelFull}>Points (X/Y)</span>
                <span className={styles.headerLabelShort}>Points</span>
              </button>
              <button
                type="button"
                className={`${styles.pillBtn} ${globalMode === "letter" ? styles.active : ""}`}
                onClick={() => switchGlobalMode("letter")}
              >
                <span className={styles.headerLabelFull}>Letter Grade</span>
                <span className={styles.headerLabelShort}>Letter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Table of Rows */}
        <div className={styles.calcTableContainer}>
          <table className={styles.gradeTable}>
            <thead>
              <tr>
                <th className={styles.colName}>
                  <span className={styles.headerLabelFull}>Assignment / Category (Optional)</span>
                  <span className={styles.headerLabelShort}>Assignment (Optional)</span>
                </th>
                <th className={styles.colGrade}>
                  {globalMode === "percentage" && "Grade (%)"}
                  {globalMode === "points" && "Points (Earned / Total)"}
                  {globalMode === "letter" && "Letter Grade"}
                </th>
                <th className={styles.colWeight}>Weight ({weightMode === "percent" ? "%" : "pts"})</th>
                <th className={styles.colAction} aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id}>
                  <td className={styles.colName}>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder={`Assignment ${idx + 1}`}
                      value={row.name}
                      onChange={(e) => updateRow(row.id, "name", e.target.value)}
                    />
                  </td>
                  <td className={styles.colGrade}>
                    {row.type === "percentage" && (
                      <input
                        type="number"
                        step="any"
                        min="0"
                        max="200"
                        className={styles.inputField}
                        placeholder="e.g. 92"
                        value={row.grade}
                        onChange={(e) => updateRow(row.id, "grade", e.target.value)}
                      />
                    )}

                    {row.type === "points" && (
                      <div className={styles.pointsInputGroup}>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          className={styles.inputField}
                          placeholder="Score"
                          value={row.pointsEarned}
                          onChange={(e) => updateRow(row.id, "pointsEarned", e.target.value)}
                        />
                        <span className={styles.pointsSlash}>/</span>
                        <input
                          type="number"
                          step="any"
                          min="1"
                          className={styles.inputField}
                          placeholder="Max"
                          value={row.pointsTotal}
                          onChange={(e) => updateRow(row.id, "pointsTotal", e.target.value)}
                        />
                      </div>
                    )}

                    {row.type === "letter" && (
                      <select
                        className={`${styles.inputField} ${styles.selectField}`}
                        value={row.letter}
                        onChange={(e) => updateRow(row.id, "letter", e.target.value)}
                      >
                        {LETTER_GRADES.map((g) => (
                          <option key={g.letter} value={g.letter}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className={styles.colWeight}>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      className={styles.inputField}
                      placeholder="e.g. 20"
                      value={row.weight}
                      onChange={(e) => updateRow(row.id, "weight", e.target.value)}
                    />
                  </td>
                  <td className={styles.colAction}>
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className={styles.btnIconDel}
                      title="Delete this row"
                      aria-label={`Delete ${row.name || `Row ${idx + 1}`}`}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Controls */}
        <div className={styles.tableActions}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button type="button" onClick={addRow} className={styles.btnAdd}>
              + Add Row
            </button>
            <button type="button" onClick={resetRows} className={styles.btnText}>
              Reset template
            </button>
            <button type="button" onClick={clearAllRows} className={styles.btnText}>
              Clear all
            </button>
          </div>

          {/* Total Weight Monitor */}
          <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--ink-60)" }}>
            Total Weight:{" "}
            <strong
              style={{
                color: weightedResult.totalWeight === 100 ? "var(--green)" : "var(--ink)",
                fontWeight: 700
              }}
            >
              {weightedResult.totalWeight}%
            </strong>
          </div>
        </div>
      </div>

      {/* 2. LIVE PRIMARY OUTPUT CARD: CURRENT WEIGHTED GRADE */}
      <div className={styles.gradeOutputBox}>
        <div className={styles.gradePrimaryVal}>
          <span className={styles.gradeOutputLabel}>CURRENT WEIGHTED GRADE</span>
          <div className={styles.gradeNumbersRow}>
            <span className={styles.gradePercentBig}>
              {weightedResult.averagePercentage !== null ? `${weightedResult.averagePercentage}%` : "—"}
            </span>
            <span className={`${styles.gradeLetterPill} ${getBadgeColorClass(weightedResult.color)}`}>
              {weightedResult.letterGrade}
            </span>
          </div>

          {/* Weight breakdown alert */}
          {weightedResult.totalWeight > 0 && weightedResult.totalWeight !== 100 && (
            <div className={`${styles.weightAlert} ${styles.warning}`} style={{ marginTop: "10px" }}>
              <span>Completed weight is {weightedResult.totalWeight}%. Remaining weight is {Math.max(0, 100 - weightedResult.totalWeight)}%.</span>
            </div>
          )}
          {weightedResult.totalWeight === 100 && (
            <div className={`${styles.weightAlert} ${styles.success}`} style={{ marginTop: "10px" }}>
              <span>✓ Total weight equals 100% (All course components completed).</span>
            </div>
          )}
        </div>

        <div className={styles.gradeStatsGrid}>
          <div className={styles.gradeStatCell}>
            <span>GPA EQUIVALENT</span>
            <strong>{weightedResult.gpa !== "—" ? `${weightedResult.gpa} / 4.0` : "—"}</strong>
          </div>
          <div className={styles.gradeStatCell}>
            <span>GRADED ITEMS</span>
            <strong>{rows.filter((r) => r.grade !== "" || r.weight !== "").length} active</strong>
          </div>
        </div>
      </div>

      {/* 3. HIGHLIGHTED ACTION BUTTONS (SAVE & SHARE) */}
      <div className={styles.actionButtonsRow}>
        {isCustomSaveOpen ? (
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="e.g. Physics 101 Midterm"
              value={customSaveLabel}
              onChange={(e) => setCustomSaveLabel(e.target.value)}
              className={styles.inputField}
              style={{ width: "220px", padding: "8px 12px", fontSize: "13px" }}
            />
            <button
              type="button"
              onClick={() => handleSaveSession(customSaveLabel)}
              className={`${styles.btnActionHighlight} ${styles.save}`}
              style={{ padding: "8px 16px" }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsCustomSaveOpen(false)}
              className={styles.btnText}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsCustomSaveOpen(true)}
            className={`${styles.btnActionHighlight} ${styles.save}`}
            title="Save this calculation to browser memory"
          >
            <span className={styles.btnActionIcon}>💾</span>
            <span>Save Calculation</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleCopyLink}
          className={`${styles.btnActionHighlight} ${styles.share}`}
          title="Copy bookmarkable share link to clipboard"
        >
          <span className={styles.btnActionIcon}>🔗</span>
          <span>Share / Copy Link</span>
        </button>
      </div>

      {/* 4. FINAL GRADE PLANNING (OPTIONAL) */}
      <div className={styles.plannerCard} id="final-grade-planner">
        <div
          className={styles.plannerHeaderBar}
          onClick={() => setIsPlannerOpen(!isPlannerOpen)}
          role="button"
          tabIndex={0}
          aria-expanded={isPlannerOpen}
        >
          <div>
            <h3>Final Grade Planning (Optional)</h3>
          </div>
          <span className={`${styles.plannerChevron} ${isPlannerOpen ? styles.open : ""}`}>
            {isPlannerOpen ? "▲" : "▼"}
          </span>
        </div>

        {isPlannerOpen && (
          <div className={styles.plannerBody}>
            <div className={styles.plannerFormCompact}>
              {/* Row 1: Final Grade Goal */}
              <div className={styles.plannerRowItem}>
                <div className={styles.plannerLabel}>
                  <span>Final Grade Goal</span>
                  <button
                    type="button"
                    className={styles.plannerHelpBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGoalHelp(!showGoalHelp);
                    }}
                    title="The percentage target you wish to achieve in this class"
                  >
                    ?
                  </button>
                </div>
                <div className={styles.plannerInputWrap}>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="150"
                    className={styles.plannerInputField}
                    placeholder="90"
                    value={finalGradeGoal}
                    onChange={(e) => setFinalGradeGoal(e.target.value)}
                  />
                  <span className={styles.plannerUnit}>%</span>
                </div>
              </div>

              {showGoalHelp && (
                <div style={{ padding: "6px 10px", background: "var(--paper)", borderRadius: "5px", fontSize: "11.5px", color: "var(--ink-60)", margin: "-4px 0 4px" }}>
                  Enter your target final course grade percentage (e.g. 90 for A-, 85 for B, 80 for B-).
                </div>
              )}

              {/* Row 2: Weight of Remaining Tasks */}
              <div className={styles.plannerRowItem}>
                <div className={styles.plannerLabel}>
                  <span>Weight of Remaining Tasks</span>
                </div>
                <div className={styles.plannerInputWrap}>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    max="100"
                    className={styles.plannerInputField}
                    placeholder="55"
                    value={remainingWeight}
                    onChange={(e) => {
                      setRemainingWeight(e.target.value);
                      setIsRemainingWeightCustom(true);
                    }}
                  />
                  <span className={styles.plannerUnit}>%</span>
                </div>
              </div>

              {/* Action Buttons (Calculate, Clear) */}
              <div className={styles.plannerActionsBar}>
                <button
                  type="button"
                  className={styles.btnCalcGreen}
                  onClick={handleCalculatePlannerClick}
                >
                  <span>Calculate</span>
                  <span className={styles.btnCalcIcon}>▶</span>
                </button>
                <button
                  type="button"
                  className={styles.btnLinkClear}
                  onClick={handleClearPlanner}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Final Exam Result Breakdown */}
            <div className={styles.plannerResultBox} ref={plannerResultRef}>
              <div>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10.5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--ink-60)",
                    display: "block",
                    marginBottom: "3px"
                  }}
                >
                  SCORE NEEDED ON REMAINING TASKS / FINAL EXAM
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span className={styles.plannerResultScore}>
                    {finalResult.scoreNeeded !== null ? `${finalResult.scoreNeeded}%` : "—"}
                  </span>
                  {finalResult.scoreNeeded !== null && finalResult.letterGrade !== "—" && (
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--ink-60)"
                      }}
                    >
                      (Grade: {finalResult.letterGrade})
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "12.5px", color: "var(--ink-60)", marginTop: "4px" }}>
                  {finalResult.message}
                </p>
              </div>

              <div>
                <span className={`${styles.plannerStatusBadge} ${getPlannerBadgeColorClass(finalResult.badgeColor)}`}>
                  {finalResult.status === "impossible" && "▲ Extra Credit Required"}
                  {finalResult.status === "secured" && "✓ Target Secured (0% Needed)"}
                  {finalResult.status === "comfortable" && "✓ Readily In Reach"}
                  {finalResult.status === "feasible" && "● Realistic Target"}
                  {finalResult.status === "challenging" && "▲ High Score Required"}
                  {finalResult.status === "invalid" && "Invalid Inputs"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
