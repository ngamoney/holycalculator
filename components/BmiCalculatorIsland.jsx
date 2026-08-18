"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./BmiCalculatorIsland.module.css";
import { calculateBmi, encodeBmiState, decodeBmiState } from "@/lib/calculations/bmiMath";

const STORAGE_KEY = "holycalc_bmi_history";

export default function BmiCalculatorIsland() {
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

  // Custom unit fields for "Other" tab
  const [heightUnit, setHeightUnit] = useState("cm"); // "cm" | "m" | "in" | "ft"
  const [weightUnit, setWeightUnit] = useState("kg"); // "kg" | "lbs" | "st"
  const [customHeight, setCustomHeight] = useState("178");
  const [customWeight, setCustomWeight] = useState("72");

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Parse URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlState = decodeBmiState(window.location.search);
    if (urlState) {
      if (urlState.unit) setUnit(urlState.unit);
      if (urlState.gender) setGender(urlState.gender);
      if (urlState.age) setAge(urlState.age);
      if (urlState.heightFt) setHeightFt(urlState.heightFt);
      if (urlState.heightIn) setHeightIn(urlState.heightIn);
      if (urlState.heightCm) setHeightCm(urlState.heightCm);
      if (urlState.weightLbs) setWeightLbs(urlState.weightLbs);
      if (urlState.weightKg) setWeightKg(urlState.weightKg);
    }

    // Load history
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Compute BMI function
  const runCalculation = useCallback(() => {
    let calcParams = {
      unit,
      age,
      gender,
    };

    if (unit === "us") {
      calcParams.heightFt = heightFt;
      calcParams.heightIn = heightIn;
      calcParams.weightLbs = weightLbs;
    } else if (unit === "metric") {
      calcParams.heightCm = heightCm;
      calcParams.weightKg = weightKg;
    } else {
      // "other" custom conversion
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

    const res = calculateBmi(calcParams);
    setResult(res);

    // Save to history if valid result
    if (res && typeof window !== "undefined") {
      const item = {
        id: Date.now(),
        date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        bmi: res.bmi,
        label: res.categoryInfo.headlineLabel,
        unit: res.inputs.unit,
      };

      setHistory((prev) => {
        const filtered = prev.filter((h) => Math.abs(h.bmi - res.bmi) > 0.05);
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
  ]);

  // Debounced calculation
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runCalculation();
    }, 200);
    return () => clearTimeout(timerRef.current);
  }, [runCalculation]);

  // Handle Tab Change
  const handleTabChange = (newUnit) => {
    setUnit(newUnit);
    // Sync equivalent values across tabs
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

  // Share handler
  const handleShare = () => {
    if (typeof window === "undefined") return;
    const search = encodeBmiState({
      unit,
      gender,
      age,
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

  // SVG Gauge Marker Position Calculation
  // Scale range: BMI 12 to 42 (mapped to SVG X coordinates 10 to 390)
  const getMarkerX = (bmiVal) => {
    const minBmi = 12;
    const maxBmi = 42;
    const clamped = Math.max(minBmi, Math.min(maxBmi, bmiVal));
    const percent = (clamped - minBmi) / (maxBmi - minBmi);
    return 10 + percent * 380;
  };

  return (
    <div className={styles.islandCard}>
      {/* Unit Selector Tabs */}
      <div className={styles.tabGroup} role="tablist" aria-label="BMI Unit Systems">
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
          <label htmlFor="bmi-age-input" className={styles.fieldLabel}>
            Age <span className={styles.subText}>(2–120 years)</span>
          </label>
          <input
            id="bmi-age-input"
            type="number"
            min="2"
            max="120"
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
                id="bmi-height-ft"
                type="number"
                min="0"
                max="8"
                placeholder="Feet"
                aria-label="Height in feet"
                className={styles.inputControl}
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
              />
              <input
                id="bmi-height-in"
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
            <label htmlFor="bmi-height-cm" className={styles.fieldLabel}>Height (cm)</label>
            <input
              id="bmi-height-cm"
              type="number"
              min="50"
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
            <label htmlFor="bmi-weight-lbs" className={styles.fieldLabel}>Weight (lbs)</label>
            <input
              id="bmi-weight-lbs"
              type="number"
              min="10"
              max="1000"
              className={styles.inputControl}
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
            />
          </div>
        )}

        {unit === "metric" && (
          <div className={styles.fieldGroup}>
            <label htmlFor="bmi-weight-kg" className={styles.fieldLabel}>Weight (kg)</label>
            <input
              id="bmi-weight-kg"
              type="number"
              min="5"
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

      {/* Primary Result Display */}
      {result && (
        <div className={styles.resultBox}>
          <div className={styles.headlineRow}>
            <div className={styles.bmiValue}>
              BMI = {result.bmi.toFixed(1)} <span>kg/m²</span>
            </div>
            <div
              className={styles.badge}
              style={{ background: result.categoryInfo.color }}
            >
              {result.categoryInfo.headlineLabel}
            </div>
          </div>

          {!result.categoryInfo.isPediatric && (
            <div className={styles.subclassNote}>
              WHO Subclass: <strong>{result.categoryInfo.subclassLabel}</strong>
            </div>
          )}

          {/* SVG Visual Gauge Bar */}
          <div className={styles.gaugeContainer}>
            <div className={styles.gaugeHeader}>
              <span>BMI Visual Scale</span>
              <span>18.5 (Normal) / 25.0 (Overweight) / 30.0 (Obese)</span>
            </div>

            <svg
              className={styles.svgGauge}
              viewBox="0 0 400 48"
              aria-label={`BMI scale marker at ${result.bmi}`}
            >
              {/* Scale Background Bands */}
              {/* Underweight: 12 to 18.5 (X: 10 to 92.3) */}
              <rect x="10" y="8" width="82.3" height="16" rx="4" fill="#3B82F6" opacity="0.85" />
              {/* Normal: 18.5 to 25.0 (X: 92.3 to 174.6) */}
              <rect x="94.3" y="8" width="82.3" height="16" fill="#4F7A5B" opacity="0.9" />
              {/* Overweight: 25.0 to 30.0 (X: 174.6 to 238) */}
              <rect x="178.6" y="8" width="63.4" height="16" fill="#C9992F" opacity="0.9" />
              {/* Obese: 30.0 to 42 (X: 238 to 390) */}
              <rect x="244" y="8" width="146" height="16" rx="4" fill="#D32F2F" opacity="0.9" />

              {/* Boundary Ticks & Text */}
              <text x="10" y="38" fontSize="10" fill="#5C5F6B" fontFamily="var(--mono)">12</text>
              <text x="94" y="38" fontSize="10" fill="#5C5F6B" fontFamily="var(--mono)">18.5</text>
              <text x="178" y="38" fontSize="10" fill="#5C5F6B" fontFamily="var(--mono)">25.0</text>
              <text x="244" y="38" fontSize="10" fill="#5C5F6B" fontFamily="var(--mono)">30.0</text>
              <text x="375" y="38" fontSize="10" fill="#5C5F6B" fontFamily="var(--mono)">40+</text>

              {/* Marker Needle / Triangle */}
              <g transform={`translate(${getMarkerX(result.bmi)}, 0)`}>
                <polygon points="0,0 -7,-8 7,-8" fill="#14171F" />
                <line x1="0" y1="-8" x2="0" y2="28" stroke="#14171F" strokeWidth="2" strokeDasharray="2 2" />
                <circle cx="0" cy="16" r="4" fill="#14171F" stroke="#FDFCF8" strokeWidth="1.5" />
              </g>
            </svg>
          </div>

          {/* Callout Cards Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricTitle}>Healthy Weight Range</span>
              <span className={styles.metricVal}>{result.healthyWeight.text}</span>
              <span className={styles.metricSub}>For height ({result.inputs.unit === "metric" ? `${result.inputs.heightCm} cm` : `${heightFt}'${heightIn}"`})</span>
            </div>

            <div className={styles.metricItem}>
              <span className={styles.metricTitle}>BMI Prime</span>
              <span className={styles.metricVal}>{result.bmiPrime.toFixed(2)}</span>
              <span className={styles.metricSub}>Normal: 0.74 – 0.99</span>
            </div>

            <div className={styles.metricItem}>
              <span className={styles.metricTitle}>Ponderal Index</span>
              <span className={styles.metricVal}>{result.ponderalIndex.toFixed(1)} <small style={{ fontSize: "11px" }}>kg/m³</small></span>
              <span className={styles.metricSub}>Normal: 11 – 15 kg/m³</span>
            </div>
          </div>

          {/* Pediatric Note for Age < 20 */}
          {result.categoryInfo.isPediatric && (
            <div className={styles.pediatricNotice}>
              <span style={{ fontSize: "18px" }}>ℹ️</span>
              <div>
                <strong>Pediatric Growth Chart Note (Age {age}):</strong> For children and teens under 20, BMI is evaluated using age- and sex-specific CDC percentiles. Calculated CDC percentile: <strong>{result.categoryInfo.percentile}%</strong>. Always consult a pediatrician for growth trajectory evaluations.
              </div>
            </div>
          )}

          {/* Screening Tool Disclaimer */}
          <div className={styles.disclaimerNotice}>
            <strong>Clinical Disclaimer:</strong> BMI is a general population screening tool, not a diagnostic test. It does not measure body fat directly and does not distinguish between muscle mass, bone density, or fat distribution. Consult a medical professional for personalized health assessments.
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
            <span>Recent Calculations (localStorage)</span>
            <button type="button" className={styles.clearBtn} onClick={clearHistory}>
              Clear History
            </button>
          </div>
          <ul className={styles.historyList}>
            {history.map((h) => (
              <li key={h.id} className={styles.historyItem}>
                <span>{h.date} — BMI <strong>{h.bmi.toFixed(1)}</strong> ({h.label})</span>
                <span style={{ color: "var(--ink-60)", textTransform: "uppercase" }}>{h.unit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
