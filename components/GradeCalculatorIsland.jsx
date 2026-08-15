"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  LETTER_GRADES,
  calculateWeightedGrade,
  calculateFinalGradeNeeded
} from "@/lib/calculations/grade";

const DEFAULT_ROWS = [
  { id: "1", name: "Homework Assignments", type: "percentage", grade: "95", pointsEarned: "95", pointsTotal: "100", letter: "A", weight: "20" },
  { id: "2", name: "Quizzes", type: "percentage", grade: "88", pointsEarned: "44", pointsTotal: "50", letter: "B+", weight: "10" },
  { id: "3", name: "Midterm Exam", type: "percentage", grade: "84", pointsEarned: "84", pointsTotal: "100", letter: "B", weight: "15" },
  { id: "4", name: "", type: "percentage", grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
  { id: "5", name: "", type: "percentage", grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
  { id: "6", name: "", type: "percentage", grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
  { id: "7", name: "", type: "percentage", grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
  { id: "8", name: "", type: "percentage", grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" }
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
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get("g");
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
        if (decoded.rows && Array.isArray(decoded.rows)) {
          setRows(decoded.rows);
        }
        if (decoded.globalMode) setGlobalMode(decoded.globalMode);
        if (decoded.weightMode) setWeightMode(decoded.weightMode);
        if (decoded.finalGoal) setFinalGradeGoal(decoded.finalGoal);
        if (decoded.remainingWeight) {
          setRemainingWeight(decoded.remainingWeight);
          setIsRemainingWeightCustom(true);
        }
      } catch (e) {
        console.error("Failed to parse URL grade data", e);
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

  // Sync to URL query param via replaceState (debounced ~500ms)
  const syncToUrl = useCallback((currentRows, mode, wMode, goal, rWeight) => {
    if (typeof window === "undefined") return;
    if (urlSyncTimerRef.current) clearTimeout(urlSyncTimerRef.current);

    urlSyncTimerRef.current = setTimeout(() => {
      try {
        const payload = {
          rows: currentRows,
          globalMode: mode,
          weightMode: wMode,
          finalGoal: goal,
          remainingWeight: rWeight
        };
        const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
        const newUrl = `${window.location.pathname}?g=${encoded}`;
        window.history.replaceState(null, "", newUrl);
      } catch (e) {
        // ignore serialization issues
      }
    }, 500);
  }, []);

  // Update URL whenever inputs change
  useEffect(() => {
    syncToUrl(rows, globalMode, weightMode, finalGradeGoal, remainingWeight);
  }, [rows, globalMode, weightMode, finalGradeGoal, remainingWeight, syncToUrl]);

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
    const newIndex = rows.length + 1;
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
    triggerToast("Reset to default (3 filled + 5 empty rows).");
  };

  const clearAllRows = () => {
    setRows([
      { id: "1", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
      { id: "2", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
      { id: "3", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
      { id: "4", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" },
      { id: "5", name: "", type: globalMode, grade: "", pointsEarned: "", pointsTotal: "", letter: "A", weight: "" }
    ]);
    triggerToast("Cleared all inputs.");
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

  // Copy shareable link
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        triggerToast("✓ Shareable link copied to clipboard!");
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
    if (session.rows) setRows(session.rows);
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

  return (
    <div className="calc-main">
      {/* Toast Notification */}
      {toastMessage && <div className="share-toast">{toastMessage}</div>}

      {/* Recent Calculations Chip Bar (Appears on repeat visits) */}
      {recentSessions.length > 0 && (
        <div className="recent-chips-bar">
          <span className="recent-chips-label">Recent Saved:</span>
          {recentSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => restoreSession(session)}
              className="recent-chip"
              title={`Saved on ${session.date}`}
            >
              <span>{session.label}</span>
              <span className="recent-chip-score">{session.scoreText}</span>
            </button>
          ))}
        </div>
      )}

      {/* 1. PRIMARY WEIGHTED GRADE CALCULATOR TABLE */}
      <div className="calc-card" id="weighted-grade-calculator">
        {/* Card Header & Controls */}
        <div className="calc-card-header">
          <div className="calc-card-title">
            <span className="calc-badge-icon">%</span>
            <div>
              <h2>Weighted Grade Calculator</h2>
            </div>
          </div>

          <div className="calc-controls">
            {/* Grade Input Format Toggle */}
            <div className="pill-toggle-group" aria-label="Grade Format Toggle">
              <button
                type="button"
                className={`pill-btn ${globalMode === "percentage" ? "active" : ""}`}
                onClick={() => switchGlobalMode("percentage")}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                className={`pill-btn ${globalMode === "points" ? "active" : ""}`}
                onClick={() => switchGlobalMode("points")}
              >
                Points (X/Y)
              </button>
              <button
                type="button"
                className={`pill-btn ${globalMode === "letter" ? "active" : ""}`}
                onClick={() => switchGlobalMode("letter")}
              >
                Letter Grade
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Table of Rows */}
        <div className="calc-table-container">
          <table className="grade-table">
            <thead>
              <tr>
                <th style={{ width: "38%" }}>Assignment / Category (Optional)</th>
                <th style={{ width: "32%" }}>
                  {globalMode === "percentage" && "Grade (%)"}
                  {globalMode === "points" && "Points (Earned / Total)"}
                  {globalMode === "letter" && "Letter Grade"}
                </th>
                <th style={{ width: "22%" }}>Weight ({weightMode === "percent" ? "%" : "pts"})</th>
                <th style={{ width: "8%", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={`Assignment ${idx + 1}`}
                      value={row.name}
                      onChange={(e) => updateRow(row.id, "name", e.target.value)}
                    />
                  </td>
                  <td>
                    {row.type === "percentage" && (
                      <input
                        type="number"
                        step="any"
                        min="0"
                        max="200"
                        className="input-field input-field-mono"
                        placeholder="e.g. 92"
                        value={row.grade}
                        onChange={(e) => updateRow(row.id, "grade", e.target.value)}
                      />
                    )}

                    {row.type === "points" && (
                      <div className="points-input-group">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          className="input-field input-field-mono"
                          placeholder="Score"
                          value={row.pointsEarned}
                          onChange={(e) => updateRow(row.id, "pointsEarned", e.target.value)}
                        />
                        <span className="points-slash">/</span>
                        <input
                          type="number"
                          step="any"
                          min="1"
                          className="input-field input-field-mono"
                          placeholder="Max"
                          value={row.pointsTotal}
                          onChange={(e) => updateRow(row.id, "pointsTotal", e.target.value)}
                        />
                      </div>
                    )}

                    {row.type === "letter" && (
                      <select
                        className="input-field select-field input-field-mono"
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
                  <td>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      className="input-field input-field-mono"
                      placeholder="e.g. 20"
                      value={row.weight}
                      onChange={(e) => updateRow(row.id, "weight", e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="btn-icon-del"
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
        <div className="table-actions">
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button type="button" onClick={addRow} className="btn-add">
              + Add Row
            </button>
            <button type="button" onClick={resetRows} className="btn-text">
              Reset template
            </button>
            <button type="button" onClick={clearAllRows} className="btn-text">
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

      {/* 2. LIVE PRIMARY OUTPUT CARD: CURRENT WEIGHTED GRADE (MOVED ABOVE OPTIONAL PLANNER) */}
      <div className="grade-output-box">
        <div className="grade-primary-val">
          <span className="grade-output-label">CURRENT WEIGHTED GRADE</span>
          <div className="grade-numbers-row">
            <span className="grade-percent-big">
              {weightedResult.averagePercentage !== null ? `${weightedResult.averagePercentage}%` : "—"}
            </span>
            <span className={`grade-letter-pill ${weightedResult.color}`}>
              {weightedResult.letterGrade}
            </span>
          </div>

          {/* Weight breakdown alert */}
          {weightedResult.totalWeight > 0 && weightedResult.totalWeight !== 100 && (
            <div className="weight-alert warning" style={{ marginTop: "10px" }}>
              <span>Completed weight is {weightedResult.totalWeight}%. Remaining weight is {Math.max(0, 100 - weightedResult.totalWeight)}%.</span>
            </div>
          )}
          {weightedResult.totalWeight === 100 && (
            <div className="weight-alert success" style={{ marginTop: "10px" }}>
              <span>✓ Total weight equals 100% (All course components completed).</span>
            </div>
          )}
        </div>

        <div className="grade-stats-grid">
          <div className="grade-stat-cell">
            <span>GPA EQUIVALENT</span>
            <strong>{weightedResult.gpa !== "—" ? `${weightedResult.gpa} / 4.0` : "—"}</strong>
          </div>
          <div className="grade-stat-cell">
            <span>GRADED ITEMS</span>
            <strong>{rows.filter((r) => r.grade !== "" || r.weight !== "").length} active</strong>
          </div>
        </div>
      </div>

      {/* 3. HIGHLIGHTED ACTION BUTTONS (SAVE & SHARE) */}
      <div className="action-buttons-row">
        {isCustomSaveOpen ? (
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="e.g. Physics 101 Midterm"
              value={customSaveLabel}
              onChange={(e) => setCustomSaveLabel(e.target.value)}
              className="input-field"
              style={{ width: "220px", padding: "8px 12px", fontSize: "13px" }}
            />
            <button
              type="button"
              onClick={() => handleSaveSession(customSaveLabel)}
              className="btn-action-highlight save"
              style={{ padding: "8px 16px" }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsCustomSaveOpen(false)}
              className="btn-text"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsCustomSaveOpen(true)}
            className="btn-action-highlight save"
            title="Save this calculation to browser memory"
          >
            <span className="btn-action-icon">💾</span>
            <span>Save Calculation</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleCopyLink}
          className="btn-action-highlight share"
          title="Copy bookmarkable share link to clipboard"
        >
          <span className="btn-action-icon">🔗</span>
          <span>Share / Copy Link</span>
        </button>
      </div>

      {/* 4. FINAL GRADE PLANNING (OPTIONAL) — PLACED BELOW THE CURRENT OUTPUT & HIGHLIGHTED BUTTONS */}
      <div className="planner-card" id="final-grade-planner">
        <div
          className="planner-header-bar"
          onClick={() => setIsPlannerOpen(!isPlannerOpen)}
          role="button"
          tabIndex={0}
          aria-expanded={isPlannerOpen}
        >
          <div>
            <h3>Final Grade Planning (Optional)</h3>
          </div>
          <span className={`planner-chevron ${isPlannerOpen ? "open" : ""}`}>
            {isPlannerOpen ? "▲" : "▼"}
          </span>
        </div>

        {isPlannerOpen && (
          <div className="planner-body">
            <div className="planner-form-compact">
              {/* Row 1: Final Grade Goal */}
              <div className="planner-row-item">
                <div className="planner-label">
                  <span>Final Grade Goal</span>
                  <button
                    type="button"
                    className="planner-help-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGoalHelp(!showGoalHelp);
                    }}
                    title="The percentage target you wish to achieve in this class"
                  >
                    ?
                  </button>
                </div>
                <div className="planner-input-wrap">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="150"
                    className="planner-input-field"
                    placeholder="90"
                    value={finalGradeGoal}
                    onChange={(e) => setFinalGradeGoal(e.target.value)}
                  />
                  <span className="planner-unit">%</span>
                </div>
              </div>

              {showGoalHelp && (
                <div style={{ padding: "6px 10px", background: "var(--paper)", borderRadius: "5px", fontSize: "11.5px", color: "var(--ink-60)", margin: "-4px 0 4px" }}>
                  Enter your target final course grade percentage (e.g. 90 for A-, 85 for B, 80 for B-).
                </div>
              )}

              {/* Row 2: Weight of Remaining Tasks */}
              <div className="planner-row-item">
                <div className="planner-label">
                  <span>Weight of Remaining Tasks</span>
                </div>
                <div className="planner-input-wrap">
                  <input
                    type="number"
                    step="any"
                    min="1"
                    max="100"
                    className="planner-input-field"
                    placeholder="55"
                    value={remainingWeight}
                    onChange={(e) => {
                      setRemainingWeight(e.target.value);
                      setIsRemainingWeightCustom(true);
                    }}
                  />
                  <span className="planner-unit">%</span>
                </div>
              </div>

              {/* Action Buttons (Calculate, Clear) */}
              <div className="planner-actions-bar">
                <button
                  type="button"
                  className="btn-calc-green"
                  onClick={handleCalculatePlannerClick}
                >
                  <span>Calculate</span>
                  <span className="btn-calc-icon">▶</span>
                </button>
                <button
                  type="button"
                  className="btn-link-clear"
                  onClick={handleClearPlanner}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Final Exam Result Breakdown */}
            <div className="planner-result-box" ref={plannerResultRef}>
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
                  <span className="planner-result-score">
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
                <span className={`planner-status-badge ${finalResult.badgeColor}`}>
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
