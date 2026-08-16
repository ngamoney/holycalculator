"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  GPA_LETTER_GRADES,
  calculateCumulativeGPA,
  calculateGPAPlanner,
  encodeCompactGPAState,
  decodeCompactGPAState
} from "@/lib/calculations/gpa";
import styles from "./GPACalculatorIsland.module.css";

const LOCAL_STORAGE_KEY = "holy_gpa_calc_history_v1";

function createDefaultCourses(semId) {
  return [
    { id: `${semId}-1`, name: "English Literature", credits: "3", gradeType: "letter", letter: "A", percentage: "95", points: "4.0" },
    { id: `${semId}-2`, name: "Calculus I", credits: "4", gradeType: "letter", letter: "B+", percentage: "88", points: "3.3" },
    { id: `${semId}-3`, name: "General Chemistry", credits: "4", gradeType: "letter", letter: "A-", percentage: "91", points: "3.7" },
    { id: `${semId}-4`, name: "History 101", credits: "3", gradeType: "letter", letter: "B", percentage: "85", points: "3.0" },
    { id: `${semId}-5`, name: "", credits: "", gradeType: "letter", letter: "A", percentage: "", points: "" }
  ];
}

const DEFAULT_SEMESTERS = [
  {
    id: "sem-1",
    name: "Semester 1",
    isCollapsed: false,
    courses: createDefaultCourses("sem-1")
  }
];

export default function GPACalculatorIsland() {
  const [semesters, setSemesters] = useState(DEFAULT_SEMESTERS);
  const [globalFormat, setGlobalFormat] = useState("letter"); // letter | percentage | points
  const [isGrouped, setIsGrouped] = useState(true);
  const [includePrior, setIncludePrior] = useState(false);
  const [priorGPA, setPriorGPA] = useState("");
  const [priorCredits, setPriorCredits] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // GPA Target Planner State
  const [targetGPA, setTargetGPA] = useState("3.80");
  const [additionalCredits, setAdditionalCredits] = useState("15");
  const [isPlannerOpen, setIsPlannerOpen] = useState(true);

  // History and UI feedback
  const [recentSessions, setRecentSessions] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [customSaveLabel, setCustomSaveLabel] = useState("");

  const urlSyncTimerRef = useRef(null);

  // Calculate Cumulative GPA live
  const cumulativeResult = useMemo(() => {
    return calculateCumulativeGPA(
      semesters,
      includePrior ? priorGPA : "",
      includePrior ? priorCredits : "",
      globalFormat
    );
  }, [semesters, includePrior, priorGPA, priorCredits, globalFormat]);

  // Calculate Planner live using current cumulative GPA & credits
  const currentStandingGPA = cumulativeResult.cumulativeGpa !== null ? cumulativeResult.cumulativeGpa : 3.0;
  const currentCompletedCredits = cumulativeResult.totalGpaCredits > 0 ? cumulativeResult.totalGpaCredits : 30;

  const plannerResult = useMemo(() => {
    return calculateGPAPlanner(
      currentStandingGPA.toString(),
      targetGPA,
      currentCompletedCredits.toString(),
      additionalCredits
    );
  }, [currentStandingGPA, targetGPA, currentCompletedCredits, additionalCredits]);

  // Load from URL and LocalStorage on Mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Read URL query params
    const decoded = decodeCompactGPAState(window.location.search);
    if (decoded && decoded.semesters && decoded.semesters.length > 0) {
      setSemesters(decoded.semesters);
      if (decoded.mode) setGlobalFormat(decoded.mode);
      if (decoded.priorGPA || decoded.priorCredits) {
        setIncludePrior(true);
        if (decoded.priorGPA) setPriorGPA(decoded.priorGPA);
        if (decoded.priorCredits) setPriorCredits(decoded.priorCredits);
      }
      if (decoded.targetGPA) setTargetGPA(decoded.targetGPA);
      if (decoded.additionalCredits) setAdditionalCredits(decoded.additionalCredits);
      if (typeof decoded.isGrouped === "boolean") setIsGrouped(decoded.isGrouped);
    } else {
      if (window.location.search) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }

    // 2. Load recent sessions from localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSessions(parsed.slice(0, 5));
        }
      }
    } catch (e) {
      console.warn("LocalStorage access error", e);
    }
  }, []);

  // Sync state to compact URL search query
  const syncToUrl = useCallback((currentSems, format, pGpa, pCred, tGpa, aCred, grp, hasPrior) => {
    if (typeof window === "undefined") return;
    if (urlSyncTimerRef.current) clearTimeout(urlSyncTimerRef.current);

    urlSyncTimerRef.current = setTimeout(() => {
      try {
        const query = encodeCompactGPAState(
          currentSems,
          format,
          hasPrior ? pGpa : "",
          hasPrior ? pCred : "",
          tGpa,
          aCred,
          grp
        );
        const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
        window.history.replaceState(null, "", newUrl);
      } catch (e) {
        // ignore
      }
    }, 400);
  }, []);

  useEffect(() => {
    syncToUrl(semesters, globalFormat, priorGPA, priorCredits, targetGPA, additionalCredits, isGrouped, includePrior);
  }, [semesters, globalFormat, priorGPA, priorCredits, targetGPA, additionalCredits, isGrouped, includePrior, syncToUrl]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Semester Mutation Handlers
  const addSemester = () => {
    const newSemNum = semesters.length + 1;
    const newId = `sem-${Date.now()}`;
    const newSem = {
      id: newId,
      name: `Semester ${newSemNum}`,
      isCollapsed: false,
      courses: [
        { id: `${newId}-1`, name: "", credits: "3", gradeType: globalFormat, letter: "A", percentage: "95", points: "4.0" },
        { id: `${newId}-2`, name: "", credits: "3", gradeType: globalFormat, letter: "A", percentage: "95", points: "4.0" },
        { id: `${newId}-3`, name: "", credits: "3", gradeType: globalFormat, letter: "A", percentage: "95", points: "4.0" },
        { id: `${newId}-4`, name: "", credits: "3", gradeType: globalFormat, letter: "A", percentage: "95", points: "4.0" },
        { id: `${newId}-5`, name: "", credits: "", gradeType: globalFormat, letter: "A", percentage: "", points: "" }
      ]
    };
    setSemesters([...semesters, newSem]);
    showToast(`Added Semester ${newSemNum}`);
  };

  const removeSemester = (semId) => {
    if (semesters.length <= 1) return;
    setSemesters(semesters.filter(s => s.id !== semId));
    showToast("Semester removed");
  };

  const toggleSemesterCollapse = (semId) => {
    setSemesters(semesters.map(s => s.id === semId ? { ...s, isCollapsed: !s.isCollapsed } : s));
  };

  const updateSemesterName = (semId, name) => {
    setSemesters(semesters.map(s => s.id === semId ? { ...s, name } : s));
  };

  // Course Mutation Handlers
  const updateCourse = (semId, courseId, field, value) => {
    setSemesters(prev =>
      prev.map(sem => {
        if (sem.id !== semId) return sem;
        return {
          ...sem,
          courses: sem.courses.map(c => {
            if (c.id !== courseId) return c;
            const updated = { ...c, [field]: value };
            return updated;
          })
        };
      })
    );
  };

  const addCourseToSemester = (semId) => {
    setSemesters(prev =>
      prev.map(sem => {
        if (sem.id !== semId) return sem;
        const newCourseId = `${sem.id}-${Date.now()}`;
        return {
          ...sem,
          courses: [
            ...sem.courses,
            { id: newCourseId, name: "", credits: "3", gradeType: globalFormat, letter: "A", percentage: "95", points: "4.0" }
          ]
        };
      })
    );
  };

  const removeCourseFromSemester = (semId, courseId) => {
    setSemesters(prev =>
      prev.map(sem => {
        if (sem.id !== semId) return sem;
        return {
          ...sem,
          courses: sem.courses.filter(c => c.id !== courseId)
        };
      })
    );
  };

  // Save to Recents
  const handleSaveCalculation = (customName) => {
    if (cumulativeResult.cumulativeGpa === null) {
      showToast("Enter course credits and grades first!");
      return;
    }
    const label = customName || (semesters[0]?.name ? `${semesters[0].name} GPA` : "GPA Calculation");
    const session = {
      id: Date.now().toString(),
      label,
      gpa: cumulativeResult.cumulativeGpa,
      credits: cumulativeResult.totalGpaCredits,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      url: window.location.search
    };

    const updated = [session, ...recentSessions.filter(s => s.label !== label)].slice(0, 5);
    setRecentSessions(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    setIsSaveModalOpen(false);
    setCustomSaveLabel("");
    showToast(`Saved "${label}" (${session.gpa} GPA)`);
  };

  const handleRestoreSession = (session) => {
    if (session.url) {
      const decoded = decodeCompactGPAState(session.url);
      if (decoded && decoded.semesters) {
        setSemesters(decoded.semesters);
        if (decoded.mode) setGlobalFormat(decoded.mode);
        if (decoded.priorGPA) {
          setIncludePrior(true);
          setPriorGPA(decoded.priorGPA);
        }
        if (decoded.priorCredits) {
          setPriorCredits(decoded.priorCredits);
        }
        showToast(`Restored "${session.label}"`);
      }
    }
  };

  const handleCopyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast("Shareable GPA link copied to clipboard!");
      });
    }
  };

  // Render Grade Input (Letter Select / Percentage / Point value)
  const renderGradeInput = (semId, course) => {
    const format = course.gradeType || globalFormat;

    if (format === "percentage") {
      return (
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          className={styles.textInput}
          placeholder="e.g. 92"
          value={course.percentage}
          onChange={(e) => updateCourse(semId, course.id, "percentage", e.target.value)}
        />
      );
    }

    if (format === "points") {
      return (
        <input
          type="number"
          step="0.01"
          min="0"
          max="4.33"
          className={styles.textInput}
          placeholder="e.g. 3.7"
          value={course.points}
          onChange={(e) => updateCourse(semId, course.id, "points", e.target.value)}
        />
      );
    }

    // Default: Letter Grade Dropdown
    return (
      <select
        className={styles.gradeSelect}
        value={course.letter || "A"}
        onChange={(e) => updateCourse(semId, course.id, "letter", e.target.value)}
      >
        {GPA_LETTER_GRADES.map((g) => (
          <option key={g.letter} value={g.letter}>
            {g.letter} {g.points !== null ? `(${g.points.toFixed(1)})` : ""}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className={styles.calcMain}>
      {/* Toast Notification */}
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      {/* Save Modal */}
      {isSaveModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSaveModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>Save Calculation</div>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)", margin: 0 }}>
              Give this calculation a name to easily recognize it in your recent history:
            </p>
            <input
              type="text"
              className={styles.modalInput}
              placeholder="e.g. Fall 2026 GPA, Freshman Year, Pre-Med..."
              value={customSaveLabel}
              autoFocus
              onChange={(e) => setCustomSaveLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveCalculation(customSaveLabel);
              }}
            />
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setIsSaveModalOpen(false)}>
                Cancel
              </button>
              <button className={styles.modalConfirmBtn} onClick={() => handleSaveCalculation(customSaveLabel)}>
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Calculations Bar */}
      {recentSessions.length > 0 && (
        <div className={styles.recentChipsBar}>
          <span className={styles.recentChipsLabel}>Recent GPAs:</span>
          {recentSessions.map((s) => (
            <button
              key={s.id}
              className={styles.recentChip}
              onClick={() => handleRestoreSession(s)}
              title={`Calculated on ${s.date} with ${s.credits} credits`}
            >
              <span>{s.label}</span>
              <span className={styles.recentChipScore}>{Number(s.gpa).toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Interactive GPA Card */}
      <div className={styles.calcCard}>
        {/* Header with Title and Global Format / Settings Controls */}
        <div className={styles.calcCardHeader}>
          <div className={styles.calcCardTitle}>
            <div className={styles.calcBadgeIcon}>4.0</div>
            <h2>GPA Calculator</h2>
          </div>

          <div className={styles.calcControls}>
            {/* Grade Format Pills */}
            <div className={styles.pillToggleGroup}>
              <button
                className={`${styles.pillBtn} ${globalFormat === "letter" ? styles.active : ""}`}
                onClick={() => setGlobalFormat("letter")}
              >
                <span className={styles.headerLabelFull}>Letter Grade</span>
                <span className={styles.headerLabelShort}>Letter</span>
              </button>
              <button
                className={`${styles.pillBtn} ${globalFormat === "percentage" ? styles.active : ""}`}
                onClick={() => setGlobalFormat("percentage")}
              >
                <span className={styles.headerLabelFull}>Percentage (%)</span>
                <span className={styles.headerLabelShort}>Percent (%)</span>
              </button>
              <button
                className={`${styles.pillBtn} ${globalFormat === "points" ? styles.active : ""}`}
                onClick={() => setGlobalFormat("points")}
              >
                <span className={styles.headerLabelFull}>Point Value</span>
                <span className={styles.headerLabelShort}>Points</span>
              </button>
            </div>

            {/* Settings Toggle Button */}
            <button
              className={styles.settingsBtn}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              title="Toggle settings panel"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Collapsible Settings Drawer */}
        {isSettingsOpen && (
          <div className={styles.settingsPanel}>
            <div className={styles.settingsRow}>
              <div>
                <div className={styles.settingsLabel}>Add GPA of Prior Semesters</div>
                <div className={styles.settingsDesc}>Include past cumulative GPA and completed credits in calculation</div>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={includePrior}
                  onChange={(e) => setIncludePrior(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            <div className={styles.settingsRow}>
              <div>
                <div className={styles.settingsLabel}>Group Courses into Semesters</div>
                <div className={styles.settingsDesc}>Organize courses into distinct term tabs or keep a single flat list</div>
              </div>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={isGrouped}
                  onChange={(e) => setIsGrouped(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>
          </div>
        )}

        {/* Prior GPA Box (shown when toggled on) */}
        {includePrior && (
          <div className={styles.priorGpaBox}>
            <div className={styles.priorGpaTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <span>Prior Academic Standing (Carry-Forward)</span>
            </div>
            <div className={styles.priorInputsGrid}>
              <div className={styles.priorField}>
                <span>Prior GPA:</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.33"
                  placeholder="3.40"
                  value={priorGPA}
                  onChange={(e) => setPriorGPA(e.target.value)}
                />
              </div>
              <div className={styles.priorField}>
                <span>Prior Credits:</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="30"
                  value={priorCredits}
                  onChange={(e) => setPriorCredits(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Semesters List */}
        <div className={styles.semestersList}>
          {semesters.map((sem, sIndex) => {
            const semSummary = cumulativeResult.semesterResults.find(r => r.id === sem.id);
            return (
              <div key={sem.id} className={styles.semesterSection}>
                {/* Semester Header (Only shown when grouped or multiple semesters) */}
                {isGrouped && (
                  <div className={styles.semesterHeader}>
                    <div className={styles.semesterTitleGroup}>
                      <input
                        type="text"
                        className={styles.semesterTitleInput}
                        value={sem.name}
                        onChange={(e) => updateSemesterName(sem.id, e.target.value)}
                        placeholder={`Semester ${sIndex + 1}`}
                      />
                      {semSummary && semSummary.gpa !== null && (
                        <span className={styles.semesterSubtotalBadge}>
                          GPA: <span className={styles.semesterSubtotalHighlight}>{semSummary.gpa.toFixed(2)}</span>
                          <span style={{ opacity: 0.6 }}>• {semSummary.totalGpaCredits} cr</span>
                        </span>
                      )}
                    </div>

                    <div className={styles.semesterActions}>
                      <button
                        className={styles.collapseBtn}
                        onClick={() => toggleSemesterCollapse(sem.id)}
                        title={sem.isCollapsed ? "Expand semester table" : "Collapse semester table"}
                      >
                        {sem.isCollapsed ? "Expand ▼" : "Collapse ▲"}
                      </button>
                      {semesters.length > 1 && (
                        <button
                          className={styles.removeSemBtn}
                          onClick={() => removeSemester(sem.id)}
                          title="Delete semester"
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Course Table (Expanded) */}
                {!sem.isCollapsed && (
                  <>
                    <div className={styles.tableWrapper}>
                      <table className={styles.courseTable}>
                        <thead>
                          <tr>
                            <th className={styles.colCourse}>
                              <span className={styles.headerLabelFull}>Course Name (Optional)</span>
                              <span className={styles.headerLabelShort}>Course Name</span>
                            </th>
                            <th className={styles.colCredits}>Credits</th>
                            <th className={styles.colGrade}>Grade</th>
                            <th className={styles.colAction}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {sem.courses.map((course) => (
                            <tr key={course.id}>
                              <td className={styles.colCourse}>
                                <input
                                  type="text"
                                  className={styles.textInput}
                                  placeholder="e.g. Bio 101"
                                  value={course.name}
                                  onChange={(e) => updateCourse(sem.id, course.id, "name", e.target.value)}
                                />
                              </td>
                              <td className={styles.colCredits}>
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  max="20"
                                  className={`${styles.textInput} ${styles.creditsInput}`}
                                  placeholder="e.g. 3"
                                  value={course.credits}
                                  onChange={(e) => updateCourse(sem.id, course.id, "credits", e.target.value)}
                                />
                              </td>
                              <td className={styles.colGrade}>
                                {renderGradeInput(sem.id, course)}
                              </td>
                              <td className={styles.colAction}>
                                <button
                                  type="button"
                                  className={styles.deleteBtn}
                                  onClick={() => removeCourseFromSemester(sem.id, course.id)}
                                  title="Delete course row"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Semester Footer: Add Course Button */}
                    <div className={styles.semesterFooter}>
                      <button
                        type="button"
                        className={styles.addCourseBtn}
                        onClick={() => addCourseToSemester(sem.id)}
                      >
                        + Add Course
                      </button>
                      {semSummary && (
                        <div style={{ fontFamily: "var(--mono)", fontSize: "11.5px", color: "var(--ink-60)" }}>
                          Quality Points: <strong>{semSummary.totalQualityPoints}</strong>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Semester Action Bar (if grouped) */}
        {isGrouped && (
          <div className={styles.addSemesterBar}>
            <button className={styles.addSemesterBtn} onClick={addSemester}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Another Semester</span>
            </button>
          </div>
        )}

        {/* Live Cumulative Summary Hero Bar */}
        <div className={styles.resultsSummary}>
          <div className={styles.heroGpaStat}>
            <span className={styles.heroGpaLabel}>Cumulative GPA</span>
            <div className={styles.heroGpaVal}>
              <span>{cumulativeResult.cumulativeGpa !== null ? cumulativeResult.cumulativeGpa.toFixed(2) : "—"}</span>
              <span className={styles.heroGpaScale}>/ 4.0 scale</span>
            </div>
            <div
              className={`${styles.standingBadge} ${
                cumulativeResult.standing.color === "green"
                  ? styles.green
                  : cumulativeResult.standing.color === "green-light"
                  ? styles.greenLight
                  : cumulativeResult.standing.color === "amber"
                  ? styles.amber
                  : styles.red
              }`}
            >
              {cumulativeResult.standing.label}
            </div>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Credits</span>
            <span className={styles.statValue}>
              {cumulativeResult.totalGpaCredits > 0 ? cumulativeResult.totalGpaCredits : "0"}
            </span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Quality Points</span>
            <span className={styles.statValue}>
              {cumulativeResult.totalQualityPoints > 0 ? cumulativeResult.totalQualityPoints : "0"}
            </span>
          </div>

          <div className={styles.summaryActions}>
            <button className={styles.shareBtn} onClick={handleCopyShareLink}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span>Share GPA</span>
            </button>
            <button className={styles.saveBtn} onClick={() => setIsSaveModalOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Save Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* GPA Target Planning Calculator Card */}
      <div className={styles.plannerCard}>
        <div className={styles.plannerHeader} onClick={() => setIsPlannerOpen(!isPlannerOpen)}>
          <div className={styles.plannerHeaderTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 6 12 12 16 14" />
            </svg>
            <h3>Target GPA Planning Calculator</h3>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--ink-60)" }}>
            {isPlannerOpen ? "Collapse ▲" : "Expand ▼"}
          </div>
        </div>

        {isPlannerOpen && (
          <div className={styles.plannerBody}>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)", margin: 0 }}>
              Determine the exact grade point average you need to maintain over your upcoming semesters to hit your graduation or Dean&apos;s List target.
            </p>

            <div className={styles.plannerGrid}>
              <div className={styles.plannerField}>
                <label>Current Cumulative GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.33"
                  value={currentStandingGPA.toFixed(2)}
                  disabled
                  title="Automatically synced from your calculator standing above"
                  style={{ background: "rgba(20, 23, 31, 0.05)", cursor: "not-allowed" }}
                />
              </div>

              <div className={styles.plannerField}>
                <label>Target Cumulative GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.33"
                  value={targetGPA}
                  onChange={(e) => setTargetGPA(e.target.value)}
                />
              </div>

              <div className={styles.plannerField}>
                <label>Current Credits Earned</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={currentCompletedCredits}
                  disabled
                  title="Automatically synced from your calculator credits above"
                  style={{ background: "rgba(20, 23, 31, 0.05)", cursor: "not-allowed" }}
                />
              </div>

              <div className={styles.plannerField}>
                <label>Additional Credits Planned</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={additionalCredits}
                  onChange={(e) => setAdditionalCredits(e.target.value)}
                />
              </div>
            </div>

            {/* Target Feasibility Status Result Box */}
            {plannerResult && (
              <div
                className={`${styles.plannerResultBox} ${
                  plannerResult.badgeColor === "green"
                    ? styles.green
                    : plannerResult.badgeColor === "green-light"
                    ? styles.greenLight
                    : plannerResult.badgeColor === "amber"
                    ? styles.amber
                    : styles.red
                }`}
              >
                <div className={styles.plannerResultIcon}>
                  {plannerResult.requiredGPA !== null ? plannerResult.requiredGPA.toFixed(2) : "!"}
                </div>
                <div className={styles.plannerResultContent}>
                  <div className={styles.plannerResultTitle}>
                    {plannerResult.requiredGPA !== null
                      ? `Required Future GPA: ${plannerResult.requiredGPA.toFixed(2)}`
                      : "Invalid Parameters"}
                  </div>
                  <div className={styles.plannerResultMsg}>{plannerResult.message}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
