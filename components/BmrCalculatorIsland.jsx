"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./BmrCalculatorIsland.module.css";
import { calculateBmr, encodeBmrState, decodeBmrState } from "@/lib/calculations/bmrMath";

const STORAGE_KEY = "holycalc_bmr_history";

export default function BmrCalculatorIsland() {
  const [unit, setUnit] = useState("us"); // "us" | "metric" | "other"
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("male");

  // US fields
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("10");
  const [weightLbs, setWeightLbs] = useState("160");

  // Metric fields
  const [heightCm, setHeightCm] = useState("178");
  const [weightKg, setWeightKg] = useState("72");

  // Other units fields
  const [customHeight, setCustomHeight] = useState("178");
  const [customWeight, setCustomWeight] = useState("72");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [formula, setFormula] = useState("mifflin"); // "mifflin" | "harris" | "katch"
  const [bodyFatPct, setBodyFatPct] = useState("18");
  const [resultUnit, setResultUnit] = useState("cal"); // "cal" | "kj"

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Parse URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlState = decodeBmrState(window.location.search);
    if (urlState) {
      if (urlState.unit) setUnit(urlState.unit);
      if (urlState.gender) setGender(urlState.gender);
      if (urlState.age) setAge(urlState.age);
      if (urlState.heightFt) setHeightFt(urlState.heightFt);
      if (urlState.heightIn) setHeightIn(urlState.heightIn);
      if (urlState.heightCm) setHeightCm(urlState.heightCm);
      if (urlState.weightLbs) setWeightLbs(urlState.weightLbs);
      if (urlState.weightKg) setWeightKg(urlState.weightKg);
      if (urlState.formula) {
        setFormula(urlState.formula);
        setShowSettings(true);
      }
      if (urlState.bodyFatPct) setBodyFatPct(urlState.bodyFatPct);
      if (urlState.resultUnit) setResultUnit(urlState.resultUnit);
    }

    // Load history
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Compute BMR
  const runCalculation = useCallback(() => {
    let calcParams = {
      unit,
      age,
      gender,
      formula,
      bodyFatPct,
      resultUnit,
    };

    if (unit === "us") {
      calcParams.heightFt = heightFt;
      calcParams.heightIn = heightIn;
      calcParams.weightLbs = weightLbs;
    } else if (unit === "metric") {
      calcParams.heightCm = heightCm;
      calcParams.weightKg = weightKg;
    } else {
      let cm = parseFloat(customHeight) || 0;
      if (heightUnit === "m") cm = cm * 100;
      if (heightUnit === "in") cm = cm * 2.54;
      if (heightUnit === "ft") cm = cm * 30.48;

      let kg = parseFloat(customWeight) || 0;
      if (weightUnit === "lbs") kg = kg * 0.453592;
      if (weightUnit === "st") kg = kg * 6.35029;

      calcParams.heightCm = cm;
      calcParams.weightKg = kg;
    }

    const res = calculateBmr(calcParams);
    setResult(res);

    // Save history
    if (res && typeof window !== "undefined") {
      const item = {
        id: Date.now(),
        date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        bmr: res.displayBmr,
        formulaName: res.formulaName,
        unit: res.resultUnit === "kj" ? "kJ" : "kcal",
      };

      setHistory((prev) => {
        const filtered = prev.filter((h) => Math.abs(h.bmr - res.displayBmr) > 2);
        const updated = [item, ...filtered].slice(0, 5);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }
  }, [
    unit,
    age,
    gender,
    heightFt,
    heightIn,
    weightLbs,
    heightCm,
    weightKg,
    customHeight,
    customWeight,
    heightUnit,
    weightUnit,
    formula,
    bodyFatPct,
    resultUnit,
  ]);

  // Debounce
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runCalculation();
    }, 200);
    return () => clearTimeout(timerRef.current);
  }, [runCalculation]);

  const handleTabChange = (newUnit) => {
    setUnit(newUnit);
    if (newUnit === "metric" && heightFt && weightLbs) {
      const totalIn = parseFloat(heightFt) * 12 + (parseFloat(heightIn) || 0);
      setHeightCm(Math.round(totalIn * 2.54).toString());
      setWeightKg(Math.round((parseFloat(weightLbs) || 0) * 0.453592).toString());
    } else if (newUnit === "us" && heightCm && weightKg) {
      const totalIn = (parseFloat(heightCm) || 0) / 2.54;
      setHeightFt(Math.floor(totalIn / 12).toString());
      setHeightIn(Math.round(totalIn % 12).toString());
      setWeightLbs(Math.round((parseFloat(weightKg) || 0) / 0.453592).toString());
    }
  };

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const search = encodeBmrState({
      unit,
      gender,
      age,
      formula,
      bodyFatPct,
      resultUnit,
      heightFt,
      heightIn,
      heightCm,
      weightLbs,
      weightKg,
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
      {/* Unit Selector Tabs */}
      <div className={styles.tabGroup} role="tablist" aria-label="BMR Unit Systems">
        <button
          role="tab"
          aria-selected={unit === "us"}
          className={`${styles.tabBtn} ${unit === "us" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("us")}
        >
          US Customary (ft/in, lbs)
        </button>
        <button
          role="tab"
          aria-selected={unit === "metric"}
          className={`${styles.tabBtn} ${unit === "metric" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("metric")}
        >
          Metric (cm, kg)
        </button>
        <button
          role="tab"
          aria-selected={unit === "other"}
          className={`${styles.tabBtn} ${unit === "other" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("other")}
        >
          Other Units
        </button>
      </div>

      {/* Input Form */}
      <div className={styles.formGrid}>
        {/* Gender selector */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Biological Sex</label>
          <div className={styles.genderSelector}>
            <button
              type="button"
              className={`${styles.genderBtn} ${gender === "male" ? styles.genderBtnActive : ""}`}
              onClick={() => setGender("male")}
            >
              ♂ Male
            </button>
            <button
              type="button"
              className={`${styles.genderBtn} ${gender === "female" ? styles.genderBtnActive : ""}`}
              onClick={() => setGender("female")}
            >
              ♀ Female
            </button>
          </div>
        </div>

        {/* Age field */}
        <div className={styles.fieldGroup}>
          <label htmlFor="bmr-age-input" className={styles.fieldLabel}>
            Age <span className={styles.subText}>(15–80 years)</span>
          </label>
          <input
            id="bmr-age-input"
            type="number"
            min="15"
            max="80"
            className={styles.inputControl}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        {/* Height fields */}
        {unit === "us" && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Height</label>
            <div className={styles.twoInputs}>
              <input
                id="bmr-height-ft"
                type="number"
                min="3"
                max="8"
                placeholder="Feet"
                aria-label="Height in feet"
                className={styles.inputControl}
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
              />
              <input
                id="bmr-height-in"
                type="number"
                min="0"
                max="11"
                placeholder="Inches"
                aria-label="Height in inches"
                className={styles.inputControl}
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
              />
            </div>
          </div>
        )}

        {unit === "metric" && (
          <div className={styles.fieldGroup}>
            <label htmlFor="bmr-height-cm" className={styles.fieldLabel}>Height (cm)</label>
            <input
              id="bmr-height-cm"
              type="number"
              min="100"
              max="275"
              className={styles.inputControl}
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
            />
          </div>
        )}

        {unit === "other" && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Height</label>
            <div className={styles.twoInputs}>
              <input
                type="number"
                step="any"
                className={styles.inputControl}
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
              />
              <select
                className={styles.inputControl}
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
              >
                <option value="cm">cm</option>
                <option value="m">m</option>
                <option value="in">in</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </div>
        )}

        {/* Weight fields */}
        {unit === "us" && (
          <div className={styles.fieldGroup}>
            <label htmlFor="bmr-weight-lbs" className={styles.fieldLabel}>Weight (lbs)</label>
            <input
              id="bmr-weight-lbs"
              type="number"
              min="50"
              max="1000"
              className={styles.inputControl}
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
            />
          </div>
        )}

        {unit === "metric" && (
          <div className={styles.fieldGroup}>
            <label htmlFor="bmr-weight-kg" className={styles.fieldLabel}>Weight (kg)</label>
            <input
              id="bmr-weight-kg"
              type="number"
              min="20"
              max="500"
              className={styles.inputControl}
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
          </div>
        )}

        {unit === "other" && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Weight</label>
            <div className={styles.twoInputs}>
              <input
                type="number"
                step="any"
                className={styles.inputControl}
                value={customWeight}
                onChange={(e) => setCustomWeight(e.target.value)}
              />
              <select
                className={styles.inputControl}
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="st">stone</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible "+ Settings" Panel */}
      <button
        type="button"
        className={styles.settingsToggle}
        onClick={() => setShowSettings(!showSettings)}
      >
        <span>⚙️ Formula &amp; Unit Settings ({formula === "mifflin" ? "Mifflin-St Jeor" : formula === "harris" ? "Harris-Benedict" : "Katch-McArdle"})</span>
        <span>{showSettings ? "▲ Hide" : "▼ + Settings"}</span>
      </button>

      {showSettings && (
        <div className={styles.settingsPanel}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>BMR Formula</label>
            <select
              className={styles.inputControl}
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
            >
              <option value="mifflin">Mifflin-St Jeor (Consensus Default)</option>
              <option value="harris">Revised Harris-Benedict (Classic)</option>
              <option value="katch">Katch-McArdle (Requires Body Fat %)</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Energy Output Unit</label>
            <select
              className={styles.inputControl}
              value={resultUnit}
              onChange={(e) => setResultUnit(e.target.value)}
            >
              <option value="cal">Calories / day (kcal)</option>
              <option value="kj">Kilojoules / day (kJ)</option>
            </select>
          </div>

          {/* Progressive disclosure for Katch-McArdle */}
          {formula === "katch" && (
            <div className={styles.fieldGroup} style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="bmr-body-fat" className={styles.fieldLabel}>
                Body Fat Percentage <span className={styles.subText}>(1–60%)</span>
              </label>
              <input
                id="bmr-body-fat"
                type="number"
                min="1"
                max="60"
                step="0.5"
                className={styles.inputControl}
                value={bodyFatPct}
                onChange={(e) => setBodyFatPct(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* Primary Result Display */}
      {result && (
        <div className={styles.resultBox}>
          <div className={styles.headlineRow}>
            <div>
              <div style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--ink-60)", textTransform: "uppercase" }}>
                Basal Metabolic Rate (BMR)
              </div>
              <div className={styles.bmrValue}>
                {result.displayBmr.toLocaleString()} <span>{result.displayUnit}</span>
              </div>
            </div>
            <div className={styles.badge}>
              {result.formulaName}
            </div>
          </div>

          {/* Activity Maintenance Table */}
          <div className={styles.activityTableContainer}>
            <div className={styles.activityTableTitle}>
              <span>Daily Calorie Needs by Activity Level</span>
              <span style={{ fontSize: "11px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>BMR × Multiplier</span>
            </div>
            <table className={styles.actTable}>
              <thead>
                <tr>
                  <th>Activity Level</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Daily Requirement</th>
                </tr>
              </thead>
              <tbody>
                {result.activityBreakdown.map((act) => (
                  <tr key={act.id}>
                    <td><strong>{act.label}</strong></td>
                    <td>{act.description}</td>
                    <td className={styles.actVal}>
                      {act.displayValue.toLocaleString()} {result.resultUnit === "kj" ? "kJ" : "Cal"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clinical Disclaimer */}
          <div className={styles.disclaimerNotice}>
            <strong>Clinical Disclaimer:</strong> BMR represents estimated basal energy expenditure at rest based on mathematical population models. Individual metabolic rate varies according to lean muscle mass, hormonal status, and genetic factors. Precision measurement requires laboratory indirect calorimetry.
          </div>

          {/* Actions Bar */}
          <div className={styles.actionsBar}>
            <button type="button" className={styles.shareBtn} onClick={handleShare}>
              🔗 {copied ? "Link Copied!" : "Share Results"}
            </button>
            <span style={{ fontSize: "12px", color: "var(--ink-60)", fontFamily: "var(--mono)" }}>
              Instant Auto-Calculated
            </span>
          </div>
        </div>
      )}

      {/* History Log */}
      {history.length > 0 && (
        <div className={styles.historyBox}>
          <div className={styles.historyTitle}>
            <span>Recent BMR Calculations (localStorage)</span>
            <button type="button" className={styles.clearBtn} onClick={clearHistory}>
              Clear History
            </button>
          </div>
          <ul className={styles.historyList}>
            {history.map((h) => (
              <li key={h.id} className={styles.historyItem}>
                <span>{h.date} — <strong>{h.bmr.toLocaleString()} {h.unit}/day</strong> ({h.formulaName})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
